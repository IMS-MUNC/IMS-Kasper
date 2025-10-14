

import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Modal } from "bootstrap";
import BASE_URL from "../../config/config";
import "../../../styles/purchase/purchase.css";

const EditPurchaseModal = ({ editData, onUpdate }) => {
  const [options, setOptions] = useState([]);
  // const [selectedUser, setSelectedSupplier] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [orderTax, setOrderTax] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Payment fields
  const [paymentType, setPaymentType] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [onlineMod, setOnlineMod] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");


  // console.log(":", paymentMethod, ":", transactionDate, ":", transactionId, ":", onlineMod, paymentStatus, dueAmount);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
const token = localStorage.getItem("token");
  // Load existing data
  useEffect(() => {
    if (editData) {
      setSelectedSupplier({
        value: editData.supplier?._id,
        label: `${editData.supplier?.firstName} ${editData.supplier?.lastName} (${editData.supplier?.email})`
      });

      setSelectedProducts((editData.products || []).map(p => ({
        _id: p.product?._id || "",
        productName: p.product?.productName || "",
        purchasePrice: p.purchasePrice || 0,
        quantity: p.quantity || 1,
        discount: p.discount || 0,
        tax: p.tax || 0,
        unitName: p.product?.unit || "",
        availableQty: p.product?.quantity || 0,
        images: p.product?.images || []
      })));

      setPurchaseDate(editData.purchaseDate ? editData.purchaseDate.substr(0, 10) : "");
      setReferenceNumber(editData.referenceNumber || "");
      setOrderTax(editData.orderTax || 0);
      setOrderDiscount(editData.orderDiscount || 0);
      setShippingCost(editData.shippingCost || 0);
      setStatus(editData.status || "");
      setDescription(editData.description || "");
      setImagePreviews(editData.images?.map(img => img.url) || []);

      if (editData.payment) {
        setPaymentType(editData.payment.paymentType || "");
        setPaidAmount(editData.payment.paidAmount || 0);
        setDueAmount(editData.payment.dueAmount || 0);
        setDueDate(editData.payment.dueDate ? editData.payment.dueDate.substr(0, 10) : "");
        setPaymentStatus(editData.payment.paymentStatus || "");
        setPaymentMethod(editData.payment.paymentMethod || "");
        setTransactionId(editData.payment.transactionId || "");
        setTransactionDate(editData.payment.transactionDate ? editData.payment.transactionDate.substr(0, 10) : "");
        setOnlineMod(editData.payment.onlineMethod || "");
      }
    }
  }, [editData]);

  // Fetch suppliers
  useEffect(() => {
    axios.get(`${BASE_URL}/api/suppliers/active`,{
       headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setOptions(res.data.users.map(u => ({
          value: u._id,
          label: `${u.firstName} ${u.lastName} (${u.supplierCode})`
        })));
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);



  // useEffect(() => {
  //   const fetchActiveSuppliers = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}/api/suppliers/active`);
  //       const suppliers = res.data.suppliers;

  //       const formattedOptions = suppliers.map((supplier) => ({
  //         value: supplier._id,
  //         label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
  //       }));

  //       setOptions(formattedOptions);
  //     } catch (err) {
  //       console.error("Error fetching active suppliers:", err);
  //     }
  //   };

  //   fetchActiveSuppliers();
  // }, []);

  // const handleSupplierChange = (selectedOption) => {
  //   setSelectedSupplier(selectedOption);
  // };

  // Calculate totals


  const totalItemCost = selectedProducts.reduce((acc, p) => {
    const subTotal = p.quantity * (p.purchasePrice || 0) - (p.discount || 0);
    const taxAmount = (subTotal * (p.tax || 0)) / 100;
    return acc + subTotal + taxAmount;
  }, 0);
  const grandTotal = totalItemCost + (orderTax || 0) + (shippingCost || 0) - (orderDiscount || 0);

  // Update due when payment type changes
  useEffect(() => {
    if (paymentType === "Partial") {
      const due = grandTotal - paidAmount;
      setDueAmount(due > 0 ? due : 0);
    } else {
      setPaidAmount(grandTotal);
      setDueAmount(0);
    }
  }, [paymentType, paidAmount, grandTotal]);

  // Image upload preview
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedSupplier || selectedProducts.length === 0 || !status) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("supplier", selectedSupplier.value);
    formData.append("purchaseDate", purchaseDate);
    formData.append("referenceNumber", referenceNumber);
    formData.append("orderTax", orderTax);
    formData.append("orderDiscount", orderDiscount);
    formData.append("shippingCost", shippingCost);
    formData.append("grandTotal", grandTotal);
    formData.append("status", status);
    formData.append("description", description);

    formData.append("payment[paymentType]", paymentType);
    formData.append("payment[paymentStatus]", paymentStatus);
    formData.append("payment[paidAmount]", paidAmount);
    formData.append("payment[dueAmount]", dueAmount);
    formData.append("payment[dueDate]", dueDate);
    formData.append("payment[paymentMethod]", paymentMethod);
    formData.append("payment[transactionId]", transactionId);
    formData.append("payment[transactionDate]", transactionDate);
    formData.append("payment[onlineMethod]", onlineMod);

    selectedProducts.forEach((p, i) => {
      const subTotal = p.quantity * p.purchasePrice;
      const afterDiscount = subTotal - p.discount;
      const taxAmount = (afterDiscount * p.tax) / 100;
      const totalCost = afterDiscount + taxAmount;
      const unitCost = totalCost / p.quantity;

      formData.append(`products[${i}][productId]`, p._id);
      formData.append(`products[${i}][quantity]`, p.quantity);
      formData.append(`products[${i}][purchasePrice]`, p.purchasePrice);
      formData.append(`products[${i}][discount]`, p.discount);
      formData.append(`products[${i}][tax]`, p.tax);
      formData.append(`products[${i}][taxAmount]`, taxAmount);
      formData.append(`products[${i}][unitCost]`, unitCost);
      formData.append(`products[${i}][totalCost]`, totalCost);
      formData.append(`products[${i}][unit]`, p.unitName || "");
    });

    selectedImages.forEach(file => formData.append("images", file));

    try {
      await axios.put(`${BASE_URL}/api/purchases/${editData._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,

         }
      });
      
      // Show success toast message
      const { toast } = await import('react-toastify');
      toast.success('Purchase updated successfully');
      
      // Call the onUpdate callback to refresh the table
      if (onUpdate) onUpdate();
      
      // Hide the modal with robust approach
      setTimeout(() => {
        if (window.$) {
          window.$('#edit-purchase').modal('hide');
          // Remove leftover backdrop and modal-open class
          setTimeout(() => {
            document.body.classList.remove('modal-open');
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(b => b.remove());
          }, 200);
        } else {
          const modal = document.getElementById('edit-purchase');
          if (modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
        }
      }, 300);

    } catch (err) {
      console.error("Update failed:", err);
      const { toast } = await import('react-toastify');
      toast.error('Failed to update purchase');
    }
  };

  return (
    <div className="modal fade" id="edit-purchase" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog purchase modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Edit Purchase</h4>
            {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Supplier, Date, Reference */}
              <div className="row mb-3">
                <div className="col-lg-4">
                  <label>Supplier<span className="text-danger">*</span></label>
                  <Select
                    value={selectedSupplier}
                    onChange={setSelectedSupplier}
                    options={options}
                    placeholder="Select supplier"
                    isClearable
                  />
                </div>
                <div className="col-lg-4">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                  />
                </div>
                <div className="col-lg-4">
                  <label>Reference Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={referenceNumber}
                    readOnly
                  />
                </div>
              </div>

              {/* Products Table */}
              <table className="table table-bordered mt-3">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax %</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((p, i) => (
                    <tr key={i}>
                      <td>
                        {p.images?.[0] && (
                          <img
                            src={p.images[0].url}
                            alt={p.productName}
                            style={{ width: "40px", marginRight: "8px" }}
                          />
                        )}
                        {p.productName}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={p.quantity}
                          min="1"
                          onChange={e =>
                            setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, quantity: parseInt(e.target.value, 10) || 1 } : item))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={p.purchasePrice}
                          min="0"
                          step="0.01"
                          onChange={e =>
                            setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, purchasePrice: parseFloat(e.target.value) || 0 } : item))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={p.discount}
                          min="0"
                          step="0.01"
                          onChange={e =>
                            setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, discount: parseFloat(e.target.value) || 0 } : item))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={p.tax}
                          min="0"
                          step="0.01"
                          onChange={e =>
                            setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, tax: parseFloat(e.target.value) || 0 } : item))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Order totals summary */}
              <div className="row">
                <div className="col-lg-12 d-flex justify-content-end">
                  <ul className="list-group" style={{ width: "300px" }}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Order Tax
                      <span>₹ {orderTax.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Discount
                      <span>₹ {orderDiscount.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Shipping
                      <span>₹ {shippingCost.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold text-success">
                      Grand Total
                      <span>₹ {grandTotal.toFixed(2)}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Inputs for tax, discount, shipping, status */}
              <div className="row mt-3">
                <div className="col-lg-3">
                  <label>Order Tax</label>
                  <input
                    type="number"
                    className="form-control"
                    value={orderTax}
                    min="0"
                    step="0.01"
                    onChange={e => setOrderTax(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Discount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={orderDiscount}
                    min="0"
                    step="0.01"
                    onChange={e => setOrderDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Shipping</label>
                  <input
                    type="number"
                    className="form-control"
                    value={shippingCost}
                    min="0"
                    step="0.01"
                    onChange={e => setShippingCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Payment Section */}
              <div className="row mt-4">
                <div className="col-lg-4">
                  <label>Payment Type</label>
                  <select
                    className="form-select"
                    value={paymentType}
                    onChange={e => {
                      setPaymentType(e.target.value);
                      setPaymentMethod("");
                    }}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Full">Full Payment</option>
                    <option value="Partial">Partial Payment</option>
                  </select>
                </div>

                <div className="col-lg-4">
                  <label>Payment Status</label>
                  <select
                    className="form-select"
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {(paymentType === "Full" || paymentType === "Partial") && (
                  <>
                    {paymentType === "Full" && (
                      <div className="col-lg-4">
                        <label>Total Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={grandTotal}
                          readOnly
                        />
                      </div>
                    )}

                    {paymentType === "Partial" && (
                      <>
                        <div className="col-lg-4">
                          <label>Paid Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            value={paidAmount}
                            max={grandTotal}
                            min="0"
                            step="0.01"
                            onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                            required
                          />
                        </div>
                        <div className="col-lg-4">
                          <label>Due Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            value={dueAmount.toFixed(2)}
                            readOnly
                          />
                        </div>
                        <div className="col-lg-4">
                          <label>Due Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            required={paymentType === "Partial"}
                          />
                        </div>
                      </>
                    )}

                    {/* Payment Method Radio Buttons */}
                    <div className="col-lg-12 mt-3">
                      <label>Payment Method</label>
                      <div className="d-flex gap-4">
                        {["Cash", "Online", "Cheque"].map(method => (
                          <div className="form-check" key={method}>
                            <input
                              type="radio"
                              id={method}
                              name="paymentMethod"
                              className="form-check-input"
                              checked={paymentMethod === method}
                              onChange={() => setPaymentMethod(method)}
                              required
                            />
                            <label htmlFor={method} className="form-check-label">
                              {method}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Online payment details */}
                    {paymentMethod === "Online" && (
                      <>
                        <div className="col-lg-4 mt-3">
                          <label>Online Payment Method</label>
                          <input
                            type="text"
                            className="form-control"
                            value={onlineMod}
                            onChange={e => setOnlineMod(e.target.value)}
                            placeholder="e.g. PayPal, Stripe"
                          />
                        </div>
                        <div className="col-lg-4 mt-3">
                          <label>Transaction ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={transactionId}
                            onChange={e => setTransactionId(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-4 mt-3">
                          <label>Transaction Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={transactionDate}
                            onChange={e => setTransactionDate(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Upload Images */}
              <div className="row mt-4">
                <div className="col-lg-12">
                  <label>Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="col-lg-12 mt-2 d-flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="preview"
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="row mt-4">
                <div className="col-lg-12">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add any notes or description..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{gap:'10px'}}>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" className="btn btn-primary">Update Purchase</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPurchaseModal;



// semi final
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { Modal } from "bootstrap";
// import BASE_URL from "../../config/config";
// import "../../../styles/purchase/purchase.css";

// const EditPurchaseModal = ({ editData, onUpdate }) => {
//   const [options, setOptions] = useState([]);
//   const [selectedUser, setSelectedSupplier] = useState(null);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [purchaseDate, setPurchaseDate] = useState("");
//   const [referenceNumber, setReferenceNumber] = useState("");
//   const [orderTax, setOrderTax] = useState(0);
//   const [orderDiscount, setOrderDiscount] = useState(0);
//   const [shippingCost, setShippingCost] = useState(0);
//   const [status, setStatus] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   console.log(referenceNumber);


//   // Payment states
//   const [paymentType, setPaymentType] = useState(""); // "Full" or "Partial"
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [dueAmount, setDueAmount] = useState(0);
//   const [dueDate, setDueDate] = useState("");

//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const [onlineMod, setOnlineMod] = useState("");
//   const [transactionDate, setTransactionDate] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");


//   // Load existing data
//   useEffect(() => {
//     if (editData) {
//       setSelectedSupplier({
//         value: editData.supplier?._id,
//         label: `${editData.supplier?.firstName} ${editData.supplier?.lastName} (${editData.supplier?.email})`
//       });

//       const enrichedProducts = (editData.products || []).map(p => ({
//         _id: p.product?._id || "",
//         productName: p.product?.productName || "",
//         purchasePrice: p.purchasePrice || 0,
//         quantity: p.quantity || 1,
//         discount: p.discount || 0,
//         tax: p.tax || 0,
//         unitName: p.product?.unit || "",
//         availableQty: p.product?.quantity || 0,
//         images: p.product?.images || []
//       }));

//       setSelectedProducts(enrichedProducts);
//       setPurchaseDate(editData.purchaseDate || "");
//       setReferenceNumber(editData.referenceNumber || "");
//       setOrderTax(editData.orderTax || 0);
//       setOrderDiscount(editData.orderDiscount || 0);
//       setShippingCost(editData.shippingCost || 0);
//       setStatus(editData.status || "");
//       setDescription(editData.description || "");
//       setImagePreviews(editData.images?.map(img => img.url) || []);
//       // Payment fields (correctly from editData.payment)
//       if (editData.payment) {
//         setPaymentType(editData.payment.paymentType || "");
//         setPaidAmount(editData.payment.paidAmount || 0);
//         setDueAmount(editData.payment.dueAmount || 0);
//         setDueDate(editData.payment.dueDate || "");
//         setPaymentStatus(editData.payment.paymentStatus || "");
//         setPaymentMethod(editData.payment.paymentMethod || "");
//         setTransactionId(editData.payment.transactionId || "");
//         setTransactionDate(editData.payment.transactionDate || "");
//         setOnlineMod(editData.payment.onlineMethod || "");
//       } else {
//         setPaymentType(""); setPaidAmount(0); setDueAmount(0); setDueDate("");
//         setPaymentStatus(""); setPaymentMethod(""); setTransactionId("");
//         setTransactionDate(""); setOnlineMod("");
//       }

//       // // Initialize payment data
//       // setPaymentType(editData.paymentType || "");
//       // setPaidAmount(editData.paidAmount || 0);
//       // setDueAmount(editData.dueAmount || 0);
//       // setDueDate(editData.dueDate || "");
//       // setPaymentStatus(editData.paymentStatus || "");
//     }
//   }, [editData]);

//   // Fetch suppliers
//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/user/status/active`)
//       .then(res => {
//         const users = res.data.users.map(u => ({
//           value: u._id,
//           label: `${u.firstName} ${u.lastName} (${u.email})`
//         }));
//         setOptions(users);
//       })
//       .catch(err => console.error("Failed to fetch users:", err));
//   }, []);

//   // Calculate totals
//   const totalItemCost = selectedProducts.reduce((acc, p) => {
//     const subTotal = p.quantity * (p.purchasePrice || 0) - (p.discount || 0);
//     const taxAmount = (subTotal * (p.tax || 0)) / 100;
//     return acc + subTotal + taxAmount;
//   }, 0);
//   const grandTotal = totalItemCost + (orderTax || 0) + (shippingCost || 0) - (orderDiscount || 0);

//   // Handle payment calculation
//   useEffect(() => {
//     if (paymentType === "Partial") {
//       const due = grandTotal - paidAmount;
//       setDueAmount(due > 0 ? due : 0);
//     } else {
//       setPaidAmount(grandTotal);
//       setDueAmount(0);
//     }
//   }, [paymentType, paidAmount, grandTotal]);

//   // Image change
//   const handleImageChange = e => {
//     const files = Array.from(e.target.files);
//     setSelectedImages(files);
//     setImagePreviews(files.map(f => URL.createObjectURL(f)));
//   };

//   // Submit
//   // const handleSubmit = async e => {
//   //   e.preventDefault();
//   //   if (!selectedUser || selectedProducts.length === 0 || !status) {
//   //     alert("Please fill required fields");
//   //     return;
//   //   }

//   //   const formData = new FormData();
//   //   formData.append("supplier", selectedUser.value);
//   //   formData.append("purchaseDate", purchaseDate);
//   //   formData.append("referenceNumber", referenceNumber);
//   //   formData.append("orderTax", orderTax);
//   //   formData.append("orderDiscount", orderDiscount);
//   //   formData.append("shippingCost", shippingCost);
//   //   formData.append("grandTotal", grandTotal);
//   //   formData.append("status", status);
//   //   formData.append("description", description);

//   //   formData.append("paymentType", paymentType);
//   //   formData.append("paidAmount", paidAmount);
//   //   formData.append("dueAmount", dueAmount);
//   //   formData.append("dueDate", dueDate);

//   //   selectedProducts.forEach((p, i) => {
//   //     formData.append(`products[${i}][productId]`, p._id);
//   //     formData.append(`products[${i}][productName]`, p.productName);
//   //     formData.append(`products[${i}][quantity]`, p.quantity);
//   //     formData.append(`products[${i}][purchasePrice]`, p.purchasePrice || 0);
//   //     formData.append(`products[${i}][discount]`, p.discount || 0);
//   //     formData.append(`products[${i}][tax]`, p.tax || 0);
//   //   });

//   //   selectedImages.forEach(f => formData.append("images", f));

//   //   try {
//   //     await axios.put(`${BASE_URL}/api/purchases/${editData._id}`, formData, {
//   //       headers: { "Content-Type": "multipart/form-data" }
//   //     });
//   //     if (onUpdate) onUpdate();
//   //     const modalEl = document.getElementById('edit-purchase');
//   //     const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
//   //     modal.hide();
//   //   } catch (err) {
//   //     console.error("Update failed:", err);
//   //   }
//   // };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!selectedUser || selectedProducts.length === 0 || !status) {
//       alert("Please fill required fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("supplier", selectedUser.value);
//     formData.append("purchaseDate", purchaseDate);
//     formData.append("referenceNumber", referenceNumber);
//     formData.append("orderTax", orderTax);
//     formData.append("orderDiscount", orderDiscount);
//     formData.append("shippingCost", shippingCost);
//     formData.append("grandTotal", grandTotal);
//     formData.append("status", status);
//     formData.append("description", description);

//     // Payment object inside "payment" prefix
//     formData.append("payment[paymentType]", paymentType);
//     formData.append("payment[paymentStatus]", paymentStatus);
//     formData.append("payment[paidAmount]", paidAmount);
//     formData.append("payment[dueAmount]", dueAmount);
//     formData.append("payment[dueDate]", dueDate);
//     formData.append("payment[paymentMethod]", paymentMethod);
//     formData.append("payment[transactionId]", transactionId);
//     formData.append("payment[transactionDate]", transactionDate);
//     formData.append("payment[onlineMethod]", onlineMod);

//     // Products array with required fields
//     selectedProducts.forEach((p, i) => {
//       const subTotal = p.quantity * p.purchasePrice;
//       const afterDiscount = subTotal - p.discount;
//       const taxAmount = (afterDiscount * p.tax) / 100;
//       const totalCost = afterDiscount + taxAmount;
//       const unitCost = totalCost / p.quantity;

//       formData.append(`products[${i}][productId]`, p._id);
//       formData.append(`products[${i}][quantity]`, p.quantity);
//       formData.append(`products[${i}][purchasePrice]`, p.purchasePrice);
//       formData.append(`products[${i}][discount]`, p.discount);
//       formData.append(`products[${i}][tax]`, p.tax);
//       formData.append(`products[${i}][taxAmount]`, taxAmount);
//       formData.append(`products[${i}][unitCost]`, unitCost);
//       formData.append(`products[${i}][totalCost]`, totalCost);
//       formData.append(`products[${i}][unit]`, p.unitName || "");
//     });

//     // Images
//     selectedImages.forEach(file => {
//       formData.append("images", file);
//     });

//     try {
//       await axios.put(`${BASE_URL}/api/purchases/${editData._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       if (onUpdate) onUpdate();
//       const modalEl = document.getElementById('edit-purchase');
//       const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
//       modal.hide();
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   };


//   return (
//     <div className="modal fade" id="edit-purchase">
//       <div className="modal-dialog purchase modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h4>Edit Purchase</h4>
//             <button type="button" className="close" data-bs-dismiss="modal"><span>×</span></button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               {/* Supplier, Date, Reference */}
//               <div className="row mb-3">
//                 <div className="col-lg-4">
//                   <label>Supplier<span className="text-danger">*</span></label>
//                   <Select value={selectedUser} onChange={setSelectedSupplier} options={options} placeholder="Select supplier" />
//                 </div>
//                 <div className="col-lg-4">
//                   <label>Date</label>
//                   <input type="text" className="form-control" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
//                 </div>
//                 <div className="col-lg-4">
//                   <label>Reference</label>
//                   <input type="text" className="form-control" value={referenceNumber} readOnly />
//                 </div>
//               </div>

//               {/* Products table */}
//               <table className="table mt-3">
//                 <thead>
//                   <tr><th>Product</th><th>Qty</th><th>Price</th><th>Discount</th><th>Tax%</th></tr>
//                 </thead>
//                 <tbody>
//                   {selectedProducts.map((p, i) => (
//                     <tr key={i}>
//                       <td>
//                         {p.images?.[0] && <img src={p.images[0].url} alt={p.productName} style={{ width: "40px", marginRight: "8px" }} />}
//                         {p.productName}
//                       </td>
//                       <td><input type="number" className="form-control" value={p.quantity} min="1" onChange={e =>
//                         setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, quantity: parseInt(e.target.value, 10) || 1 } : item))
//                       } /></td>
//                       <td><input type="number" className="form-control" value={p.purchasePrice} onChange={e =>
//                         setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, purchasePrice: parseFloat(e.target.value) || 0 } : item))
//                       } /></td>
//                       <td><input type="number" className="form-control" value={p.discount} onChange={e =>
//                         setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, discount: parseFloat(e.target.value) || 0 } : item))
//                       } /></td>
//                       <td><input type="number" className="form-control" value={p.tax} onChange={e =>
//                         setSelectedProducts(prev => prev.map((item, idx) => idx === i ? { ...item, tax: parseFloat(e.target.value) || 0 } : item))
//                       } /></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div class="row">
//                 <div class="col-lg-12 float-md-right">
//                   <div class="total-order m-2 mb-3 ms-auto">
//                     <ul class="border-1 rounded-1">
//                       <li class="border-0 border-bottom">
//                         <h4 class="border-0">Order Tax</h4>
//                         <h5>₹ {orderTax.toFixed(2)}</h5>
//                       </li>
//                       <li class="border-0 border-bottom">
//                         <h4 class="border-0">Discount</h4>
//                         <h5>₹ {orderDiscount.toFixed(2)}</h5>
//                       </li>
//                       <li class="border-0 border-bottom">
//                         <h4 class="border-0">Shipping</h4>
//                         <h5>₹ {shippingCost.toFixed(2)}</h5>
//                       </li>
//                       <li class="total border-0">
//                         <h4 class="border-0">Grand Total</h4>
//                         <h5 className="fw-semibold text-success">₹ {grandTotal.toFixed(2)}</h5>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* Totals */}
//               <div className="row mt-3">
//                 <div className="col-lg-3"><label>Order Tax</label><input type="number" className="form-control" value={orderTax} onChange={e => setOrderTax(parseFloat(e.target.value) || 0)} /></div>
//                 <div className="col-lg-3"><label>Discount</label><input type="number" className="form-control" value={orderDiscount} onChange={e => setOrderDiscount(parseFloat(e.target.value) || 0)} /></div>
//                 <div className="col-lg-3"><label>Shipping</label><input type="number" className="form-control" value={shippingCost} onChange={e => setShippingCost(parseFloat(e.target.value) || 0)} /></div>
//                 <div className="col-lg-3"><label>Status</label>
//                   <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
//                     <option>Select</option><option>Received</option><option>Pending</option>
//                   </select>
//                 </div>
//               </div>

//               {/* payment */}
//               <div className="row mt-3">
//                 <div className="col-lg-4">
//                   <label>Payment Type</label>
//                   <select
//                     className="form-select"
//                     value={paymentType}
//                     onChange={e => {
//                       setPaymentType(e.target.value);
//                       setPaymentMethod(""); // reset payment method when payment type changes
//                     }}
//                   >
//                     <option value="Full">Full Payment</option>
//                     <option value="Partial">Partial Payment</option>
//                   </select>
//                 </div>

//                 <div className="col-lg-4"><label>Payment Status</label>
//                   <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
//                     <option>Select</option><option>Paid</option><option>Unpaid</option><option>Partial</option><option>Pending</option>
//                   </select>
//                 </div>

//                 {(paymentType === "Full" || paymentType === "Partial") && (
//                   <>
//                     {paymentType === "Full" && (
//                       <div className="col-lg-4">
//                         <label>Total Amount</label>
//                         <input type="number" className="form-control" value={grandTotal} readOnly />
//                       </div>
//                     )}

//                     {paymentType === "Partial" && (
//                       <>
//                         <div className="col-lg-4">
//                           <label>Paid Amount</label>
//                           <input type="number" className="form-control" value={paidAmount} max={grandTotal} onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)} />
//                         </div>
//                         <div className="col-lg-4">
//                           <label>Due Amount</label>
//                           <input type="number" className="form-control" value={dueAmount.toFixed(2)} readOnly />
//                         </div>
//                         <div className="col-lg-4 mt-2">
//                           <label>Due Date</label>
//                           <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
//                         </div>
//                       </>
//                     )}


//                     <div className="col-lg-12 mt-3">
//                       <label>Payment Method</label>
//                       <div className="d-flex gap-4">
//                         {["Cash", "Online", "Cheque"].map((method) => (
//                           <div className="form-check" key={method}>
//                             <input
//                               type="radio"
//                               className="form-check-input"
//                               id={method}
//                               checked={paymentMethod === method}
//                               onChange={() => setPaymentMethod(method)}
//                             />
//                             <label className="form-check-label" htmlFor={method}>
//                               {method}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {(paymentMethod === "Online") && (
//                       <>
//                         <div className="col-lg-4 mt-2">
//                           <label>Online Payment Method</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={onlineMod}
//                             onChange={e => setOnlineMod(e.target.value)}
//                             placeholder="e.g. UPI, NEFT, RTGS"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction ID</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={transactionId}
//                             onChange={e => setTransactionId(e.target.value)}
//                             placeholder="Enter Transaction ID"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction Date</label>
//                           <input
//                             type="date"
//                             className="form-control"
//                             value={transactionDate}
//                             onChange={e => setTransactionDate(e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}
//                     {(paymentMethod === "Cheque") && (
//                       <>
//                         <div className="col-lg-4 mt-2">
//                           <label>Cheque No</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             value={transactionId}
//                             onChange={e => setTransactionId(e.target.value)}
//                             placeholder="Enter Cheque No"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction Date</label>
//                           <input
//                             type="date"
//                             className="form-control"
//                             value={transactionDate}
//                             onChange={e => setTransactionDate(e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}


//                   </>
//                 )}
//               </div>
//               {/* payment */}

//               {/* Images */}
//               <div className="mt-3">
//                 <label>Upload Images</label>
//                 <input type="file" multiple onChange={handleImageChange} />
//                 <div className="d-flex gap-2 mt-2 flex-wrap">{imagePreviews.map((src, i) => <img key={i} src={src} width="60" alt="" />)}</div>
//               </div>


//               {/* Description */}
//               <div className="mt-3">
//                 <label>Description</label>
//                 <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//               <button type="submit" className="btn btn-primary">Update</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPurchaseModal;




// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import BASE_URL from "../../config/config";
// import { CiCirclePlus } from "react-icons/ci";


// const EditPurchaseModal = () => {
//   return (
//     <div className="modal fade" id="edit-purchase">
//       <div className="modal-dialog purchase modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <div className="page-title">
//               <h4>Edit Purchase</h4>
//             </div>
//             <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>
//           <form >
//             <div className="modal-body">
//               <div className="row">
//                 <div className="col-lg-4 col-md-6 col-sm-12">
//                   <div className="mb-3 add-product">
//                     <label className="form-label">Supplier Name<span className="text-danger ms-1">*</span></label>
//                     <div className="row">
//                       <div className="col-lg-10 col-sm-10 col-10">
//                         <select className="select">
//                           <option>Select</option>
//                           <option>Apex Computers</option>
//                           <option>Dazzle Shoes</option>
//                           <option>Best Accessories</option>
//                         </select>
//                       </div>
//                       <div className="col-lg-2 col-sm-2 col-2 ps-0">
//                         <div className="add-icon tab">
//                           <a href="javascript:void(0);"><i data-feather="plus-circle" className="feather-plus-circles" /></a>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-lg-4 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Date<span className="text-danger ms-1">*</span></label>
//                     <div className="input-groupicon calender-input">
//                       <i data-feather="calendar" className="info-img" />
//                       <input type="text" className="datetimepicker form-control p-2" placeholder="24 Dec 2024" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-lg-4 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Supplier<span className="text-danger ms-1">*</span></label>
//                     <input type="text" className="form-control" defaultValue="Elite Retail" />
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="mb-3">
//                     <label className="form-label">Product<span className="text-danger ms-1">*</span></label>
//                     <input type="text" className="form-control" placeholder="Search Product" />
//                   </div>
//                 </div>
//                 <div className="col-lg-12">
//                   <div className="modal-body-table">
//                     <div className="table-responsive">
//                       <table className="table">
//                         <thead>
//                           <tr>
//                             <th className="bg-secondary-transparent p-3">Product Name</th>
//                             <th className="bg-secondary-transparent p-3">QTY</th>
//                             <th className="bg-secondary-transparent p-3">Purchase Price($) </th>
//                             <th className="bg-secondary-transparent p-3">Discount($) </th>
//                             <th className="bg-secondary-transparent p-3">Tax %</th>
//                             <th className="bg-secondary-transparent p-3">Tax Amount($)</th>
//                             <th className="text-end bg-secondary-transparent p-3">Unit Cost($)</th>
//                             <th className="text-end bg-secondary-transparent p-3">Total Cost ($)
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           <tr>
//                             <td className="p-4">
//                               <div className="d-flex align-items-center">
//                                 <a href="javascript:void(0);" className="avatar avatar-md me-2">
//                                   <img src="assets/img/products/stock-img-02.png" alt="product" />
//                                 </a>
//                                 <a href="javascript:void(0);">Nike Jordan</a>
//                               </div>
//                             </td>
//                             <td className="p-4">
//                               <div className="product-quantity">
//                                 <span className="quantity-btn">+<i data-feather="plus-circle" className="plus-circle" /></span>
//                                 <input type="text" className="quntity-input" defaultValue={10} />
//                                 <span className="quantity-btn"><i data-feather="minus-circle" className="feather-search" /></span>
//                               </div>
//                             </td>
//                             <td className="p-4">300</td>
//                             <td className="p-4">50</td>
//                             <td className="p-4">0</td>
//                             <td className="p-4">0.00</td>
//                             <td className="p-4">300</td>
//                             <td className="p-4">600</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-lg-12 float-md-right">
//                   <div className="total-order m-2 mb-3 ms-auto">
//                     <ul className="border-1 rounded-1">
//                       <li className="border-0 border-bottom">
//                         <h4 className="border-0">Order Tax</h4>
//                         <h5>$ 0.00</h5>
//                       </li>
//                       <li className="border-0 border-bottom">
//                         <h4 className="border-0">Discount</h4>
//                         <h5>$ 0.00</h5>
//                       </li>
//                       <li className="border-0 border-bottom">
//                         <h4 className="border-0">Shipping</h4>
//                         <h5>$ 0.00</h5>
//                       </li>
//                       <li className="total border-0">
//                         <h4 className="border-0">Grand Total</h4>
//                         <h5>$1800.00</h5>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-lg-3 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Order Tax<span className="text-danger ms-1">*</span></label>
//                     <input type="text" className="form-control" defaultValue={0} />
//                   </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Discount<span className="text-danger ms-1">*</span></label>
//                     <input type="text" className="form-control" defaultValue={0} />
//                   </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Shipping<span className="text-danger ms-1">*</span></label>
//                     <input type="text" className="form-control" defaultValue={0} />
//                   </div>
//                 </div>
//                 <div className="col-lg-3 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">Status<span className="text-danger ms-1">*</span></label>
//                     <select className="select">
//                       <option>Select</option>
//                       <option>Received</option>
//                       <option>Pending</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="mb-3 summer-description-box">
//                     <label className="form-label">Description</label>
//                     <div id="summernote2">
//                     </div>
//                     <p className="mt-1">Maximum 60 Words</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
//               <button type="submit" className="btn btn-primary">Save Changes </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default EditPurchaseModal;


