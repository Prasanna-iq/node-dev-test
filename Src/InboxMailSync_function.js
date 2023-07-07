const axios = require("axios");
const { google } = require("googleapis");
const msal = require("@azure/msal-node");
const CryptoJS = require("crypto-js");
const key = CryptoJS.enc.Utf8.parse("OtoA81sslqdpdGZ6");
const iv = CryptoJS.enc.Utf8.parse("OtoA81sslqdpdGZ6");
const {parseJWTToken} = require('../Src/auth_layerfunction');
const db = require('../Src/dbcommon_layerfunction');
const secret_id = process.env.DB_SECRET_ID;

//getGoogleSync: async (code,userid) => {
exports.getInboxOauthGmailToken= async (event,context,callback) => {  
  let response;
try
  {
  const secret_mannager = new AWS.SecretsManager();
  const secret = await secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
  const dbCredentials = JSON.parse(secret.SecretString);

  const body = JSON.parse(event.body);
  const code = JSON.stringify(body.code);    
  const userid = JSON.stringify(body.userid);    

  const oauth2Client = new google.auth.OAuth2({
    clientId: dbCredentials.GoogleclientId,
    clientSecret: dbCredentials.GoogleclientSecret,
    redirectUri: dbCredentials.apiUrl,
    scopes: [
      "email profile https://www.googleapis.com/auth/userinfo.email  https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/gmail.modify  https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/contacts.readonly",
    ],
  });
  const { tokens } = await oauth2Client.getToken(code);
  await oauth2Client.setCredentials(tokens);
  const tokenInfo = await oauth2Client.getTokenInfo(
    oauth2Client.credentials.access_token
  );
  let userTokenObj = new Object();
  userTokenObj.tokenInfo = tokens;
  const tokendec = parseJWTToken(tokens);
  userTokenObj.emailaddress = db.encryptId(tokendec["email"]);
  userTokenObj.emailtype = 1;
  userTokenObj.access_token = tokenInfo?.access_Token;
  userTokenObj.refresh_token = tokenInfo?.refresh_Token;
  userTokenObj.userid = userid;
  const res = addinboxsettings(userTokenObj);
  response=db.generate_out_put_response(res, "Success", 200);
  return response;
}
catch (error) {
  response = db.generate_out_put_response(error, "Error", 400);
  return response;
}
};
  //getOutlookSync: async (code, userid) => {
  exports.getInboxOauthMsToken= async (event,context,callback) => {
    let response;
    try {
      const body = JSON.parse(event.body);
      const code = JSON.stringify(body.code);    
      const userid = JSON.stringify(body.userid);    
      
      const config = {
        auth: {
          clientId: dbCredentials.MSclientid,
          authority: dbCredentials.MSauthority,
          clientSecret: dbCredentials.MSclientSecret,
        },
        system: {
          loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
              // console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
          },
        },
      };
      const pca = new msal.ConfidentialClientApplication(config);
      const tokenRequest = {
        code: code,
        scopes: [
          "Mail.ReadWrite",
          "MailboxSettings.ReadWrite",
          "Contacts.ReadWrite",
        ],
        redirectUri: dbCredentials.localSite + "/msAuthComplete.html",
        accessType: "offline",
      };
      await pca
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
          const accessToken = response.accessToken;
          const refreshToken = () => {
            const tokenCache = pca.getTokenCache().serialize();
            const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
            const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
            return refreshToken;
          };
          const tokens = {
            access_token: accessToken,
            refresh_token: refreshToken(),
            account: response.account,
            emailtype: 2,
            emailaddress:db.encryptId(response.account.username),
            userid: userid
          };

          const res = addinboxsettings(userTokenObj);
          response=db.generate_out_put_response(res, "Success", 200);
          return response;
        })
        .catch((error) => {
          response = db.generate_out_put_response(error, "Error", 400);
      return response;
        });
      //return msTokenResponse;
    } catch (error) {
      response = db.generate_out_put_response(error, "Error", 400);
      return response;
    }
  };

    /// Add/Update Inbox Settings
  function addinboxsettings (reqtoken)
    {
        try
        {
            const userid=reqtoken?.userid;        // from token
            const emailtype = reqtoken?.emailtype; // from body
            const emailaddress = reqtoken?.emailaddress;
            const access_token = reqtoken?.access_token;
            const refresh_token = reqtoken?.refresh_token; 
            db.getDataReturnValue('func_insert_inbox_settings',[Number(userid),Number(emailtype),emailaddress,access_token,refresh_token])
            .then(data => {
                return true;
            }          
            ) 
            .catch(error => {
                return false;
            });
        }
        catch (error) {
          return false;
        }

    };