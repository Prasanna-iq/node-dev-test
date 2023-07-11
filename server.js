const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const OutlookStrategy = require("passport-outlook");
const GoogleStrategy = require("passport-google-oauth2");
const session = require("express-session");
const oAuthHandler = require("./Handlers/oauth.js");
const MLHandler = require("./Handlers/mlcropimg.js");
const oAuthConig = require("./Configuration/oAuth.js");
const appConfig = require("./Configuration/app.js");
const https = require("https");
const fs = require("fs");
const db = require("./Dbconnection/connection.js");
const jwt = require("jsonwebtoken");
// import myiq_route from './Src/routes.js';
const myiq_route = require('./Src/routes');

const app = express();
let msLoginToken = "";
let googleLoginToken = "";
const OutlookStrategyDetail = OutlookStrategy.Strategy;
const GoogleStrategyDetail = GoogleStrategy.Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new OutlookStrategyDetail(
    {
      clientID: oAuthConig.MSConfig.clientId,
      callbackURL: oAuthConig.MSConfig.callbackURL,
      clientSecret: oAuthConig.MSConfig.clientSecret,
    },
    function (accessToken, refreshToken, profile, done) {
      msLoginToken = accessToken;
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

passport.use(
  new GoogleStrategyDetail(
    {
      clientID: oAuthConig.GoogleConfig.clientId,
      clientSecret: oAuthConig.GoogleConfig.clientSecret,
      callbackURL: oAuthConig.GoogleConfig.callbackURL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      googleLoginToken = accessToken;
      const getUserDetails = {
        access_token: accessToken,
        refresh_token: refreshToken,
        profile: profile,
      };
      return done(null, getUserDetails);
    }
  )
);

//Router
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", myiq_route);

app.listen(80, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(process.env.NODE_ENV);
    console.log("server running at port 4000");
  }
});
// const options ={
//   key:fs.readFileSync('/root/cert/key.pem'),
//   cert:fs.readFileSync('/root/cert/cert.pem')
// }
// https.createServer(options, app).listen(4000, function(){
//   console.log("Express server listening on port " + 4000);
// });

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify("MyIQ.AI api service is running on dev and it works with the CICD!!!"));
  res.end();
});

app.get(
  "/auth/outlook",
  passport.authenticate("windowslive", {
    scope: [
      "openid",
      "profile",
      "offline_access",
      "https://outlook.office.com/Mail.Read",
    ],
  }),
  function (req, res) {
    console.log(res);
  }
);

app.get(
  "/mslogin",
  passport.authenticate("windowslive", { failureRedirect: "/" }),
  async function (req, res) {
    const email = req?.user?.emails;
    const userResponse = await oAuthHandler.OauthLogin(email, msLoginToken);
    if (userResponse.status && userResponse?.res?.data) {
      res.redirect(
        appConfig.appConfig.localSite +
          "/oAuth-login?user=" +
          oAuthHandler.encryptId(email[0].value.toLowerCase())
      );
      res.end();
    } else {
      res.redirect(appConfig.appConfig.localSite + "/oAuth-error");
    }
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    // 'https://www.googleapis.com/auth/gmail.readonly'
    scope: ["profile", "https://www.googleapis.com/auth/userinfo.email"],
    accessType: "offline",
    prompt: "consent",
  }),
  function (req, res) {
    console.log(res);
  }
);

app.get(
  "/auth/gmailconfiguration",
  passport.authenticate("google", {
    // 'https://www.googleapis.com/auth/gmail.readonly'
    scope: [
      "profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  }),
  function (req, res) {
    console.log(res);
  }
);

app.get(
  "/googleLogin",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  async function (req, res) {
    const email = req?.user?.profile?.emails;
    const userResponse = await oAuthHandler.OauthLogin(email, googleLoginToken);
    if (userResponse.status && userResponse?.res?.data) {
      res.redirect(
        appConfig.appConfig.localSite +
          "/oAuth-login?user=" +
          oAuthHandler.encryptId(email[0].value.toLowerCase())
      );
      res.end();
    } else {
      res.redirect(appConfig.appConfig.localSite + "/oAuth-error");
    }
  }
);

app.post("/invocieFileUpload", async function (req, res) {
  try {
    const imageBase64 = req?.body?.image;
    if (imageBase64) {
      const response = await MLHandler.CropImageUpload(imageBase64);
      if (response?.res?.data) {
        console.log("response?.res?.data");
        console.log(response?.res?.data);
        res.send(response?.res?.data.toString());
      } else {
        res.send();
      }
    } else {
      res.send();
    }
  } catch (ex) {
    console.log(ex.message);
    res.status(400).send();
  }
});

app.post("/getOauthGmailToken", async function (req, res) {
  try {
    const code = req?.body?.code;
    const userResponseToken = await oAuthHandler.getGoogleOauthTokens(code);
    res.send(userResponseToken);
  } catch (ex) {
    console.log(ex.message);
    res.send();
  }
});

app.post("/getOauthMsToken", async function (req, res) {
  try {
    const code = req?.body?.code;
    const userResponseToken = await oAuthHandler.getMSOauthTokens(code);
    res.send(userResponseToken);
  } catch (ex) {
    console.log(ex.message);
    res.send();
  }
});

app.get("/user-sample", async (req, res) => {
  try {
    jwt.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4MyIsInN1YiI6IkpXVCBmb3IgVXNlciBJZCA6IDE4MyIsImVtYWlsIjoicTZGZ3ZXVm42TTQ3aVhoMFRHVkdJRUlkS0JoZ2JiNi9hbDhXdVZYU2FKND0iLCJSb2xlIjoiMiIsIk9yZ19ncnAiOiI4NiIsImp0aSI6IjQ5YmYyYzcyLTZhNGEtNGM0OC1hZWVhLTk5NjllNDkwMmE1MCIsImV4cCI6MTY4MDAwMTQzMiwiaXNzIjoiSVFBSSIsImF1ZCI6IklRQUkifQ.niym-byRjmLEM3K8qYy-vtCSd5d9pbAFXLf6CtPUmso",
      "986ghgrgtru989ASdsaerew13434545435",
      (err, decoded) => {
        if (err) {
          // Handle invalid token
          console.log(err);
        } else {
          // Token is valid, use decoded data
          console.log(decoded);
        }
      }
    );
    // const bearerheader=req.headers['authorization'];
    // console.log(bearerheader);
    // //const result = await db.func('func_get_user_sample', point(1));
    // const result = await db.query('select * from test');
    // console.log('result');
    // console.log(result);
    // res.send(result);
  } catch (ex) {
    console.log(ex.mesage);
  } finally {
    //db.done();
  }
});
