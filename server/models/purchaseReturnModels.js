const mongoose = require('mongoose');

const purchaseReturnSchema = new mongoose.Schema({
    referenceNumber: String,
    originalPurchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    returnDate: { type: Date, default: Date.now },
    returnedProducts: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            purchasePrice: Number,
        },
    ],
    reason: String,
    refundMethod: {
        type: String,
        enum: ['Cash', 'Online', 'Credit'],
    },
    refundStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Rejected'],
        default: 'Pending',
    },
    notes: String,
}, { timestamps: true });

module.exports = mongoose.model('PurchaseReturn', purchaseReturnSchema);
