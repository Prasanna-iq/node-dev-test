const db = require('/opt/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('/opt/auth_layerfunction');
const {sendFCMNotification, sendEmail} = require('/opt/commonservice_layerfunction');

/// add/Update Invoice Allocation
//addupdateinvoiceallocation: (req,res)=>{
exports.addupdateinvoiceallocation= async (event,context,callback) => {
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
            orgid:Joi.number().greater(0).required()
        });

        const userid=tokendec?tokendec['id']:'';        // from token

        const bodyjson = JSON.parse(event.body);
        const orgid = JSON.stringify(body.orgid);       // take property orgid from the body json
        const json = JSON.stringify(body.json);         // take property json from the body json

        const { error }=schema.validate({
                json: json, 
                userid:userid, 
                orgid:orgid});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataReturnValue('func_insert_invoice_allocation',[Number(orgid),Number(userid),json])
        .then(data => {
            response = db.generate_out_put_response(data, "Invoice Allocation Added Successfully", 200);
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
},

//Get List of Invoice Allocation
//getallocationlist: (req,res)=>{
exports.getallocationlist= async (event,context,callback) => {
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
            orggrp:Joi.number().greater(0).required(),
            userid:Joi.number().greater(0).required(),
            orgid:Joi.number().greater(0).required()
        });
        
        const orggrp=tokendec['Org_grp'];   // from token
        const userid = tokendec['id']; //from token
        const orgid = event.requestContext.authorizer.orgid;
        const { error }=schema.validate({
            orggrp: orggrp, 
            userid: userid,
            orgid: orgid});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        
        db.getDataRows('func_get_invoice_allocation',[orgid,Number(orggrp),Number(userid)])
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

//Role List only having access for invoice menu
//getrolelistforalloc: (req,res)=>{
exports.getrolelistforalloc= async (event,context,callback) => {
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

        const schema=Joi.object({ 
            orggrp:Joi.number().greater(0).required()
        });
        
        const { error }=schema.validate({
            orggrp: orggrp, 
        });
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }
        db.getDataRows('func_get_rolelist_foralloc',[Number(orggrp)])
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

//Role List only having access for invoice menu
//getuserlistforalloc: (req,res)=>{
exports.getuserlistforalloc= async (event,context,callback) => {
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
    const userid = tokendec['id']; //from token
    const status = event.requestContext.authorizer.status;
    const org_id = event.requestContext.authorizer.org_id;

    const schema=Joi.object({ 
        orggrp: Joi.number().greater(0).required(),
        userid: Joi.number().greater(0).required(),
        org_id: Joi.number().greater(0).required()
    });

    const { error }=schema.validate({
        orggrp: orggrp,
        userid:userid,
        org_id:org_id
    });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    db.getDataRows('func_user_dropdown_foralloc',[Number(userid),Number(orggrp),org_id,status])
    .then(data => {
        const datalist = data?.map((el) => {
            return {user_id:el?.user_id,user_emailaddress:el?.user_emailaddress,user_image: new Buffer.from(el?.user_image,'base64').toString('base64')}
        });

        response = db.generate_out_put_response(datalist, "Success", 200);
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

//sent to ver 
//sendtoassignapprove: (req,res)=>{
exports.sendtoassignapprove= async (event,context,callback) => {
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
        orgid:Joi.number().greater(0).required(),
        invid:Joi.number().greater(0).required(),
        userid:Joi.number().greater(0).required(),
    });

    const userid = tokendec['id']; //from token
    const orgid= event.requestContext.authorizer.orgid;
    const invid= event.requestContext.authorizer.invid;

    const { error }=schema.validate({
        userid: userid,
        orgid:orgid,
        invid:invid,
    });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    db.getDataRows('func_update_isapproval',[invid,orgid,Number(userid)]) //func_update_isapproval
    .then(data => {
        if(data[0]?.fcm_token != null)
        {
            sendFCMNotification(data[0]?.fcm_token,'Invoice Approve','Send For Approval',userid);
        }
        if(data[0]?.email_to != null)
        {
            sendEmail(data[0]);
        }

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

//sent  resend to assigne
//reassigninvoice: (req,res)=>{
exports.reassigninvoice= async (event,context,callback) => {
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
    const tokendec = parseJWTToken(token);
    const schema = Joi.object({ 
        userid:Joi.number().greater(0).required(),
        invid:Joi.number().greater(0).required(),
        orgid:Joi.number().greater(0).required(),
        remarks:Joi.string().min(10)
    });

    const userid = tokendec['id'];                      //from token
    const body = JSON.parse(event.body);
    const invid = JSON.stringify(body.invid);
    const orgid = JSON.stringify(body.orgid);
    const remarks = JSON.stringify(body.remarks);

    const { error }=schema.validate({
        userid: userid,
        orgid:orgid,
        invid:invid,
        remarks:remarks,
    });
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }
    
    db.getDataRows('func_update_sendassigne',[Number(invid),Number(userid),Number(orgid)])
    .then(data => {
        if(data[0]?.fcm_token != null)
        {
            sendFCMNotification(data[0]?.fcm_token,remarks,'',userid);
        }
        if(data[0]?.email_cc != null)
        {
            sendEmail(data[0]);
        }
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
};