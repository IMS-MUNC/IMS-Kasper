import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { TbChevronUp, TbEye, TbRefresh } from "react-icons/tb";
import Select from "react-select";
import { MdImageSearch } from "react-icons/md";
import sanitizeHtml from "sanitize-html";


// // Commented out: Regex patterns for validation
const regexPatterns = {
  productName: /^[a-zA-Z0-9\s\-_&()]{2,100}$/, // Alphanumeric, spaces, some special chars, 2-100 chars
  sku: /^[A-Z0-9\-]{5,20}$/, // Alphanumeric with hyphens, 5-20 chars
  price: /^\d+(\.\d{1,2})?$/, // Positive number with up to 2 decimal places
  // quantity: /^\d+$/, // Positive integer
   quantity: /^(?:[1-9]\d*)$/,
  discountValue: /^\d+(\.\d{1,2})?$/, // Positive number with up to 2 decimal places
  quantityAlert: /^\d+$/, // Positive integer
  leadTime: /^\d+$/, // Positive integer
  reorderLevel: /^\d+$/, // Positive integer
  initialStock: /^\d+$/, // Positive integer
  serialNumber: /^[a-zA-Z0-9\-]{1,50}$/, // Alphanumeric with hyphens, 1-50 chars
  batchNumber: /^[a-zA-Z0-9\-]{1,50}$/, // Alphanumeric with hyphens, 1-50 chars
  seoTitle: /^[a-zA-Z0-9\s\-_,.]{0,60}$/, // Alphanumeric, some special chars, up to 60 chars
  seoDescription: /^[a-zA-Z0-9\s\-_,.]{0,160}$/, // Alphanumeric, some special chars, up to 160 chars
  description: /^[\w\s.,!?-]{0,300}$/, // Alphanumeric, some punctuation, up to 300 chars
};

// // Commented out: Sanitization options for sanitize-html
const sanitizeOptions = {
  allowedTags: ["b", "i", "em", "strong", "a", "p", "br"],
  allowedAttributes: {
    a: ["href"],
  },
};

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();



  // Declare steps and variantTabs before useState calls
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
  // Now safe to use steps in useState
  const [step, setStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(
    Array(steps.length).fill("pending")
  );
  const [activeTab, setActiveTab] = useState("Color");
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    brand: "",
    category: "",
    subCategory: "",
    // supplier: "",
    // itemBarcode: "",
    store: "",
    warehouse: "",
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
    variants: {},
    sellingType: "",
    // barcodeSymbology: "",
    productType: "Single",
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
    hsn: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  // Dropdown states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedsubCategory, setSelectedsubCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(null);
  const [selectedUnits, setSelectedUnits] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsware, setOptionsWare] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [optionsHsn, setOptionsHsn] = useState([]);
  const [selectedHSN, setSelectedHSN] = useState(null);
  const [showHSNModal, setShowHSNModal] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);

  //    const [variants, setVariants] = useState([
  //   { selectedVariant: "", selectedValue: "", valueDropdown: [] },
  // ]);

  const [variants, setVariants] = useState([
    { selectedVariant: "", selectedValue: [], valueDropdown: [] },
  ]);

  const [variantDropdown, setVariantDropdown] = useState([]);



  // Image state
  const [images, setImages] = useState([]);

  // Add useDropzone for image upload
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
        invalidFiles.push({ file, error: `Invalid file type for ${file.name}. Only JPEG, PNG, or JPG allowed.` });
      } else if (file.size > maxSize) {
        invalidFiles.push({ file, error: `Image ${file.name} exceeds 1MB limit.` });
      } else {
        validFiles.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ error }) => toast.error(error));
      setErrors((prev) => ({ ...prev, images: "Image size should not exceeded 1MB." }));
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data;
        const sanitizedData = {
          ...data,
          productName: sanitizeHtml(data.productName || "", sanitizeOptions),
          sku: sanitizeHtml(data.sku || "", sanitizeOptions),
          description: sanitizeHtml(data.description || "", sanitizeOptions),
          seoTitle: sanitizeHtml(data.seoTitle || "", sanitizeOptions),
          seoDescription: sanitizeHtml(
            data.seoDescription || "",
            sanitizeOptions
          ),
          serialNumber: sanitizeHtml(data.serialNumber || "", sanitizeOptions),
          batchNumber: sanitizeHtml(data.batchNumber || "", sanitizeOptions),
          // itemBarcode: sanitizeHtml(data.itemBarcode || "", sanitizeOptions),
          store: sanitizeHtml(data.store || "", sanitizeOptions),
        };
        setFormData(sanitizedData);
        setFormData({ ...formData, ...data });
        // if (data.brand)  setSelectedBrands({ value: data.brand._id || data.brand, label: data.brand.brandName || data.brand });
        if (data.brand) {
          setBrandId(data.brand._id || data.brand);
        }

        if (data.subcategory) {
          setSubCategoryId(data.subcategory._id || data.subcategory);
        }
        if (data.category) {
          setCategoryId(data.category._id || data.category);
        }

        if (data.unit) setSelectedUnits({ value: data.unit, label: data.unit });
        // if (data.supplier) setSelectedSupplier({ value: data.supplier._id || data.supplier, label: data.supplier.firstName ? `${data.supplier.firstName}${data.supplier.lastName} (${data.supplier.supplierCode})` : data.supplier });
        if (data.supplier) {
          setSupplierId(data.supplier._id || data.supplier);
        }

        // if (data.warehouse) setSelectedWarehouse({ value: data.warehouse._id || data.warehouse, label: data.warehouse.warehouseName || data.warehouse });
        if (data.warehouse) {
          setWarehouseId(data.warehouse._id || data.warehouse);
        }
        if (data.hsn) {
          const hsnOption = optionsHsn.find(
            (opt) => opt.value === (data.hsn._id || data.hsn)
          );
          if (hsnOption) setSelectedHSN(hsnOption);
        }



        // --- VARIANTS PATCH ---
        if (data.variants && typeof data.variants === "object" && Object.keys(data.variants).length > 0) {
          const token = localStorage.getItem("token");
          Promise.all(
            Object.entries(data.variants).map(async ([variantName, values]) => {
              // Fetch valueDropdown for this variant
              let valueDropdown = [];
              try {
                const res = await fetch(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(variantName)}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                valueDropdown = Array.isArray(data)
                  ? data.flatMap(val => typeof val === 'string' ? val.split(',').map(v => v.trim()).filter(Boolean) : [])
                  : [];
              } catch (err) { }
              return {
                selectedVariant: variantName,
                selectedValue: Array.isArray(values) ? values : [values],
                valueDropdown,
              };
            })
          ).then(variantArr => setVariants(variantArr));
        } else {
          setVariants([{ selectedVariant: "", selectedValue: [], valueDropdown: [] }]);
        }

        if (data.images && data.images.length > 0) {
          const existingImages = data.images.map((img) => ({
            preview: img.url, // Dropzone expects `preview`
            url: img.url, // Keep original URL if you need
            public_id: img.public_id,
          }));
          setImages(existingImages);
        }

        // if (data.hsnCode) setSelectedHSN({ value: data.hsnCode._id || data.hsnCode, label: data.hsnCode.hsnCode ? `${data.hsnCode.hsnCode} - ${data.hsnCode.description || ''}` : data.hsnCode });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch product");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, optionsHsn]);

  // ✅ Fetch all active variants for dropdown
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${BASE_URL}/api/variant-attributes/active-variants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setVariantDropdown(data))
      .catch(err => console.error("Error fetching variant dropdown:", err));
  }, [BASE_URL]);

  // ✅ Handle variant change per row
  // const handleVariantChange = (index, value) => {
  //   const token = localStorage.getItem("token");

  //   // reset valueDropdown when variant changes
  //   setVariants(prev =>
  //     prev.map((v, i) =>
  //       i === index
  //         ? { ...v, selectedVariant: value, selectedValue: [], valueDropdown: [] }
  //         : v
  //     )
  //   );

  //   if (!value || !token) return;

  //   fetch(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(value)}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       let values = [];
  //       data.forEach(val => {
  //         if (typeof val === "string") {
  //           values.push(...val.split(",").map(v => v.trim()).filter(Boolean));
  //         }
  //       });

  //       setVariants(prev =>
  //         prev.map((v, i) =>
  //           i === index ? { ...v, valueDropdown: values } : v
  //         )
  //       );
  //     })
  //     .catch(err => console.error("Error fetching value dropdown:", err));
  // };

  // ✅ Handle value change
  // const handleValueChange = (index, selectedValues) => {
  //   setVariants(prev =>
  //     prev.map((v, i) =>
  //       i === index ? { ...v, selectedValue: selectedValues } : v
  //     )
  //   );
  // };


  // Fetch dropdown options (categories, brands, units, suppliers, warehouses, HSN)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/category/categories`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        const options = res.data.map((category) => ({
          value: category._id,
          label: sanitizeHtml(category.categoryName, sanitizeOptions),
          // label: category.categoryName,
        }));
        setCategories(options);
      } catch (error) { }
    };
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/brands/active-brands`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const options = res.data.brands.map((brand) => ({
          value: brand._id,
          label: sanitizeHtml(brand.brandName, sanitizeOptions), // Commented out: Sanitization
          // label: brand.brandName,
          // label: brand.brandName,
        }));
        setBrandOptions(options);
      } catch (error) { }
    };
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/unit/units/status/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ token sent properly
            },
          }
        );
        const options = res.data.units.map((unit) => ({
          value: unit.shortName,
          label: sanitizeHtml(
            `${unit.unitsName} (${unit.shortName})`,
            sanitizeOptions
          ), // Commented out: Sanitization
          // label: `${unit.unitsName} (${unit.shortName})`,
        }));
        setUnitsOptions(options);
      } catch (error) { }
    };

    // const fetchSuppliers = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     const res = await axios.get(`${BASE_URL}/api/suppliers/active`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // ✅ token sent properly
    //       },
    //     });
    //     const options = res.data.suppliers.map((supplier) => ({
    //       value: supplier._id,
    //       label: sanitizeHtml(
    //         `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
    //         sanitizeOptions
    //       ), // Commented out: Sanitization
    //       // label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})`,
    //     }));
    //     setOptions(options);
    //   } catch (error) {}
    // };


    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/warehouse/active`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        if (res.data.success) {
          const options = res.data.data.map((wh) => ({
            value: wh._id,
            label: sanitizeHtml(wh.warehouseName, sanitizeOptions),
            // label: wh.warehouseName,
          }));
          setOptionsWare(options);
        }
      } catch (error) { }
    };
    const fetchHSN = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/hsn/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });
        console.log("hsnd", res.data.data);
        if (res.data.success) {
          const options = res.data.data.map((item) => ({
            value: item._id,
            label: sanitizeHtml(
              `${item.hsnCode} - ${item.description || ""}`,
              sanitizeOptions
            ),
            // label: `${item.hsnCode} - ${item.description || ""}`,
          }));
          setOptionsHsn(options);
        }
      } catch (error) { }
    };

    fetchCategories();
    fetchBrands();
    fetchUnits();
    // fetchSuppliers();
    fetchWarehouses();
    fetchHSN();
  }, []);

  useEffect(() => {
    if (brandOptions.length > 0 && brandId) {
      const found = brandOptions.find((opt) => opt.value === brandId);
      if (found) {
        setSelectedBrands(found);
      }
    }
  }, [brandOptions, brandId]);

  // category
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const foundCat = categories.find((opt) => opt.value === categoryId);
      if (foundCat) {
        setSelectedCategory(foundCat);
        console.log("⚡ Fetching subcategories for:", foundCat.value);
        // Fetch subcategories for this category
        fetchSubcategoriesByCategory(foundCat.value);
      }
    }
  }, [categoryId, categories]);

  // Subcategory fetch logic
  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/api/subcategory/by-category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        }
      );
      console.log("sbcategryfd", res.data);
      const options = res.data.map((subcat) => ({
        value: subcat._id,
        label: sanitizeHtml(subcat.subCategoryName, sanitizeOptions),
        label: subcat.subCategoryName,
      }));
      setSubcategories(options);
    } catch (error) {
      setSubcategories([]);
    }
  };

  // ✅ Effect: once subcategories + subCategoryId are both ready → preselect
  useEffect(() => {
    if (subCategoryId && subcategories.length > 0) {
      const found = subcategories.find((opt) => opt.value === subCategoryId);
      if (found) {
        setSelectedsubCategory(found);
        console.log("✅ Preselected subcategory:", found);
      }
    }
  }, [subCategoryId, subcategories]);

  //supplier
  useEffect(() => {
    if (supplierId && options.length > 0) {
      const found = options.find((opt) => opt.value === supplierId);
      if (found) {
        setSelectedSupplier(found);
      }
    }
  }, [supplierId, options]);

  useEffect(() => {
    if (warehouseId && optionsware.length > 0) {
      const found = optionsware.find((opt) => opt.value === warehouseId);
      if (found) setSelectedWarehouse(found);
    }
  }, [warehouseId, optionsware]);

  useEffect(() => {
    if (optionsHsn.length > 0 && formData.hsn) {
      const hsnValue =
        typeof formData.hsn === "object" ? formData.hsn._id : formData.hsn;
      const found = optionsHsn.find((opt) => opt.value === hsnValue);
      if (found) setSelectedHSN(found);
    }
  }, [optionsHsn, formData.hsn]);

  // Handlers for dropdowns
  const handleBrandChange = (selectedOption) =>
    setSelectedBrands(selectedOption);
  const handleUnitChange = (selectedOption) => setSelectedUnits(selectedOption);
  // const handleSupplierChange = (selectedOption) =>
  //   setSelectedSupplier(selectedOption);
  const handleWarehouseChange = (selectedOption) =>
    setSelectedWarehouse(selectedOption);
  const handleHSNChange = (selectedOption) => setSelectedHSN(selectedOption);
  const subCategoryChange = (selectedOption) =>
    setSelectedsubCategory(selectedOption);

  const validateInput = (name, value) => {
    if (regexPatterns[name]) {
      return regexPatterns[name].test(value) ? "" : `Invalid ${name}`;
    }
    return "";
  };
  // Generic input change
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //    const sanitizedValue = type !== "checkbox" ? sanitizeHtml(value, sanitizeOptions) : value; // Commented out: Sanitization
  //   const error = type !== "checkbox" ? validateInput(name, sanitizedValue) : ""; // Commented out: Validation
  //   setErrors((prev) => ({ ...prev, [name]: error })); // Commented out: Error state update

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : sanitizedValue,
  //   }));
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue =
      type !== "checkbox" ? sanitizeHtml(value, sanitizeOptions) : value;
    const error =
      type !== "checkbox" ? validateInput(name, sanitizedValue) : "";
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : sanitizedValue,
    }));
  };

  // Variant input change (for step 3)
  // const inputChange = (key, value) => {
  //   const sanitizedValue = sanitizeHtml(value, sanitizeOptions);
  //   if (step === 3) {
  //     // const parsedValues = value.split(",").map((v) => v.trim());
  //     // setFormData((prev) => ({
  //     //   ...prev,
  //     //   variants: { ...prev.variants, [key]: parsedValues },
  //     // }));
  //      const parsedValues = value // Reverted to original value
  //       .split(",")
  //       .map((v) => v.trim())
  //       .filter((v) => v); // Remove empty values
  //     setFormData((prev) => ({
  //       ...prev,
  //       variants: { ...prev.variants, [key]: parsedValues },
  //     }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [key]: value }));
  //   }
  // };

  const inputChange = (key, value) => {
    const sanitizedValue = sanitizeHtml(value, sanitizeOptions);
    if (step === 3) {
      const parsedValues = sanitizedValue
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      setFormData((prev) => ({
        ...prev,
        variants: { ...prev.variants, [key]: parsedValues },
      }));
    } else {
      const error = validateInput(key, sanitizedValue);
      setErrors((prev) => ({ ...prev, [key]: error }));
      setFormData((prev) => ({ ...prev, [key]: sanitizedValue }));
    }
  };
  // Step validation logic
  // const validateStep = () => {
  //   if (step === 0) {
  //     return (
  //       formData.productName &&
  //       !errors.productName &&
  //       formData.sku &&
  //       !errors.sku &&
  //       selectedCategory &&
  //       selectedsubCategory &&
  //       // selectedSupplier &&
  //       selectedWarehouse &&
  //       selectedHSN &&
  //       // formData.itemBarcode &&
  //       formData.store &&
  //       (!formData.isAdvanced ||
  //         (formData.leadTime &&
  //           !errors.leadTime &&
  //           formData.reorderLevel &&
  //           !errors.reorderLevel &&
  //           formData.initialStock &&
  //           !errors.initialStock &&
  //           ((formData.trackType === "serial" &&
  //             formData.serialNumber &&
  //             !errors.serialNumber) ||
  //             (formData.trackType === "batch" &&
  //               formData.batchNumber &&
  //               !errors.batchNumber) ||
  //             formData.trackType === "status")))
  //     );
  //   }
  //   if (step === 1) {
  //     return (
  //       formData.purchasePrice &&
  //       !errors.purchasePrice &&
  //       formData.sellingPrice &&
  //       !errors.sellingPrice &&
  //       formData.quantity &&
  //       !errors.quantity &&
  //       selectedUnits &&
  //       formData.taxType &&
  //       formData.tax &&
  //       formData.discountType &&
  //       // formData.discountValue &&
  //       // !errors.discountValue &&
  //       (formData.discountValue !== undefined && formData.discountValue !== "") &&
  //       !errors.discountValue &&
  //       formData.quantityAlert &&
  //       !errors.quantityAlert
  //     );
  //   }
  //   if (step === 2) {
  //     return (
  //       formData.description &&
  //       !errors.description &&
  //       (!formData.seoTitle || !errors.seoTitle) &&
  //       (!formData.seoDescription || !errors.seoDescription)
  //     );
  //   }
  //   if (step === 3) {
  //     // return formData.variants[activeTab]?.length > 0;
  //     return (
  //       formData.variants &&
  //       Object.keys(formData.variants).length > 0 &&
  //       Object.values(formData.variants).every(
  //         (vals) => Array.isArray(vals) && vals.length > 0
  //       )
  //     );
  //   }
  //   return true;
  // };

const validateStep = () => {
  const newErrors = {};

  if (step === 0) {
    if (!formData.productName) newErrors.productName = "Product Name is required";
    if (formData.productName && !regexPatterns.productName.test(formData.productName)) newErrors.productName = "Invalid Product Name";
    if (!formData.sku) newErrors.sku = "SKU is required";
    if (formData.sku && !regexPatterns.sku.test(formData.sku)) newErrors.sku = "Invalid SKU";
    if (!selectedCategory) newErrors.category = "Category is required";
    if (!selectedsubCategory) newErrors.subCategory = "Subcategory is required";
    if (!selectedWarehouse) newErrors.warehouse = "Warehouse is required";
    if (!selectedHSN) newErrors.hsn = "HSN Code is required";
    if (!formData.store) newErrors.store = "Store is required";
    if (formData.isAdvanced) {
      if (!formData.leadTime) newErrors.leadTime = "Lead Time is required";
      if (formData.leadTime && !regexPatterns.leadTime.test(formData.leadTime)) newErrors.leadTime = "Invalid Lead Time";
      if (!formData.reorderLevel) newErrors.reorderLevel = "Reorder Level is required";
      if (formData.reorderLevel && !regexPatterns.reorderLevel.test(formData.reorderLevel)) newErrors.reorderLevel = "Invalid Reorder Level";
      if (!formData.initialStock) newErrors.initialStock = "Initial Stock is required";
      if (formData.initialStock && !regexPatterns.initialStock.test(formData.initialStock)) newErrors.initialStock = "Invalid Initial Stock";
      if (formData.trackType === "serial" && !formData.serialNumber)
        newErrors.serialNumber = "Serial Number is required";
      if (formData.serialNumber && !regexPatterns.serialNumber.test(formData.serialNumber)) newErrors.serialNumber = "Invalid Serial Number";
      if (formData.trackType === "batch" && !formData.batchNumber)
        newErrors.batchNumber = "Batch Number is required";
      if (formData.batchNumber && !regexPatterns.batchNumber.test(formData.batchNumber)) newErrors.batchNumber = "Invalid Batch Number";
    }
  }

  if (step === 1) {
    if (!formData.purchasePrice) newErrors.purchasePrice = "Purchase Price is required";
    if (formData.purchasePrice && !regexPatterns.price.test(formData.purchasePrice)) newErrors.purchasePrice = "Purchase Price must be a positive number with up to 2 decimal places";
    if (!formData.sellingPrice) newErrors.sellingPrice = "Selling Price is required";
    if (formData.sellingPrice && !regexPatterns.price.test(formData.sellingPrice)) newErrors.sellingPrice = "Selling Price must be a positive number with up to 2 decimal places";
    // NEW: Validation for wholesalePrice
    if (!formData.wholesalePrice) newErrors.wholesalePrice = "Wholesale Price is required";
    if (formData.wholesalePrice && !regexPatterns.price.test(formData.wholesalePrice)) newErrors.wholesalePrice = "Wholesale Price must be a positive number with up to 2 decimal places";
    // NEW: Validation for retailPrice
    if (!formData.retailPrice) newErrors.retailPrice = "Retail Price is required";
    if (formData.retailPrice && !regexPatterns.price.test(formData.retailPrice)) newErrors.retailPrice = "Retail Price must be a positive number with up to 2 decimal places";
    if (!formData.quantity) newErrors.quantity = "Quantity must be at least 1";
    if (formData.quantity && !regexPatterns.quantity.test(formData.quantity)) newErrors.quantity = "Quantity must be a positive integer";
    if (!selectedUnits) newErrors.unit = "Unit is required";
    if (!formData.taxType) newErrors.taxType = "Tax Type is required";
    if (!formData.tax) newErrors.tax = "Tax Rate is required";
    if (!formData.discountType) newErrors.discountType = "Discount Type is required";
    if (formData.discountValue === undefined || formData.discountValue === "") newErrors.discountValue = "Discount Value is required";
    if (formData.discountValue && !regexPatterns.discountValue.test(formData.discountValue)) newErrors.discountValue = "Discount Value must be a positive number with up to 2 decimal places";
    if (!formData.quantityAlert) newErrors.quantityAlert = "Quantity Alert is required";
    if (formData.quantityAlert && !regexPatterns.quantityAlert.test(formData.quantityAlert)) newErrors.quantityAlert = "Quantity Alert must be a positive integer";
  }

  if (step === 2) {
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.description && !regexPatterns.description.test(formData.description)) newErrors.description = "Invalid Description";
    if (formData.seoTitle && !regexPatterns.seoTitle.test(formData.seoTitle)) newErrors.seoTitle = "Invalid SEO Title";
    if (formData.seoDescription && !regexPatterns.seoDescription.test(formData.seoDescription)) newErrors.seoDescription = "Invalid SEO Description";
  }

  if (step === 3) {
    if (
      !formData.variants ||
      Object.keys(formData.variants).length === 0 ||
      !Object.values(formData.variants).every(
        (vals) => Array.isArray(vals) && vals.length > 0
      )
    ) {
      newErrors.variants = "At least one variant with a valid value is required";
    }
  }

  // NEW: Update errors state with validation results
  setErrors(newErrors);
  return Object.values(newErrors).filter(Boolean); // Return array of error messages for toast notifications
};

  // Step navigation logic
  // const handleNext = () => {
  //   const isValid = validateStep();
  //   const updatedStatus = [...stepStatus];
  //   updatedStatus[step] = isValid ? "complete" : "incomplete";
  //   setStepStatus(updatedStatus);
  //   if (isValid && step < steps.length - 1) {
  //     setStep((prev) => prev + 1);
  //   } else if (!isValid) {
  //     // Commented out: Error toast for validation
  //     toast.error("Please correct the errors in the form");
  //   }
  // };

  const handleNext = () => {
  const validationErrors = validateStep();
  const updatedStatus = [...stepStatus];
  updatedStatus[step] = validationErrors.length === 0 ? "complete" : "incomplete";
  setStepStatus(updatedStatus);

  if (validationErrors.length === 0 && step < steps.length - 1) {
    setStep((prev) => prev + 1);
  } else if (validationErrors.length > 0) {
    // Display all error messages
    validationErrors.forEach((error) => toast.error(error));
  }
};

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSaveDraft = () => {
    toast.info("Saved as draft!");
  };

  // SKU generator
  // const generateSKU = () => {
  //   const category = formData.category || "GEN";
  //   const name = formData.productName || "PRD";
  //   const randomNum = Math.floor(Math.random() * 9000) + 1000;
  //   const sku = `${category.toUpperCase().slice(0, 3)}-${name
  //     .toUpperCase()
  //     .slice(0, 3)}-${randomNum}`;
  //     const sanitizedSKU = sanitizeHtml(sku, sanitizeOptions); // Commented out: Sanitization
  //   const error = validateInput("sku", sanitizedSKU); // Commented out: Validation
  //   setErrors((prev) => ({ ...prev, sku: error })); //
  //   setFormData((prevProduct) => ({
  //     ...prevProduct,
  //     sku,
  //   }));
  // };
  const generateSKU = () => {
    const category = formData.category || "GEN";
    const name = formData.productName || "PRD";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const sku = `${category.toUpperCase().slice(0, 3)}-${name
      .toUpperCase()
      .slice(0, 3)}-${randomNum}`;
    const sanitizedSKU = sanitizeHtml(sku, sanitizeOptions);
    const error = validateInput("sku", sanitizedSKU);
    setErrors((prev) => ({ ...prev, sku: error }));
    setFormData((prev) => ({ ...prev, sku: sanitizedSKU }));
  };

  // // Barcode generator
  // const generateBarcode = () => {
  //   const prefix = "BR";
  //   const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
  //   return `${prefix}${randomNumber}`;
  // };

  // Submit handler
  // const handleSubmit = async (e) => {
  //   // console.log("SUBMIT: selectedBrands", selectedBrands);
  //   // console.log("SUBMIT: selectedCategory", selectedCategory);
  //   // console.log("SUBMIT: selectedsubCategory", selectedsubCategory);
  //   // console.log("SUBMIT: selectedSupplier", selectedSupplier);
  //   // console.log("SUBMIT: selectedWarehouse", selectedWarehouse);
  //   // console.log("SUBMIT: selectedUnits", selectedUnits);
  //   // console.log("SUBMIT: selectedHSN", selectedHSN);
  //   // console.log(
  //   //   "SUBMIT: subcategory value sent:",
  //   //   selectedsubCategory?.value || ""
  //   // );
  //   e.preventDefault();
  //   if (!validateStep()) {
  //     // Commented out: Validation check
  //     toast.error("Please correct the errors before submitting");
  //     return;
  //   }
  //   const formPayload = new FormData();
  //   // Only append fields that have changed (non-empty or non-null)
  //   if (formData.productName)
  //     formPayload.append("productName", formData.productName);
  //   if (formData.sku) formPayload.append("sku", formData.sku);
  //   formPayload.append("brand", selectedBrands?.value || "");
  //   formPayload.append("category", selectedCategory?.value || "");
  //   formPayload.append("subcategory", selectedsubCategory?.value || "");
  //   // formPayload.append("supplier", selectedSupplier?.value || "");
  //   // if (formData.itemBarcode)
  //   //   formPayload.append("itemBarcode", formData.itemBarcode);
  //   if (formData.store) formPayload.append("store", formData.store);
  //   formPayload.append("warehouse", selectedWarehouse?.value || "");
  //   if (formData.purchasePrice)
  //     formPayload.append("purchasePrice", formData.purchasePrice);
  //   if (formData.sellingPrice)
  //     formPayload.append("sellingPrice", formData.sellingPrice);
  //   if (formData.wholesalePrice)
  //     formPayload.append("wholesalePrice", formData.wholesalePrice);
  //   if (formData.retailPrice)
  //     formPayload.append("retailPrice", formData.retailPrice);
  //   if (formData.quantity) formPayload.append("quantity", formData.quantity);
  //   formPayload.append("unit", selectedUnits?.value || "");
  //   if (formData.taxType) formPayload.append("taxType", formData.taxType);
  //   if (formData.tax)
  //     formPayload.append(
  //       "tax",
  //       parseFloat(formData.tax.replace(/\D/g, "")) || 0
  //     );
  //   if (formData.discountType)
  //     formPayload.append("discountType", formData.discountType);
  //   if (formData.discountValue)
  //     formPayload.append("discountValue", formData.discountValue);
  //   if (formData.quantityAlert)
  //     formPayload.append("quantityAlert", formData.quantityAlert);
  //   if (formData.description)
  //     formPayload.append("description", formData.description);
  //   if (formData.seoTitle) formPayload.append("seoTitle", formData.seoTitle);
  //   if (formData.seoDescription)
  //     formPayload.append("seoDescription", formData.seoDescription);
  //   if (formData.itemType) formPayload.append("itemType", formData.itemType);
  //   if (formData.isAdvanced)
  //     formPayload.append("isAdvanced", formData.isAdvanced ? true : false);
  //   if (formData.trackType) formPayload.append("trackType", formData.trackType);
  //   if (formData.isReturnable)
  //     formPayload.append("isReturnable", formData.isReturnable ? true : false);
  //   if (formData.leadTime) formPayload.append("leadTime", formData.leadTime);
  //   if (formData.reorderLevel)
  //     formPayload.append("reorderLevel", formData.reorderLevel);
  //   if (formData.initialStock)
  //     formPayload.append("initialStock", formData.initialStock);
  //   if (formData.serialNumber)
  //     formPayload.append("serialNumber", formData.serialNumber);
  //   if (formData.batchNumber)
  //     formPayload.append("batchNumber", formData.batchNumber);
  //   if (formData.returnable)
  //     formPayload.append("returnable", formData.returnable ? true : false);
  //   if (formData.expirationDate)
  //     formPayload.append("expirationDate", formData.expirationDate);
  //   formPayload.append("hsn", selectedHSN?.value || "");

  //   // if (formData.variants && Object.keys(formData.variants).length > 0)
  //   //   formPayload.append("variants", JSON.stringify(formData.variants));
  //   if (formData.variants && Object.keys(formData.variants).length > 0)
  //     formPayload.append("variants", JSON.stringify(formData.variants));
  //   // append new images only
  //   images.forEach((imgFile) => {
  //     if (imgFile instanceof File) {
  //       // only new uploads
  //       formPayload.append("images", imgFile);
  //     }
  //   });

  //   // append existing images as URLs
  //   const existingImageUrls = images
  //     .filter((img) => !(img instanceof File))
  //     .map((img) => img.url); // only URL

  //   formPayload.append("existingImages", JSON.stringify(existingImageUrls));
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     toast.success("Product updated successfully!");
  //     const returnPath = location.state?.from || '/product';
  //     navigate(returnPath);
  //   } catch (err) {
  //     console.log(err.response?.data);
  //     toast.error("Failed to update product");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateStep();

  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => toast.error(error));
    return;
  }

  const formPayload = new FormData();
  // Append fields as before
  if (formData.productName) formPayload.append("productName", formData.productName);
  if (formData.sku) formPayload.append("sku", formData.sku);
  formPayload.append("brand", selectedBrands?.value || "");
  formPayload.append("category", selectedCategory?.value || "");
  formPayload.append("subcategory", selectedsubCategory?.value || "");
  // formPayload.append("supplier", selectedSupplier?.value || "");
  if (formData.store) formPayload.append("store", formData.store);
  formPayload.append("warehouse", selectedWarehouse?.value || "");
  if (formData.purchasePrice) formPayload.append("purchasePrice", formData.purchasePrice);
  if (formData.sellingPrice) formPayload.append("sellingPrice", formData.sellingPrice);
  if (formData.wholesalePrice) formPayload.append("wholesalePrice", formData.wholesalePrice);
  if (formData.retailPrice) formPayload.append("retailPrice", formData.retailPrice);
  if (formData.quantity) formPayload.append("quantity", formData.quantity);
  formPayload.append("unit", selectedUnits?.value || "");
  if (formData.taxType) formPayload.append("taxType", formData.taxType);
  if (formData.tax) formPayload.append("tax", parseFloat(formData.tax.replace(/\D/g, "")) || 0);
  if (formData.discountType) formPayload.append("discountType", formData.discountType);
  if (formData.discountValue) formPayload.append("discountValue", formData.discountValue);
  if (formData.quantityAlert) formPayload.append("quantityAlert", formData.quantityAlert);
  if (formData.description) formPayload.append("description", formData.description);
  if (formData.seoTitle) formPayload.append("seoTitle", formData.seoTitle);
  if (formData.seoDescription) formPayload.append("seoDescription", formData.seoDescription);
  if (formData.itemType) formPayload.append("itemType", formData.itemType);
  if (formData.isAdvanced) formPayload.append("isAdvanced", formData.isAdvanced ? true : false);
  if (formData.trackType) formPayload.append("trackType", formData.trackType);
  if (formData.isReturnable) formPayload.append("isReturnable", formData.isReturnable ? true : false);
  if (formData.leadTime) formPayload.append("leadTime", formData.leadTime);
  if (formData.reorderLevel) formPayload.append("reorderLevel", formData.reorderLevel);
  if (formData.initialStock) formPayload.append("initialStock", formData.initialStock);
  if (formData.serialNumber) formPayload.append("serialNumber", formData.serialNumber);
  if (formData.batchNumber) formPayload.append("batchNumber", formData.batchNumber);
  if (formData.returnable) formPayload.append("returnable", formData.returnable ? true : false);
  if (formData.expirationDate) formPayload.append("expirationDate", formData.expirationDate);
  formPayload.append("hsn", selectedHSN?.value || "");

  if (formData.variants && Object.keys(formData.variants).length > 0)
    formPayload.append("variants", JSON.stringify(formData.variants));

  images.forEach((imgFile) => {
    if (imgFile instanceof File) {
      formPayload.append("images", imgFile);
    }
  });

  const existingImageUrls = images
    .filter((img) => !(img instanceof File))
    .map((img) => img.url);
  formPayload.append("existingImages", JSON.stringify(existingImageUrls));

  try {
    const token = localStorage.getItem("token");
    await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Product updated successfully!");
    const returnPath = location.state?.from || '/product';
    navigate(returnPath);
  } catch (err) {
    console.log(err.response?.data);
    toast.error("Failed to update product");
  }
};

  // remove image
  const handleRemoveImage = async (file) => {
    if (file.public_id) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/api/products/${productId}/images`,
          {
            
            data: { public_id: file.public_id },
          }
        );
        setImages(res.data.images);
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    } else {
      setImages((prev) => prev.filter((f) => f !== file));
    }
  };




  // Fetch all active variants for dropdown
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   fetch(`${BASE_URL}/api/variant-attributes/active-variants`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then(res => res.json())
  //     .then(data => setVariantDropdown(data))
  //     .catch(err => console.error("Error fetching variant dropdown:", err));
  // }, []);

  // Handle variant change per row
  const handleVariantChange = (index, value) => {
    const token = localStorage.getItem("token");
    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, selectedVariant: value.trim(), selectedValue: "", valueDropdown: [] } : v
      )
    );

    if (!value || !token) return;

    fetch(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(value)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        let values = [];
        data.forEach(val => {
          if (typeof val === "string") {
            values.push(...val.split(",").map(v => v.trim()).filter(Boolean));
          }
        });
        setVariants(prev =>
          prev.map((v, i) => (i === index ? { ...v, valueDropdown: values } : v))
        );
      })
      .catch(err => console.error("Error fetching value dropdown:", err));
  };

  const handleValueChange = (index, value) => {
    setVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, selectedValue: value } : v))
    );
  };

  const handleAddVariant = () => {
    setVariants(prev => [...prev, { selectedVariant: "", selectedValue: "", valueDropdown: [] }]);
  };

  const handleRemoveVariant = index => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (variants && variants.length > 0) {
      const updatedVariants = variants.reduce((acc, v) => {
        if (v.selectedVariant && v.selectedValue?.length > 0) {
          acc[v.selectedVariant.trim()] = v.selectedValue;
        }
        return acc;
      }, {});
      setFormData((prev) => ({ ...prev, variants: updatedVariants }))
    }
  }, [variants]);
  console.log("Variants state:", variants);
  console.log("FormData variants:", formData.variants);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="page-wrapper mt-4">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("Edit Product")}</h4>
              <h6>{t("createNewProduct")}</h6>
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
                onClick={() => location.reload()}
              >
                <TbRefresh />
              </button>
            </li>
            <li>
              {/* <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Collapse"
                id="collapse-header"
                className="icon-btn"
              >
                <TbChevronUp />
              </button> */}
            </li>
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
                        className={`form-control ${errors.productName ? "is-invalid" : ""
                          }`} // Commented out: Validation class
                        // className="form-control"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder={t("enterProductName")}
                      />
                      {errors.productName && ( // Commented out: Error feedback
                        <div className="invalid-feedback">
                          {errors.productName}
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
                              <h5 className="modal-title">HSN Details</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowHSNModal(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="fw-bold">HSN Code:</label>
                                <div className="fs-5 text-primary">
                                  {selectedHSN.label.split(" - ")[0]}
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="fw-bold">Description:</label>
                                <div className="fs-6 text-secondary">
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
                    <div className="col-sm-6 col-12">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">
                          {t("sku")}
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          className={`form-control ${errors.sku ? "is-invalid" : ""
                            }`} // Commented out: Validation class
                          // className="form-control"
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          placeholder={t("enterSKU")}
                          style={{ marginBottom: "10px" }}
                        />
                        {errors.sku && ( // Commented out: Error feedback
                          <div className="invalid-feedback">{errors.sku}</div>
                        )}
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="btn-primaryadd"
                          style={{
                            padding: "5px 10px",
                            border: "1px solid gray",
                            borderRadius: "5px",
                            color: "white",
                          }}
                        >
                          {t("generate")}
                        </button>
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
                          data-bs-target="#add-category"
                          onClick={() => {
                            setCategories("");
                            setCategoryId("");
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
                          setSelectedsubCategory(null);
                        }}
                        placeholder={t("searchOrSelectCategory")}
                      />
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
                    </div>

                    {/* Supplier */}
                    {/* <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("supplier")}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={options}
                        value={selectedSupplier}
                        onChange={handleSupplierChange}
                        placeholder="Choose a supplier..."
                        isClearable
                      />
                    </div> */}

                    {/* <div className="col-lg-6 col-sm-6 col-12">
                      <div className="mb-3 list position-relative">
                        <label className="form-label">
                          {t("itemBarcode")}
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="itemBarcode"
                          value={formData.itemBarcode}
                          readOnly
                          placeholder={t("itemBarcodePlaceholder")}
                          style={{ marginBottom: "10px" }}
                        />
                        <button
                          type="button"
                          className="btn-primaryadd"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              itemBarcode: generateBarcode(),
                            }))
                          }
                          style={{
                            padding: "5px 10px",
                            border: "1px solid gray",
                            borderRadius: "5px",
                            color: "white",
                          }}
                        >
                          {t("generate")}
                        </button>
                      </div>
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
                            className={`form-control ${errors.leadTime ? "is-invalid" : ""
                              }`} // Commented out: Validation class
                            // className="form-control"
                            placeholder={t("enterLeadTime")}
                            name="leadTime"
                            value={formData.leadTime}
                            onChange={handleChange}
                          />
                          {errors.leadTime && ( // Commented out: Error feedback
                            <div className="invalid-feedback">
                              {errors.leadTime}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("reorderLevel")}
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors.reorderLevel ? "is-invalid" : ""
                              }`}
                            // className="form-control"
                            placeholder={t("enterReorderLevel")}
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                          />
                          {errors.reorderLevel && ( // Commented out: Error feedback
                            <div className="invalid-feedback">
                              {errors.reorderLevel}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">
                            {t("initialStock")}
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors.initialStock ? "is-invalid" : ""
                              }`}
                            // className="form-control"
                            placeholder={t("enterInitialStock")}
                            name="initialStock"
                            value={formData.initialStock}
                            onChange={handleChange}
                          />
                          {errors.initialStock && ( // Commented out: Error feedback
                            <div className="invalid-feedback">
                              {errors.initialStock}
                            </div>
                          )}
                        </div>

                        {/* Track Name */}
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
                              // checked={trackType === "serial"}
                              // onChange={() => setTrackType("serial")}
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
                              // checked={trackType === "batch"}
                              // onChange={() => setTrackType("batch")}
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
                              // checked={trackType === "status"}
                              // onChange={() => setTrackType("status")}
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

                        {/* Serial No Input */}
                        {formData.trackType === "serial" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">
                              {t("serialNo")}
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.serialNumber ? "is-invalid" : ""
                                }`}
                              // className="form-control"
                              placeholder={t("enterSerialNumber")}
                              name="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleChange}
                            />
                            {errors.serialNumber && ( // Commented out: Error feedback
                              <div className="invalid-feedback">
                                {errors.serialNumber}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Batch No Input */}
                        {formData.trackType === "batch" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">{t("batchNo")}</label>
                            <input
                              type="text"
                              className={`form-control ${errors.batchNumber ? "is-invalid" : ""
                                }`}
                              // className="form-control"
                              placeholder={t("enterBatchNumber")}
                              name="batchNumber"
                              value={formData.batchNumber}
                              onChange={handleChange}
                            />
                            {errors.batchNumber && ( // Commented out: Error feedback
                              <div className="invalid-feedback">
                                {errors.batchNumber}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Returnable checkbox */}
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
                        className="w-full p-2 border rounded"
                        placeholder={t("enterExpireDate")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        {t("brand")}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder={t("enterBrand")}
                      />
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
                      className={`form-control ${errors[field.name] ? "is-invalid" : ""
                        }`} // Commented out: Validation class
                      // className="form-control"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={t(
                        `enter${field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)
                        }`
                      )}
                    />
                    {errors[field.name] && ( // Commented out: Error feedback
                      <div className="invalid-feedback">
                        {errors[field.name]}
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
                    className={`form-control ${errors.quantity ? "is-invalid" : ""
                      }`}
                    // className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t("enterQuantity")}
                  />
                  {errors.quantity && ( // Commented out: Error feedback
                    <div className="invalid-feedback">{errors.quantity}</div>
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
                </div>

                <div className="col-sm-6 col-12 mb-3">
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
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountValue")}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.discountValue ? "is-invalid" : ""
                      }`}
                    // className="form-control"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={t("enterDiscountValue")}
                  />
                  {errors.discountValue && ( // Commented out: Error feedback
                    <div className="invalid-feedback">
                      {errors.discountValue}
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
                    className={`form-control ${errors.quantityAlert ? "is-invalid" : ""
                      }`} // Commented out: Validation class
                    // className="form-control"
                    name="quantityAlert"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                    placeholder={t("enterQuantityAlert")}
                  />
                  {errors.quantityAlert && ( // Commented out: Error feedback
                    <div className="invalid-feedback">
                      {errors.quantityAlert}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 - Images and SEO */}
            {step === 2 && (
              <>
                <div
                  style={{ width: "100%", height: "100%" }}
                  {...getRootProps({
                    className:
                      "dropzone p-4 text-center image-upload image-upload-two mb-3",
                  })}
                >
                  <input {...getInputProps()} />
                  <MdImageSearch style={{ fontSize: "50px" }} />
                  <p>Drag your image here, or browse</p>
                   <p>Supports JPEG, PNG, JPG. Maximum size: 1MB.</p>
                   {errors.images && (
                    <p className="text-danger fs-12">{errors.images}</p>
                  )}
                </div>

                <div className="row mt-3">
                  {images.map((file, i) => (
                    <div className="col-2 mb-3" key={i}>
                      <img
                        src={file.url || file.preview}
                        className="img-thumbnail"
                        style={{ height: 100, width: 100, objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="position-absolute"
                        style={{
                          cursor: "pointer",
                          marginLeft: "-20px",
                          border: "none",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          width: '20px',
                          height: '20px'
                        }}
                        onClick={() => handleRemoveImage(file)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="col-lg-12 mb-3">
                  <label>{t("description")}</label>
                  <textarea
                    name="description"
                    className={`form-control ${errors.description ? "is-invalid" : ""
                      }`}
                    // className="form-control"
                    maxLength={300}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("enterDescription")}
                  />
                  {errors.description && ( // Commented out: Error feedback
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">{t("seoMetaTitle")}</label>
                    <input
                      type="text"
                      name="seoTitle"
                      className={`form-control ${errors.seoTitle ? "is-invalid" : ""
                        }`} // Commented out: Validation class
                      // className="form-control"
                      value={formData.seoTitle || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaTitle")}
                    />
                    {errors.seoTitle && ( // Commented out: Error feedback
                      <div className="invalid-feedback">{errors.seoTitle}</div>
                    )}
                  </div>
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">
                      {t("seoMetaDescription")}
                    </label>
                    <input
                      type="text"
                      name="seoDescription"
                      className={`form-control ${errors.seoDescription ? "is-invalid" : ""
                        }`}
                      // className="form-control"
                      value={formData.seoDescription || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaDescription")}
                    />
                    {errors.seoDescription && ( // Commented out: Error feedback
                      <div className="invalid-feedback">
                        {errors.seoDescription}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3 - Variants */}
            {step === 3 && (
              <>

                <div className="card mt-4">
                  <div className="card-body">
                    {variants.map((variant, index) => (
                      <div className="row mb-3" key={index}>
                        <div className="col-md-5">
                          <label className="form-label">Variant</label>
                          <select
                            className="form-select"
                            value={variant.selectedVariant}
                            onChange={e => handleVariantChange(index, e.target.value)}
                          >
                            <option value="">Select Variant</option>
                            {variantDropdown.map((v, idx) => (
                              <option key={idx} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-5">
                          <label className="form-label">Value</label>
                          <select
                            className="form-select"
                            // value={variant.selectedValue}
                            value={variant.selectedValue[0] || ""}
                            onChange={e => handleValueChange(index, [e.target.value])}
                            disabled={!variant.selectedVariant}
                          >
                            <option value="">Select Value</option>
                            {variant.valueDropdown.map((val, idx) => (
                              <option key={idx} value={val}>{val}</option>
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




                {/* <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
                  {variantTabs.map((tab) => (
                    <button
                      type="button"
                      key={tab}
                      className={`variant-tab btn btn-sm ${
                        activeTab === tab
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
                    placeholder={t("enterVariantsPlaceholder", {
                      tab: activeTab,
                    })}
                  />
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
      </div>
    </div>
  );
};

export default ProductEdit;
