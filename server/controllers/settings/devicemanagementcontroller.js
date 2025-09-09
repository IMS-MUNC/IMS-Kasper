const DeviceSession = require("../../models/settings/DeviceManagementmodal")


const getUserDevices = async (req, res) => {
    try {
        const devices = await DeviceSession.find({ userId: req.params.userId }).sort({ loginTime: -1 })
        res.json({ devices })
    } catch (error) {
        console.error("Error fetching devices:", error.message)
        res.status(500).json({ message: "Server error" })
    }
};


const deleteDevice = async (req, res) => {
    try {
    await DeviceSession.findByIdAndDelete(req.params.id)
    res.json({message:"Device deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

module.exports = { getUserDevices, deleteDevice };
