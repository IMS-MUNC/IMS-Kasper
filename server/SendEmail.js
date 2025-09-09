const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});


const axios = require("axios");

const sendEmail = async (req, res) => { 
  try {
    const {
      to, cc, bcc, from, subject, body, date, name, starred, bin, type
    } = req.body;

      const attachments = (req.files.attachments || []).map((file) => file.path)
    const images = (req.files.images || []).map((file) => file.path);

    // Validate and convert cc and bcc to arrays if needed
    const validCC = Array.isArray(cc) ? cc : (cc ? [cc] : []);
    const validBCC = Array.isArray(bcc) ? bcc : (bcc ? [bcc] : []);

    const attachmentsUrls = (req.files.attachments || []).map((file) => file.path);
    const imageUrls = (req.files.images || []).map((file) => file.path);

    // check for recipient existence
    const existingRecipients = await EmailModal.findOne({
      type: "sent",
      $or: [
        { to: { $in: to } },
        { cc: { $in: to } },
        { bcc: { $in: to } }
      ]
    });

    const mailType = existingRecipients ? "sent" : "inbox";

    const email = new EmailModal({
      to,
      cc,
      bcc,
      from: from || process.env.EMAIL_USER,
      subject,
      body,
      attachments: attachmentsUrls,
      date,
      image: imageUrls,
      name,
      starred,
      bin,
      type: mailType,
    });

    const savedEmail = await email.save();

    // Fetch attachments from cloudinary URLs and convert to buffers
    const formattedAttachments = await Promise.all([
      ...attachmentsUrls.map(async (url) => {
        const filename = url.split('/').pop();
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return {
          filename,
          content: Buffer.from(response.data, 'binary'),
        };
      }),
      ...imageUrls.map(async (url) => {
        const filename = url.split('/').pop();
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return {
          filename,
          content: Buffer.from(response.data, 'binary'),
        };
      }),
    ]);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: from || process.env.EMAIL_USER,
     to: Array.isArray(to) ? to.join(",") : to,
      cc: validCC.length > 0 ? validCC.join(",") : undefined,
      bcc: validBCC.length > 0 ? validBCC.join(",") : undefined,
      subject,
      html: `<div style="white-space: pre-wrap;">${body}</div>`,
       attachments:[
        ...attachments.map((file) => ({ path: file })),
        ...images.map((img) => ({ path: img })),
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Email sent", data: savedEmail });
    console.log("FILES RECEIVED:", req.files);
  } catch (error) {
    console.error("ERROR", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
