const EmailModal = require("../models/emailmodels.js");
const User = require("../models/usersModels.js");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// const sendEmail = async (req, res) => {
//   try {
//     const { to, cc, bcc, from, subject, body, date, name, starred, bin } =
//       req.body;

//     const attachments = (req.files.attachments || []).map((file) => file.path);
//     const images = (req.files.images || []).map((file) => file.path);

//     // Ensure cc and bcc are always arrays
//     const validCC = Array.isArray(cc) ? cc : cc ? [cc] : [];
//     const validBCC = Array.isArray(bcc) ? bcc : bcc ? [bcc] : [];

//     // Log for debugging
//     console.log("Sending to:", to);
//     console.log("CC:", validCC);
//     console.log("BCC:", validBCC);
//     console.log("CC is valid array:", Array.isArray(validCC));
//     console.log("CC joined:", validCC && validCC.join(","));

//     // get logged in user Id and email
//     let senderEmail = req.user?.email || from || process.env.EMAIL_USER;
//     senderEmail = senderEmail.toLowerCase();
//     // check if sender exists in users collection
//     const existingUser = await User.findOne({ email: senderEmail }).select(
//       "firstName lastName email profileImage"
//     );
//     // normalize sender object
//     const sender = existingUser
//       ? {
//           email: existingUser.email,
//           firstName: existingUser.firstName || "",
//           lastName: existingUser.lastName || "",
//           profileImage: existingUser.profileImage || "",
//         }
//       : {
//           email: senderEmail,
//           firstName: "Unknown",
//           lastName: "",
//           profileImage: null,
//         };
// // Determine email type based on logged-in user
// let type = "sent"; // default for sender

// const currentUserEmail = req.user?.email.toLowerCase();

// // Check if current user is in recipients
// const recipients = [
//   ...(Array.isArray(to) ? to : [to]),
//   ...validCC,
//   ...validBCC
// ].map(e => e.toLowerCase());

// if (recipients.includes(currentUserEmail)) {
//   type = "inbox";
// }

//     const email = new EmailModal({
//       to,
//       cc: validCC,
//       bcc: validBCC,
//       from: sender,
//       subject,
//       body,
//       attachments,
//       date,
//       image: images,
//       name,
//       starred,
//       bin,
//       type,
//     });

//     const savedEmail = await email.save();

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true, // Use SSL
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: sender?.email,
//       to: Array.isArray(to) ? to.join(",") : to,
//       cc: validCC.length > 0 ? validCC.join(",") : undefined,
//       bcc: validBCC.length > 0 ? validBCC.join(",") : undefined,
//       subject,
//       html: `<div style="white-space: pre-wrap;">${body}</div>`,
//       attachments: [
//         ...attachments.map((file) => ({ path: file })),
//         ...images.map((img) => ({ path: img })),
//       ],
//     };

//     await transporter.sendMail(mailOptions);

//     res
//       .status(201)
//       .json({ success: true, message: "Email sent", data: savedEmail });
//     // console.log("FILES RECEIVED:", req.files);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to send email",
//       error: error.message,
//     });
//     console.log("ERROR", error);
//   }
// };

const sendEmail = async (req, res) => {
  try {
    let {
      to,
      cc = [],
      bcc = [],
      subject,
      body,
    } = req.body;

    // Ensure all are arrays
    to = Array.isArray(to) ? to : [to].filter(Boolean);
    cc = Array.isArray(cc) ? cc : [cc].filter(Boolean);
    bcc = Array.isArray(bcc) ? bcc : [bcc].filter(Boolean);

      const normalizedAttachments = req.files?.attachments
      ? req.files.attachments.map((file) => file.path) // Cloudinary URL
      : [];

    const normalizedImages = req.files?.images
      ? req.files.images.map((file) => file.path) // Cloudinary URL
      : [];

    const senderEmail = req.user.email.toLowerCase();
    const existingUser = await User.findOne({ email: senderEmail });
    const sender = existingUser
      ? {
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          profileImage: existingUser.profileImage,
        }
      : {
          email: senderEmail,
          firstName: "Unknown",
          lastName: "",
          profileImage: null,
        };

         const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: sender.email,
      to: Array.isArray(to) ? to.join(",") : to,
      cc: cc.length ? cc.join(",") : undefined,
      bcc: bcc.length ? bcc.join(",") : undefined,
      subject,
      html: `<div style="white-space: pre-wrap;">${body}</div>`,
      attachments: [
        ...normalizedAttachments.map((file) => ({ path: file })),
        ...normalizedImages.map((img) => ({ path: img })),
      ],
    };

    await transporter.sendMail(mailOptions);


    // Save email for sender (sent)
    const sentEmail = new EmailModal({
      to,
      cc,
      bcc,
      from: sender,
      subject,
      body,
      attachments: normalizedAttachments,
      image: normalizedImages,
      type: "sent",
      name: "You",
      starred: false,
      bin: false,
      date: new Date(),
    });
    await sentEmail.save();

    // Save email for each recipient (inbox), but skip the sender
    const recipients = [...(Array.isArray(to) ? to : [to]), ...cc, ...bcc];

    for (const recEmail of recipients) {
      if (recEmail.toLowerCase() === senderEmail) continue; // skip sender

      const user = await User.findOne({ email: recEmail.toLowerCase() });
      const inboxEmail = new EmailModal({
        to: [recEmail],
        cc: [],
        bcc: [],
        from: sender,
        subject,
        body,
        attachments: normalizedAttachments,
        image: normalizedImages,
        type: "inbox",
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        starred: false,
        bin: false,
        isRead: false,
        date: new Date(),
      });

      await inboxEmail.save();
    }

    res.status(201).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//receiveEmail only returns inbox emails for the logged-in user, and getSentEmails returns only sent emails.

const receiveEmail = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const emails = await EmailModal.find({
      type: "inbox",
      to: userEmail,
      deleted: false,
    }).sort({
      createdAt: -1,
    });
    const users = await User.find().select(
      "firstName lastName email profileImage"
    );
    const enrichRecipient = (emailAddr) => {
      if (!emailAddr) return null;
      const user = users.find(
        (u) => u.email.toLowerCase() === emailAddr.toLowerCase()
      );
      return user
        ? {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
          }
        : {
            email: emailAddr,
            firstName: "Unknown",
            lastName: "",
            profileImage: null,
          };
    };
    const formattedEmails = emails.map((email) => {
      return {
        ...email.toObject(),
        from: email.from?.email
          ? enrichRecipient(email.from.email)
          : {
              email: "unknown@example.com",
              firstName: "Unknown",
              lastName: "",
              profileImage: null,
            },
        to: email.to.map(enrichRecipient),
        cc: email.cc.map(enrichRecipient),
        bcc: email.bcc.map(enrichRecipient),
      };
    });
    res.status(200).json({ success: true, data: formattedEmails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
      error: error.message,
    });
  }
};
const getSentEmails = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    const emails = await EmailModal.find({
      type: "sent",
      "from.email": userEmail,
      deleted: false,
    }).sort({ createdAt: -1 });

    // fetch all users once
    const users = await User.find().select(
      "firstName lastName email profileImage"
    );

    const enrichRecipient = (emailAddr) => {
      if (!emailAddr) return null;
      const user = users.find(
        (u) => u.email.toLowerCase() === emailAddr.toLowerCase()
      );
      return user
        ? {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
          }
        : {
            email: emailAddr,
            firstName: "Unknown",
            lastName: "",
            profileImage: null,
          };
    };

    const formattedEmails = emails.map((email) => ({
      ...email.toObject(),
      from: email.from, // already normalized in sendEmail
      to: email.to.map(enrichRecipient),
      cc: email.cc.map(enrichRecipient),
      bcc: email.bcc.map(enrichRecipient),
    }));

    res.status(200).json({ success: true, data: formattedEmails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInboxCount = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    const count = await EmailModal.countDocuments({
      type: "inbox",
      to: { $in: [userEmail] },
      deleted: false,
      isRead: false,
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.log("Error fetching inbox count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inbox count",
      error: error.message,
    });
  }
};

// Mark an email as read
const readInboxEmails = async (req, res) => {

  try {
    const emailId = req.params.id;
    const userEmail = req.user.email.toLowerCase();

    console.log("🔹 readInboxEmails called for emailId:", emailId, "by user:", userEmail);

    const email = await EmailModal.findOneAndUpdate(
      { _id: emailId, to: { $in: [userEmail] } },  // simpler and safer than regex
      { $set: { isRead: true } },
      { new: true }
    );

    console.log("Email isRead status:", email.isRead);

    if (!email) {
       console.log("Email not found or not for this user");
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    console.log("✅ Email marked as read:", email._id, "isRead:", email.isRead);

     console.log("Email after marking as read:", email);

    res.status(200).json({ success: true, data: email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// backend/controllers/emailController.js
const getStarredEmails = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    const emails = await EmailModal.find({
      starred: true,
      deleted: false,
      $or: [
        { type: "inbox", to: userEmail },
        { type: "sent", "from.email": userEmail }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch starred emails",
      error: error.message,
    });
  }
};

const starredEmail = async (req, res) => {
  try {
    const email = await EmailModal.findByIdAndUpdate(
      req.params.id,
      { starred: req.body.starred },
      { new: true }
    );
    res.status(200).json({ success: true, data: email });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to updated starred",
      error: error.message,
    });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No IDs provided" });
    }
    const result = await EmailModal.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No emails found" });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} email(s) deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete emails",
      error: error.message,
    });
  }
};

const getDeletedEmails = async (req, res) => {
  try {
    const deletedEmails = await EmailModal.find({ deleted: true });
    res.status(200).json({ success: true, data: deletedEmails });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch deleted emails" });
  }
};

const permanentDeleteEmails = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No IDs provided" });
    }
    const result = await EmailModal.deleteMany({
      _id: { $in: ids },
      deleted: true,
    });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} email(s) permanently deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Faild to permanently delete",
      error: error.message,
    });
  }
};

module.exports = {
  sendEmail,
  receiveEmail,
  getSentEmails,
  getInboxCount,
  readInboxEmails,
  getStarredEmails,
  starredEmail,
  deleteEmail,
  getDeletedEmails,
  permanentDeleteEmails,
};
