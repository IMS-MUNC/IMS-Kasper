// const Settings = require("../models/purchaseSettingModels");

// // @desc    Get settings
// // @route   GET /api/settings
// // @access  Public/Admin (as needed)
// const getSettings = async (req, res) => {
//     try {
//         const settings = await Settings.findOne();
//         res.json(settings);
//     } catch (error) {
//         res.status(500).json({ message: "Server error while fetching settings." });
//     }
// };

// // @desc    Update or create settings
// // @route   PUT /api/settings
// // @access  Admin
// const updateSettings = async (req, res) => {
//     try {
//         const update = req.body;

//         let settings = await Settings.findOne();
//         if (!settings) {
//             settings = new Settings(update);
//         } else {
//             // Merge fields safely
//             settings.currencyCode = update.currencyCode || settings.currencyCode;
//             settings.currencySymbol = update.currencySymbol || settings.currencySymbol;
//             settings.percentageSymbol = update.percentageSymbol || settings.percentageSymbol;
//             settings.conversionRate = update.conversionRate || settings.conversionRate;
//         }

//         await settings.save();
//         res.json(settings);
//     } catch (error) {
//         console.error("Update settings error:", error);
//         res.status(500).json({ message: "Server error while updating settings." });
//     }
// };

// module.exports = {
//     getSettings,
//     updateSettings,
// };


const Settings = require("../models/purchaseSettingModels");

// @desc    Get settings
// @route   GET /api/settings
// @access  Public/Admin (as needed)
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Server error while fetching settings." });
    }
};

// @desc    Update or create settings
// @route   PUT /api/settings
// @access  Admin
const updateSettings = async (req, res) => {
    try {
        const update = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(update);
        } else {
            // Assign individual fields explicitly to avoid overwrite issues
            settings.currencyCode = update.currencyCode;
            settings.currencySymbol = update.currencySymbol;
            settings.percentageSymbol = update.percentageSymbol;
            settings.conversionRate = update.conversionRate;
        }

        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error("Settings update failed:", error);
        res.status(500).json({ message: "Server error while updating settings." });
    }
};

module.exports = {
    getSettings,
    updateSettings,
};



// const Settings = require("../models/purchaseSettingModels");

// // @desc    Get settings
// // @route   GET /api/settings
// // @access  Public/Admin (as needed)
// const getSettings = async (req, res) => {
//     try {
//         const settings = await Settings.findOne();
//         res.json(settings);
//     } catch (error) {
//         res.status(500).json({ message: "Server error while fetching settings." });
//     }
// };

// // @desc    Update or create settings
// // @route   PUT /api/settings
// // @access  Admin
// const updateSettings = async (req, res) => {
//     try {
//         const update = req.body;
//         let settings = await Settings.findOne();

//         if (!settings) {
//             settings = new Settings(update);
//         } else {
//             Object.assign(settings, update);
//         }

//         await settings.save();
//         res.json(settings);
//     } catch (error) {
//         res.status(500).json({ message: "Server error while updating settings." });
//     }
// };

// module.exports = {
//     getSettings,
//     updateSettings,
// };
