const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const  {authMiddleware}=require("../middleware/auth.js")

router.post('/create', authMiddleware,roleController.createRole);
router.get('/getRole', authMiddleware,roleController.getAllRoles);
router.get('/roleById/:id',authMiddleware, roleController.getRoleById); // ✅ Fixed
router.put('/update/:id',authMiddleware, roleController.updateRole);
router.delete('/delete/:id',authMiddleware, roleController.deleteRole);
router.get('/getRole/active',authMiddleware, roleController.getActiveRoles);
router.post('/assign-permissions',authMiddleware, roleController.assignPermissions);

module.exports = router;
