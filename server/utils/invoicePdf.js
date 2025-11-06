// utils/invoicePdf.js
const PDFDocument = require("pdfkit");

/**
 * Build a styled invoice PDF similar to your screenshot.
 * @param {Object} invoice - invoice doc (customer can be populated or an ObjectId; amounts in fields or derived)
 * @param {Object} sale - optional sale doc for fallbacks
 * @param {Object} opts - { logoPath?, brandName?, brandSub? }
 * @returns {Promise<Buffer>}
 */
function buildInvoicePdfBuffer(invoice, sale = {}, opts = {}) {
  const {
    logoPath,                          // optional: path to logo image (PNG/SVG/JPG)
    brandName = "MUN-C",               // top-centered brand text
    brandSub = "",                     // small superscript or TM
  } = opts;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 24 });
    const chunks = [];
    doc.on("data", d => chunks.push(d));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width;
    const H = doc.page.height;
    const M = 24;
    let y = M;

    // Helpers
    const fc = (n) => {
      if (isNaN(n)) n = 0;
      try { return ` ${Number(n).toFixed(2)}`; } catch { return ` ${n}`; }
    };
    const text = (t, x, yy, opts = {}) => doc.text(t ?? "", x, yy, opts);
    const label = (t) => doc.fillColor("#666").fontSize(9).text(t);
    const val = (t) => doc.fillColor("#111").fontSize(10).text(t);
    const line = (x1, y1, x2, y2) => doc.moveTo(x1, y1).lineTo(x2, y2).stroke();

    const safe = {
      // company (from/biller)
      companyName: invoice?.billing?.companyName || invoice?.from?.name,
      companyAddr1: invoice?.billing?.address1,
      companyEmail: invoice?.billing?.email,
      companyPhone: invoice?.billing?.phone,

      // customer
      custName: invoice?.customer?.name || sale?.customer?.name,
      custAddr1: invoice?.shipping?.address1,
      custEmail: invoice?.customer?.email || sale?.customer?.email,
      custPhone: invoice?.customer?.phone || sale?.customer?.phone,

      // invoice meta
      invNo: invoice?.invoiceId || sale?.invoiceId,
      invDate: dateFmt(invoice?.saleDate || sale?.saleDate || invoice?.createdAt || new Date()),
      dueDate: dateFmt(invoice?.dueDate || sale?.dueDate || invoice?.createdAt || new Date()),
    };

    // Brand row
    if (logoPath) {
      try {
        const imgH = 26;
        const imgW = 26;
        doc.image(logoPath, (W / 2) - (imgW + 6), y, { width: imgW, height: imgH });
        doc.fillColor("#0d6efd").fontSize(14).text(brandName, W / 2 + 6, y + 4, { width: 200, align: "left" });
      } catch {
        doc.fillColor("#0d6efd").fontSize(16).text(brandName, 0, y, { align: "center" });
      }
    } else {
      doc.fillColor("#0d6efd").fontSize(16).text(`${brandName}${brandSub ? ` ${brandSub}` : ""}`, 0, y, { align: "center" });
    }
    y += 28;

    // Three-column header box: From | To | GST Invoice
    const boxX = M, boxW = W - M * 2;
    const colW = Math.floor(boxW / 3);
    const headH = 96;

    doc.roundedRect(boxX, y, boxW, headH, 6).strokeColor("#e6e6e6").lineWidth(1).stroke();

    // Left: From
    doc.fontSize(11).fillColor("#111").text("From", boxX + 10, y + 8, { width: colW - 20, align: "left" });
    doc.moveDown(0.2);
    doc.fontSize(11).fillColor("#111").text(safe.companyName, { width: colW - 20, continued: false });
    doc.fontSize(9).fillColor("#444").text(safe.companyAddr1);
    doc.fontSize(9).text(`Email: ${safe.companyEmail}`);
    doc.fontSize(9).text(`Phone: ${safe.companyPhone}`);

    // Middle: To
    const midX = boxX + colW;
    doc.fontSize(11).fillColor("#111").text("To", midX + 10, y + 8, { width: colW - 20 });
    doc.fontSize(11).fillColor("#111").text(safe.custName, { width: colW - 20 });
    doc.fontSize(9).fillColor("#444").text(safe.custAddr1);
    doc.fontSize(9).text(`Email: ${safe.custEmail}`);
    doc.fontSize(9).text(`Phone: ${safe.custPhone}`);

    // Right: GST Invoice
    const rightX = boxX + colW * 2;
    doc.fontSize(11).fillColor("#111").text("GST Invoice", rightX + 10, y + 8, { width: colW - 20 });
    doc.fontSize(10).fillColor("#0d6efd").text(`Invoice No: #${safe.invNo}`);
    doc.fontSize(9).fillColor("#444").text(`Invoice Date: ${safe.invDate}`);
    doc.fontSize(9).fillColor("#444").text(`Due Date: ${safe.dueDate}`);

    y += headH + 14;

    // Table header
    const tX = boxX;
    const tW = boxW;
    const colDefs = [
      { key: "product", label: "Product", w: 70 },
      { key: "hsn", label: "HSN", w: 70, align: "center" },
      { key: "qty", label: "Qty", w: 40, align: "center" },
      { key: "price", label: "Selling Price", w: 70, align: "right" },
      { key: "disc", label: "Discount", w: 50, align: "center" },
      { key: "sub", label: "Sub Total", w: 60, align: "right" },
      { key: "discAmt", label: "Dis. Amount", w: 70, align: "right" },
      { key: "taxPct", label: "Tax (%)", w: 45, align: "center" },
      { key: "taxAmt", label: "Tax Amount", w: 60, align: "right" },
    ];
    const thH = 24;
    doc.rect(tX, y, tW, thH).fillAndStroke("#f7f9fc", "#e6e6e6");
    doc.fillColor("#111").fontSize(9);
    let x = tX + 8;
    colDefs.forEach(c => {
      doc.text(c.label, x, y + 6, { width: c.w - 12, align: c.align || "left" });
      x += c.w;
      // vertical separators (light)
      doc.strokeColor("#efefef").moveTo(x, y).lineTo(x, y + thH).stroke();
    });
    doc.strokeColor("#e6e6e6").moveTo(tX, y + thH).lineTo(tX + tW, y + thH).stroke();
    y += thH;

    // Table rows
    const rows = Array.isArray(invoice?.products) ? invoice.products : [];
    const totals = { subTotal: 0, discountSum: 0, taxableSum: 0, taxSum: 0 };

    const rowH = 24;
    const bottomRoom = 220; // keep space for totals + footer
    rows.forEach((item, idx) => {
      // page break
      if (y + rowH > H - bottomRoom) {
        doc.addPage();
        y = M;

        // re-draw table header on new page
        doc.rect(tX, y, tW, thH).fillAndStroke("#f7f9fc", "#e6e6e6");
        doc.fillColor("#111").fontSize(9);
        let xx = tX + 8;
        colDefs.forEach(c => {
          doc.text(c.label, xx, y + 6, { width: c.w - 12, align: c.align || "left" });
          xx += c.w;
          doc.strokeColor("#efefef").moveTo(xx, y).lineTo(xx, y + thH).stroke();
        });
        doc.strokeColor("#e6e6e6").moveTo(tX, y + thH).lineTo(tX + tW, y + thH).stroke();
        y += thH;
      }

      const calc = calcLine(item);
      totals.subTotal += calc.subTotal;
      totals.discountSum += calc.discountAmount;
      totals.taxableSum += calc.taxableAmount;
      totals.taxSum += calc.taxAmount;

      // zebra
      if (idx % 2 === 0) {
        doc.rect(tX, y, tW, rowH).fillAndStroke("#ffffff", "#f1f1f1");
      } else {
        doc.rect(tX, y, tW, rowH).fillAndStroke("#fbfdff", "#f1f1f1");
      }

      // cells
      doc.fillColor("#111").fontSize(9);
      let cx = tX + 8;
      const cells = [
        (item.productName || item.productId?.productName || "Item").toString(),
        item.hsnCode || item.hsn || "",
        fmtNum(calc.saleQty),
        fc(calc.price),
        item.discountType === "Percentage" ? `${fmtNum(calc.discount)} %` : ` ${fmtNum(calc.discount)}`,
        fc(calc.subTotal),
        fc(calc.discountAmount),
        `${fmtNum(calc.tax)} %`,
        fc(calc.taxAmount),
      ];
      colDefs.forEach((c, i) => {
        doc.text(cells[i], cx, y + 6, { width: c.w - 12, align: c.align || "left" });
        cx += c.w;
      });

      y += rowH;
    });

    // Bottom grand total (right aligned in table area)
    const cgst = totals.taxSum / 2;
    const sgst = totals.taxSum / 2;
    const grandTotal = totals.taxableSum + totals.taxSum;

    // Totals bar (like screenshot)
    y += 10;
    const barY = y;
    const barH = 60;
    doc.roundedRect(tX, barY, tW, barH, 6).strokeColor("#e6e6e6").stroke();

    const tbCols = [
      { label: "Sub Total", val: fc(totals.subTotal) },
      { label: "Discount", val: `- ${fc(totals.discountSum)}` },
      { label: "Taxable Value", val: fc(totals.taxableSum) },
      { label: "CGST", val: fc(cgst) },
      { label: "SGST", val: fc(sgst) },
      { label: "Total Amount", val: fc(grandTotal) },
    ];
    const tbW = Math.floor(tW / tbCols.length);

    tbCols.forEach((c, i) => {
      const bx = tX + i * tbW;
      doc.fontSize(9).fillColor("#666").text(c.label, bx + 10, barY + 10, { width: tbW - 20 });
      doc.fontSize(11).fillColor(i === tbCols.length - 1 ? "#0d6efd" : "#111").text(c.val, bx + 10, barY + 26, { width: tbW - 20, align: "left" });
      if (i < tbCols.length - 1) {
        doc.strokeColor("#efefef").moveTo(bx + tbW, barY).lineTo(bx + tbW, barY + barH).stroke();
      }
    });

    y += barH + 14;

    // Footer: terms | distributor | biller
    const footH = 70;
    const fCols = 3;
    const fW = Math.floor(tW / fCols);

    // Outer box
    doc.roundedRect(tX, y, tW, footH, 6).strokeColor("#e6e6e6").stroke();

    // Terms
    let fx = tX;
    doc.fontSize(10).fillColor("#111").text("Terms and Conditions", fx + 10, y + 10, { width: fW - 20 });
    doc.fontSize(9).fillColor("#555").text("Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.", { width: fW - 20 });
    doc.strokeColor("#efefef").moveTo(fx + fW, y).lineTo(fx + fW, y + footH).stroke();

    // Distributor
    fx += fW;
    doc.fontSize(10).fillColor("#111").text("FROM KASPHER DISTRIBUTORS", fx + 10, y + 10, { width: fW - 20, align: "center" });
    doc.fontSize(8).fillColor("#777").text("Authorised Signatory", fx + 10, y + 40, { width: fW - 20, align: "center" });
    doc.strokeColor("#efefef").moveTo(fx + fW, y).lineTo(fx + fW, y + footH).stroke();

    // Biller
    fx += fW;
    doc.fontSize(10).fillColor("#111").text("Biller", fx + 10, y + 10, { width: fW - 20, align: "center" });
    doc.fontSize(9).fillColor("#444").text("", fx + 10, y + 24, { width: fW - 20, align: "center" });

    // Finalize
    doc.end();
  });
}

// ---------- helpers ----------
function fmtNum(n) {
  const x = Number(n || 0);
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(2);
}

function dateFmt(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return "-";
  return dt.toLocaleDateString("en-IN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function calcLine(row) {
  const qty = Number(row?.saleQty || row?.quantity || 1);
  const price = Number(row?.sellingPrice || 0);
  const discount = Number(row?.discount || 0);
  const tax = Number(row?.tax || 0);

  const subTotal = qty * price;
  let discountAmount = 0;
  if (row?.discountType === "Percentage") discountAmount = (subTotal * discount) / 100;
  else if (row?.discountType === "Rupees" || row?.discountType === "Fixed") discountAmount = qty * discount;

  const taxableAmount = subTotal - discountAmount;
  const taxAmount = (taxableAmount * tax) / 100;

  return {
    saleQty: qty,
    price,
    discount,
    tax,
    subTotal,
    discountAmount,
    taxableAmount,
    taxAmount,
  };
}

module.exports = { buildInvoicePdfBuffer };
