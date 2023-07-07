// const { json } = require("express");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const verifyToken = async (token) => {
  if (!token) {
      throw "A token is required for authentication";
  }
  try {
    const secret_mannager = new AWS.SecretsManager();
    const secret = await secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
    const dbCredentials = JSON.parse(secret.SecretString);

      // remove Bearer if found in token
      const tok = token.replace(/^Bearer\s+/, "");
      jwt.verify(tok, dbCredentials.jwtTokenKey, {
          algorithms: ['HS256']
        }, 
        function(err, decoded) {
          if (err) {
              throw "Invalid Token";
          }
      })
  } catch (err) {
      throw "Invalid Token";
  }
};

const parseJWTToken = (token) => {
  if (!token) {
      return;
  }
  try {
      const tok = token.replace(/^Bearer\s+/, "");
      const decoded = jwt.decode(tok);
      return decoded;

  } catch (err) {
      return;
  }
};
module.exports = {
  verifyToken,
  parseJWTToken,
};