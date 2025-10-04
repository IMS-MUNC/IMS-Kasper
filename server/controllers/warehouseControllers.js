const Warehouse = require("../models/warehouseModels");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

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





// const Warehouse = require("../models/warehouseModels");
// const { Parser } = require("json2csv");
// const PDFDocument = require("pdfkit");

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


// exports.getActiveWarehouses = async (req, res) => {
//     try {
//         const activeWarehouses = await Warehouse.find({ status: "Active" })
//             .select("warehouseName") // fetch only warehouseName + _id
//             .populate("country", "name")
//             .populate("state", "stateName")
//             .populate("city", "cityName");

//         res.json({ success: true, data: activeWarehouses });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


// exports.getWarehouseById = async (req, res) => {
//     try {
//         const warehouse = await Warehouse.findById(req.params.id)
//             .populate("contactPerson", "firstName lastName email")
//             .populate("country", "name")
//             .populate("state", "stateName")
//             .populate("city", "cityName");
//         if (!warehouse) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, warehouse });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// exports.exportRackLayoutCSV = async (req, res) => {
//     try {
//         const warehouse = await Warehouse.findById(req.params.id);
//         const flatRacks = warehouse.racks.flatMap(rack =>
//             rack.levels.map(level => ({
//                 warehouseName: warehouse.warehouseName,
//                 rackLabel: rack.rackLabel,
//                 level: level.level,
//                 barcode: level.barcode,
//                 rackCapacity: rack.capacity,
//             }))
//         );
//         const parser = new Parser();
//         const csv = parser.parse(flatRacks);
//         res.header("Content-Type", "text/csv");
//         res.attachment(`${warehouse.warehouseName}_rack_layout.csv`);
//         res.send(csv);
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// exports.exportRackLayoutPDF = async (req, res) => {
//     try {
//         const warehouse = await Warehouse.findById(req.params.id);
//         const doc = new PDFDocument();
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", `attachment; filename=\"${warehouse.warehouseName}_rack_layout.pdf\"`);
//         doc.text(`Rack Layout for ${warehouse.warehouseName}`, { underline: true });
//         warehouse.racks.forEach(r => {
//             doc.text(`Rack: ${r.rackLabel}`);
//             r.levels.forEach(l => doc.text(` - Level ${l.level}: ${l.barcode}`));
//             doc.moveDown();
//         });
//         doc.end();
//         doc.pipe(res);
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };



// exports.updateWarehouse = async (req, res) => {
//     try {
//         const wh = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json({ success: true, warehouse: wh });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// exports.deleteWarehouse = async (req, res) => {
//     try {
//         await Warehouse.findByIdAndDelete(req.params.id);
//         res.json({ success: true });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };


// /* PATCH /api/warehouse/:id/merge-racks  body: { rackLabels:[...] } */
// exports.mergeRacks = async (req, res) => {
//     const { rackLabels } = req.body;
//     const wh = await Warehouse.findById(req.params.id);
//     const toMerge = wh.racks.filter(r => rackLabels.includes(r.rackLabel));
//     if (toMerge.length < 2) return res.status(400).json({ success: false });
//     const merged = {
//         rackLabel: rackLabels.join("+"),
//         shelfLevels: Math.max(...toMerge.map(r => r.shelfLevels)),
//         capacity: toMerge.reduce((s, r) => s + r.capacity, 0),
//         levels: [].concat(...toMerge.map(r => r.levels)),
//     };
//     wh.racks = [...wh.racks.filter(r => !rackLabels.includes(r.rackLabel)), merged];
//     await wh.save();
//     res.json({ success: true, racks: wh.racks });
// };

// /* PUT /api/warehouse/:id/update-rack  body: rack object */
// exports.updateRack = async (req, res) => {
//     const rack = req.body;
//     const wh = await Warehouse.findById(req.params.id);
//     const idx = wh.racks.findIndex(r => r.rackLabel === rack.rackLabel);
//     if (idx === -1) return res.status(404).json({ success: false });
//     wh.racks[idx] = rack;
//     await wh.save();
//     res.json({ success: true, rack });
// };
