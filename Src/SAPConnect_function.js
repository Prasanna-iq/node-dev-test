const axios =require("axios");
const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');
const encryptCommon=require('../../Handlers/common');
const {SAPAIRKey} = require('../../Configuration/app')

// connect with SAP
// Get CostCentre account of a Company
//getSAPCostCentreAccount: async (req,res)=>{
exports.getSAPCostCentreAccount= async (event,context,callback) => {
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
        orgid:Joi.number().greater(0).required()
    });
    const orgid = event.requestContext.authorizer.orgid;
    const { error }=schema.validate({orgid:orgid});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    
    const secret_mannager = new AWS.SecretsManager();
    const secret = await secret_mannager.getSecretValue({ SecretId: secret_id }).promise();
    const dbCredentials = JSON.parse(secret.SecretString);
    db.getDataRows('func_getserverconfig_byorg',[Number(req.query.orgid)])
    .then( async data => {
        const urlparts = data.serverurl.split('?');
        const sapurl=urlparts[0];
        const sapclient=urlparts.length >1?urlparts[1]+'&':'';
        var config = {
            method: 'get',
            url: `${sapurl}/sap/opu/odata/sap/ZMYIQINVOICE_SRV/CostCenterSet?${sapurl}$filter=CompCode eq \'${data.organisation_code}\' and Language eq \'EN\'&$select=CostCtr,Name,Description`,
            
            headers: {
                "Content-Type": "application/json",
                "Application-Interface-Key": dbCredentials.SAPAIRKey
            },
            //client.DefaultRequestHeaders.Add("Application-Interface-Key", Configuration.GetValue<string>("AIRKey"));
            auth: {
                username: db.decryptId(data[0]['username']),
                password: db.decryptId(data[0]['password'])
            }
            };
            
            await axios(config)
            .then(function (response) {
                // take only required column (excluding metadata)
                const finalobj = response?.data?.d?.results.map(item=>
                {
                    return{
                        CostCtr: item.CostCtr,
                        Name: item.Name,
                        Description: item.Description
                    }
                });
                const userid=tokendec?tokendec['id']:'';        // from token
                const orggrp = tokendec?tokendec['Org_grp']:'';    // from token
                db.getDataRows('func_insertupdate_costcentre_org',[JSON.stringify(finalobj), Number(userid), Number(req.query.orgid),Number(orggrp)])
                .then(data => {
                    response = db.generate_out_put_response(null, "Success", 200);
                    return response;
                })
                .catch(error => {
                    response = db.generate_out_put_response(error, "Error", 400);
                    return response;
                });
                
            })
            .catch(function (error) {
                response = db.generate_out_put_response(error, "Error", 400);
                return response;
            });

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

// Get CostCentre account of a Company
//getSAPGroupLedgerAccount: async (req,res)=>{
exports.getSAPGroupLedgerAccount= async (event,context,callback) => {
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
        orgid:Joi.number().greater(0).required()
    });
    const orgid = event.requestContext.authorizer.orgid;
    const { error }=schema.validate({orgid:orgid});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    
    db.getDataRows('func_getserverconfig_byorg',[Number(orgid)])
    .then( async data => {

        const urlparts = data.serverurl.split('?');
        const sapurl=urlparts[0];
        const sapclient=urlparts.length >1?urlparts[1]+'&':'';

        var config = {
            method: 'get',
            url: `${sapurl}/sap/opu/odata/sap/ZMYIQINVOICE_SRV/GLAccountSet?${sapclient}$select=GLAcct,ShortText,LongText&$filter=ChartsOfAcc%20eq%20\'INT\'%20and%20CompCode%20eq%20\'${data.organisation_code}\'%20and%20Language%20eq%20\'EN\'`,
            
            headers: {
                "Content-Type": "application/json",
                "Application-Interface-Key": SAPAIRKey.key
            },
            //client.DefaultRequestHeaders.Add("Application-Interface-Key", Configuration.GetValue<string>("AIRKey"));
            auth: {
                username: db.decryptId(data[0]['username']),
                password: db.decryptId(data[0]['password'])
            }
            };
            
            await axios(config)
            .then(function (response) {

            // take only required column (excluding metadata)
            const finalobj = response?.data?.d?.results.map(item=>
                {
                    return{
                        GlCode: item.GLAcct,
                        Name: item.ShortText,
                        Description: item.LongText
                    }
                });
                const userid=tokendec?tokendec['id']:'';   // from token
                const orggrp = tokendec?tokendec['Org_grp']:'';    // from token
                db.getDataRows('func_insertupdate_groupledger_org',[JSON.stringify(finalobj), Number(userid), Number(orgid),Number(orggrp)])
                .then(data => {
                    response = db.generate_out_put_response(null, "Success", 200);
                    return response;
                })
                .catch(error => {
                    response = db.generate_out_put_response(error, "Error", 400);
                    return response;
                });
            })
            .catch(function (error) {
                response = db.generate_out_put_response(error, "Error", 400);
                return response;
            });
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

//getlistGeneralLedger: (req,res)=>{
exports.getlistGeneralLedger= async (event,context,callback) => {
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
        const org_id = event.requestContext.authorizer.org_id;
        db.getDataRows('func_get_general_ledger',[Number(org_id)])
        .then(data => {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        })
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
},


//getlistCostCentre: (req,res)=>{
exports.getlistCostCentre= async (event,context,callback) => {
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
        const org_id = event.requestContext.authorizer.org_id;
        
        db.getDataRows('func_get_cost_centre',[Number(org_id)])
        .then(data => {
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        })
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
},

//addupdateGl: (req,res)=>{
exports.addupdateGl= async (event,context,callback) => {
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
            invoice_id:Joi.number().greater(0).required(),
            type:Joi.number().greater(0).required(),
            json:Joi.string().min(10).required()
        });
        const body = JSON.parse(event.body);
        const invoice_id = JSON.stringify(body.invoice_id);
        const type = JSON.stringify(body.type);
        const json = JSON.stringify(body.json);

        const { error }=schema.validate({
                invoice_id:invoice_id, 
                type:type,
                json: json
                });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataReturnValue('func_insertupdate_costcenter', [Number(invoice_id), Number(type),json])
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

//updateGlSync: (req,res)=>{
exports.updateGlSync= async (event,context,callback) => {
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
        const orggrp=tokendec['Org_grp'];   // from token
        const userid=tokendec['id'];   // from token

        const schema=Joi.object({ 
            orggrp:Joi.number().greater(0).required(),
            userid:Joi.number().greater(0).required(),
            type:Joi.number().greater(0).required()
        });

        const type= event.requestContext.authorizer.type;
        const { error }=schema.validate({
            orggrp:orggrp, 
            userid:userid, 
            type:type});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataReturnValue('func_glaccount_sync',[Number(userid),Number(orggrp),Number(type)])
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

//getGlSync: (req,res)=>{
exports.getGlSync= async (event,context,callback) => {
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
        const orggrp=tokendec['Org_grp'];   // from token
        const userid=tokendec['id'];   // from token

        const schema=Joi.object({ 
            orggrp:Joi.number().greater(0).required(),
            userid:Joi.number().greater(0).required()
        });
        const { error }=schema.validate({
            orggrp:orggrp, 
            userid:userid, 
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_glsync_info',[Number(orggrp),Number(userid)])
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