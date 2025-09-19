// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/warehouseControllers");
// const  {authMiddleware}=require("../middleware/auth.js")

// === Export routes ===
// router.get("/:id/racks/export/csv", authMiddleware,ctrl.exportRackLayoutCSV);
// router.get("/:id/racks/export/pdf",authMiddleware, ctrl.exportRackLayoutPDF);

// === Custom and static routes first ===

// router.get("/active", authMiddleware,ctrl.getActiveWarehouses);     // <- /api/warehouse/active
/* custom BEFORE :id */
// router.put("/:id/update-rack",authMiddleware, ctrl.updateRack);


// === CRUD ===
// router.post("/",authMiddleware, ctrl.createWarehouse);
// router.get("/", authMiddleware,ctrl.getAllWarehouses);
// router.get("/:id", authMiddleware,ctrl.getWarehouseById);
// router.put("/:id",authMiddleware, ctrl.updateWarehouse);
// router.delete("/:id",authMiddleware, ctrl.deleteWarehouse);
// router.get("/active",authMiddleware, ctrl.getActiveWarehouses);


// module.exports = router;





// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/warehouseControllers");

// router.post("/", ctrl.createWarehouse);
// router.get("/", ctrl.getAllWarehouses);
// router.put("/:id", ctrl.updateWarehouse);
// router.delete("/:id", ctrl.deleteWarehouse);
// router.get("/:id", ctrl.getWarehouseById);
// router.get("/warehouse/active", ctrl.getActiveWarehouses);

// router.get("/:id/racks/export/csv", ctrl.exportRackLayoutCSV);
// router.get("/:id/racks/export/pdf", ctrl.exportRackLayoutPDF);

// module.exports = router;



//new code ==========================================================

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/warehouseControllers");

// === Export routes ===
router.get("/:id/racks/export/csv", ctrl.exportRackLayoutCSV);
router.get("/:id/racks/export/pdf", ctrl.exportRackLayoutPDF);

// === Custom and static routes first ===

router.get("/active", ctrl.getActiveWarehouses);     // <- /api/warehouse/active
/* custom BEFORE :id */
router.patch("/:id/merge-racks", ctrl.mergeRacks);
router.put("/:id/update-rack", ctrl.updateRack);

// /api/warehouse/active
router.get("/favorites", ctrl.getFavoriteWarehouses); // /api/warehouse/favorites
router.patch("/:id/toggle-favorite", ctrl.toggleFavoriteWarehouse);

// === CRUD ===
router.post("/", ctrl.createWarehouse);
router.get("/", ctrl.getAllWarehouses);
router.get("/:id", ctrl.getWarehouseById);
router.put("/:id", ctrl.updateWarehouse);
router.delete("/:id", ctrl.deleteWarehouse);

router.patch('/:id/zone/:zone/cell/:cellIndex', ctrl.zoneproducts),
router.patch("/:id/zone/:zone/cell/:cellIndex/remove-item", ctrl.removeitem),

module.exports = router;