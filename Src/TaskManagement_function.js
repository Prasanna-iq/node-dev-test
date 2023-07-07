const db = require('../Src/dbcommon_layerfunction');
const Joi = require('joi');
const {parseJWTToken, verifyToken} = require('../Src/auth_layerfunction');
const usr = require('../Controller/UserTaskController');

//My Task List
//getMyTaskList: (req,res)=>{
exports.getMyTaskList= async (event,context,callback) => {
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

        db.getDataRows('func_get_mytask_list',[Number(userid),Number(orggrp)])
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
},

//get invoice task list
//getInvoiceTaskList: (req,res)=>{
exports.getInvoiceTaskList= async (event,context,callback) => {
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
           invid: Joi.number().greater(0).required(),
        });
        
        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
        const userid=tokendec?tokendec['id']:'';   // from token
        const invid= event.requestContext.authorizer.invid;

        const { error }=schema.validate({orggrp: orggrp, userid: userid, invid:invid});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_get_invoice_tasklist',[Number(userid),Number(orggrp),Number(invid)])
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

//get template view for invoice
//getEmailTemplateForInvoice: (req,res)=>{
exports.getEmailTemplateForInvoice= async (event,context,callback) => {
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

        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token

        const schema=Joi.object({ 
            orggrp: Joi.number().greater(0).required()
        });

        const { error }=schema.validate({orggrp:orggrp});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_invoice_emailtemplate_view',[Number(orggrp)])
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

//to do task user list
//getUserListToDoTask: (req,res)=>{
exports.getUserListToDoTask= async (event,context,callback) => {
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
           orggrp: Joi.number().greater(0).required()
        });
        
        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token

        const { error }=schema.validate({orggrp: orggrp});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_getuserlist_todo_task',[Number(orggrp)])
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

//get invoice task view
//getInvoiceTaskView: (req,res)=>{
exports.getInvoiceTaskView= async (event,context,callback) => {
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
           userid: Joi.number().greater(0).required(), //user id
           id: Joi.number().greater(0).required(), //task id
        });

        const userid=tokendec?tokendec['id']:'';   // from token
        const id= event.requestContext.authorizer.id;

        const { error }=schema.validate({userid: userid, id:id});
        if(error)
        {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
        }

        db.getDataRows('func_get_invoice_taskview',[Number(id),Number(userid)])
        .then(data => {
            db.getDataRows('func_get_taskview_userimg',[Number(id)]).then(
            dataimage=>{
    
                const Images = dataimage?.map((el) => {
                    return {id:el?.id,user_image: new Buffer.from(el?.resized_image,'base64').toString('base64')}
                });
                const returndata ={
                    data:data,
                    dataimg:Images,
                }
                
                response = db.generate_out_put_response(returndata, "Success", 200);
                return response;
            });
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
};

 /// task status update
 //updateTaskStatus: (req,res)=>{
exports.updateTaskStatus= async (event,context,callback) => {
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
             status:Joi.number().greater(0).required(),
             id:Joi.number().greater(0).required(),
             userid: Joi.number().greater(0).required()
         });

         const userid=tokendec?tokendec['id']:'';   // from token

        const body = JSON.parse(event.body);
        const status = JSON.stringify(body.status);
        const id = JSON.stringify(body.id);

         const { error }=schema.validate({
                 status: status, 
                 userid:userid, 
                 id:id});
         if(error)
         {
            response = db.generate_out_put_response(error.details[0].message, "Error", 400);
            return response;
         }
         db.getDataReturnValue('func_update_task_status',[Number(id),Number(status), Number(userid)])
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

 //create task 
 //createTask: (req,res)=>{
exports.createTask= async (event,context,callback) => {
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

        //  const schema=Joi.object({ 
        //     orggrp: Joi.number().greater(0).required(),
        //     userid: Joi.number().greater(0).required(),
        //     invid: Joi.number().greater(0).required(),
        //     json: Joi.required(),
        //     attachment: Joi.required()
        //  });
            
        const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
        const userid=tokendec?tokendec['id']:'';   // from token

        const body = JSON.parse(event.body);
        const invid = JSON.stringify(body.invid);
        const json = JSON.stringify(body.json);
        const attachment = JSON.stringify(body.attachment);

        //  const { error }=schema.validate({orggrp: orggrp, userid: userid, invid:invid,json:json,attachment:attachment});
        //  if(error)
        //  {
        //      res.status(400).send(
        //          {
        //              status:false,
        //              message:error.details[0].message
        //          });
        //      return;
        //  }
        if(json.json[0]?.task_type==2)
        {
            usr.SendEmail(Number(userid), body).then(
                result=>
                {
                    const data = createTaskItem([Number(userid),Number(orggrp),Number(invid),json,attachment, result?.id, result?.conversationId])
                    response = db.generate_out_put_response(data, "Success", 200);
                    return response;
                }
            );
        }
        else
        {
            const data = createTaskItem([Number(userid),Number(orggrp),Number(invid),json,attachment,null,null])
            response = db.generate_out_put_response(data, "Success", 200);
            return response;
        }

    }
    catch (error) {
        response = db.generate_out_put_response(error, "Error", 400);
        return response;
        }
};

function createTaskItem(userid,orggrp, invid, json,attachment, messageid, conversationId)
{
    db.getDataReturnValue('func_create_task',[userid,orggrp, invid, json,attachment, messageid, conversationId])
    .then(data => {
        return data;
    })
};

//add update comments
//addUpdateComments: (req,res)=>{
exports.addUpdateComments= async (event,context,callback) => {
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
        taskid: Joi.number().greater(0).required(),
        id: Joi.number().required(),
        comments: Joi.string().required(),
    });
    
    const userid=tokendec?tokendec['id']:'';   // from token

    const body = JSON.parse(event.body);
    const taskid = JSON.stringify(body.taskid);
    const id = JSON.stringify(body.id);
    const comments = JSON.stringify(body.comments);

    const { error }=schema.validate({userid: userid, id:id,taskid:taskid,comments:comments});
    if(error)
    {
        response = db.generate_out_put_response(error.details[0].message, "Error", 400);
        return response;
    }

    db.getDataRows('func_addupdate_taskcomments',[Number(id),Number(taskid),comments,userid])
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