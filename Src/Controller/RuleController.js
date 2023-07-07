const db = require('../Services/dbcommon');
const Joi = require('joi');
const {parseJWTToken} = require('../Services/auth');
const logger=require('../Services/logger');
const util=require('../Services/utils');

const rulecontroller={
    /// get list of Rule Fields
    getListOfFields: (req,res)=>
    {
        try
        {
            db.getDataRowsNoArg('func_rule_field_dropdown')
            .then(data => {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
            
        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },

    /// get list of Operator
    getListOfOperators: (req,res)=>
    {
        try
        {   
            db.getDataRowsNoArg('func_rule_operator_dropdown')
            .then(data => {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });

        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },

    /// get list of Rules
    getRuleLists: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);
            const orggrp=tokendec['Org_grp'];   // from token
            
            db.getDataRows('func_get_ruleslist',[Number(orggrp)])
            .then(data => {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },

    /// get a Rule View
    getRuleView: (req,res)=>
    {
        try
        {
            const jsondt = JSON.parse(json);
            const tokendec=  parseJWTToken(req);

            const schema=Joi.object({ 
                ruleid:Joi.number().greater(0).required(),
                orggrp:Joi.number().greater(0).required()
            });
            
            const { error }=schema.validate({
                ruleid: req.query.ruleid, 
                orggrp:tokendec?tokendec['Org_grp']:''
            });
            if(error)
            {
                res.status(400).send(
                    {
                        status:false,
                        message:error.details[0].message
                    });
                return;
            }

            const orggrp=tokendec['Org_grp'];   // from token
            const ruleid=req.query.ruleid;  // from querystring

            db.getDataRows('func_get_ruleview',[Number(ruleid),Number(orggrp)])
            .then(data => {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }

    },

    /// get a Rule View with Items JSON
    getRuleViewWithItems: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);

            const schema=Joi.object({ 
                rulid:Joi.number().greater(0).required(),
                orggrpid:Joi.number().greater(0).required()
            });
            
            const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
            const ruleid=req.query.ruleid;  // from querystring
            const { error }=schema.validate({rulid: ruleid, orggrpid: orggrp});
            if(error)
            {
                res.status(400).send(
                    {
                        status:false,
                        message:error.details[0].message
                    });
                return;
            }

            db.getDataRows('func_get_rulesviews',[Number(ruleid), Number(orggrp)])
            .then(data => {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },
    /// Rule status activate/deactivate
    updateActiveDeactivateRule: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);
            
            const schema=Joi.object({ 
                rulid:Joi.number().greater(0).required(),
                userid:Joi.number().greater(0).required(),
                isactive:Joi.boolean().required()
            });

            const userid=tokendec?tokendec['id']:'';   // from token
            const ruleid=req.query.id;  // from querystring
            const isactive=req.query.isactive;  // from querystring

            const { error }=schema.validate({
                    rulid: ruleid, 
                    userid:userid, 
                    isactive:isactive});
            if(error)
            {
                res.status(400).send(
                    {
                        status:false,
                        message:error.details[0].message
                    });
                return;
            }

            db.getDataRows('func_actv_dctv_rule',[Number(ruleid), isactive, Number(userid)])
            .then(data => {
                res.send(
                    {
                        status:data==null?false:true,
                        message:data==null?"Failed To Update":"Success",
                        datalist:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },

    /// add/update Rule master
    addupdateRuleMaster: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);
            
            const schema=Joi.object({ 
                json:Joi.string().min(10).required(),
                userid:Joi.number().greater(0).required(),
                orggrpid:Joi.number().greater(0).required()
            });
            
            const orggrp=tokendec?tokendec['Org_grp']:'';   // from token
            const userid=tokendec?tokendec['id']:'';        // from token
            const bodyjson = req.body;                      // from body
            const json = (bodyjson)[`json`];   
            const { error }=schema.validate({
                    json: JSON.stringify(json), 
                    userid:userid, 
                    orggrpid:orggrp});
            if(error)
            {
                res.status(400).send(
                    {
                        status:false,
                        message:error.details[0].message
                    });
                return;
            }

            db.getDataReturnValue('func_insertupdate_rules',[JSON.stringify(json), Number(userid), Number(orggrp)])
            .then(data => {
                res.send(
                    {
                        status:data=="Success"?true:false,
                        message:data
                    }
                    );
            })
            .catch(error => {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });

        }
        catch (error) {
            logger.error(util(__filename) + error);        // log message
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    }
}
module.exports = rulecontroller;