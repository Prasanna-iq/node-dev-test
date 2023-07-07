const db = require('/opt/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('/opt/auth_layerfunction');

exports.addEmailTemplate= async (event,context,callback) => {
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
        db.getDataReturnValue('func_addupdate_emailtemplate',[json,Number(userid),Number(orggrp)])
        .then(data => 
            {
                response = db.generate_out_put_response(data, "Success", 200);
                return response;
            }  
        ) 
        .catch(error => {
           // send error if any
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
       
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    }
};

exports.getemailTemplateList= async (event,context,callback) => {
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
        const userid=tokendec?tokendec['id']:'';        // from token
        const orggrp = tokendec?tokendec['Org_grp']:'';    // from token
   
        const { error }=schema.validate({
                userid: userid,
                orggrp: orggrp,
            });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_emailtemplate_list',[Number(orggrp),Number(userid)])
        .then(data => 
            {
                response = db.generate_out_put_response(data, "Success", 200);
                return response;
            }  
        ) 
        .catch(error => {
           // send error if any
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    }
};

exports.getemailTemplateView= async (event,context,callback) => {
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
            id: Joi.number().greater(0).required(),
        });
        const orggrp = tokendec?tokendec['Org_grp']:'';    // from token
        const id= event.requestContext.authorizer.id;
   
        const { error }=schema.validate({
                id: id,
                orggrp: orggrp,
            });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_emailtemplate_view',[Number(orggrp),Number(id)])
        .then(data => 
        {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        }  
        ) 
        .catch(error => {
           // send error if any
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    }
};

exports.updateEmailTemplateStatus= async (event,context,callback) => {
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
            id: Joi.number().greater(0).required(),
            status: Joi.required()
        });
        const userid = tokendec['id']; //from token 

        const body = JSON.parse(event.body);
        const id = JSON.stringify(body.id);
        const status = JSON.stringify(body.status);

        const { error }=schema.validate({ 
            userid:userid, 
            id:id,
            status: status
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_emailtemplate_view',[Number(orggrp),Number(id)])
        .then(data => 
            {
                response = db.generate_out_put_response(null, "Success", 200);
                return response;
            }  
        ) 
        .catch(error => {
           // send error if any
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    }
};

exports.getemailTemplatePlaceholderList= async (event,context,callback) => {
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
            userid: Joi.number().greater(0).required(),
        });
        const userid = tokendec?tokendec['id']:'';    // from token
        const { error }=schema.validate({
                userid: userid,
            });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_emailtemplate_placeholder',[Number(userid)])
        .then(data => 
        {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        }  
        ) 
        .catch(error => {
           // send error if any
           response = db.generate_out_put_response(error, "Error", 400);
           return response;
        });
    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
    }
};