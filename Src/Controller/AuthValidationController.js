const jwt = require('jsonwebtoken');

const secret_key = process.env.SECRET_KEY;

exports.handler = async (event, context, callback) => {
  try {
    const token = event.authorizationToken.split(' ');
    
    if (token[0]!= "Bearer"){
      callback('Unauthorized');
    }
    const jwt_bearer_token = token[1];
    const decodedToken = jwt.verify(jwt_bearer_token, secret_key);
    const userId = decodedToken.id;
    const policyDocument = generatePolicyDocument(userId, 'Allow', event.methodArn, decodedToken);
    callback(null, policyDocument);
  } 
  catch (error) {
    const policyDocument = generatePolicyDocument('user', 'Deny', event.methodArn, 'null');
    callback('Unauthorized');
  }
};

function generatePolicyDocument(principalId, effect, resource, decodedToken) {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  if (decodedToken) {
    authResponse.context = decodedToken;
  }
  console.log(authResponse);
  return authResponse;
}