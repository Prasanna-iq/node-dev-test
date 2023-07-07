const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');

/// get list of unread notificayions
//getpushnotification: (req,res)=>{
exports.getpushnotification= async (event,context,callback) => {
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
        isread:Joi.boolean().required(),
        pgno:Joi.number().greater(0).required(),
        reccnt:Joi.number().greater(0).required()
    });
    const id= event.requestContext.authorizer.id;
    const isread= event.requestContext.authorizer.isread;
    const pgno= event.requestContext.authorizer.pgno;
    const reccnt= event.requestContext.authorizer.reccnt;
    const { error }=schema.validate({
        userid:tokendec?tokendec['id']:'',
        isread: isread,
        pgno: pgno,
        reccnt: reccnt,
    });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    const userid = tokendec['id'];  // from token
    db.getDataRows('func_get_push_notification',[Number(userid),isread,Number(pgno),Number(reccnt)])
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

/// update notification status
//updatenotificationstatus: (req,res)=>{
exports.updatenotificationstatus= async (event,context,callback) => {
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
        id:Joi.number().required()
    });

    // from token
    const userid=tokendec?tokendec['id']:''; 
    const body = JSON.parse(event.body);
    const id = JSON.stringify(body.id);         
    const { error }=schema.validate({
                                    userid:userid, 
                                    id:id});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    db.getDataReturnValue('func_update_push_notification',[Number(userid), Number(id)])
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
}