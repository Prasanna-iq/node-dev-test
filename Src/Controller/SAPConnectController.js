const axios =require("axios");
const db = require('../Services/dbcommon');
const Joi = require('joi');
const {parseJWTToken} = require('../Services/auth');
const logger=require('../Services/logger');
const util=require('../Services/utils');
const encryptCommon=require('../../Handlers/common');

// connect with SAP
const sapConnectController = {

    // Get CostCentre account of a Company
   getSAPCostCentreAccount: async (req,res)=>{
    try
    {
        const tokendec=  parseJWTToken(req);
        
        const schema=Joi.object({ 
            orgid:Joi.number().greater(0).required()
        });
            
        const { error }=schema.validate({orgid:req.query.orgid});
        if(error)
        {
            res.status(400).send(
                {
                    status:false,
                    message:error.details[0].message
                });
            return;
        }
        db.getDataRows('func_getserverconfig_byorg',[Number(req.query.orgid)])
        .then( async data => {

            var config = {
                method: 'get',
                url: 'http://erpserver.world.com:8080/sap/opu/odata/sap/ZMYIQINVOICE_SRV/CostCenterSet?sap-client=001&$filter=CompCode eq \'GB01\' and Language eq \'EN\'&$select=CostCtr,Name,Description',
                
                headers: {
                    "Content-Type": "application/json"
                },
                //client.DefaultRequestHeaders.Add("Application-Interface-Key", Configuration.GetValue<string>("AIRKey"));
                auth: {
                    username: encryptCommon.decryptId(data[0]['username']),
                    password: encryptCommon.decryptId(data[0]['password'])
                }
              };
              
              await axios(config)
              .then(function (response) {
                res.send(
                    {
                        status:true,
                        message:"Success",
                        datalist:response?.data?.d?.results
                    }
                    );
              })
              .catch(function (error) {
                logger.error(util(__filename) + error);        // log message
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
              });

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

module.exports = sapConnectController;