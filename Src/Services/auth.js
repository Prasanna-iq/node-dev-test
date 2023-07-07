const { json } = require("express");
const jwt = require("jsonwebtoken");
const { jwtTokenKey } = require("../../Configuration/app");

const verifyToken = (req, res, next) => {

  const token =
      req.body.token || req.query.token || req.headers["authorization"] || req.headers["x-access-token"];
  if (!token) {
      throw "A token is required for authentication";
  }
  try {
      // remove Bearer if found in token
      const tok = token.replace(/^Bearer\s+/, "");
      jwt.verify(tok, jwtTokenKey.key, {
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
  return next();
};

const parseJWTToken = (req) => {

  const token =
      req.body.token || req.query.token || req.headers["authorization"] || req.headers["x-access-token"];
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