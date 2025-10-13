const express = require("express");
const router = express.Router();
const stateController = require("../controllers/stateController");
const  {authMiddleware}=require("../middleware/auth.js")

router.post("/", authMiddleware,stateController.addState);
router.post("/import",authMiddleware, stateController.bulkImportStates);
router.get("/",authMiddleware, stateController.getAllStates);
router.get('/states/country/:countryId',authMiddleware, stateController.getStatesByCountry);

router.put("/:id",authMiddleware, stateController.updateState);
router.delete("/:id", authMiddleware, stateController.deleteState);
router.post("/bulk-delete", authMiddleware, stateController.bulkDeleteState);

module.exports = router;
