const express = require('express');
const router = express.Router();

const {verifyToken} = require('../Src/Services/auth');

const ruleController = require('../Src/Controller/RuleController');
const allocationController = require('../Src/Controller/InvoiceAllocationController');
const sapConnectController = require('../Src/Controller/SAPConnectController');

// Rule Master  //RuleController.js
router.get("/getListOfFields", verifyToken, ruleController.getListOfFields);
router.get("/getListOfOperators", verifyToken, ruleController.getListOfOperators);
router.get("/getRuleLists", verifyToken, ruleController.getRuleLists);
router.get("/getRuleView", verifyToken, ruleController.getRuleView);
router.get("/getRuleViewWithItems", verifyToken, ruleController.getRuleViewWithItems);
router.get("/updateActiveDeactivateRule", verifyToken, ruleController.updateActiveDeactivateRule);
router.post("/addupdateRuleMaster", verifyToken, ruleController.addupdateRuleMaster);
// Rule Master Ends here    //RuleController.js



//Invoice Allocation  //InvoiceAllocationController.js
router.post("/addupdateinvoiceallocation", verifyToken, allocationController.addupdateinvoiceallocation);
router.get("/getallocationlist",verifyToken,allocationController.getallocationlist);
//Invoice Allocation Ends Here


// SAP Connect Controller       // SAPConnectController.js

router.get("/getSAPCostCentreAccount", sapConnectController.getSAPCostCentreAccount);

// SAP Connect Controller Ends here


module.exports = router;