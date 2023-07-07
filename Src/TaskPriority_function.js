const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');

/// Add/Update task priority settings
//addTaskPriority: (req,res)=>{
exports.addTaskPriority= async (event,context,callback) => {
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
        orggrp: Joi.number().greater(0).required(),
        userid: Joi.number().greater(0).required(),
        json: Joi.required()
    });
    const userid=tokendec?tokendec['id']:'';        // from token
    const orggrp = tokendec?tokendec['Org_grp']:'';    // from token      
    const body = JSON.parse(event.body);
    const json = JSON.stringify(body);
    const { error }=schema.validate({
            userid: userid,
            orggrp: orggrp,
            json: json
        });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    db.getDataReturnValue('func_insert_taskpriority',[Number(orggrp),Number(userid),json])
    .then(data => 
        {
            response = db.generate_out_put_response(null, "Success", 200);
            return response;
        }       
    ) 
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

/// get task priority settings list
//getTaskPriorityList: (req,res)=>{
exports.getTaskPriorityList= async (event,context,callback) => {
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
        orggrp: Joi.number().greater(0).required(),
        userid: Joi.number().greater(0).required()
    });
    
    const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
    const userid=tokendec?tokendec['id']:'';   // from token

    const { error }=schema.validate({orggrp: orggrp, userid: userid});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    db.getDataRows('func_get_taskpriority_list',[Number(orggrp), Number(userid)])
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