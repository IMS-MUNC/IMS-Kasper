
const mongoose = require('mongoose');

const purchaseProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String },
    purchasePrice: { type: Number, required: true },
    returnQty: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: String, default: "" },
    tax: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    unitCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
}, { _id: false });

const purchaseReturnSchema = new mongoose.Schema({
    referenceNumber: String,
    returnedProducts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            returnQty: Number,
        }
    ],
    returnAmount: Number,
    returnDate: { type: Date, default: Date.now }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
    paymentType: {
        type: String,
        enum: ['Full', 'Partial'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Partial', 'Pending'],
        default: 'Pending',
    },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    dueDate: { type: Date },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Online', 'Cheque'],
    },
    transactionId: String,
    transactionDate: Date,
    onlineMethod: String,
}, { _id: false });

const imageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    debitNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DebitNote' }],
        purchaseDate: { type: Date, required: true },
        referenceNumber: { type: String, required: true },
        products: [purchaseProductSchema],
    orderTax: { type: Number, default: 0 },
    orderDiscount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    // --- Purchase Summary ---
    subTotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxableValue: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    totalItemCost: { type: Number, default: 0 },
        status: { type: String, required: true },
        description: { type: String },
        image: [imageSchema],
        payment: paymentSchema,
        returns: [purchaseReturnSchema],
        discountType: { type: String, default: 'Fixed' },
        discountAmount: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
        createdBy: {
            name: { type: String },
            email: { type: String }
        },
        updatedBy: {
            name: { type: String },
            email: { type: String }
        },
        createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);



// const mongoose = require('mongoose');

// const purchaseSchema = new mongoose.Schema({
//     supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
//     purchaseDate: Date,
//     referenceNumber: String,
//     products: [
//         {
//             product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             quantity: Number,
//             unit: String,
//             purchasePrice: Number,
//              returnQty: Number, // ✅ Add this line
//             discount: Number,
//             tax: Number,
//             taxAmount: { type: Number, default: 0 },
//             unitCost: Number,
//             totalCost: Number,
//         },
//     ],
//     orderTax: Number,
//     orderDiscount: Number,
//     shippingCost: Number,
//     grandTotal: Number,
//     status: String,
//     description: String,
//     image: [
//         {
//             url: String,
//             public_id: String,
//         },
//     ],

//     // ✅ Make payment an array of objects
//     payment: 
//         {
//             paymentType: {
//                 type: String,
//                 enum: ['Full', 'Partial'],
//                 required: true,
//             },
//             paymentStatus: {
//                 type: String,
//                 enum: ['Paid', 'Unpaid', 'Partial', 'Pending'],
//                 default: 'Pending',
//             },
//             paidAmount: { type: Number, default: 0 },
//             dueAmount: { type: Number, default: 0 },
//             dueDate: { type: Date },

//             paymentMethod: {
//                 type: String,
//                 enum: ['Cash', 'Online', 'Cheque'],
//             },
//             transactionId: String,
//             transactionDate: Date,
//             onlineMethod: String,
//         },
//         returns: [
//   {
//     referenceNumber: String,
//     returnedProducts: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//         returnQty: Number,
//       }
//     ],
//     returnAmount: Number,
//     returnDate: { type: Date, default: Date.now }
//   }
// ],

//          isDeleted: {
//     type: Boolean,
//     default: false,
//   },
    

//     createdAt: { type: Date, default: Date.now },
// },
//     { timestamps: true });

// module.exports = mongoose.model('Purchase', purchaseSchema);
