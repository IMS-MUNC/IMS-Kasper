const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    quantityChanged: {
        type: Number,
        required: true,
    },
    priceChanged: {
        type: Number,
    },
  quantityReturned: {
    type: Number, // ✅ This stores return quantity
  },

    type: {
        type: String,
        enum: ['purchase', 'sale', 'return', 'adjustment', 'purchase-update'], // valid values only

        required: true,
    },
    notes: {
        type: String,
    },
});

module.exports = mongoose.model('StockHistory', stockHistorySchema);



// const mongoose = require('mongoose');

// const stockHistorySchema = new mongoose.Schema({
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     date: { type: Date, default: Date.now },
//     quantityChanged: Number,
//     type: { type: String, enum: ['purchase', 'sale', 'adjustment'] },
//     notes: String,
// });

// module.exports = mongoose.model('StockHistory', stockHistorySchema);
