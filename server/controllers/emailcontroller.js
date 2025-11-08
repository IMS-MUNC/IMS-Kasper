const EmailModal = require("../models/emailmodels.js");
const User = require("../models/usersModels.js");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mime = require('mime-types'); 

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
    
        // 🔥 Convert Cloudinary files into real buffers for attachments
    const fetchFileBuffer = async (url) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "binary");
    };

    const attachments = [];

    // Process docs / PDFs / Excel
    for (const file of normalizedAttachments) {
      attachments.push({
        filename: file.split("/").pop(), // last part of URL
        content: await fetchFileBuffer(file),
      });
    }
 


    // Process images (still as URLs is fine, but buffer works too)
    for (const img of normalizedImages) {
      attachments.push({
        filename: img.split("/").pop(),
        content: await fetchFileBuffer(img),
      });
    }

    const mailOptions = {
      from: sender.email,
      to: Array.isArray(to) ? to.join(",") : to,
      cc: cc.length ? cc.join(",") : undefined,
      bcc: bcc.length ? bcc.join(",") : undefined,
      subject,
      html: `<div style="white-space: pre-wrap;">${body}</div>`,
      // attachments: [
      //   ...normalizedAttachments.map((file) => ({ path: file })),
      //   ...normalizedImages.map((img) => ({ path: img })),
      // ],
      attachments,
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
  // console.error("❌ sendEmail Error (full):", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  res.status(500).json({
    error: error.message || "Unknown error occurred",
  });
}
};

//receiveEmail only returns inbox emails for the logged-in user, and getSentEmails returns only sent emails.


// const sendEmail = async (req, res) => {
//   try {
//     let {
//       to,
//       cc = [],
//       bcc = [],
//       subject,
//       body,
//     } = req.body;

//     // Ensure all are arrays
//     to = Array.isArray(to) ? to : [to].filter(Boolean);
//     cc = Array.isArray(cc) ? cc : [cc].filter(Boolean);
//     bcc = Array.isArray(bcc) ? bcc : [bcc].filter(Boolean);

//       const normalizedAttachments = req.files?.attachments
//       ? req.files.attachments.map((file) => file.path) // Cloudinary URL
//       : [];

//     const normalizedImages = req.files?.images
//       ? req.files.images.map((file) => file.path) // Cloudinary URL
//       : [];

//     const senderEmail = req.user.email.toLowerCase();
//     const existingUser = await User.findOne({ email: senderEmail });
//     const sender = existingUser
//       ? {
//           email: existingUser.email,
//           firstName: existingUser.firstName,
//           lastName: existingUser.lastName,
//           profileImage: existingUser.profileImage,
//         }
//       : {
//           email: senderEmail,
//           firstName: "Unknown",
//           lastName: "",
//           profileImage: null,
//         };

//          const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // app password
//       },
//     });

//     const mailOptions = {
//       from: sender.email,
//       to: Array.isArray(to) ? to.join(",") : to,
//       cc: cc.length ? cc.join(",") : undefined,
//       bcc: bcc.length ? bcc.join(",") : undefined,
//       subject,
//       html: `<div style="white-space: pre-wrap;">${body}</div>`,
//       attachments: [
//         ...normalizedAttachments.map((file) => ({ path: file })),
//         ...normalizedImages.map((img) => ({ path: img })),
//       ],
//     };

//     await transporter.sendMail(mailOptions);


//     // Save email for sender (sent)
//     const sentEmail = new EmailModal({
//       to,
//       cc,
//       bcc,
//       from: sender,
//       subject,
//       body,
//       attachments: normalizedAttachments,
//       image: normalizedImages,
//       type: "sent",
//       name: "You",
//       starred: false,
//       bin: false,
//       date: new Date(),
//     });
//     await sentEmail.save();

//     // Save email for each recipient (inbox), but skip the sender
//     const recipients = [...(Array.isArray(to) ? to : [to]), ...cc, ...bcc];

//     for (const recEmail of recipients) {
//       if (recEmail.toLowerCase() === senderEmail) continue; // skip sender

//       const user = await User.findOne({ email: recEmail.toLowerCase() });
//       const inboxEmail = new EmailModal({
//         to: [recEmail],
//         cc: [],
//         bcc: [],
//         from: sender,
//         subject,
//         body,
//         attachments: normalizedAttachments,
//         image: normalizedImages,
//         type: "inbox",
//         name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
//         starred: false,
//         bin: false,
//         isRead: false,
//         date: new Date(),
//       });

//       await inboxEmail.save();
//     }

//     res.status(201).json({ success: true, message: "Email sent" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Your sendEmail function:
// const sendEmail = async (req, res) => {
//   // Top-level try-catch already exists, but adding early checks
//   try {
//     // Early check: Auth
//     if (!req.user || !req.user.email) {
//       console.error('❌ No req.user.email - check auth middleware');
//       return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
//     }

//     // Early check: Env vars
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       console.error('❌ Missing EMAIL_USER or EMAIL_PASS env vars');
//       return res.status(500).json({ success: false, error: { message: 'Email config missing' } });
//     }

//     // Section 1: Logging request (this should always log now)
//     try {
//       console.log("📨 Incoming request body:", JSON.stringify(req.body, null, 2));
//       console.log("📎 Attachments files:", req.files?.attachments ? JSON.stringify(req.files.attachments, null, 2) : 'None');
//       console.log("📎 Images files:", req.files?.images ? JSON.stringify(req.files.images, null, 2) : 'None');
//     } catch (logError) {
//       console.error('❌ Log error:', logError.message);
//     }

//     // Section 2: Destructure body
//     let to, cc, bcc, subject, body;
//     try {
//       ({ to, cc = [], bcc = [], subject, body } = req.body);
//       console.log('✅ Body destructured:', { to, cc: cc.length, bcc: bcc.length, subject: subject?.substring(0, 50), hasBody: !!body });
//     } catch (destructureError) {
//       console.error('❌ Destructure error:', destructureError.message);
//       return res.status(400).json({ success: false, error: { message: 'Invalid request body' } });
//     }

//     // Ensure all are arrays
//     to = Array.isArray(to) ? to : [to].filter(Boolean);
//     cc = Array.isArray(cc) ? cc : [cc].filter(Boolean);
//     bcc = Array.isArray(bcc) ? bcc : [bcc].filter(Boolean);

//     // Section 3: Normalize files
//     let normalizedAttachments = [];
//     let normalizedImages = [];
//     try {
//       normalizedAttachments = req.files?.attachments ? req.files.attachments.map((file) => file.path) : [];
//       normalizedImages = req.files?.images ? req.files.images.map((file) => file.path) : [];
//       console.log('✅ Files normalized:', { attachments: normalizedAttachments.length, images: normalizedImages.length });
//     } catch (fileError) {
//       console.error('❌ File normalize error:', fileError.message);
//     }

//     // Section 4: Sender setup
//     let sender;
//     try {
//       const senderEmail = req.user.email.toLowerCase();
//       const existingUser = await User.findOne({ email: senderEmail });
//       sender = existingUser
//         ? {
//             email: existingUser.email,
//             firstName: existingUser.firstName,
//             lastName: existingUser.lastName,
//             profileImage: existingUser.profileImage,
//           }
//         : {
//             email: senderEmail,
//             firstName: "Unknown",
//             lastName: "",
//             profileImage: null,
//           };
//       console.log('✅ Sender:', sender.email);
//     } catch (userError) {
//       console.error('❌ User query error:', userError.message);
//       sender = { email: 'fallback@example.com', firstName: 'Unknown', lastName: '', profileImage: null }; // Fallback
//     }

//     // Section 5: Transporter
//     let transporter;
//     try {
//       transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });
//       console.log('✅ Transporter created');
//     } catch (transportError) {
//       console.error('❌ Transporter error:', transportError.message);
//       return res.status(500).json({ success: false, error: { message: 'Email transport failed' } });
//     }

//     // Section 6: Fetch buffers (your fetchFileBuffer is good)
//     const fetchFileBuffer = async (url) => {
//       try {
//         console.log(`Fetching buffer for: ${url}`);
//         const response = await axios.get(url, { responseType: "arraybuffer" });
//         const buffer = Buffer.from(response.data);
//         console.log(`Fetched buffer size for ${url}: ${buffer.length} bytes`);
//         return buffer;
//       } catch (fetchError) {
//         console.error(`❌ Failed to fetch buffer from ${url}:`, fetchError.message);
//         throw fetchError;
//       }
//     };

//     const attachments = [];

//     // Process attachments
//     try {
//       for (const file of normalizedAttachments) {
//         const buffer = await fetchFileBuffer(file);
//         const filename = file.split("/").pop();
//         attachments.push({
//           filename,
//           content: buffer,
//           contentType: mime.lookup(filename) || 'application/octet-stream',
//         });
//         console.log(`✅ Added attachment: ${filename} (${buffer.length} bytes)`);
//       }
//     } catch (attachError) {
//       console.error('❌ Attachments processing error:', attachError.message);
//       // Don't return; continue without attachments
//     }

//     // Process images
//     try {
//       for (const img of normalizedImages) {
//         const buffer = await fetchFileBuffer(img);
//         const filename = img.split("/").pop();
//         attachments.push({
//           filename,
//           content: buffer,
//           contentType: mime.lookup(filename) || 'image/jpeg',
//         });
//         console.log(`✅ Added image: ${filename} (${buffer.length} bytes)`);
//       }
//     } catch (imageError) {
//       console.error('❌ Images processing error:', imageError.message);
//       // Continue
//     }

//     console.log(`📎 Total attachments prepared: ${attachments.length}`);

//     // Section 7: Send mail
//     const mailOptions = {
//       from: sender.email,
//       to: Array.isArray(to) ? to.join(",") : to,
//       cc: cc.length ? cc.join(",") : undefined,
//       bcc: bcc.length ? bcc.join(",") : undefined,
//       subject,
//       html: `<div style="white-space: pre-wrap;">${body}</div>`,
//       attachments,
//     };

//     try {
//       console.log("🚀 Sending email...");
//       await transporter.sendMail(mailOptions);
//       console.log("✅ Email sent successfully via Nodemailer");
//     } catch (sendError) {
//       console.error('❌ SendMail error:', sendError.message);
//       return res.status(500).json({ success: false, error: { message: 'Failed to send email' } });
//     }

//     // Section 8: Save to DB (sent)
//     try {
//       const sentEmail = new EmailModal({
//         to,
//         cc,
//         bcc,
//         from: sender,
//         subject,
//         body,
//         attachments: normalizedAttachments,
//         image: normalizedImages,
//         type: "sent",
//         name: "You",
//         starred: false,
//         bin: false,
//         date: new Date(),
//       });
//       await sentEmail.save();
//       console.log('✅ Sent email saved to DB');
//     } catch (sentSaveError) {
//       console.error('❌ Sent save error:', sentSaveError.message);
//       // Don't fail whole response; log and continue
//     }

//     // Section 9: Save to recipients' inboxes
//     try {
//       const recipients = [...(Array.isArray(to) ? to : [to]), ...cc, ...bcc];
//       for (const recEmail of recipients) {
//         if (recEmail.toLowerCase() === senderEmail.toLowerCase()) continue;

//         const user = await User.findOne({ email: recEmail.toLowerCase() });
//         const inboxEmail = new EmailModal({
//           to: [recEmail],
//           cc: [],
//           bcc: [],
//           from: sender,
//           subject,
//           body,
//           attachments: normalizedAttachments,
//           image: normalizedImages,
//           type: "inbox",
//           name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
//           starred: false,
//           bin: false,
//           isRead: false,
//           date: new Date(),
//         });
//         await inboxEmail.save();
//       }
//       console.log(`✅ Inbox emails saved for ${recipients.length} recipients`);
//     } catch (inboxError) {
//       console.error('❌ Inbox save error:', inboxError.message);
//     }

//     res.status(201).json({ success: true, message: "Email sent" });
//   } catch (error) {
//     console.error("❌ sendEmail Error:", {
//       message: error.message,
//       stack: error.stack,
//       name: error.name,
//     });
//     res.status(500).json({
//       success: false,
//       error: {
//         message: error.message || "Unknown error occurred",
//         code: error.code || 'INTERNAL_ERROR',
//       },
//     });
//   }
// };
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
    // console.log("Error fetching inbox count:", error);
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

    // console.log("🔹 readInboxEmails called for emailId:", emailId, "by user:", userEmail);

    const email = await EmailModal.findOneAndUpdate(
      { _id: emailId, to: { $in: [userEmail] } },  // simpler and safer than regex
      { $set: { isRead: true } },
      { new: true }
    );

    // console.log("Email isRead status:", email.isRead);

    if (!email) {
      //  console.log("Email not found or not for this user");
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    // console.log("✅ Email marked as read:", email._id, "isRead:", email.isRead);

    //  console.log("Email after marking as read:", email);

    res.status(200).json({ success: true, data: email });
  } catch (error) {
    // console.log(error);
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
