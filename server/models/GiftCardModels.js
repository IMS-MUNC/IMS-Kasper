const mongoose = require("mongoose");

const GiftcardSchema = new mongoose.Schema({
    giftCard: {
        type: String,
        required: true,
    },
    customer: {
        type: String,
        required: true,
    },
    issuedDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
    },
    status: {
        type: Boolean,
        required: true,
    }

},
{
    timestamps :true ,
});

module.exports = mongoose.model("GiftCard", GiftcardSchema);


