const { Client } = require('pg'); 
const AWS = require("aws-sdk");

const secret_id = process.env.DB_SECRET_ID;

exports.getListOfFields = async (event,context,callback) => {
    let response;
    try{
        let client = await connectToDatabase();
        await client.connect();
        let select_query = `SELECT trf.id id, trf.field field, trf.field_datatype field_type, 
                            trf.display_order display_order from tbl_rule_fields trf;`;
        const result = await client.query(select_query);
        await client.end();
        
        if (result && result.rows){
            response = generate_out_put_response(result.rows, "Success", 200);
        }
        else{
            response = generate_out_put_response(result, "Error", 400);
        }
        return response;
    }
    catch(err){
        console.error(err);
        response = generate_out_put_response(err.message, "Error", 400);
        return response;
    }
};

exports.addupdateRuleMaster = async (event,context,callback) => {
    let response;
    try{
        let body = JSON.parse(event.body);
        let payload = JSON.stringify(body.json);
        let created_by= event.requestContext.authorizer.id;
        let group = event.requestContext.authorizer.org_grp;

        let client = await connectToDatabase();
        await client.connect();
        let select_query = `SELECT func_insertupdate_rules('${payload}', ${created_by}, ${group})`;
        const result = await client.query(select_query);
        await client.end();
        if (result.rows[0].func_insertupdate_rules === "Success"){
            response = generate_out_put_response(result.rows, "Success", 200);
            return response;
        }
        else{
            response = generate_out_put_response(result.rows[0].func_insertupdate_rules, "Error", 400);
            return response;
        }
    }
    catch(err){
        console.error(err);
        response = generate_out_put_response(err.message, "Error", 400);
        return response;
    }
};

async function connectToDatabase() {
    try{
        const secret_mannager = new AWS.SecretsManager();
        const secret = await secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
        const dbCredentials = JSON.parse(secret.SecretString);

        var dbConnection = await new Client({
              user: dbCredentials.username,
              host: dbCredentials.host,
              database: dbCredentials.dbInstanceIdentifier,
              password: dbCredentials.password,
              port: dbCredentials.port,
                });
        console.log("making new database connection");
        return dbConnection;
    }
    catch(err){
        console.error(err);
        return err.message;
    }
}


function generate_out_put_response (inputObject, message="", status_code=200) {
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