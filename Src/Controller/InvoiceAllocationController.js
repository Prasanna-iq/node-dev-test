const db = require('../Services/dbcommon');
const Joi = require('joi');
const {parseJWTToken} = require('../Services/auth');
const invoiceAllocationController={
    /// add/Update Invoice Allocation
    addupdateinvoiceallocation: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);
            
            const schema=Joi.object({ 
                json:Joi.string().min(10).required(),
                userid:Joi.number().greater(0).required(),
                orgid:Joi.number().greater(0).required()
            });

            const userid=tokendec?tokendec['id']:'';        // from token
            const bodyjson = req.body;                       // from body

            const orgid = (bodyjson)[`orgid`];    // take property orgid from the body json
            const json= (bodyjson)[`json`];       // take property json from the body json
            
            const { error }=schema.validate({
                    json: JSON.stringify(json), 
                    userid:userid, 
                    orgid:orgid});
            if(error)
            {
                res.status(400).send(
                    {
                        status:false,
                        message:error.details[0].message
                    });
                return;
            }

            db.getDataReturnValue('func_insert_invoice_allocation',[Number(orgid),Number(userid),JSON.stringify(json)])
            .then(data => {
                console.log(data);
                res.send(
                    {
                        status:data==true?true:false,
                        message:data==true?"Invoice Allocation Successfully Added":"Invoice Allocation Failed",
                    }
                    );
            })
            .catch(error => {
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });

        }
        catch (error) {
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    },

    //Get List of Invoice Allocation
    getallocationlist: (req,res)=>
    {
        try
        {
            const tokendec=  parseJWTToken(req);
            const orggrp=tokendec['Org_grp'];   // from token
            const userid = tokendec['id']; //from token
            const orgid = req.query.orgid;  
            db.getDataRows('func_get_invoice_allocation',[orgid,Number(orggrp),Number(userid)])
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
                // send error if any
                res.status(400).send(
                    {
                        status:false,
                        message:error
                    });
            });
        }
        catch (error) {
            res.status(400).send(
                {
                    status:false,
                    message:error
                });
            }
    }
}
module.exports = invoiceAllocationController;
