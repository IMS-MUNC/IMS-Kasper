
import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/config';
import axios from 'axios';
import Select from 'react-select';
import { TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddCreditNoteModal = ({ creditData, onAddCredit, onClose }) => {
    // All states copied from AddSalesModal, but initialized from creditData
    const navigate = useNavigate();
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
    const token = localStorage.getItem("token");

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

    // // 🟢 Inside your component
    const [summary, setSummary] = React.useState({
        subTotal: 0,
        discountSum: 0,
        taxableSum: 0,
        cgst: 0,
        sgst: 0,
        taxSum: 0,
        shippingCost: 0,
        labourCost: 0,
        grandTotal: 0,
    });

    useEffect(() => {
        if (creditData) {
            // Initialize all states from creditData
            setSelectedCustomer(creditData.customer ? { value: creditData.customer._id || creditData.customer, label: creditData.customer.name || creditData.customer } : null);
            setSaleDate(creditData.saleDate ? creditData.saleDate.slice(0, 10) : "");
            setStatus(creditData.status || "");
            setDescription(creditData.description || "");
            // Always set referenceNumber from sale object
            setReferenceNumber(creditData.referenceNumber || "");
            setLabourCost(creditData.labourCost || 0);
            setOrderDiscount(creditData.orderDiscount || 0);
            setShippingCost(creditData.shippingCost || 0);
            setPaymentType(creditData.paymentType || "Full");
            setPaidAmount(creditData.paidAmount || 0);
            setDueAmount(creditData.dueAmount || 0);
            setDueDate(creditData.dueDate ? creditData.dueDate.slice(0, 10) : "");
            setPaymentMethod(creditData.paymentMethod || "");
            setTransactionId(creditData.transactionId || "");
            setOnlineMod(creditData.onlineMod || "");
            setTransactionDate(creditData.transactionDate ? creditData.transactionDate.slice(0, 10) : "");
            setPaymentStatus(creditData.paymentStatus || "");
            setFormState({
                notes: creditData.notes || "",
                cgst: creditData.cgst || "",
                sgst: creditData.sgst || "",
                discount: creditData.discount || "",
                roundOff: creditData.roundOff || false,
                enableTax: creditData.enableTax || false,
                enableAddCharges: creditData.enableAddCharges || false,
                currency: creditData.currency || ""
            });
        }
    }, [creditData]);


    // Always use creditData for initializing products and referenceNumber
    useEffect(() => {
        if (creditData) {
            setSelectedProducts(creditData.products || []);
            setReferenceNumber(creditData.referenceNumber || "");
        }
    }, [creditData]);


  

    // On submit, call update API
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation and sanitization
        const errors = [];
        // Example required fields: selectedCustomer, selectedProducts, saleDate, referenceNumber
        if (!selectedCustomer || !selectedCustomer.value) errors.push('Customer is required');
        if (!selectedProducts || selectedProducts.length === 0) errors.push('At least one product is required');
        if (!saleDate) errors.push('Sale date is required');
        if (!referenceNumber || !referenceNumber.trim()) errors.push('Reference number is required');
        // Add more required field checks as needed

        // Sanitize referenceNumber (remove leading/trailing spaces)
        const sanitizedReferenceNumber = referenceNumber ? referenceNumber.trim() : '';

        if (errors.length > 0) {
            toast.error(errors.join(', '));
            return;
        }
        try {
            // Prepare billing/shipping as select index or object for backend
            let billing = null;
            let shipping = null;
            if (selectedCustomer && selectedBilling !== null) {
                billing = { value: selectedBilling.value };
            }
            if (selectedCustomer && selectedShipping !== null) {
                shipping = { value: selectedShipping.value };
            }
            const payload = {
                customer: selectedCustomer?.value ? String(selectedCustomer.value) : "",
                billing,
                shipping,
                      products: selectedProducts.map(p => ({
        productId: p.productId || p._id,
        productName: (p.productName || p.name || "").trim(),
        hsnCode: (p.hsnCode || p.hsn || (p.hsnDetails ? p.hsnDetails.hsnCode : "")).trim(),
        saleQty: p.saleQty || p.quantity || 1, // original sale quantity (for reference)
        quantity: p.returnQty || 1,            // ONLY the returned quantity
        returnQty: p.returnQty || 1,           // ONLY the returned quantity
        sellingPrice: p.sellingPrice,
        discount: p.discount,
        discountType: p.discountType,
        tax: p.tax,
        unit: (p.unit || p.unitName || "").trim(),
        images: p.images || [],
        subTotal: p.subTotal,
        discountAmount: p.discountAmount,
        taxableAmount: p.taxableAmount,
        taxAmount: p.taxAmount,
        lineTotal: p.lineTotal,
        unitCost: p.unitCost,
      })),
                // products: selectedProducts.map(p => ({
                //     productId: p.productId || p._id,
                //     productName: (p.productName || p.name || "").trim(),
                //     hsnCode: (p.hsnCode || p.hsn || (p.hsnDetails ? p.hsnDetails.hsnCode : "")).trim(),
                //     saleQty: p.saleQty || p.quantity || 1,
                //     quantity: p.returnQty || p.quantity || 1,
                //     sellingPrice: p.sellingPrice,
                //     discount: p.discount,
                //     discountType: p.discountType,
                //     tax: p.tax,
                //     unit: (p.unit || p.unitName || "").trim(),
                //     images: p.images || [],
                //     subTotal: p.subTotal,
                //     discountAmount: p.discountAmount,
                //     taxableAmount: p.taxableAmount,
                //     taxAmount: p.taxAmount,
                //     lineTotal: p.lineTotal,
                //     unitCost: p.unitCost,
                //     returnQty: p.returnQty || p.quantity || 1,
                // })),
                sale: creditData?.sale?._id || creditData?.sale || "",
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
                description: description ? description.trim() : "",
                referenceNumber: sanitizedReferenceNumber,
                grandTotal: grandTotals,
                total: grandTotals,
                ...formState,
            };
            const response = await axios.post(`${BASE_URL}/api/credit-notes/return`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.success === false) {
                // If backend returns success: false, treat as error
                toast.error(response.data.error || response.data.message || 'Failed to update Credit Note');
                return;
            }
            // Only on true success:
            if (onAddCredit) onAddCredit();
            resetForm();
            setTimeout(() => {
                if (window.$) {
                    window.$('#add-sales-credit').modal('hide');
                    setTimeout(() => {
                        document.body.classList.remove('modal-open');
                        const backdrops = document.querySelectorAll('.modal-backdrop');
                        backdrops.forEach(b => b.remove());
                    }, 200);
                } else {
                    const modal = document.getElementById('add-sales-credit');
                    if (modal && modal.classList.contains('show')) {
                        modal.classList.remove('show');
                        modal.style.display = 'none';
                    }
                    document.body.classList.remove('modal-open');
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(b => b.remove());
                }
            }, 300);
            Swal.fire("Success", "Credit Note created successfully", "success");
        } catch (err) {
            // Show duplicate error if present
            if (err.response && err.response.data && (err.response.data.error || err.response.data.message)) {
                toast.error(err.response.data.error || err.response.data.message);
            } else {
                toast.error('Failed to update Credit Note');
            }
        }
    };

    if (!creditData) return null;
    useEffect(() => {
        if (!selectedProducts || selectedProducts.length === 0) return;
        let subTotal = 0;
        let discountSum = 0;
        let taxableSum = 0;
        let taxSum = 0;
        selectedProducts.forEach((item) => {
            const d = getProductRowCalculation(item);
            subTotal += d.subTotal || 0;
            discountSum += d.discountAmount || 0;
            taxableSum += d.taxableAmount || 0;
            taxSum += d.taxAmount || 0;
        });
        const cgst = taxSum / 2;
        const sgst = taxSum / 2;
        const grandTotal = (taxableSum || 0) + (taxSum || 0);
        setSummary({
            subTotal,
            discountSum,
            taxableSum,
            cgst,
            sgst,
            taxSum,
            grandTotal
        });
    }, [selectedProducts]);

   
const [amounts, setAmounts] = React.useState(0);        // Subtotal
const [discountTotal, setDiscountTotal] = React.useState(0); // Discount
const [taxTotal, setTaxTotal] = React.useState(0);    // Total tax
const [cgstValues, setCgstValues] = React.useState(0);
const [sgstValues, setSgstValues] = React.useState(0);
const [grandTotals, setGrandTotals] = React.useState(0);
  const [roundOffValue, setRoundOffValue] = useState(0);
// const [shippingCost, setShippingCost] = React.useState(0);
// const [labourCost, setLabourCost] = React.useState(0);

React.useEffect(() => {
  if (!selectedProducts || selectedProducts.length === 0) {
    setAmounts(0);
    setDiscountTotal(0);
    setTaxTotal(0);
    setCgstValues(0);
    setSgstValues(0);
    setGrandTotals(0);
    return;
  }

  let subTotal = 0;
  let discountSum = 0;
  let taxSum = 0;

  selectedProducts.forEach((p) => {
    const d = getProductRowCalculation(p); // same as in table rows
    subTotal += d.qty * d.price;           // base amount before discount
    discountSum += d.discountAmount;       // total discount
    taxSum += d.taxAmount;                 // total tax
  });

  const cgst = taxSum / 2;
  const sgst = taxSum / 2;

  setAmounts(subTotal);
  setDiscountTotal(discountSum);
  setTaxTotal(taxSum);
  setCgstValues(cgst);
  setSgstValues(sgst);

  const total = subTotal - discountSum + taxSum + shippingCost + labourCost;
  setGrandTotals(total);
}, [selectedProducts, shippingCost, labourCost]);



useEffect(() => {
  const productTotals = selectedProducts.map(getProductRowCalculation);
  const totalProductAmount = productTotals.reduce((acc, t) => acc + (t.lineTotal || 0), 0);
  const amount = totalProductAmount;
  const additionalCharges = formState.enableAddCharges ? (Number(labourCost) + Number(shippingCost)) : 0;
  let cgstValue = 0;
  let sgstValue = 0;
  if (formState.enableTax && formState.cgst) {
    cgstValue = (amount * Number(formState.cgst)) / 100;
  }
  if (formState.enableTax && formState.sgst) {
    sgstValue = (amount * Number(formState.sgst)) / 100;
  }
  let preRoundedTotal = amount + cgstValue + sgstValue + additionalCharges;
  let roundValue = 0;
  let finalTotal = preRoundedTotal;
  if (formState.roundOff) {
    finalTotal = Math.round(preRoundedTotal);
    roundValue = finalTotal - preRoundedTotal;
  }
  setGrandTotals(finalTotal);
  setRoundOffValue(roundValue);
  if (paymentType === "Partial") {
    const due = finalTotal - paidAmount;
    setDueAmount(due > 0 ? due : 0);
  } else {
    setPaidAmount(finalTotal);
    setDueAmount(0);
  }

}, [selectedProducts, shippingCost, labourCost, formState, paidAmount, paymentType]);

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
        const fetchActiveCustomer = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/customers/active`, {
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

//    old main code
    // // Handler for selecting a product from search results
    // const handleProductSelect = (product) => {
    //     const alreadyExists = selectedProducts.some((p) => p._id === product._id);
    //     if (!alreadyExists) {
    //         let taxValue = 0;
    //         if (typeof product.tax === 'number') {
    //             taxValue = product.tax;
    //         } else if (typeof product.tax === 'string') {
    //             const match = product.tax.match(/(\d+(?:\.\d+)?)%?/);
    //             taxValue = match ? parseFloat(match[1]) : 0;
    //         }
    //         // Discount logic
    //         let discountValue = 0;
    //         let discountType = 'Fixed';
    //         if (product.discountType === 'Percentage') {
    //             discountType = 'Percentage';
    //             if (typeof product.discountValue === 'number') {
    //                 discountValue = product.discountValue;
    //             } else if (typeof product.discountValue === 'string') {
    //                 const percentMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
    //                 discountValue = percentMatch ? parseFloat(percentMatch[1]) : 0;
    //             }
    //         } else {
    //             discountType = 'Fixed';
    //             if (typeof product.discountValue === 'number') {
    //                 discountValue = product.discountValue;
    //             } else if (typeof product.discountValue === 'string') {
    //                 const flatMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
    //                 discountValue = flatMatch ? parseFloat(flatMatch[1]) : 0;
    //             }
    //         }

    //         setSelectedProducts((prev) => {
    //             if (prev.some((p) => p._id === product._id)) return prev;
    //             return [
    //                 ...prev,
    //                 {
    //                     ...product,
    //                     productName: product.productName || product.name || "",
    //                     quantity: 1,
    //                     availableQty: product.quantity || 0,
    //                     discount: discountValue,
    //                     discountType: discountType,
    //                     tax: taxValue,
    //                     unitName: product.unit || "",
    //                     purchasePrice: product.purchasePrice || product.price || 0,
    //                     images: product.images || [],
    //                     hsnCode: product.hsnCode || "",
    //                     returnQty: 1, // default returnQty
    //                 },
    //             ];
    //         });
    //     }
    //     setProducts([]);
    //     setSearchTerm("");
    // };


const handleProductSelect = (product) => {
  const alreadyExists = selectedProducts.some((p) => p._id === product._id);
  if (alreadyExists) return;

  // --- TAX ---
  let taxValue = 0;
  if (typeof product.tax === "number") {
    taxValue = product.tax;
  } else if (typeof product.tax === "string") {
    const match = product.tax.match(/(\d+(?:\.\d+)?)%?/);
    taxValue = match ? parseFloat(match[1]) : 0;
  }

  // --- DISCOUNT ---
  let discountValue = 0;
  let discountType = product.discountType === "Percentage" ? "Percentage" : "Fixed";
  const discountStr = product.discountValue?.toString() || "0";
  const match = discountStr.match(/(\d+(?:\.\d+)?)/);
  discountValue = match ? parseFloat(match[1]) : 0;

  // --- Build Previous Credit Notes for this Product ---
  let previousCreditNotes = [];
  let totalReturnedQty = 0;
  if (creditData?.creditNotes?.length) {
    previousCreditNotes = creditData.creditNotes
      .map((cn) => {
        const prod = cn.products?.find(
          (p) => p.productId?.toString() === product._id?.toString()
        );
        const saleMatch =
          cn.referenceNumber === creditData.referenceNumber ||
          cn.sale?._id?.toString() === creditData._id?.toString();

        if (prod && saleMatch) {
          return {
            creditNoteId: cn._id,
            quantity: Number(prod.returnQty || prod.quantity || 0),
          };
        }
        return null;
      })
      .filter(Boolean);

    // Calculate total returned quantity
    totalReturnedQty = previousCreditNotes.reduce(
      (total, cn) => total + Number(cn.quantity || 0),
      0
    );
  }


  // Set saleQty as original sale quantity minus total returned
  const originalSaleQty = Number(product.saleQty || product.quantity || 0);
  const availableQty = originalSaleQty - totalReturnedQty;


  setSelectedProducts((prev) => [
    ...prev,
    {
      ...product,
      productName: product.productName || product.name || "",
      quantity: originalSaleQty,
      saleQty: originalSaleQty, // keep for reference
      availableQty: availableQty,
      discount: discountValue,
      discountType,
      tax: taxValue,
      unitName: product.unit || "",
      purchasePrice: Number(product.purchasePrice || product.price || 0),
      images: product.images || [],
      hsnCode: product.hsnCode || "",
      returnQty: 1,
      creditNotes: previousCreditNotes,
      totalReturnedQty, // attach for calculation/debug
    },
  ]);

  setProducts([]);
  setSearchTerm("");
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

    // function getProductRowCalculation(item) {
    //     // Use returnQty for calculation, fallback to 1 if not set
    //     const availableQty = item.saleQty || item.quantity || 0;
    //     const saleQty = Number(item.returnQty || 1);
    //     const price = Number(item.sellingPrice || 0);
    //     const discount = Number(item.discount || 0);
    //     const tax = Number(item.tax || 0);
    //     const subTotal = saleQty * price;
    //     // 🔧 Fixed discount logic
    //     let discountAmount = 0;
    //     if (item.discountType === "Percentage") {
    //         discountAmount = (subTotal * discount) / 100;
    //     } else if (item.discountType === "Rupees" || item.discountType === "Fixed") {
    //         discountAmount = saleQty * discount; // ✅ per unit ₹ discount
    //     } else {
    //         discountAmount = 0;
    //     }
    //     // const discountAmount = discount;
    //     const taxableAmount = subTotal - discountAmount;
    //     const taxAmount = (taxableAmount * tax) / 100;
    //     const lineTotal = taxableAmount + taxAmount;
    //     const unitCost = saleQty > 0 ? lineTotal / saleQty : 0;

    //     return {
    //         subTotal,
    //         discountAmount,
    //         taxableAmount,
    //         taxAmount,
    //         lineTotal,
    //         unitCost,
    //         tax,
    //         saleQty, // This is now returnQty
    //         price
    //     };
    // }

function getProductRowCalculation(item) {
  const originalQty = Number(item.saleQty || item.quantity || 0);

  // 🧮 Sum of all previous returns from credit notes
  const totalReturnedQty = Array.isArray(item.creditNotes)
    ? item.creditNotes.reduce(
        (total, cn) => total + Number(cn.quantity || 0),
        0
      )
    : 0;

  console.log("🧮 Calculating for item:", item.productName || item.name, {
    originalQty,
    totalReturnedQty,
    creditNotes: item.creditNotes,
  });

  const availableQtys = originalQty - totalReturnedQty;
  const saleQty = Number(item.returnQty || 1);
  const price = Number(item.sellingPrice || item.purchasePrice || 0);
  const discount = Number(item.discount || 0);
  const tax = Number(item.tax || 0);

  const subTotal = saleQty * price;
  const discountAmount =
    item.discountType === "Percentage"
      ? (subTotal * discount) / 100
      : saleQty * discount;

  const taxableAmount = subTotal - discountAmount;
  const taxAmount = (taxableAmount * tax) / 100;
  const lineTotal = taxableAmount + taxAmount;
  const unitCost = saleQty > 0 ? lineTotal / saleQty : 0;

  return {
    originalQty,
    totalReturnedQty,
    availableQtys,
    subTotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    lineTotal,
    unitCost,
    saleQty,
    price,
    tax,
  };
}



    const handleQtyChange = (id, value) => {
  setSelectedProducts((prev) =>
    prev.map((p) =>
      p._id === id ? { ...p, returnQty: Number(value) } : p
    )
  );
};


    return (
        <div className="modal fade" id="add-sales-credit">
            <div className="modal-dialog add-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="page-title">
                            <h4>Credit Note Sales</h4>
                        </div>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card border-0">
                            <div className="card-body pb-0">

                                <div className="top-content">

                                    <div>
                                        <div className="row justify-content-between">
                                            <div className="purchase-top-content">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Customer Name<span className="text-danger ms-1">*</span></label>
                                                            <div className="row">
                                                                <div className="col-lg-11 col-sm-10 col-10">

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

                                                    <div className="col-md-2">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Reference ID<span className="text-danger ms-1">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" value={referenceNumber} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
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

                                                    <div className="col-md-2">
                                                        <label className="form-label">Status<span className="text-danger ms-1">*</span></label>

                                                        <div className="mb-3">
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

                                                </div>
                                            </div>

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

                                    <div className="row">

                                  
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
                                                    <th>HSN Code</th>
                                                    <th>Qty</th>
                                                    <th>Return Qyt</th>
                                                    <th>Selling Price</th>
                                                    <th>Discount</th>
                                                    <th>Sub Total</th>
                                                    <th>Discount Amount</th>
                                                    <th>Tax (%)</th>
                                                    <th>Tax Amount</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProducts.length > 0 ? (
                                                    selectedProducts.map((item, index) => {

                                                        const d = getProductRowCalculation(item);
                                                        console.log("Calculations for", item.productName, d);
                                                        return (

                                                            <tr key={item._id}>

                                                                <td>
                                                                    {item.productName}
                                                                    <br />
                                                                    <small className="text-muted">
                                                                        Original: {d.originalQty} {item.unitName} |{" "}
                                                                        Returned: {d.totalReturnedQty} {item.unitName} |{" "}
                                                                        Available: {d.availableQtys} {item.unitName}
                                                                    </small>
                                                                </td>

                                                                <td>{item.hsnCode || '-'}</td>
                                                                <td>{item.availableQty}</td>
                                                                {/* <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control form-control-sm"
                                                                        style={{ width: "70px", textAlign: "center" }}
                                                                        min="1"
                                                                        max={item.saleQty || item.quantity || 0}
                                                                        value={item.returnQty || 1}
                                                                        onChange={e => {
                                                                            let val = parseInt(e.target.value, 10);
                                                                            const maxQty = item.saleQty || item.quantity || 0;
                                                                            if (isNaN(val) || val < 1) val = 1;
                                                                            if (val > maxQty) val = maxQty;
                                                                            setSelectedProducts(prev =>
                                                                                prev.map((p, i) =>
                                                                                    i === index ? { ...p, returnQty: val } : p
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <span className="text-muted">{item.unit}</span>
                                                                </td> */}
                                                                <td>
                                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control form-control-sm"
                                                                            style={{ width: "70px", textAlign: "center" }}
                                                                            min="1"
                                                                            max={item.availableQty || 0}
                                                                            value={item.returnQty === 0 ? "" : item.returnQty} // 👈 blank if zero
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;

                                                                                // Allow blank temporarily (when deleting digits)
                                                                                if (val === "") {
                                                                                    setSelectedProducts((prev) =>
                                                                                        prev.map((p, i) =>
                                                                                            i === index ? { ...p, returnQty: 0 } : p
                                                                                        )
                                                                                    );
                                                                                    return;
                                                                                }

                                                                                let num = parseInt(val, 10);
                                                                                if (isNaN(num) || num < 1) num = 1;
                                                                                if (num > (item.availableQty || 0)) num = item.availableQty;

                                                                                setSelectedProducts((prev) =>
                                                                                    prev.map((p, i) =>
                                                                                        i === index ? { ...p, returnQty: num } : p
                                                                                    )
                                                                                );
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                // When focus leaves, if field is empty, reset to 1
                                                                                if (e.target.value === "") {
                                                                                    setSelectedProducts((prev) =>
                                                                                        prev.map((p, i) =>
                                                                                            i === index ? { ...p, returnQty: 1 } : p
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="text-muted ms-1">{item.unit}</span>
                                                                    </div>
                                                                </td>

                                                                <td>₹{d.price}</td>
                                                                <td>
                                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                                        <span className="" >
                                                                            {item.discount}
                                                                        </span>
                                                                        <span className="ms-1">
                                                                            {item.discountType === "Percentage" ? "%" : "₹"}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>₹{d.subTotal}</td>
                                                                <td>₹{d.discountAmount}</td>
                                                                <td>{d.tax}%</td>
                                                                <td>₹{d.taxAmount}</td>
                                                                <td>

                                                                    <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(item._id)} type="button">
                                                                        <TbTrash />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="text-center text-muted">No products selected.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Table list end
                                        
                                    {/* start row */}
                                    <div className="row">
                                        
                                        

                                        {/* summary calculation*/}
                                        <div className="col-md-5 ms-auto mb-3">
                                            <div className="d-flex justify-content-between border-bottom mb-2 pe-3">
                                                <p>Sub Total</p>
                                                <p>₹ {Number(summary.subTotal || 0).toFixed(2)}</p>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2 pe-3">
                                                <p>Discount</p>
                                                <p>- ₹ {Number(summary.discountSum || 0).toFixed(2)}</p>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2 pe-3">
                                                <p>Taxable Value</p>
                                                <p>₹ {Number(summary.taxableSum || 0).toFixed(2)}</p>
                                            </div>

                                            <div className="d-flex justify-content-between mb-2 pe-3">
                                                <p>CGST</p>
                                                <p>₹ {Number(summary.cgst || 0).toFixed(2)}</p>
                                            </div>

                                            <div className="d-flex justify-content-between border-bottom mb-2 pe-3">
                                                <p>SGST</p>
                                                <p>₹ {Number(summary.sgst || 0).toFixed(2)}</p>
                                            </div>    
                                            <div className="d-flex justify-content-between fw-bold mb-2 pe-3">
                                                <h5>Total Invoice Amount</h5>
                                                <h5>₹ {Number(summary.grandTotal || 0).toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>



                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary add-cancel me-3" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary add-sale">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCreditNoteModal;









