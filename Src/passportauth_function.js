const db = require('./dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('./auth_layerfunction');
const passport = require("passport");
const OutlookStrategy = require("passport-outlook");
const GoogleStrategy = require("passport-google-oauth2");

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
exports.updateTaskStatus= async (event,context,callback) => {
    let response;

}
app.get("/auth/outlook",
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
  
  app.get("/mslogin",
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
  
  app.get("/auth/google",
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
  
  app.get("/auth/gmailconfiguration",
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
  
  app.get("/googleLogin",
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