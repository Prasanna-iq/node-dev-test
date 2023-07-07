const pgPromise =require('pg-promise');
const AWS = require("aws-sdk");
const CryptoJS =require('crypto-js');

const key = CryptoJS.enc.Utf8.parse('OtoA81sslqdpdGZ6');
const iv = CryptoJS.enc.Utf8.parse('OtoA81sslqdpdGZ6');

const secret_id = process.env.DB_SECRET_ID;

async function connectToDatabase() {
    try{
        const secret_mannager = new AWS.SecretsManager();
        const secret = await secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
        const dbCredentials = JSON.parse(secret.SecretString);

        var dbConnection = {
                                user: dbCredentials.username,
                                host: dbCredentials.host,
                                database: dbCredentials.dbInstanceIdentifier,
                                password: dbCredentials.password,
                                port: dbCredentials.port,
                            };

        const pgp = pgPromise();
    
        const db = pgp(dbConnection);
        return db;
    }
    catch(err){
        //console.error(err);
        return err.message;
    }
}
/// get Datatable with Argument
const getDataRows = async (funcname, args)=>
{
    let dbCon = connectToDatabase();
    return new Promise((resolve, reject) => {
        // call db function passing argument
        dbCon.func(funcname,args)
            .then(data => {
                resolve(data);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);
            });
        });
        
}

/// get Datatable without Argument
const getDataRowsNoArg = async (funcname)=>
{
    let dbCon = connectToDatabase();
    // call db function without argument
    return new Promise((resolve, reject) => {
        dbCon.func(funcname)
            .then(data => {
                // send the results back
                resolve(data);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);

        });
    })
}
/// get Datatable with Argument
const getDataReturnValue = async(funcname, args)=>
{
    let dbCon = connectToDatabase();
    return new Promise((resolve, reject) => {
        // call db function passing argument
        dbCon.func(funcname,args)
            .then(data => {
                // data format=[{property:prop_value}]   - return the prop_value from the list object
                resolve((data[0])[Object.keys(data[0])[0]]);
            })
            //error
            .catch(error => {
                // send error if any
                reject(error);
            });
        });
}

const generate_out_put_response = (inputObject, message="", status_code=200) =>{
	let status = true;

	if(status_code !=200){
	    status = false;
	}
    let res = {
        statusCode: status_code,
        body: JSON.stringify({
            status: status,
    		message:message,
    		response: inputObject
        })
	};
	return res;
}

const encryptId= (str) => {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), key,
    {
        keySize: 128/8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

const decryptId= (str) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(str, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted?.toString(CryptoJS.enc.Utf8);
        } catch (ex) {
        return str;
        }
};

// module.exports = encryptCommon;

module.exports = {
    getDataRows,        // get datatable with argument
    getDataRowsNoArg,    // get datatable without argument
    getDataReturnValue,
    generate_out_put_response,
    encryptId,
    decryptId
}