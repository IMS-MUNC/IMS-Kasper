const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    to: { type: [String] },
    cc: { type: [String], default: [] },
    bcc: { type: [String], default: [] },
    // from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    from: {
      email: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      profileImage: { type: String },
    },
    subject: { type: String },
    body: { type: String },
    attachments: { type: [String], default: [] }, //stores file names or URLs
    isRead: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    image: { type: [String], default: [] },
    name: { type: String },
    starred: { type: Boolean, default: false },
    bin: { type: Boolean, default: false },
    type: { type: String, enum: ["inbox", "sent", "draft"], default: "sent" },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const emailModal = mongoose.model("Email", emailSchema);

module.exports = emailModal;
