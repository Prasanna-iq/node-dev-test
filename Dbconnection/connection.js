const pgPromise =require('pg-promise');
const appConfig =require("../Configuration/app.js");

const initOptions = {
    error(error, e) {
        if (e.cn) {
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
  };
  
  const pgp = pgPromise(initOptions);
    
  const db = pgp(appConfig.dbConfig);

//   db.connect()
//     .then(obj => {
//         obj.done(); // success, release the connection;
//         console.log("Database connected")
//     })
//     .catch(error => {
//         console.log('ERROR:', error.message || error);
//   });

module.exports = db;