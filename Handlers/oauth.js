const axios  = require('axios');
const {google}  = require('googleapis');
const pkg  = require('@azure/msal-node');
const CryptoJS  = require("crypto-js");
const appConfig  = require("../Configuration/app.js");
const oAuthConig  = require("../Configuration/oAuth.js");

const key = CryptoJS.enc.Utf8.parse("OtoA81sslqdpdGZ6");
const iv = CryptoJS.enc.Utf8.parse("OtoA81sslqdpdGZ6");
const msal = pkg
const oAuthHandler = {
 encryptId: (str) => {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(str),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  },
   OauthLogin: async(email, passwordToken)=>{
        try {
          let systemInfo = new Object();
           // systemInfo = await getSystemInfo();
           systemInfo.browser= "Chrome";
            const userResponse = await axios.post(
                `${appConfig.appConfig.apiUrl}Authenticate/authenticate`,
                {
                    emailaddress: oAuthHandler.encryptId(email[0].value.toLowerCase()),
                    password:passwordToken,
                    logintype:2,
                    fcm_token:"",
                    logininfo:JSON.stringify(systemInfo),
                }
              );
              return {status:true, res:userResponse}
            } catch (error) {
              return {status:false, res:error.message}
            } 
    },
    getGoogleOauthTokens: async(code)=>{
        const oauth2Client = new google.auth.OAuth2({
            clientId:oAuthConig.GoogleConfig.clientId,
            clientSecret:oAuthConig.GoogleConfig.clientSecret,
            redirectUri: appConfig.appConfig.localSite,
            scopes:['email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/docs https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly']
        });
          const {tokens} = await oauth2Client.getToken(code);
          await oauth2Client.setCredentials(tokens);
          const tokenInfo = await oauth2Client.getTokenInfo(
            oauth2Client.credentials.access_token
          );
        let userTokenObj = new Object();
        userTokenObj.tokenInfo = tokens;
        userTokenObj.email= tokenInfo?.email;
        return userTokenObj;
    },
    getMSOauthTokens: async(code)=>{
  try {
    const config = {
      auth: {
          clientId: "11f3f317-c500-4cc9-88c1-4da591df06ce",
          authority: "https://login.microsoftonline.com/common",
          clientSecret: "yJy8Q~QQC0k1f0oFzjBMJbL9Tg1KNwdu52a2JbAe"
      },
      system: {
          loggerOptions: {
              loggerCallback(loglevel, message, containsPii) {
                  console.log(message);
              },
              piiLoggingEnabled: false,
              logLevel: msal.LogLevel.Verbose,
          }
      }
  };

  const pca = new msal.ConfidentialClientApplication(config);
  // "https://outlook.office.com/Mail.Read"
  const tokenRequest = {
    code: code,
    scopes: ['Mail.ReadWrite','MailboxSettings.ReadWrite','Files.Read.All','Files.ReadWrite.All','Sites.Read.All','Sites.ReadWrite.All'],
    redirectUri: appConfig.appConfig.localSite+"/msAuthComplete.html",
    accessType: 'offline',
};
const msTokenResponse = await pca.acquireTokenByCode(tokenRequest).then((response) => {
    const accessToken = response.accessToken;
    const refreshToken = () => {
        const tokenCache = pca.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
        return refreshToken;
    }
    const tokens = {
        accessToken,
        refreshToken:refreshToken(),
        account: response.account
    }
    console.log(tokens)
    return tokens;
}).catch((error) => {
    console.log(error);
    const tokens = {
      accessToken:"",
      refreshToken:"",
      account: "",
      error:error.message
  }
  return tokens;
});
return msTokenResponse;
  }
  catch (error) {
    console.log(error);
  }
}
 
}


module.exports= oAuthHandler;