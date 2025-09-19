



// // AddDebitNoteModals.jsx
// This file is used to create a debit note modal for returning products from a purchase.    
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../../styles/creditDebit/debitnote.css";
import Select from "react-select";
import BASE_URL from '../../config/config';
import { TbTrash } from 'react-icons/tb';
import { useLocation } from "react-router-dom";


function formatAddress(billing) {
    if (!billing) return '';
    let parts = [];
    if (billing.address1) parts.push(billing.address1);
    if (billing.address2) parts.push(billing.address2);
    if (billing.city?.cityName) parts.push(billing.city.cityName);
    if (billing.state?.stateName) parts.push(billing.state.stateName);
    if (billing.country?.name) parts.push(billing.country.name);
    if (billing.postalCode) parts.push(billing.postalCode);
    return parts.join(', ');
}


function formatShipping(shipping) {
    if (!shipping) return '';
    let parts = [];
    if (shipping.address1) parts.push(shipping.address1);
    if (shipping.address2) parts.push(shipping.address2);
    if (shipping.city?.cityName) parts.push(shipping.city.cityName);
    if (shipping.state?.stateName) parts.push(shipping.state.stateName);
    if (shipping.country?.name) parts.push(shipping.country.name);
    if (shipping.pincode) parts.push(shipping.pincode);
    return parts.join(', ');
}

const AddDebitNoteModals = ({ purchaseData, onReturnCreated }) => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");


    // Single source of truth for form state (all fields in one object)
    const [formState, setFormState] = useState({
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


    // Fetch next debitNoteId when modal opens
    useEffect(() => {
        const fetchNextId = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/debit-notes/next-id`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormState(prev => ({ ...prev, debitNoteId: res.data.nextId }));
            } catch (err) {
                // fallback: leave blank
            }
        };
        const modal = document.getElementById('add-return-debit-note');
        if (modal) {
            modal.addEventListener('show.bs.modal', fetchNextId);
            return () => modal.removeEventListener('show.bs.modal', fetchNextId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productsPayload = formState.products.map(p => ({
                productId: p._id || p.product?._id || p.productId,
                productName: p.productName || p.product?.productName || '',
                quantity: Number(p.quantity) || 0,
                returnQty: Number(p.returnQty) || 0,
                unit: p.unit || p.unitName || '',
                purchasePrice: Number(p.purchasePrice) || 0,
                discount: p.discount || 0,
                tax: p.tax || 0,
                taxAmount: p.taxAmount || 0,
                unitCost: p.unitCost || 0,
                totalCost: p.totalCost || 0,
            }));
            const payload = {
                debitNoteId: formState.debitNoteId,
                referenceNumber: formState.referenceNumber,
                debitNoteDate: formState.debitNoteDate || new Date().toISOString(),
                dueDate: formState.dueDate,
                status: formState.status,
                currency: formState.currency,
                enableTax: formState.enableTax,
                billFrom: formState.billFrom,
                billTo: formState.billTo,
                products: productsPayload,
                extraInfo: formState.extraInfo,
                amount: totalReturn,
                cgst: formState.cgst,
                sgst: formState.sgst,
                discount: formState.discount,
                roundOff: formState.roundOff,
                total: grandTotal,
                totalInWords: totalInWords,
                signature: formState.signature,
                signatureName: formState.signatureName,
                signatureImage: formState.signatureImage,
                purchase: formState.purchase?._id || formState.purchase || '',
                reason: formState.reason,
            };
            // await axios.post(`${BASE_URL}/api/purchases/return`, payload);
            await axios.post(`${BASE_URL}/api/debit-notes/return`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Debit Note created!');
         window.$('#add-return-debit-note').modal('hide'); // <-- auto close modal

            setFormState({
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
            if (onReturnCreated) onReturnCreated();
        } catch (err) {
            toast.error('Failed to create debit note');
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        if (purchaseData) {
            // Format date as dd/mm/yyyy
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = now.toLocaleString('default', { month: 'short' });
            const year = now.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;
            setFormState(prev => ({
                ...prev,
                referenceNumber: purchaseData.referenceNumber,
                supplier: purchaseData.supplier?._id || "",
                returnDate: now.toISOString().slice(0, 10),
                debitNoteDate: formattedDate, // Set current date in dd mmm yyyy
                products: purchaseData.products || [],
                purchase: purchaseData._id, // ✅ Fix here
                reason: "",
                billFrom: purchaseData.billFrom || purchaseData.supplier?._id || "",
                billTo: purchaseData.billTo || purchaseData.supplier?._id || "",   // <-- set shipping address object or _id
            }));
        }
    }, [purchaseData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('extraInfo.')) {
            const key = name.split('.')[1];
            setFormState({
                ...formState,
                extraInfo: {
                    ...formState.extraInfo,
                    [key]: value
                }
            });
        } else if (type === 'checkbox') {
            setFormState({ ...formState, [name]: checked });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...formState.products];
        updatedProducts[index][key] = value;
        setFormState({ ...formState, products: updatedProducts });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                axios
                    .get(`${BASE_URL}/api/products/search?name=${searchTerm}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => setProducts(res.data))
                    .catch((err) => console.error("Search error:", err));
            } else {
                setProducts([]);
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);


    // const handleSelectProduct = (product) => {
    //     const alreadyExists = formState.products.some((p) => p._id === product._id);
    //     if (!alreadyExists) {
    //         const taxMatch = product.tax?.match(/\((\d+)%\)/);
    //         const taxPercent = taxMatch ? parseFloat(taxMatch[1]) : 0;
    //         setFormState({
    //             ...formState,
    //             products: [
    //                 ...formState.products,
    //                 {
    //                     ...product,
    //                     productName: product.productName || product.name || "",
    //                     quantity: 1,
    //                     availableQty: product.quantity || 0,
    //                     discount: product.discountValue || 0,
    //                     tax: taxPercent,
    //                     unitName: product.unit || "",
    //                     purchasePrice: product.purchasePrice || product.price || 0,
    //                     images: product.images || []
    //                 }
    //             ]
    //         });
    //     }
    //     setProducts([]);
    //     setSearchTerm("");
    // };


    // Calculate total return (amount) for all products



    const handleSelectProduct = (product) => {
        const alreadyExists = formState.products.some((p) => p._id === product._id);
        if (!alreadyExists) {
            const qty = product.quantity || 1;
            const price = product.purchasePrice || product.price || 0;
            const discount = product.discountValue || 0;
            const tax = product.tax || 0;
            const subTotal = qty * price;
            const afterDiscount = subTotal - discount;
            const taxAmount = (afterDiscount * tax) / 100;
            const lineTotal = afterDiscount + taxAmount;
            const unitCost = qty > 0 ? lineTotal / qty : 0;

            setFormState((prev) => ({
                ...prev,
                products: [
                    ...prev.products,
                    {
                        ...product,
                        productName: product.productName || product.name || "",
                        returnQty: qty,
                        quantity: qty,
                        availableQty: product.quantity || 0,
                        discount: discount,
                        tax: tax,
                        taxAmount: taxAmount,
                        unitCost: unitCost,
                        totalCost: lineTotal,
                        unit: product.unit || "",
                        purchasePrice: price,
                        images: product.images || [],
                    },
                ],
            }));
        }
        setProducts([]);
        setSearchTerm("");
    };
// ...existing code...

// Calculate total return (amount) for all products
const totalReturn = formState.products.reduce((acc, product) => {
    const qty = parseFloat(product.returnQty || product.quantity || 0);
    const price = parseFloat(product.purchasePrice || 0);
    const discount = parseFloat(product.discount || 0);
    const tax = parseFloat(product.tax || 0);
    const subTotal = qty * price;
    const afterDiscount = subTotal - discount;
    const taxAmount = (afterDiscount * tax) / 100;
    const lineTotal = afterDiscount + taxAmount;
    return acc + lineTotal;
}, 0);

// SGST/CGST as percent of totalReturn
let cgstValue = 0;
let sgstValue = 0;
if (formState.cgst) {
    const percent = parseFloat(formState.cgst) || 0;
    cgstValue = (totalReturn * percent) / 100;
}
if (formState.sgst) {
    const percent = parseFloat(formState.sgst) || 0;
    sgstValue = (totalReturn * percent) / 100;
}

// Discount for summary (can be percent or value)
let summaryDiscount = 0;
if (formState.discount) {
    if (typeof formState.discount === 'string' && formState.discount.trim().endsWith('%')) {
        const percent = parseFloat(formState.discount);
        summaryDiscount = ((totalReturn + cgstValue + sgstValue) * percent) / 100;
    } else {
        summaryDiscount = parseFloat(formState.discount) || 0;
    }
}

let grandTotal = totalReturn + cgstValue + sgstValue - summaryDiscount;
if (formState.roundOff) {
    grandTotal = Math.round(grandTotal);
}

// ...existing code...



    // const totalReturn = formState.products.reduce((acc, product) => {
    //     const qty = parseFloat(product.returnQty || product.quantity || 0);
    //     const price = parseFloat(product.purchasePrice || 0);
    //     let discount = product.discount || 0;
    //     if (typeof discount === 'string' && discount.trim().endsWith('%')) {
    //         const percent = parseFloat(discount);
    //         discount = ((qty * price) * percent) / 100;
    //     } else {
    //         discount = parseFloat(discount) || 0;
    //     }
    //     const tax = parseFloat(product.tax || 0);
    //     let taxAmount = 0;
    //     let totalCost = 0;
    //     if (formState.enableTax) {
    //         taxAmount = ((qty * price - discount) * tax) / 100;
    //         totalCost = (qty * price - discount) + taxAmount;
    //     } else {
    //         taxAmount = tax;
    //         totalCost = (qty * price - discount) + taxAmount;
    //     }
    //     return acc + totalCost;
    // }, 0);

    // // SGST/CGST as value or percent
    // // Always treat CGST/SGST as percent of totalReturn
    // let cgstValue = 0;
    // let sgstValue = 0;
    // if (formState.cgst) {
    //     const percent = parseFloat(formState.cgst) || 0;
    //     cgstValue = (totalReturn * percent) / 100;
    // }
    // if (formState.sgst) {
    //     const percent = parseFloat(formState.sgst) || 0;
    //     sgstValue = (totalReturn * percent) / 100;
    // }

    // // Discount for summary (can be percent or value)
    // let summaryDiscount = 0;
    // if (formState.discount) {
    //     if (typeof formState.discount === 'string' && formState.discount.trim().endsWith('%')) {
    //         const percent = parseFloat(formState.discount);
    //         summaryDiscount = ((totalReturn + cgstValue + sgstValue) * percent) / 100;
    //     } else {
    //         summaryDiscount = parseFloat(formState.discount) || 0;
    //     }
    // }

    // let grandTotal = totalReturn + cgstValue + sgstValue - summaryDiscount;
    // if (formState.roundOff) {
    //     grandTotal = Math.round(grandTotal);
    // }

    // Convert number to words (simple version)
    // function numberToWords(num) {
    //     const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    //     const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    //     if ((num = num.toString()).length > 9) return 'Overflow';
    //     let n = ('000000000' + num).substr(-9).match(/.{1,3}/g) || [];
    //     while (n.length < 5) n.unshift('000');
    //     let str = '';
    //     str += (n[0] && n[0] != 0) ? (a[Number(n[0])] || b[n[0][0]] + ' ' + a[n[0][1]]) + 'Crore ' : '';
    //     str += (n[1] && n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Lakh ' : '';
    //     str += (n[2] && n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Thousand ' : '';
    //     str += (n[3] && n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Hundred ' : '';
    //     str += (n[4] && n[4] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Only ' : '';
    //     return str.trim();
    // }
    // const totalInWords = numberToWords(Math.round(grandTotal));


    // ...existing code...

function numberToWords(num) {
    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
    }

    num = Number(num).toFixed(2);
    const [rupees, paise] = num.split('.');

    let words = '';
    if (parseInt(rupees, 10) > 0) {
        words += inWords(parseInt(rupees, 10)) + ' Rupees';
    }
    if (parseInt(paise, 10) > 0) {
        words += (words ? ' and ' : '') + inWords(parseInt(paise, 10)) + ' Paise';
    }
    if (!words) words = 'Zero Rupees';
    return words + ' Only';
}

// ...existing code...
const totalInWords = numberToWords(grandTotal);



// Calculate total tax amount for all products
const totalTaxAmount = formState.products.reduce((acc, product) => {
  const qty = parseFloat(product.returnQty || product.quantity || 0);
  const price = parseFloat(product.purchasePrice || 0);
  const discount = parseFloat(product.discount || 0);
  const tax = parseFloat(product.tax || 0);
  const afterDiscount = qty * price - discount;
  const taxAmount = (afterDiscount * tax) / 100;
  return acc + taxAmount;
}, 0);
const totalSGST = totalTaxAmount ;


const totalValue = formState.products.reduce((acc, product) => {
  const tax = parseFloat(product.tax || 0);
  return acc + tax;
}, 0);

// SGST is half of total tax amount (if using 50/50 split)
const totalGST = totalValue ;

// ...existing code...

    return (
        <div className="modal fade" id="add-return-debit-note">
            <div className="modal-dialog purchase modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Debit Note</h5> <button type="button" className="btn-close"
                                data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="top-content">
                                        {/* <div className="purchase-header mb-3">
                                            <h6>Purchase Order Details</h6>
                                        </div> */}
                                        <div>
                                            <div className="row justify-content-between">
                                                <div className="col-md-6">
                                                    <div className="purchase-top-content">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Reference Number</label>
                                                                    <input type="text" className="form-control"
                                                                        name="referenceNumber" value={formState.referenceNumber}
                                                                        onChange={handleChange} placeholder={1254569} />
                                                                </div>
                                                            </div>
                                        
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Invoice No</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="invoiceNo"
                                                                        value={formState.invoiceNo || ""}
                                                                        onChange={handleChange}
                                                                        placeholder="Invoice No"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-12">
                                                                <label className="form-label">Debit Note Date</label>
                                                                <div className="input-group position-relative mb-3">
                                                                    <input type="text"
                                                                        className="form-control datetimepicker rounded-end"
                                                                        name="debitNoteDate" value={formState.debitNoteDate}
                                                                        onChange={handleChange} placeholder="25 Mar 2025" />
                                                                    <span className="input-icon-addon fs-16 text-gray-9">
                                                                        <i className="isax isax-calendar-2" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* <div>
                                                                <a href=""
                                                                    className="d-flex align-items-center "><i
                                                                        className="isax isax-add-circle5 me-1 text-primary" />Add
                                                                    Due Date</a>
                                                            </div> */}
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
                                                                        value={formState.status} onChange={handleChange}>
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
                                                                        value={formState.currency} onChange={handleChange}>
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
                                                                                checked={formState.enableTax}
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
                                        </div>
                                    </div>

                                    <div className="bill-content pb-0">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    <div className="card-header border-0 pb-0">
                                                        <h6>Bill From</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <label className="form-label">Billed By</label>

                                                            <input type="text" className="form-control" value={purchaseData?.supplier ?
                                                                `${purchaseData.supplier.firstName || ""} ${purchaseData.supplier.lastName || ""}` : ""}
                                                                readOnly />

                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    <span className="p-2 rounded ">
                                                                        {purchaseData?.supplier?.images?.[0]?.url && (
                                                                            <span>
                                                                                <img src={purchaseData.supplier.images[0].url} alt="supplier" className="img-fluid rounded"
                                                                                    style={{ width: 40, height: 40, objectFit: "cover" }} />
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">{purchaseData?.supplier.billing.name}</h6>
                                                                    <p className="mb-0">{formatAddress(purchaseData?.supplier?.billing)}</p>
                                                                    <p className="mb-0">Phone : {purchaseData?.supplier?.phone}</p>
                                                                    <p className="mb-0">Email : {purchaseData?.supplier?.phone}</p>
                                                                    <p className="text-dark mb-0">GST : {purchaseData?.supplier.gstin}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Bill To Section */}
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    <div className="card-header border-0 pb-0">
                                                        <h6>Bill To</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <label className="form-label">Vendor Name</label>
                                                                <a href="" className="d-flex align-items-center">
                                                                    <i className="isax isax-add-circle5 text-primary me-1" />Add New
                                                                </a>
                                                            </div>
                                                            {/* Show supplier name from purchaseData */}
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={
                                                                    purchaseData?.supplier
                                                                        ? `${purchaseData.supplier.firstName || ""} ${purchaseData.supplier.lastName || ""}`
                                                                        : ""
                                                                }
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    {/* Optionally show supplier image if available */}
                                                                    {purchaseData?.supplier?.images?.[0]?.url && (
                                                                        <span>
                                                                            <img
                                                                                src={purchaseData.supplier.images[0].url}
                                                                                alt="supplier"
                                                                                className="img-fluid rounded"
                                                                                style={{ width: 40, height: 40, objectFit: "cover" }}
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">
                                                                        {purchaseData?.supplier
                                                                            ? `${purchaseData.supplier.companyName || ""} `
                                                                            : ""}
                                                                    </h6>
                                                                    <p className='mb-0'>{formatShipping(purchaseData?.supplier?.shipping)}</p>
                                                                    {/* <p className="mb-0">{purchaseData?.supplier?.companyName}</p>a */}
                                                                    <p className="mb-0">{purchaseData?.supplier?.companyWebsite}</p>
                                                                    <p className="mb-0">Phone : {purchaseData?.supplier?.phone}</p>
                                                                    <p className="mb-0">Email : {purchaseData?.supplier?.email}</p>
                                                                    <p className="text-dark mb-0">GST : {purchaseData?.supplier?.gstin}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>


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
                                                    <input disabled type="text" className="form-control" placeholder="Search Product"
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
                                                    {formState.products.length > 0 ? (
                                                        formState.products.map((product, index) => {
                                                            // const qty = parseFloat(product.returnQty || 0);
                                                            // const price = parseFloat(product.purchasePrice || 0);
                                                            // const discount = parseFloat(product.discount || 0);
                                                            // const tax = parseFloat(product.tax || 0);
                                                            // const purchasedQty = parseFloat(product.quantity || 0);

                                                            // const taxAmount = formState.enableTax
                                                            //     ? ((qty * price - discount) * tax) / 100
                                                            //     : 0;
                                                            // const totalCost = qty * price - discount + taxAmount;
                                                            // const unitCost = qty > 0 ? totalCost / qty : 0;


                                                            const qty = parseFloat(product.returnQty || 0);
                                                            const price = parseFloat(product.purchasePrice || 0);
                                                            const discount = parseFloat(product.discount || 0);
                                                            const tax = parseFloat(product.tax || 0);
                                                            const subTotal = qty * price;
                                                            const afterDiscount = subTotal - discount;
                                                            const taxAmount = (afterDiscount * tax) / 100;
                                                            const lineTotal = afterDiscount + taxAmount;
                                                            const unitCost = qty > 0 ? lineTotal / qty : 0;



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
                                                                        <input type="number" min="0" max={product.quantity} className="form-control form-control-sm"
                                                                            style={{ width: "100px", textAlign: "center" }} value={product.returnQty || ""}
                                                                            onChange={(e) => handleProductChange(index, "returnQty", e.target.value)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" min="0" className="form-control form-control-sm" style={{ width: "90px" }}
                                                                            value={price} onChange={(e) => handleProductChange(index, "purchasePrice", e.target.value)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" className="form-control form-control-sm" style={{ width: "80px" }}
                                                                            value={product.discount} onChange={(e) => handleProductChange(index, "discount",
                                                                                e.target.value)}
                                                                            placeholder="% or value"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" min="0" max="100" className="form-control form-control-sm"
                                                                            style={{ width: "80px" }} value={tax} onChange={(e) => handleProductChange(index, "tax",
                                                                                e.target.value)}
                                                                        />
                                                                    </td>
                                                                    <td>₹{taxAmount.toFixed(2)}</td>
                                                                    <td>₹{unitCost.toFixed(2)}</td>
                                                                    
                                                                    {/* <td className="fw-semibold text-success">₹{totalCost.toFixed(2)}</td> */}
                                                                                        <td className="fw-semibold text-success">₹{lineTotal.toFixed(2)}</td>

                                                                    <td>
                                                                        <button className="btn btn-sm btn-danger" onClick={() => {
                                                                            const updated = formState.products.filter((_, i) => i !== index);
                                                                            setFormState({ ...formState, products: updated });
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
                                        {/* <div>
                                            <a href="#" className="d-inline-flex align-products-center add-invoice-data"><i
                                                className="isax isax-add-circle5 text-primary me-1" />Add New</a>
                                        </div> */}
                                    </div>
                                    <div className="extra-info">
                                        <div className="row">
                                            <div className="col-md-7"></div>
                     
                                            <div className="col-md-5">
                                                <ul className="mb-0 ps-0 list-unstyled">
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">Amount</p>
                                                            <h6 className="fs-14">₹ {totalReturn.toFixed(2)}</h6>
                                                        </div>
                                                    </li>

                                                    {/* <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">CGST</p>
                                                            <div className="d-flex align-items-center gap-2">

                                                                <span className="ms-2">₹ {taxAmount ? taxAmount.toFixed(2) : '0.00'}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">SGST  <span className="ms-2">{totalGST}%</span></p>
                                                            <div className="d-flex align-items-center gap-2">

                                                                <span className="ms-2">₹ {totalTaxAmount.toFixed(2)}</span>


                                                                <span className="ms-2">₹ {sgstValue ? sgstValue.toFixed(2) : '0.00'}</span>
                                                            </div>
                                                        </div>
                                                    </li> */}


                                                     {/* <li className="mb-3">
                                                        <a href="" className="d-flex align-items-center "><i className="isax isax-add-circle5 text-primary me-1" />Add Additional Charges</a>
                                                    </li>
                                                    <li className="mb-3">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">Discount</p>
                                                            <div>
                                                                <input type="text" className="form-control form-control-sm w-auto d-inline-block" style={{ minWidth: 80 }}
                                                                    name="discount" value={formState.discount} onChange={handleChange} placeholder="% or value" />
                                                                <span className="ms-2">- ₹ {summaryDiscount ? summaryDiscount.toFixed(2) : '0.00'}</span>
                                                            </div>
                                                        </div>
                                                    </li> */}
                                                    <li className="pb-2 border-gray border-bottom">
                                                        <div className="p-2 d-flex justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="form-check form-switch me-4">
                                                                    <input className="form-check-input" type="checkbox" role="switch" id="enabe_tax1" name="roundOff" checked={formState.roundOff} onChange={handleChange} />
                                                                    <label className="form-check-label" htmlFor="enabe_tax1">Round Off Total</label>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h6 className="fs-14">₹ {totalReturn.toFixed(2)}</h6>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="mt-3 pb-3 border-bottom border-gray">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <h6>Total (INR)</h6>
                                                            <h6>₹ {formState.roundOff ? Math.round(grandTotal) : grandTotal ? grandTotal.toFixed(2) : '0.00'}</h6>
                                                        </div>
                                                    </li>
                                                    <li className="mt-3 pb-3 border-bottom border-gray">
                                                        <h6 className="fs-14 fw-semibold">Total In Words</h6>
                                                        <p>{totalInWords}</p>
                                                    </li>

                                                    
                                                    {/* <li className="mt-3 mb-3">
                                                        <div>
                                                            <select className="form-select" name="signature" value={formState.signature} onChange={handleChange}>
                                                                <option>Select Signature</option>
                                                                <option>Afroz zeelani</option>
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
                                                            <input type="text" className="form-control" name="signatureName" value={formState.signatureName} onChange={handleChange} defaultValue="Adrian" />
                                                        </div>
                                                    </li> */}
                                                    <li>
                                                        <div className="singnature-upload bg-light d-flex align-items-center justify-content-center">
                                                            <div className="drag-upload-btn bg-light position-relative mb-2 fs-14 fw-normal text-gray-5">
                                                                <i className="isax isax-image me-1 text-primary" />Upload Image
                                                                <input type="file" className="form-control image-sign" multiple />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
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






