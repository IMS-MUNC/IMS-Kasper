
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import axios from 'axios';
import Select from 'react-select';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';


const EditSalesModal = ({ editData, onSuccess, onClose }) => {
    // All states copied from AddSalesModal, but initialized from editData
    const navigate = useNavigate();
const token = localStorage.getItem("token");
    const [customers, setCustomers] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [saleDate, setSaleDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [labourCost, setLabourCost] = useState(0);
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [unitName, setUnitName] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [paymentType, setPaymentType] = useState("Full");
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [onlineMod, setOnlineMod] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isDiscountPercent, setIsDiscountPercent] = useState(false);
    const [formState, setFormState] = useState({
        notes: "",
        cgst: "",
        sgst: "",
        discount: "",
        roundOff: false,
        enableTax: false,
        enableAddCharges: false,
        currency: ""
    });
console.log("edit",editData)
    useEffect(() => {
        if (editData) {
            // Initialize all states from editData
            setSelectedCustomer(editData.customer ? { value: editData.customer._id || editData.customer, label: editData.customer.name || editData.customer } : null);
            setSaleDate(editData.saleDate ? editData.saleDate.slice(0, 10) : "");
            setStatus(editData.status || "");
            setDescription(editData.description || "");
            setReferenceNumber(editData.referenceNumber || "");
            setLabourCost(editData.labourCost || 0);
            setOrderDiscount(editData.orderDiscount || 0);
            setShippingCost(editData.shippingCost || 0);
            setPaymentType(editData.paymentType || "Full");
            setPaidAmount(editData.paidAmount || 0);
            setDueAmount(editData.dueAmount || 0);
            setDueDate(editData.dueDate ? editData.dueDate.slice(0, 10) : "");
            setPaymentMethod(editData.paymentMethod || "");
            setTransactionId(editData.transactionId || "");
            setOnlineMod(editData.onlineMod || "");
            setTransactionDate(editData.transactionDate ? editData.transactionDate.slice(0, 10) : "");
            setPaymentStatus(editData.paymentStatus || "");
            setFormState({
                notes: editData.notes || "",
                cgst: editData.cgst || "",
                sgst: editData.sgst || "",
                discount: editData.discount || "",
                roundOff: editData.roundOff || false,
                enableTax: editData.enableTax || false,
                enableAddCharges: editData.enableAddCharges || false,
                currency: editData.currency || ""
            });
            // Preserve per-line discount type by adding a local flag for calculations
            setSelectedProducts((editData.products || []).map(p => ({
                ...p,
                isDiscountPercent: p.discountType === 'Percentage'
            })));
            setSelectedImages(editData.images || []);
        }
    }, [editData]);

    // ...existing logic for fetching customers, products, etc. (copy from AddSalesModal)
    // ...existing UI for all fields (copy from AddSalesModal)

    // On submit, call update API
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                customer: selectedCustomer?.value ? String(selectedCustomer.value) : "",
                billing: selectedBilling,
                shipping: selectedShipping,
                products: selectedProducts.map(p => ({
                    productId: p._id,
                    saleQty: p.saleQty || p.quantity || 1,
                    quantity: p.quantity,
                    sellingPrice: p.sellingPrice,
                    discount: p.discount,
                    discountType: p.discountType,
                    tax: p.tax,
                })),
                saleDate,
                labourCost,
                orderDiscount,
                shippingCost,
                status,
                paymentType,
                paidAmount,
                dueAmount,
                dueDate,
                paymentMethod,
                transactionId,
                onlineMod,
                transactionDate,
                paymentStatus,
                images: selectedImages,
                description,
                referenceNumber,
                ...formState,
            };
            await axios.put(`${BASE_URL}/api/sales/${editData._id}`, payload,{
                 headers: {
          Authorization: `Bearer ${token}`,
        },
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            alert('Failed to update sale');
        }
    };

    if (!editData) return null;


    // Product totals and calculations
    const calculateLineTotal = (product) => {
        const price = product.sellingPrice || 0;
        const qty = product.quantity || 1;
        const percent = product.discountType === 'Percentage' || product.isDiscountPercent;
        const discountValue = Number(product.discount) || 0;
        const subTotal = price * qty;
        const discountAmount = percent
          ? (subTotal * discountValue) / 100
          : qty * discountValue; // per-unit fixed/rupees discount
        const afterDiscount = subTotal - discountAmount;
        const taxAmount = (afterDiscount * (product.tax || 0)) / 100;
        return {
            subTotal,
            afterDiscount,
            taxAmount,
            lineTotal: afterDiscount + taxAmount,
            unitCost: qty > 0 ? (afterDiscount + taxAmount) / qty : 0
        };
    };
    const productTotals = selectedProducts.map(calculateLineTotal);
    const totalProductAmount = productTotals.reduce((acc, t) => acc + t.lineTotal, 0);
    const amount = totalProductAmount;
    const additionalCharges = (formState.enableAddCharges ? (labourCost + shippingCost) : 0);
    let cgstValue = 0;
    let sgstValue = 0;
    if (formState.enableTax && formState.cgst) {
        const percent = parseFloat(formState.cgst) || 0;
        cgstValue = (amount * percent) / 100;
    }
    if (formState.enableTax && formState.sgst) {
        const percent = parseFloat(formState.sgst) || 0;
        sgstValue = (amount * percent) / 100;
    }
    let summaryDiscount = 0;
    if (orderDiscount) {
        if (isDiscountPercent) {
            const percent = parseFloat(orderDiscount);
            summaryDiscount = ((amount + cgstValue + sgstValue + additionalCharges) * percent) / 100;
        } else {
            summaryDiscount = parseFloat(orderDiscount) || 0;
        }
    }
    let grandTotal = amount + cgstValue + sgstValue + additionalCharges - summaryDiscount;
    if (formState.roundOff) {
        grandTotal = Math.round(grandTotal);
    }
    let roundOffValue = 0;
    if (formState.roundOff) {
        const rounded = Math.round(grandTotal);
        roundOffValue = rounded - grandTotal;
        grandTotal = rounded;
    }
    useEffect(() => {
        if (paymentType === "Partial") {
            const due = grandTotal - paidAmount;
            setDueAmount(due > 0 ? due : 0);
        } else {
            setPaidAmount(grandTotal);
            setDueAmount(0);
        }
    }, [paymentType, paidAmount, grandTotal]);

    // Infer order-level discount type from saved totals when editing
    useEffect(() => {
        if (editData && typeof editData.orderDiscount === 'number' && editData.grandTotal) {
            const base = totalProductAmount + (formState.enableTax ? (cgstValue + sgstValue) : 0) + (formState.enableAddCharges ? (labourCost + shippingCost) : 0);
            if (base > 0) {
                const inferredPercent = ((base - editData.grandTotal) / base) * 100;
                if (Math.abs(inferredPercent - editData.orderDiscount) < 0.01) {
                    setIsDiscountPercent(true);
                }
            }
        }
    }, [editData, totalProductAmount, cgstValue, sgstValue, labourCost, shippingCost, formState.enableTax, formState.enableAddCharges]);

    console.log("search:", options);
    console.log("customer:", selectedCustomer);
    console.log("product:", products);
    console.log("selectedProducts:", selectedProducts);

    // Discount type state: true = percent, false = value




    // Reset form fields
    const resetForm = () => {
        setSelectedCustomer(null);
        setSelectedBilling(null);
        setSelectedShipping(null);
        setProducts([]);
        setSearchTerm("");
        setSaleDate(new Date().toISOString().slice(0, 10));
        setDateError("");
        setSelectedProducts([]);
        setLabourCost(0);
        setOrderDiscount(0);
        setShippingCost(0);
        setUnitName("");
        setStatus("");
        setDescription("");
        setReferenceNumber("");
        setSelectedImages([]);
        setImagePreviews([]);
        setPaymentType("Full");
        setPaidAmount(0);
        setDueAmount(0);
        setDueDate("");
        setPaymentMethod("");
        setTransactionId("");
        setOnlineMod("");
        setTransactionDate("");
        setPaymentStatus("");
        setSelectedSupplier(null);
        setIsDiscountPercent(false);
        setFormState({
            notes: "",
            cgst: "",
            sgst: "",
            discount: "",
            roundOff: false,
            enableTax: false,
            enableAddCharges: false
        });
    };
    // REPLACE your existing handleChange with this:
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        const fetchReferenceNumber = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/sales/next-reference`,{
                     headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                setReferenceNumber(res.data.referenceNumber);
            } catch (err) {
                console.error("Failed to fetch reference number:", err);
                setReferenceNumber("SL-001"); // fallback
            }
        };

        fetchReferenceNumber();
    }, []);

    useEffect(() => {
        const fetchActiveCustomer = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/customers/active`,{
                     headers: {
          Authorization: `Bearer ${token}`,
        },
                });
                // Support both array and object with 'customers' property
                let customersArr = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.customers)
                        ? res.data.customers
                        : [];
                setCustomers(customersArr);
                const formattedOptions = customersArr.map((customer) => ({
                    value: customer._id,
                    label: `${customer.name || ""} ${customer.email ? `(${customer.email})` : ""}`,
                }));
                setOptions(formattedOptions);
            } catch (err) {
                console.error("Error fetching active customers:", err);
            }
        };
        fetchActiveCustomer();
    }, []);

    // When customer changes, reset address selections
    const handleCustomerChange = (selectedOption) => {
        // Always set as {value, label} object
        if (selectedOption && selectedOption.value) {
            setSelectedCustomer({ value: selectedOption.value, label: selectedOption.label });
        } else {
            setSelectedCustomer(null);
        }
        setSelectedBilling(null);
        setSelectedShipping(null);
    };

    // Get selected customer object (guard against undefined)
    const customerObj = Array.isArray(customers)
        ? customers.find(c => c._id === (selectedCustomer?.value || selectedCustomer))
        : null;

    // Ensure selectedCustomer is always an object for react-select
    const selectedCustomerOption = options.find(opt => opt.value === (selectedCustomer?.value || selectedCustomer)) || null;

    // Helper to get address options (for future: if multiple addresses per type)
    const billingOptions = customerObj && Array.isArray(customerObj.billing)
        ? customerObj.billing.map((addr, idx) => ({ value: idx, label: `${addr.name || "Billing Address"} - ${addr.address1 || ""}` }))
        : customerObj && customerObj.billing ? [{ value: 0, label: `${customerObj.billing.name || "Billing Address"} - ${customerObj.billing.address1 || ""}` }] : [];

    const shippingOptions = customerObj && Array.isArray(customerObj.shipping)
        ? customerObj.shipping.map((addr, idx) => ({ value: idx, label: `${addr.name || "Shipping Address"} - ${addr.address1 || ""}` }))
        : customerObj && customerObj.shipping ? [{ value: 0, label: `${customerObj.shipping.name || "Shipping Address"} - ${customerObj.shipping.address1 || ""}` }] : [];

    // Get selected address object
    const billingAddr = customerObj && Array.isArray(customerObj.billing)
        ? customerObj.billing[selectedBilling?.value || 0]
        : customerObj && customerObj.billing ? customerObj.billing : null;

    const shippingAddr = customerObj && Array.isArray(customerObj.shipping)
        ? customerObj.shipping[selectedShipping?.value || 0]
        : customerObj && customerObj.shipping ? customerObj.shipping : null;

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                axios
                    .get(`${BASE_URL}/api/products/search?name=${searchTerm}`,{
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

    // Handler for selecting a product from search results
    const handleProductSelect = (product) => {
        setSelectedProducts((prev) => {
            if (prev.some((p) => p._id === product._id)) return prev;
            return [
                ...prev,
                {
                    ...product,
                    quantity: 1, // default quantity
                    discount: 0,
                    tax: 0,
                },
            ];
        });
        setProducts([]); // Auto-close search results after selection
        setSearchTerm(""); // Optionally clear search input
    };

    const handleRemoveProduct = (id) => {
        setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
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
    return (
        // <div className="modal show" style={{ display: 'block' }}>
        //     <div className="modal-dialog add-centered">
           <div className="modal show" id="add-sales-edits"style={{ display: 'block' }}>
      <div className="modal-dialog add-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="page-title">
                            <h4>Edit Sales</h4>
                        </div>
                        <button type="button" className="close" onClick={onClose} aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card border-0">
                            <div className="card-body pb-0">

                                <div className="top-content">
                                    <div className="purchase-header mb-3">
                                        <h6>Sales Details afroz</h6>
                                    </div>
                                    <div>
                                        <div className="row justify-content-between">
                                            <div className="col-md-6">
                                                <div className="purchase-top-content">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Reference ID<span className="text-danger ms-1">*</span>
                                                                </label>
                                                                <input type="text" className="form-control" value={referenceNumber} readOnly />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Date<span className="text-danger ms-1">*</span></label>
                                                                <div className="input-groupicon calender-input">
                                                                    <input type="date" className="datetimepicker form-control" value={saleDate} min={new
                                                                        Date().toISOString().slice(0, 10)} onChange={e => {
                                                                            setSaleDate(e.target.value);
                                                                            setDateError("");
                                                                        }}
                                                                        placeholder="Choose"
                                                                    />
                                                                    {dateError && (
                                                                        <div className="text-danger mt-1" style={{ fontSize: "13px" }}>{dateError}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <label className="form-label">Customer Name<span className="text-danger ms-1">*</span></label>
                                                                <div className="row">
                                                                    <div className="col-lg-11 col-sm-10 col-10">

                                                                        {/* <Select options={options} value={selectedCustomer} // onChange={option=> {
                                      // setSelectedCustomer(option);
                                      // setSelectedBilling(null);
                                      // setSelectedShipping(null);
                                      // }}
                                      onChange={handleCustomerChange}
                                      placeholder="Choose a customer..."
                                      isClearable
                                    /> */}
                                                                        <Select
                                                                            options={options}
                                                                            value={selectedCustomerOption}  // <-- from your computed variable
                                                                            onChange={handleCustomerChange}
                                                                            placeholder="Choose a customer..."
                                                                            isClearable
                                                                        />
                                                                        {/* Billing address dropdown if multiple */}
                                                                        {billingOptions.length > 1 && (
                                                                            <Select className="mt-2" options={billingOptions} value={selectedBilling}
                                                                                onChange={setSelectedBilling} placeholder="Select Billing Address" />
                                                                        )}
                                                                        {/* Shipping address dropdown if multiple */}
                                                                        {shippingOptions.length > 1 && (
                                                                            <Select className="mt-2" options={shippingOptions} value={selectedShipping}
                                                                                onChange={setSelectedShipping} placeholder="Select Shipping Address" />
                                                                        )}

                                                                    </div>
                                                                    <div className="col-lg-1 col-sm-2 col-2 ps-0">
                                                                        <div className="add-icon">
                                                                            <a href="#" className="bg-dark text-white p-2 rounded" data-bs-toggle="modal"
                                                                                data-bs-target="#add_customer"><i data-feather="plus-circle" className="plus" /></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <a href="javascript:void(0);" className="d-flex align-items-center "><i
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
                                                                    <img src="assets/img/invoice-logo.svg" className="invoice-logo-dark" alt="img" />
                                                                    <img src="assets/img/invoice-logo-white-2.svg" className="invoice-logo-white" alt="img" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                {/* STATUS — bind to top-level `status` state */}
                                                                <select
                                                                    className="form-select"
                                                                    name="status"
                                                                    value={status}
                                                                    onChange={(e) => setStatus(e.target.value)}
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Complete">Complete</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                    <option value="In Progress">In Progress</option>
                                                                    <option value="On Hold">On Hold</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                {/* CURRENCY — keep inside formState */}
                                                                <select
                                                                    className="form-select"
                                                                    name="currency"
                                                                    value={formState.currency || ""}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="">Currency</option>
                                                                    <option value="$">$</option>
                                                                    <option value="€">€</option>
                                                                    <option value="₹">₹</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="p-2 border rounded d-flex justify-content-between">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="form-check form-switch me-4">
                                                                        {/* <input className="form-check-input" type="checkbox" role="switch" id="enabe_tax"
                                      name="enableTax" checked={formState.enableTax} onChange={handleChange} /> */}
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            role="switch"
                                                                            id="enableTaxSwitch"
                                                                            name="enableTax"
                                                                            checked={!!formState.enableTax}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="enabe_tax">Enable Tax</label>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <a><span className="bg-primary-subtle p-1 rounded"><i
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

                                {/* Bill From/To content for selected customer */}
                                {customerObj && (
                                    <div className="bill-content pb-0">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    {/* <div className="card-header border-0 pb-0">
                <h6>Bill From</h6>
              </div> */}
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <label className="form-label">Billing Adress</label>
                                                            <input type="text" className="form-control" value={billingAddr?.name || ""} readOnly />
                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    <span className="p-2 rounded ">
                                                                        {/* Optionally show image if available */}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">{billingAddr?.name}</h6>
                                                                    <p className="mb-0">{billingAddr?.address1}</p>
                                                                    <p className="mb-0">Phone : {customerObj?.phone}</p>
                                                                    <p className="mb-0">Email : {customerObj?.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Bill To Section */}
                                            <div className="col-md-6">
                                                <div className="card box-shadow-0">
                                                    {/* <div className="card-header border-0 pb-0">
                <h6>Bill To</h6>
              </div> */}
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <label className="form-label">Shipping Adress</label>
                                                            </div>
                                                            <input type="text" className="form-control" value={shippingAddr?.name || ""} readOnly />
                                                        </div>
                                                        <div className="p-3 bg-light rounded border">
                                                            <div className="d-flex">
                                                                <div className="me-3">
                                                                    {/* Optionally show image if available */}
                                                                </div>
                                                                <div>
                                                                    <h6 className="fs-14 mb-1">{shippingAddr?.name}</h6>
                                                                    <p className="mb-0">{shippingAddr?.address1}</p>
                                                                    <p className="mb-0">Phone : {customerObj?.phone}</p>
                                                                    <p className="mb-0">Email : {customerObj?.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* product & search */}
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
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                                            defaultChecked />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            Product
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
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
                                                <input type="text" className="form-control" placeholder="Search Product" value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                                        <div key={product._id} className="d-flex align-items-start justify-content-between py-2 border-bottom"
                                                            onClick={() =>
                                                                handleProductSelect(product)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <div className="d-flex align-items-start gap-3">
                                                                {product.images?.[0] && (
                                                                    <img src={product.images[0].url} alt={product.productName} className="media-image"
                                                                        style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                                                                )}
                                                                <div>
                                                                    <h6 className="fw-bold mb-1">{product.productName}</h6>
                                                                    <p className="text-muted small mb-0">
                                                                        {product.category?.categoryName || "No Category"} •{" "}
                                                                        {product.subCategory?.subCategoryName || "No Sub"} • ₹{product.sellingPrice || product.price || 0}
                                                                        • Available Qty -{" "}
                                                                        {product.availableQty || product.quantity || 0}/ {product.unit}
                                                                        • {product.productCode || "N/A"}
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
                                                    <th>Sale Qty</th>
                                                    <th> Selling Price</th>
                                                    {formState.enableTax && (
                                                        <>
                                                            <th>Tax Amount</th>
                                                        </>
                                                    )}
                                                    <th> Unit Cost</th>
                                                    <th>Total Return</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProducts.length > 0 ? (
                                                    selectedProducts.map((product, index) => {
                                                        const qty = product.quantity;
                                                        const availableQty = product.availableQty || 0;
                                                        const remainingQty = availableQty - qty;
                                                        // const price = product.sellingPrice || 0;
                                                        // const discount = product.discount || 0;
                                                        // const tax = product.tax || 0;
                                                        // const subTotal = saleQty * price;
                                                        // const afterDiscount = subTotal - discount;
                                                        // const taxAmount = (afterDiscount * tax) / 100;
                                                        // const lineTotal = afterDiscount + taxAmount;
                                                        // const unitCost = saleQty > 0 ? lineTotal / saleQty : 0;

                                                        // const qty = product.quantity;
                                                        const price = product.sellingPrice || 0;
                                                        const discount = product.discount || 0;
                                                        const tax = product.tax || 0;
                                                        const subTotal = qty * price;
                                                        const discountAmount = (product.discountType === 'Percentage' || product.isDiscountPercent)
                                                          ? (subTotal * discount) / 100
                                                          : qty * discount; // per-unit fixed/rupees discount
                                                        const afterDiscount = subTotal - discountAmount;
                                                        const taxAmount = (afterDiscount * tax) / 100;
                                                        const lineTotal = afterDiscount + taxAmount;
                                                        const unitCost = qty > 0 ? lineTotal / qty : 0;
                                                        return (
                                                            <tr key={product._id}>
                                                                <td>
                                                                    {product.productName}
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        Available Stock: {remainingQty} {product.unit} (Before Sale: {availableQty})
                                                                    </small>
                                                                </td>
                                                                {/* <td>
                  <input type="number" className="form-control form-control-sm"
                    style={{ width: "70px", textAlign: "center" }} min={1} max={availableQty} value={qyt} onChange={e=>
                  {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 1) val=1; if (val> availableQty) val = availableQty;
                    setSelectedProducts(prev =>
                    prev.map((item, i) =>
                    i === index ? { ...item, qyt: val } : item
                    )
                    );
                    }}
                    />
                    <span className="text-muted ms-2">{product.unit}</span>
                </td> */}

                                                                <td>
                                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                                        <input type="number" className="form-control form-control-sm"
                                                                            style={{ width: "70px", textAlign: "center" }} min="1" max={product.availableQty || 9999}
                                                                            value={qty} onChange={(e) => {
                                                                                let val = parseInt(e.target.value, 10);
                                                                                if (isNaN(val)) val = 1;
                                                                                if (val < 1) val = 1; if (val > (product.availableQty || 9999)) val = product.availableQty || 9999;
                                                                                setSelectedProducts((prev) =>
                                                                                    prev.map((item, i) =>
                                                                                        i === index ? { ...item, quantity: val } : item
                                                                                    )
                                                                                );
                                                                            }}
                                                                        />
                                                                        <span className="text-muted">{product.unit}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input type="number" className="form-control form-control-sm" style={{ width: "90px" }} min="0"
                                                                        value={price} onChange={(e) => {
                                                                            const val = parseFloat(e.target.value);
                                                                            setSelectedProducts((prev) =>
                                                                                prev.map((item, i) =>
                                                                                    i === index
                                                                                        ? { ...item, sellingPrice: isNaN(val) ? 0 : val }
                                                                                        : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>

                                                                {formState.enableTax && (
                                                                    <td>₹{taxAmount.toFixed(2)}</td>
                                                                )}

                                                                <td>₹{unitCost.toFixed(2)}</td>
                                                                <td className="fw-semibold text-success">
                                                                    ₹{lineTotal.toFixed(2)}
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(product._id)}
                                                                        type="button"
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

                                    {/* Table list end
        <div>
          <a href="#" className="d-inline-flex align-products-center add-invoice-data"><i
              className="isax isax-add-circle5 text-primary me-1" />Add New</a>
        </div> */}
                                </div>

                                <div className="extra-info mt-3">
                                    {/* start row */}
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="mb-3">
                                                <h6 className="mb-3">Extra Information</h6>
                                                <div>
                                                    <ul className="nav nav-tabs nav-solid-primary mb-3" role="tablist">
                                                        <li className="nav-item me-2" role="presentation">
                                                            <a className="nav-link active border fs-12 fw-semibold rounded" data-bs-toggle="tab"
                                                                data-bs-target="#notes" aria-current="page" href="javascript:void(0);"><i
                                                                    className="isax isax-document-text me-1" />Add Notes</a>
                                                        </li>
                                                        {formState.enableAddCharges && (<li className="nav-item me-2" role="presentation">
                                                            <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab"
                                                                data-bs-target="#addCharges" href="javascript:void(0);"><i
                                                                    className="isax isax-document me-1" />Additional Charges</a>
                                                        </li>)}

                                                        {formState.enableTax && (
                                                            <li className="nav-item me-2" role="presentation">
                                                                <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab" data-bs-target="#tax"
                                                                    href="javascript:void(0);"><i className="isax isax-document me-1" />Tax</a>
                                                            </li>)}

                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab" data-bs-target="#bank"
                                                                href="javascript:void(0);"><i className="isax isax-bank me-1" />Bank Details</a>
                                                        </li>
                                                    </ul>

                                                    <div className="tab-content">
                                                        <div className="tab-pane active show" id="notes" role="tabpanel">
                                                            <label className="form-label">Additional Notes</label>
                                                            <textarea className="form-control" name="notes" value={formState.notes || ""}
                                                                onChange={handleChange} />
                                                        </div>
                                                        {formState.enableAddCharges && (<div className="tab-pane fade" id="addCharges" role="tabpanel">
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Labour Cost
                                                                        </label>
                                                                        <input type="text" className="form-control" value={labourCost} onChange={(e) =>
                                                                            setLabourCost(parseFloat(e.target.value) || 0)} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Discount
                                                                        </label>
                                                                        <input type="text" className="form-control" value={orderDiscount} onChange={(e) =>
                                                                            setOrderDiscount(parseFloat(e.target.value) || 0)} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">
                                                                            Shipping
                                                                        </label>
                                                                        <input type="text" className="form-control" value={shippingCost} onChange={(e) =>
                                                                            setShippingCost(parseFloat(e.target.value) || 0)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}

                                                        {formState.enableTax && (<div className="tab-pane fade" id="tax" role="tabpanel">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-md-6 col-sm-12">
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <p className="fw-semibold fs-14 text-gray-9 mb-0">CGST</p>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <input type="text" className="form-control form-control-sm w-auto d-inline-block" style={{ minWidth: 80 }}
                                                                                name="cgst" value={formState.cgst || ""} onChange={handleChange} placeholder="% or value" />
                                                                            <span className="ms-2">₹ {cgstValue ? cgstValue.toFixed(2) : '0.00'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-6 col-sm-12">
                                                                    <div className="mb-3">
                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                            <p className="fw-semibold fs-14 text-gray-9 mb-0">SGST</p>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <input type="text" className="form-control form-control-sm w-auto d-inline-block" style={{ minWidth: 80 }}
                                                                                    name="sgst" value={formState.sgst || ""} onChange={handleChange} placeholder="% or value" />
                                                                                <span className="ms-2">₹ {sgstValue ? sgstValue.toFixed(2) : '0.00'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}


                                                        <div className="tab-pane fade" id="bank" role="tabpanel">
                                                            <div className="row mt-3">
                                                                <div className="col-lg-4">
                                                                    <label>Payment Type</label>
                                                                    <select className="form-select" value={paymentType} onChange={e => {
                                                                        setPaymentType(e.target.value);
                                                                        setPaymentMethod(""); // reset payment method when payment type changes
                                                                    }}
                                                                    >
                                                                        <option value="Full">Full Payment</option>
                                                                        <option value="Partial">Partial Payment</option>
                                                                    </select>
                                                                </div>

                                                                <div className="col-lg-4"><label>Payment Status</label>
                                                                    <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                                                                        <option>Select</option>
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
                                                                                <input type="number" className="form-control" value={grandTotal} readOnly />
                                                                            </div>
                                                                        )}

                                                                        {paymentType === "Partial" && (
                                                                            <>
                                                                                {/* Partial payment fields */}
                                                                                <div className="col-lg-4">
                                                                                    <label>Total Amount</label>
                                                                                    <input type="number" className="form-control" value={grandTotal} readOnly />
                                                                                </div>

                                                                                <div className="col-lg-4">
                                                                                    <label>Paid Amount</label>
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control"
                                                                                        value={paidAmount}
                                                                                        min="0"
                                                                                        max={grandTotal}
                                                                                        onChange={(e) => {
                                                                                            const n = Number(e.target.value) || 0;
                                                                                            const clamped = Math.max(0, Math.min(n, grandTotal));
                                                                                            setPaidAmount(clamped);
                                                                                        }}
                                                                                    />
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
                                                                                        <input
                                                                                            type="radio"
                                                                                            className="form-check-input"
                                                                                            name="paymentMethod"             // <-- add this
                                                                                            id={method}
                                                                                            checked={paymentMethod === method}
                                                                                            onChange={() => setPaymentMethod(method)}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor={method}>{method}</label>
                                                                                    </div>
                                                                                ))}

                                                                            </div>
                                                                        </div>

                                                                        {(paymentMethod === "Online") && (
                                                                            <>
                                                                                <div className="col-lg-4 mt-2">
                                                                                    <label>Online Payment Method</label>
                                                                                    <select
                                                                                        className="form-control"
                                                                                        value={onlineMod}
                                                                                        onChange={e => setOnlineMod(e.target.value)}
                                                                                    >
                                                                                        <option value="">-- Select Payment Method --</option>
                                                                                        <option value="UPI">UPI</option>
                                                                                        <option value="NEFT">NEFT</option>
                                                                                        <option value="RTGS">RTGS</option>
                                                                                        <option value="IMPS">IMPS</option>
                                                                                        <option value="Net Banking">Net Banking</option>
                                                                                        <option value="Credit Card">Credit Card</option>
                                                                                        <option value="Debit Card">Debit Card</option>
                                                                                        <option value="Wallet">Wallet</option>
                                                                                    </select>
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

                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="col-md-5">
                                            <ul className="mb-0 ps-0 list-unstyled">
                                                <li className="mb-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <p className="fw-semibold fs-14 text-gray-9 mb-0">Amount</p>
                                                        <h6 className="fs-14">₹ {amount.toFixed(2)}</h6>
                                                    </div>
                                                </li>
                                                {formState.enableTax && (
                                                    <>
                                                        <li className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <p className="fw-semibold fs-14 text-gray-9 mb-0">CGST</p>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="ms-2">₹ {cgstValue ? cgstValue.toFixed(2) : '0.00'}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <p className="fw-semibold fs-14 text-gray-9 mb-0">SGST</p>
                                                                <div className="d-flex align-items-center gap-2">

                                                                    <span className="ms-2">₹ {sgstValue ? sgstValue.toFixed(2) : '0.00'}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </>
                                                )}


                                                <div className="form-check form-switch me-4 mb-3">
                                                    {/* <input className="form-check-input" type="checkbox"
                            role="switch" id="enabe_tax" name="enableAddCharges"
                            checked={formState.enableAddCharges}
                            onChange={handleChange} /> */}
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id="enableAddChargesSwitch"
                                                        name="enableAddCharges"
                                                        checked={!!formState.enableAddCharges}
                                                        onChange={handleChange}
                                                    />


                                                    <label className="form-check-label"
                                                        htmlFor="enabe_tax">Add Additional Charges</label>
                                                </div>

                                                {formState.enableAddCharges && (
                                                    <>


                                                        <li className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <p className="fw-semibold fs-14 text-gray-9 mb-0">Labour Cost</p>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="ms-2">₹ {labourCost.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="mb-3">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <p className="fw-semibold fs-14 text-gray-9 mb-0">Shipping Cost</p>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="ms-2">₹ {shippingCost.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </li>

                                                    </>

                                                )}


                                                <li className="mb-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <p className="fw-semibold fs-14 text-gray-9 mb-0">Discount</p>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <input type="text" className="form-control form-control-sm w-auto d-inline-block" style={{ minWidth: 80 }}
                                                                value={orderDiscount}
                                                                onChange={e => setOrderDiscount(parseFloat(e.target.value) || 0)}
                                                                placeholder={isDiscountPercent ? "%" : "Value"}
                                                            />
                                                            <div className="form-check form-switch ms-2">
                                                                <input className="form-check-input" type="checkbox" id="discountTypeSwitch"
                                                                    checked={isDiscountPercent}
                                                                    onChange={() => setIsDiscountPercent(prev => !prev)}
                                                                />
                                                                <label className="form-check-label" htmlFor="discountTypeSwitch">
                                                                    {isDiscountPercent ? "%" : "₹"}
                                                                </label>
                                                            </div>
                                                            <span className="ms-2">- ₹ {summaryDiscount ? summaryDiscount.toFixed(2) : '0.00'}</span>
                                                        </div>
                                                    </div>
                                                </li>


                                                <li className="pb-2 border-gray border-bottom">
                                                    <div className="p-2 d-flex justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <div className="form-check form-switch me-4">
                                                                {/* <input className="form-check-input" type="checkbox" role="switch" id="enabe_tax1" name="roundOff" checked={!!formState.roundOff} onChange={handleChange} /> */}
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    role="switch"
                                                                    id="roundOffSwitch"
                                                                    name="roundOff"
                                                                    checked={!!formState.roundOff}
                                                                    onChange={handleChange}
                                                                />
                                                                <label className="form-check-label" htmlFor="enabe_tax1">Round Off Total</label>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h6 className="fs-14">₹ {roundOffValue ? roundOffValue.toFixed(2) : "0.00"}</h6>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="mt-3 pb-3 border-bottom border-gray">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6>Total (INR)</h6>
                                                        {/* <h6>₹ {formState.roundOff ? Math.round(grandTotal) : grandTotal ? grandTotal.toFixed(2) : '0.00'}</h6> */}
                                                        <h6>
                                                            ₹ {Number.isFinite(grandTotal)
                                                                ? (formState.roundOff ? Math.round(grandTotal).toFixed(2) : grandTotal.toFixed(2))
                                                                : "0.00"}
                                                        </h6>
                                                    </div>
                                                </li>
                                                <li className="mt-3 pb-3 border-bottom border-gray">
                                                    <h6 className="fs-14 fw-semibold">Total In Words</h6>
                                                    {/* <p>{totalInWords}</p> */}
                                                </li>

                                            </ul>
                                        </div>
                                    </div>



                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary add-cancel me-3" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary add-sale">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSalesModal;
