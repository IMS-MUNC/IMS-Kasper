
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import { TbCopy } from "react-icons/tb";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

const AddCustomerModal = ({ onClose, onSuccess }) => {
  const fileInputRef = React.useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // State for billing address dropdowns
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // State for shipping address dropdowns
  const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
  const [selectedShippingState, setSelectedShippingState] = useState(null);
  const [selectedShippingCity, setSelectedShippingCity] = useState(null);

  const [gstType, setGstType] = useState(""); // register/unregister
  const [gstStates, setGstStates] = useState([]); // states from API
  const [selectedGstState, setSelectedGstState] = useState(null);
  const [gstLoading, setGstLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isGstinVerified, setIsGstinVerified] = useState(false);


  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currency: "",
    website: "",
    notes: "",
    gstin: "",
    billing: {
      name: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      pincode: "",
    },
    shipping: {
      name: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    bank: {
      bankName: "",
      branch: "",
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
    },
    status: true,
  });

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // Country, State, City options from country-state-city
  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
      (ci) => ({
        value: ci.name,
        label: ci.name,
      })
    )
    : [];

  const shippingStateOptions = selectedShippingCountry
    ? State.getStatesOfCountry(selectedShippingCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }))
    : [];

  const shippingCityOptions = selectedShippingState
    ? City.getCitiesOfState(
      selectedShippingCountry.value,
      selectedShippingState.value
    ).map((ci) => ({
      value: ci.name,
      label: ci.name,
    }))
    : [];

  // Sanitization function to prevent XSS
  const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  // Validation function with updated regex patterns
  const validateField = (name, value) => {
    const regexPatterns = {
      name: /^[a-zA-Z\s.,'-]{1,100}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phone: /^\+?[0-9\s()-]{7,15}$/, // Updated: Allows +,-,(),spaces, 7-15 digits
      website: /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)?$/, // Updated: Optional protocol, flexible
      postalCode: /^\d{6}$/,
      pincode: /^\d{6}$/,
      bankName: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      branch: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      accountHolder: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      accountNumber: /^[a-zA-Z0-9\s-]{8,20}$/, // Updated: Alphanumeric, spaces, dashes
      // ifsc: /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, // Updated: Case-insensitive
      ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/, // Updated: Case-insensitive
      notes: /^[\w\s.,!?-]{0,500}$/,
      gstin: /^[0-9A-Z]{15}$/,
      address1: /^[a-zA-Z0-9\s.,'-]{1,100}$/,
      address2: /^[a-zA-Z0-9\s.,'-]{0,100}$/,
    };

    // Required fields
    if (name === "name" && !value) return "Name is required.";
    if (name === "email" && !value) return "Email is required.";
    if (name === "phone" && !value) return "Phone number is required.";
    if (name === "currency" && !value) return "Currency is required.";

    // Optional fields (allow empty)
    if (!value && ["website", "notes", "postalCode", "pincode", "bankName", "branch", "accountHolder", "accountNumber", "ifsc", "address1", "address2"].includes(name)) {
      return "";
    }

    // Regex validation
    if (name in regexPatterns && value && !regexPatterns[name].test(value)) {
      switch (name) {
        case "email":
          return "Please enter a valid email address.";
        case "phone":
          return "Please enter a valid phone number (e.g., +1234567890 or 123-456-7890).";
        case "website":
          return "Please enter a valid URL (e.g., example.com or https://example.com).";
        case "postalCode":
          return "Please enter a valid postal code.";
        case "pincode":
          return "Please enter a valid pincode.";
        case "bankName":
          return "Please enter a valid bank name.";
        case "branch":
          return "Please enter a valid branch name.";
        case "accountHolder":
          return "Please enter a valid account holder name.";
        case "accountNumber":
          return "Please enter a valid account number (8-20 characters, alphanumeric).";
        case "ifsc":
          return "Please enter a valid IFSC code (e.g., ABCD0123456).";
        case "notes":
          return "Notes can only contain letters, numbers, spaces, and common punctuation (max 500 characters).";
        case "gstin":
          return "Please enter a valid GSTIN (15 alphanumeric characters).";
        case "name":
          return "Please enter a valid name (1-100 characters, letters and common punctuation only).";
        case "address1":
          return "Please enter a valid address (1-100 characters, alphanumeric and common punctuation).";
        case "address2":
          return "Please enter a valid address (0-100 characters, alphanumeric and common punctuation).";
        default:
          return "Invalid input.";
      }
    }
    return "";
  };

  // Input handlers with updated logic to always set input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(name, sanitizedValue);

    setErrors((prev) => ({ ...prev, [name]: error }));
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    // if (error) {
    //   toast.error(error);
    // }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(name, sanitizedValue);

    setErrors((prev) => ({
      ...prev,
      [`billing.${name}`]: error,
    }));
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, [name]: sanitizedValue },
    }));
    // if (error) {
    //   toast.error(error);

    // }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(name, sanitizedValue);

    setErrors((prev) => ({
      ...prev,
      [`shipping.${name}`]: error,
    }));
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [name]: sanitizedValue },
    }));
    // if (error) {
    //   toast.error(error);
    // }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const error = validateField(name, sanitizedValue);

    setErrors((prev) => ({
      ...prev,
      [`bank.${name}`]: error,
    }));
    setForm((prev) => ({
      ...prev,
      bank: { ...prev.bank, [name]: sanitizedValue },
    }));
    if (error) {
      toast.error(error);
    }
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setSelectedState(null);
    setSelectedCity(null);
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, country: option ? option.value : "", state: "", city: "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "billing.country": "",
      "billing.state": "",
      "billing.city": "",
    }));
  };

  const handleStateChange = (option) => {
    setSelectedState(option);
    setSelectedCity(null);
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, state: option ? option.value : "", city: "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "billing.state": "",
      "billing.city": "",
    }));
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, city: option ? option.value : "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "billing.city": "",
    }));
  };

  const handleShippingCountryChange = (option) => {
    setSelectedShippingCountry(option);
    setSelectedShippingState(null);
    setSelectedShippingCity(null);
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, country: option ? option.value : "", state: "", city: "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "shipping.country": "",
      "shipping.state": "",
      "shipping.city": "",
    }));
  };

  const handleShippingStateChange = (option) => {
    setSelectedShippingState(option);
    setSelectedShippingCity(null);
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, state: option ? option.value : "", city: "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "shipping.state": "",
      "shipping.city": "",
    }));
  };

  const handleShippingCityChange = (option) => {
    setSelectedShippingCity(option);
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, city: option ? option.value : "" },
    }));
    setErrors((prev) => ({
      ...prev,
      "shipping.city": "",
    }));
  };

  const handleCopyFromBilling = () => {
    const sanitizedBilling = {
      name: sanitizeInput(form.billing.name),
      address1: sanitizeInput(form.billing.address1),
      address2: sanitizeInput(form.billing.address2),
      country: form.billing.country,
      state: form.billing.state,
      city: form.billing.city,
      pincode: sanitizeInput(form.billing.pincode),
    };
    setSelectedShippingCountry(selectedCountry);
    setSelectedShippingState(selectedState);
    setSelectedShippingCity(selectedCity);
    setForm((prev) => ({
      ...prev,
      shipping: sanitizedBilling,
    }));
    setErrors((prev) => ({
      ...prev,
      "shipping.name": validateField("name", sanitizedBilling.name),
      "shipping.address1": validateField("address1", sanitizedBilling.address1),
      "shipping.address2": validateField("address2", sanitizedBilling.address2),
      "shipping.pincode": validateField("pincode", sanitizedBilling.pincode),
    }));
  };

  const handleStatusChange = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }));
  };

  // File upload handler
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image type and size
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 1 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image.");
        setErrors((prev) => ({ ...prev, image: "Invalid image type" }));
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must not exceed 1MB.");
        setErrors((prev) => ({ ...prev, image: "Image too large" }));
        return;
      }
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    newErrors.name = validateField("name", form.name);
    newErrors.email = validateField("email", form.email);
    newErrors.phone = validateField("phone", form.phone);
    newErrors.currency = validateField("currency", form.currency);
    newErrors.gstType = gstType ? "" : "GST Type is required.";
    if (gstType === "register") {
      newErrors.gstState = selectedGstState ? "" : "GST State is required.";
      newErrors.gstin = validateField("gstin", form.gstin);
    } else {
      newErrors.gstState = "";
      newErrors.gstin = "";
    }
    newErrors.website = validateField("website", form.website);
    newErrors.notes = validateField("notes", form.notes);
    newErrors["billing.name"] = validateField("name", form.billing.name);
    newErrors["billing.address1"] = validateField("address1", form.billing.address1);
    newErrors["billing.address2"] = validateField("address2", form.billing.address2);
    newErrors["billing.postalCode"] = validateField("postalCode", form.billing.postalCode);
    newErrors["shipping.name"] = validateField("name", form.shipping.name);
    newErrors["shipping.address1"] = validateField("address1", form.shipping.address1);
    newErrors["shipping.address2"] = validateField("address2", form.shipping.address2);
    newErrors["shipping.pincode"] = validateField("pincode", form.shipping.pincode);
    newErrors["bank.bankName"] = validateField("bankName", form.bank.bankName);
    newErrors["bank.branch"] = validateField("branch", form.bank.branch);
    newErrors["bank.accountHolder"] = validateField("accountHolder", form.bank.accountHolder);
    newErrors["bank.accountNumber"] = validateField("accountNumber", form.bank.accountNumber);
    newErrors["bank.ifsc"] = validateField("ifsc", form.bank.ifsc);

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        currency: form.currency,
        website: form.website,
        notes: form.notes,
        billing: {
          ...form.billing,
          country: form.billing.country || "",
          state: form.billing.state || "",
          city: form.billing.city || "",
        },
        shipping: {
          ...form.shipping,
          country: form.shipping.country || "",
          state: form.shipping.state || "",
          city: form.shipping.city || "",
        },
        bank: form.bank,
        status: form.status,
        gstType: gstType === "register" ? "Registered" : "Unregister",
        gstState: selectedGstState?.value || "N/A",
        gstin: form.gstin || "",
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (selectedImage) {
        formData.append("images", selectedImage);
      }

      await axios.post(`${BASE_URL}/api/customers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Customer created successfully!");
      setFormSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        currency: "",
        website: "",
        notes: "",
        gstin: "",
        billing: {
          name: "",
          address1: "",
          address2: "",
          country: "",
          state: "",
          city: "",
          postalCode: "",
          pincode: "",
        },
        shipping: {
          name: "",
          address1: "",
          address2: "",
          country: "",
          state: "",
          city: "",
          pincode: "",
        },
        bank: {
          bankName: "",
          branch: "",
          accountHolder: "",
          accountNumber: "",
          ifsc: "",
        },
        status: true,
      });
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedShippingCountry(null);
      setSelectedShippingState(null);
      setSelectedShippingCity(null);
      setGstType("");
      setGstStates([]);
      setSelectedGstState(null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to create customer";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gstType === "register") {
      axios.get(`${BASE_URL}/api/gst`) // your GST API
        .then((res) => {
          // Assuming API returns an array of states like [{name: 'Bihar', gstinCode: '10'}, ...]
          const stateOptions = res.data.map((s) => ({ value: s.gstinCode, label: s.gstinCode }));
          setGstStates(stateOptions);
        })
        .catch((err) => {
          console.error("Failed to fetch GST states", err);
          setGstStates([]);
        });
    } else {
      setGstStates([]);
      setSelectedGstState(null);
    }
  }, [gstType]);

  const handleGstTypeChange = (e) => {
    const value = e.target.value;
    setGstType(value);

    // If unregister, save N/A in state
    if (value === "unregister") {
      setSelectedGstState({ value: "N/A", label: "N/A" });
    } else {
      setSelectedGstState(null);
    }
  };

  const handleVerifyGstin = async () => {
    if (!form.gstin || !selectedGstState) {
      toast.error("Please enter GSTIN and select state");
      return;
    }
    setGstLoading(true);
    try {
      // Check if first 2 digits match selectedGstState.value
      const gstinPrefix = form.gstin.substring(0, 2);
      if (gstinPrefix === selectedGstState.value) {
        setValidationErrors(prev => ({ ...prev, gstin: "" }));
        setIsGstinVerified(true);
        toast.success("GSTIN verified successfully");
      } else {
        setValidationErrors(prev => ({ ...prev, gstin: "GSTIN does not match the selected state" }));
        setIsGstinVerified(false);
        toast.error("GSTIN verification failed");
      }
    } catch (err) {
      setIsGstinVerified(false);
      toast.error("Verification failed");
    } finally {
      setGstLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      id="add-customer"
      tabIndex="-1"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <div className="modal-header">
            <div className="page-title">
              <h4>Add Customer</h4>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Add Customer</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <h6 className="text-gray-9 fw-bold mb-2 d-flex">Basic Details</h6>
                    <div className="d-flex align-items-center">
                      <div
                        className="avatar avatar-xxl border border-dashed bg-light me-3 flex-shrink-0"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                      >
                        {imagePreviewUrl ? (
                          <img
                            src={imagePreviewUrl}
                            alt="Selected"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <i className="isax isax-image text-primary fs-24" />
                        )}
                      </div>
                      <div className="d-inline-flex flex-column align-items-start">
                        <button
                          className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2"
                          onClick={handleUploadClick}
                          type="button"
                        >
                          <i className="isax isax-image me-1" />Upload Image
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {selectedImage && (
                          <span className="text-gray-9">Selected: {selectedImage.name}</span>
                        )}
                        {errors.image && (
                          <span className="text-danger fs-12">{errors.image}</span>
                        )}
                        <span className="text-gray-9">JPG or PNG format, not exceeding 1MB.</span>
                      </div>
                    </div>
                  </div>
                  <div className="row gx-3">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Name <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.name && (
                          <span className="text-danger fs-12">{errors.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Email <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.email && (
                          <span className="text-danger fs-12">{errors.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.phone && (
                          <span className="text-danger fs-12">{errors.phone}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-select"
                          name="currency"
                          value={form.currency}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Dollar">Dollar</option>
                          <option value="Euro">Euro</option>
                          <option value="Yen">Yen</option>
                          <option value="Pound">Pound</option>
                          <option value="Rupee">Rupee</option>
                        </select>
                        {errors.currency && (
                          <span className="text-danger fs-12">{errors.currency}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          value={form.website}
                          onChange={handleInputChange}
                        />
                        {errors.website && (
                          <span className="text-danger fs-12">{errors.website}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <input
                          type="text"
                          className="form-control"
                          name="notes"
                          value={form.notes}
                          onChange={handleInputChange}
                        />
                        {errors.notes && (
                          <span className="text-danger fs-12">{errors.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">GST Type</label>
                        <select
                          className="form-select"
                          value={gstType}
                          onChange={handleGstTypeChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="register">Register</option>
                          <option value="unregister">Unregister</option>
                        </select>
                      </div>
                    </div>

                    {gstType === "register" && (
                      <>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">State</label>
                            <Select
                              options={gstStates}
                              value={selectedGstState}
                              onChange={(option) => setSelectedGstState(option)}
                              placeholder="Select State"
                            />
                            {errors.gstState && (
                              <span className="text-danger fs-12">{errors.gstState}</span>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 mt-4">
                          <div className="mb-3">
                            <div className="d-flex gap-2">
                              <span className="form-label">GSTIN</span>
                              <br />
                              <input
                                type="text"
                                placeholder="Enter GSTIN"
                                className="form-control"
                                name="gstin"
                                value={form.gstin}
                                onChange={handleInputChange}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handleVerifyGstin}
                                disabled={!form.gstin || gstLoading || !selectedGstState}
                              >
                                {gstLoading ? 'Verifying...' : 'Verify'}
                              </button>
                            </div>
                            {(errors.gstin || validationErrors.gstin) && (
                              <span className="text-danger fs-12">{errors.gstin || validationErrors.gstin}</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                  <div className="border-top my-2">
                    <div className="row gx-5">
                      <div className="col-md-6">
                        <h6 className="mb-3 pt-4">Billing Address</h6>
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.billing.name}
                                onChange={handleBillingChange}
                              />
                              {errors["billing.name"] && (
                                <span className="text-danger fs-12">{errors["billing.name"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 1</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address1"
                                value={form.billing.address1}
                                onChange={handleBillingChange}
                              />
                              {errors["billing.address1"] && (
                                <span className="text-danger fs-12">{errors["billing.address1"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 2</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address2"
                                value={form.billing.address2}
                                onChange={handleBillingChange}
                              />
                              {errors["billing.address2"] && (
                                <span className="text-danger fs-12">{errors["billing.address2"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="form-label">Country</label>
                                <Select
                                  options={countryOptions}
                                  value={selectedCountry}
                                  onChange={handleCountryChange}
                                  placeholder="Select Country"
                                />
                                {errors["billing.country"] && (
                                  <span className="text-danger fs-12">{errors["billing.country"]}</span>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">State</label>
                                <Select
                                  options={stateOptions}
                                  value={selectedState}
                                  onChange={handleStateChange}
                                  placeholder="Select State"
                                  isDisabled={!selectedCountry}
                                />
                                {errors["billing.state"] && (
                                  <span className="text-danger fs-12">{errors["billing.state"]}</span>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">City</label>
                                <Select
                                  options={cityOptions}
                                  value={selectedCity}
                                  onChange={handleCityChange}
                                  placeholder="Select City"
                                  isDisabled={!selectedState}
                                />
                                {errors["billing.city"] && (
                                  <span className="text-danger fs-12">{errors["billing.city"]}</span>
                                )}
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">Postal Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="postalCode"
                                  value={form.billing.postalCode}
                                  maxLength={6}
                                  onChange={handleBillingChange}
                                />
                                {errors["billing.postalCode"] && (
                                  <span className="text-danger fs-12">{errors["billing.postalCode"]}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-between mb-3 pt-4">
                          <h6>Shipping Address</h6>
                          <button
                            type="button"
                            onClick={handleCopyFromBilling}
                            className="d-inline-flex align-items-center text-primary text-decoration-underline fs-13 btn btn-link p-0"
                            style={{ boxShadow: "none" }}
                          >
                            <TbCopy className="me-1" />Copy From Billing
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.shipping.name}
                                onChange={handleShippingChange}
                              />
                              {errors["shipping.name"] && (
                                <span className="text-danger fs-12">{errors["shipping.name"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 1</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address1"
                                value={form.shipping.address1}
                                onChange={handleShippingChange}
                              />
                              {errors["shipping.address1"] && (
                                <span className="text-danger fs-12">{errors["shipping.address1"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 2</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address2"
                                value={form.shipping.address2}
                                onChange={handleShippingChange}
                              />
                              {errors["shipping.address2"] && (
                                <span className="text-danger fs-12">{errors["shipping.address2"]}</span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Country</label>
                            <Select
                              options={countryOptions}
                              value={selectedShippingCountry}
                              onChange={handleShippingCountryChange}
                              placeholder="Select Country"
                            />
                            {errors["shipping.country"] && (
                              <span className="text-danger fs-12">{errors["shipping.country"]}</span>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">State</label>
                            <Select
                              options={shippingStateOptions}
                              value={selectedShippingState}
                              onChange={handleShippingStateChange}
                              placeholder="Select State"
                              isDisabled={!selectedShippingCountry}
                            />
                            {errors["shipping.state"] && (
                              <span className="text-danger fs-12">{errors["shipping.state"]}</span>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">City</label>
                            <Select
                              options={shippingCityOptions}
                              value={selectedShippingCity}
                              onChange={handleShippingCityChange}
                              placeholder="Select City"
                              isDisabled={!selectedShippingState}
                            />
                            {errors["shipping.city"] && (
                              <span className="text-danger fs-12">{errors["shipping.city"]}</span>
                            )}
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Postal code</label>
                              <input
                                type="text"
                                className="form-control"
                                name="pincode"
                                value={form.shipping.pincode}
                                maxLength={6}
                                onChange={handleShippingChange}
                              />
                              {errors["shipping.pincode"] && (
                                <span className="text-danger fs-12">{errors["shipping.pincode"]}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-top my-2">
                    <h6 className="mb-3 pt-4">Banking Details</h6>
                    <div className="row gx-3">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bankName"
                            value={form.bank.bankName}
                            onChange={handleBankChange}
                          />
                          {errors["bank.bankName"] && (
                            <span className="text-danger fs-12">{errors["bank.bankName"]}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Branch</label>
                          <input
                            type="text"
                            className="form-control"
                            name="branch"
                            value={form.bank.branch}
                            onChange={handleBankChange}
                          />
                          {errors["bank.branch"] && (
                            <span className="text-danger fs-12">{errors["bank.branch"]}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Holder</label>
                          <input
                            type="text"
                            className="form-control"
                            name="accountHolder"
                            value={form.bank.accountHolder}
                            onChange={handleBankChange}
                          />
                          {errors["bank.accountHolder"] && (
                            <span className="text-danger fs-12">{errors["bank.accountHolder"]}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="accountNumber"
                            value={form.bank.accountNumber}
                            onChange={handleBankChange}
                          />
                          {errors["bank.accountNumber"] && (
                            <span className="text-danger fs-12">{errors["bank.accountNumber"]}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">IFSC</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ifsc"
                            value={form.bank.ifsc}
                            onChange={handleBankChange}
                          />
                          {errors["bank.ifsc"] && (
                            <span className="text-danger fs-12">{errors["bank.ifsc"]}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6" style={{ display: 'flex', gap: '5px', marginTop: '35px' }}>


                        <label className="">Status</label>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={form.status}
                            onChange={handleStatusChange}
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-white"
                      data-bs-dismiss="modal"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Create New"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default AddCustomerModal;