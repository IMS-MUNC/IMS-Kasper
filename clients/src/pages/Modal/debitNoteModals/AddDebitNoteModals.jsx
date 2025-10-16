// // AddDebitNoteModals.jsx
// This file is used to create a debit note modal for returning products from a purchase.    
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../../styles/creditDebit/debitnote.css";
import Select from "react-select";
import BASE_URL from '../../config/config';
import { TbCashBanknote, TbTrash } from 'react-icons/tb';
import { useLocation } from "react-router-dom";
import { CiCirclePlus } from 'react-icons/ci';


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


  const [description, setDescription] = useState("");
const [orderTax, setOrderTax] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [unitName, setUnitName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  // const [status, setStatus] = useState("");
    const [status, setStatus] = useState("Received");

  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Payment states
  const [paymentType, setPaymentType] = useState("Full"); // "Full" or "Partial"
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [onlineMod, setOnlineMod] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});

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


    // Function to reset form while preserving auto-filled data
    const resetFormToDefaults = () => {
        // Get current auto-filled values to preserve
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Reset to default state while preserving auto-filled data
        setFormState(prev => ({
            ...prev,
            // Clear user-inputted fields
            reason: "",
            dueDate: '',
            extraInfo: { notes: '', terms: '', bank: '' },
            cgst: '',
            sgst: '',
            discount: '',
            signature: '',
            signatureName: '',
            signatureImage: '',
            // Preserve auto-filled fields
            debitNoteDate: formattedDate,
            returnDate: currentDate.toISOString().slice(0, 10),
            status: 'Pending',
            currency: 'USD',
            enableTax: false,
            roundOff: false,
            // If there's purchaseData, preserve those fields, otherwise clear them
            referenceNumber: purchaseData?.referenceNumber || "",
            supplier: purchaseData?.supplier?._id || "",
            products: purchaseData?.products || [],
            purchase: purchaseData?._id || "",
            billFrom: purchaseData?.billFrom || purchaseData?.supplier?._id || "",
            billTo: purchaseData?.billTo || purchaseData?.supplier?._id || "",
        }));
    };

    // Handle modal opening: reset form, fetch ID, and apply purchase data if available
    useEffect(() => {
        const handleModalOpen = async () => {
            try {
                // First, reset the form to clear any previous data
                resetFormToDefaults();
                
                // Fetch next debit note ID
                const res = await axios.get(`${BASE_URL}/api/debit-notes/next-id`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // Set the fetched ID and apply purchase data if available
                setFormState(prev => {
                    const baseState = {
                        ...prev,
                        debitNoteId: res.data.nextId
                    };
                    
                    // If there's purchase data, apply it while keeping the fresh date
                    if (purchaseData) {
                        return {
                            ...baseState,
                            referenceNumber: purchaseData.referenceNumber,
                            supplier: purchaseData.supplier?._id || "",
                            returnDate: new Date().toISOString().slice(0, 10),
                            products: purchaseData.products || [],
                            purchase: purchaseData._id,
                            billFrom: purchaseData.billFrom || purchaseData.supplier?._id || "",
                            billTo: purchaseData.billTo || purchaseData.supplier?._id || "",
                        };
                    }
                    
                    return baseState;
                });
            } catch (err) {
                // fallback: reset form and leave ID blank
                resetFormToDefaults();
            }
        };
        
        const fetchNextId = handleModalOpen;

        const handleModalClose = () => {
            resetFormToDefaults();
        };

        const modal = document.getElementById('add-return-debit-note');
        if (modal) {
            modal.addEventListener('show.bs.modal', fetchNextId);
            modal.addEventListener('hidden.bs.modal', handleModalClose);
            return () => {
                modal.removeEventListener('show.bs.modal', fetchNextId);
                modal.removeEventListener('hidden.bs.modal', handleModalClose);
            };
        }
    }, [purchaseData]);

    const formatDateToISO = (dateStr) => {
        if(!dateStr) return new Date().toISOString();
        if(dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`; //ISO format string
        }
        return dateStr;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token")
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
                subTotal: p.subTotal || 0,
                discountType: p.discountType || '',
                discountAmount: p.discountAmount || 0,
                unitCost: p.unitCost || 0,
                totalCost: p.totalCost || 0,
            }));
            const payload = {
                debitNoteId: formState.debitNoteId,
                referenceNumber: formState.referenceNumber,
                debitNoteDate: formatDateToISO(formState.debitNoteDate) || new Date().toISOString(),
                dueDate: formatDateToISO(formState.dueDate),
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
            console.log("🟢 Payload before submit:", formState);

            // await axios.post(`${BASE_URL}/api/purchases/return`, payload);
            await axios.post(`${BASE_URL}/api/debit-notes/return`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Debit Note created!');
            window.$('#add-return-debit-note').modal('hide'); // <-- auto close modal
            resetFormToDefaults(); // Reset form to defaults after successful submission
            if (onReturnCreated) onReturnCreated();
        } catch (err) {
            toast.error('Failed to create debit note');
        } finally {
            setLoading(false);
        }
    };


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

 const tax = products.tax || 0;
  
// SGST/CGST as percent of totalReturn
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

// Discount for summary (can be percent or value)
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

   // --- Purchase Summary Calculations ---
  const purchaseSummary = formState.products.reduce((acc, product) => {
    const price = Number(product.purchasePrice) || 0;
    const qty = Number(product.returnQty) || 1;
    const discount = Number(product.discount) || 0;
    const tax = Number(product.tax) || 0;
    const subTotal = qty * price;
    let discountAmount = 0;
    if (product.discountType === 'Percentage') {
      discountAmount = (subTotal * discount) / 100;
    } else {
      discountAmount = discount * qty;
    }
    const taxableValue = subTotal - discountAmount;
    const taxAmount = (taxableValue * tax) / 100;
    acc.subTotal += subTotal;
    acc.discountAmount += discountAmount;
    acc.taxableValue += taxableValue;
    acc.taxAmount += taxAmount;
    return acc;
  }, { subTotal: 0, discountAmount: 0, taxableValue: 0, taxAmount: 0 });

  const cgst = purchaseSummary.taxAmount / 2;
  const sgst = purchaseSummary.taxAmount / 2;
  const totalItemCost = purchaseSummary.subTotal - purchaseSummary.discountAmount + purchaseSummary.taxAmount;
  const grandTotal = totalItemCost + orderTax + shippingCost - orderDiscount;




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

  useEffect(() => {
    if (paymentType === "Partial") {
      // Clamp paidAmount between 0 and grandTotal
      let paid = paidAmount;
      if (paid < 0) paid = 0;
      if (paid > grandTotal) paid = grandTotal;
      setPaidAmount(paid);
      setDueAmount(Math.max(grandTotal - paid, 0));
    } else {
      setPaidAmount(0);
      setDueAmount(0);
    }
  }, [paymentType, paidAmount, grandTotal]);


  const fileInputRef = useRef();

  // ✅ Trigger hidden file input when clicking the icon
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

   const statusOptions =
    paymentType === "Full"
      ? ["Paid", "Pending"]        // sirf Paid aur Pending
      : ["Unpaid", "Partial", "Pending"]; // Full ke alawa (Partial case)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Preview images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

//    // --- Purchase Summary Calculations ---
//   const purchaseSummary = formState.products.reduce((acc, product) => {
//     const price = Number(product.purchasePrice) || 0;
//     const qty = Number(product.quantity) || 0;
//     const discount = Number(product.discount) || 0;
//     const tax = Number(product.tax) || 0;
//     const subTotal = qty * price;
//     let discountAmount = 0;
//     if (product.discountType === 'Percentage') {
//       discountAmount = (subTotal * discount) / 100;
//     } else {
//       discountAmount = discount * qty;
//     }
//     const taxableValue = subTotal - discountAmount;
//     const taxAmount = (taxableValue * tax) / 100;
//     acc.subTotal += subTotal;
//     acc.discountAmount += discountAmount;
//     acc.taxableValue += taxableValue;
//     acc.taxAmount += taxAmount;
//     return acc;
//   }, { subTotal: 0, discountAmount: 0, taxableValue: 0, taxAmount: 0 });

//   const cgst = purchaseSummary.taxAmount / 2;
//   const sgst = purchaseSummary.taxAmount / 2;
//   const totalItemCost = purchaseSummary.subTotal - purchaseSummary.discountAmount + purchaseSummary.taxAmount;
//   const grandTotal = totalItemCost + orderTax + shippingCost - orderDiscount;



    return (
        <div className="modal fade" id="add-return-debit-note">
            <div className="modal-dialog purchase modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Debit Note</h5>
                             <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
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
                                                           
                                                        </div>
                                                    </div>
                                                </div>{/* end col */}
                                                <div className="col-md-4">
                                                    <div className="purchase-top-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="mb-3">
                                                                 
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <select className="form-select" name="status"
                                                                        value={formState.status} onChange={handleChange}>
                                                                        <option>Select Status</option>
                                                                        <option>Paid</option>
                                                                        <option>Pending</option>
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
                                                            {/* <div className="col-md-12">
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
                                                            </div> */}
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
                                        {/* start row */}
                                        <div className="row">
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
                                                        <th>Discount Amount</th>
                                                        <th>Tax (%)</th>
                                                        <th>Tax Amount</th>
                                                        <th>Sub Total</th>
                                                        <th />
                                                    </tr>
                                                </thead>
                                                <tbody className="add-tbody">
                                                    {formState.products.length > 0 ? (
                                                        formState.products.map((product, index) => {

                                                            // const qty = parseFloat(product.returnQty || 0);
                                                            // const price = parseFloat(product.purchasePrice || 0);
                                                            // const discount = parseFloat(product.discount || 0);

                                                            // let discountAmount = 0;
                                                            // let discountDisplay = '';
                                                            // if (product.discountType === 'Percentage') {
                                                            //     discountDisplay = discount + '%';
                                                            //     discountAmount = ((qty * price) * discount) / 100;
                                                            // } else {
                                                            //     discountDisplay = '₹' + discount;
                                                            //     discountAmount = discount;
                                                            // }
                                                            // const tax = parseFloat(product.tax || 0);
                                                            // const subTotal = qty * price;
                                                            // const afterDiscount = subTotal - discount;
                                                            // const taxAmount = (afterDiscount * tax) / 100;
                                                            // const lineTotal = afterDiscount + taxAmount;
                                                            // const unitCost = qty > 0 ? lineTotal / qty : 0;

  const qty = product.returnQty || 1;
                              const price = product.purchasePrice || 0;
                              let discount = product.discount || 0;
                              let discountAmount = 0;
                              let discountDisplay = '';
                              if (product.discountType === 'Percentage') {
                                discountDisplay = discount + '%';
                                discountAmount = ((qty * price) * discount) / 100;
                              } else {
                                discountDisplay = '₹' + discount;
                                discountAmount = discount;
                              }
                              const tax = product.tax || 0;
                              const subTotal = qty * price;
                              const afterDiscount = subTotal - discountAmount;
                              const taxAmount = (afterDiscount * tax) / 100;
                              const lineTotal = afterDiscount + taxAmount;

                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {product.product?.productName || "N/A"}
                                                                        <br />
                                                                        <small className="text-muted">
                                                                            Purchased: {product.quantity} {product.unit}
                                                                        </small>
                                                                    </td>
                                                                    {/* <td>
                                                                        <input type="number" min="0" max={product.quantity} className="form-control form-control-sm"
                                                                            style={{ width: "100px", textAlign: "center" }} value={product.returnQty || ""}
                                                                            onChange={(e) => handleProductChange(index, "returnQty", e.target.value)}
                                                                        />
                                                                    </td> */}
                                                                    <td>
                                                                        <div
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                gap: "8px",
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="number"
                                                                                className="form-control form-control-sm"
                                                                                style={{ width: "70px", textAlign: "center" }}
                                                                                min="0"
                                                                                max={product.quantity}
                                                                                value={product.returnQty || 1}
                                                                                onChange={(e) => {
                                                                                    let val = parseInt(e.target.value, 10);
                                                                                    if (isNaN(val)) val = 1;
                                                                                    if (val < 0) val = 1;
                                                                                    if (val > product.quantity) val = product.quantity;
                                                                                    handleProductChange(index, "returnQty", val);
                                                                                }}
                                                                            />
                                                                            <span className="text-muted">{product.unit}</span>
                                                                        </div>
                                                                    </td>


                                                                    <td>
                                                                        <input readOnly type="number" min="0" className="form-control form-control-sm" style={{ width: "90px" }}
                                                                            value={price} onChange={(e) => handleProductChange(index, "purchasePrice", e.target.value)}
                                                                        />
                                                                    </td>
                                                                    {/* <td>
                                                                        <input type="text" className="form-control form-control-sm" style={{ width: "80px" }}
                                                                            value={product.discount} onChange={(e) => handleProductChange(index, "discount",
                                                                                e.target.value)}
                                                                            placeholder="% or value"
                                                                        />
                                                                    </td> */}
                                                                    <td>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input readOnly type="number" className="form-control form-control-sm" style={{ width: "80px" }}
                                                                                value={product.discount}
                                                                                onChange={(e) => {
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
                                                                            <div className="form-check form-switch ms-2 d-inline-flex align-items-center" style={{ verticalAlign: 'middle' }}>
                                                                                <input readOnly
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    id={`discountTypeSwitch-${index}`}
                                                                                    checked={product.discountType === 'Percentage'}
                                                                                    onChange={e => {
                                                                                        const newType = e.target.checked ? 'Percentage' : 'Fixed';
                                                                                        handleProductChange(prev => prev.map((p, idx) => idx === index ? { ...p, discountType: newType } : p));
                                                                                    }}
                                                                                />
                                                                                <label readOnly className="form-check-label ms-1" htmlFor={`discountTypeSwitch-${index}`} style={{ fontSize: '12px' }}>
                                                                                    {product.discountType === 'Percentage' ? '%' : '₹'}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        ₹{discountAmount.toFixed(2)}

                                                                    </td>
                                                                    <td>
                                                                        <input  readOnly type="number" min="0" max="100" className="form-control form-control-sm"
                                                                            style={{ width: "80px" }} value={tax} onChange={(e) => handleProductChange(index, "tax",
                                                                                e.target.value)}
                                                                        />
                                                                    </td>
                                                                    <td>₹{taxAmount.toFixed(2)}</td>
                                                                    <td>₹{subTotal.toFixed(2)}</td>
                                                                    {/* <td>₹{unitCost.toFixed(2)}</td> */}

                                                                    {/* <td className="fw-semibold text-success">₹{totalCost.toFixed(2)}</td> */}
                                                                    {/* <td className="fw-semibold text-success">₹{lineTotal.toFixed(2)}</td> */}

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
                                    </div>

                                    <div className="extra-info mt-3">
                                        {/* start row */}
                                        <div className="row">
                                            {/* <div className="col-md-7">
                                                <div className="mb-3">
                                                    <h6 className="mb-3">Extra Information</h6>
                                                    <div>
                                                        <ul className="nav nav-tabs nav-solid-primary mb-3" role="tablist">
                                                            <li className="nav-item me-2" role="presentation">
                                                                <a className="nav-link active border fs-12 fw-semibold rounded" data-bs-toggle="tab"
                                                                    data-bs-target="#notes" aria-current="page" Shipping Address><i
                                                                        className="isax isax-document-text me-1" />Description</a>
                                                            </li>


                                                            <li className="nav-item" role="presentation">
                                                                <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab" data-bs-target="#bank"
                                                                    Shipping Address><TbCashBanknote className="isax isax-bank me-1" />Payments Details</a>
                                                            </li>
                                                            <li className="nav-item" role="presentation">
                                                                <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab" data-bs-target="#attachments"
                                                                    Shipping Address><i className="isax isax-bank me-1" />Attachments</a>
                                                            </li>
                                                        </ul>

                                                        <div className="tab-content">
                                                            <div className="tab-pane active show" id="notes" role="tabpanel">
                                                                <div className="mb-3 summer-description-box">
                                                                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={400} />
                                                                    <p className="mt-1">Maximum 60 Words</p>
                                                                </div>
                                                            </div>

                                                            <div className="tab-pane fade" id="addCharges" role="tabpanel">
                                                                <div className="row">
                                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">
                                                                                Labour Cost
                                                                            </label>
                                                                            <input type="text" className="form-control" value={orderTax} onChange={(e) =>
                                                                                setOrderTax(parseFloat(e.target.value) || 0)} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">
                                                                                Discount
                                                                            </label>
                                                                            <input type="text" className="form-control" value={orderDiscount} onChange={(e) =>
                                                                                setOrderDiscount(parseFloat(e.target.value) || 0)} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">
                                                                                Shipping
                                                                            </label>
                                                                            <input type="text" className="form-control" value={shippingCost} onChange={(e) =>
                                                                                setShippingCost(parseFloat(e.target.value) || 0)} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">
                                                                                Status<span className="text-danger ms-1">*</span>
                                                                            </label>
                                                                            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                                                <option>Select</option>
                                                                                <option>Ordered</option>
                                                                                <option>Received</option>
                                                                                <option>Pending</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>


                                                                    <div className="profile-pic-upload mb-3">
                                                                        <div className="d-flex gap-2 flex-wrap">
                                                                            {imagePreviews.length > 0 ? (
                                                                                imagePreviews.map((preview, index) => (
                                                                                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                                                        <img
                                                                                            src={preview}
                                                                                            alt={`Preview ${index}`}
                                                                                            height="60"
                                                                                            width="120"
                                                                                            style={{ borderRadius: "4px", objectFit: "cover" }}
                                                                                        />
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                                                                                                setSelectedImages((prev) => prev.filter((_, i) => i !== index));
                                                                                            }}
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                top: 2,
                                                                                                right: 2,
                                                                                                background: 'rgba(255,255,255,0.8)',
                                                                                                border: 'none',
                                                                                                borderRadius: '50%',
                                                                                                width: 22,
                                                                                                height: 22,
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'center',
                                                                                                cursor: 'pointer',
                                                                                                padding: 0
                                                                                            }}
                                                                                            aria-label="Remove image"
                                                                                        >
                                                                                            <span style={{ color: '#d33', fontWeight: 'bold', fontSize: 16 }}>&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <div
                                                                                    className="profile-pic brand-pic"
                                                                                    onClick={handleIconClick}
                                                                                    style={{ cursor: "pointer" }}
                                                                                >
                                                                                    <span>
                                                                                        <CiCirclePlus className="plus-down-add" /> Add Image
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="image-upload mb-0">
                                                                            <input
                                                                                type="file"
                                                                                id="ImageInput"
                                                                                accept="image/png, image/jpeg"
                                                                                onChange={handleImageChange}
                                                                                ref={fileInputRef}
                                                                                style={{ display: "none" }}
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>


                                                            <div className="tab-pane fade" id="bank" role="tabpanel">
                                                                <div className="row mt-3">
                                                                    <div className="col-lg-4">
                                                                        <label>Payment Type</label>
                                                                        <select className="form-select" value={paymentType} onChange={e => {
                                                                            setPaymentType(e.target.value);
                                                                            setPaymentMethod("");
                                                                        }}
                                                                        >
                                                                            <option value="Full">Full Payment</option>
                                                                            <option value="Partial">Partial Payment</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <label>Payment Status</label>
                                                                        <select
                                                                            className="form-select"
                                                                            value={paymentStatus}
                                                                            onChange={(e) => setPaymentStatus(e.target.value)}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {statusOptions.map((opt) => (
                                                                                <option key={opt} value={opt}>
                                                                                    {opt}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        {formErrors.paymentStatus && (
                                                                            <div className="text-danger small mt-1">{formErrors.paymentStatus}</div>
                                                                        )}
                                                                    </div>


                                                                    {(paymentType === "Full" || paymentType === "Partial") && (
                                                                        <>
                                                                            {paymentType === "Full" && (
                                                                                <div className="col-lg-4">
                                                                                    <label>Total Amount</label>
                                                                                    <input type="number" className="form-control" value={grandTotal} readOnly />
                                                                                </div>
                                                                            )}

                                                                            {paymentType === "Partial" && (
                                                                                <>
                                                                                    <div className="col-lg-4">
                                                                                        <label>Total Amount</label>
                                                                                        <input type="number" className="form-control" value={grandTotal} readOnly />
                                                                                    </div>
                                                                                    <div className="col-lg-4">
                                                                                        <label>Paid Amount</label>
                                                                                        <input type="number" className="form-control" value={paidAmount} max={grandTotal} onChange={e =>
                                                                                            setPaidAmount(parseFloat(e.target.value) || 0)} />
                                                                                    </div>
                                                                                    <div className="col-lg-4">
                                                                                        <label>Due Amount</label>
                                                                                        <input type="number" className="form-control" value={dueAmount.toFixed(2)} readOnly />
                                                                                    </div>
                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Due Date</label>
                                                                                        <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                            <div className="col-lg-12 mt-3">
                                                                                <label>Payment Method</label>
                                                                                <div className="d-flex gap-4">
                                                                                    {["Cash", "Online", "Cheque"].map((method) => (
                                                                                        <div className="form-check" key={method}>
                                                                                            <input type="radio" className="form-check-input" id={method} checked={paymentMethod === method}
                                                                                                onChange={() => setPaymentMethod(method)}
                                                                                            />
                                                                                            <label className="form-check-label" htmlFor={method}>
                                                                                                {method}
                                                                                            </label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                {formErrors.paymentMethod && (
                                                                                    <div className="text-danger small mt-1">{formErrors.paymentMethod}</div>
                                                                                )}
                                                                            </div>

                                                                            {(paymentMethod === "Online") && (
                                                                                <>
                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Online Payment Method</label>
                                                                                        <input type="text" className="form-control" value={onlineMod} onChange={e =>
                                                                                            setOnlineMod(e.target.value)}
                                                                                            placeholder="e.g. UPI, NEFT, RTGS"
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Transaction ID</label>
                                                                                        <input type="text" className="form-control" value={transactionId} onChange={e =>
                                                                                            setTransactionId(e.target.value)}
                                                                                            placeholder="Enter Transaction ID"
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Transaction Date</label>
                                                                                        <input type="date" className="form-control" value={transactionDate} onChange={e =>
                                                                                            setTransactionDate(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                            {(paymentMethod === "Cheque") && (
                                                                                <>
                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Cheque No</label>
                                                                                        <input type="text" className="form-control" value={transactionId} onChange={e =>
                                                                                            setTransactionId(e.target.value)}
                                                                                            placeholder="Enter Cheque No"
                                                                                        />
                                                                                    </div>

                                                                                    <div className="col-lg-4 mt-2">
                                                                                        <label>Transaction Date</label>
                                                                                        <input type="date" className="form-control" value={transactionDate} onChange={e =>
                                                                                            setTransactionDate(e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}

                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="attachments" role="tabpanel">
                                                                <div className="profile-pic-upload mb-3">
                                                                    <div className="d-flex gap-2 flex-wrap">
                                                                        {imagePreviews.length > 0 ? (
                                                                            imagePreviews.map((preview, index) => (
                                                                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                                                    <img
                                                                                        src={preview}
                                                                                        alt={`Preview ${index}`}
                                                                                        height="60"
                                                                                        width="120"
                                                                                        style={{ borderRadius: "4px", objectFit: "cover" }}
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                                                                                            setSelectedImages((prev) => prev.filter((_, i) => i !== index));
                                                                                        }}
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            top: 2,
                                                                                            right: 2,
                                                                                            background: 'rgba(255,255,255,0.8)',
                                                                                            border: 'none',
                                                                                            borderRadius: '50%',
                                                                                            width: 22,
                                                                                            height: 22,
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'center',
                                                                                            cursor: 'pointer',
                                                                                            padding: 0
                                                                                        }}
                                                                                        aria-label="Remove image"
                                                                                    >
                                                                                        <span style={{ color: '#d33', fontWeight: 'bold', fontSize: 16 }}>&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div
                                                                                className="profile-pic brand-pic"
                                                                                onClick={handleIconClick}
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                <span>
                                                                                    <CiCirclePlus className="plus-down-add" /> Add Image
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="image-upload mb-0">
                                                                        <input
                                                                            type="file"
                                                                            id="ImageInput"
                                                                            accept="image/png, image/jpeg"
                                                                            onChange={handleImageChange}
                                                                            ref={fileInputRef}
                                                                            style={{ display: "none" }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3 d-none">
                                                                <label className="form-label">
                                                                    Status<span className="text-danger ms-1">*</span>
                                                                </label>
                                                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                                    <option>Select</option>
                                                                    <option>Ordered</option>
                                                                    <option>Received</option>
                                                                    <option>Pending</option>
                                                                </select>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div> */}
                                            <div className="col-md-7"></div>

                                            {/* summary calculation*/}
                                            <div className="col-md-5 ms-auto mb-3">
                                                <div className="d-flex justify-content-between border-bottom mb-2 pe-3">
                                                    <p>Sub Total</p>
                                                    <p>₹ {purchaseSummary.subTotal.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2 pe-3">
                                                    <p>Discount</p>
                                                    <p>- ₹ {purchaseSummary.discountAmount.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2 pe-3">
                                                    <p>Taxable Value</p>
                                                    <p>₹ {purchaseSummary.taxableValue.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2 pe-3">
                                                    <p>CGST</p>
                                                    <p>₹ {cgst.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between border-bottom mb-2 pe-3">
                                                    <p>SGST</p>
                                                    <p>₹ {sgst.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2 pe-3 d-none">
                                                    <p>Total Tax</p>
                                                    <p>₹ {purchaseSummary.taxAmount.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2 pe-3 d-none">
                                                    <p>Total Item Cost</p>
                                                    <p>₹ {totalItemCost.toFixed(2)}</p>
                                                </div>
                                                <div className="d-flex justify-content-between fw-bold mb-2 pe-3">
                                                    <h5>Total Invoice Amount</h5>
                                                    <h5>₹ {grandTotal.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="extra-info">
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

                                    </div> */}
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer" style={{gap:'10px'}}>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetFormToDefaults}>Close</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create New'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddDebitNoteModals






