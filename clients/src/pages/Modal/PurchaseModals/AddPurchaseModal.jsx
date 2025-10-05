// final with latest changes
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import BASE_URL from "../../config/config";
import "../../../styles/purchase/purchase.css";
import { CiCirclePlus } from "react-icons/ci";
import "../../../styles/category/category.css";
import { TbCirclePlus, TbTrash } from "react-icons/tb";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddSupplierModals from "../suppliers/AddSupplierModals";


const AddPurchaseModal = ({ onSuccess }) => {
  const navigate = useNavigate();

    const [showAddModal, setShowAddModal] = useState(false);
  
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [orderTax, setOrderTax] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [unitName, setUnitName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
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

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  // console.log("Selected Supplier:", options);
  // console.log("Selected Supplier:", selectedSupplier);
  const token = localStorage.getItem("token");

  // Helper function to get today's date in DD/MM/YYYY format
  const getTodaysDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setPurchaseDate(getTodaysDate());
  }, []);

  useEffect(() => {
    const fetchActiveSuppliers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/suppliers/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const suppliers = res.data.suppliers;

        const formattedOptions = suppliers.map((supplier) => ({
          value: supplier._id,
          label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
        }));

        setOptions(formattedOptions);
      } catch (err) {
        console.error("Error fetching active suppliers:", err);
      }
    };

    fetchActiveSuppliers();
  }, []);

  const handleSupplierChange = (selectedOption) => {
    setSelectedSupplier(selectedOption);
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

  // Add modal event listeners to clear form when modal is closed
  useEffect(() => {
    const modalElement = document.getElementById('add-purchase');
    
    const handleModalHidden = () => {
      // Always reset form when modal is hidden to ensure clean state
      resetForm();
    };

    const handleCloseClick = (e) => {
      // Check if the clicked element is a close/cancel button
      if (e.target.getAttribute('data-bs-dismiss') === 'modal' || 
          e.target.closest('[data-bs-dismiss="modal"]')) {
        resetForm();
      }
    };

    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
      modalElement.addEventListener('click', handleCloseClick);
      
      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
        modalElement.removeEventListener('click', handleCloseClick);
      };
    }
  }, []); // Remove dependencies to prevent infinite re-renders

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
      setSelectedProducts([
        ...selectedProducts,
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
          images: product.images || []
        },
      ]);
    }
    setProducts([]);
    setSearchTerm("");
  };


  // const handleRemoveProduct = async (productId, productName) => {
  //   const confirmed = await DeleteAlert({});
  //   if (!confirmed) return;

  //   const updatedProducts = selectedProducts.filter((p) => p._id !== productId);
  //   setSelectedProducts(updatedProducts);
  //   Swal.fire(
  //     "Deleted!",
  //     `purchases "${productName}" has been deleted.`,
  //     "success"
  //   );
  // };
  // This function removes a product from the selected list with confirmation


  const handleRemoveProduct = async (productId, productName) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove "${productName}" from the purchase?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, remove it!"
    });

    if (!confirmed.isConfirmed) return;

    const updatedProducts = selectedProducts.filter((p) => p._id !== productId);
    setSelectedProducts(updatedProducts);

    Swal.fire(
      "Removed!",
      `Product "${productName}" has been removed.`,
      "success"
    );
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

  const grandTotal = totalItemCost + orderTax + shippingCost - orderDiscount;


  const resetForm = () => {
    setSelectedSupplier(null);
    // Don't reset referenceNumber as it's auto-generated
    setSearchTerm("");
    setSelectedProducts([]);
    setOrderTax(0);
    setOrderDiscount(0);
    setShippingCost(0);
    setUnitName("");
    setPurchaseDate(getTodaysDate()); // Set to today's date instead of clearing
    setStatus("");
    setDescription("");
    setSelectedImages([]);
    setImagePreviews([]);
    setProducts([]); // Clear search results

    // Reset payment fields - use proper default values
    setPaymentType("Full");
    setPaidAmount(0);
    setDueAmount(0);
    setDueDate("");
    setPaymentMethod("");
    setTransactionId("");
    setOnlineMod("");
    setTransactionDate("");
    setPaymentStatus("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSupplier || selectedProducts.length === 0 || !status) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    // formData.append("supplier", selectedUser.value);
    formData.append("supplier", selectedSupplier.value);
    formData.append("referenceNumber", referenceNumber);
    formData.append("purchaseDate", purchaseDate);
    formData.append("orderTax", orderTax);
    formData.append("orderDiscount", orderDiscount);
    formData.append("shippingCost", shippingCost);
    formData.append("grandTotal", grandTotal);
    formData.append("status", status);
    formData.append("description", description);
    // Payment Info
    formData.append("paymentType", paymentType);          // Full or Partial
    formData.append("paymentStatus", paymentStatus);      // Paid / Unpaid / etc.
    formData.append("paidAmount", paidAmount);
    formData.append("dueAmount", dueAmount);
    formData.append("dueDate", dueDate);
    formData.append("paymentMethod", paymentMethod);      // Cash, Online, Cheque
    formData.append("transactionId", transactionId);
    formData.append("transactionDate", transactionDate);
    formData.append("onlineMethod", onlineMod);           // Optional - only if Online
    updatedProducts.forEach((p, index) => {
      formData.append(`products[${index}][productId]`, p._id);
      formData.append(`products[${index}][quantity]`, p.quantity);
      formData.append(`products[${index}][purchasePrice]`, p.purchasePrice);
      formData.append(`products[${index}][discount]`, p.discount);
      formData.append(`products[${index}][tax]`, p.tax);
      formData.append(`products[${index}][taxAmount]`, p.taxAmount); // actual tax amount
      formData.append(`products[${index}][unitCost]`, p.unitCost);
      formData.append(`products[${index}][totalCost]`, p.totalCost);
      formData.append(`products[${index}][unit]`, p.unit); // ✅ Send unit to backend

    });
    // Append multiple images
    selectedImages.forEach((file) => {
      formData.append("images", file); // must match your backend field name
    });

    try {
      const res = await axios.post(`${BASE_URL}/api/purchases/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Purchase created:", res.data);
      toast.success('Purchase created successfull!');
      resetForm();
      setLoading(false);
      if (onSuccess) onSuccess();
      // navigate("/purchase-list");
      setTimeout(() => {
        if (window.$) {
          window.$('#add-purchase').modal('hide');
          // Remove leftover backdrop and modal-open class
          setTimeout(() => {
            document.body.classList.remove('modal-open');
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(b => b.remove());
          }, 200);
        } else {
          const modal = document.getElementById('add-purchase');
          if (modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            modal.style.display = 'none';
          }
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
        }
      }, 300);

      Swal.fire("Success", "Purchase created successfully", "success");

    } catch (error) {
      console.error("Failed to create purchase:", error);
    }
  };



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Preview images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };


  useEffect(() => {
    const fetchReferenceNumber = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/purchases/reference/next`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReferenceNumber(res.data.referenceNumber);
      } catch (err) {
        console.error("Failed to fetch reference number:", err);
        setReferenceNumber("PUR-001"); // fallback
      }
    };

    fetchReferenceNumber();
  }, []);


  const updatedProducts = selectedProducts.map((product) => {
    const qty = product.quantity;
    const price = product.purchasePrice || 0;
    let discount = product.discount || 0;
    let discountAmount = 0;
    if (product.discountType === 'Percentage') {
      discountAmount = ((qty * price) * discount) / 100;
    } else {
      discountAmount = discount;
    }
    const tax = product.tax || 0;
    const subTotal = qty * price;
    const afterDiscount = subTotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const lineTotal = afterDiscount + taxAmount;

    const lineProportion = totalItemCost > 0 ? lineTotal / totalItemCost : 0;
    const extraOrderTax = orderTax * lineProportion;
    const extraShipping = shippingCost * lineProportion;
    const discountShare = orderDiscount * lineProportion;

    const finalTotal = lineTotal + extraOrderTax + extraShipping - discountShare;
    const unitCost = finalTotal / qty;

    return {
      ...product,
      discountAmount,
      taxAmount,
      unitCost,
      totalCost: finalTotal,
    };
  });

  useEffect(() => {
    if (paymentType === "Partial") {
      const due = grandTotal - paidAmount;
      setDueAmount(due > 0 ? due : 0);
    } else {
      setPaidAmount(grandTotal);
      setDueAmount(0);
    }
  }, [paymentType, paidAmount, grandTotal]);


  const fileInputRef = useRef();

  // ✅ Trigger hidden file input when clicking the icon
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="modal fade" id="add-purchase">
      <div className="modal-dialog purchase modal-dialog-centered">
        <div className="modal-content">
          {loading && (
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
          )}
          <div className="modal-header">
            <div className="page-title">
              <h4>Add Purchase</h4>
            </div>
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="mb-3 add-product">
                    <label className="form-label">
                      Supplier Name<span className="text-danger ms-1">*</span>
                    </label>
                    <div className="row">
                      <div className="col-lg-10 col-sm-10 col-10">
                        {/* <Select options={options} value={selectedUser} onChange={handleActiveUserChange} isSearchable
                          placeholder="Search and select a user..." /> */}
                        <Select
                          options={options}
                          value={selectedSupplier}
                          onChange={handleSupplierChange}
                          placeholder="Choose a supplier..."
                          isClearable
                        />
                      </div>
                      <div className="col-lg-2 col-sm-2 col-2 ps-0">
                        <div className="add-icon tab">
                          <a onClick={() => { setShowAddModal(true); }} >
                            <TbCirclePlus data-feather="plus-circle" className="feather-plus-circles" />
                          </a>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Date<span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-groupicon calender-input">
                      <i data-feather="calendar" className="info-img" />
                      <input type="text" className="datetimepicker form-control p-2" placeholder="dd/mm/yyyy"
                        value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Reference<span className="text-danger ms-1">*</span>
                    </label>
                    <input type="text" className="form-control" value={referenceNumber} readOnly />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Product<span className="text-danger ms-1">*</span>
                    </label>
                    <input type="text" className="form-control" placeholder="Search Product" value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} />
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
                            handleSelectProduct(product)}
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
                                {product.subcategory?.subCategoryName || "No Sub"} • ₹{product.price}• Available Qty -{" "}
                                {product.quantity || 0}/ {product.unit}
                                {/* • {product.productCode || "N/A"} */}
                              </p>
                            </div>
                          </div>

                          <i className="bi bi-pencil text-primary" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-lg-12">
                  <div className="modal-body-table mt-3">
                    <div className="table-responsive">
                      <table className="table datatable rounded-1">
                        <thead>
                          <tr>
                            <th className="bg-secondary-transparent p-3">
                              Product Name
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Qty
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Purchase Price
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Discount
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Discount Amount
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Tax(%)
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Tax Amount
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Unit Cost
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Total Cost
                            </th>
                            <th className="bg-secondary-transparent p-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.length > 0 ? (
                            selectedProducts.map((product, index) => {
                              const qty = product.quantity;
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

                              // Proportion of this product's cost to the full product total
                              const lineProportion = totalItemCost > 0 ? lineTotal / totalItemCost : 0;

                              // Distribute global values proportionally
                              const extraOrderTax = orderTax * lineProportion;
                              const extraShipping = shippingCost * lineProportion;
                              const discountShare = orderDiscount * lineProportion;

                              const finalTotal = lineTotal + extraOrderTax + extraShipping - discountShare;
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
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        style={{ width: "70px", textAlign: "center" }}
                                        minL="1"
                                        value={product.quantity || 1}
                                        onChange={(e) => {
                                          let val = parseInt(e.target.value, 10);
                                          if (isNaN(val)) val = 1;
                                          if (val < 1) val = 1;

                                          setSelectedProducts((prev) =>
                                            prev.map((item, i) =>
                                              i === index ? { ...item, quantity: val } : item
                                            )
                                          );
                                        }}
                                      />
                                      {/* <input type="number" className="form-control form-control-sm"
                                        style={{ width: "70px", textAlign: "center" }} min="1"
                                         max={product.availableQty}
                                        value={product.quantity || 1} onChange={(e) => {
                                          let val = parseInt(e.target.value, 10);
                                          if (isNaN(val)) val = 1;
                                          if (val < 1) val = 1; if (val > product.availableQty) val = product.availableQty;

                                          setSelectedProducts((prev) =>
                                            prev.map((item, i) =>
                                              i === index ? { ...item, quantity: val } : item
                                            )
                                          );
                                        }}
                                      /> */}
                                      <span className="text-muted">{product.unit}</span>
                                    </div>
                                  </td>

                                  <td>
                                    <input type="number" className="form-control form-control-sm" style={{ width: "90px" }}
                                      min="1" value={price} onChange={(e) => {
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
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <input type="number" className="form-control form-control-sm" style={{ width: "80px" }}
                                        value={product.discount}
                                        min="0"
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
                                      <span className="ms-1">{product.discountType === 'Percentage' ? '%' : '₹'}</span>
                                    </div>

                                  </td>
                                  <td>
                                    ₹{discountAmount.toFixed(2)}

                                  </td>
                                  <td>
                                    <input type="number" className="form-control form-control-sm" style={{ width: "60px" }}
                                      min="0"
                                      value={tax} onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setSelectedProducts((prev) =>
                                          prev.map((item, i) =>
                                            i === index
                                              ? { ...item, tax: isNaN(val) ? 0 : val }
                                              : item
                                          )
                                        );
                                      }}
                                    />
                                  </td>

                                  <td>₹{taxAmount.toFixed(2)}</td>
                                  <td>₹{unitCost.toFixed(2)}</td>
                                  <td className="fw-semibold text-success">
                                    ₹{finalTotal.toFixed(2)}
                                  </td>

                                  {/* DELETE BUTTON */}
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      // onClick={() =>
                                      //   setSelectedProducts((prev) =>
                                      //     prev.filter((_, i) => i !== index)
                                      //   )
                                      // }
                                      onClick={() => handleRemoveProduct(product._id, product.productName)}
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
                </div>



                <div class="row">
                  <div class="col-lg-12 float-md-right">
                    <div class="total-order m-2 mb-3 ms-auto">
                      <ul class="border-1 rounded-1">
                        <li class="border-0 border-bottom">
                          <h4 class="border-0">Order Tax</h4>
                          <h5>₹ {orderTax.toFixed(2)}</h5>
                        </li>
                        <li class="border-0 border-bottom">
                          <h4 class="border-0">Discount</h4>
                          <h5>₹ {orderDiscount.toFixed(2)}</h5>
                        </li>
                        <li class="border-0 border-bottom">
                          <h4 class="border-0">Shipping</h4>
                          <h5>₹ {shippingCost.toFixed(2)}</h5>
                        </li>
                        <li class="total border-0">
                          <h4 class="border-0">Grand Total</h4>
                          <h5 className="fw-semibold text-success">₹ {grandTotal.toFixed(2)}</h5>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

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

                  {/* <div className="profile-pic-upload mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                      {imagePreviews.length > 0 ? (
                        imagePreviews.map((preview, index) => (
                          <img key={index} src={preview} alt={`Preview ${index}`} height="60" width="120pz" />
                        ))
                      ) : (
                        <div className="profile-pic brand-pic">
                          <span>
                            <CiCirclePlus className="plus-down-add" /> Add Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="image-upload mb-0">
                        <input
                                            type="file"
                                            id="ImageInput"
                                            accept="image/png, image/jpeg"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                          />

                       

                      </div>
                    </div>

                  </div> */}
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
                      {/* ✅ Hidden file input */}
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

              {/* payment */}
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
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Partial</option>
                    <option>Pending</option>
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
              {/* payment */}
              <div className="col-lg-12 mt-3">
                <div className="mb-3 summer-description-box">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={400} />
                  <p className="mt-1">Maximum 60 Words</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div >
  {showAddModal &&  (
          <AddSupplierModals
            onClose={() => setShowAddModal(false)}
            onSuccess={() => { setShowAddModal(false); fetchSuppliers(); }}
          />
        )}
    </div >
  );
};

export default AddPurchaseModal;






// // semi final
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import BASE_URL from "../../config/config";
// import "../../../styles/purchase/purchase.css";
// import { CiCirclePlus } from "react-icons/ci";
// import "../../../styles/category/category.css";
// import { TbTrash } from "react-icons/tb";
// import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";


// const AddPurchaseModal = () => {
//   const navigate = useNavigate();
//   const [options, setOptions] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   const [orderTax, setOrderTax] = useState(0);
//   const [orderDiscount, setOrderDiscount] = useState(0);
//   const [shippingCost, setShippingCost] = useState(0);
//   const [unitName, setUnitName] = useState("");
//   const [purchaseDate, setPurchaseDate] = useState("");
//   const [status, setStatus] = useState("");
//   const [description, setDescription] = useState("");
//   const [referenceNumber, setReferenceNumber] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // Payment states
//   const [paymentType, setPaymentType] = useState("Full"); // "Full" or "Partial"
//   const [paidAmount, setPaidAmount] = useState(0);
//   const [dueAmount, setDueAmount] = useState(0);
//   const [dueDate, setDueDate] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const [onlineMod, setOnlineMod] = useState("");
//   const [transactionDate, setTransactionDate] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");

//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   // console.log("Selected Supplier:", options);
//   // console.log("Selected Supplier:", selectedSupplier);
// const token = localStorage.getItem("token");
//   useEffect(() => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();
//     const formatted = `${day}/${month}/${year}`;
//     setPurchaseDate(formatted);
//   }, []);

//   useEffect(() => {
//     const fetchActiveSuppliers = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/suppliers/active`,{
//           headers: {
//         Authorization: `Bearer ${token}`,
//       },
//         });
//         const suppliers = res.data.suppliers;

//         const formattedOptions = suppliers.map((supplier) => ({
//           value: supplier._id,
//           label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
//         }));

//         setOptions(formattedOptions);
//       } catch (err) {
//         console.error("Error fetching active suppliers:", err);
//       }
//     };

//     fetchActiveSuppliers();
//   }, []);

//   const handleSupplierChange = (selectedOption) => {
//     setSelectedSupplier(selectedOption);
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim()) {
//         axios
//           .get(`${BASE_URL}/api/products/search?name=${searchTerm}`,{
//             headers: {
//         Authorization: `Bearer ${token}`,
//       },
//           })
//           .then((res) => setProducts(res.data))
//           .catch((err) => console.error("Search error:", err));
//       } else {
//         setProducts([]);
//       }
//     }, 400);
//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   const handleSelectProduct = (product) => {
//     const alreadyExists = selectedProducts.some((p) => p._id === product._id);
//     if (!alreadyExists) {
//       const taxMatch = product.tax?.match(/\((\d+)%\)/);
//       const taxPercent = taxMatch ? parseFloat(taxMatch[1]) : 0;

//       setSelectedProducts([
//         ...selectedProducts,
//         {
//           ...product,
//           productName: product.productName || product.name || "",   // yaha safe karo

//           quantity: 1, // start with 1
//           availableQty: product.quantity || 0,
//           discount: product.discountValue || 0,
//           tax: taxPercent,
//           unitName: product.unit || "", // ✅ ensure this is pres
//           purchasePrice: product.purchasePrice || product.price || 0,
//           // availableQty: product.quantity || 0,
//           images: product.images || []
//         },
//       ]);
//     }

//     setProducts([]);
//     setSearchTerm("");
//   };


//   // const handleRemoveProduct = async (productId, productName) => {
//   //   const confirmed = await DeleteAlert({});
//   //   if (!confirmed) return;

//   //   const updatedProducts = selectedProducts.filter((p) => p._id !== productId);
//   //   setSelectedProducts(updatedProducts);
//   //   Swal.fire(
//   //     "Deleted!",
//   //     `purchases "${productName}" has been deleted.`,
//   //     "success"
//   //   );
//   // };
//   // This function removes a product from the selected list with confirmation


//   const handleRemoveProduct = async (productId, productName) => {
//     const confirmed = await Swal.fire({
//       title: "Are you sure?",
//       text: `Do you want to remove "${productName}" from the purchase?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Yes, remove it!"
//     });

//     if (!confirmed.isConfirmed) return;

//     const updatedProducts = selectedProducts.filter((p) => p._id !== productId);
//     setSelectedProducts(updatedProducts);

//     Swal.fire(
//       "Removed!",
//       `Product "${productName}" has been removed.`,
//       "success"
//     );
//   };

//   const totalItemCost = selectedProducts.reduce((acc, product) => {
//     const price = product.purchasePrice || 0;
//     const discount = product.discount || 0;
//     const tax = product.tax || 0;
//     const qty = product.quantity || 1;
//     const subTotal = qty * price;
//     const afterDiscount = subTotal - discount;
//     const taxAmount = (afterDiscount * tax) / 100;
//     const total = afterDiscount + taxAmount;
//     return acc + total;
//   }, 0);

//   const grandTotal = totalItemCost + orderTax + shippingCost - orderDiscount;


//   const resetForm = () => {
//     setSelectedSupplier(null);
//     setReferenceNumber("");
//     setSearchTerm("");
//     setSelectedProducts([]);
//     setOrderTax(0);
//     setOrderDiscount(0);
//     setShippingCost(0);
//     setStatus("");
//     setDescription("");
//     setSelectedImages("");
//     setImagePreviews("");

//     setPaymentType(""),
//       setPaidAmount(""),
//       setDueAmount(""),
//       setDueDate(""),
//       setPaymentMethod(""),
//       setTransactionId(""),
//       setOnlineMod(""),
//       setTransactionDate(""),
//       setPaymentStatus("");
//        fetchPurchases();
     
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedSupplier || selectedProducts.length === 0 || !status) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     const formData = new FormData();
//     // formData.append("supplier", selectedUser.value);
//     formData.append("supplier", selectedSupplier.value);
//     formData.append("referenceNumber", referenceNumber);
//     formData.append("purchaseDate", purchaseDate);
//     formData.append("orderTax", orderTax);
//     formData.append("orderDiscount", orderDiscount);
//     formData.append("shippingCost", shippingCost);
//     formData.append("grandTotal", grandTotal);
//     formData.append("status", status);
//     formData.append("description", description);
//     // Payment Info
//     formData.append("paymentType", paymentType);          // Full or Partial
//     formData.append("paymentStatus", paymentStatus);      // Paid / Unpaid / etc.
//     formData.append("paidAmount", paidAmount);
//     formData.append("dueAmount", dueAmount);
//     formData.append("dueDate", dueDate);
//     formData.append("paymentMethod", paymentMethod);      // Cash, Online, Cheque
//     formData.append("transactionId", transactionId);
//     formData.append("transactionDate", transactionDate);
//     formData.append("onlineMethod", onlineMod);           // Optional - only if Online
//     updatedProducts.forEach((p, index) => {
//       formData.append(`products[${index}][productId]`, p._id);
//       formData.append(`products[${index}][quantity]`, p.quantity);
//       formData.append(`products[${index}][purchasePrice]`, p.purchasePrice);
//       formData.append(`products[${index}][discount]`, p.discount);
//       formData.append(`products[${index}][tax]`, p.tax);
//       formData.append(`products[${index}][taxAmount]`, p.taxAmount); // actual tax amount
//       formData.append(`products[${index}][unitCost]`, p.unitCost);
//       formData.append(`products[${index}][totalCost]`, p.totalCost);
//       formData.append(`products[${index}][unit]`, p.unit); // ✅ Send unit to backend

//     });


//     // Append multiple images
//     selectedImages.forEach((file) => {
//       formData.append("images", file); // must match your backend field name
//     });

//     try {
//       const res = await axios.post(`${BASE_URL}/api/purchases/create`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//                   Authorization: `Bearer ${token}`,

//         },
//       });
//       console.log("Purchase created:", res.data);
//       resetForm();

//       // window.$(`#add-purchase`).modal("hide");
//  window.$(`#add-purchase`).modal("hide");
//     } catch (error) {
//       console.error("Failed to create purchase:", error);
//     }
//   };



//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedImages(files);

//     // Preview images
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };


//   useEffect(() => {
//     const fetchReferenceNumber = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/purchases/reference/next`,{
//            headers: {
//         Authorization: `Bearer ${token}`,
//       },
//         });
//         setReferenceNumber(res.data.referenceNumber);
//       } catch (err) {
//         console.error("Failed to fetch reference number:", err);
//         setReferenceNumber("PUR-001"); // fallback
//       }
//     };

//     fetchReferenceNumber();
//   }, []);


//   const updatedProducts = selectedProducts.map((product) => {
//     const qty = product.quantity;
//     const price = product.purchasePrice || 0;
//     const discount = product.discount || 0;
//     const tax = product.tax || 0;
//     const subTotal = qty * price;
//     const afterDiscount = subTotal - discount;
//     const taxAmount = (afterDiscount * tax) / 100;
//     const lineTotal = afterDiscount + taxAmount;

//     const lineProportion = totalItemCost > 0 ? lineTotal / totalItemCost : 0;
//     const extraOrderTax = orderTax * lineProportion;
//     const extraShipping = shippingCost * lineProportion;
//     const discountShare = orderDiscount * lineProportion;

//     const finalTotal = lineTotal + extraOrderTax + extraShipping - discountShare;
//     const unitCost = finalTotal / qty;

//     return {
//       ...product,
//       taxAmount,
//       unitCost,
//       totalCost: finalTotal,
//     };
//   });

//   useEffect(() => {
//     if (paymentType === "Partial") {
//       const due = grandTotal - paidAmount;
//       setDueAmount(due > 0 ? due : 0);
//     } else {
//       setPaidAmount(grandTotal);
//       setDueAmount(0);
//     }
//   }, [paymentType, paidAmount, grandTotal]);


//   const handleFileChange = (e) => {
//       const files = Array.from(e.target.files);
//       const validFiles = files.filter(
//         (file) =>
//           ["image/jpeg", "image/png"].includes(file.type) &&
//           file.size <= 2 * 1024 * 1024
//       );
//       if (validFiles.length !== files.length) {
//         toast.error("Only JPG/PNG up to 2MB allowed");
//       }
//       setSelectedImages(validFiles);
//     };



//   return (
//     <div className="modal fade" id="add-purchase">
//       <div className="modal-dialog purchase modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <div className="page-title">
//               <h4>Add Purchase</h4>
//             </div>
//             <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               <div className="row">
//                 <div className="col-lg-4 col-md-6 col-sm-12">
//                   <div className="mb-3 add-product">
//                     <label className="form-label">
//                       Supplier Name<span className="text-danger ms-1">*</span>
//                     </label>
//                     <div className="row">
//                       <div className="col-lg-10 col-sm-10 col-10">
//                         {/* <Select options={options} value={selectedUser} onChange={handleActiveUserChange} isSearchable
//                           placeholder="Search and select a user..." /> */}
//                         <Select
//                           options={options}
//                           value={selectedSupplier}
//                           onChange={handleSupplierChange}
//                           placeholder="Choose a supplier..."
//                           isClearable
//                         />
//                       </div>
//                       <div className="col-lg-2 col-sm-2 col-2 ps-0">
//                         <div className="add-icon tab">
//                           <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_customer">
//                             <i data-feather="plus-circle" className="feather-plus-circles" />
//                           </a>
//                         </div>
//                       </div>

//                     </div>

//                   </div>
//                 </div>
//                 <div className="col-lg-4 col-md-6 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">
//                       Date<span className="text-danger ms-1">*</span>
//                     </label>
//                     <div className="input-groupicon calender-input">
//                       <i data-feather="calendar" className="info-img" />
//                       <input type="text" className="datetimepicker form-control p-2" placeholder="dd/mm/yyyy"
//                         value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-lg-4 col-sm-12">
//                   <div className="mb-3">
//                     <label className="form-label">
//                       Reference<span className="text-danger ms-1">*</span>
//                     </label>
//                     <input type="text" className="form-control" value={referenceNumber} readOnly />
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-lg-12">
//                   <div className="mb-3">
//                     <label className="form-label">
//                       Product<span className="text-danger ms-1">*</span>
//                     </label>
//                     <input type="text" className="form-control" placeholder="Search Product" value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)} />
//                   </div>

//                   {/* Search Result List */}
//                   {products.length > 0 && (
//                     <div className="search-results border rounded p-3 mb-3">
//                       <h6 className="fw-semibold border-bottom pb-2 mb-3">
//                         <i className="bi bi-list me-2" />
//                         All Products
//                         <span className="float-end text-muted small">
//                           {products.length} Result{products.length > 1 ? "s" : ""}
//                         </span>
//                       </h6>

//                       {products.map((product) => (
//                         <div key={product._id} className="d-flex align-items-start justify-content-between py-2 border-bottom"
//                           onClick={() =>
//                             handleSelectProduct(product)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           <div className="d-flex align-items-start gap-3">
//                             {product.images?.[0] && (
//                               <img src={product.images[0].url} alt={product.productName} className="media-image"
//                                 style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
//                             )}
//                             <div>
//                               <h6 className="fw-bold mb-1">{product.productName}</h6>
//                               <p className="text-muted small mb-0">
//                                 {product.category?.categoryName || "No Category"} •{" "}
//                                 {product.subcategory?.subCategoryName || "No Sub"} • ₹{product.price}• Available Qty -{" "}
//                                 {product.quantity || 0}/ {product.unit}
//                                 {/* • {product.productCode || "N/A"} */}
//                               </p>
//                             </div>
//                           </div>

//                           <i className="bi bi-pencil text-primary" />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="col-lg-12">
//                   <div className="modal-body-table mt-3">
//                     <div className="table-responsive">
//                       <table className="table datatable rounded-1">
//                         <thead>
//                           <tr>
//                             <th className="bg-secondary-transparent p-3">
//                               Product Name
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Qty
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Purchase Price
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Discount
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Tax(%)
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Tax Amount
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Unit Cost
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Total Cost
//                             </th>
//                             <th className="bg-secondary-transparent p-3">
//                               Action
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {selectedProducts.length > 0 ? (
//                             selectedProducts.map((product, index) => {
//                               const qty = product.quantity;
//                               const price = product.purchasePrice || 0;
//                               const discount = product.discount || 0;
//                               const tax = product.tax || 0;
//                               const subTotal = qty * price;
//                               const afterDiscount = subTotal - discount;
//                               const taxAmount = (afterDiscount * tax) / 100;
//                               const lineTotal = afterDiscount + taxAmount;

//                               // Proportion of this product's cost to the full product total
//                               const lineProportion = totalItemCost > 0 ? lineTotal / totalItemCost : 0;

//                               // Distribute global values proportionally
//                               const extraOrderTax = orderTax * lineProportion;
//                               const extraShipping = shippingCost * lineProportion;
//                               const discountShare = orderDiscount * lineProportion;

//                               const finalTotal = lineTotal + extraOrderTax + extraShipping - discountShare;
//                               const unitCost = finalTotal / qty;

//                               return (
//                                 <tr key={index}>
//                                   <td>
//                                     {product.productName}
//                                     <br />
//                                     <small className="text-muted">
//                                       Available: {product.availableQty} {product.unit}
//                                     </small>
//                                   </td>

//                                   <td>
//                                     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
//                                      <input
//                                       type="number"
//                                       className="form-control form-control-sm"
//                                       style={{ width: "70px", textAlign: "center" }}
//                                       min="1"
//                                       value={product.quantity || 1}
//                                       onChange={(e) => {
//                                         let val = parseInt(e.target.value, 10);
//                                         if (isNaN(val)) val = 1;
//                                         if (val < 1) val = 1;

//                                         setSelectedProducts((prev) =>
//                                           prev.map((item, i) =>
//                                             i === index ? { ...item, quantity: val } : item
//                                           )
//                                         );
//                                       }}
//                                     />
//                                       {/* <input type="number" className="form-control form-control-sm"
//                                         style={{ width: "70px", textAlign: "center" }} min="1"
//                                          max={product.availableQty}
//                                         value={product.quantity || 1} onChange={(e) => {
//                                           let val = parseInt(e.target.value, 10);
//                                           if (isNaN(val)) val = 1;
//                                           if (val < 1) val = 1; if (val > product.availableQty) val = product.availableQty;

//                                           setSelectedProducts((prev) =>
//                                             prev.map((item, i) =>
//                                               i === index ? { ...item, quantity: val } : item
//                                             )
//                                           );
//                                         }}
//                                       /> */}
//                                       <span className="text-muted">{product.unit}</span>
//                                     </div>
//                                   </td>

//                                   <td>
//                                     <input type="number" className="form-control form-control-sm" style={{ width: "90px" }}
//                                       min="0" value={price} onChange={(e) => {
//                                         const val = parseFloat(e.target.value);
//                                         setSelectedProducts((prev) =>
//                                           prev.map((item, i) =>
//                                             i === index
//                                               ? { ...item, purchasePrice: isNaN(val) ? 0 : val }
//                                               : item
//                                           )
//                                         );
//                                       }}
//                                     />
//                                   </td>

//                                   <td>
//                                     <input type="number" className="form-control form-control-sm" style={{ width: "80px" }}
//                                       value={discount} onChange={(e) => {
//                                         const val = parseFloat(e.target.value);
//                                         setSelectedProducts((prev) =>
//                                           prev.map((item, i) =>
//                                             i === index
//                                               ? {
//                                                 ...item,
//                                                 discount: isNaN(val) ? 0 : val,
//                                               }
//                                               : item
//                                           )
//                                         );
//                                       }}
//                                     />
//                                   </td>
//                                   <td>
//                                     <input type="number" className="form-control form-control-sm" style={{ width: "60px" }}
//                                       value={tax} onChange={(e) => {
//                                         const val = parseFloat(e.target.value);
//                                         setSelectedProducts((prev) =>
//                                           prev.map((item, i) =>
//                                             i === index
//                                               ? { ...item, tax: isNaN(val) ? 0 : val }
//                                               : item
//                                           )
//                                         );
//                                       }}
//                                     />
//                                   </td>

//                                   <td>₹{taxAmount.toFixed(2)}</td>
//                                   <td>₹{unitCost.toFixed(2)}</td>
//                                   <td className="fw-semibold text-success">
//                                     ₹{finalTotal.toFixed(2)}
//                                   </td>

//                                   {/* DELETE BUTTON */}
//                                   <td>
//                                     <button
//                                       className="btn btn-sm btn-danger"
//                                       // onClick={() =>
//                                       //   setSelectedProducts((prev) =>
//                                       //     prev.filter((_, i) => i !== index)
//                                       //   )
//                                       // }
//                                       onClick={() => handleRemoveProduct(product._id, product.productName)}
//                                     >
//                                       <TbTrash />
//                                     </button>
//                                   </td>
//                                 </tr>
//                               );
//                             })
//                           ) : (
//                             <tr>
//                               <td colSpan="8" className="text-center text-muted">
//                                 No products selected.
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>



//                 <div class="row">
//                   <div class="col-lg-12 float-md-right">
//                     <div class="total-order m-2 mb-3 ms-auto">
//                       <ul class="border-1 rounded-1">
//                         <li class="border-0 border-bottom">
//                           <h4 class="border-0">Order Tax</h4>
//                           <h5>₹ {orderTax.toFixed(2)}</h5>
//                         </li>
//                         <li class="border-0 border-bottom">
//                           <h4 class="border-0">Discount</h4>
//                           <h5>₹ {orderDiscount.toFixed(2)}</h5>
//                         </li>
//                         <li class="border-0 border-bottom">
//                           <h4 class="border-0">Shipping</h4>
//                           <h5>₹ {shippingCost.toFixed(2)}</h5>
//                         </li>
//                         <li class="total border-0">
//                           <h4 class="border-0">Grand Total</h4>
//                           <h5 className="fw-semibold text-success">₹ {grandTotal.toFixed(2)}</h5>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-lg-3 col-md-6 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Order Tax
//                       </label>
//                       <input type="text" className="form-control" value={orderTax} onChange={(e) =>
//                         setOrderTax(parseFloat(e.target.value) || 0)} />
//                     </div>
//                   </div>
//                   <div className="col-lg-3 col-md-6 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Discount
//                       </label>
//                       <input type="text" className="form-control" value={orderDiscount} onChange={(e) =>
//                         setOrderDiscount(parseFloat(e.target.value) || 0)} />
//                     </div>
//                   </div>
//                   <div className="col-lg-3 col-md-6 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Shipping
//                       </label>
//                       <input type="text" className="form-control" value={shippingCost} onChange={(e) =>
//                         setShippingCost(parseFloat(e.target.value) || 0)} />
//                     </div>
//                   </div>
//                   <div className="col-lg-3 col-md-6 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Status<span className="text-danger ms-1">*</span>
//                       </label>
//                       <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
//                         <option>Select</option>
//                         <option>Ordered</option>
//                         <option>Received</option>
//                         <option>Pending</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* <div className="profile-pic-upload mb-3">
//                     <div className="d-flex gap-2 flex-wrap">
//                       {imagePreviews.length > 0 ? (
//                         imagePreviews.map((preview, index) => (
//                           <img key={index} src={preview} alt={`Preview ${index}`} height="60" width="120pz" />
//                         ))
//                       ) : (
//                         <div className="profile-pic brand-pic">
//                           <span>
//                             <CiCirclePlus className="plus-down-add" /> Add Image
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <div className="image-upload mb-0">
//                         <input type="file" multiple accept="image/png, image/jpeg" onChange={handleImageChange} />
//                         <div className="image-uploads">
//                           <h4>Upload Images</h4>
//                         </div>
//                       </div>
//                       <p className="mt-2">JPEG, PNG up to 2 MB</p>
//                     </div>
//                   </div> */}

//                      <div className="profile-pic-upload mb-3">
//                                         <div className="profile-pic brand-pic">
//                                           <span>
//                                             {selectedImages.length > 0 ? (
//                                               <img
//                                                 src={URL.createObjectURL(selectedImages[0])}
//                                                 alt="Preview"
//                                                 height="60"
//                                               />
//                                             ) : (
//                                               <>
//                                                 <CiCirclePlus className="plus-down-add" /> Add
//                                                 Image
//                                               </>
//                                             )}{" "}
//                                           </span>
//                                         </div>
//                                         <div className=" mb-0">
//                                           <input
//                                             type="file"
//                                             id="brandImageInput"
//                                             accept="image/png, image/jpeg"
//                                             onChange={handleFileChange}
//                                             style={{ display: "none" }}
//                                           />
//                                           <button
//                                             style={{}}
//                                             type="button"
//                                             onClick={() =>
//                                               document.getElementById("brandImageInput").click()
//                                             }
//                                             className="btn btn-outline-primary"
//                                           >
//                                             Upload Image
//                                           </button>
//                                           <p className="mt-2">JPEG, PNG up to 2 MB</p>
//                                         </div>
//                                       </div>

//                 </div>
//               </div>

//               {/* payment */}
//               <div className="row mt-3">
//                 <div className="col-lg-4">
//                   <label>Payment Type</label>
//                   <select className="form-select" value={paymentType} onChange={e => {
//                     setPaymentType(e.target.value);
//                     setPaymentMethod(""); // reset payment method when payment type changes
//                   }}
//                   >
//                     <option value="Full">Full Payment</option>
//                     <option value="Partial">Partial Payment</option>
//                   </select>
//                 </div>

//                 <div className="col-lg-4"><label>Payment Status</label>
//                   <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
//                     <option>Select</option>
//                     <option>Paid</option>
//                     <option>Unpaid</option>
//                     <option>Partial</option>
//                     <option>Pending</option>
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
//                           <label>Total Amount</label>
//                           <input type="number" className="form-control" value={grandTotal} readOnly />
//                         </div>
//                         <div className="col-lg-4">
//                           <label>Paid Amount</label>
//                           <input type="number" className="form-control" value={paidAmount} max={grandTotal} onChange={e =>
//                             setPaidAmount(parseFloat(e.target.value) || 0)} />
//                         </div>
//                         <div className="col-lg-4">
//                           <label>Due Amount</label>
//                           <input type="number" className="form-control" value={dueAmount.toFixed(2)} readOnly />
//                         </div>
//                         <div className="col-lg-4 mt-2">
//                           <label>Due Date</label>
//                           <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}

//                     <div className="col-lg-12 mt-3">
//                       <label>Payment Method</label>
//                       <div className="d-flex gap-4">
//                         {["Cash", "Online", "Cheque"].map((method) => (
//                           <div className="form-check" key={method}>
//                             <input type="radio" className="form-check-input" id={method} checked={paymentMethod === method}
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
//                           <input type="text" className="form-control" value={onlineMod} onChange={e =>
//                             setOnlineMod(e.target.value)}
//                             placeholder="e.g. UPI, NEFT, RTGS"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction ID</label>
//                           <input type="text" className="form-control" value={transactionId} onChange={e =>
//                             setTransactionId(e.target.value)}
//                             placeholder="Enter Transaction ID"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction Date</label>
//                           <input type="date" className="form-control" value={transactionDate} onChange={e =>
//                             setTransactionDate(e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}
//                     {(paymentMethod === "Cheque") && (
//                       <>
//                         <div className="col-lg-4 mt-2">
//                           <label>Cheque No</label>
//                           <input type="text" className="form-control" value={transactionId} onChange={e =>
//                             setTransactionId(e.target.value)}
//                             placeholder="Enter Cheque No"
//                           />
//                         </div>

//                         <div className="col-lg-4 mt-2">
//                           <label>Transaction Date</label>
//                           <input type="date" className="form-control" value={transactionDate} onChange={e =>
//                             setTransactionDate(e.target.value)}
//                           />
//                         </div>
//                       </>
//                     )}

//                   </>
//                 )}
//               </div>
//               {/* payment */}
//               <div className="col-lg-12 mt-3">
//                 <div className="mb-3 summer-description-box">
//                   <label className="form-label">Description</label>
//                   <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={400} />
//                   <p className="mt-1">Maximum 60 Words</p>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </div >

//     </div >
//   );
// };

// export default AddPurchaseModal;

