

// PurchaseReturn.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PurchaseReturn = ({ purchaseId }) => {
//   const [returns, setReturns] = useState([]);
//   const [returnProducts, setReturnProducts] = useState([]);
//   const [notes, setNotes] = useState("");
//   const [documents, setDocuments] = useState([]);
//   const [refundAmount, setRefundAmount] = useState(0);
//   const [referenceNumber, setReferenceNumber] = useState("");
//   const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);

//   useEffect(() => {
//     fetchReturns();
//   }, [purchaseId]);

//   const fetchReturns = async () => {
//     try {
//       const res = await axios.get(`/api/purchase/returns/${purchaseId}`);
//       setReturns(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleFileChange = (e) => {
//     setDocuments([...e.target.files]);
//   };

//   const handleProductChange = (index, field, value) => {
//     const updated = [...returnProducts];
//     updated[index][field] = value;
//     setReturnProducts(updated);
//     calculateRefund(updated);
//   };

//   const calculateRefund = (products) => {
//     let total = 0;
//     for (let item of products) {
//       const qty = Number(item.returnQty || 0);
//       const price = Number(item.unitPrice || 0);
//       total += qty * price;
//     }
//     setRefundAmount(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!returnProducts.length) return toast.error("Add return items");

//     const formData = new FormData();
//     formData.append("purchaseId", purchaseId);
//     formData.append("returnDate", returnDate);
//     formData.append("returnReferenceNumber", referenceNumber);
//     formData.append("notes", notes);
//     formData.append("refundAmount", refundAmount);
//     formData.append("returnProducts", JSON.stringify(returnProducts));
//     documents.forEach((doc) => formData.append("documents", doc));

//     try {
//       await axios.post("/api/purchase/return", formData);
//       toast.success("Return recorded");
//       setReturnProducts([]);
//       setNotes("");
//       setDocuments([]);
//       fetchReturns();
//     } catch (err) {
//       console.error(err);
//       toast.error("Error submitting return");
//     }
//   };

//   return (
//     <div className="purchase-return-container">
//       <h3>Return / Exchange Form</h3>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <input
//           type="text"
//           placeholder="Reference Number"
//           value={referenceNumber}
//           onChange={(e) => setReferenceNumber(e.target.value)}
//           required
//         />

//         <input
//           type="date"
//           value={returnDate}
//           onChange={(e) => setReturnDate(e.target.value)}
//         />

//         <textarea
//           placeholder="Return Notes"
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         ></textarea>

//         <input type="file" multiple onChange={handleFileChange} />

//         <h5>Returned Products</h5>
//         {returnProducts.map((item, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               placeholder="Product Name"
//               value={item.name || ""}
//               onChange={(e) => handleProductChange(index, "name", e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Return Quantity"
//               value={item.returnQty || 0}
//               onChange={(e) => handleProductChange(index, "returnQty", e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="Unit Price"
//               value={item.unitPrice || 0}
//               onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)}
//             />
//           </div>
//         ))}

//         <button type="button" onClick={() => setReturnProducts([...returnProducts, {}])}>
//           + Add Item
//         </button>

//         <h4>Total Refund: ₹{refundAmount}</h4>
//         <button type="submit">Submit Return</button>
//       </form>

//       <h3>Return & Exchange History</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Reference</th>
//             <th>Refund</th>
//             <th>Notes</th>
//             <th>Docs</th>
//           </tr>
//         </thead>
//         <tbody>
//           {returns.map((r, i) => (
//             <tr key={i}>
//               <td>{r.returnDate?.slice(0, 10)}</td>
//               <td>{r.returnReferenceNumber}</td>
//               <td>₹{r.refundAmount}</td>
//               <td>{r.notes}</td>
//               <td>
//                 {(r.documents || []).map((d, i) => (
//                   <a href={d.url} key={i} target="_blank" rel="noreferrer">
//                     View
//                   </a>
//                 ))}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PurchaseReturn;
// main
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import PurchaseReturnModal from "../../../../pages/Modal/PurchaseModals/PurchaseReturnModal";

// const PurchaseReturn = () => {
//   const [returns, setReturns] = useState([]);

//   console.log(returns)

//   useEffect(() => {
//     fetchReturns();
//   }, []);

//   const fetchReturns = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/purchases/returns/all`);
//       setReturns(res.data);
//     } catch (err) {
//       console.error("Failed to fetch returns", err);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="d-flex justify-content-between align-items-center my-3">
//         <h3>Purchase Returns</h3>
//         <button
//           className="btn btn-primary"
//           data-bs-toggle="modal"
//           data-bs-target="#return-modal"
//         >
//           + Create Return
//         </button>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Reference</th>
//               <th>Supplier</th>
//               <th>Date</th>
//               <th>Total Refund</th>
//               <th>Reason</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {returns.length ? (
//               returns.map((ret, i) => (
//                 <tr key={i}>
//                   <td>{ret.referenceNumber}</td>
//                   <td>{ret.supplier?.firstName} {ret.supplier?.lastName}</td>
//                   <td>{new Date(ret.returnDate).toLocaleDateString()}</td>
//                   <td>₹{ret.totalRefund}</td>
//                   <td>{ret.returnReason}</td>
//                   <td>{ret.refundStatus}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="6" className="text-center">No returns found</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <PurchaseReturnModal />
//     </div>
//   );
// };

import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../../../pages/config/config";

const DebitNoteList = () => {
  const [debitNotes, setDebitNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchDebitNotes = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        startDate,
        endDate,
      };
      const res = await axios.get(`${BASE_URL}/api/purchases/debit-notes`, { params });
      setDebitNotes(res.data.debitNotes || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch debit notes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebitNotes();
  }, [page, search, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset page
  };

  return (
    <div className="container mt-4">
      <h3>All Debit Notes</h3>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Search by Reference or Supplier"
            className="form-control"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Debit Note ID</th>
              <th>Purchase Ref#</th>
              <th>Supplier</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Returned Products</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(debitNotes) && debitNotes.length > 0 ? (
              debitNotes.map((note) => (
                <tr key={note._id}>
                  <td>{note.debitNoteId}</td>
                  <td>{note.referenceNumber || "N/A"}</td>
                  <td>{note.purchase?.supplier || "N/A"}</td>
                  <td>{new Date(note.returnDate).toLocaleDateString()}</td>
                  <td>{note.status}</td>
                  <td>
                    <ul>
                      {note.products.map((p, i) => (
                        <li key={i}>
                          {p.product?.productName} — Qty: {p.returnQty}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No debit notes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-sm btn-secondary"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm btn-secondary"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DebitNoteList;


// MID FINAL PurchaseReturn.jsx   
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { TbTrash } from "react-icons/tb";
// import Swal from "sweetalert2";
// import { CiCirclePlus } from "react-icons/ci";
// import BASE_URL from "../../../../pages/config/config";

// const ProductReturnModal = () => {
//   const [options, setOptions] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [referenceNumber, setReferenceNumber] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [returnReason, setReturnReason] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     setReturnDate(today);
//   }, []);

//   useEffect(() => {
//     axios.get(`${BASE_URL}/api/user/status/active`).then((res) => {
//       const opts = res.data.users.map((u) => ({
//         value: u._id,
//         label: `${u.firstName} ${u.lastName} (${u.email})`,
//       }));
//       setOptions(opts);
//     });
//   }, []);

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       if (searchTerm.trim()) {
//         axios
//           .get(`${BASE_URL}/api/products/search?name=${searchTerm}`)
//           .then((res) => setProducts(res.data));
//       } else {
//         setProducts([]);
//       }
//     }, 400);
//     return () => clearTimeout(delay);
//   }, [searchTerm]);

//   const handleSelectProduct = (product) => {
//     if (!selectedProducts.some((p) => p._id === product._id)) {
//       setSelectedProducts([
//         ...selectedProducts,
//         {
//           ...product,
//           quantity: 1,
//           discount: product.discountValue || 0,
//           tax: parseFloat(product.tax?.match(/\((\d+)%\)/)?.[1] || 0),
//           unit: product.unit || "",
//           returnPrice: product.purchasePrice || 0,
//         },
//       ]);
//     }
//     setProducts([]);
//     setSearchTerm("");
//   };

//   const handleRemoveProduct = async (id, name) => {
//     const confirmed = await Swal.fire({
//       title: "Remove Product?",
//       text: `Are you sure you want to remove "${name}" from the return list?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       confirmButtonText: "Yes, remove it!",
//     });
//     if (confirmed.isConfirmed) {
//       setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
//     }
//   };

//   const totalRefund = selectedProducts.reduce((acc, p) => {
//     const subTotal = p.quantity * p.returnPrice;
//     const discount = p.discount || 0;
//     const afterDiscount = subTotal - discount;
//     const taxAmt = (afterDiscount * (p.tax || 0)) / 100;
//     return acc + afterDiscount + taxAmt;
//   }, 0);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedImages(files);
//     setImagePreviews(files.map((file) => URL.createObjectURL(file)));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUser || selectedProducts.length === 0 || !returnReason) {
//       return alert("Please fill all required fields.");
//     }

//     const formData = new FormData();
//     formData.append("supplier", selectedUser.value);
//     formData.append("returnDate", returnDate);
//     formData.append("referenceNumber", referenceNumber);
//     formData.append("returnReason", returnReason);
//     formData.append("totalRefund", totalRefund);

//     selectedProducts.forEach((p, i) => {
//       formData.append(`products[${i}][productId]`, p._id);
//       formData.append(`products[${i}][quantity]`, p.quantity);
//       formData.append(`products[${i}][returnPrice]`, p.returnPrice);
//       formData.append(`products[${i}][discount]`, p.discount);
//       formData.append(`products[${i}][tax]`, p.tax);
//     });

//     selectedImages.forEach((img) => formData.append("images", img));

//     try {
//       await axios.post(`${BASE_URL}/api/returns/create`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire("Success", "Return created successfully", "success");
//       document.getElementById("close-return-modal").click();
//       // Optionally refresh parent data
//     } catch (err) {
//       console.error("Return error:", err);
//       Swal.fire("Error", "Failed to create return", "error");
//     }
//   };

//   // useEffect(() => {
//   //   axios.get(`${BASE_URL}/api/returns/reference/next`).then((res) =>
//   //     setReferenceNumber(res.data.referenceNumber)
//   //   );
//   // }, []);

//   return (
//     <div className="modal fade" id="return-modal">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <form onSubmit={handleSubmit}>
//             <div className="modal-header">
//               <h5 className="modal-title">Product Return</h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 id="close-return-modal"
//                 data-bs-dismiss="modal"
//               ></button>
//             </div>
//             <div className="modal-body">
//               {/* Supplier, Reference, Date */}
//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <label>Supplier *</label>
//                   <Select
//                     options={options}
//                     value={selectedUser}
//                     onChange={setSelectedUser}
//                     placeholder="Select Supplier"
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label>Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={returnDate}
//                     onChange={(e) => setReturnDate(e.target.value)}
//                   />
//                 </div>
//                 <div className="col-md-3">
//                   <label>Reference No</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={referenceNumber}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Product Search */}
//               <div className="mb-3">
//                 <label>Search Product</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by product name"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 {products.length > 0 && (
//                   <div className="border p-2 mt-2">
//                     {products.map((product) => (
//                       <div
//                         key={product._id}
//                         className="p-2 border-bottom"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleSelectProduct(product)}
//                       >
//                         <strong>{product.productName}</strong> - ₹
//                         {product.purchasePrice}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Selected Product Table */}
//               <div className="table-responsive">
//                 <table className="table table-bordered">
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Qty</th>
//                       <th>Price</th>
//                       <th>Discount</th>
//                       <th>Tax (%)</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedProducts.length ? (
//                       selectedProducts.map((p, i) => (
//                         <tr key={i}>
//                           <td>{p.productName}</td>
//                           <td>
//                             <input
//                               type="number"
//                               value={p.quantity}
//                               onChange={(e) =>
//                                 setSelectedProducts((prev) =>
//                                   prev.map((item, index) =>
//                                     index === i
//                                       ? { ...item, quantity: parseInt(e.target.value) }
//                                       : item
//                                   )
//                                 )
//                               }
//                               className="form-control"
//                               min="1"
//                             />
//                           </td>
//                           <td>₹{p.returnPrice}</td>
//                           <td>{p.discount}</td>
//                           <td>{p.tax}</td>
//                           <td>
//                             <button
//                               className="btn btn-sm btn-danger"
//                               onClick={() =>
//                                 handleRemoveProduct(p._id, p.productName)
//                               }
//                             >
//                               <TbTrash />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="text-center">
//                           No products selected
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Refund Total & Reason */}
//               <div className="mt-3">
//                 <h5>Total Refund: ₹ {totalRefund.toFixed(2)}</h5>
//                 <label className="mt-2">Return Reason *</label>
//                 <textarea
//                   className="form-control"
//                   rows="3"
//                   maxLength="200"
//                   value={returnReason}
//                   onChange={(e) => setReturnReason(e.target.value)}
//                 ></textarea>
//               </div>

//               {/* Image Upload */}
//               <div className="mt-3">
//                 <label>Upload Return Proof (optional)</label>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />
//                 <div className="d-flex gap-2 flex-wrap mt-2">
//                   {imagePreviews.map((img, i) => (
//                     <img
//                       src={img}
//                       key={i}
//                       alt="preview"
//                       height="60"
//                       style={{ borderRadius: "6px", objectFit: "cover" }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Submit Return
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductReturnModal;


// temp code 
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../../../pages/config/config";
// import { toast } from "react-toastify";

// const PurchaseReturn = ({ purchaseId }) => {
//   const [purchase, setPurchase] = useState(null);
//   const [returnProducts, setReturnProducts] = useState([]);
//   const [exchangeProducts, setExchangeProducts] = useState([]);
//   const [returnDate, setReturnDate] = useState("");
//   const [returnReferenceNumber, setReturnReferenceNumber] = useState("");
//   const [notes, setNotes] = useState("");
//   const [documents, setDocuments] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [refundTotal, setRefundTotal] = useState(0);

//   useEffect(() => {
//     fetchPurchaseDetails();
//     fetchReturnHistory();
//   }, []);

//   const fetchPurchaseDetails = async () => {
//     const { data } = await axios.get(`${BASE_URL}/api/purchase/${purchaseId}`);
//     setPurchase(data);
//     const mappedProducts = data.products.map(p => ({
//       productId: p.product._id,
//       productName: p.product.productName,
//       originalQty: p.quantity,
//       returnQty: 0,
//       exchangeQty: 0,
//       purchasePrice: p.purchasePrice,
//       reason: ""
//     }));
//     setReturnProducts(mappedProducts);
//     setExchangeProducts(mappedProducts);
//   };

//   const fetchReturnHistory = async () => {
//     const { data } = await axios.get(`${BASE_URL}/api/purchase/returns/${purchaseId}`);
//     setHistory(data);
//   };

//   const handleQtyChange = (index, value, type) => {
//     const newProducts = [...returnProducts];
//     const maxQty = newProducts[index].originalQty;
//     const qty = Math.max(0, Math.min(Number(value), maxQty));
//     if (type === "return") newProducts[index].returnQty = qty;
//     if (type === "exchange") newProducts[index].exchangeQty = qty;
//     setReturnProducts(newProducts);
//     calculateRefund(newProducts);
//   };

//   const calculateRefund = (products) => {
//     const total = products.reduce((acc, p) => acc + p.returnQty * p.purchasePrice, 0);
//     setRefundTotal(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append("originalPurchaseId", purchaseId);
//     formData.append("returnDate", returnDate);
//     formData.append("returnReferenceNumber", returnReferenceNumber);
//     formData.append("returnProducts", JSON.stringify(returnProducts.filter(p => p.returnQty > 0 || p.exchangeQty > 0)));
//     formData.append("notes", notes);
//     documents.forEach(doc => formData.append("documents", doc));

//     try {
//       const { data } = await axios.post(`${BASE_URL}/api/purchase/return`, formData);
//       toast.success("Return/Exchange submitted");
//       fetchReturnHistory();
//     } catch (err) {
//       toast.error("Failed to submit");
//     }
//   };

//   return (
//     <div>
//       <h3>Purchase Return / Exchange</h3>
//       {purchase && (
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Return Date</label>
//             <input type="text" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} placeholder="DD/MM/YYYY" required />
//           </div>
//           <div>
//             <label>Return Ref No.</label>
//             <input type="text" value={returnReferenceNumber} onChange={(e) => setReturnReferenceNumber(e.target.value)} required />
//           </div>
//           <div>
//             <label>Notes</label>
//             <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
//           </div>

//           <h5>Return / Exchange Products</h5>
//           <table>
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Qty Purchased</th>
//                 <th>Return Qty</th>
//                 <th>Exchange Qty</th>
//                 <th>Price</th>
//                 <th>Reason</th>
//               </tr>
//             </thead>
//             <tbody>
//               {returnProducts.map((prod, idx) => (
//                 <tr key={prod.productId}>
//                   <td>{prod.productName}</td>
//                   <td>{prod.originalQty}</td>
//                   <td><input type="number" min={0} max={prod.originalQty} value={prod.returnQty} onChange={(e) => handleQtyChange(idx, e.target.value, "return")} /></td>
//                   <td><input type="number" min={0} max={prod.originalQty} value={prod.exchangeQty} onChange={(e) => handleQtyChange(idx, e.target.value, "exchange")} /></td>
//                   <td>{prod.purchasePrice}</td>
//                   <td><input type="text" value={prod.reason} onChange={(e) => {
//                     const newProducts = [...returnProducts];
//                     newProducts[idx].reason = e.target.value;
//                     setReturnProducts(newProducts);
//                   }} /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div>
//             <label>Upload Return Documents</label>
//             <input type="file" multiple onChange={(e) => setDocuments(Array.from(e.target.files))} />
//           </div>

//           <div>
//             <strong>Total Refund: ₹{refundTotal.toFixed(2)}</strong>
//           </div>

//           <button type="submit">Submit Return / Exchange</button>
//         </form>
//       )}

//       <h4>Return / Exchange History</h4>
//       <table>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Reference</th>
//             <th>Amount</th>
//             <th>Products</th>
//           </tr>
//         </thead>
//         <tbody>
//           {history.map((r, i) => (
//             <tr key={i}>
//               <td>{new Date(r.purchaseDate).toLocaleDateString()}</td>
//               <td>{r.referenceNumber}</td>
//               <td>₹{r.grandTotal.toFixed(2)}</td>
//               <td>
//                 <ul>
//                   {r.products.map(p => (
//                     <li key={p.product}>{p.quantity} x ₹{p.purchasePrice}</li>
//                   ))}
//                 </ul>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PurchaseReturn;


// crm code 
// import React, { useEffect, useState } from 'react'
// import Purchase from '../Purchases/Purchase';
// import Warehouse from '../../warehouse/Warehouse';
// import ProductForm from '../../inventory/product/ProductCreate';
// import ProductList from '../../inventory/product/Product';

// const PurchaseReturn = (props) => {
//   const [activeSection, setActiveSection] = useState(
//     sessionStorage.getItem("activeSection") || "personalInfo"
//   );
//   useEffect(() => {
//     sessionStorage.setItem("activeSection", activeSection);
//   }, [activeSection]);

//   // Function to handle section toggling
//   const onToggleSection = (section) => {
//     setActiveSection(section);
//   };
//   return (
//     <div className={`col-12 col-lg-12 rounded-2  p-0 m-0  }`}  >
//       <div id="personalinfo" style={{ height: "100%", overflow: "hidden" }} className='bg-black'>
//         <div
//           style={{
//             background:
//               "var(--secondaryDashMenuColor)"
//             ,
//             color:
//               "var(--primaryDashMenuColor)",
//             maxWidth: "100%",
//             overflow: "auto",
//             borderBottom: "1px solid ",
//             borderRadius: " 10px 10px 0 0",
//           }}
//           className={`shift-pages w-100 d-flex justify-content-start   px-2 gap-2 px-0 mb-3  "bg-light" : "bg-black"
//                       }`}
//         >
//           <span
//             onClick={() => onToggleSection("personalInfo")}
//             style={{
//               whiteSpace: "pre",
//               borderBottom:
//                 activeSection === "personalInfo"
//                   ? "4px solid blue"
//                   : "none",
//               borderRadius: "0",
//               color
//                 : "var(--primaryDashMenuColor)",
//               cursor: "pointer",
//             }}
//             className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 "
//           >
//             Personal
//           </span>
//           <span
//             onClick={() => onToggleSection("companyInfo")}
//             style={{
//               whiteSpace: "pre",
//               borderBottom:
//                 activeSection === "companyInfo"
//                   ? "4px solid blue"
//                   : "none",
//               borderRadius: "0",
//               color
//                 : "var(--primaryDashMenuColor)",
//               cursor: "pointer",
//             }}
//             className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 "
//           >
//             Company
//           </span>
//           <span
//             onClick={() => onToggleSection("Educationalinfo")}
//             style={{
//               whiteSpace: "pre",
//               borderBottom:
//                 activeSection === "Educationalinfo"
//                   ? "4px solid blue"
//                   : "none",
//               borderRadius: "0",
//               color
//                 : "var(--primaryDashMenuColor)",
//               cursor: "pointer",
//             }}
//             className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 "
//           >
//             Education
//           </span>

//           <span
//             onClick={() => onToggleSection("Document")}
//             style={{
//               whiteSpace: "pre",
//               borderBottom:
//                 activeSection === "Document"
//                   ? "4px solid blue"
//                   : "none",
//               borderRadius: "0",
//               color
//                 : "var(--primaryDashMenuColor)",
//               cursor: "pointer",
//             }}
//             className="py-2 px-3 d-flex align-items-center px-1 justify-content-center gap-2 "
//           >
//             Documents
//           </span>

          
//         </div>
//         {activeSection === "personalInfo" && (
//           <div className="row">
//             <div
//               className="pb-3"
//               id="companyinfo"
//               style={{
//                 overflow: "hidden auto",
//                 height: "100%",
//                 width: "100%",
//                 scrollbarWidth: "thin",
//               }}
//             >
             
//               <div className="row w-100 container-fluid mx-auto justify-content-start py-3 row-gap-2">
//                 <div
//                   title={"Personal Details"}
//                   message={"You can view personal details here."}
//                 />
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className=" ">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className=" ">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Phone Number
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Emergency Contact
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Personal Email
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-lowercase rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Gender
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Date of Birth
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Blood Group
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     PAN Number
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-uppercase rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     UAN Number
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-uppercase rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Bank Name
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-uppercase rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>
//                 <div className="col-12 col-sm-6 d-flex flex-column">
//                   <label htmlFor="" className="  ">
//                     Bank Account Number
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control  text-capitalize rounded-2 
//                                 ? "bg-light text-dark border"
//                                 : "bg-dark text-light border-0"
//                                 }`}
//                   />
//                 </div>

//               </div>
            
//             </div>
//           </div>
//           // <div className=""></div>
//         )}
//         {activeSection === "companyInfo" && (
//        <div className="w-100 container ">
//             <Purchase data={props.data} />
//           </div>
//         )}
//         {activeSection === "Educationalinfo" && (
//           <div className="w-100 container ">
//             <Warehouse data={props.data} />
//           </div>
//         )}

//         {activeSection === "Document" && (
//           <div className="w-100 container ">
//             <ProductList data={props.data} />
//           </div>
//         )}
//         {activeSection === "WorkExperience" && (
//           <div className="w-100 container ">
//             <WorkExperience data={props.data} />
//           </div>
//         )}
//         {activeSection === "otherInfo" && (
//           <div className="w-100 container ">
//             <FamilyInfo data={props.data} />
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }

// export default PurchaseReturn




// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:5000";

// const ProductSearch = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   // Debounced Search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim()) {
//         axios
//           .get(`${BASE_URL}/api/products/search?name=${searchTerm}`)
//           .then((res) => setProducts(res.data))
//           .catch((err) => console.error("Search error:", err));
//       } else {
//         setProducts([]);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   const handleSelectProduct = (product) => {
//     const alreadyExists = selectedProducts.some(p => p._id === product._id);
//     if (!alreadyExists) {
//       setSelectedProducts([
//         ...selectedProducts,
//         { ...product, qty: 1, discount: 0, tax: 0 }
//       ]);
//     }
//     setProducts([]);
//     setSearchTerm("");
//   };

//   return (
//     <div className="container mt-4">
//       {/* Search Input */}
//       <div className="mb-3">
//         <label className="form-label">
//           Product Search <span className="text-danger">*</span>
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search Product by Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Search Result List */}
//       {products.length > 0 && (
//         <div className="search-results border rounded p-2 mb-3">
//           <strong>Search Results:</strong>
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="p-2 border-bottom cursor-pointer"
//               onClick={() => handleSelectProduct(product)}
//               style={{ cursor: "pointer" }}
//             >
//               {product.productName} — {product.brand?.name || "No brand"}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Selected Products Table */}
//       {selectedProducts.length > 0 && (
//         <div className="mt-4">
//           <h5>Selected Products</h5>
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead className="table-light">
//                 <tr>
//                   <th>Name</th>
//                   <th>Brand</th>
//                   <th>Qty</th>
//                   <th>Purchase Price</th>
//                   <th>Tax %</th>
//                   <th>Total Tax</th>
//                   <th>Total Cost</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedProducts.map((p, index) => {
//                   const quantity = p.qty || 1;
//                   const price = p.purchasePrice || 0;
//                   const tax = p.tax || 0;
//                   const taxAmount = ((quantity * price) * tax) / 100;
//                   const total = quantity * price + taxAmount;

//                   return (
//                     <tr key={index}>
//                       <td>{p.productName}</td>
//                       <td>{p.brand?.brandName || "N/A"}</td>
//                       <td>{quantity}</td>
//                       <td>₹{price}</td>
//                       <td>{tax}%</td>
//                       <td>₹{taxAmount.toFixed(2)}</td>
//                       <td>₹{total.toFixed(2)}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductSearch;














// ...existing imports...
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
// ...existing code...

const Purchase = () => {
  // ...existing state...
  const [selectedRows, setSelectedRows] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  // ...existing code...

  // Filtered purchases based on filters
  const filteredPurchases = purchases.filter((purchase) => {
    let supplierMatch = true;
    let dateMatch = true;
    let productMatch = true;

    if (supplierFilter) {
      supplierMatch =
        purchase.supplier &&
        `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
          .toLowerCase()
          .includes(supplierFilter.toLowerCase());
    }
    if (dateFilter) {
      const purchaseDate = new Date(purchase.purchaseDate)
        .toISOString()
        .slice(0, 10);
      dateMatch = purchaseDate === dateFilter;
    }
    if (productFilter) {
      productMatch = purchase.products.some((p) =>
        (p.product?.productName || "")
          .toLowerCase()
          .includes(productFilter.toLowerCase())
      );
    }
    return supplierMatch && dateMatch && productMatch;
  });

  // Export only selected and filtered rows to Excel
  const handleExportExcel = () => {
    const exportPurchases = selectedRows.length
      ? filteredPurchases.filter((purchase) =>
          selectedRows.includes(purchase._id)
        )
      : filteredPurchases;
    if (!exportPurchases.length) return;
    const rows = [];
    exportPurchases.forEach((purchase) => {
      purchase.products.forEach((p) => {
        rows.push({
          Supplier: purchase.supplier
            ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
            : "N/A",
          Reference: purchase.referenceNumber,
          Date: new Date(purchase.purchaseDate).toLocaleDateString(),
          Product: p.product?.productName || "",
          Quantity: p.quantity,
          Unit: p.unit,
          PurchasePrice: p.purchasePrice,
          Discount: p.discount,
          Tax: p.tax,
          TaxAmount: p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
          ShippingCost: purchase.shippingCost,
          ExtraExpense: purchase.orderTax,
          UnitCost: p.unitCost,
          TotalCost: p.totalCost,
          Status: purchase.status,
        });
      });
    });
    if (!rows.length) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchases");
    XLSX.writeFile(wb, "filtered_purchases.xlsx");
  };

  // Export only selected and filtered rows to PDF
  const handleExportPDF = () => {
    const exportPurchases = selectedRows.length
      ? filteredPurchases.filter((purchase) =>
          selectedRows.includes(purchase._id)
        )
      : filteredPurchases;
    if (!exportPurchases.length) return;
    const doc = new jsPDF("l", "pt", "a4");
    const columns = [
      "Supplier",
      "Reference",
      "Date",
      "Product",
      "Quantity",
      "Unit",
      "PurchasePrice",
      "Discount",
      "Tax",
      "TaxAmount",
      "ShippingCost",
      "ExtraExpense",
      "UnitCost",
      "TotalCost",
      "Status",
    ];
    const rows = [];
    exportPurchases.forEach((purchase) => {
      purchase.products.forEach((p) => {
        rows.push([
          purchase.supplier
            ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}`
            : "N/A",
          purchase.referenceNumber,
          new Date(purchase.purchaseDate).toLocaleDateString(),
          p.product?.productName || "",
          p.quantity,
          p.unit,
          p.purchasePrice,
          p.discount,
          p.tax,
          p.taxAmount || ((p.afterDiscount * p.tax) / 100 || 0),
          purchase.shippingCost,
          purchase.orderTax,
          p.unitCost,
          p.totalCost,
          purchase.status,
        ]);
      });
    });
    if (!rows.length) return;
    doc.text("Purchases", 40, 30);
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 7 },
      margin: { left: 20, right: 20 },
    });
    doc.save("filtered_purchases.pdf");
  };

  // ...existing code...

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* ...existing code... */}
        {/* Filter UI */}
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Supplier"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Product Name"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            />
          </div>
        </div>
        {/* ...existing code... */}
        <div className="table-top-head me-2">
          <li>
            <button
              type="button"
              className="icon-btn"
              title="Pdf"
              onClick={handleExportPDF}
            >
              <FaFilePdf />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="icon-btn"
              title="Export Excel"
              onClick={handleExportExcel}
            >
              <FaFileExcel style={{ color: "green" }} />
            </button>
          </li>
        </div>
        {/* ...existing code... */}
        {/* Use filteredPurchases for rendering table rows */}
        <tbody>
          {filteredPurchases.length === 0 ? (
            <tr>
              <td colSpan="16" className="text-center">
                No purchases found.
              </td>
            </tr>
          ) : (
            filteredPurchases.map((purchase) => (
              // ...existing row rendering...
            ))
          )}
        </tbody>
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default Purchase;

