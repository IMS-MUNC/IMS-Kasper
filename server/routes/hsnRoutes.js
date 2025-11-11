
// routes/hsnRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getPaginatedHSN,
    createHSN,
    updateHSN,
    deleteHSN,
    importHSN,
    exportHSN,
    bulkImportHSN,
    bulkImport,
    getAllHSN
} = require('../controllers/hsnControllers');
const  {authMiddleware}=require("../middleware/auth.js")

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { verifyToken } = require("../middleware/Authentication/verifyToken");
const { checkPermission } = require("../middleware/permission/checkPermission");

router.get('/paginated',authMiddleware, getPaginatedHSN);
router.post('/', verifyToken, checkPermission("HSN", "write"), authMiddleware,createHSN);
router.put('/:id', verifyToken, checkPermission("HSN", "update"),authMiddleware, updateHSN);
router.delete('/:id', verifyToken, checkPermission("HSN", "delete"), authMiddleware,deleteHSN);
// router.post('/import', upload.single('file'), importHSN);
router.post('/import-json', verifyToken, checkPermission("HSN", "import"),authMiddleware, importHSN);
router.post('/import', authMiddleware,bulkImport);
router.get('/export', verifyToken, checkPermission("HSN", "export"), authMiddleware,exportHSN);
router.get("/all", verifyToken, checkPermission("HSN", "read"),authMiddleware, getAllHSN);


module.exports = router;
