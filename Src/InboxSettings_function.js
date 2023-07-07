const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');

//Get Inbox Settings
//getinboxsettings: (req,res)=>
exports.getinboxsettings= async (event,context,callback) => {
    let response;
    try
    {
        const headers = event.headers;
        const bearerToken = headers.Authorization || headers.authorization;
        let token="";
        if (bearerToken) {
            // Remove "Bearer " prefix from the token
            token = bearerToken.replace(/^Bearer\s/, '');
        };
        verifyToken(token);
        const tokendec=  parseJWTToken(token);
        const schema=Joi.object({     
            userid:Joi.number().greater(0).required(),
        });

        const userid = tokendec['id']; //from token 
        const { error }=schema.validate({
            userid:userid, 
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        
        db.getDataRows('func_get_inbox_settings',[Number(userid)])
        .then(data => {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        })
        .catch(error => {
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
        }
},

//Activate Deactivate Inbox Settings
//updatestatussettings: (req,res)=>{
exports.updatestatussettings= async (event,context,callback) => {
    let response;
    try
    {
        const headers = event.headers;
        const bearerToken = headers.Authorization || headers.authorization;
        let token="";
        if (bearerToken) {
            // Remove "Bearer " prefix from the token
            token = bearerToken.replace(/^Bearer\s/, '');
        };
        verifyToken(token);
        const tokendec=  parseJWTToken(token);

        const schema=Joi.object({     
            userid:Joi.number().greater(0).required(),
            inboxid: Joi.number().greater(0).required(),
            status: Joi.required()
        });
        const userid = tokendec['id']; //from token 
        const body = JSON.parse(event.body);
        const inboxid = JSON.stringify(body.inboxid);
        const status = JSON.stringify(body.status);

        const { error }=schema.validate({ 
            userid:userid, 
            inboxid:inboxid,
            status: status
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataReturnValue('func_update_inboxstatus',[Number(inboxid),Number(userid),status])
        .then(data => {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        })
        .catch(error => {
            response = db.generate_out_put_response(error, "Error", 400);
            return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
        }
},

//Delete Inbox Settings
//deleteinboxsettings: (req,res)=>{
exports.deleteinboxsettings= async (event,context,callback) => {
let response;        
try
{
    const headers = event.headers;
    const bearerToken = headers.Authorization || headers.authorization;
    let token="";
    if (bearerToken) {
        // Remove "Bearer " prefix from the token
        token = bearerToken.replace(/^Bearer\s/, '');
    };
    verifyToken(token);
    const tokendec=  parseJWTToken(token);

    const schema=Joi.object({     
        userid:Joi.number().greater(0).required(),
        inboxid: Joi.number().greater(0).required()
    });

    const userid = tokendec['id']; //from token 
    const body = JSON.parse(event.body);
    const inboxid = JSON.stringify(body.inboxid);

    const { error }=schema.validate({ 
        userid:userid, 
        inboxid:inboxid
    });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    db.getDataReturnValue('func_delete_inboxmail',[Number(inboxid),Number(userid)])
    .then(data => {
        response = db.generate_out_put_response(data, "Success", 200);
        return response;
    })
    .catch(error => {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    });
}
catch (error) {
    response = db.generate_out_put_response(error, "Error", 400);
    return response;
}
};