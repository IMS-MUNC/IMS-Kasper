import React, { useEffect, useState } from "react";
import "./product.css";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { MdImageSearch } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
import { TbChevronUp, TbEye, TbRefresh } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

const ProductForm = () => {
  const { t } = useTranslation();

  // Improved regex patterns for validation with examples
  // Example: productName: "Apple iPhone 15"
  // Example: sku: "SKU-1234"
  // Example: price: "199.99"
  // Example: quantity: "100"
  // Example: description: "A great product!"
  // Example: seoTitle: "Best iPhone 2025"
  // Example: seoDescription: "Buy the best iPhone at a great price."
  // Example: leadTime: "7"
  // Example: reorderLevel: "50"
  // Example: initialStock: "200"
  // Example: serialNumber: "SN-123456"
  // Example: batchNumber: "BATCH-001"
  // Example: discountValue: "10.50"
  // Example: quantityAlert: "5"
  // Example: categoryName: "Electronics"
  // Example: categorySlug: "electronics"
  // Example: variantValue: "Red, Blue, Green"
  const validationPatterns = {
    productName: /^[A-Za-z0-9\s\-]{2,50}$/,
    sku: /^[A-Z0-9\-]{3,20}$/,
    price: /^\d+(\.\d{1,2})?$/,
    quantity: /^(?:[1-9]\d*)$/,
    description: /^[\w\s.,!?\-]{0,300}$/,
    seoTitle: /^[a-zA-Z0-9\s\-]{2,60}$/,
    seoDescription: /^[a-zA-Z0-9\s\-,.]{2,160}$/,
    leadTime: /^\d{1,4}$/,
    reorderLevel: /^\d{1,6}$/,
    initialStock: /^\d{1,6}$/,
    serialNumber: /^[A-Z0-9\-]{1,50}$/,
    batchNumber: /^[A-Z0-9\-]{1,50}$/,
    discountValue: /^\d+(\.\d{1,2})?$/,
    quantityAlert: /^\d{1,6}$/,
    categoryName: /^[A-Za-z\s]{2,50}$/,
    categorySlug: /^[a-z0-9\-]{2,50}$/,
    variantValue: /^[a-zA-Z0-9\s,]{1,100}$/,
  };

  // Improved sanitization: strips HTML, trims, and normalizes whitespace
  // Example: sanitizeInput('<b>  Apple  </b>') => 'Apple'

  // Improved sanitization: strips HTML, trims, and normalizes whitespace
  // Example: sanitizeInput('<b>  Apple  </b>') => 'Apple'
  const sanitizeInput = (value, preserveSpaces = false) => {
    if (typeof value !== "string") return value;
    let input = value;
    // Remove HTML tags
    input = input.replace(/<[^>]*>?/gm, "");
    // Normalize whitespace
    input = preserveSpaces
      ? input.replace(/\s+/g, " ")
      : input.trim().replace(/\s+/g, " ");
    // Remove dangerous characters (optional)
    input = input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    // DOMPurify fallback for extra safety
    input = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return input;
  };

  const steps = [
    t("descriptionAndMedia"),
    t("pricing"),
    t("images"),
    t("variants"),
  ];
  const variantTabs = [
    t("color"),
    t("size"),
    t("expiry"),
    t("material"),
    t("model"),
    t("weight"),
    t("skinType"),
    t("packagingType"),
    t("flavour"),
  ];
  // const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(
    Array(steps.length).fill("pending")
  );
  const [activeTab, setActiveTab] = useState("Color");
  const [images, setImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const inputChange = (key, value) => {
    // setFormData((prev) => ({ ...prev, [key]: value }));
    const sanitizedValue = sanitizeInput(value, true);
    const error = validateField(key, sanitizedValue);
    setFormErrors((prev) => ({ ...prev, [key]: error }));
    setFormData((prev) => ({ ...prev, [key]: sanitizedValue }));
  };

  //  const validateStep = () => {
  //   const errors = {};
  //   let isValid = true;

  //   if (step === 0) {
  //     // Step 0: Basic Info
  //     if (!formData.productName || !validationPatterns.productName.test(formData.productName)) {
  //       errors.productName = formData.productName ? t("invalidProductName") : t("fieldRequired");
  //     }
  //     if (!formData.sku || !validationPatterns.sku.test(formData.sku)) {
  //       errors.sku = formData.sku ? t("invalidSKUFormat") : t("fieldRequired");
  //     }
  //     if (!selectedCategory) {
  //       errors.category = t("fieldRequired");
  //     }
  //     if (!selectedsubCategory) {
  //       errors.subCategory = t("fieldRequired");
  //     }
  //     if (!formData.store) {
  //       errors.store = t("fieldRequired");
  //     }
  //     if (!selectedWarehouse) {
  //       errors.warehouse = t("fieldRequired");
  //     }
  //     if (!selectedHSN) {
  //       errors.hsn = t("fieldRequired");
  //     }
  //     if (formData.isAdvanced) {
  //       if (!formData.leadTime || !validationPatterns.leadTime.test(formData.leadTime)) {
  //         errors.leadTime = formData.leadTime ? t("invalidLeadTimeFormat") : t("fieldRequired");
  //       }
  //       if (!formData.reorderLevel || !validationPatterns.reorderLevel.test(formData.reorderLevel)) {
  //         errors.reorderLevel = formData.reorderLevel ? t("invalidReorderLevelFormat") : t("fieldRequired");
  //       }
  //       if (!formData.initialStock || !validationPatterns.initialStock.test(formData.initialStock)) {
  //         errors.initialStock = formData.initialStock ? t("invalidInitialStockFormat") : t("fieldRequired");
  //       }
  //       if (formData.trackType === "serial" && (!formData.serialNumber || !validationPatterns.serialNumber.test(formData.serialNumber))) {
  //         errors.serialNumber = formData.serialNumber ? t("invalidSerialNumberFormat") : t("fieldRequired");
  //       }
  //       if (formData.trackType === "batch" && (!formData.batchNumber || !validationPatterns.batchNumber.test(formData.batchNumber))) {
  //         errors.batchNumber = formData.batchNumber ? t("invalidBatchNumberFormat") : t("fieldRequired");
  //       }
  //     }
  //   } else if (step === 1) {
  //     // Step 1: Pricing
  //     if (!formData.purchasePrice || !validationPatterns.price.test(formData.purchasePrice)) {
  //       errors.purchasePrice = formData.purchasePrice ? t("invalidPriceFormat") : t("fieldRequired");
  //     }
  //     if (!formData.quantity || !validationPatterns.quantity.test(formData.quantity)) {
  //       errors.quantity = formData.quantity ? t("invalidQuantityFormat") : t("fieldRequired");
  //     }
  //     if (!formData.sellingPrice || !validationPatterns.price.test(formData.sellingPrice)) {
  //       errors.sellingPrice = formData.sellingPrice ? t("invalidPriceFormat") : t("fieldRequired");
  //     }
  //     if (!formData.wholesalePrice || !validationPatterns.price.test(formData.wholesalePrice)) {
  //       errors.wholesalePrice = formData.wholesalePrice ? t("invalidPriceFormat") : t("fieldRequired");
  //     }
  //     if (!formData.retailPrice || !validationPatterns.price.test(formData.retailPrice)) {
  //       errors.retailPrice = formData.retailPrice ? t("invalidPriceFormat") : t("fieldRequired");
  //     }
  //     if (!selectedUnits) {
  //       errors.unit = t("fieldRequired");
  //     }
  //     if (!formData.taxType) {
  //       errors.taxType = t("fieldRequired");
  //     }
  //     if (!formData.tax) {
  //       errors.tax = t("fieldRequired");
  //     }
  //     if (!formData.discountType) {
  //       errors.discountType = t("fieldRequired");
  //     }
  //     if (!formData.discountValue || !validationPatterns.discountValue.test(formData.discountValue)) {
  //       errors.discountValue = formData.discountValue ? t("invalidDiscountValueFormat") : t("fieldRequired");
  //     }
  //     if (!formData.quantityAlert || !validationPatterns.quantityAlert.test(formData.quantityAlert)) {
  //       errors.quantityAlert = formData.quantityAlert ? t("invalidQuantityAlertFormat") : t("fieldRequired");
  //     }
  //   } else if (step === 2) {
  //     // Step 2: Images & SEO
  //     if (!formData.description || !validationPatterns.description.test(formData.description)) {
  //       errors.description = formData.description ? t("invalidDescriptionFormat") : t("fieldRequired");
  //     }
  //     // Optional: Add validation for images if required
  //     // if (images.length === 0) {
  //     //   errors.images = t("atLeastOneImageRequired");
  //     // }
  //   } else if (step === 3) {
  //     // Step 3: Variants
  //     // const hasValidVariant = variants.some(
  //     //   (variant) => variant.selectedVariant && variant.selectedValue
  //     // );
  //     // if (!hasValidVariant) {
  //     //   errors.variants = t("atLeastOneVariantRequired");
  //     // }
  //     variants.forEach((variant, index) => {
  //       if (variant.selectedValue && !validationPatterns.variantValue.test(variant.selectedValue)) {
  //         errors[`variantValue_${index}`] = t("invalidVariantFormat");
  //       }
  //     });
  //   }

  //   setFormErrors(errors);
  //   isValid = Object.keys(errors).length === 0;
  //   return isValid;
  // };

  //  const validateStep = () => {
  //   if (step === 3) {
  //     return !!formData[activeTab];
  //   }
  //   return true; // Assume all other steps valid for now
  // };

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      // Step 0: Basic Info
      if (!formData.productName)
        newErrors.productName = "Product Name is required";
      if (
        formData.productName &&
        !validationPatterns.productName.test(formData.productName)
      )
        newErrors.productName = "Invalid Product Name";
      if (!formData.sku) newErrors.sku = "SKU is required";
      if (formData.sku && !validationPatterns.sku.test(formData.sku))
        newErrors.sku = "Invalid SKU formet";
      if (!selectedCategory) newErrors.category = "Category is required";
      if (!selectedsubCategory)
        newErrors.subCategory = "Subcategory is required";
      if (!formData.store) newErrors.store = "Store is required";
      if (!selectedWarehouse) newErrors.warehouse = "Warehouse is required";
      if (!selectedHSN) newErrors.hsn = "HSN Code is required";
      if (formData.itemType === "Good" && !selectedBrands)
        newErrors.brand = "Brand is required";
      if (formData.isAdvanced) {
        if (!formData.leadTime) newErrors.leadTime = "Lead Time is required";
        if (
          formData.leadTime &&
          !validationPatterns.leadTime.test(formData.leadTime)
        )
          newErrors.leadTime = "Invalid Lead Time";
        if (!formData.reorderLevel) newErrors.reorderLevel = "Reorder Level is required";
        if (
          formData.reorderLevel &&
          !validationPatterns.reorderLevel.test(formData.reorderLevel)
        )
          newErrors.reorderLevel = "Invalid Reorder Level";
        if (!formData.initialStock) newErrors.initialStock = "Initial Stock is required";
        if (
          formData.initialStock &&
          !validationPatterns.initialStock.test(formData.initialStock)
        )
          newErrors.initialStock = "Invalid Initial Stock format";
        if (formData.trackType === "serial" && !formData.serialNumber)
          newErrors.serialNumber = "Serial Number is required";
        if (
          formData.serialNumber &&
          !validationPatterns.serialNumber.test(formData.serialNumber)
        )
          newErrors.serialNumber = "Invalid Serial Number";
        if (formData.trackType === "batch" && !formData.batchNumber)
          newErrors.batchNumber = "Batch Number is required";
        if (
          formData.batchNumber &&
          !validationPatterns.batchNumber.test(formData.batchNumber)
        )
          newErrors.batchNumber = "Invalid Batch Number";
      }
    } else if (step === 1) {
      // Step 1: Pricing
      if (!formData.purchasePrice) newErrors.purchasePrice = "Purchase Price is required";
      if (
        formData.purchasePrice &&
        !validationPatterns.price.test(formData.purchasePrice)
      )
        newErrors.purchasePrice = "Purchase Price must be a positive number with up to 2 decimal places";
      if (!formData.quantity) newErrors.quantity = "Quantity must be at least 1";
      if (
        formData.quantity &&
        !validationPatterns.quantity.test(formData.quantity)
      )
        newErrors.quantity = "Quantity atleast should be 1";
      if (!formData.sellingPrice) newErrors.sellingPrice = "Selling Price is required";
      if (
        formData.sellingPrice &&
        !validationPatterns.price.test(formData.sellingPrice)
      )
        newErrors.sellingPrice = "Selling Price must be a positive number with up to 2 decimal places";
      if (!formData.wholesalePrice)
        newErrors.wholesalePrice = "Wholesale Price must be a positive number with up to 2 decimal places";
      if (
        formData.wholesalePrice &&
        !validationPatterns.price.test(formData.wholesalePrice)
      )
        newErrors.wholesalePrice = "Wholesale Price is required";
      if (!formData.retailPrice) newErrors.retailPrice = "Retail Price must be a positive number with up to 2 decimal places";
      if (
        formData.retailPrice &&
        !validationPatterns.price.test(formData.retailPrice)
      )
        newErrors.retailPrice = "Retail Price is required";
      if (!selectedUnits) newErrors.unit = "Unit is required";
      if (!formData.taxType) newErrors.taxType = "Tax Type is required";
      if (!formData.tax) newErrors.tax = "Tax Rate is required";
      if (!formData.discountType) newErrors.discountType = "Discount Type is required";
      if (!formData.discountValue) newErrors.discountValue = "Discount Value must be a positive number with up to 2 decimal places";
      if (
        formData.discountValue &&
        !validationPatterns.discountValue.test(formData.discountValue)
      )
        newErrors.discountValue = "Discount Value must be a positive number with up to 2 decimal places";
      if (!formData.quantityAlert) newErrors.quantityAlert = "Quantity Alert is required";
      if (
        formData.quantityAlert &&
        !validationPatterns.quantityAlert.test(formData.quantityAlert)
      )
        newErrors.quantityAlert = "Quantity Alert must be a positive integer";
    } else if (step === 2) {
      // Step 2: Images & SEO
      if (!formData.description) newErrors.description = "Description is required";
      if (
        formData.description &&
        !validationPatterns.description.test(formData.description)
      )
        newErrors.description = "Invalid Description";
      if (
        formData.seoTitle &&
        !validationPatterns.seoTitle.test(formData.seoTitle)
      )
        newErrors.seoTitle = "Invalid SEO Title";
      if (
        formData.seoDescription &&
        !validationPatterns.seoDescription.test(formData.seoDescription)
      )
        newErrors.seoDescription = "Invalid SEO Description";
      // Optional: Add image validation if required
      // if (images.length === 0) newErrors.images = t("atLeastOneImageRequired");
    } else if (step === 3) {
      // Step 3: Variants
      const hasValidVariant = variants.some(
        (variant) => variant.selectedVariant && variant.selectedValue
      );
      if (!hasValidVariant) {
        newErrors.variants = "At least one variant with a valid value is required";
      }
      variants.forEach((variant, index) => {
        if (
          variant.selectedValue &&
          !validationPatterns.variantValue.test(variant.selectedValue)
        ) {
          newErrors[`variantValue_${index}`] = t("invalidVariantFormat");
        }
      });
    }

    // Update formErrors state with new validation errors
    setFormErrors(newErrors);

    // Return array of error messages for toast notifications
    return Object.values(newErrors).filter(Boolean);
  };
  // const handleNext = () => {
  //   // const isValid = validateStep();
  //   // const updatedStatus = [...stepStatus];
  //   // updatedStatus[step] = isValid ? "complete" : "incomplete";
  //   // setStepStatus(updatedStatus);

  //   // if (isValid && step < steps.length - 1) {
  //   //   setStep((prev) => prev + 1);
  //   // }
  //   const isValid = validateStep();
  //   const updatedStatus = [...stepStatus];
  //   updatedStatus[step] = isValid ? "complete" : "incomplete";
  //   setStepStatus(updatedStatus);

  //   if (isValid && step < steps.length - 1) {
  //     setStep((prev) => prev + 1);
  //   } else if (!isValid) {
  //     toast.error(t("pleaseCompleteRequiredFields"));
  //   }
  // };

  const handleNext = () => {
    const errors = validateStep();
    const updatedStatus = [...stepStatus];
    updatedStatus[step] = errors.length === 0 ? "complete" : "incomplete";
    setStepStatus(updatedStatus);

    if (errors.length === 0 && step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }
  };
  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

 useEffect(() => {
  const savedDraft = localStorage.getItem("draftForm");
  if (savedDraft) {
    const parsedDraft = JSON.parse(savedDraft);

    if (parsedDraft.formData) setFormData(parsedDraft.formData);
    if (parsedDraft.selectedCategory) setSelectedCategory(parsedDraft.selectedCategory);
    if (parsedDraft.selectedsubCategory) setSelectedsubCategory(parsedDraft.selectedsubCategory);
    if (parsedDraft.selectedBrands) setSelectedBrands(parsedDraft.selectedBrands);
    if (parsedDraft.selectedUnits) setSelectedUnits(parsedDraft.selectedUnits);
    if (parsedDraft.selectedWarehouse) setSelectedWarehouse(parsedDraft.selectedWarehouse);
  }
}, []);



const handleSaveDraft = () => {
  const draft = {
    formData,
    selectedCategory,
    selectedsubCategory,
    selectedBrands,
    selectedUnits,
    selectedWarehouse,
  };

  localStorage.setItem("draftForm", JSON.stringify(draft));
  toast.info("Draft Saved!");
};



  // const onDrop = (acceptedFiles) => {
  //   const mapped = acceptedFiles.map((file) =>
  //     Object.assign(file, { preview: URL.createObjectURL(file) })
  //   );
  //   setImages((prev) => [...prev, ...mapped]);
  // };
  const onDrop = (acceptedFiles) => {
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const validFiles = [];
    const invalidFiles = [];

    acceptedFiles.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push({
          file,
          error: `Invalid file type for ${file.name}. Only JPEG, PNG, or JPG allowed.`,
        });
      } else if (file.size > maxSize) {
        invalidFiles.push({
          file,
          error: `Image ${file.name} exceeds 1MB limit.`,
        });
      } else {
        validFiles.push(
          Object.assign(file, { preview: URL.createObjectURL(file) })
        );
      }
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ error }) => toast.error(error));
      setFormErrors((prev) => ({
        ...prev,
        images: "Image size should not exceeded 1MB.",
      }));
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      setFormErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedsubCategory, setSelectedsubCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [, setSelectedSubcategory] = useState(null);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsware, setOptionsWare] = useState([]);
  // const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [formData, setFormData] = useState({
    // Step 0 - Basic Info
    productName: "",
    sku: "",
    brand: "",
    category: "",
    subCategory: "",
    // supplier: "",
    // itemBarcode: "",
    store: "",
    warehouse: "",

    // Step 1 - Pricing
    purchasePrice: "",
    sellingPrice: "",
    wholesalePrice: "",
    retailPrice: "",
    quantity: "",
    unit: "",
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: "",
    quantityAlert: "",

    // Step 2 - Images & SEO
    description: "",
    seoTitle: "",
    seoDescription: "",

    // Other
    sellingType: "",
    barcodeSymbology: "",
    productType: "Single",

    // Newly added
    itemType: "Good",
    isAdvanced: false,
    trackType: "serial",
    isReturnable: false,
    leadTime: "",
    reorderLevel: "",
    initialStock: "",
    serialNumber: "",
    batchNumber: "",
    returnable: false,
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value, true);
    const error = validateField(name, sanitizedValue);
    setFormErrors((prev) => ({ ...prev, [name]: error }));

    // If switching itemType, reset fields specific to the other type
    if (name === "itemType") {
      if (value === "Service") {
        // Clear all Good-specific fields
        setFormData((prev) => ({
          ...prev,
          itemType: value,
          purchasePrice: "",
          sellingPrice: "",
          wholesalePrice: "",
          retailPrice: "",
          quantity: "",
          unit: "",
          taxType: "",
          tax: "",
          discountType: "",
          discountValue: "",
          quantityAlert: "",
          description: "",
          seoTitle: "",
          seoDescription: "",
          sellingType: "",
          barcodeSymbology: "",
          productType: "Single",
          isAdvanced: false,
          trackType: "serial",
          isReturnable: false,
          leadTime: "",
          reorderLevel: "",
          initialStock: "",
          serialNumber: "",
          batchNumber: "",
          returnable: false,
          expirationDate: "",
        }));
      } else if (value === "Good") {
        // Clear all Service-specific fields (if any in future)
        setFormData((prev) => ({
          ...prev,
          itemType: value,
          // Add service-specific fields here if needed
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const validateField = (name, value) => {
    if (
      !value &&
      [
        "productName",
        "sku",
        "quantity",
        "discountValue",
        "quantityAlert",
      ].includes(name)
    ) {
      return t("fieldRequired");
    }

    switch (name) {
      case "productName":
        return validationPatterns.productName.test(value)
          ? ""
          : t("invalidProductName");
      case "sku":
        return validationPatterns.sku.test(value) ? "" : t("invalidSKUFormat");
      // case "itemBarcode":
      //   return validationPatterns.itemBarcode.test(value) ? "" : t("invalidBarcodeFormat");
      case "purchasePrice":
      case "sellingPrice":
      case "wholesalePrice":
      case "retailPrice":
        return validationPatterns.price.test(value)
          ? ""
          : t("invalidPriceFormat");
      case "quantity":
        return validationPatterns.quantity.test(value)
          ? ""
          : t("invalidQuantityFormat");
      case "description":
        return validationPatterns.description.test(value)
          ? ""
          : t("invalidDescriptionFormat");
      case "seoTitle":
        return validationPatterns.seoTitle.test(value)
          ? ""
          : t("invalidSeoTitleFormat");
      case "seoDescription":
        return validationPatterns.seoDescription.test(value)
          ? ""
          : t("invalidSeoDescriptionFormat");
      case "leadTime":
        return validationPatterns.leadTime.test(value)
          ? ""
          : t("invalidLeadTimeFormat");
      case "reorderLevel":
        return validationPatterns.reorderLevel.test(value)
          ? ""
          : t("invalidReorderLevelFormat");
      case "initialStock":
        return validationPatterns.initialStock.test(value)
          ? ""
          : t("invalidInitialStockFormat");
      case "serialNumber":
        return validationPatterns.serialNumber.test(value)
          ? ""
          : t("invalidSerialNumberFormat");
      case "batchNumber":
        return validationPatterns.batchNumber.test(value)
          ? ""
          : t("invalidBatchNumberFormat");
      case "discountValue":
        return validationPatterns.discountValue.test(value)
          ? ""
          : t("invalidDiscountValueFormat");
      case "quantityAlert":
        return validationPatterns.quantityAlert.test(value)
          ? ""
          : t("invalidQuantityAlertFormat");
      case "categoryName":
        return validationPatterns.categoryName.test(value)
          ? ""
          : t("invalidCategoryName");
      case "categorySlug":
        return validationPatterns.categorySlug.test(value)
          ? ""
          : t("invalidCategorySlug");
      case "variantValue":
        return validationPatterns.variantValue.test(value)
          ? ""
          : t("invalidVariantFormat");
      default:
        return "";
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/category/categories`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      const data = await res.json();

      // Map data for react-select
      // const options = data.map((category) => ({
      //   value: category._id, // or category.categoryName
      //   label: category.categoryName,
      // }));
      const options = data.map((category) => ({
        value: category._id,
        label: sanitizeInput(category.categoryName, true),
      }));
      setCategories(options);

      // setCategories(options);
      // console.log("ferere categories", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      // const options = res.data.units.map((unit) => ({
      //   value: unit.shortName,
      //   label: `${unit.unitsName} (${unit.shortName})`,
      // }));
      // setUnitsOptions(options);
      const options = res.data.units.map((unit) => ({
        value: unit.shortName,
        label: sanitizeInput(`${unit.unitsName} (${unit.shortName})`, true),
      }));
      setUnitsOptions(options);
    } catch (error) {
      console.error("Failed to fetch active units:", error);
    }
  };

  useEffect(() => {
    // console.log("Selected Category:", selectedCategory);
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory.value);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching subcategories for category ID:", categoryId);
      // const res = await fetch(`${BASE_URL}/api/category/by-category/${categoryId}`);
      const res = await fetch(
        `${BASE_URL}/api/subcategory/by-category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        }
      );
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      // console.log("Subcategory API raw response:", data);

      // const options = data.map((subcat) => ({
      //   value: subcat._id,
      //   label: subcat.subCategoryName,
      // }));
      // setSubcategories(options);
      const options = data.map((subcat) => ({
        value: subcat._id,
        label: sanitizeInput(subcat.subCategoryName, true),
      }));
      setSubcategories(options);
      // console.log("ferere subcategories", data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/brands/active-brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("fetchbrand", data);

      // const options = data.brands.map((brand) => ({
      //   value: brand._id,
      //   label: brand.brandName,
      // }));

      // setBrandOptions(options);
      const options = data.brands.map((brand) => ({
        value: brand._id,
        label: sanitizeInput(brand.brandName, true),
      }));
      setBrandOptions(options);
      // console.log("ferere brand", data);
    } catch (error) {
      console.error("Failed to load active brands:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchUnits();
  }, []);

  const subCategoryChange = (selectedOption) => {
    setSelectedsubCategory(selectedOption);
    // console.log("Selected subcategory:", selectedOption);
  };
  const handleBrandChange = (selectedOption) => {
    setSelectedBrands(selectedOption);
    // console.log("Selected brands:", selectedOption);
  };
  const handleUnitChange = (selectedOption) => {
    setSelectedUnits(selectedOption);
    // console.log("Selected Units:", selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      toast.error(t("pleaseCorrectErrors"));
      return;
    }
    const formPayload = new FormData();

    formPayload.append(
      "productName",
      sanitizeInput(formData.productName, true)
    );
    formPayload.append("sku", sanitizeInput(formData.sku));
    formPayload.append("brand", selectedBrands?.value || "");
    formPayload.append("category", selectedCategory?.value || "");
    formPayload.append("subCategory", selectedsubCategory?.value || "");
    // if (selectedSupplier?.value && typeof selectedSupplier.value === "string" && selectedSupplier.value.trim() !== "") {
    //   formPayload.append("supplier", selectedSupplier.value);
    // }
    // formPayload.append("itemBarcode", sanitizeInput(formData.itemBarcode));
    formPayload.append("store", sanitizeInput(formData.store));
    formPayload.append("warehouse", selectedWarehouse?.value || "");
    if (selectedHSN?.value) {
      formPayload.append("hsn", selectedHSN.value);
    }
    formPayload.append("purchasePrice", Number(formData.purchasePrice));
    formPayload.append("sellingPrice", Number(formData.sellingPrice));
    formPayload.append("wholesalePrice", Number(formData.wholesalePrice));
    formPayload.append("retailPrice", Number(formData.retailPrice));
    formPayload.append("quantity", Number(formData.quantity));
    formPayload.append("unit", selectedUnits?.value || "");
    formPayload.append("taxType", sanitizeInput(formData.taxType));
    formPayload.append("tax", sanitizeInput(formData.tax));
    formPayload.append("discountType", sanitizeInput(formData.discountType));
    formPayload.append("discountValue", Number(formData.discountValue));
    formPayload.append("quantityAlert", Number(formData.quantityAlert));
    formPayload.append(
      "description",
      sanitizeInput(formData.description, true)
    );
    formPayload.append("seoTitle", sanitizeInput(formData.seoTitle, true));
    formPayload.append(
      "seoDescription",
      sanitizeInput(formData.seoDescription, true)
    );
    formPayload.append("itemType", sanitizeInput(formData.itemType));
    formPayload.append("isAdvanced", formData.isAdvanced);
    formPayload.append("trackType", sanitizeInput(formData.trackType));
    formPayload.append("isReturnable", Boolean(formData.isReturnable));
    formPayload.append("leadTime", sanitizeInput(formData.leadTime));
    formPayload.append("reorderLevel", sanitizeInput(formData.reorderLevel));
    formPayload.append("initialStock", sanitizeInput(formData.initialStock));
    formPayload.append("serialNumber", sanitizeInput(formData.serialNumber));
    formPayload.append("batchNumber", sanitizeInput(formData.batchNumber));
    formPayload.append("returnable", Boolean(formData.returnable));
    formPayload.append(
      "expirationDate",
      formData.expirationDate ? sanitizeInput(formData.expirationDate) : ""
    );

    // Build variantsMap from selectedVariant and selectedValue
    const variantsMap = {};
    variants.forEach((variant) => {
      if (variant.selectedVariant && variant.selectedValue) {
        // Support multiple values if selectedValue is comma separated
        const values = sanitizeInput(variant.selectedValue, true)
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v);
        if (values.length > 0) {
          if (variantsMap[variant.selectedVariant]) {
            // Merge values if variant already exists
            variantsMap[variant.selectedVariant] = Array.from(
              new Set([...variantsMap[variant.selectedVariant], ...values])
            );
          } else {
            variantsMap[variant.selectedVariant] = values;
          }
        }
      }
    });
    formPayload.append("variants", JSON.stringify(variantsMap));

    // Append form fields
    // formPayload.append("productName", formData.productName);
    // formPayload.append("sku", formData.sku);
    // formPayload.append("brand", selectedBrands?.value);
    // formPayload.append("category", selectedCategory?.value);
    // formPayload.append("subCategory", selectedsubCategory?.value);
    // // Only send supplier if valid ObjectId is present
    // if (selectedSupplier?.value && typeof selectedSupplier.value === 'string' && selectedSupplier.value.trim() !== '') {
    //   formPayload.append("supplier", selectedSupplier.value);
    // }
    // // Always send itemBarcode, prefer selectedSupplier if available
    // formPayload.append("itemBarcode", formData.itemBarcode);
    // formPayload.append("store", formData.store);
    // // Always send warehouse, prefer selectedWarehouse if available
    // formPayload.append("warehouse", selectedWarehouse?.value);
    // // Ensure hsn is sent if selectedHSN exists
    // if (selectedHSN?.value) {
    //   formPayload.append("hsn", selectedHSN.value);
    // }
    // formPayload.append("purchasePrice", Number(formData.purchasePrice));
    // formPayload.append("sellingPrice", Number(formData.sellingPrice));
    // formPayload.append("wholesalePrice", Number(formData.wholesalePrice));
    // formPayload.append("retailPrice", Number(formData.retailPrice));
    // formPayload.append("quantity", Number(formData.quantity));
    // formPayload.append("unit", selectedUnits?.value);
    // formPayload.append("taxType", formData.taxType);
    // formPayload.append("tax", formData.tax);
    // formPayload.append("discountType", formData.discountType);
    // formPayload.append("discountValue", Number(formData.discountValue));
    // formPayload.append("quantityAlert", Number(formData.quantityAlert));
    // formPayload.append("description", formData.description);
    // formPayload.append("seoTitle", formData.seoTitle);
    // formPayload.append("seoDescription", formData.seoDescription);

    // formPayload.append("itemType", formData.itemType);
    // formPayload.append("isAdvanced", formData.isAdvanced);
    // formPayload.append("trackType", formData.trackType);
    // formPayload.append("isReturnable", formData.isReturnable);
    // formPayload.append("leadTime", formData.leadTime);
    // formPayload.append("reorderLevel", formData.reorderLevel);
    // formPayload.append("initialStock", formData.initialStock);
    // formPayload.append("serialNumber", formData.serialNumber);
    // formPayload.append("batchNumber", formData.batchNumber);
    // formPayload.append("returnable", formData.returnable);
    // formPayload.append("expirationDate", formData.expirationDate);

    // // Convert variants array to the format expected by backend (Map of arrays)
    // const variantsMap = {};
    // variants.forEach(variant => {
    //   if (variant.variantName && variant.variantValue) {
    //     // Split comma-separated values and trim whitespace
    //     const values = variant.variantValue.split(',').map(v => v.trim()).filter(v => v);
    //     if (values.length > 0) {
    //       variantsMap[variant.variantName] = values;
    //     }
    //   }
    // });
    // formPayload.append("variants", JSON.stringify(variantsMap));

    // Append multiple images (must be File objects)
    images.forEach((imgFile) => {
      formPayload.append("images", imgFile); // name must match multer field in backend
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/products/create`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        }
      );

      toast.success("Product created successfully!");
      navigate("/product");
    } catch (error) {
      toast.error("Failed to create product");
      console.error(
        "Product creation error:",
        error.response?.data || error.message
      );
    }
  };

  // const generateBarcode = () => {
  //   const prefix = "BR"; // Optional
  //   const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
  //   const barcode = `${prefix}${randomNumber}`;
  //   setFormErrors((prev) => ({ ...prev, itemBarcode: "" }));
  //   setFormData((prev) => ({ ...prev, itemBarcode: barcode }));
  //   return `${prefix}${randomNumber}`;
  // };

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const categorySubmit = async (e) => {
    // e.preventDefault();
    // const sanitizedCategoryName = sanitizeInput(categoryName, true);
    // const sanitizedCategorySlug = sanitizeInput(categorySlug);

    // if (!sanitizedCategoryName || !sanitizedCategorySlug) {
    //   toast.error(t("allFieldsRequired"));
    //   return;
    // }

    // const nameError = validateField("categoryName", sanitizedCategoryName);
    // const slugError = validateField("categorySlug", sanitizedCategorySlug);
    // if (nameError || slugError) {
    //   setFormErrors({ categoryName: nameError, categorySlug: slugError });
    //   toast.error(t("pleaseCorrectErrors"));
    //   return;
    // }

    e.preventDefault();
    const sanitizedCategoryName = sanitizeInput(categoryName, true);
    const sanitizedCategorySlug = sanitizeInput(categorySlug);

    if (!sanitizedCategoryName || !sanitizedCategorySlug) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    const nameError = validateField("categoryName", sanitizedCategoryName);
    const slugError = validateField("categorySlug", sanitizedCategorySlug);
    if (nameError || slugError) {
      setFormErrors({ categoryName: nameError, categorySlug: slugError });
      toast.error(t("pleaseCorrectErrors"));
      return;
    }
    if (!categoryName || !categorySlug) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/category/categories`,
        {
          categoryName: sanitizedCategoryName,
          categorySlug: sanitizedCategorySlug,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(t("categoryCreatedSuccessfully"));
      setCategoryName("");
      setCategorySlug("");
      fetchCategories();
      window.$("#categoryModal").modal("hide");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || t("errorCreatingCategory"));
    }
  };

  // to generate sku i.e, stock keeping unit based on category
  const generateSKU = () => {
    // const category = formData.category || "GEN";
    // const name = sanitizeInput(formData.productName || "PRD", true).replace(/\s+/g, "-");
    // // const name = formData.name || "PRD";
    // const randomNum = Math.floor(Math.random() * 9000) + 1000;
    // const sku = `${category.toUpperCase().slice(0, 3)}-${name.toUpperCase().slice(0, 3)}-${randomNum}`
    // setFormErrors((prev) => ({ ...prev, sku: "" }));
    // setFormData((prevProduct) => ({
    //   ...prevProduct,
    //   sku,
    // }))
    const category = formData.category || "GEN";
    const name = formData.productName || "PRD";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const sku = `${category.toUpperCase().slice(0, 3)}-${name
      .toUpperCase()
      .slice(0, 3)}-${randomNum}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  // to auto change sku based on changes in product name or category
  useEffect(() => {
    if (formData.productName || formData.category) {
      generateSKU();
    }
  }, [formData.productName, formData.category]);

  // supplier
  // useEffect(() => {
  //   const fetchActiveSuppliers = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(`${BASE_URL}/api/suppliers/active`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // ✅ token sent properly
  //         },
  //       });
  //       const suppliers = res.data.suppliers;

  //       // const formattedOptions = suppliers.map((supplier) => ({
  //       //   value: supplier._id,
  //       //   label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
  //       // }));

  //       // setOptions(formattedOptions);
  //       const formattedOptions = suppliers.map((supplier) => ({
  //         value: supplier._id,
  //         label: sanitizeInput(`${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`, true),
  //       }));
  //       setOptions(formattedOptions);
  //     } catch (err) {
  //       console.error("Error fetching active suppliers:", err);
  //     }
  //   };

  //   fetchActiveSuppliers();
  // }, []);

  // const handleSupplierChange = (selectedOption) => {
  //   setSelectedSupplier(selectedOption);
  // };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/warehouse/active`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        if (res.data.success) {
          // const formatted = res.data.data.map((wh) => ({
          //   value: wh._id,
          //   label: wh.warehouseName, // ✅ direct warehouseName
          // }));
          // setOptionsWare(formatted);
          const formatted = res.data.data.map((wh) => ({
            value: wh._id,
            label: sanitizeInput(wh.warehouseName, true),
          }));
          setOptionsWare(formatted);
        }
      } catch (err) {
        console.error("Error fetching warehouses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const handleWarehouseChange = (selectedOption) => {
    setSelectedWarehouse(selectedOption);
  };

  const [optionsHsn, setOptionsHsn] = useState([]);
  const [selectedHSN, setSelectedHSN] = useState(null);
  const [showHSNModal, setShowHSNModal] = useState(false);

  useEffect(() => {
    const fetchHSN = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/hsn/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        if (res.data.success) {
          // const formatted = res.data.data.map((item) => ({
          //   value: item._id,
          //   label: `${item.hsnCode} - ${item.description || ""}`,
          // }));
          // setOptionsHsn(formatted);
          const formatted = res.data.data.map((item) => ({
            value: item._id,
            label: sanitizeInput(
              `${item.hsnCode} - ${item.description || ""}`,
              true
            ),
          }));
          setOptionsHsn(formatted);
        }
      } catch (err) {
        console.error("Error fetching HSN:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHSN();
  }, []);

  const handleHSNChange = (selectedOption) => {
    setSelectedHSN(selectedOption);
  };

  //variants----------------------------------------------------------------------------------------------------------------------------------------------

  // const [variants, setVariants] = useState([
  //   { variantName: '', variantValue: '' }, // Initial row
  // ]);

  // const handleVariantChange = (index, e) => {
  //   // const { name, value } = e.target;
  //   // setVariants((prev) =>
  //   //   prev.map((variant, i) =>
  //   //     i === index ? { ...variant, [name]: value } : variant
  //   //   )
  //   // );

  //   const { name, value } = e.target;
  //   const sanitizedValue = sanitizeInput(value, true);
  //   const error = name === "variantValue" ? validateField(name, sanitizedValue) : "";
  //   setFormErrors((prev) => ({ ...prev, [`variantValue_${index}`]: error }));
  //   setVariants((prev) =>
  //     prev.map((variant, i) =>
  //       i === index ? { ...variant, [name]: sanitizedValue } : variant
  //     )
  //   );
  // };

  // const handleAddVariant = () => {
  //   setVariants((prev) => [...prev, { variantName: '', variantValue: '' }]);
  // };

  // const handleRemoveVariant = (index) => {
  //   if (variants.length > 1) {
  //     setVariants((prev) => prev.filter((_, i) => i !== index));
  //   }
  // };

  const [variants, setVariants] = useState([
    { selectedVariant: "", selectedValue: "", valueDropdown: [] },
  ]);

  const [variantDropdown, setVariantDropdown] = useState([]);

  // Fetch all active variants for dropdown
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${BASE_URL}/api/variant-attributes/active-variants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVariantDropdown(data))
      .catch((err) => console.error("Error fetching variant dropdown:", err));
  }, []);

  // Handle variant change per row
  const handleVariantChange = (index, value) => {
    const token = localStorage.getItem("token");
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
            ...v,
            selectedVariant: value,
            selectedValue: "",
            valueDropdown: [],
          }
          : v
      )
    );

    if (!value || !token) return;

    fetch(
      `${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(value)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let values = [];
        data.forEach((val) => {
          if (typeof val === "string") {
            values.push(
              ...val
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            );
          }
        });
        setVariants((prev) =>
          prev.map((v, i) =>
            i === index ? { ...v, valueDropdown: values } : v
          )
        );
      })
      .catch((err) => console.error("Error fetching value dropdown:", err));
  };

  const handleValueChange = (index, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, selectedValue: value } : v))
    );
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { selectedVariant: "", selectedValue: "", valueDropdown: [] },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };
  //   const [selectedVariant, setSelectedVariant] = useState("");
  //   const [variantDropdown, setVariantDropdown] = useState([]);
  //   // const [selectedVariant, setSelectedVariant] = useState("");
  //   const [valueDropdown, setValueDropdown] = useState([]);
  //   const [selectedValue, setSelectedValue] = useState("");

  //  // Fetch all variants for dropdown (status true only)
  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     fetch(`${BASE_URL}/api/variant-attributes/active-variants`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //       .then(res => res.json())
  //       .then(data => setVariantDropdown(data))
  //       .catch(err => console.error("Error fetching variant dropdown:", err));
  //   }, []);

  //   // Fetch values for selected variant and split comma-separated values
  //   useEffect(() => {
  //     if (selectedVariant) {
  //       const token = localStorage.getItem("token");
  //       fetch(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(selectedVariant)}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //         .then(res => res.json())
  //         .then(data => {
  //           // If backend returns array of comma-separated strings, flatten them
  //           let values = [];
  //           data.forEach(val => {
  //             if (typeof val === 'string') {
  //               values.push(...val.split(',').map(v => v.trim()).filter(Boolean));
  //             }
  //           });
  //           setValueDropdown(values);
  //         })
  //         .catch(err => console.error("Error fetching value dropdown:", err));
  //     } else {
  //       setValueDropdown([]);
  //       setSelectedValue("");
  //     }
  //   }, [selectedVariant]);

  return (
    <div className="page-wrapper mt-2">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("createProduct")}</h4>
              <h6>{t("createNewProduct")}</h6>
              {/* <h4 className="fw-bold">Create Product</h4>
              <h6>Create new product</h6> */}
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Refresh"
                className="icon-btn"
                onClick={() => window.location.reload()}
              >
                <TbRefresh />
              </button>
            </li>
            {/* <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Collapse"
                id="collapse-header"
                className="icon-btn"
              >
                <TbChevronUp />
              </button>
            </li> */}
          </div>

          <div className="page-btn mt-0">
            <div className="d-flex gap-2">
              {/* <Link to="/product"></Link>{t("backToProduct")} */}
              <Link to={location.state?.from || "/product"}>
                <a className="btn btn-primary">Back to {location.state?.from == '/expired-products' ? "Expired Products" : location.state?.from == '/low-stocks' ? "Low Stocks" : "Product"}</a>
              </Link>
            </div>
          </div>
        </div>
        {/* <h5 className="mb-3">{steps[step]}</h5> */}

        <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
          {steps.map((label, index) => {
            const status = stepStatus[index];
            const isActive = index === step;
            const isComplete = status === "complete";
            const isIncomplete = status === "incomplete";

            return (
              <div key={index} className="step-wrapper">
                <div
                  className={`circle ${isComplete
                      ? "complete"
                      : isIncomplete
                        ? "incomplete"
                        : isActive
                          ? "active"
                          : ""
                    }`}
                >
                  {index + 1}
                </div>
                <div className="step-text">{label}</div>
                {index < steps.length - 1 && (
                  <div
                    className={`progress-line ${status === "complete"
                        ? "line-complete"
                        : status === "incomplete"
                          ? "line-incomplete"
                          : "line-pending"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-3 accordion-item border mb-4">
            {/* Step 0 - Basic Info */}
            {step === 0 && (
              <div className="accordion-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Item Type</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="itemType"
                        value="Good"
                        // checked={itemType === "Good"}
                        // onChange={() => setItemType("Good")}
                        checked={formData.itemType === "Good"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            itemType: e.target.value,
                          }))
                        }
                      />
                      <label className="form-check-label">Good</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="itemType"
                        value="Service"
                        checked={formData.itemType === "Service"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            itemType: e.target.value,
                          }))
                        }
                      />
                      <label className="form-check-label">Service</label>
                    </div>
                  </div>
                </div>
                {/* Conditional Fields */}
                {formData.itemType === "Good" ? (
                  <div className="row">
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("productName")}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        className="form-control"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder={t("enterProductName")}
                      />
                      {formErrors.productName && (
                        <div className="text-danger">
                          {formErrors.productName}
                        </div>
                      )}
                    </div>

                    {/* HSNCODE */}

                    <div className="col-sm-6 col-12 mb-3 d-flex align-items-end gap-2">
                      <div style={{ flex: 3, maxWidth: "100%", minWidth: 0 }}>
                        <label className="form-label">
                          {t("HSN")}
                          <span className="text-danger">*</span>
                        </label>
                        <div style={{ position: "relative", width: "100%" }}>
                          <Select
                            options={optionsHsn}
                            isLoading={loading}
                            value={selectedHSN}
                            isSearchable
                            placeholder="Select HSN..."
                            onChange={handleHSNChange}
                            styles={{
                              control: (base) => ({
                                ...base,
                                maxWidth: "100%",
                                minWidth: 0,
                                overflow: "hidden",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                              }),
                            }}
                          />
                        </div>
                        {formErrors.hsn && (
                          <div className="text-danger">{formErrors.hsn}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
                        onClick={() => setShowHSNModal(true)}
                        disabled={!selectedHSN}
                        style={{ height: "38px" }}
                      >
                        <TbEye size={18} />
                        {/* View */}
                      </button>
                    </div>

                    {/* HSN View Modal */}
                    {showHSNModal && selectedHSN && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          background: "rgba(0,0,0,0.3)",
                        }}
                        tabIndex="-1"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div
                            className="modal-content"
                            style={{
                              borderRadius: "12px",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                            }}
                          >
                            <div
                              className="modal-header bg-info text-white"
                              style={{
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                              }}
                            >
                              <h5 className="modal-title" style={{color:'white'}}>HSN Details</h5>
                              {/* <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowHSNModal(false)}
                              ></button> */}
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="fw-bold">HSN Code:</label>
                                <div className="fs-14 text-primary">
                                  {selectedHSN.label.split(" - ")[0]}
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="fw-bold">Description:</label>
                                <div className="fs-14 text-secondary">
                                  {selectedHSN.label.split(" - ")[1] || "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowHSNModal(false)}
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Slug */}
                    {/* <div className="col-sm-3 col-12 mb-3">
                      <label className="form-label">
                        {t("slug")}<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder={t("enterSlug")}
                      />
                    </div> */}

                    <div className="col-sm-6 col-12">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">
                          {t("sku")}
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          className="form-control"
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          placeholder={t("enterSKU")}
                        />
                        {/* <button type="submit" onClick={generateSKU} className="btn btn-primaryadd">
                          {t("generate")}
                        </button> */}
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="btn btn-primaryadd"
                        >
                          {t("generate")}
                        </button>
                        {formErrors.sku && (
                          <div className="text-danger">{formErrors.sku}</div>
                        )}
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("brandOrManufacture")}
                      </label>
                      <Select
                        options={brandOptions}
                        value={selectedBrands}
                        onChange={handleBrandChange}
                        isSearchable
                        placeholder={t("searchOrSelectBrands")}
                      />
                      {formErrors.brand && (
                        <div className="text-danger">{formErrors.brand}</div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-sm-6 col-12 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label">
                          {t("category")}
                          <span className="text-danger">*</span>
                        </label>
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#categoryModal"
                          onClick={() => {
                            setCategoryName("");
                            setCategorySlug("");
                          }}
                        >
                          <i
                            data-feather="plus-circle"
                            className="plus-down-add"
                          />
                          <span>{t("addNew")}</span>
                        </a>
                      </div>
                      <Select
                        options={categories}
                        value={selectedCategory}
                        onChange={(selected) => {
                          setSelectedCategory(selected);
                          setSelectedSubcategory(null);
                          setFormErrors((prev) => ({ ...prev, category: "" }));
                        }}
                        placeholder={t("searchOrSelectCategory")}
                      />
                      {formErrors.category && (
                        <div className="text-danger">{formErrors.category}</div>
                      )}
                    </div>

                    {/* Subcategory */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("subCategory")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={subcategories}
                        value={selectedsubCategory}
                        onChange={subCategoryChange}
                        placeholder={t("searchOrSelectSubcategory")}
                      />
                      {formErrors.subCategory && (
                        <div className="text-danger">
                          {formErrors.subCategory}
                        </div>
                      )}
                    </div>

                    {/* Supplier */}
                    {/* <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("supplier")}<span className="text-danger">*</span>
                      </label>
                     
                      <Select
                        options={options}
                        value={selectedSupplier}
                        onChange={handleSupplierChange}
                        placeholder="Choose a supplier..."
                        isClearable
                      />
                      {formErrors.supplier && <div className="text-danger">{formErrors.supplier}</div>}
                    </div> */}

                    {/* Store */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("store")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="store"
                        value={formData.store}
                        onChange={handleChange}
                      >
                        <option value="">{t("select")}</option>
                        <option value="India Mart">{t("indiaMart")}</option>
                        <option value="India Gadgets">
                          {t("indiaGadgets")}
                        </option>
                      </select>
                      {formErrors.store && (
                        <div className="text-danger">{formErrors.store}</div>
                      )}
                    </div>

                    {/* Warehouse */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("warehouseOrLocation")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={optionsware}
                        value={selectedWarehouse}
                        isLoading={loading}
                        isSearchable
                        placeholder="Select Warehouse..."
                        onChange={handleWarehouseChange}
                      />
                      {formErrors.warehouse && (
                        <div className="text-danger">
                          {formErrors.warehouse}
                        </div>
                      )}
                    </div>

                    {/* Advance Toggle */}
                    <div
                      className="d-flex align-items-center mb-4"
                      style={{ gap: "1rem" }}
                    >
                      <label
                        className="form-label fw-bold mb-0"
                        htmlFor="advanceSwitch"
                      >
                        {t("advance")}
                      </label>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="advanceSwitch"
                          // checked={isAdvanced}
                          // onChange={() => setIsAdvanced(!isAdvanced)}
                          checked={formData.isAdvanced}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isAdvanced: e.target.checked,
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Advanced Section */}
                    {formData.isAdvanced && (
                      <>
                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">{t("leadTime")}</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={t("enterLeadTime")}
                            name="leadTime"
                            value={formData.leadTime}
                            onChange={handleChange}
                          />
                          {formErrors.leadTime && (
                            <div className="text-danger">
                              {formErrors.leadTime}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("reorderLevel")}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={t("enterReorderLevel")}
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                          />
                          {formErrors.reorderLevel && (
                            <div className="text-danger">
                              {formErrors.reorderLevel}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("initialStock")}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={t("enterInitialStock")}
                            name="initialStock"
                            value={formData.initialStock}
                            onChange={handleChange}
                          />
                          {formErrors.initialStock && (
                            <div className="text-danger">
                              {formErrors.initialStock}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label fw-bold d-block mb-2">
                            Track Name
                          </label>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="serial"
                              id="serial"
                              checked={formData.trackType === "serial"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="serial"
                            >
                              Serial No
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="batch"
                              id="batch"
                              checked={formData.trackType === "batch"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label className="form-check-label" htmlFor="batch">
                              Batch No
                            </label>
                          </div>

                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="track"
                              value="status"
                              id="status"
                              checked={formData.trackType === "status"}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  trackType: e.target.value,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="status"
                            >
                              Status
                            </label>
                          </div>
                        </div>

                        {formData.trackType === "serial" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">
                              {t("serialNo")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enterSerialNumber")}
                              name="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleChange}
                            />
                            {formErrors.serialNumber && (
                              <div className="text-danger">
                                {formErrors.serialNumber}
                              </div>
                            )}
                          </div>
                        )}

                        {formData.trackType === "batch" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">{t("batchNo")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enterBatchNumber")}
                              name="batchNumber"
                              value={formData.batchNumber}
                              onChange={handleChange}
                            />
                            {formErrors.batchNumber && (
                              <div className="text-danger">
                                {formErrors.batchNumber}
                              </div>
                            )}
                          </div>
                        )}

                        {formData.trackType === "status" && (
                          <div className="form-check mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="returnable"
                              checked={formData.isReturnable}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  isReturnable: e.target.checked,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="returnable"
                            >
                              {t("returnable")}
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium">
                        {t("expireDate")}
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        placeholder={t("enterExpireDate")}
                      />
                      {formErrors.expirationDate && (
                        <div className="text-danger">
                          {formErrors.expirationDate}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        {t("brand")}
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder={t("enterBrand")}
                      />
                      {formErrors.brand && (
                        <div className="text-danger">{formErrors.brand}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 1 - Pricing */}
            {step === 1 && (
              <div className="row">
                {[
                  { label: t("purchasePrice"), name: "purchasePrice" },
                  { label: t("sellingPrice"), name: "sellingPrice" },
                  { label: t("wholesalePrice"), name: "wholesalePrice" },
                  { label: t("retailPrice"), name: "retailPrice" },
                ].map((field, idx) => (
                  <div key={idx} className=" col-sm-6 col-12 mb-3">
                    <label className="form-label">
                      {field.label}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={t(
                        `enter${field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)
                        }`
                      )}
                    />
                    {formErrors[field.name] && (
                      <div className="text-danger">
                        {formErrors[field.name]}
                      </div>
                    )}
                  </div>
                ))}

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantity")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t("enterQuantity")}
                  />
                  {formErrors.quantity && (
                    <div className="text-danger">{formErrors.quantity}</div>
                  )}
                </div>
                <div className="col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("unit")}
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={unitsOptions}
                    value={selectedUnits}
                    onChange={handleUnitChange}
                    isSearchable
                    placeholder={t("searchOrSelectUnits")}
                  />
                  {formErrors.unit && (
                    <div className="text-danger">{formErrors.unit}</div>
                  )}
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("taxType")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("exclusive")}</option>
                    <option>{t("inclusive")}</option>
                  </select>
                  {formErrors.taxType && (
                    <div className="text-danger">{formErrors.taxType}</div>
                  )}
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("taxRate")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option value="8">{t("igst8")}</option>
                    <option value="5">{t("gst5")}</option>
                    <option value="4">{t("sgst4")}</option>
                    <option value="16">{t("cgst16")}</option>
                    <option value="18">{t("gst18")}</option>
                  </select>
                  {formErrors.tax && (
                    <div className="text-danger">{formErrors.tax}</div>
                  )}
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountType")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("percentage")}</option>
                    <option>{t("fixed")}</option>
                  </select>
                  {formErrors.discountType && (
                    <div className="text-danger">{formErrors.discountType}</div>
                  )}
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountValue")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={t("enterDiscountValue")}
                  />
                  {formErrors.discountValue && (
                    <div className="text-danger">
                      {formErrors.discountValue}
                    </div>
                  )}
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantityAlert")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantityAlert"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                    placeholder={t("enterQuantityAlert")}
                  />
                  {formErrors.quantityAlert && (
                    <div className="text-danger">
                      {formErrors.quantityAlert}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 - Images and SEO */}
            {step === 2 && (
              <>
                {/* Image Upload Section */}
                <div
                  {...getRootProps({
                    className:
                      "dropzone p-4 text-center image-upload image-upload-two mb-3",
                  })}
                  style={{
                    cursor: "pointer",
                    transition: "0.3s ease",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <input {...getInputProps()} />
                  <MdImageSearch
                    style={{ fontSize: "50px", color: "#6c757d" }}
                  />
                  <p className="mt-2 mb-1 fw-semibold">
                    Drag & Drop your image here
                  </p>
                  {/* <small className="text-muted">Supports JPEG, PNG, JPG (Max 5MB)</small> */}
                  <p>Supports JPEG, PNG, JPG. Maximum size: 1MB.</p>
                  {/* {errors.images && (
                    <p className="text-danger fs-12">{errors.images}</p>
                  )} */}
                  {formErrors.images && (
                    <p className="text-danger fs-12">{formErrors.images}</p>
                  )}
                </div>

                {/* Preview Images Grid */}
                {images.length > 0 && (
                  <div className="row g-3 mb-4">
                    {images.map((file, i) => (
                      <div
                        className="col-6 col-sm-2 col-md-2"
                        key={i}
                        style={{ position: "relative" }}
                      >
                        <div
                          className="border rounded-3 shadow-sm overflow-hidden"
                          style={{
                            height: 100,
                            width: 100,
                            objectFit: "cover",
                            position: "relative",
                          }}
                        >
                          <img
                            src={file.preview}
                            alt={`preview-${i}`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImages((prev) => {
                                if (prev[i]?.preview)
                                  URL.revokeObjectURL(prev[i].preview);
                                return prev.filter((_, idx) => idx !== i);
                              });
                            }}
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              background: "rgba(255,255,255,0.85)",
                              border: "none",
                              borderRadius: "50%",
                              cursor: "pointer",
                              padding: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            }}
                            title="Delete image"
                          >
                            <TbTrash color="#d00" size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    {t("description")}
                  </label>
                  <textarea
                    name="description"
                    className="form-control rounded-3"
                    rows="3"
                    maxLength={300}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("enterDescription")}
                  />
                  {formErrors.description && (
                    <small className="text-danger">
                      {formErrors.description}
                    </small>
                  )}
                </div>

                {/* SEO Fields */}
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {t("seoMetaTitle")}
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      className="form-control rounded-3"
                      value={formData.seoTitle || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaTitle")}
                    />
                    {formErrors.seoTitle && (
                      <small className="text-danger">
                        {formErrors.seoTitle}
                      </small>
                    )}
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {t("seoMetaDescription")}
                    </label>
                    <input
                      type="text"
                      name="seoDescription"
                      className="form-control rounded-3"
                      value={formData.seoDescription || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaDescription")}
                    />
                    {formErrors.seoDescription && (
                      <small className="text-danger">
                        {formErrors.seoDescription}
                      </small>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3 - Variants */}
            {step === 3 && (
              <>
                {/* <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
                  {variantTabs.map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      className={`variant-tab btn btn-sm ${activeTab === tab
                        ? "btn-success"
                        : "btn-outline-secondary"
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="mb-3">
                  <label>{t("enterVariants", { tab: activeTab })}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.variants[activeTab]?.join(", ") || ""}
                    onChange={(e) => inputChange(activeTab, e.target.value)}
                    placeholder={t("enterVariantsPlaceholder", { tab: activeTab })}
                  />
                  {formErrors[activeTab] && <div className="text-danger">{formErrors[activeTab]}</div>}
                </div> */}

                {/* Variants */}
                {/* <div className="card mt-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Variant</label>
                <select
                  className="form-select"
                  value={selectedVariant}
                  onChange={e => setSelectedVariant(e.target.value)}
                >
                  <option value="">Select Variant</option>
                  {variantDropdown.map((variant, idx) => (
                    <option key={idx} value={variant}>{variant}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Value</label>
                <select
                  className="form-select"
                  value={selectedValue}
                  onChange={e => setSelectedValue(e.target.value)}
                  disabled={!selectedVariant}
                >
                  <option value="">Select Value</option>
                  {valueDropdown.map((value, idx) => (
                    <option key={idx} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="" onClick={handleAddVariant} style={{ border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#007BFF', padding: '6px' }}>
                    + Add another variants
                  </button>
          </div>
        </div> */}

                <div className="card mt-4">
                  <div className="card-body">
                    {variants.map((variant, index) => (
                      <div className="row mb-3" key={index}>
                        <div className="col-md-5">
                          <label className="form-label">Variant</label>
                          <select
                            className="form-select"
                            value={variant.selectedVariant}
                            onChange={(e) =>
                              handleVariantChange(index, e.target.value)
                            }
                          >
                            <option value="">Select Variant</option>
                            {variantDropdown.map((v, idx) => (
                              <option key={idx} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-5">
                          <label className="form-label">Value</label>
                          <select
                            className="form-select"
                            value={variant.selectedValue}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            disabled={!variant.selectedVariant}
                          >
                            <option value="">Select Value</option>
                            {variant.valueDropdown.map((val, idx) => (
                              <option key={idx} value={val}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                          {variants.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveVariant(index)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddVariant}
                    >
                      + Add another variant
                    </button>
                  </div>
                </div>

                {/* fina;l */}
                {/* <div className="">
                  <h3 className="" >Add Variants</h3>
                  <br />

                  {variants.map((variant, index) => (
                    <div className="" key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                      <div className="">
                        <label>Variant Name</label>
                        <br />
                        <input
                          type="text"
                          name="variantName"
                          placeholder=""
                          value={variant.variantName}
                          onChange={(e) => handleVariantChange(index, e)}
                          style={{ color: "#999797ff", backgroundColor: "white", border: '1px solid gray', borderRadius: '4px', width: '300px', padding: '8px' }}
                        />
                      </div>

                      <div className="">
                        <label>Variant Value</label>
                        <br />
                        <input
                          type="text"
                          name="variantValue"
                          placeholder=""
                          value={variant.variantValue}
                          onChange={(e) => handleVariantChange(index, e)}
                          style={{ color: "#999797ff", backgroundColor: "white", border: '1px solid gray', borderRadius: '4px', width: '300px', padding: '8px' }}
                        />
                        {formErrors[`variantValue_${index}`] && (
                          <div className="text-danger">{formErrors[`variantValue_${index}`]}</div>
                        )}
                      </div>

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Remove variant"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <br />
                  <button type="button" className="" onClick={handleAddVariant} style={{ border: 'none', borderRadius: '4px', backgroundColor: 'white', color: '#007BFF', padding: '6px' }}>
                    + Add another variants
                  </button>

                </div> */}
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mb-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handlePrev}
              disabled={step === 0}
            >
              {t("previous")}
            </button>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleSaveDraft}
              >
                {t("saveAsDraft")}
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (validateStep()) {
                      handleNext();
                    } else {
                      toast.error("Please complete all required fields");
                    }
                  }}
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => {
                    if (validateStep()) {
                      handleSubmit(e); // manually call submit
                    } else {
                      toast.error(
                        "Please complete all required fields before saving"
                      );
                    }
                  }}
                >
                  {t("save")}
                </button>
              )}
            </div>
          </div>
        </form>

        <CategoryModal
          modalId="add-category"
          title="Add Category"
          categoryName={categoryName}
          categorySlug={categorySlug}
          // onCategoryChange={(e) => setCategoryName(e.target.value)}
          onCategoryChange={(e) => {
            const value = e.target.value;
            setCategoryName(value);
            setFormErrors((prev) => ({
              ...prev,
              categoryName: validateField(
                "categoryName",
                sanitizeInput(value, true)
              ),
            }));
          }}
          // onSlugChange={(e) => setCategorySlug(e.target.value)}
          onSlugChange={(e) => {
            const value = e.target.value;
            setCategorySlug(value);
            setFormErrors((prev) => ({
              ...prev,
              categorySlug: validateField("categorySlug", sanitizeInput(value)),
            }));
          }}
          onSubmit={categorySubmit}
          submitLabel="Add Category"
        />
      </div>
    </div>
  );
};

export default ProductForm;
