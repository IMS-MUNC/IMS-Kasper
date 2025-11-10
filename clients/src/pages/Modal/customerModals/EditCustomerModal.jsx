import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import { TbCopy } from "react-icons/tb";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

const EditCustomerModal = ({ customer, onClose, onSuccess }) => {
  const fileInputRef = useRef(null);
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

  const [gstType, setGstType] = useState("");
  const [gstStates, setGstStates] = useState([]);
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

  // Prefill form when customer prop changes
  useEffect(() => {
    if (!customer) return; // Guard clause for undefined customer

    // Initialize nested objects if they are undefined
    const prefilledForm = {
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      currency: customer.currency || "",
      website: customer.website || "",
      notes: customer.notes || "",
      gstin: customer.gstin || "",
      billing: {
        name: customer.billing?.name || "",
        address1: customer.billing?.address1 || "",
        address2: customer.billing?.address2 || "",
        country: customer.billing?.country || "",
        state: customer.billing?.state || "",
        city: customer.billing?.city || "",
        postalCode: customer.billing?.postalCode || "",
        pincode: customer.billing?.pincode || "",
      },
      shipping: {
        name: customer.shipping?.name || "",
        address1: customer.shipping?.address1 || "",
        address2: customer.shipping?.address2 || "",
        country: customer.shipping?.country || "",
        state: customer.shipping?.state || "",
        city: customer.shipping?.city || "",
        pincode: customer.shipping?.pincode || "",
      },
      bank: {
        bankName: customer.bank?.bankName || "",
        branch: customer.bank?.branch || "",
        accountHolder: customer.bank?.accountHolder || "",
        accountNumber: customer.bank?.accountNumber || "",
        ifsc: customer.bank?.ifsc || "",
      },
      status: typeof customer.status === "boolean" ? customer.status : true,
    };
    setForm(prefilledForm);

    setGstType(customer.gstType === "Registered" ? "register" : customer.gstType === "Unregister" ? "unregister" : "");
    if (customer.gstState && customer.gstState !== "N/A") {
      setSelectedGstState({ value: customer.gstState, label: customer.gstState });
    } else {
      setSelectedGstState({ value: "N/A", label: "N/A" });
    }
    setIsGstinVerified(!!customer.gstin);

    // Initialize image preview
    setImagePreviewUrl(customer.image || null);

    // Set dropdown values for billing
    if (customer.billing?.country) {
      const country = Country.getAllCountries().find((c) => c.isoCode === customer.billing.country);
      if (country) {
        setSelectedCountry({ value: country.isoCode, label: country.name });
      }
    }
    if (customer.billing?.state && customer.billing?.country) {
      const state = State.getStatesOfCountry(customer.billing.country).find(
        (s) => s.isoCode === customer.billing.state
      );
      if (state) {
        setSelectedState({ value: state.isoCode, label: state.name });
      }
    }
    if (customer.billing?.city && customer.billing?.state && customer.billing?.country) {
      const city = City.getCitiesOfState(customer.billing.country, customer.billing.state).find(
        (c) => c.name === customer.billing.city
      );
      if (city) {
        setSelectedCity({ value: city.name, label: city.name });
      }
    }

    // Set dropdown values for shipping
    if (customer.shipping?.country) {
      const country = Country.getAllCountries().find((c) => c.isoCode === customer.shipping.country);
      if (country) {
        setSelectedShippingCountry({ value: country.isoCode, label: country.name });
      }
    }
    if (customer.shipping?.state && customer.shipping?.country) {
      const state = State.getStatesOfCountry(customer.shipping.country).find(
        (s) => s.isoCode === customer.shipping.state
      );
      if (state) {
        setSelectedShippingState({ value: state.isoCode, label: state.name });
      }
    }
    if (customer.shipping?.city && customer.shipping?.state && customer.shipping?.country) {
      const city = City.getCitiesOfState(customer.shipping.country, customer.shipping.state).find(
        (c) => c.name === customer.shipping.city
      );
      if (city) {
        setSelectedShippingCity({ value: city.name, label: city.name });
      }
    }
  }, [customer]);

// useEffect(() => {
//   if (gstType === "register") {
//     axios
//       .get(`${BASE_URL}/api/gst`)
//       .then((res) => {
//         // Log the response to debug the API data structure
//         console.log("GST States API Response:", res.data);
//         const stateOptions = res.data.map((s) => ({ value: s.gstinCode, label: s.gstinCode }));
//         setGstStates(stateOptions);
//         // Ensure prefilled gstState is selected if it exists
//         if (customer?.gstState && customer.gstState !== "N/A") {
//           const matchedState = stateOptions.find(
//             (option) => option.value === customer.gstState
//           );
//           if (matchedState) {
//             setSelectedGstState(matchedState);
//           } else {
//             console.warn("Prefilled GST state not found in options:", customer.gstState);
//           }
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch GST states:", err.response || err.message);
//         setGstStates([]);
//         toast.error("Failed to fetch GST states. Please try again.");
//       });
//   } else {
//     setGstStates([]);
//     setSelectedGstState({ value: "N/A", label: "N/A" });
//   }
// }, [gstType, customer]);

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl !== customer?.image) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl, customer]);

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
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map((ci) => ({
      value: ci.name,
      label: ci.name,
    }))
    : [];

  const shippingStateOptions = selectedShippingCountry
    ? State.getStatesOfCountry(selectedShippingCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }))
    : [];

  const shippingCityOptions = selectedShippingState
    ? City.getCitiesOfState(selectedShippingCountry.value, selectedShippingState.value).map(
      (ci) => ({
        value: ci.name,
        label: ci.name,
      })
    )
    : [];

  // Sanitization function to prevent XSS
  // const sanitizeInput = (input) => {
  //   if (typeof input !== "string") return input;
  //   // return input
  //   let sanitized = DOMPurify.sanitize(input, {
  //     ALLOWED_TAGS: [],
  //     ALLOWED_ATTR: [],
  //   });
  //   if (isName) {
  //     sanitized = sanitized.replace(/[^a-zA-Z0-9\s.,'-]/g, "");
  //   }
  //   return sanitized;
  //     // .replace(/&/g, "&amp;")
  //     // .replace(/</g, "&lt;")
  //     // .replace(/>/g, "&gt;")
  //     // .replace(/"/g, "&quot;")
  //     // .replace(/'/g, "&#x27;");
  // };
  const sanitizeInput = (input, isName = false) => {
  if (typeof input !== "string") return input;
  let sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  if (isName) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s.,'-]/g, "");
  }
  return sanitized;
};

  // Validation patterns aligned with ProductForm
  const validationPatterns = {
    name: /^[a-zA-Z\s.,'-]{2,100}$/, // Aligned with productName
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[0-9\s()-]{7,15}$/,
    website: /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
    notes: /^[\w\s.,!?-]{0,500}$/,
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // Aligned with ProductForm's stricter GSTIN
    address1: /^[a-zA-Z0-9\s.,'-]{1,100}$/,
    address2: /^[a-zA-Z0-9\s.,'-]{0,100}$/,
    postalCode: /^\d{6}$/,
    pincode: /^\d{6}$/,
    bankName: /^[a-zA-Z\s.,'-]{2,100}$/,
    branch: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
    accountHolder: /^[a-zA-Z\s.,'-]{2,100}$/,
    accountNumber: /^[0-9]{9,18}$/, // Aligned with stricter numeric account numbers
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/, // Aligned with ProductForm
  };

  // Validation function with regex patterns
  const validateField = (name, value) => {
    const regexPatterns = {
      name: /^[a-zA-Z\s.,'-]{2,100}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      phone: /^\+?[0-9\s()-]{7,15}$/,
      website: /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
      postalCode: /^\d{5,10}$/,
      pincode: /^\d{5,10}$/,
      bankName: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      branch: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      accountHolder: /^[a-zA-Z0-9\s.,'-]{2,100}$/,
      accountNumber: /^[a-zA-Z0-9\s-]{8,20}$/,
      ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      notes: /^[\w\s.,!?-]{0,500}$/,
      gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      address1: /^[a-zA-Z0-9\s.,'-]{1,100}$/,
      address2: /^[a-zA-Z0-9\s.,'-]{0,100}$/,
    };

    // Required fields
    if (name === "name" && !value) return "Name is required.";
    if (name === "email" && !value) return "Email is required.";
    if (name === "phone" && !value) return "Phone number is required.";
    if (name === "currency" && !value) return "Currency is required.";

    // Optional fields (allow empty)
    if (
      !value &&
      [
        "website",
        "notes",
        "gstin",
        "postalCode",
        "pincode",
        "bankName",
        "branch",
        "accountHolder",
        "accountNumber",
        "ifsc",
        "address1",
        "address2",
      ].includes(name)
    ) {
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
          return "Please enter a valid postal code (5-10 digits).";
        case "pincode":
          return "Please enter a valid pincode (5-10 digits).";
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
        case "gstin": // Commented out
          return "Please enter a valid GSTIN (15 characters, e.g., 22AAAAA0000A1Z5).";
        case "name":
          return "Please enter a valid name (2-100 characters, letters and common punctuation only).";
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

  // Input handlers with sanitization and validation
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const sanitizedValue = sanitizeInput(value);
  //   const error = validateField(name, sanitizedValue);

  //   setErrors((prev) => ({ ...prev, [name]: error }));
  //   setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
  //   if (error) {
  //     // toast.error(error);
  //   }
  // };
  const handleInputChange = (e) => {
  const { name, value } = e.target;
  let sanitizedValue = sanitizeInput(value);

  if (name === "gstin") {
    sanitizedValue = sanitizedValue.toUpperCase().replace(/\s/g, "");
  }

  const error = validateField(name, sanitizedValue);
  setErrors((prev) => ({ ...prev, [name]: error }));
  setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
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
    if (error) {
      // toast.error(error);
    }
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
    if (error) {
      // toast.error(error);
    }
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
      // toast.error(error);
    }
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setSelectedState(null);
    setSelectedCity(null);
    setForm((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        country: option ? option.value : "",
        state: "",
        city: "",
      },
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
      shipping: {
        ...prev.shipping,
        country: option ? option.value : "",
        state: "",
        city: "",
      },
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

  const handleGstTypeChange = (e) => {
    const value = e.target.value;
    setGstType(value);
    setForm((prev) => ({ ...prev, gstin: "" }));
    setIsGstinVerified(false);
    if (value === "unregister") {
      setSelectedGstState({ value: "N/A", label: "N/A" });
    } else {
      setSelectedGstState(null);
    }
  };

const [gstin, setGstin] = useState("27AAGCB1286Q1Z4"); // default sample
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleVerifyGstin = async () => {
    if (!form.gstin.trim()) {
      toast.error("Please enter GSTIN");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/gst/${encodeURIComponent(form.gstin)}`
      );
      setResponse(res.data); // same as backend/WhiteBooks response
      
      // Set verification status to true on successful response
      if (res.data && res.data.data && res.data.data.sts.trim() === "Active") {
        setIsGstinVerified(true);
        toast.success("GSTIN verified successfully!");
      } else {
        setIsGstinVerified(false);
        toast.error("GSTIN verification failed. Please check the GSTIN.");
      }
    } catch (err) {
      setError(err?.response?.data || err.message);
      setIsGstinVerified(false);
      toast.error("GSTIN verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // File upload handler
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 1 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPEG or PNG image.");
        setErrors((prev) => ({ ...prev, image: "Invalid image type" }));
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must not exceed 5MB.");
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
    newErrors.website = validateField("website", form.website);
    newErrors.notes = validateField("notes", form.notes);
    newErrors.gstType = gstType ? "" : "GST Type is required.";
    if (gstType === "register") {
      newErrors.gstState = selectedGstState ? "" : "GST State is required.";
      newErrors.gstin = !form.gstin.trim()
        ? "GSTIN is required."
        : validateField("gstin", form.gstin);
      
      // Additional validation: if GSTIN is required but not verified, prevent submission
      if (form.gstin.trim() && !isGstinVerified) {
        newErrors.gstin = "Please verify GSTIN before submitting.";
      }
    } else {
      newErrors.gstState = "";
      newErrors.gstin = "";
    }

    // Additional validation: If customer status is active, GSTIN must be provided and verified
    if (form.status === true && gstType === "register") {
      if (!form.gstin.trim()) {
        newErrors.gstin = "GSTIN is required for active customers.";
      } else if (!isGstinVerified) {
        newErrors.gstin = "GSTIN must be verified for active customers.";
      }
    }
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

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    if (!customer?._id) {
      toast.error("Customer ID is missing. Cannot update customer.");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload as JSON to match the previous version
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        currency: form.currency,
        website: form.website,
        notes: form.notes,
        gstType: gstType === "register" ? "Registered" : "Unregister", // Commented out
        gstState: selectedGstState?.value || "N/A", // Commented out
        gstin: form.gstin || "", // Commented out
        billing: {
          name: form.billing.name,
          address1: form.billing.address1,
          address2: form.billing.address2,
          country: form.billing.country || "",
          state: form.billing.state || "",
          city: form.billing.city || "",
          postalCode: form.billing.postalCode || "",
          pincode: form.billing.pincode || "",
        },
        shipping: {
          name: form.shipping.name,
          address1: form.shipping.address1,
          address2: form.shipping.address2,
          country: form.shipping.country || "",
          state: form.shipping.state || "",
          city: form.shipping.city || "",
          pincode: form.shipping.pincode || "",
        },
        bank: {
          bankName: form.bank.bankName,
          branch: form.bank.branch,
          accountHolder: form.bank.accountHolder,
          accountNumber: form.bank.accountNumber,
          ifsc: form.bank.ifsc,
        },
        status: form.status,
      };

      // Send JSON payload
      await axios.put(`${BASE_URL}/api/customers/${customer._id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle image upload separately if needed
      if (selectedImage) {
        const formData = new FormData();
        formData.append("images", selectedImage);
        await axios.post(`${BASE_URL}/api/customers/${customer._id}/upload-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success("Customer updated successfully!");
      setFormSubmitted(true);
      setSelectedImage(null);
      if (imagePreviewUrl && imagePreviewUrl !== customer?.image) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(customer?.image || null);
      setErrors({});
      setValidationErrors({}); // Commented out
      setIsGstinVerified(!!form.gstin); // Commented out
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || "Failed to update customer";
      toast.error(errorMessage);
      // console.error("Error response:", err.response?.data); // Log for debugging
    } finally {
      setLoading(false);
    }
  };

  // Render loading or error state if customer is undefined
  if (!customer) {
    return (
      <div
        className="modal fade show"
        id="edit-customer"
        tabIndex="-1"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Customer</h4>
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
                  <p className="text-danger">No customer data provided.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal fade show"
      id="edit-customer"
      tabIndex="-1"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <div className="modal-header">
            <div className="page-title">
              <h4>Edit Customer</h4>
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
                <h5 className="mb-3">Edit Customer</h5>
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
                        {errors.gstType && (
                          <span className="text-danger fs-12">{errors.gstType}</span>
                        )}
                      </div>
                    </div>
                    {gstType === "register" && (
                      <>
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">State Code </label>
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
                        </div> */}
                        <div className="col-lg-4 col-md-4">
                          <div className="mb-3">
                            <label className="form-label">GSTIN</label>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter GSTIN"
                                className="form-control"
                                name="gstin"
                                value={form.gstin}
                                onChange={handleInputChange}
                                style={{ pointerEvents: "auto" }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handleVerifyGstin}
                                disabled={loading}
                              >
                                {gstLoading ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                            {(errors.gstin || validationErrors.gstin) && (
                              <span className="text-danger fs-12">
                                {errors.gstin || validationErrors.gstin}
                              </span>
                            )}
                            {response && (
                              <div className="alert alert-success mt-2">
                                <div>
                                  <strong>Legal Name:</strong>{" "}
                                  {response?.data?.lgnm || "—"}
                                </div>
                                <div>
                                  <strong>Trade Name:</strong>{" "}
                                  {response?.data?.tradeNam || "—"}
                                </div>
                                <div>
                                  <strong>GSTIN:</strong>{" "}
                                  {response?.data?.gstin || "—"}
                                </div>
                                <div>
                                  <strong>Status:</strong>{" "}
                                  {response?.data?.sts ||
                                    response?.status_desc ||
                                    "—"}
                                </div>
                                <div>
                                  <strong>State:</strong>{" "}
                                  {response?.data?.stj || "—"}
                                </div>
                                <div>
                                  <strong>PIN Code:</strong>{" "}
                                  {response?.data?.pradr?.addr?.pncd || "—"}
                                </div>
                                <div>
                                  <strong>Address:</strong>{" "}
                                  {response?.data?.pradr?.addr?.bnm
                                    ? `${response.data.pradr.addr.bno || ""} ${
                                        response.data.pradr.addr.bnm
                                      }, ${response.data.pradr.addr.loc}`
                                    : "—"}
                                </div>
                              </div>
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
                              <label className="form-label">Pincode</label>
                              <input
                                type="text"
                                className="form-control"
                                name="pincode"
                                value={form.shipping.pincode}
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
                      <div className="col-lg-4 col-md-6" style={{display:'flex', gap:'5px'}}>
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
                      {loading ? "Saving..." : "Update Customer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;