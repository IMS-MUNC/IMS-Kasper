
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../../../styles/purchase/purchase.css";
import "../../../styles/sales/sales.css";
import BASE_URL from '../../config/config';
import axios from 'axios';
import Select from "react-select";
import { TbCashBanknote, TbCirclePlus, TbPlus, TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';
import AddCustomerModal from '../customerModals/AddCustomerModal';
import Loader from '../../../utils/Loader/Loader';
import Swal from 'sweetalert2';

const AddSalesModal = ({ onSuccess, onClose }) => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
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

  const [loading, setLoading] = useState(false);

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

  const [selectedSupplier, setSelectedSupplier] = useState(null);




  // Discount type state: true = percent, false = value
  const [isDiscountPercent, setIsDiscountPercent] = useState(false);
  const token = localStorage.getItem("token");
  // FORM STATE SETUP (like your other useState fields)
  const [formState, setFormState] = useState({
    notes: "",
    cgst: "",
    sgst: "",
    discount: "",
    roundOff: false,

    enableTax: false,
    enableAddCharges: false
  });



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
        const res = await axios.get(`${BASE_URL}/api/sales/next-reference`, {
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

  // Handler for selecting a product from search results
  const handleProductSelect = (product) => {
    const alreadyExists = selectedProducts.some((p) => p._id === product._id);
    if (!alreadyExists) {
      let taxValue = 0;
      if (typeof product.tax === 'number') {
        taxValue = product.tax;
      } else if (typeof product.tax === 'string') {
        const match = product.tax.match(/(\d+(?:\.\d+)?)%?/);
        taxValue = match ? parseFloat(match[1]) : 0;
      }
      // Discount logic
      let discountValue = 0;
      let discountType = 'Fixed';
      if (product.discountType === 'Percentage') {
        discountType = 'Percentage';
        if (typeof product.discountValue === 'number') {
          discountValue = product.discountValue;
        } else if (typeof product.discountValue === 'string') {
          const percentMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
          discountValue = percentMatch ? parseFloat(percentMatch[1]) : 0;
        }
      } else {
        discountType = 'Fixed';
        if (typeof product.discountValue === 'number') {
          discountValue = product.discountValue;
        } else if (typeof product.discountValue === 'string') {
          const flatMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
          discountValue = flatMatch ? parseFloat(flatMatch[1]) : 0;
        }
      }

      setSelectedProducts((prev) => {
        if (prev.some((p) => p._id === product._id)) return prev;
        return [
          ...prev,
          {
            ...product,
            productName: product.productName || product.name || "",
            quantity: 1,
            availableQty: product.quantity || 0,
            discount: discountValue,
            discountType: discountType,
            tax: taxValue,
            unitName: product.unit || "",
            purchasePrice: product.purchasePrice || product.price || 0,
            images: product.images || [],
            hsnCode: product.hsnCode || "",
          },
        ];
      });
    }
    setProducts([]);
    setSearchTerm("");
  };

  const handleSelectProduct = (product) => {
    const alreadyExists = selectedProducts.some((p) => p._id === product._id);
    if (!alreadyExists) {
      let taxValue = 0;
      if (typeof product.tax === 'number') {
        taxValue = product.tax;
      } else if (typeof product.tax === 'string') {
        const match = product.tax.match(/(\d+(?:\.\d+)?)%?/);
        taxValue = match ? parseFloat(match[1]) : 0;
      }
      // Discount logic
      let discountValue = 0;
      let discountType = 'Fixed';
      if (product.discountType === 'Percentage') {
        discountType = 'Percentage';
        if (typeof product.discountValue === 'number') {
          discountValue = product.discountValue;
        } else if (typeof product.discountValue === 'string') {
          const percentMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
          discountValue = percentMatch ? parseFloat(percentMatch[1]) : 0;
        }
      } else {
        discountType = 'Fixed';
        if (typeof product.discountValue === 'number') {
          discountValue = product.discountValue;
        } else if (typeof product.discountValue === 'string') {
          const flatMatch = product.discountValue.match(/(\d+(?:\.\d+)?)/);
          discountValue = flatMatch ? parseFloat(flatMatch[1]) : 0;
        }
      }

      setSelectedProducts((prev) => {
        if (prev.some((p) => p._id === product._id)) return prev;
        return [
          ...prev,
          {


            ...product,
            productName: product.productName || product.name || "",
            quantity: 1,
            availableQty: product.quantity || 0,
            discount: discountValue,
            discountType: discountType,
            tax: taxValue,
            unitName: product.unit || "",
            purchasePrice: product.purchasePrice || product.price || 0,
            images: product.images || [],
            // quantity: 1, // default quantity
            // discount: 0,
            // tax: 0,
            hsnCode: product.hsnCode || "", // Ensure HSN code is present
          },
        ];
      });
      // setSelectedProducts([
      //   ...selectedProducts,
      //   {
      //     ...product,
      //     productName: product.productName || product.name || "",
      //     quantity: 1,
      //     availableQty: product.quantity || 0,
      //     discount: discountValue,
      //     discountType: discountType,
      //     tax: taxValue,
      //     unitName: product.unit || "",
      //     purchasePrice: product.purchasePrice || product.price || 0,
      //     images: product.images || []
      //   },
      // ]);
    }
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

  // Remove old grandTotal declaration
  // const grandTotal = totalItemCost + labourCost + shippingCost - orderDiscount;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Preview images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  // 🔹 Handle Submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true); // start loading
  //   try {
  //     // Add per-product calculation details
  //     const productsWithCalc = selectedProducts.map(p => {
  //       const calc = getProductRowCalculation(p);
  //       return {
  //         productId: p._id,
  //         saleQty: p.saleQty || p.quantity || 1,
  //         quantity: p.quantity,
  //         sellingPrice: p.sellingPrice,
  //         discount: p.discount,
  //         discountType: p.discountType,
  //         tax: p.tax,
  //         unit: p.unit || "",
  //         hsnCode: p.hsnCode || "",
  //         subTotal: calc.subTotal,
  //         discountAmount: calc.discountAmount,
  //         taxableAmount: calc.taxableAmount,
  //         taxAmount: calc.taxAmount,
  //         lineTotal: calc.lineTotal,
  //         unitCost: calc.unitCost,
  //       };
  //     });

  //     // Add bill summary
  //     const billSummary = calculateBillSummary(selectedProducts, shippingCost, labourCost);

  //     const payload = {
  //       customer: selectedCustomer?.value ? String(selectedCustomer.value) : "",
  //       billing: billingAddr,
  //       shipping: shippingAddr,
  //       products: productsWithCalc,
  //       saleDate,
  //       labourCost,
  //       orderDiscount,
  //       shippingCost,
  //       status,
  //       paymentType,
  //       paidAmount,
  //       dueAmount,
  //       dueDate,
  //       paymentMethod,
  //       transactionId,
  //       onlineMod,
  //       transactionDate,
  //       paymentStatus,
  //       images: selectedImages,
  //       description,
  //       referenceNumber,
  //       ...formState,
  //       grandTotals,
  //       roundOffValue,
  //       billSummary,
  //     };

  //     console.log("Final Payload:", payload);

  //     const response = await axios.post(`${BASE_URL}/api/sales/create`, payload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     // toast.success(response.data.message);
  //        setLoading(false);
  //     onSuccess();
  //     resetForm();
  //     navigate('/online-orders');
  //       setTimeout(() => {
  //       if (window.$) {
  //         window.$('#add-sales-new').modal('hide');
  //         // Remove leftover backdrop and modal-open class
  //         setTimeout(() => {
  //           document.body.classList.remove('modal-open');
  //           const backdrops = document.querySelectorAll('.modal-backdrop');
  //           backdrops.forEach(b => b.remove());
  //         }, 200);
  //       } else {
  //         const modal = document.getElementById('add-sales-new');
  //         if (modal && modal.classList.contains('show')) {
  //           modal.classList.remove('show');
  //           modal.style.display = 'none';
  //         }
  //         document.body.classList.remove('modal-open');
  //         const backdrops = document.querySelectorAll('.modal-backdrop');
  //         backdrops.forEach(b => b.remove());
  //       }
  //     }, 300);
  //           Swal.fire("Success", "Sales created successfully", "success");
      
  //   } catch (error) {
  //     console.error("Error saving sale:", error);
  //     toast.error(error.response?.data?.message || "Error saving sale");
  //   }
  // };

  // ...existing code...
// Replace the existing handleSubmit function with this:

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Run validation
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    const firstMsg = Object.values(errors)[0];
    toast.error(firstMsg || "Please fix the form errors");
    setLoading(false);
    return;
  }

  try {
    // sanitize some text fields
    const safeDescription = sanitizeInput(description);
    const safeReference = sanitizeInput(referenceNumber);
    const safeTransactionId = sanitizeInput(transactionId);

    // Add per-product calculation details
    const productsWithCalc = selectedProducts.map(p => {
      const calc = getProductRowCalculation(p);
      return {
        productId: p._id,
        saleQty: p.saleQty || p.quantity || 1,
        quantity: p.quantity,
        sellingPrice: p.sellingPrice,
        discount: p.discount,
        discountType: p.discountType,
        tax: p.tax,
        unit: p.unit || "",
        hsnCode: p.hsnCode || "",
        subTotal: calc.subTotal,
        discountAmount: calc.discountAmount,
        taxableAmount: calc.taxableAmount,
        taxAmount: calc.taxAmount,
        lineTotal: calc.lineTotal,
        unitCost: calc.unitCost,
      };
    });

    // Add bill summary
    const billSummary = calculateBillSummary(selectedProducts, shippingCost, labourCost);

    const payload = {
      customer: selectedCustomer?.value ? String(selectedCustomer.value) : "",
      billing: billingAddr,
      shipping: shippingAddr,
      products: productsWithCalc,
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
      transactionId: safeTransactionId,
      onlineMod,
      transactionDate,
      paymentStatus,
      images: selectedImages,
      description: safeDescription,
      referenceNumber: safeReference,
      ...formState,
      grandTotals,
      roundOffValue,
      billSummary,
    };

    console.log("Final Payload:", payload);

    const response = await axios.post(`${BASE_URL}/api/sales/create`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLoading(false);
    setFormErrors({}); // clear validation errors on success
    onSuccess();
    resetForm();
    navigate('/online-orders');

    setTimeout(() => {
      if (window.$) {
        window.$('#add-sales-new').modal('hide');
        setTimeout(() => {
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
        }, 200);
      } else {
        const modal = document.getElementById('add-sales-new');
        if (modal && modal.classList.contains('show')) {
          modal.classList.remove('show');
          modal.style.display = 'none';
        }
        document.body.classList.remove('modal-open');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
      }
    }, 300);

    Swal.fire("Success", "Sales created successfully", "success");

  } catch (error) {
    console.error("Error saving sale:", error);
    toast.error(error.response?.data?.message || "Error saving sale");
    setLoading(false);
  }
};



  // Calculate line totals for a product


  const calculateLineTotal = (product) => {
    // Use purchasePrice for inventory base calculation
    const price = product.sellingPrice || 0;
    const qty = product.quantity || 1;
    let discount = 0;
    // Discount percent or fixed
    if (product.discountType === 'Percentage' || product.isDiscountPercent) {
      discount = ((price * qty) * (product.discount || 0)) / 100;
    } else {
      discount = product.discount || 0;
    }
    const afterDiscount = (price * qty) - discount;
    const taxAmount = (afterDiscount * (product.tax || 0)) / 100;
    return {
      subTotal: price * qty,
      afterDiscount,
      taxAmount,
      lineTotal: afterDiscount ,
      unitCost: qty > 0 ? (afterDiscount + taxAmount) / qty : 0
    };
  };

//   const calculateLineTotal = (product) => {
//   const price = product.sellingPrice || 0;
//   const qty = product.quantity || 1;
//   let discount = 0;

//   if (product.discountType === 'Percentage' || product.isDiscountPercent) {
//     // Percentage discount on total (qty × price)
//     discount = ((price * qty) * (product.discount || 0)) / 100;
//   } else {
//     // Flat discount PER UNIT
//     discount = (product.discount || 0) * qty;
//   }

//   const afterDiscount = (price * qty) - discount;
//   const taxAmount = (afterDiscount * (product.tax || 0)) / 100;

//   return {
//     subTotal: price * qty,
//     discount,
//     afterDiscount,
//     taxAmount,
//     lineTotal: afterDiscount ,
//     unitCost: qty > 0 ? (afterDiscount + taxAmount) / qty : 0
//   };
// };
  const [roundOffValue, setRoundOffValue] = useState(0);

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

  

  const [showAddModal, setShowAddModal] = useState(false);
  const [companyImages, setCompanyImages] = useState(null)
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/companyprofile/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status === 200) {
          setCompanyImages(res.data.data)
          // console.log("res.data", res.data.data)
        }
      } catch (error) {
        toast.error("Unable to find company details", {
          position: 'top-center'
        })
      }
    }
    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    if (companyImages?.companyFavicon) {
      let favicon = document.querySelector("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement("link")
        favicon.rel = "icon";
        document.head.appendChild(favicon)
      }
      favicon.type = "image/png";
      favicon.href = companyImages.companyFavicon
    }
  }, [companyImages])


const [amounts, setAmounts] = React.useState(0);        // Subtotal
const [discountTotal, setDiscountTotal] = React.useState(0); // Discount
const [taxTotal, setTaxTotal] = React.useState(0);    // Total tax
const [cgstValues, setCgstValues] = React.useState(0);
const [sgstValues, setSgstValues] = React.useState(0);
const [grandTotals, setGrandTotals] = React.useState(0);

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

// 🟢 Safe Row Calculation
const getProductRowCalculation = (product) => {
  const qty = Number(product.quantity) || 0;
  const availableQty = Number(product.availableQty) || 0;
  const remainingQty = availableQty - qty;

  const price = Number(product.sellingPrice) || 0;
  const discount = Number(product.discount) || 0;
  const tax = Number(product.tax) || 0;

  const subTotal = qty * price;

  // 🔧 Fixed discount logic
  let discountAmount = 0;
  if (product.discountType === "Percentage") {
    discountAmount = (subTotal * discount) / 100;
  } else if (product.discountType === "Rupees" || product.discountType === "Fixed") {
    discountAmount = qty * discount; // ✅ per unit ₹ discount
  } else {
    discountAmount = 0;
  }

  const taxableAmount = subTotal - discountAmount;
  const taxAmount = (taxableAmount * tax) / 100;
  const lineTotal = taxableAmount + taxAmount;
  const unitCost = qty > 0 ? lineTotal / qty : 0;

  return {
    qty,
    availableQty,
    remainingQty,
    price,
    discount,
    tax,
    subTotal,
    discountAmount,
    taxablevalue: taxableAmount,
    taxableAmount,
    taxAmount,
    lineTotal,
    unitCost,
  };
};



const calculateBillSummary = (products = [], shippingCost = 0, labourCost = 0) => {
  let subTotal = 0;
  let discountSum = 0;
  let taxableSum = 0;
  let taxSum = 0;

  (products || []).forEach((p) => {
    const d = getProductRowCalculation(p);
    subTotal += d.subTotal || 0;
    discountSum += d.discountAmount || 0;
    taxableSum += d.taxableAmount || 0;
    taxSum += d.taxAmount || 0;
  });

  const cgst = taxSum / 2;
  const sgst = taxSum / 2;
  const grandTotal =
    (taxableSum || 0) + (taxSum || 0) + (Number(shippingCost) || 0) + (Number(labourCost) || 0);

  return {
    subTotal,
    discountSum,
    taxableSum,
    cgst,
    sgst,
    taxSum,
    shippingCost: Number(shippingCost) || 0,
    labourCost: Number(labourCost) || 0,
    grandTotal,
  };
};


// 🟢 Inside useEffect
React.useEffect(() => {
  const res = calculateBillSummary(selectedProducts, shippingCost, labourCost);
  setSummary(res);
}, [selectedProducts, shippingCost, labourCost]);

// const summary = calculateBillSummary(selectedProducts); // yaha selectedProducts aapka product list hai


// validation and seniotiozation

  // Error state for validation
  const [formErrors, setFormErrors] = useState({});

  // Sanitization helper
  const sanitizeInput = (value) => {
    if (typeof value === 'string') {
      return value.replace(/[<>]/g, ''); // Remove angle brackets (basic XSS protection)
    }
    return value;
  };

  


const validateForm = () => {
  const errors = {};

  // Basic required fields
  if (!selectedCustomer) errors.selectedCustomer = 'Customer is required.';
  if (!saleDate) errors.saleDate = 'Sale date is required.';
  if (!status) errors.status = 'Status is required.';
  if (!selectedProducts || selectedProducts.length === 0) errors.selectedProducts = 'At least one product is required.';

  // Product-level validations
  selectedProducts.forEach((p, idx) => {
    if (!p.productName) errors[`productName_${idx}`] = 'Product name required.';
    if (!p.quantity || Number(p.quantity) <= 0) errors[`quantity_${idx}`] = 'Quantity must be greater than 0.';
  });

  // Payment type & status are required
  if (!paymentType) {
    errors.paymentType = 'Payment type is required.';
  }

  // When payment type is Full or Partial, require status and method
  if (paymentType === 'Full' || paymentType === 'Partial') {
    if (!paymentStatus) errors.paymentStatus = 'Payment status is required.';
    if (!paymentMethod) errors.paymentMethod = 'Payment method is required.';
  }

  // Partial payment specific checks
  if (paymentType === 'Partial') {
    if (Number(paidAmount) < 0) errors.paidAmount = 'Paid amount cannot be negative.';
    if (Number(paidAmount) > Number(grandTotals || 0)) errors.paidAmount = 'Paid amount cannot exceed total.';
    if (!dueDate) errors.dueDate = 'Due date required for partial payment.';
  }

  // Extra: require online method details when paymentMethod is Online
  if (paymentMethod === 'Online') {
    if (!onlineMod) errors.onlineMod = 'Select an online payment method.';
    if (!transactionId) errors.transactionId = 'Transaction ID is required for online payments.';
  }

  // Extra: require cheque number when paymentMethod is Cheque
  if (paymentMethod === 'Cheque') {
    if (!transactionId) errors.transactionId = 'Cheque / transaction number is required for cheque payments.';
  }

  // Optional strict rule: enforce Full => Paid
  // if (paymentType === 'Full' && paymentStatus !== 'Paid') {
  //   errors.paymentStatus = 'For Full payment, status must be Paid.';
  // }

  return errors;
};

  const statusOptions =
    paymentType === "Full"
      ? ["Paid", "Pending"]        // sirf Paid aur Pending
      : ["Unpaid","Pending"]; // Full ke alawa (Partial case)

  return (
    <div className="modal fade" id="add-sales-new">
      <div className="modal-dialog add-centered">
        <div className="modal-content">
           {/* {loading && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999
            }}>
              <div className="spinner-border text-primary" style={{ width: 60, height: 60 }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )} */}
          <div className="modal-header">
            <div className="page-title">
              <h4> Add Sales</h4>
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
                                  {billingOptions.length > 1 && (
                                    <Select className="mt-2" options={billingOptions} value={selectedBilling}
                                      onChange={setSelectedBilling} placeholder="Select Billing Address" />
                                  )}
                                  {shippingOptions.length > 1 && (
                                    <Select className="mt-2" options={shippingOptions} value={selectedShipping}
                                      onChange={setSelectedShipping} placeholder="Select Shipping Address" />
                                  )}

                                </div>
                                <div className="col-lg-1 col-sm-2 col-2 ps-0">
                                  <div className="add-icon">
                                    <a className="bg-dark text-white p-2 rounded"
                                      onClick={() => { setSelectedCustomer(null); setShowAddModal(true); }}>    <TbCirclePlus data-feather="plus-circle" className="feather-plus-circles " /></a>
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
                            <div className="mb-3">
                              <label className="form-label">Status<span className="text-danger ms-1">*</span></label>

                              <select
                                className="form-select"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Complete">Complete</option>
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
                              <label className="form-label"> Billing Address</label>
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
                                  <p className="mb-0">GSTIN : {customerObj?.gstin}</p>
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
                                <label className="form-label">Shipping Address</label>
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
                                  <p className="mb-0">GSTIN : {customerObj?.gstin}</p>
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
                
                  {/* start row */}
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
                                    {product.hsnCode ? ` • HSN: ${product.hsnCode}` : ""}
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
                          <th>Hsn Code</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Discount</th>    
                          <th>Discount Amount</th>
                          <th>Tax %</th>
                          <th>Tax Amount</th>                    
                          <th />
                        </tr>
                      </thead>

                      <tbody>
                        {selectedProducts.length > 0 ? (
                          selectedProducts.map((product, index) => {
                            const d = getProductRowCalculation(product);
                            return (
                              <tr key={product._id}>
                                <td>
                                  {product.productName}
                                  <br />
                                  <small className="text-muted" >
                                    Available Stock: {d.remainingQty} {product.unit} 
                                    {/* (Before Sale: {d.availableQty}) */}
                                  </small>
                                </td>
                                <td>{product.hsnCode}</td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                    <input type="number" className="form-control form-control-sm"
                                      style={{ width: "70px", textAlign: "center" }} min="1" max={d.availableQty || 9999}
                                      value={d.qty} onChange={(e) => {
                                        let val = parseInt(e.target.value, 10);
                                        // if (isNaN(val)) val = 1;
                                        if (val < 1) val = 1; if (val > (d.availableQty || 9999)) val = d.availableQty || 9999;
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
                                    value={d.price} onChange={(e) => {
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
                               
                                   <td>₹{d.subTotal}</td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <span className="" >
                                      {d.discount}
                                    </span>
                                    <span className="ms-1">
                                      {product.discountType === "Percentage" ? "%" : "₹"}
                                    </span>
                                  </div>
                                </td>

                             
                                <td>₹{d.discountAmount.toFixed(2)}</td>
                                <td>{d.tax} %   </td>

                                <td>₹{d.taxAmount.toFixed(2)}</td>
                                <td>
                                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(product._id)} type="button">
                                    <TbTrash />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center text-muted">
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
                    <div className="col-md-7">
                      <div className="mb-3">
                        <h6 className="mb-3">Extra Information</h6>
                        <div>
                          <ul className="nav nav-tabs nav-solid-primary mb-3" role="tablist">
                            <li className="nav-item me-2" role="presentation">
                              <a className="nav-link active border fs-12 fw-semibold rounded" data-bs-toggle="tab"
                                data-bs-target="#notes" aria-current="page" Shipping Address><i
                                  className="isax isax-document-text me-1" />Add Notes</a>
                            </li>
                      

                            <li className="nav-item" role="presentation">
                              <a className="nav-link border fs-12 fw-semibold rounded" data-bs-toggle="tab" data-bs-target="#bank"
                                Shipping Address><TbCashBanknote className="isax isax-bank me-1" />Payments Details</a>
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
                                      Shipping
                                    </label>
                                    <input type="text" className="form-control" value={shippingCost} onChange={(e) =>
                                      setShippingCost(parseFloat(e.target.value) || 0)} />
                                  </div>
                                </div>
                              </div>
                            </div>)}


                            <div className="tab-pane fade" id="bank" role="tabpanel">
                              <div className="row mt-3">
                                <div className="col-lg-4">
                                  <label>Payment Type<span className="text-danger ms-1">*</span></label>
                                  <select className="form-select" value={paymentType} onChange={e => {
                                    const val = e.target.value;
                                    setPaymentType(val);
                                    setPaymentMethod("");
                                    if (val === "Full") {
                                      // Per request: for Full payment keep paidAmount = 0 and due = 0, mark Paid
                                      setPaidAmount(0);
                                      setDueAmount(0);
                                      setPaymentStatus("Paid");
                                    } else if (val === "Partial") {
                                      // Allow user to set partial payment details
                                      setPaymentStatus("");
                                      setPaidAmount(0); // optional: start with 0 for partial until user enters
                                      setDueAmount(0);
                                      setDueDate("");
                                    }
                                  }}>
                                    <option value="Full">Full Payment</option>
                                    <option value="Partial">Partial Payment</option>
                                  </select>


                                </div>
                                <div className="col-lg-4">
                                  <label>Payment Status<span className="text-danger ms-1">*</span></label>
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
                                        <input type="number" className="form-control" value={grandTotals} readOnly />
                                      </div>
                                    )}

                                    {paymentType === "Partial" && (
                                      <>
                                        <div className="col-lg-4">
                                          <label>Total Amount</label>
                                          <input type="number" className="form-control" value={grandTotals} readOnly />
                                        </div>

                                        {/* <div className="col-lg-4">
                                          <label>Paid Amount</label>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={paidAmount}
                                            min="0"
                                            max={grandTotals}
                                            onChange={(e) => {
                                              const n = Number(e.target.value) || "";
                                              const clamped = Math.max(0, Math.min(n, grandTotals));
                                              setPaidAmount(clamped);
                                            }}
                                          />
                                        </div> */}
                                        <div className="col-lg-4">
  <label>Paid Amount</label>
  <input
    type="number"
    className="form-control"
    value={paidAmount === 0 ? "0" : paidAmount}
    min="0"
    max={grandTotals}
    onFocus={(e) => {
      // Jab focus kare to agar value 0 hai to clear kar de
      if (e.target.value === "0") {
        setPaidAmount("");
      }
    }}
    onBlur={(e) => {
      // Agar input empty chhod diya gaya ho to wapas 0 set kar de
      if (e.target.value === "") {
        setPaidAmount(0);
      }
    }}
    onChange={(e) => {
      const n = Number(e.target.value) || "";
      const clamped = Math.max(0, Math.min(n, grandTotals));
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
                                      <label>Payment Method<span className="text-danger ms-1">*</span></label>
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
                <button type="submit" className="btn btn-primary add-sale">Submit</button>
              </div>
            </div>

          </form>
        </div>
      </div>
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchCustomers(); }}
        />
      )}
    </div>

  )
}

export default AddSalesModal


