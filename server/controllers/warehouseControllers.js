const Warehouse = require("../models/warehouseModels");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose"); // Ensure mongoose is imported
const Product = require("../models/productModels"); // Ensure Product model is imported

// exports.createWarehouse = async (req, res) => {
//     try {
//         const warehouse = new Warehouse(req.body);
//         await warehouse.save();
//         res.status(201).json({ success: true, warehouse });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// exports.getAllWarehouses = async (req, res) => {
//     try {
//         const wh = await Warehouse.find()
//             .populate("contactPerson", "firstName lastName email")
//             .populate("country", "name")
//             .populate("state", "stateName")
//             .populate("city", "cityName");
//         res.json({ success: true, data: wh });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };
// exports.createWarehouse = async (req, res) => {
//     try {
//         const warehouse = new Warehouse(req.body);
//         await warehouse.save();
//         res.status(201).json({ success: true, warehouse });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

exports.createWarehouse = async (req, res) => {
    try {
        const data = { 
            ...req.body, 
            contactPerson: req.body.warehouseManager  // map it
        };

        delete data.warehouseManager; // optional

    const zonesInput = req.body.layout.zones;
    const rows = req.body.layout.rows;
    const columns = req.body.layout.columns;
    const width = req.body.layout.width;

    // Validate input
    if (!rows || !columns || zonesInput === undefined) {
      return res.status(400).json({ success: false, message: "Missing layout parameters" });
    }
    if (typeof zonesInput !== "number" || zonesInput <= 0) {
      return res.status(400).json({ success: false, message: "Zones must be a positive number" });
    }

    data.layout = {
      rows: rows,
      columns: columns,
      width: width,
      zones: zonesInput, // Store as number
    };

    // Initialize blocks array with zone objects
    data.blocks = [];
    for (let zoneIdx = 1; zoneIdx <= zonesInput; zoneIdx++) {
      const zoneName = `Zone${zoneIdx}`;
      const cells = [];
      let cellNumber = 1;
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          cells.push({
            name: String(cellNumber), // e.g., "1", "2", ..., "15"
            items: [],
          });
          cellNumber++;
        }
      }
      data.blocks.push({
        zone: zoneName,
        cells: cells,
      });
    }
        // Create and save the warehouse

        const warehouse = new Warehouse(data);
        await warehouse.save();
        res.status(201).json({ success: true, warehouse });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllWarehouses = async (req, res) => {
    try {
        const wh = await Warehouse.find()
            .populate("contactPerson", "firstName lastName email")
            .populate("country", "name")
            .populate("state", "stateName")
            .populate("city", "cityName");
        res.json({ success: true, data: wh });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//  GET /api/warehouse/active
// exports.getActiveWarehouses = async (req, res) => {
//     try {
//         const activeWarehouses = await Warehouse.find({ status: "Active" })  // <-- quotes
//             .populate("contactPerson", "firstName lastName email")
//             .populate("country", "name")
//             .populate("state", "stateName")
//             .populate("city", "cityName");

//         res.json({ success: true, data: activeWarehouses });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// controllers/warehouse.controller.js
exports.getActiveWarehouses = async (req, res) => {
    try {
        const activeWarehouses = await Warehouse.find({ status: "Active" })
            .populate("contactPerson", "firstName lastName email")
            .populate("country", "name")
            .populate("state", "stateName")
            .populate("city", "cityName");

        res.json({ success: true, data: activeWarehouses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.getWarehouseById = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id)
            .populate("contactPerson", "firstName lastName email")
            .populate("country", "name")
            .populate("state", "stateName")
            .populate("city", "cityName");
            // Removed populate for items.productId since we now store complete product details directly
        if (!warehouse) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, warehouse });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.exportRackLayoutCSV = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        const flatRacks = warehouse.racks.flatMap(rack =>
            rack.levels.map(level => ({
                warehouseName: warehouse.warehouseName,
                rackLabel: rack.rackLabel,
                level: level.level,
                barcode: level.barcode,
                rackCapacity: rack.capacity,
            }))
        );
        const parser = new Parser();
        const csv = parser.parse(flatRacks);
        res.header("Content-Type", "text/csv");
        res.attachment(`${warehouse.warehouseName}_rack_layout.csv`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.exportRackLayoutPDF = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=\"${warehouse.warehouseName}_rack_layout.pdf\"`);
        doc.text(`Rack Layout for ${warehouse.warehouseName}`, { underline: true });
        warehouse.racks.forEach(r => {
            doc.text(`Rack: ${r.rackLabel}`);
            r.levels.forEach(l => doc.text(` - Level ${l.level}: ${l.barcode}`));
            doc.moveDown();
        });
        doc.end();
        doc.pipe(res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.updateWarehouse = async (req, res) => {
    try {
        const wh = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, warehouse: wh });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteWarehouse = async (req, res) => {
    try {
        await Warehouse.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


/* PATCH /api/warehouse/:id/merge-racks  body: { rackLabels:[...] } */
exports.mergeRacks = async (req, res) => {
    const { rackLabels } = req.body;
    const wh = await Warehouse.findById(req.params.id);
    const toMerge = wh.racks.filter(r => rackLabels.includes(r.rackLabel));
    if (toMerge.length < 2) return res.status(400).json({ success: false });
    const merged = {
        rackLabel: rackLabels.join("+"),
        shelfLevels: Math.max(...toMerge.map(r => r.shelfLevels)),
        capacity: toMerge.reduce((s, r) => s + r.capacity, 0),
        levels: [].concat(...toMerge.map(r => r.levels)),
    };
    wh.racks = [...wh.racks.filter(r => !rackLabels.includes(r.rackLabel)), merged];
    await wh.save();
    res.json({ success: true, racks: wh.racks });
};

/* PUT /api/warehouse/:id/update-rack  body: rack object */
exports.updateRack = async (req, res) => {
    const rack = req.body;
    const wh = await Warehouse.findById(req.params.id);
    const idx = wh.racks.findIndex(r => r.rackLabel === rack.rackLabel);
    if (idx === -1) return res.status(404).json({ success: false });
    wh.racks[idx] = rack;
    await wh.save();
    res.json({ success: true, rack });
};

exports.toggleFavoriteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: "Warehouse not found" });
    warehouse.isFavorite = !warehouse.isFavorite;
    await warehouse.save();
    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFavoriteWarehouses = async (req, res) => {
  try {
    const favoriteWarehouses = await Warehouse.find({ isFavorite: true })
      .populate("contactPerson", "firstName lastName email")
      .populate("country", "name")
      .populate("state", "stateName")
      .populate("city", "cityName");
    res.json({ success: true, data: favoriteWarehouses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.zoneproducts = async (req, res) => {
  const { id, zone, cellIndex } = req.params;
  const { productId, productName, sku, quantity } = req.body;

  try {
    // Validate inputs
    console.log("Request params:", { id, zone, cellIndex });
    console.log("Request body:", { productId, productName, sku, quantity });
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (isNaN(cellIndex) || cellIndex < 0) {
      return res.status(400).json({ message: "Invalid cell index" });
    }

    // Find the warehouse
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    console.log("Warehouse found:", warehouse);

    // Find the zone
    const zoneObj = warehouse.blocks.find((z) => z.zone === zone);
    if (!zoneObj) {
      return res.status(404).json({ message: "Zone not found" });
    }
    console.log("Zone found:", zoneObj);

    // Validate cell index
    console.log("Cells in zone:", zoneObj.cells);
    if (cellIndex >= zoneObj.cells.length) {
      return res.status(400).json({ message: "Cell index out of bounds" });
    }

    // Check if product exists and get full product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product found:", product);

    // Create item object with full product details
    const itemToAdd = {
      productId: productId,
      productName: productName || product.productName,
      sku: sku || product.sku,
      quantity: quantity || 1,
      barcode: product.barcode || `BARCODE-${productId}`,
      assignedAt: new Date()
    };

    // Update the cell with the complete product information
    console.log("Cell before update:", zoneObj.cells[cellIndex]);
    zoneObj.cells[cellIndex].items.push(itemToAdd);
    console.log("Cell after update:", zoneObj.cells[cellIndex]);
    console.log("Item added:", itemToAdd);

    // Optionally update the product field (if you want to keep it for backward compatibility)
    zoneObj.cells[cellIndex].product = productId;

    // Save the updated warehouse
    await warehouse.validate(); // Validate before saving
    await warehouse.save();
    console.log("Warehouse saved successfully");

    res.status(200).json({ success: true, data: warehouse, addedItem: itemToAdd });
  } catch (error) {
    console.error("Error assigning product to cell:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Remove item from cell
exports.removeitem = async (req, res) => {
  try {
    const { id, zone, cellIndex } = req.params;
    const { productId, barcode } = req.body;

    console.log("=== REMOVE REQUEST RECEIVED ===");
    console.log("Request params:", { id, zone, cellIndex });
    console.log("Request body:", { productId, barcode });
    console.log("ProductId type:", typeof productId, "Value:", productId);
    console.log("Barcode type:", typeof barcode, "Value:", barcode);

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    const zoneData = warehouse.blocks.find((b) => b.zone === zone);
    if (!zoneData) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const cell = zoneData.cells[cellIndex];
    if (!cell) {
      return res.status(404).json({ message: "Cell not found" });
    }

    console.log("Cell items before removal:", cell.items);
    console.log("Looking for item with productId:", productId, "and barcode:", barcode);

    // Count items before removal
    const itemsBeforeRemoval = cell.items.length;

    // Remove item matching productId only (since we only store productId now)
    cell.items = cell.items.filter(
      (item) => {
        const productIdMatch = item.productId.toString() === productId;
        console.log(`Item comparison:
          - Item productId: ${item.productId} (${typeof item.productId}) vs Request: ${productId} (${typeof productId}) = ${productIdMatch}`);
        return !productIdMatch; // Remove the item if productId matches
      }
    );

    console.log("Cell items after removal:", cell.items);
    console.log(`Removed ${itemsBeforeRemoval - cell.items.length} items`);

    // Clear product if no items remain
    if (cell.items.length === 0) {
      cell.product = null;
    }

    await warehouse.save();
    res.status(200).json({ 
      message: "Item removed successfully", 
      removedCount: itemsBeforeRemoval - cell.items.length,
      remainingItems: cell.items.length 
    });
  } catch (err) {
    console.error("Error in removeitem:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};