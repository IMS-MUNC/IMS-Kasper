// controllers/invoiceWhatsappController.js
const { Types } = require("mongoose");
const { sendMail, verifyTransporter } = require("../utils/shareInvoice.js");
const { Twilio } = require("twilio");
const Invoice = require("../models/invoiceModel.js");
const Sale = require("../models/salesModel.js");
const Customer = require("../models/customerModel.js");
const { buildInvoicePdfBuffer } = require("../utils/invoicePdf.js");

const isDev = process.env.NODE_ENV !== "production";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Normalize to E.164 (very basic: if 10 digits, assume India)
function normalizePhone(p) {
  if (!p) return null;
  let s = String(p).replace(/[^\d+]/g, "");
  if (s.startsWith("+")) return s;
  if (/^\d{10}$/.test(s)) return `+91${s}`;
  return s; // best effort
}

exports.shareInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: quickly verify SMTP once per process start (cheap)
    try {
      await verifyTransporter();
    } catch (e) {
      // console.error("SMTP verification failed:", e);
      return res.status(500).json({
        message: "Email transport not configured correctly",
        ...(isDev ? { error: String(e?.message || e) } : {}),
      });
    }

    // 1) Load invoice with customer populated if possible
    let invoice = await Invoice.findById(id)
      .populate("customer", "name email phone")
      .lean();

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // 2) Load sale (optional, if you need extra fields)
    let sale = await Sale.findOne({ invoiceId: invoice.invoiceId })
      .populate("customer", "name email phone")
      .lean()
      .catch(() => null);

    // 3) Resolve email priority: body override > populated invoice > populated sale > fetch Customer by id
    let email =
      req.body?.email ||
      invoice?.customer?.email ||
      sale?.customer?.email ||
      null;

    if (!email) {
      let customerId =
        invoice?.customer?._id ||
        invoice?.customer ||
        sale?.customer?._id ||
        sale?.customer ||
        null;

      if (customerId && Types.ObjectId.isValid(String(customerId))) {
        const customerDoc = await Customer.findById(customerId)
          .select("name email phone")
          .lean();
        email = customerDoc?.email || email;
      }
    }

    if (!email) {
      return res.status(400).json({ message: "Customer email not found" });
    }

    // 4) Build PDF (wrap to catch template issues)
    let pdfBuffer;
    try {
      pdfBuffer = await buildInvoicePdfBuffer(invoice, sale || {});
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error("PDF builder did not return a Buffer");
      }
    } catch (e) {
      // console.error("PDF build error:", e);
      return res.status(500).json({
        message: "Failed to generate invoice PDF",
        ...(isDev ? { error: String(e?.message || e) } : {}),
      });
    }

    // 5) Send email
    try {
      await sendMail({
        to: email,
        subject: `Invoice ${invoice.invoiceId || invoice._id}`,
        text: "Please find your invoice attached.",
        attachments: [
          {
            filename: `invoice-${invoice.invoiceId || invoice._id}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    } catch (e) {
      // console.error("sendMail error:", e);
      return res.status(500).json({
        message: "Failed to send email",
        ...(isDev ? { error: String(e?.message || e) } : {}),
      });
    }

    return res.json({ ok: true, emailed: true, emailSentTo: email });
  } catch (err) {
    // console.error("shareInvoiceEmail fatal:", err);
    return res.status(500).json({
      message: "Failed to email invoice",
      ...(isDev ? { error: String(err?.message || err) } : {}),
    });
  }
};

// POST /api/invoice/whatsapp/:id
exports.shareInvoiceWhatsapp = async (req, res) => {
  try {
    const { id } = req.params;

    // Find invoice by _id; fall back to invoiceId string
    let invoice = null;
    if (Types.ObjectId.isValid(id)) {
      invoice = await Invoice.findById(id)
        .populate("customer", "name email phone")
        .lean();
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceId: id })
        .populate("customer", "name email phone")
        .lean();
    }
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Optional related sale
    const sale = await Sale.findOne({ invoiceId: invoice.invoiceId })
      .populate("customer", "name email phone")
      .lean()
      .catch(() => null);

    // Resolve phone: body override > populated invoice > populated sale > fetch Customer by id
    let phone = req.body?.phone || invoice?.customer?.phone || sale?.customer?.phone;

    if (!phone) {
      const customerId = invoice?.customer?._id || invoice?.customer || sale?.customer?._id || sale?.customer;
      if (customerId && Types.ObjectId.isValid(String(customerId))) {
        const c = await Customer.findById(customerId).select("phone").lean();
        phone = c?.phone;
      }
    }

    if (!phone) {
      return res.status(400).json({ message: "Customer phone not found" });
    }

    const toWhatsApp = `whatsapp:${normalizePhone(phone)}`;

    // Create a public media URL for Twilio to fetch (no auth)
    const mediaUrl = `${process.env.PUBLIC_BASE_URL}/api/invoice/public/pdf/${encodeURIComponent(invoice._id)}`;

    // Compose and send
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,  // 'whatsapp:+14155238886'
      to: toWhatsApp,
      body: `Hello ${invoice?.customer?.name || sale?.customer?.name || "there"}, here is your invoice ${invoice.invoiceId || ""}.`,
      mediaUrl: [mediaUrl], // Twilio downloads the PDF from here
    });

    return res.json({ ok: true, whatsapped: true, sid: msg.sid, to: toWhatsApp });
  } catch (err) {
    // console.error("shareInvoiceWhatsapp error:", err);
    return res.status(500).json({ message: "Failed to send on WhatsApp" });
  }
};

// GET /api/invoice/public/pdf/:id  (no auth)
// Serves the invoice PDF so Twilio can fetch it.
// NOTE: For production, protect this with a signed, short-lived token.
exports.publicInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;

    let invoice = null;
    if (Types.ObjectId.isValid(id)) {
      invoice = await Invoice.findById(id).lean();
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceId: id }).lean();
    }
    if (!invoice) return res.status(404).end();

    const sale = await Sale.findOne({ invoiceId: invoice.invoiceId }).lean().catch(() => null);

    const pdfBuffer = await buildInvoicePdfBuffer(invoice, sale || {}, {
      brandName: "MUN-C",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="invoice-${invoice.invoiceId || invoice._id}.pdf"`);
    res.setHeader("Cache-Control", "public, max-age=300"); // cache 5 minutes
    return res.send(pdfBuffer);
  } catch (e) {
    // console.error("publicInvoicePdf error:", e);
    return res.status(500).end();
  }
};

exports.shareInvoiceSMS = async (req, res) => {
  try {
    const { id } = req.params;

    // fetch invoice
    let invoice = await Invoice.findById(id)
      .populate("customer", "name phone")
      .lean();
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceId: id })
        .populate("customer", "name phone")
        .lean();
    }
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const sale = await Sale.findOne({ invoiceId: invoice.invoiceId })
      .populate("customer", "name phone")
      .lean()
      .catch(() => null);

    let phone =
      req.body?.phone ||
      invoice?.customer?.phone ||
      sale?.customer?.phone ||
      null;

    if (!phone) return res.status(400).json({ message: "Customer phone not found" });

    // normalize phone like before
    const normalizePhone = (p) => {
      let s = String(p).replace(/[^\d+]/g, "");
      if (s.startsWith("+")) return s;
      if (/^\d{10}$/.test(s)) return `+91${s}`;
      return s;
    };

    // This is NOT WhatsApp. This is SMS.
    const toSMS = normalizePhone(phone);

    // Public invoice PDF URL (same we used for WhatsApp)
    const mediaUrl = `${process.env.PUBLIC_BASE_URL}/api/invoice/public/pdf/${encodeURIComponent(invoice._id)}`;

    await client.messages.create({
      from: process.env.TWILIO_SMS_FROM, // NEW number for SMS
      to: toSMS,
      body: `Hello ${invoice.customer?.name || "there"}, your invoice ${invoice.invoiceId} is ready. Download: ${mediaUrl}`,
    });

    return res.json({ ok: true, sms: true, to: toSMS });
  } catch (err) {
    // console.error("SMS Error:", err);
    return res.status(500).json({ message: "Failed to send SMS" });
  }
};
