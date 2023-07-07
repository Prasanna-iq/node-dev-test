const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');

/// get task priority settings list
//getTaskNumberConfigList: (req,res)=>{
exports.getTaskNumberConfigList= async (event,context,callback) => {
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
        });
        
        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
        const userid=tokendec?tokendec['id']:'';   // from token

        const { error }=schema.validate({orggrp: orggrp, userid: userid});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_get_taskno_config',[Number(userid),Number(orggrp)])
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

/// Add Update email template
//addUpdateTaskNumberConfig: (req,res)=>{
exports.addUpdateTaskNumberConfig= async (event,context,callback) => {
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
            id: Joi.number().required(),
            nextno: Joi.number().greater(0).required(),
        });
        const userid=tokendec?tokendec['id']:'';        // from token
        const orggrp = tokendec?tokendec['Org_grp']:'';    // from token
        const body = JSON.parse(event.body);
        const id = JSON.stringify(body.id);
        const nextno = JSON.stringify(body.nextno);
        const preffix = JSON.stringify(body.preffix);
        const suffix = JSON.stringify(body.suffix);
        const padding = JSON.stringify(body.padding);

        const { error }=schema.validate({
                userid: userid,
                orggrp: orggrp,
                id: id,
                nextno: nextno,
            });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataReturnValue('func_insert_taskno_config',[id,Number(orggrp),Number(userid),preffix,suffix,padding,nextno])
        .then(data => 
            {
                response = db.generate_out_put_response(data, "Success", 200);
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