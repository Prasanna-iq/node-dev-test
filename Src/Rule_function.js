const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');

/// get list of Rule Fields
//getListOfFields: (req,res)=>{
exports.getListOfFields= async (event,context,callback) => {
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
    db.getDataRowsNoArg('func_rule_field_dropdown')
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

/// get list of Operator
//getListOfOperators: (req,res)=>{
exports.getListOfOperators= async (event,context,callback) => {
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
    db.getDataRowsNoArg('func_rule_operator_dropdown')
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

/// get list of Rules
//getRuleLists: (req,res)=>{
exports.getRuleLists= async (event,context,callback) => {
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
    const tokendec= parseJWTToken(token);
    const orggrp=tokendec['Org_grp'];   // from token
    
    db.getDataRows('func_get_ruleslist',[Number(orggrp)])
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

/// get a Rule View
//getRuleView: (req,res)=>{
exports.getRuleView= async (event,context,callback) => {
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
            ruleid:Joi.number().greater(0).required(),
            orggrp:Joi.number().greater(0).required()
        });
        const orggrp=tokendec['Org_grp'];   // from token
        const ruleid = event.requestContext.authorizer.ruleid;
        const { error }=schema.validate({
            ruleid: ruleid, 
            orggrp:orggrp
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_get_ruleview',[Number(ruleid),Number(orggrp)])
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

/// get a Rule View with Items JSON
//getRuleViewWithItems: (req,res)=>{
exports.getRuleViewWithItems= async (event,context,callback) => {
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
        rulid:Joi.number().greater(0).required(),
        orggrpid:Joi.number().greater(0).required()
    });
    
    const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
    const ruleid = event.requestContext.authorizer.ruleid;
    const { error }=schema.validate({rulid: ruleid, orggrpid: orggrp});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    db.getDataRows('func_get_rulesviews',[Number(ruleid), Number(orggrp)])
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
/// Rule status activate/deactivate
//updateActiveDeactivateRule: (req,res)=>{
exports.updateActiveDeactivateRule= async (event,context,callback) => {
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
        rulid:Joi.number().greater(0).required(),
        userid:Joi.number().greater(0).required(),
        isactive:Joi.boolean().required()
    });

    const userid=tokendec?tokendec['id']:'';   // from token
    const ruleid = event.requestContext.authorizer.ruleid;
    const isactive = event.requestContext.authorizer.isactive;
    const { error }=schema.validate({
            rulid: ruleid, 
            userid:userid, 
            isactive:isactive});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    db.getDataRows('func_actv_dctv_rule',[Number(ruleid), isactive, Number(userid)])
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

/// add/update Rule master
//addupdateRuleMaster: (req,res)=>{
exports.addupdateRuleMaster= async (event,context,callback) => {
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
            json:Joi.string().min(10).required(),
            userid:Joi.number().greater(0).required(),
            orggrpid:Joi.number().greater(0).required()
        });
        
        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
        const userid=tokendec?tokendec['id']:'';        // from token
        const body = JSON.parse(event.body);
        const json = JSON.stringify(body);

        const { error }=schema.validate({
                json: json, 
                userid: userid, 
                orggrpid: orggrp});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataReturnValue('func_insertupdate_rules',[json, Number(userid), Number(orggrp)])
        .then(data => {
            response = db.generate_out_put_response(null, "Success", 200);
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