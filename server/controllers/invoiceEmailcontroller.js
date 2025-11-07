// controllers/invoiceEmailcontroller.js
const { Types } = require("mongoose");
const { sendMail, verifyTransporter } = require("../utils/sendEmail");
const { buildInvoicePdfBuffer } = require("../utils/invoicePdf.js");

const Invoice = require("../models/invoiceModel.js");
const Sale = require("../models/salesModel.js");
const Customer = require("../models/customerModel.js");

const isDev = process.env.NODE_ENV !== "production";

exports.shareInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: quickly verify SMTP once per process start (cheap)
    try {
      await verifyTransporter();
    } catch (e) {
      console.error("SMTP verification failed:", e);
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
      console.error("PDF build error:", e);
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
      console.error("sendMail error:", e);
      return res.status(500).json({
        message: "Failed to send email",
        ...(isDev ? { error: String(e?.message || e) } : {}),
      });
    }

    return res.json({ ok: true, emailed: true, emailSentTo: email });
  } catch (err) {
    console.error("shareInvoiceEmail fatal:", err);
    return res.status(500).json({
      message: "Failed to email invoice",
      ...(isDev ? { error: String(err?.message || err) } : {}),
    });
  }
};
