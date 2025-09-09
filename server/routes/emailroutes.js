const express = require("express");
const {
    sendEmail,
    receiveEmail,
    getSentEmails,
    getInboxCount,
    readInboxEmails,
    deleteEmail,
    getStarredEmails,
    starredEmail,
    getDeletedEmails,
    permanentDeleteEmails,
} = require("../controllers/emailcontroller.js");
const emailrouter = express.Router();
const upload = require("../config/upload.js");
const { verifyToken } = require("../middleware/Authentication/verifyToken.js");
const  {authMiddleware}=require("../middleware/auth.js")

emailrouter.post(
    "/send",
    verifyToken,
    authMiddleware,
    upload.fields([{ name: "attachments" }, { name: "images" }]),
    sendEmail
);
emailrouter.get("/receive", verifyToken,authMiddleware, receiveEmail);
emailrouter.get("/getsentemail", verifyToken,authMiddleware, getSentEmails);
// Get inbox count for the logged-in user
emailrouter.get("/inbox-count", verifyToken,authMiddleware, getInboxCount);
// Mark an email as read
emailrouter.put("/read/:id", verifyToken,authMiddleware, readInboxEmails);
emailrouter.get("/starred", verifyToken,authMiddleware, getStarredEmails);
emailrouter.put("/star/:id", verifyToken,authMiddleware, starredEmail);
emailrouter.post("/delete", verifyToken,authMiddleware, deleteEmail);
// get soft deleted mail
emailrouter.get("/deleted", verifyToken,authMiddleware, getDeletedEmails);
//delete permanently
emailrouter.post("/permanent-delete", verifyToken, authMiddleware,permanentDeleteEmails);

module.exports = emailrouter;
