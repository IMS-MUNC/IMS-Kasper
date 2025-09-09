const express = require("express")
const localizationrouter = express.Router();
const { sendLocalization, getLocalization } = require("../../controllers/settings/Localizationcontroller")

localizationrouter.post('/update', sendLocalization)
localizationrouter.get('/get', getLocalization)

module.exports = localizationrouter;