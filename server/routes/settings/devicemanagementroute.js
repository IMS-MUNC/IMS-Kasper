const express = require('express')
const {getUserDevices, deleteDevice} = require('../../controllers/settings/devicemanagementcontroller')

const devicemanagementrouter = express.Router();
// get devices by userId
devicemanagementrouter.get('/:userId', getUserDevices)

// Delete device by device ID
devicemanagementrouter.delete('/:id', deleteDevice)

module.exports = devicemanagementrouter;