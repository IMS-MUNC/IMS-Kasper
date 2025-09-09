import React, { useEffect, useState } from "react";
import "./product.css";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { MdImageSearch } from "react-icons/md";
import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
import { TbChevronUp, TbEye, TbRefresh } from "react-icons/tb";
import { useTranslation } from "react-i18next";



const ProductForm = () => {

  const { t } = useTranslation();

  const steps = [
    t("descriptionAndMedia"),
    t("pricing"),
    t("images"),
    t("variants")
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
    t("flavour")
  ];
  // const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(
    Array(steps.length).fill("pending")
  );
  const [activeTab, setActiveTab] = useState("Color");
  const [images, setImages] = useState([]);

  const inputChange = (key, value) => {
    if (step === 3) {
      const parsedValues = value.split(",").map((v) => v.trim());
      setFormData((prev) => ({
        ...prev,
        variants: { ...prev.variants, [key]: parsedValues },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const validateStep = () => {
    if (step === 0) {
      return formData.productName;
    }
    if (step === 1) {
      return formData.purchasePrice;
    }
    if (step === 2) {
      return formData.description;
    }
    if (step === 3) {
      return formData.variants[activeTab]?.length > 0;
    }
    return true;
  };

  //  const validateStep = () => {
  //   if (step === 3) {
  //     return !!formData[activeTab];
  //   }
  //   return true; // Assume all other steps valid for now
  // };

  const handleNext = () => {
    const isValid = validateStep();
    const updatedStatus = [...stepStatus];
    updatedStatus[step] = isValid ? "complete" : "incomplete";
    setStepStatus(updatedStatus);

    if (isValid && step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSaveDraft = () => {
    toast.info("Saved as draft!");
  };

  const onDrop = (acceptedFiles) => {
    const mapped = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages((prev) => [...prev, ...mapped]);
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
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);


  const [formData, setFormData] = useState({
    // Step 0 - Basic Info
    productName: "",
    sku: "",
    brand: "",
    category: "",
    subCategory: "",
    supplier: "",
    itemBarcode: "",
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

    // Step 3 - Variants
    variants: {},

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`,{
         headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      const data = await res.json();

      // Map data for react-select
      const options = data.map((category) => ({
        value: category._id, // or category.categoryName
        label: category.categoryName,
      }));

      setCategories(options);
      console.log('ferere categories', data)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUnits = async () => {
    try {
       const token = localStorage.getItem("token"); 
      const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`,{
         headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      const options = res.data.units.map((unit) => ({
        value: unit.shortName,
        label: `${unit.unitsName} (${unit.shortName})`,
      }));
      setUnitsOptions(options);
    } catch (error) {
      console.error("Failed to fetch active units:", error);
    }
  };

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory.value);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      console.log("Fetching subcategories for category ID:", categoryId);
      // const res = await fetch(`${BASE_URL}/api/category/by-category/${categoryId}`);
      const res = await fetch(`${BASE_URL}/api/subcategory/by-category/${categoryId}`,{
         headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }


      const data = await res.json();
      console.log("Subcategory API raw response:", data);

      const options = data.map((subcat) => ({
        value: subcat._id,
        label: subcat.subCategoryName,
      }));
      setSubcategories(options);
      console.log('ferere subcategories', data)
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/brands/active-brands`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log('fetchbrand', data)

      const options = data.brands.map((brand) => ({
        value: brand._id,
        label: brand.brandName,
      }));

      setBrandOptions(options);
      console.log('ferere brand', data)
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
    console.log("Selected subcategory:", selectedOption);
  };
  const handleBrandChange = (selectedOption) => {
    setSelectedBrands(selectedOption);
    console.log("Selected brands:", selectedOption);
  };
  const handleUnitChange = (selectedOption) => {
    setSelectedUnits(selectedOption);
    console.log("Selected Units:", selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();

    // Append form fields
    formPayload.append("productName", formData.productName);
    formPayload.append("sku", formData.sku);
    formPayload.append("brand", selectedBrands?.value);
    formPayload.append("category", selectedCategory?.value);
    formPayload.append("subCategory", selectedsubCategory?.value);
    // Only send supplier if valid ObjectId is present
    if (selectedSupplier?.value && typeof selectedSupplier.value === 'string' && selectedSupplier.value.trim() !== '') {
      formPayload.append("supplier", selectedSupplier.value);
    }
    // Always send itemBarcode, prefer selectedSupplier if available
    formPayload.append("itemBarcode", formData.itemBarcode);
    formPayload.append("store", formData.store);
    // Always send warehouse, prefer selectedWarehouse if available
    formPayload.append("warehouse", selectedWarehouse?.value);
    // Ensure hsn is sent if selectedHSN exists
    if (selectedHSN?.value) {
      formPayload.append("hsn", selectedHSN.value);
    }
    formPayload.append("purchasePrice", Number(formData.purchasePrice));
    formPayload.append("sellingPrice", Number(formData.sellingPrice));
    formPayload.append("wholesalePrice", Number(formData.wholesalePrice));
    formPayload.append("retailPrice", Number(formData.retailPrice));
    formPayload.append("quantity", Number(formData.quantity));
    formPayload.append("unit", selectedUnits?.value);
    formPayload.append("taxType", formData.taxType);
    formPayload.append("tax", formData.tax);
    formPayload.append("discountType", formData.discountType);
    formPayload.append("discountValue", Number(formData.discountValue));
    formPayload.append("quantityAlert", Number(formData.quantityAlert));
    formPayload.append("description", formData.description);
    formPayload.append("seoTitle", formData.seoTitle);
    formPayload.append("seoDescription", formData.seoDescription);

    formPayload.append("itemType", formData.itemType);
    formPayload.append("isAdvanced", formData.isAdvanced);
    formPayload.append("trackType", formData.trackType);
    formPayload.append("isReturnable", formData.isReturnable);
    formPayload.append("leadTime", formData.leadTime);
    formPayload.append("reorderLevel", formData.reorderLevel);
    formPayload.append("initialStock", formData.initialStock);
    formPayload.append("serialNumber", formData.serialNumber);
    formPayload.append("batchNumber", formData.batchNumber);
    formPayload.append("returnable", formData.returnable);
    formPayload.append("expirationDate", formData.expirationDate);

    // If variants is an object, stringify it
    formPayload.append("variants", JSON.stringify(formData.variants));

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

  const generateBarcode = () => {
    const prefix = "BR"; // Optional
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };


  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const categorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !categorySlug) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/category/categories`, {
        categoryName: categoryName,
        categorySlug: categorySlug,
          headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });

      toast.success("Category created successfully!");

      // Reset form
      setCategoryName("");
      setCategorySlug("");
      // Refresh list
      fetchCategories();
      // Close modal
      window.$("#categoryModal").modal("hide");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  // to generate sku i.e, stock keeping unit based on category
  const generateSKU = () => {
    const category = formData.category || "GEN";
    const name = formData.name || "PRD";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const sku = `${category.toUpperCase().slice(0, 3)}-${name.toUpperCase().slice(0, 3)}-${randomNum}`
    setFormData((prevProduct) => ({
      ...prevProduct,
      sku,
    }))
  }

  // to auto change sku based on changes in product name or category
  useEffect(() => {
    if (formData.productName || formData.category) {
      generateSKU();
    }
  }, [formData.productName, formData.category]);



  useEffect(() => {
    const fetchActiveSuppliers = async () => {
      try {
         const token = localStorage.getItem("token"); 
        const res = await axios.get(`${BASE_URL}/api/suppliers/active`,{
            headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
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




  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
         const token = localStorage.getItem("token"); 
        const res = await axios.get(`${BASE_URL}/api/warehouse/active`,{
            headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
        });
        if (res.data.success) {
          const formatted = res.data.data.map((wh) => ({
            value: wh._id,
            label: wh.warehouseName, // ✅ direct warehouseName
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
        const res = await axios.get(`${BASE_URL}/api/hsn/all`,{
            headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
        });
        if (res.data.success) {
          const formatted = res.data.data.map((item) => ({
            value: item._id,
            label: `${item.hsnCode} - ${item.description || ""}`,
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

  return (
    <div className="page-wrapper mt-4">
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
              >
                <TbRefresh />
              </button>
            </li>
            <li>
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
            </li>
          </div>

          <div className="page-btn mt-0">
            <button className="btn btn-secondary">
              <Link to="back"></Link>{t("backToProduct")}
            </button>
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
                        {t("productName")}<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="productName"
                        className="form-control"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder={t("enterProductName")}
                      />
                    </div>

                    {/* HSNCODE */}

                    <div className="col-sm-6 col-12 mb-3 d-flex align-items-end gap-2">
                      <div style={{ flex: 3, maxWidth: '100%', minWidth: 0 }}>
                        <label className="form-label">
                          {t("HSN")}<span className="text-danger">*</span>
                        </label>
                        <div style={{ position: 'relative', width: '100%' }}>
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
                                maxWidth: '100%',
                                minWidth: 0,
                                overflow: 'hidden',
                              }),
                              singleValue: (base) => ({
                                ...base,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
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
                        style={{ height: '38px' }}
                      >
                        <TbEye size={18} />
                        {/* View */}
                      </button>
                    </div>

                    {/* HSN View Modal */}
                    {showHSNModal && selectedHSN && (
                      <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content" style={{ borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                            <div className="modal-header bg-info text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                              <h5 className="modal-title">HSN Details</h5>
                              <button type="button" className="btn-close" onClick={() => setShowHSNModal(false)}></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="fw-bold">HSN Code:</label>
                                <div className="fs-5 text-primary">{selectedHSN.label.split(' - ')[0]}</div>
                              </div>
                              <div className="mb-3">
                                <label className="fw-bold">Description:</label>
                                <div className="fs-6 text-secondary">{selectedHSN.label.split(' - ')[1] || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" onClick={() => setShowHSNModal(false)}>Close</button>
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
                          {t("sku")}<span className="text-danger ms-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="sku"
                          className="form-control"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder={t("enterSKU")}
                        />
                        <button type="submit" onClick={generateSKU} className="btn btn-primaryadd">
                          {t("generate")}
                        </button>
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">{t("brandOrManufacture")}</label>
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
                          {t("category")}<span className="text-danger">*</span>
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
                        }}
                        placeholder={t("searchOrSelectCategory")}
                      />
                    </div>

                    {/* Subcategory */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("subCategory")}<span className="text-danger">*</span>
                      </label>
                      <Select
                        options={subcategories}
                        value={selectedsubCategory}
                        onChange={subCategoryChange}
                        placeholder={t("searchOrSelectSubcategory")}
                      />
                    </div>

                    {/* Supplier */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("supplier")}<span className="text-danger">*</span>
                      </label>
                      {/* <select
                        className="form-select"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                      >
                        <option value="">{t("select")}</option>
                        <option value="supplier1">{t("supplier1")}</option>
                        <option value="supplier2">{t("supplier2")}</option>
                      </select> */}
                      <Select
                        options={options}
                        value={selectedSupplier}
                        onChange={handleSupplierChange}
                        placeholder="Choose a supplier..."
                        isClearable
                      />
                    </div>

                    <div className="col-lg-6 col-sm-6 col-12">
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
                        />
                        <button
                          type="button"
                          className="btn btn-primaryadd"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              itemBarcode: generateBarcode(),
                            }))
                          }
                        >
                          {t("generate")}
                        </button>
                      </div>
                    </div>

                    {/* Store */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("store")}<span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="store"
                        value={formData.store}
                        onChange={handleChange}
                      >
                        <option value="">{t("select")}</option>
                        <option value="India Mart">{t("indiaMart")}</option>
                        <option value="India Gadgets">{t("indiaGadgets")}</option>
                      </select>
                    </div>

                    {/* Warehouse */}
                    <div className="col-sm-6 col-12 mb-3">
                      <label className="form-label">
                        {t("warehouseOrLocation")}<span className="text-danger">*</span>
                      </label>
                      <Select
                        options={optionsware}
                        value={selectedWarehouse}

                        isLoading={loading}
                        isSearchable
                        placeholder="Select Warehouse..."
                        onChange={handleWarehouseChange}
                      />
                      {/* <select
                        className="form-select"
                        name="warehouse"
                        value={formData.warehouse}
                        onChange={handleChange}
                      >
                        <option value="">{t("select")}</option>
                        <option value="Warehouse1">{t("warehouse1")}</option>
                      </select> */}
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
                            type="text"
                            className="form-control"
                            placeholder={t("enterLeadTime")}
                            name="leadTime"
                            value={formData.leadTime}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">{t("reorderLevel")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("enterReorderLevel")}
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-sm-6 col-12 mb-3">
                          <label className="form-label">{t("initialStock")}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("enterInitialStock")}
                            name="initialStock"
                            value={formData.initialStock}
                            onChange={handleChange}
                          />
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
                            <label className="form-check-label" htmlFor="serial">
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
                            <label className="form-check-label" htmlFor="status">
                              Status
                            </label>
                          </div>
                        </div>

                        {/* Serial No Input */}
                        {formData.trackType === "serial" && (
                          <div className="col-sm-6 col-12 mb-3">
                            <label className="form-label">{t("serialNo")}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("enterSerialNumber")}
                              name="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleChange}
                            />
                          </div>
                        )}

                        {/* Batch No Input */}
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
                      <input type="date" className="w-full p-2 border rounded" placeholder={t("enterExpireDate")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">{t("brand")}</label>
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
                      type="text"
                      className="form-control"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={t(`enter${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`)}
                    />
                  </div>
                ))}

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantity")}<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t("enterQuantity")}
                  />
                </div>
                <div className="col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("unit")}<span className="text-danger">*</span>
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
                    {t("taxType")}<span className="text-danger">*</span>
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

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("taxRate")}<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                  >
                    <option value="">{t("select")}</option>
                    <option>{t("igst8")}</option>
                    <option>{t("gst5")}</option>
                    <option>{t("sgst4")}</option>
                    <option>{t("cgst16")}</option>
                    <option>{t("gst18")}</option>
                  </select>
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("discountType")}<span className="text-danger">*</span>
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
                    {t("discountValue")}<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={t("enterDiscountValue")}
                  />
                </div>

                <div className=" col-sm-6 col-12 mb-3">
                  <label className="form-label">
                    {t("quantityAlert")}<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantityAlert"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                    placeholder={t("enterQuantityAlert")}
                  />
                </div>
              </div>
            )}

            {/* Step 2 - Images and SEO */}
            {step === 2 && (
              <>
                <div
                  {...getRootProps({
                    className:
                      "dropzone p-4 text-center image-upload image-upload-two mb-3",
                  })}
                >
                  <input {...getInputProps()} />
                  <MdImageSearch style={{ fontSize: "50px" }} />
                  <p>Drag your image here, or browse</p>
                  <p>Supports JPEG, PNG, JPG</p>
                </div>

                <div className="row mt-3">
                  {images.map((file, i) => (
                    <div className="col-3 mb-3" key={i}>
                      <img
                        src={file.preview}
                        className="img-thumbnail"
                        style={{ height: 120, objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>

                <div className="col-lg-12 mb-3">
                  <label>{t("description")}</label>
                  <textarea
                    name="description"
                    className="form-control"
                    maxLength={300}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("enterDescription")}
                  />
                </div>

                <div className="row">
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">{t("seoMetaTitle")}</label>
                    <input
                      type="text"
                      name="seoTitle"
                      className="form-control"
                      value={formData.seoTitle || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaTitle")}
                    />
                  </div>
                  <div className="col-sm-6 col-12 mb-3">
                    <label className="form-label">{t("seoMetaDescription")}</label>
                    <input
                      type="text"
                      name="seoDescription"
                      className="form-control"
                      value={formData.seoDescription || ""}
                      onChange={handleChange}
                      placeholder={t("enterSeoMetaDescription")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3 - Variants */}
            {step === 3 && (
              <>
                <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
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
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 d-flex justify-content-between">
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
          onCategoryChange={(e) => setCategoryName(e.target.value)}
          onSlugChange={(e) => setCategorySlug(e.target.value)}
          onSubmit={categorySubmit}
          submitLabel="Add Category"
        />
      </div>
    </div>
  );
};

export default ProductForm;


// export default ProductForm;
// import React, { useEffect, useState } from "react";
// import "./product.css";
// import Select from "react-select";
// import { Link, useNavigate } from "react-router-dom";
// import BASE_URL from "../../../../pages/config/config";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useDropzone } from "react-dropzone";
// import { MdImageSearch } from "react-icons/md";
// import CategoryModal from "../../../../pages/Modal/categoryModals/CategoryModal";
// import { TbChevronUp, TbRefresh } from "react-icons/tb";
// import { useTranslation } from "react-i18next";



// const ProductForm = () => {

//   const { t } = useTranslation();

//   const steps = [
//     t("descriptionAndMedia"),
//     t("pricing"),
//     t("images"),
//     t("variants")
//   ];
//   const variantTabs = [
//     t("color"),
//     t("size"),
//     t("expiry"),
//     t("material"),
//     t("model"),
//     t("weight"),
//     t("skinType"),
//     t("packagingType"),
//     t("flavour")
//   ];
//   // const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [stepStatus, setStepStatus] = useState(
//     Array(steps.length).fill("pending")
//   );
//   const [activeTab, setActiveTab] = useState("Color");
//   const [images, setImages] = useState([]);

//   const inputChange = (key, value) => {
//     if (step === 3) {
//       const parsedValues = value.split(",").map((v) => v.trim());
//       setFormData((prev) => ({
//         ...prev,
//         variants: { ...prev.variants, [key]: parsedValues },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [key]: value }));
//     }
//   };

//   const validateStep = () => {
//     if (step === 0) {
//       return formData.productName;
//     }
//     if (step === 1) {
//       return formData.purchasePrice;
//     }
//     if (step === 2) {
//       return formData.description;
//     }
//     if (step === 3) {
//       return formData.variants[activeTab]?.length > 0;
//     }
//     return true;
//   };

//   //  const validateStep = () => {
//   //   if (step === 3) {
//   //     return !!formData[activeTab];
//   //   }
//   //   return true; // Assume all other steps valid for now
//   // };

//   const handleNext = () => {
//     const isValid = validateStep();
//     const updatedStatus = [...stepStatus];
//     updatedStatus[step] = isValid ? "complete" : "incomplete";
//     setStepStatus(updatedStatus);

//     if (isValid && step < steps.length - 1) {
//       setStep((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (step > 0) setStep((prev) => prev - 1);
//   };

//   const handleSaveDraft = () => {
//     toast.info("Saved as draft!");
//   };

//   const onDrop = (acceptedFiles) => {
//     const mapped = acceptedFiles.map((file) =>
//       Object.assign(file, { preview: URL.createObjectURL(file) })
//     );
//     setImages((prev) => [...prev, ...mapped]);
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "image/*": [] },
//     onDrop,
//   });

//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedsubCategory, setSelectedsubCategory] = useState(null);
//   const [selectedBrands, setSelectedBrands] = useState(null);
//   const [selectedUnits, setSelectedUnits] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [, setSelectedSubcategory] = useState(null);
//   const [unitsOptions, setUnitsOptions] = useState([]);

//   const [formData, setFormData] = useState({
//     // Step 0 - Basic Info
//     productName: "",
//     slug: "",
//     sku: "",
//     brand: "",
//     category: "",
//     subCategory: "",
//     supplier: "",
//     itemBarcode: "",
//     store: "",
//     warehouse: "",

//     // Step 1 - Pricing
//     purchasePrice: "",
//     sellingPrice: "",
//     wholesalePrice: "",
//     retailPrice: "",
//     quantity: "",
//     unit: "",
//     taxType: "",
//     tax: "",
//     discountType: "",
//     discountValue: "",
//     quantityAlert: "",

//     // Step 2 - Images & SEO
//     description: "",
//     seoTitle: "",
//     seoDescription: "",

//     // Step 3 - Variants
//     variants: {},

//     // Other
//     sellingType: "",
//     barcodeSymbology: "",
//     productType: "Single",
//     // Newly added
//     itemType: "Good",
//     isAdvanced: false,
//     trackType: "serial",
//     isReturnable: false,
//     leadTime: "",
//     reorderLevel: "",
//     initialStock: "",
//     serialNumber: "",
//     batchNumber: "",
//     returnable: false,
//     expirationDate: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/category/categories`);
//       const data = await res.json();

//       // Map data for react-select
//       const options = data.map((category) => ({
//         value: category._id, // or category.categoryName
//         label: category.categoryName,
//       }));

//       setCategories(options);
//       console.log('ferere categories', data)
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchUnits = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`);
//       const options = res.data.units.map((unit) => ({
//         value: unit.shortName,
//         label: `${unit.unitsName} (${unit.shortName})`,
//       }));
//       setUnitsOptions(options);
//     } catch (error) {
//       console.error("Failed to fetch active units:", error);
//     }
//   };

//   useEffect(() => {
//      console.log("Selected Category:", selectedCategory);
//     if (selectedCategory) {
//       fetchSubcategoriesByCategory(selectedCategory.value);
//     } else {
//       setSubcategories([]);
//     }
//   }, [selectedCategory]);

//   const fetchSubcategoriesByCategory = async (categoryId) => {
//     try {
//        console.log("Fetching subcategories for category ID:", categoryId);
//       // const res = await fetch(`${BASE_URL}/api/category/by-category/${categoryId}`);
//      const res = await fetch(`${BASE_URL}/api/subcategory/by-category/${categoryId}`);
//         if (!res.ok) {
//       throw new Error(`Server error: ${res.status}`);
//     }


//       const data = await res.json();
//        console.log("Subcategory API raw response:", data);

//       const options = data.map((subcat) => ({
//         value: subcat._id,
//         label: subcat.subCategoryName,
//       }));
//       setSubcategories(options);
//       console.log('ferere subcategories', data)
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };
//   const fetchBrands = async () => {
//     try {
//        const token = localStorage.getItem("token");
//       const res = await fetch(`${BASE_URL}/api/brands/active-brands`, {
//         headers: {
//           Authorization:`Bearer ${token}`
//         }
//       });
//       const data = await res.json();
//       console.log('fetchbrand', data)

//       const options = data.brands.map((brand) => ({
//         value: brand._id,
//         label: brand.brandName,
//       }));

//       setBrandOptions(options);
//       console.log('ferere brand', data)
//     } catch (error) {
//       console.error("Failed to load active brands:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchBrands();
//     fetchUnits();
//   }, []);

//   const subCategoryChange = (selectedOption) => {
//     setSelectedsubCategory(selectedOption);
//     console.log("Selected subcategory:", selectedOption);
//   };
//   const handleBrandChange = (selectedOption) => {
//     setSelectedBrands(selectedOption);
//     console.log("Selected brands:", selectedOption);
//   };
//   const handleUnitChange = (selectedOption) => {
//     setSelectedUnits(selectedOption);
//     console.log("Selected Units:", selectedOption);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formPayload = new FormData();

//     // Append form fields
//     formPayload.append("productName", formData.productName);
//     formPayload.append("slug", formData.slug);
//     formPayload.append("sku", formData.sku);
//     formPayload.append("brand", selectedBrands?.value);
//     formPayload.append("category", selectedCategory?.value);
//     formPayload.append("subcategory", selectedsubCategory?.value);
//     formPayload.append("supplier", formData.supplier);
//     formPayload.append("itemBarcode", formData.itemBarcode);
//     formPayload.append("store", formData.store);
//     formPayload.append("warehouse", formData.warehouse);
//     formPayload.append("purchasePrice", Number(formData.purchasePrice));
//     formPayload.append("sellingPrice", Number(formData.sellingPrice));
//     formPayload.append("wholesalePrice", Number(formData.wholesalePrice));
//     formPayload.append("retailPrice", Number(formData.retailPrice));
//     formPayload.append("quantity", Number(formData.quantity));
//     formPayload.append("unit", selectedUnits?.value);
//     formPayload.append("taxType", formData.taxType);
//     formPayload.append("tax", formData.tax);
//     formPayload.append("discountType", formData.discountType);
//     formPayload.append("discountValue", Number(formData.discountValue));
//     formPayload.append("quantityAlert", Number(formData.quantityAlert));
//     formPayload.append("description", formData.description);
//     formPayload.append("seoTitle", formData.seoTitle);
//     formPayload.append("seoDescription", formData.seoDescription);

//     formPayload.append("itemType", formData.itemType);
//     formPayload.append("isAdvanced", formData.isAdvanced);
//     formPayload.append("trackType", formData.trackType);
//     formPayload.append("isReturnable", formData.isReturnable);
//     formPayload.append("leadTime", formData.leadTime);
//     formPayload.append("reorderLevel", formData.reorderLevel);
//     formPayload.append("initialStock", formData.initialStock);
//     formPayload.append("serialNumber", formData.serialNumber);
//     formPayload.append("batchNumber", formData.batchNumber);
//     formPayload.append("returnable", formData.returnable);
//     formPayload.append("expirationDate", formData.expirationDate);

//     // If variants is an object, stringify it
//     formPayload.append("variants", JSON.stringify(formData.variants));

//     // Append multiple images (must be File objects)
//     images.forEach((imgFile) => {
//       formPayload.append("images", imgFile); // name must match multer field in backend
//     });

//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/products/create`,
//         formPayload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success("Product created successfully!");
//       navigate("/product");
//     } catch (error) {
//       toast.error("Failed to create product");
//       console.error(
//         "Product creation error:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const generateBarcode = () => {
//     const prefix = "BR"; // Optional
//     const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
//     return `${prefix}${randomNumber}`;
//   };
//   const [categoryName, setCategoryName] = useState("");
//   const [categorySlug, setCategorySlug] = useState("");

//   const categorySubmit = async (e) => {
//     e.preventDefault();

//     if (!categoryName || !categorySlug) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//       await axios.post(`${BASE_URL}/api/category/categories`, {
//         categoryName: categoryName,
//         categorySlug: categorySlug,
//       });

//       toast.success("Category created successfully!");

//       // Reset form
//       setCategoryName("");
//       setCategorySlug("");
//       // Refresh list
//       fetchCategories();
//       // Close modal
//       window.$("#categoryModal").modal("hide");
//     } catch (err) {
//       console.error("Error creating category:", err);
//       toast.error(err.response?.data?.message || "Error creating category");
//     }
//   };

//   // to generate sku i.e, stock keeping unit based on category
//   const generateSKU = () => {
//     const category = formData.category || "GEN";
//     const name = formData.name || "PRD";
//     const randomNum = Math.floor(Math.random() * 9000) + 1000;
//     const sku = `${category.toUpperCase().slice(0,3)}-${name.toUpperCase().slice(0,3)}-${randomNum}`
//     setFormData((prevProduct) => ({
//       ...prevProduct,
//       sku,
//     }))
//   }

//   // to auto change sku based on changes in product name or category
//   useEffect(() => {
//     if(formData.productName || formData.category) {
//       generateSKU();
//     }
//   },[formData.productName, formData.category]);

//   return (
//     <div className="page-wrapper mt-4">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">{t("createProduct")}</h4>
//               <h6>{t("createNewProduct")}</h6>
//               {/* <h4 className="fw-bold">Create Product</h4>
//               <h6>Create new product</h6> */}


//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Refresh"
//                 className="icon-btn"
//               >
//                 <TbRefresh />
//               </button>
//             </li>
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Collapse"
//                 id="collapse-header"
//                 className="icon-btn"
//               >
//                 <TbChevronUp />
//               </button>
//             </li>
//           </div>

//           <div className="page-btn mt-0">
//             <button className="btn btn-secondary">
//               <Link to="back"></Link>{t("backToProduct")}
//             </button>
//           </div>
//         </div>
//         {/* <h5 className="mb-3">{steps[step]}</h5> */}

//         <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
//           {steps.map((label, index) => {
//             const status = stepStatus[index];
//             const isActive = index === step;
//             const isComplete = status === "complete";
//             const isIncomplete = status === "incomplete";

//             return (
//               <div key={index} className="step-wrapper">
//                 <div
//                   className={`circle ${isComplete
//                     ? "complete"
//                     : isIncomplete
//                       ? "incomplete"
//                       : isActive
//                         ? "active"
//                         : ""
//                     }`}
//                 >
//                   {index + 1}
//                 </div>
//                 <div className="step-text">{label}</div>
//                 {index < steps.length - 1 && (
//                   <div
//                     className={`progress-line ${status === "complete"
//                       ? "line-complete"
//                       : status === "incomplete"
//                         ? "line-incomplete"
//                         : "line-pending"
//                       }`}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="p-3 accordion-item border mb-4">
//             {/* Step 0 - Basic Info */}
//             {step === 0 && (
//               <div className="accordion-body">
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">Item Type</label>
//                   <div className="d-flex gap-4">
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="itemType"
//                         value="Good"
//                         // checked={itemType === "Good"}
//                         // onChange={() => setItemType("Good")}
//                         checked={formData.itemType === "Good"}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             itemType: e.target.value,
//                           }))
//                         }
//                       />
//                       <label className="form-check-label">Good</label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="itemType"
//                         value="Service"
//                         checked={formData.itemType === "Service"}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             itemType: e.target.value,
//                           }))
//                         }
//                       />
//                       <label className="form-check-label">Service</label>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Conditional Fields */}
//                 {formData.itemType === "Good" ? (
//                   <div className="row">
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("productName")}<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="productName"
//                         className="form-control"
//                         value={formData.productName}
//                         onChange={handleChange}
//                         placeholder={t("enterProductName")}
//                       />
//                     </div>

//                     {/* Slug */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("slug")}<span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         name="slug"
//                         className="form-control"
//                         value={formData.slug}
//                         onChange={handleChange}
//                         placeholder={t("enterSlug")}
//                       />
//                     </div>

//                     <div className="col-sm-6 col-12">
//                       <div className="mb-3 list position-relative">
//                         <label className="form-label">
//                           {t("sku")}<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="sku"
//                           className="form-control"
//                           value={formData.sku}
//                           onChange={(e) => setFormData({...formData, sku:e.target.value})}
//                           placeholder={t("enterSKU")}
//                         />
//                         <button type="submit"  onClick={generateSKU} className="btn btn-primaryadd">
//                           {t("generate")}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Brand */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">{t("brandOrManufacture")}</label>
//                       <Select
//                         options={brandOptions}
//                         value={selectedBrands}
//                         onChange={handleBrandChange}
//                         isSearchable
//                         placeholder={t("searchOrSelectBrands")}
//                       />
//                     </div>

//                     {/* Category */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <label className="form-label">
//                           {t("category")}<span className="text-danger">*</span>
//                         </label>
//                         <a
//                           href="javascript:void(0);"
//                           data-bs-toggle="modal"
//                           data-bs-target="#categoryModal"
//                           onClick={() => {
//                             setCategoryName("");
//                             setCategorySlug("");
//                           }}
//                         >
//                           <i
//                             data-feather="plus-circle"
//                             className="plus-down-add"
//                           />
//                           <span>{t("addNew")}</span>
//                         </a>
//                       </div>
//                       <Select
//                         options={categories}
//                         value={selectedCategory}
//                         onChange={(selected) => {
//                           setSelectedCategory(selected);
//                           setSelectedSubcategory(null);
//                         }}
//                         placeholder={t("searchOrSelectCategory")}
//                       />
//                     </div>

//                     {/* Subcategory */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("subCategory")}<span className="text-danger">*</span>
//                       </label>
//                       <Select
//                         options={subcategories}
//                         value={selectedsubCategory}
//                         onChange={subCategoryChange}
//                         placeholder={t("searchOrSelectSubcategory")}
//                       />
//                     </div>

//                     {/* Supplier */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("supplier")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="supplier"
//                         value={formData.supplier}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="supplier1">{t("supplier1")}</option>
//                         <option value="supplier2">{t("supplier2")}</option>
//                       </select>
//                     </div>

//                     <div className="col-lg-6 col-sm-6 col-12">
//                       <div className="mb-3 list position-relative">
//                         <label className="form-label">
//                           {t("itemBarcode")}
//                           <span className="text-danger ms-1">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           name="itemBarcode"
//                           value={formData.itemBarcode}
//                           readOnly
//                           placeholder={t("itemBarcodePlaceholder")}
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-primaryadd"
//                           onClick={() =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               itemBarcode: generateBarcode(),
//                             }))
//                           }
//                         >
//                           {t("generate")}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Store */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("store")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="store"
//                         value={formData.store}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="India Mart">{t("indiaMart")}</option>
//                         <option value="India Gadgets">{t("indiaGadgets")}</option>
//                       </select>
//                     </div>

//                     {/* Warehouse */}
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">
//                         {t("warehouseOrLocation")}<span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         name="warehouse"
//                         value={formData.warehouse}
//                         onChange={handleChange}
//                       >
//                         <option value="">{t("select")}</option>
//                         <option value="Warehouse1">{t("warehouse1")}</option>
//                       </select>
//                     </div>

//                     {/* Advance Toggle */}
//                     <div
//                       className="d-flex align-items-center mb-4"
//                       style={{ gap: "1rem" }}
//                     >
//                       <label
//                         className="form-label fw-bold mb-0"
//                         htmlFor="advanceSwitch"
//                       >
//                         {t("advance")}
//                       </label>
//                       <div className="form-check form-switch m-0">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="advanceSwitch"
//                           // checked={isAdvanced}
//                           // onChange={() => setIsAdvanced(!isAdvanced)}
//                           checked={formData.isAdvanced}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               isAdvanced: e.target.checked,
//                             }))
//                           }
//                         />
//                       </div>
//                     </div>

//                     {/* Advanced Section */}
//                     {formData.isAdvanced && (
//                       <>
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("leadTime")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterLeadTime")}
//                             name="leadTime"
//                             value={formData.leadTime}
//                             onChange={handleChange}
//                           />
//                         </div>

//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("reorderLevel")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterReorderLevel")}
//                             name="reorderLevel"
//                             value={formData.reorderLevel}
//                             onChange={handleChange}
//                           />
//                         </div>

//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label">{t("initialStock")}</label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder={t("enterInitialStock")}
//                             name="initialStock"
//                             value={formData.initialStock}
//                             onChange={handleChange}
//                           />
//                         </div>

//                         {/* Track Name */}
//                         <div className="col-sm-6 col-12 mb-3">
//                           <label className="form-label fw-bold d-block mb-2">
//                             Track Name
//                           </label>

//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="track"
//                               value="serial"
//                               // checked={trackType === "serial"}
//                               // onChange={() => setTrackType("serial")}
//                               id="serial"
//                               checked={formData.trackType === "serial"}
//                               onChange={(e) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   trackType: e.target.value,
//                                 }))
//                               }
//                             />
//                             <label className="form-check-label" htmlFor="serial">
//                               Serial No
//                             </label>
//                           </div>

//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="track"
//                               value="batch"
//                               // checked={trackType === "batch"}
//                               // onChange={() => setTrackType("batch")}
//                               id="batch"
//                               checked={formData.trackType === "batch"}
//                               onChange={(e) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   trackType: e.target.value,
//                                 }))
//                               }
//                             />
//                             <label className="form-check-label" htmlFor="batch">
//                               Batch No
//                             </label>
//                           </div>

//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="radio"
//                               name="track"
//                               value="status"
//                               // checked={trackType === "status"}
//                               // onChange={() => setTrackType("status")}
//                               id="status"
//                               checked={formData.trackType === "status"}
//                               onChange={(e) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   trackType: e.target.value,
//                                 }))
//                               }
//                             />
//                             <label className="form-check-label" htmlFor="status">
//                               Status
//                             </label>
//                           </div>
//                         </div>

//                         {/* Serial No Input */}
//                         {formData.trackType === "serial" && (
//                           <div className="col-sm-6 col-12 mb-3">
//                             <label className="form-label">{t("serialNo")}</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder={t("enterSerialNumber")}
//                               name="serialNumber"
//                               value={formData.serialNumber}
//                               onChange={handleChange}
//                             />
//                           </div>
//                         )}

//                         {/* Batch No Input */}
//                         {formData.trackType === "batch" && (
//                           <div className="col-sm-6 col-12 mb-3">
//                             <label className="form-label">{t("batchNo")}</label>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder={t("enterBatchNumber")}
//                               name="batchNumber"
//                               value={formData.batchNumber}
//                               onChange={handleChange}
//                             />
//                           </div>
//                         )}

//                         {/* Returnable checkbox */}
//                         {formData.trackType === "status" && (
//                           <div className="form-check mb-3">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id="returnable"
//                               checked={formData.isReturnable}
//                               onChange={(e) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   isReturnable: e.target.checked,
//                                 }))
//                               }
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="returnable"
//                             >
//                               {t("returnable")}
//                             </label>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ) : (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium">
//                         {t("expireDate")}
//                       </label>
//                       <input type="date" className="w-full p-2 border rounded" placeholder={t("enterExpireDate")} />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium">{t("brand")}</label>
//                       <input
//                         type="text"
//                         className="w-full p-2 border rounded"
//                         placeholder={t("enterBrand")}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Step 1 - Pricing */}
//             {step === 1 && (
//               <div className="row">
//                 {[
//                   { label: t("purchasePrice"), name: "purchasePrice" },
//                   { label: t("sellingPrice"), name: "sellingPrice" },
//                   { label: t("wholesalePrice"), name: "wholesalePrice" },
//                   { label: t("retailPrice"), name: "retailPrice" },
//                 ].map((field, idx) => (
//                   <div key={idx} className=" col-sm-6 col-12 mb-3">
//                     <label className="form-label">
//                       {field.label}
//                       <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name={field.name}
//                       value={formData[field.name] || ""}
//                       onChange={handleChange}
//                       placeholder={t(`enter${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`)}
//                     />
//                   </div>
//                 ))}

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("quantity")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="quantity"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     placeholder={t("enterQuantity")}
//                   />
//                 </div>
//                 <div className="col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("unit")}<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     options={unitsOptions}
//                     value={selectedUnits}
//                     onChange={handleUnitChange}
//                     isSearchable
//                     placeholder={t("searchOrSelectUnits")}
//                   />
//                 </div>

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("taxType")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="taxType"
//                     value={formData.taxType}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("exclusive")}</option>
//                     <option>{t("inclusive")}</option>
//                   </select>
//                 </div>

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("taxRate")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="tax"
//                     value={formData.tax}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("igst8")}</option>
//                     <option>{t("gst5")}</option>
//                     <option>{t("sgst4")}</option>
//                     <option>{t("cgst16")}</option>
//                     <option>{t("gst18")}</option>
//                   </select>
//                 </div>

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("discountType")}<span className="text-danger">*</span>
//                   </label>
//                   <select
//                     className="form-select"
//                     name="discountType"
//                     value={formData.discountType}
//                     onChange={handleChange}
//                   >
//                     <option value="">{t("select")}</option>
//                     <option>{t("percentage")}</option>
//                     <option>{t("fixed")}</option>
//                   </select>
//                 </div>

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("discountValue")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="discountValue"
//                     value={formData.discountValue}
//                     onChange={handleChange}
//                     placeholder={t("enterDiscountValue")}
//                   />
//                 </div>

//                 <div className=" col-sm-6 col-12 mb-3">
//                   <label className="form-label">
//                     {t("quantityAlert")}<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="quantityAlert"
//                     value={formData.quantityAlert}
//                     onChange={handleChange}
//                     placeholder={t("enterQuantityAlert")}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Step 2 - Images and SEO */}
//             {step === 2 && (
//               <>
//                 <div
//                   {...getRootProps({
//                     className:
//                       "dropzone p-4 text-center image-upload image-upload-two mb-3",
//                   })}
//                 >
//                   <input {...getInputProps()} />
//                   <MdImageSearch style={{ fontSize: "50px" }} />
//                   <p>Drag your image here, or browse</p>
//                   <p>Supports JPEG, PNG, JPG</p>
//                 </div>

//                 <div className="row mt-3">
//                   {images.map((file, i) => (
//                     <div className="col-3 mb-3" key={i}>
//                       <img
//                         src={file.preview}
//                         className="img-thumbnail"
//                         style={{ height: 120, objectFit: "cover" }}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="col-lg-12 mb-3">
//                   <label>{t("description")}</label>
//                   <textarea
//                     name="description"
//                     className="form-control"
//                     maxLength={300}
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder={t("enterDescription")}
//                   />
//                 </div>

//                 <div className="row">
//                   <div className="col-sm-6 col-12 mb-3">
//                     <label className="form-label">{t("seoMetaTitle")}</label>
//                     <input
//                       type="text"
//                       name="seoTitle"
//                       className="form-control"
//                       value={formData.seoTitle || ""}
//                       onChange={handleChange}
//                       placeholder={t("enterSeoMetaTitle")}
//                     />
//                   </div>
//                   <div className="col-sm-6 col-12 mb-3">
//                     <label className="form-label">{t("seoMetaDescription")}</label>
//                     <input
//                       type="text"
//                       name="seoDescription"
//                       className="form-control"
//                       value={formData.seoDescription || ""}
//                       onChange={handleChange}
//                       placeholder={t("enterSeoMetaDescription")}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Step 3 - Variants */}
//             {step === 3 && (
//               <>
//                 <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
//                   {variantTabs.map((tab) => (
//                     <button
//                       type="button"
//                       key={tab}
//                       className={`variant-tab btn btn-sm ${activeTab === tab
//                         ? "btn-success"
//                         : "btn-outline-secondary"
//                         }`}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="mb-3">
//                   <label>{t("enterVariants", { tab: activeTab })}</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.variants[activeTab]?.join(", ") || ""}
//                     onChange={(e) => inputChange(activeTab, e.target.value)}
//                     placeholder={t("enterVariantsPlaceholder", { tab: activeTab })}
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="mt-4 d-flex justify-content-between">
//             <button
//               type="button"
//               className="btn btn-outline-primary"
//               onClick={handlePrev}
//               disabled={step === 0}
//             >
//               {t("previous")}
//             </button>
//             <div>
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary me-2"
//                 onClick={handleSaveDraft}
//               >
//                 {t("saveAsDraft")}
//               </button>

//               {step < steps.length - 1 ? (
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={() => {
//                     if (validateStep()) {
//                       handleNext();
//                     } else {
//                       toast.error("Please complete all required fields");
//                     }
//                   }}
//                 >
//                   {t("next")}
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   className="btn btn-success"
//                   onClick={(e) => {
//                     if (validateStep()) {
//                       handleSubmit(e); // manually call submit
//                     } else {
//                       toast.error(
//                         "Please complete all required fields before saving"
//                       );
//                     }
//                   }}
//                 >
//                   {t("save")}
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>

//         <CategoryModal
//           modalId="add-category"
//           title="Add Category"
//           categoryName={categoryName}
//           categorySlug={categorySlug}
//           onCategoryChange={(e) => setCategoryName(e.target.value)}
//           onSlugChange={(e) => setCategorySlug(e.target.value)}
//           onSubmit={categorySubmit}
//           submitLabel="Add Category"
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductForm;

// ===================
// semi-colon
// import React, { useEffect, useState } from "react";
// import {
//   TbChevronUp,
//   TbInfoCircle,
//   TbLifebuoy,
//   TbList,
//   TbRefresh,
// } from "react-icons/tb";
// import "../../../../styles/product/product.css";
// import { Link, useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { FiImage } from "react-icons/fi";
// import { CiCirclePlus } from "react-icons/ci";
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../../../../pages/config/config";

// const ProductCreate = () => {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedsubCategory, setSelectedsubCategory] = useState(null);
//   const [selectedBrands, setSelectedBrands] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);

//   const [formData, setFormData] = useState({
//     store: "",
//     warehouse: "",
//     productName: "",
//     slug: "",
//     sku: "",
//     sellingType: "",
//     category: "",
//     subCategory: "",
//     brand: "",
//     unit: "",
//     barcodeSymbology: "",
//     itemBarcode: "",
//     description: "",
//     //
//     productType: "Single", // Default
//     quantity: "",
//     price: "",
//     taxType: "",
//     tax: "",
//     discountType: "",
//     discountValue: "",
//     quantityAlert: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/category/categories`);
//       const data = await res.json();

//       // Map data for react-select
//       const options = data.map((category) => ({
//         value: category._id, // or category.categoryName
//         label: category.categoryName,
//       }));

//       setCategories(options);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };




//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubcategoriesByCategory(selectedCategory.value);
//     } else {
//       setSubcategories([]);
//     }
//   }, [selectedCategory]);

//   const fetchSubcategoriesByCategory = async (categoryId) => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/api/subcategory/by-category/${categoryId}`
//       );
//       const data = await res.json();

//       const options = data.map((subcat) => ({
//         value: subcat._id,
//         label: subcat.subCategoryName,
//       }));
//       setSubcategories(options);
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };
//   const fetchBrands = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/brands/active-brands`);
//       const data = await res.json();

//       const options = data.brands.map((brand) => ({
//         value: brand._id,
//         label: brand.brandName,
//       }));

//       setBrandOptions(options);
//     } catch (error) {
//       console.error("Failed to load active brands:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     // fetchSubcategories();
//     fetchBrands();
//   }, []);


//   const subCategoryChange = (selectedOption) => {
//     setSelectedsubCategory(selectedOption);
//     console.log("Selected subcategory:", selectedOption);
//   };
//   const handleBrandChange = (selectedOption) => {
//     setSelectedBrands(selectedOption);
//     console.log("Selected brands:", selectedOption);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting:", formData); // 🔍 See this in console

//     try {
//       await axios.post(`${BASE_URL}/api/products/create`, formData);
//       toast.success("Product created successfully!");
//       navigate("/product");
//     } catch (error) {
//       toast.error("Failed to create product");
//       console.error(error);
//     }
//   };

//   const generateBarcode = () => {
//     const prefix = "BR"; // Optional
//     const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
//     return `${prefix}${randomNumber}`;
//   };


//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Create Product</h4>
//               <h6>Create new product</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Refresh"
//                 className="icon-btn"
//               >
//                 <TbRefresh />
//               </button>
//             </li>
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Collapse"
//                 id="collapse-header"
//                 className="icon-btn"
//               >
//                 <TbChevronUp />
//               </button>
//             </li>
//           </div>

//           <div className="page-btn mt-0">
//             <button className="btn btn-secondary">
//               <Link to="back"></Link>back to product
//             </button>
//           </div>
//         </div>

//         <form className="add-product-form" onSubmit={handleSubmit}>
//           <div className="add-product">
//             <div
//               className="accordions-items-seperate"
//               id="accordionSpacingExample"
//             >
//               {/* product */}
//               <div className="accordion-item border mb-4">
//                 <h2 className="accordion-header" id="headingSpacingOne">
//                   <div
//                     className="accordion-button collapsed bg-white"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#SpacingOne"
//                     aria-expanded="true"
//                     aria-controls="SpacingOne"
//                   >
//                     <div className="d-flex align-items-center justify-content-between flex-fill">
//                       <h5 className="d-flex align-items-center">
//                         <TbInfoCircle className="text-primary me-2" />
//                         <span>Product Information</span>
//                       </h5>
//                     </div>
//                   </div>
//                 </h2>
//                 <div
//                   id="SpacingOne"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="headingSpacingOne"
//                 >
//                   <div className="accordion-body border-top">
//                     <div className="row">
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Store<span className="text-danger ms-1">*</span>
//                           </label>
//                           <select
//                             className="form-select"
//                             name="store"
//                             onChange={handleChange}
//                             value={formData.store}
//                           >
//                             <option>Select</option>
//                             <option>Electro Mart</option>
//                             <option>Quantum Gadgets</option>
//                             <option>Gadget World</option>
//                             <option>Volt Vault</option>
//                             <option>Elite Retail</option>
//                             <option>Prime Mart</option>
//                             <option>NeoTech Store</option>
//                           </select>
//                         </div>
//                         {/* <div className="mb-3">
//                           <label className="form-label">
//                             Store<span className="text-danger ms-1">*</span>
//                           </label>
//                           <Select
//                             options={storeOptions}
//                             classNamePrefix="react-select"
//                             defaultValue={storeOptions[0]}
//                           />
//                         </div> */}
//                       </div>
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Warehouse<span className="text-danger ms-1">*</span>
//                           </label>
//                           <select
//                             className="form-select"
//                             name="warehouse"
//                             onChange={handleChange}
//                             value={formData.warehouse}
//                           >
//                             <option>Select</option>
//                             <option>Lavish Warehouse</option>
//                             <option>Quaint Warehouse</option>
//                             <option>Traditional Warehouse</option>
//                             <option>Cool Warehouse</option>
//                             <option>Overflow Warehouse</option>
//                             <option>Nova Storage Hub</option>
//                             <option>Retail Supply Hub</option>
//                             <option>EdgeWare Solutions</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Product Name
//                             <span className="text-danger ms-1">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="productName"
//                             className="form-control"
//                             onChange={handleChange}
//                             value={formData.productName}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Slug<span className="text-danger ms-1">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="slug"
//                             className="form-control"
//                             onChange={handleChange}
//                             value={formData.slug}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3 list position-relative">
//                           <label className="form-label">
//                             SKU<span className="text-danger ms-1">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             name="sku"
//                             className="form-control list"
//                             onChange={handleChange}
//                             value={formData.sku}
//                           />
//                           <button type="submit" className="btn btn-primaryadd">
//                             Generate
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Selling Type
//                             <span className="text-danger ms-1">*</span>
//                           </label>
//                           <select
//                             className="form-select"
//                             name="sellingType"
//                             onChange={handleChange}
//                             value={formData.sellingType}
//                           >
//                             <option>Select</option>
//                             <option>Online</option>
//                             <option>POS</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="addservice-info">
//                       <div className="row">
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <div className="add-newplus">
//                               <label className="form-label">
//                                 Category
//                                 <span className="text-danger ms-1">*</span>
//                               </label>
//                               <a
//                                 href="javascript:void(0);"
//                                 data-bs-toggle="modal"
//                                 data-bs-target="#add-product-category"
//                               >
//                                 <i
//                                   data-feather="plus-circle"
//                                   className="plus-down-add"
//                                 />
//                                 <span>Add New</span>
//                               </a>
//                             </div>
//                             <Select
//                               // id="category"
//                               // options={categories}
//                               // value={selectedCategory}
//                               // onChange={handleCategoryChange}
//                               // isSearchable
//                               // placeholder="Search or select category..."
//                               options={categories}
//                               value={selectedCategory}
//                               onChange={(selected) => {
//                                 setSelectedCategory(selected);
//                                 setSelectedSubcategory(null); // reset subcategory
//                               }}
//                               placeholder="Search or select category..."
//                             />
//                             {/* <select className="form-select" name="category" onChange={handleChange} value={formData.category}>
//                               <option>Select</option>
//                               <option>Computers</option>
//                               <option>Electronics</option>
//                               <option>Shoe</option>
//                               <option>Cosmetics</option>
//                               <option>Groceries</option>
//                               <option>Furniture</option>
//                               <option>Bags</option>
//                               <option>Phone</option>
//                             </select> */}
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Sub Category
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <Select
//                               id="subcategory"
//                               options={subcategories}
//                               value={selectedsubCategory}
//                               onChange={subCategoryChange}
//                               isSearchable
//                               placeholder="Search or select subcategory..."
//                             />
//                             {/* <select
//                               className="form-select"
//                               name="subCategory"
//                               onChange={handleChange}
//                               value={formData.subCategory}
//                             >
//                               <option>Select</option>
//                               <option>Laptop</option>
//                               <option>Desktop</option>
//                               <option>Sneakers</option>
//                               <option>Formals</option>
//                               <option>Wearables</option>
//                               <option>Speakers</option>
//                               <option>Handbags</option>
//                               <option>Travel</option>
//                               <option>Sofa</option>
//                             </select> */}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="add-product-new">
//                       <div className="row">
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <div className="add-newplus">
//                               <label className="form-label">
//                                 Brand<span className="text-danger ms-1">*</span>
//                               </label>
//                             </div>
//                             <Select
//                               id="brands"
//                               options={brandOptions}
//                               value={selectedBrands}
//                               onChange={handleBrandChange}
//                               isSearchable
//                               placeholder="Search or select brands..."
//                             />
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <div className="add-newplus">
//                               <label className="form-label">
//                                 Unit<span className="text-danger ms-1">*</span>
//                               </label>
//                             </div>
//                             <select
//                               name="unit"
//                               className="form-select"
//                               onChange={handleChange}
//                               value={formData.unit}
//                             >
//                               <option>Select</option>
//                               <option>Kg</option>
//                               <option>Pcs</option>
//                               <option>L</option>
//                               <option>dz</option>
//                               <option>bx</option>
//                             </select>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-6">
//                         <div className="mb-3">
//                           <div className="add-newplus">
//                             <label className="form-label">
//                               Barcode Symbology
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                           </div>
//                           <select
//                             name="barcodeSymbology"
//                             className="form-select"
//                             onChange={handleChange}
//                             value={formData.barcodeSymbology}
//                           >
//                             <option>Select</option>
//                             <option>Code 128</option>
//                             <option>Code 39</option>
//                             <option>UPC-A</option>
//                             <option>UPC_E</option>
//                             <option>EAN-8</option>
//                             <option>EAN-13</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Barcode Symbology
//                           </label>
//                           <select className="form-select">
//                             <option>Choose</option>
//                             <option>Code 128</option>
//                             <option>Code 39</option>
//                             <option>UPC-A</option>
//                             <option>UPC-E</option>
//                             <option>EAN-8</option>
//                             <option>EAN-13</option>
//                           </select>
//                         </div>
//                       </div>
//                       {/* <div className="col-lg-6 col-sm-6 col-12">
//                         <div className="mb-3 list position-relative">
//                           <label className="form-label">
//                             Item Barcode
//                             <span className="text-danger ms-1">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control list"
//                             name="itemBarcode"
//                             onChange={handleChange}
//                             value={formData.itemBarcode}
//                           />
//                           <button type="submit" className="btn btn-primaryadd">
//                             Generate
//                           </button>
//                         </div>
//                       </div> */}
//                       <div className="col-lg-6 col-sm-6 col-12">
//                         <div className="mb-3 list position-relative">
//                           <label className="form-label">
//                             Item Barcode
//                             <span className="text-danger ms-1">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control list"
//                             name="itemBarcode"
//                             onChange={handleChange}
//                             value={formData.itemBarcode}
//                             readOnly // Optional: prevent user editing after generate
//                           />
//                           <button
//                             type="button"
//                             className="btn btn-primaryadd"
//                             onClick={() => {
//                               const barcode = generateBarcode();
//                               setFormData((prev) => ({ ...prev, itemBarcode: barcode }));
//                             }}
//                           >
//                             Generate
//                           </button>
//                         </div>
//                       </div>

//                     </div>
//                     {/* Editor */}
//                     <div className="col-lg-12">
//                       <label>Description</label>
//                       <textarea
//                         name="description"
//                         className="form-control"
//                         maxLength={300}
//                         onChange={handleChange}
//                         value={formData.description}
//                       />
//                       {/* <div className="summer-description-box">
//                         <label className="form-label">Description</label>
//                         <div id="summernote" />
//                         <p className="fs-14 mt-1">Maximum 60 Words</p>
//                       </div> */}
//                     </div>
//                     {/* /Editor */}
//                   </div>
//                 </div>
//               </div>
//               {/* pricing */}
//               <div className="accordion-item border mb-4">
//                 <h2 className="accordion-header" id="headingSpacingTwo">
//                   <div
//                     className="accordion-button collapsed bg-white"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#SpacingTwo"
//                     aria-expanded="true"
//                     aria-controls="SpacingTwo"
//                   >
//                     <div className="d-flex align-items-center justify-content-between flex-fill">
//                       <h5 className="d-flex align-items-center">
//                         <TbLifebuoy className="text-primary me-2" />

//                         <span>Pricing &amp; Stocks</span>
//                       </h5>
//                     </div>
//                   </div>
//                 </h2>
//                 <div
//                   id="SpacingTwo"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="headingSpacingTwo"
//                 >
//                   <div className="accordion-body border-top">
//                     <div className="mb-3s">
//                       <label className="form-label">
//                         Product Type<span className="text-danger ms-1">*</span>
//                       </label>
//                       <div className="single-pill-product mb-3">
//                         <ul
//                           className="nav nav-pills"
//                           id="pills-tab1"
//                           role="tablist"
//                         >
//                           <li className="nav-item" role="presentation">
//                             <span
//                               className="custom_radio me-4 mb-0 active"
//                               id="pills-home-tab"
//                               data-bs-toggle="pill"
//                               data-bs-target="#pills-home"
//                               role="tab"
//                               aria-controls="pills-home"
//                               aria-selected="true"
//                             >
//                               <input
//                                 type="radio"
//                                 name="productType"
//                                 value="Single"
//                                 checked={formData.productType === "Single"}
//                                 onChange={handleChange}
//                               />
//                               <span className="checkmark" /> Single Product
//                             </span>
//                           </li>
//                           <li className="nav-item" role="presentation">
//                             <span
//                               className="custom_radio me-2 mb-0"
//                               id="pills-profile-tab"
//                               data-bs-toggle="pill"
//                               data-bs-target="#pills-profile"
//                               role="tab"
//                               aria-controls="pills-profile"
//                               aria-selected="false"
//                             >
//                               <input
//                                 type="radio"
//                                 name="productType"
//                                 value="Variable"
//                                 checked={formData.productType === "Variable"}
//                                 onChange={handleChange}
//                               />
//                               <span className="checkmark" /> Variable Product
//                             </span>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="tab-content" id="pills-tabContent">
//                       {/* single product */}
//                       <div
//                         // className="tab-pane fade show active"
//                         // id="pills-home"
//                         // role="tabpanel"
//                         // aria-labelledby="pills-home-tab"
//                         className="tab-pane fade show active"
//                         id="pills-home"
//                       >
//                         {formData.productType === "Single" && (
//                           <div className="single-product">
//                             <div className="row">
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Quantity
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="quantity"
//                                     value={formData.quantity}
//                                     onChange={handleChange}
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Price
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="price"
//                                     value={formData.price}
//                                     onChange={handleChange}
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Tax Type
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <select
//                                     className="form-select"
//                                     name="taxType"
//                                     value={formData.taxType}
//                                     onChange={handleChange}
//                                   >
//                                     <option>Select</option>
//                                     <option>Exclusive</option>
//                                     <option>Inclusive</option>
//                                   </select>
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Tax
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <select
//                                     className="form-select"
//                                     name="tax"
//                                     value={formData.tax}
//                                     onChange={handleChange}
//                                   >
//                                     <option>Select</option>
//                                     <option>IGST (8%)</option>
//                                     <option>GST (5%)</option>
//                                     <option>SGST (4%)</option>
//                                     <option>CGST (16%)</option>
//                                     <option>Gst 18%</option>
//                                   </select>
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Discount Type
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <select
//                                     className="form-select"
//                                     name="discountType"
//                                     value={formData.discountType}
//                                     onChange={handleChange}
//                                   >
//                                     <option>Select</option>
//                                     <option>Percentage</option>
//                                     <option>Fixed</option>
//                                   </select>
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Discount Value
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <input
//                                     className="form-control"
//                                     type="text"
//                                     name="discountValue"
//                                     value={formData.discountValue}
//                                     onChange={handleChange}
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-sm-6 col-12">
//                                 <div className="mb-3">
//                                   <label className="form-label">
//                                     Quantity Alert
//                                     <span className="text-danger ms-1">*</span>
//                                   </label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     name="quantityAlert"
//                                     value={formData.quantityAlert}
//                                     onChange={handleChange}
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* varient product */}
//                       <div
//                         className="tab-pane fade"
//                         id="pills-profile"
//                         role="tabpanel"
//                         aria-labelledby="pills-profile-tab"
//                       >
//                         <div className="row select-color-add">
//                           <div className="col-lg-6 col-sm-6 col-12">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 Variant Attribute{" "}
//                                 <span className="text-danger ms-1">*</span>
//                               </label>
//                               <div className="row">
//                                 <div className="col-lg-10 col-sm-10 col-10">
//                                   <select
//                                     className="form-control variant-select select-option"
//                                     id="colorSelect"
//                                   >
//                                     <option>Choose</option>
//                                     <option>Color</option>
//                                     <option value="red">Red</option>
//                                     <option value="black">Black</option>
//                                   </select>
//                                 </div>
//                                 <div className="col-lg-2 col-sm-2 col-2 ps-0">
//                                   <div className="add-icon tab">
//                                     <a
//                                       className="btn btn-filter"
//                                       data-bs-toggle="modal"
//                                       data-bs-target="#add-product-category"
//                                     >
//                                       <i className="feather feather-plus-circle" />
//                                     </a>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div
//                               className="selected-hide-color"
//                               id="input-show"
//                             >
//                               <label className="form-label">
//                                 Variant Attribute{" "}
//                                 <span className="text-danger ms-1">*</span>
//                               </label>
//                               <div className="row align-items-center">
//                                 <div className="col-lg-10 col-sm-10 col-10">
//                                   <div className="mb-3">
//                                     <input
//                                       className="input-tags form-control"
//                                       id="inputBox"
//                                       type="text"
//                                       data-role="tagsinput"
//                                       name="specialist"
//                                       defaultValue="red, black"
//                                     />
//                                   </div>
//                                 </div>
//                                 <div className="col-lg-2 col-sm-2 col-2 ps-0">
//                                   <div className="mb-3 ">
//                                     <a
//                                       href="javascript:void(0);"
//                                       className="remove-color"
//                                     >
//                                       <i className="far fa-trash-alt" />
//                                     </a>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div
//                           className="modal-body-table border"
//                           id="variant-table"
//                         >
//                           <div className="table-responsive">
//                             <table className="table border">
//                               <thead>
//                                 <tr>
//                                   <th>Variantion</th>
//                                   <th>Variant Value</th>
//                                   <th>SKU</th>
//                                   <th>Quantity</th>
//                                   <th>Price</th>
//                                   <th className="no-sort" />
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 <tr>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue="color"
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue="red"
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue={1234}
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="product-quantity">
//                                       <span className="quantity-btn">
//                                         <i
//                                           data-feather="minus-circle"
//                                           className="feather-search"
//                                         />
//                                       </span>
//                                       <input
//                                         type="text"
//                                         className="quntity-input form-control"
//                                         defaultValue={2}
//                                       />
//                                       <span className="quantity-btn">
//                                         +
//                                         <i
//                                           data-feather="plus-circle"
//                                           className="plus-circle"
//                                         />
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue={50000}
//                                       />
//                                     </div>
//                                   </td>
//                                   <td className="action-table-data">
//                                     <div className="edit-delete-action">
//                                       <div className="input-block add-lists">
//                                         <label className="checkboxs">
//                                           <input
//                                             type="checkbox"
//                                             defaultChecked
//                                           />
//                                           <span className="checkmarks" />
//                                         </label>
//                                       </div>
//                                       <a
//                                         className="me-2 p-2"
//                                         href="javascript:void(0);"
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#add-variation"
//                                       >
//                                         <i
//                                           data-feather="plus"
//                                           className="feather-edit"
//                                         />
//                                       </a>
//                                       <a
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#delete-modal"
//                                         className="p-2"
//                                         href="javascript:void(0);"
//                                       >
//                                         <i
//                                           data-feather="trash-2"
//                                           className="feather-trash-2"
//                                         />
//                                       </a>
//                                     </div>
//                                   </td>
//                                 </tr>
//                                 <tr>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue="color"
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue="black"
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue={2345}
//                                       />
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="product-quantity">
//                                       <span className="quantity-btn">
//                                         <i
//                                           data-feather="minus-circle"
//                                           className="feather-search"
//                                         />
//                                       </span>
//                                       <input
//                                         type="text"
//                                         className="quntity-input form-control"
//                                         defaultValue={3}
//                                       />
//                                       <span className="quantity-btn">
//                                         +
//                                         <i
//                                           data-feather="plus-circle"
//                                           className="plus-circle"
//                                         />
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="add-product">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         defaultValue={50000}
//                                       />
//                                     </div>
//                                   </td>
//                                   <td className="action-table-data">
//                                     <div className="edit-delete-action">
//                                       <div className="input-block add-lists">
//                                         <label className="checkboxs">
//                                           <input
//                                             type="checkbox"
//                                             defaultChecked
//                                           />
//                                           <span className="checkmarks" />
//                                         </label>
//                                       </div>
//                                       <a
//                                         className="me-2 p-2"
//                                         href="#"
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#add-variation"
//                                       >
//                                         <i
//                                           data-feather="plus"
//                                           className="feather-edit"
//                                         />
//                                       </a>
//                                       <a
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#delete-modal"
//                                         className="p-2"
//                                         href="javascript:void(0);"
//                                       >
//                                         <i
//                                           data-feather="trash-2"
//                                           className="feather-trash-2"
//                                         />
//                                       </a>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* image */}
//               <div className="accordion-item border mb-4">
//                 <h2 className="accordion-header" id="headingSpacingThree">
//                   <div
//                     className="accordion-button collapsed bg-white"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#SpacingThree"
//                     aria-expanded="true"
//                     aria-controls="SpacingThree"
//                   >
//                     <div className="d-flex align-items-center justify-content-between flex-fill">
//                       <h5 className="d-flex align-items-center">
//                         <FiImage className="text-primary me-2" />
//                         <span>Images</span>
//                       </h5>
//                     </div>
//                   </div>
//                 </h2>
//                 <div
//                   id="SpacingThree"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="headingSpacingThree"
//                 >
//                   <div className="accordion-body border-top">
//                     <div className="text-editor add-list add">
//                       <div className="col-lg-12">
//                         <div className="add-choosen">
//                           <div className="mb-3">
//                             <div className="image-upload image-upload-two">
//                               <input
//                                 type="file"
//                               //   multiple
//                               //  onChange={handleImageChange}
//                               />
//                               <div className="image-uploads">
//                                 <CiCirclePlus className="plus-down-add me-0" />
//                                 <h4>Add Images</h4>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="phone-img">
//                             <img
//                               src="assets/img/products/phone-add-2.png"
//                               alt="image"
//                             />
//                             <a href="javascript:void(0);">
//                               <i
//                                 data-feather="x"
//                                 className="x-square-add remove-product"
//                               />
//                             </a>
//                           </div>
//                           <div className="phone-img">
//                             <img
//                               src="assets/img/products/phone-add-1.png"
//                               alt="image"
//                             />
//                             <a href="javascript:void(0);">
//                               <i
//                                 data-feather="x"
//                                 className="x-square-add remove-product"
//                               />
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* custom filed */}
//               <div className="accordion-item border mb-4">
//                 <h2 className="accordion-header" id="headingSpacingFour">
//                   <div
//                     className="accordion-button collapsed bg-white"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#SpacingFour"
//                     aria-expanded="true"
//                     aria-controls="SpacingFour"
//                   >
//                     <div className="d-flex align-items-center justify-content-between flex-fill">
//                       <h5 className="d-flex align-items-center">
//                         <TbList className="text-primary me-2" />
//                         <span>Custom Fields</span>
//                       </h5>
//                     </div>
//                   </div>
//                 </h2>
//                 <div
//                   id="SpacingFour"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="headingSpacingFour"
//                 >
//                   <div className="accordion-body border-top">
//                     <div>
//                       <div className="p-3 bg-light rounded d-flex align-items-center border mb-3">
//                         <div className=" d-flex align-items-center">
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id="warranties"
//                               defaultValue="option1"
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="warranties"
//                             >
//                               Warranties
//                             </label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id="manufacturer"
//                               defaultValue="option2"
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="manufacturer"
//                             >
//                               Manufacturer
//                             </label>
//                           </div>
//                           <div className="form-check form-check-inline">
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id="expiry"
//                               defaultValue="option2"
//                             />
//                             <label
//                               className="form-check-label"
//                               htmlFor="expiry"
//                             >
//                               Expiry
//                             </label>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Warranty
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <select className="form-select">
//                               <option>Select</option>
//                               <option>Replacement Warranty</option>
//                               <option>On-Site Warranty</option>
//                               <option>Accidental Protection Plan</option>
//                             </select>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3 add-product">
//                             <label className="form-label">
//                               Manufacturer
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <input type="text" className="form-control" />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="row">
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Manufactured Date
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <div className="input-groupicon calender-input">
//                               <i data-feather="calendar" className="info-img" />
//                               <input
//                                 type="text"
//                                 className="datetimepicker form-control"
//                                 placeholder="dd/mm/yyyy"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Expiry On
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <div className="input-groupicon calender-input">
//                               <i data-feather="calendar" className="info-img" />
//                               <input
//                                 type="text"
//                                 className="datetimepicker form-control"
//                                 placeholder="dd/mm/yyyy"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* action button */}
//           <div className="col-lg-12">
//             <div className="d-flex align-items-center justify-content-end mb-4">
//               <button type="button" className="btn btn-secondary me-2">
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductCreate;

