
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

router.get('/paginated',authMiddleware, getPaginatedHSN);
router.post('/', authMiddleware,createHSN);
router.put('/:id',authMiddleware, updateHSN);
router.delete('/:id', authMiddleware,deleteHSN);
// router.post('/import', upload.single('file'), importHSN);
router.post('/import-json',authMiddleware, importHSN);
router.post('/import', authMiddleware,bulkImport);
router.get('/export', authMiddleware,exportHSN);
router.get("/all",authMiddleware, getAllHSN);


module.exports = router;
