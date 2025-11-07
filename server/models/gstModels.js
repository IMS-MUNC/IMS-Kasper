// models/GstRecord.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddrSchema = new Schema({
    bnm: String,
    st: String,
    loc: String,
    bno: String,
    dst: String,
    locality: String,
    lt: String,
    pncd: String,
    landMark: String,
    stcd: String,
    geocodelvl: String,
    flno: String,
    lg: String
}, { _id: false });

const PradrSchema = new Schema({
    addr: AddrSchema,
    ntr: String
}, { _id: false });

const GstDataSchema = new Schema({
    stjCd: String,
    dty: String,
    stj: String,
    lgnm: String,
    adadr: { type: [String], default: [] },
    cxdt: String,
    nba: { type: [String], default: [] },
    gstin: { type: String, required: true, index: true, unique: true },
    lstupdt: String,
    ctb: String,
    rgdt: String,
    pradr: PradrSchema,
    tradeNam: String,
    ctjCd: String,
    sts: String,
    ctj: String,
    einvoiceStatus: String
}, { _id: false });

const GstRecordSchema = new Schema({
    data: GstDataSchema,
    status_cd: String,
    status_desc: String
}, { timestamps: true });

module.exports = mongoose.model('GstRecord', GstRecordSchema);



// const mongoose = require("mongoose");

// const gstSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     code: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     gstinCode: {
//         type: String,
//         required: true,
//         unique: true,
//     }
// }, { timestamps: true });

// module.exports = mongoose.model("Gst", gstSchema);
