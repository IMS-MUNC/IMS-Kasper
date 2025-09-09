// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../../config/config";

// const AddDebitNoteModal = ({ purchaseData, onReturnCreated }) => {
//   const [formData, setFormData] = useState({
//     referenceNumber: "",
//     supplier: "",
//     returnDate: "",
//     products: [],
//     reason: "",
//   });

//   useEffect(() => {
//     if (purchaseData) {
//       setFormData({
//         referenceNumber: purchaseData.referenceNumber,
//         supplier: purchaseData.supplier?._id || "",
//         returnDate: new Date().toISOString().slice(0, 10),
//         products: purchaseData.products || [],
//         reason: "",
//       });
//     }
//   }, [purchaseData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleProductChange = (index, key, value) => {
//     const updatedProducts = [...formData.products];
//     updatedProducts[index][key] = value;
//     setFormData({ ...formData, products: updatedProducts });
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post(`${BASE_URL}/api/returns`, formData);
//       if (onReturnCreated) onReturnCreated();
//       window.bootstrap.Modal.getInstance(document.getElementById("add-return-debit-note")).hide();
//     } catch (error) {
//       console.error("Failed to create return debit note", error);
//     }
//   };

//   return (
//     <div className="modal fade" id="add-return-debit-note" tabIndex="-1">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Return Debit Note</h5>
//             <button type="button" className="btn-close" data-bs-dismiss="modal" />
//           </div>
//           <div className="modal-body">
//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <label>Reference Number</label>
//                 <input className="form-control" value={formData.referenceNumber} disabled />
//               </div>
//               <div className="col-md-6">
//                 <label>Return Date</label>
//                 <input type="date" className="form-control" name="returnDate" value={formData.returnDate} onChange={handleChange} />
//               </div>
//               <div className="col-md-12 mt-2">
//                 <label>Reason for Return</label>
//                 <textarea className="form-control" name="reason" value={formData.reason} onChange={handleChange} rows="2" />
//               </div>
//             </div>

//             <h6>Products</h6>
//             {formData.products.map((prod, idx) => (
//               <div key={idx} className="row align-items-center mb-2">
//                 <div className="col-md-4">{prod.product?.productName}</div>
//                 <div className="col-md-4">
//                   <input
//                     type="number"
//                     min="0"
//                     className="form-control"
//                     value={prod.returnQty || ""}
//                     onChange={(e) => handleProductChange(idx, "returnQty", e.target.value)}
//                     placeholder="Return Qty"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={prod.reason || ""}
//                     onChange={(e) => handleProductChange(idx, "reason", e.target.value)}
//                     placeholder="Reason (optional)"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//             <button className="btn btn-primary" onClick={handleSubmit}>Create Return Note</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddDebitNoteModal;



import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../../styles/creditDebit/debitnote.css";
import Select from "react-select";
import BASE_URL from '../../config/config';
import { TbTrash } from 'react-icons/tb';


import { useLocation } from "react-router-dom";

const AddDebitNoteModals = ({ purchaseData, onReturnCreated }) => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // On mount, check for ?reference=...&products=... in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get("reference");
        const productIds = params.get("products")?.split(",").filter(Boolean) || [];
        if (ref) setForm((prev) => ({ ...prev, referenceNumber: ref }));
        if (productIds.length) {
            // Fetch product details for these IDs
            fetchProductsByIds(productIds);
        }
    }, [location.search]);

    // Helper to fetch product details by IDs and auto-select them
    const fetchProductsByIds = async (ids) => {
        try {
            // You may need to adjust API endpoint as per your backend
            const res = await axios.get(`/api/product/byIds`, { params: { ids: ids.join(",") } });
            const found = res.data;
            setSelectedProducts(found.map(product => ({
                ...product,
                quantity: 1,
                purchasePrice: product.price || 0,
                discount: 0,
                tax: 0,
                availableQty: product.quantity || 0,
            })));
        } catch (err) {
            // fallback: do nothing
        }
    };

    const [form, setForm] = useState({
        debitNoteId: '',
        referenceNumber: '',
        debitNoteDate: '',
        dueDate: '',
        status: 'Pending',
        currency: 'USD',
        enableTax: false,
        billFrom: '',
        billTo: '',
        items: [],
        extraInfo: { notes: '', terms: '', bank: '' },
        amount: '',
        cgst: '',
        sgst: '',
        discount: '',
        roundOff: false,
        total: '',
        totalInWords: '',
        signature: '',
        signatureName: '',
        signatureImage: '',
        purchase: ''
    });
    const [loading, setLoading] = useState(false);

    // Fetch next debitNoteId when modal opens
    useEffect(() => {
        const fetchNextId = async () => {
            try {
                const res = await axios.get('/api/debit-notes/next-id');
                setFormData(prev => ({ ...prev, debitNoteId: res.data.nextId }));
            } catch (err) {
                // fallback: leave blank
            }
        };
        // Listen for modal open
        const modal = document.getElementById('add-debitnote');
        if (modal) {
            modal.addEventListener('show.bs.modal', fetchNextId);
            return () => modal.removeEventListener('show.bs.modal', fetchNextId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Attach selectedProducts and purchase reference to form
            const payload = {
                ...formData,
                products: selectedProducts.map(p => ({
                    productId: p._id,
                    quantity: p.quantity,
                    purchasePrice: p.purchasePrice,
                    discount: p.discount,
                    tax: p.tax,
                    // add more fields if needed
                })),
                purchase: form.purchase // should be the purchase _id
            };
            await axios.post(`${BASE_URL}/api/debit-notes`, payload);
            toast.success('Debit Note created!');
            setFormData({
                debitNoteId: '', referenceNumber: '', debitNoteDate: '', dueDate: '', status: 'Pending', currency: 'USD', enableTax:
                    false, billFrom: '', billTo: '', items: [], extraInfo: { notes: '', terms: '', bank: '' }, amount: '', cgst: '', sgst:
                    '', discount: '', roundOff: false, total: '', totalInWords: '', signature: '', signatureName: '', signatureImage: '',
                purchase: ''
            });
            setSelectedProducts([]);
        } catch (err) {
            toast.error('Failed to create debit note');
        } finally {
            setLoading(false);
        }
    };



    const [formData, setFormData] = useState({
        referenceNumber: "",
        supplier: "",
        returnDate: "",
        products: [],
        reason: "",
        debitNoteId: '',
        debitNoteDate: '',
        dueDate: '',
        status: 'Pending',
        currency: 'USD',
        enableTax: false,
        billFrom: '',
        billTo: '',
        items: [],
        extraInfo: { notes: '', terms: '', bank: '' },
        amount: '',
        cgst: '',
        sgst: '',
        discount: '',
        roundOff: false,
        total: '',
        totalInWords: '',
        signature: '',
        signatureName: '',
        signatureImage: '',
        purchase: ''
    });

    useEffect(() => {
        if (purchaseData) {
            setFormData({
                referenceNumber: purchaseData.referenceNumber,
                supplier: purchaseData.supplier?._id || "",
                returnDate: new Date().toISOString().slice(0, 10),
                products: purchaseData.products || [],
                reason: "",
            });
        }
    }, [purchaseData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index][key] = value;
        setFormData({ ...formData, products: updatedProducts });
    };



    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                axios
                    .get(`${BASE_URL}/api/products/search?name=${searchTerm}`)
                    .then((res) => setProducts(res.data))
                    .catch((err) => console.error("Search error:", err));
            } else {
                setProducts([]);
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSelectProduct = (product) => {
        const alreadyExists = selectedProducts.some((p) => p._id === product._id);
        if (!alreadyExists) {
            const taxMatch = product.tax?.match(/\((\d+)%\)/);
            const taxPercent = taxMatch ? parseFloat(taxMatch[1]) : 0;

            setSelectedProducts([
                ...selectedProducts,
                {
                    ...product,
                    productName: product.productName || product.name || "", // yaha safe karo

                    quantity: 1, // start with 1
                    availableQty: product.quantity || 0,
                    discount: product.discountValue || 0,
                    tax: taxPercent,
                    unitName: product.unit || "", // ✅ ensure this is pres
                    purchasePrice: product.purchasePrice || product.price || 0,
                    // availableQty: product.quantity || 0,
                    images: product.images || []
                },
            ]);
        }

        setProducts([]);
        setSearchTerm("");
    };

    const totalItemCost = selectedProducts.reduce((acc, product) => {
        const price = product.purchasePrice || 0;
        const discount = product.discount || 0;
        const tax = product.tax || 0;
        const qty = product.quantity || 1;
        const subTotal = qty * price;
        const afterDiscount = subTotal - discount;
        const taxAmount = (afterDiscount * tax) / 100;
        const total = afterDiscount + taxAmount;
        return acc + total;
    }, 0);

    const grandTotal = totalItemCost
        // + orderTax + shippingCost - orderDiscount
        ;

    return (
        // <div className="modal fade" id="add-debitnote">
        <div className="modal fade" id="add-return-debit-note">
            <div className="modal-dialog purchase modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Debit Note</h5> <button type="button" className="btn-close"
                                data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {/* Add your form or content here */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="top-content">
                                        <div className="purchase-header mb-3">
                                            <h6>Purchase Order Details</h6>
                                        </div>
                                        <div>
                                            {/* start row */}
                                            <div className="row justify-content-between">
                                                <div className="col-md-6">
                                                    <div className="purchase-top-content">
                                                        <div className="row">
                                                            {/* <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Debit Note Id</label>
                                                            <input type="text" className="form-control"
                                                                name="debitNoteId" value={form.debitNoteId} readOnly />
                                                        </div>
                                                    </div> */}
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Reference Number</label>
                                                                    <input type="text" className="form-control"
                                                                        name="referenceNumber" value={formData.referenceNumber}
                                                                        onChange={handleChange} placeholder={1254569} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <label className="form-label">Debit Note Date</label>
                                                                <div className="input-group position-relative mb-3">
                                                                    <input type="text"
                                                                        className="form-control datetimepicker rounded-end"
                                                                        name="debitNoteDate" value={form.debitNoteDate}
                                                                        onChange={handleChange} placeholder="25 Mar 2025" />
                                                                    <span className="input-icon-addon fs-16 text-gray-9">
                                                                        <i className="isax isax-calendar-2" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <a href=""
                                                                    className="d-flex align-items-center "><i
                                                                        className="isax isax-add-circle5 me-1 text-primary" />Add
                                                                    Due Date</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>{/* end col */}
                                                <div className="col-md-4">
                                                    <div className="purchase-top-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="mb-3">
                                                                    <div className="logo-image">
                                                                        <img src="assets/img/invoice-logo.svg"
                                                                            className="invoice-logo-dark" alt="img" />
                                                                        <img src="assets/img/invoice-logo-white-2.svg"
                                                                            className="invoice-logo-white" alt="img" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <select className="form-select" name="status"
                                                                        value={form.status} onChange={handleChange}>
                                                                        <option>Select Status</option>
                                                                        <option>Paid</option>
                                                                        <option>Pending</option>
                                                                        <option>Cancelled</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <select className="form-select" name="currency"
                                                                        value={form.currency} onChange={handleChange}>
                                                                        <option>Currency</option>
                                                                        <option>$</option>
                                                                        <option>€</option>
                                                                        <option>₹</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div
                                                                    className="p-2 border rounded d-flex justify-content-between">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="form-check form-switch me-4">
                                                                            <input className="form-check-input" type="checkbox"
                                                                                role="switch" id="enabe_tax" name="enableTax"
                                                                                checked={form.enableTax}
                                                                                onChange={handleChange} />
                                                                            <label className="form-check-label"
                                                                                htmlFor="enabe_tax">Enable Tax</label>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <a href=""><span
                                                                            className="bg-primary-subtle p-1 rounded"><i
                                                                                className="isax isax-setting-2 text-primary" /></span></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>{/* end col */}
                                            </div>
                                            {/* end row */}
                                        </div>
                                    </div>

                                    {/* <div className="bill-content pb-0">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    <div className="card-header border-0 pb-0">
                                                        <h6>Bill From</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <label className="form-label">Billed By</label>
                                                            <select className="form-select" name="billFrom"
                                                                value={form.billFrom} onChange={handleChange}>
                                                                <option>Select</option>
                                                                <option>Kanakku</option>
                                                            </select>
                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    <span className="p-2 rounded border"><img
                                                                        src="assets/img/logo-small.svg" alt="image"
                                                                        className="img-fluid" /></span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">Kanakku Invoice Management</h6>
                                                                    <p className="mb-0">15 Hodges Mews, HP12 3JL, United Kingdom
                                                                    </p>
                                                                    <p className="mb-0">Phone : +1 54664 75945</p>
                                                                    <p className="mb-0">Email : <a className="__cf_email__"
                                                                        data-cfemail="5f363139301f3a273e322f333a713c3032">[email&nbsp;protected]</a>
                                                                    </p>
                                                                    <p className="text-dark mb-0">GST : 243E45767889</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    <div className="card-header border-0 pb-0">
                                                        <h6>Bill To</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <label className="form-label">Vendor Name</label>
                                                                <a href=""
                                                                    className="d-flex align-items-center"><i
                                                                        className="isax isax-add-circle5 text-primary me-1" />Add
                                                                    New</a>
                                                            </div>
                                                            <select className="form-select" name="billTo" value={form.billTo}
                                                                onChange={handleChange}>
                                                                <option>Select</option>
                                                                <option>Timesquare Tech</option>
                                                            </select>
                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    <span><img src="assets/img/icons/timesquare-icon.svg"
                                                                        alt="image" className="img-fluid rounded" /></span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">Timesquare Tech</h6>
                                                                    <p className="mb-0">299 Star Trek Drive, Florida, 32405, USA
                                                                    </p>
                                                                    <p className="mb-0">Phone : +1 54664 75945</p>
                                                                    <p className="mb-0">Email : <a
                                                                        href="https://kanakku.dreamstechnologies.com/cdn-cgi/l/email-protection"
                                                                        className="__cf_email__"
                                                                        data-cfemail="6900070f06290c11080419050c470a0604">[email&nbsp;protected]</a>
                                                                    </p>
                                                                    <p className="text-dark mb-0">GST : 243E45767889</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="items-details">
                                        <div className="purchase-header mb-3">
                                            <h6>Items &amp; Details</h6>
                                        </div>
                                        {/* start row */}
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <h6 className="fs-14 mb-1">Item Type</h6>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio"
                                                                name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                Product
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio"
                                                                name="flexRadioDefault" id="flexRadioDefault2" />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                Service
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        Product<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" placeholder="Search Product"
                                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                {/* Search Result List */}
                                                {products.length > 0 && (
                                                    <div className="search-results border rounded p-3 mb-3">
                                                        <h6 className="fw-semibold border-bottom pb-2 mb-3">
                                                            <i className="bi bi-list me-2" />
                                                            All Products
                                                            <span className="float-end text-muted small">
                                                                {products.length} Result{products.length > 1 ? "s" : ""}
                                                            </span>
                                                        </h6>

                                                        {products.map((product) => (
                                                            <div key={product._id}
                                                                className="d-flex align-items-start justify-content-between py-2 border-bottom"
                                                                onClick={() => handleSelectProduct(product)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="d-flex align-items-start gap-3">
                                                                    {product.images?.[0] && (
                                                                        <img src={product.images[0].url} alt={product.productName}
                                                                            className="media-image"
                                                                            style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                                                                    )}
                                                                    <div>
                                                                        <h6 className="fw-bold mb-1">{product.productName}</h6>
                                                                        <p className="text-muted small mb-0">
                                                                            {product.category?.categoryName || "No Category"} •{" "}
                                                                            {product.subcategory?.subCategoryName || "No Sub"} •
                                                                            ₹{product.price} • Available Qty
                                                                            -{" "}
                                                                            {product.quantity || 0}/ {product.unit}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <i className="bi bi-pencil text-primary" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* end row */}
                                        {/* Table list start */}
                                        {/* <div className="table-responsive rounded border-bottom-0 border mb-3">
                                            <table className="table table-nowrap add-table mb-0">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Product/Service</th>
                                                        <th>Quantity</th>
                                                        <th> Purchase Price</th>
                                                        <th>Discount</th>
                                                        <th>Tax (%)</th>
                                                        <th>Tax Amount</th>
                                                        <th> Unit Cost</th>
                                                        <th>Total Cost</th>
                                                        <th />
                                                    </tr>
                                                </thead>
                                                <tbody className="add-tbody">
                                                    {selectedProducts.length > 0 ? (
                                                        selectedProducts.map((product, index) => {
                                                            const qty = product.quantity;
                                                            const price = product.purchasePrice || 0;
                                                            const discount = product.discount || 0;
                                                            const tax = product.tax || 0;
                                                            const subTotal = qty * price;
                                                            const afterDiscount = subTotal - discount;
                                                            const taxAmount = (afterDiscount * tax) / 100;
                                                            const lineTotal = afterDiscount + taxAmount;

                                                            const lineProportion = totalItemCost > 0 ? lineTotal / totalItemCost : 0;

                                                            const finalTotal = lineTotal;
                                                            const unitCost = finalTotal / qty;

                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {product.productName}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Available: {product.availableQty} {product.unit}
                                                                        </small>
                                                                    </td>
                                                                    <td>
                                                                        <div
                                                                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                            <input type="text" className="form-control form-control-sm"
                                                                                style={{ width: "100px", textAlign: "center" }}
                                                                                value={`${product.quantity || 1} ${product.unit}`}
                                                                                onChange={(e) => {
                                                                                    let input = e.target.value.trim();
                                                                                    let val = parseInt(input); // extract number
                                                                                    if (isNaN(val)) val = 1;
                                                                                    if (val < 1) val = 1; if (val > product.availableQty) val =
                                                                                        product.availableQty;

                                                                                    setSelectedProducts((prev) =>
                                                                                        prev.map((item, i) =>
                                                                                            i === index ? { ...item, quantity: val } : item
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <input type="number" className="form-control form-control-sm"
                                                                            style={{ width: "90px" }} min="0" value={price} onChange={(e) => {
                                                                                const val = parseFloat(e.target.value);
                                                                                setSelectedProducts((prev) =>
                                                                                    prev.map((item, i) =>
                                                                                        i === index
                                                                                            ? { ...item, purchasePrice: isNaN(val) ? 0 : val }
                                                                                            : item
                                                                                    )
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <input type="number" className="form-control form-control-sm"
                                                                            style={{ width: "80px" }} value={discount} onChange={(e) => {
                                                                                const val = parseFloat(e.target.value);
                                                                                setSelectedProducts((prev) =>
                                                                                    prev.map((item, i) =>
                                                                                        i === index
                                                                                            ? {
                                                                                                ...item,
                                                                                                discount: isNaN(val) ? 0 : val,
                                                                                            }
                                                                                            : item
                                                                                    )
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <div
                                                                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                            <input type="text" className="form-control form-control-sm"
                                                                                style={{ width: "100px", textAlign: "center" }}
                                                                                value={`${product.tax || 0} %`} onChange={(e) => {
                                                                                    let input = e.target.value.trim();
                                                                                    let val = parseFloat(input); // Extract number
                                                                                    if (isNaN(val)) val = 0;
                                                                                    if (val < 0) val = 0; if (val > 100) val = 100;

                                                                                    setSelectedProducts((prev) =>
                                                                                        prev.map((item, i) =>
                                                                                            i === index ? { ...item, tax: val } : item
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </td>

                                                                    <td>₹{taxAmount.toFixed(2)}</td>
                                                                    <td>₹{unitCost.toFixed(2)}</td>
                                                                    <td className="fw-semibold text-success">
                                                                        ₹{finalTotal.toFixed(2)}
                                                                    </td>

                                                                    <td>
                                                                        <button className="btn btn-sm btn-danger" onClick={() =>
                                                                            handleRemoveProduct(product._id,
                                                                                product.productName)}
                                                                        >
                                                                            <TbTrash />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className="text-center text-muted">
                                                                No products selected.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div> */}
                                        <div className="table-responsive rounded border-bottom-0 border mb-3">
                                            <table className="table table-nowrap add-table mb-0">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Product/Service</th>
                                                        <th>Return Qty</th>
                                                        <th> Purchase Price</th>
                                                        <th>Discount</th>
                                                        <th>Tax (%)</th>
                                                        <th>Tax Amount</th>
                                                        <th> Unit Cost</th>
                                                        <th>Total Return</th>
                                                        <th />
                                                    </tr>
                                                </thead>
                                                <tbody className="add-tbody">
                                                    {formData.products.length > 0 ? (
                                                        formData.products.map((product, index) => {
                                                            const qty = parseFloat(product.returnQty || 0);
                                                            const price = parseFloat(product.purchasePrice || 0);
                                                            const discount = parseFloat(product.discount || 0);
                                                            const tax = parseFloat(product.tax || 0);

                                                            const subTotal = qty * price;
                                                            const afterDiscount = subTotal - discount;
                                                            const taxAmount = (afterDiscount * tax) / 100;
                                                            const totalCost = afterDiscount + taxAmount;
                                                            const unitCost = qty > 0 ? totalCost / qty : 0;

                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {product.product?.productName || "N/A"}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Purchased: {product.quantity} {product.unit}
                                                                        </small>
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max={product.quantity}
                                                                            className="form-control form-control-sm"
                                                                            style={{ width: "100px", textAlign: "center" }}
                                                                            value={product.returnQty || ""}
                                                                            onChange={(e) => handleProductChange(index, "returnQty", e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            className="form-control form-control-sm"
                                                                            style={{ width: "90px" }}
                                                                            value={price}
                                                                            onChange={(e) => handleProductChange(index, "purchasePrice", e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            className="form-control form-control-sm"
                                                                            style={{ width: "80px" }}
                                                                            value={discount}
                                                                            onChange={(e) => handleProductChange(index, "discount", e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            className="form-control form-control-sm"
                                                                            style={{ width: "80px" }}
                                                                            value={tax}
                                                                            onChange={(e) => handleProductChange(index, "tax", e.target.value)}
                                                                        />
                                                                    </td>

                                                                    <td>₹{taxAmount.toFixed(2)}</td>
                                                                    <td>₹{unitCost.toFixed(2)}</td>
                                                                    <td className="fw-semibold text-success">₹{totalCost.toFixed(2)}</td>

                                                                    <td>
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => {
                                                                                const updated = formData.products.filter((_, i) => i !== index);
                                                                                setFormData({ ...formData, products: updated });
                                                                            }}
                                                                        >
                                                                            <TbTrash />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className="text-center text-muted">
                                                                No products selected.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Table list end */}
                                        <div>
                                            <a href="#" className="d-inline-flex align-items-center add-invoice-data"><i
                                                className="isax isax-add-circle5 text-primary me-1" />Add New</a>
                                        </div>
                                    </div>
                                    <div className="extra-info">
                                        {/* start row */}
                                        <div className="row">
                                            <div className="col-md-7">
                                                <div className="mb-3">
                                                    <h6 className="mb-3">Extra Information</h6>
                                                    <div>
                                                        <ul className="nav nav-tabs nav-solid-primary mb-3" role="tablist">
                                                            <li className="nav-item me-2" role="presentation">
                                                                <a className="nav-link active border fs-12 fw-semibold rounded"
                                                                    data-bs-toggle="tab" data-bs-target="#notes"
                                                                    aria-current="page" href=""><i
                                                                        className="isax isax-document-text me-1" />Add Notes</a>
                                                            </li>
                                                            <li className="nav-item me-2" role="presentation">
                                                                <a className="nav-link border fs-12 fw-semibold rounded"
                                                                    data-bs-toggle="tab" data-bs-target="#terms"
                                                                    href=""><i
                                                                        className="isax isax-document me-1" />Add Terms &amp;
                                                                    Conditions</a>
                                                            </li>
                                                            <li className="nav-item" role="presentation">
                                                                <a className="nav-link border fs-12 fw-semibold rounded"
                                                                    data-bs-toggle="tab" data-bs-target="#bank"
                                                                    href=""><i
                                                                        className="isax isax-bank me-1" />Bank Details</a>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            <div className="tab-pane active show" id="notes" role="tabpanel">
                                                                <label className="form-label">Additional Notes</label>
                                                                <textarea className="form-control" name="extraInfo.notes" value={form.extraInfo.notes}
                                                                    onChange={handleChange} />
                                                            </div>
                                                            <div className="tab-pane fade" id="terms" role="tabpanel">
                                                                <label className="form-label">Terms &amp; Conditions</label>
                                                                <textarea className="form-control" name="extraInfo.terms" value={form.extraInfo.terms} onChange={handleChange} />
                                                            </div>
                                                            <div className="tab-pane fade" id="bank" role="tabpanel">
                                                                <label className="form-label">Account</label>
                                                                <select className="form-select" name="extraInfo.bank" value={form.extraInfo.bank} onChange={handleChange}>
                                                                    <option>Select</option>
                                                                    <option>Andrew - 5225655545555454 (Swiss Bank)</option>
                                                                    <option>Mark Salween - 4654145644566 (International Bank)</option>
                                                                    <option>Sophia Martinez - 7890123456789012 (Global Finance)</option>
                                                                    <option>David Chen - 2345678901234567 (National Bank)</option>
                                                                    <option>Emily Johnson - 3456789012345678 (Community Credit Union)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>{/* end col */}
                                            <div className="col-md-5">
                                                <ul className="mb-0 ps-0 list-unstyled">
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">Amount</p>
                                                            <h6 className="fs-14">$ 565</h6>
                                                        </div>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">CGST (9%)</p>
                                                            <h6 className="fs-14">$18</h6>
                                                        </div>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">SGST (9%)</p>
                                                            <h6 className="fs-14">$18</h6>
                                                        </div>
                                                    </li>
                                                    <li className="mb-3">
                                                        <a href="" className="d-flex align-items-center "><i className="isax isax-add-circle5 text-primary me-1" />Add Additional Charges</a>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">Discount</p>
                                                            <div>
                                                                <select className="form-select" name="discount" value={form.discount} onChange={handleChange}>
                                                                    <option>Select</option>
                                                                    <option>0 %</option>
                                                                    <option>1 %</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="pb-2 border-gray border-bottom">
                                                        <div className="p-2 d-flex justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="form-check form-switch me-4">
                                                                    <input className="form-check-input" type="checkbox" role="switch" id="enabe_tax1" name="roundOff" checked={form.roundOff} onChange={handleChange} />
                                                                    <label className="form-check-label" htmlFor="enabe_tax1">Round Off Total</label>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h6 className="fs-14">$596</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="mt-3 pb-3 border-bottom border-gray">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <h6>Total (USD)</h6>
                                                            <h6>$ 596</h6>
                                                        </div>
                                                    </li>
                                                    <li className="mt-3 pb-3 border-bottom border-gray">
                                                        <h6 className="fs-14 fw-semibold">Total In Words</h6>
                                                        <p>Five Hundred &amp; Ninety Six Dollars</p>
                                                    </li>
                                                    <li className="mt-3 mb-3">
                                                        <div>
                                                            <select className="form-select" name="signature" value={form.signature} onChange={handleChange}>
                                                                <option>Select Signature</option>
                                                                <option>Adrian</option>
                                                            </select>
                                                        </div>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            OR
                                                        </div>
                                                    </li>
                                                    <li className="mb-2">
                                                        <div className="mb-3">
                                                            <label className="form-label">Signature Name</label>
                                                            <input type="text" className="form-control" name="signatureName" value={form.signatureName} onChange={handleChange} defaultValue="Adrian" />
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="singnature-upload bg-light d-flex align-items-center justify-content-center">
                                                            <div className="drag-upload-btn bg-light position-relative mb-2 fs-14 fw-normal text-gray-5">
                                                                <i className="isax isax-image me-1 text-primary" />Upload Image
                                                                <input type="file" className="form-control image-sign" multiple />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>{/* end col */}
                                        </div>
                                        {/* end row */}
                                    </div>
                                </div>{/* end card body */}

                            </div>{/* end card */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create New'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddDebitNoteModals