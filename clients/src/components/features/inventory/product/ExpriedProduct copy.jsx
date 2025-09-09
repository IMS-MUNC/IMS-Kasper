// import React, { useState } from "react";
// import "./product.css";

// const steps = ["Description & Media", "Pricing", "Images", "Variants"];
// const variantTabs = [
//   "Color", "Size", "Expiry", "Material", "Model",
//   "Weight", "Skin type", "Packaging type", "Flavour", "Gender"
// ];

// const ProductForm = () => {
//   const [step, setStep] = useState(0); // Start from Step 0
//   const [formData, setFormData] = useState({});
//   const [activeTab, setActiveTab] = useState("Color");

//   const handleNext = () => {
//     if (step < steps.length - 1) setStep((prev) => prev + 1);
//   };

//   const handlePrev = () => {
//     if (step > 0) setStep((prev) => prev - 1);
//   };

//   const handleSaveDraft = () => alert("Saved as Draft!");
//   const handleSubmit = () => alert("Saved Product!");

//   const handleInputChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="container mt-4">
//       {/* Step Progress Bar */}
//       <h5 className="mb-3">{steps[step]}</h5>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         {steps.map((label, index) => (
//           <div key={index} className={`step-indicator ${index <= step ? "active" : ""}`}>
//             <div className="circle">{index + 1}</div>
//             <div className="step-label">{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="p-3 bg-white rounded shadow-sm">
//         {step === 3 ? (
//           <>
//             {/* Variants Tab Section */}
//             <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
//               {variantTabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`variant-tab btn btn-sm ${activeTab === tab ? "btn-success" : "btn-outline-secondary"}`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//               <button className="btn btn-outline-primary btn-sm">+ Add More</button>
//             </div>

//             <div>
//               <label className="form-label">Select {activeTab}</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 value={formData[activeTab] || ""}
//                 onChange={(e) => handleInputChange(activeTab, e.target.value)}
//                 placeholder={`Enter ${activeTab}`}
//               />
//             </div>
//           </>
//         ) : (
//           <p>This is step content for <strong>{steps[step]}</strong>.</p>
//         )}
//       </div>

//       {/* Bottom Navigation Buttons */}
//       <div className="mt-4 d-flex justify-content-between">
//         <button className="btn btn-outline-primary" onClick={handlePrev} disabled={step === 0}>
//           Previous
//         </button>
//         <div>
//           <button className="btn btn-outline-secondary me-2" onClick={handleSaveDraft}>
//             Save as draft
//           </button>
//           {step < steps.length - 1 ? (
//             <button className="btn btn-primary" onClick={handleNext}>
//               Next
//             </button>
//           ) : (
//             <button className="btn btn-success" onClick={handleSubmit}>
//               Save
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;

// import React, { useEffect, useState } from "react";
// import "./product.css";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../../../../pages/config/config";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { TbInfoCircle } from "react-icons/tb";

// const steps = ["Description & Media", "Pricing", "Images", "Variants"];
// const variantTabs = [
//   "Color", "Size", "Expiry", "Material", "Model",
//   "Weight", "Skin type", "Packaging type", "Flavour", "Gender"
// ];

// const ProductForm = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(0);
//   const [stepStatus, setStepStatus] = useState(Array(steps.length).fill("pending"));
//   const [activeTab, setActiveTab] = useState("Color");

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//   const [selectedBrand, setSelectedBrand] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);

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
//     productType: "Single",
//     quantity: "",
//     price: "",
//     taxType: "",
//     tax: "",
//     discountType: "",
//     discountValue: "",
//     quantityAlert: "",
//     variants: {}, // Object to store dynamic variant values
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleInputChange = (key, value) => {
//     if (step === 3) {
//       setFormData((prev) => ({
//         ...prev,
//         variants: { ...prev.variants, [key]: value }
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [key]: value }));
//     }
//   };

//   const validateStep = () => {
//     if (step === 3) {
//       return !!formData.variants[activeTab];
//     }
//     return true;
//   };

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

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/category/categories`);
//       const data = await res.json();
//       const options = data.map((category) => ({
//         value: category._id,
//         label: category.categoryName,
//       }));
//       setCategories(options);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubcategoriesByCategory = async (categoryId) => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/subcategory/by-category/${categoryId}`);
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
//     fetchBrands();
//   }, []);

//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubcategoriesByCategory(selectedCategory.value);
//       setFormData((prev) => ({ ...prev, category: selectedCategory.value }));
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (selectedSubcategory) {
//       setFormData((prev) => ({ ...prev, subCategory: selectedSubcategory.value }));
//     }
//   }, [selectedSubcategory]);

//   useEffect(() => {
//     if (selectedBrand) {
//       setFormData((prev) => ({ ...prev, brand: selectedBrand.value }));
//     }
//   }, [selectedBrand]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/products/create`, formData);
//       toast.success("Product created successfully!");
//       navigate("/product");
//     } catch (error) {
//       toast.error("Failed to create product");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h5 className="mb-3">{steps[step]}</h5>

//       {/* Progress Bar */}
//       <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
//         {steps.map((label, index) => {
//           const status = stepStatus[index];
//           const isActive = index === step;
//           const isComplete = status === "complete";
//           const isIncomplete = status === "incomplete";

//           return (
//             <div key={index} className="step-wrapper">
//               <div className={`circle ${isComplete ? "complete" : isIncomplete ? "incomplete" : isActive ? "active" : ""}`}>
//                 {index + 1}
//               </div>
//               <div className="step-text">{label}</div>
//               {index < steps.length - 1 && (
//                 <div className={`progress-line ${status === "complete" ? "line-complete" : status === "incomplete" ? "line-incomplete" : "line-pending"}`} />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Step Content */}
//       <div className="p-3 bg-white rounded shadow-sm">
//         {step === 3 ? (
//           <>
//             <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
//               {variantTabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`variant-tab btn btn-sm ${activeTab === tab ? "btn-success" : "btn-outline-secondary"}`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//               <button className="btn btn-outline-primary btn-sm">+ Add More</button>
//             </div>

//             <div>
//               <label className="form-label">Select {activeTab}</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 value={formData.variants[activeTab] || ""}
//                 onChange={(e) => handleInputChange(activeTab, e.target.value)}
//                 placeholder={`Enter ${activeTab}`}
//               />
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Example Accordion Section: Description */}
//             <div className="accordion-item border mb-4">
//               <h2 className="accordion-header" id="headingSpacingOne">
//                 <div
//                   className="accordion-button collapsed bg-white"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#SpacingOne"
//                   aria-expanded="true"
//                   aria-controls="SpacingOne"
//                 >
//                   <div className="d-flex align-items-center justify-content-between flex-fill">
//                     <h5 className="d-flex align-items-center">
//                       <TbInfoCircle className="text-primary me-2" />
//                       <span>Product Information</span>
//                     </h5>
//                   </div>
//                 </div>
//               </h2>
//               <div id="SpacingOne" className="accordion-collapse collapse show">
//                 <div className="accordion-body border-top">
//                   <div className="row">
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">Store *</label>
//                       <select name="store" className="form-select" value={formData.store} onChange={handleChange}>
//                         <option value="">Select</option>
//                         <option>Electro Mart</option>
//                         <option>Quantum Gadgets</option>
//                         <option>Gadget World</option>
//                       </select>
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">Warehouse *</label>
//                       <select name="warehouse" className="form-select" value={formData.warehouse} onChange={handleChange}>
//                         <option value="">Select</option>
//                         <option>Lavish Warehouse</option>
//                         <option>Cool Warehouse</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="row">
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">Product Name *</label>
//                       <input type="text" name="productName" className="form-control" value={formData.productName} onChange={handleChange} />
//                     </div>
//                     <div className="col-sm-6 col-12 mb-3">
//                       <label className="form-label">Slug *</label>
//                       <input type="text" name="slug" className="form-control" value={formData.slug} onChange={handleChange} />
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label>Description</label>
//                     <textarea name="description" className="form-control" maxLength={300} value={formData.description} onChange={handleChange} />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Category</label>
//                     <Select
//                       options={categories}
//                       value={selectedCategory}
//                       onChange={setSelectedCategory}
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Sub Category</label>
//                     <Select
//                       options={subcategories}
//                       value={selectedSubcategory}
//                       onChange={setSelectedSubcategory}
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Brand</label>
//                     <Select
//                       options={brandOptions}
//                       value={selectedBrand}
//                       onChange={setSelectedBrand}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Footer Buttons */}
//       <div className="mt-4 d-flex justify-content-between">
//         <button className="btn btn-outline-primary" onClick={handlePrev} disabled={step === 0}>
//           Previous
//         </button>
//         <div>
//           <button className="btn btn-outline-secondary me-2" onClick={handleSaveDraft}>
//             Save as draft
//           </button>
//           {step < steps.length - 1 ? (
//             <button className="btn btn-primary" onClick={handleNext}>
//               Next
//             </button>
//           ) : (
//             <button className="btn btn-success" onClick={handleSubmit}>
//               Save
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
import React, { useEffect, useState } from "react";
import "./product.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import axios from "axios";
import { toast } from "react-toastify";
import { TbInfoCircle } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { CiCirclePlus } from "react-icons/ci";
import { MdImageSearch } from "react-icons/md";

const steps = ["Description & Media", "Pricing", "Images", "Variants"];
const variantTabs = [
  "Color",
  "Size",
  "Expiry",
  "Material",
  "Model",
  "Weight",
  "Skin type",
  "Packaging type",
  "Flavour",
  "Gender",
];

const ProductForm = () => {
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
    return formData.productName ;
  }
  if (step === 1) {
    return formData.purchasePrice && formData.sellingPrice && formData.wholesalePrice ;
     
           
  }
  if (step === 2) {
    return images.length > 0 && formData.description;
  }
  if (step === 3) {
    return formData.variants[activeTab]?.length > 0;
  }
  return true;
};


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


  // const onDrop = (acceptedFiles) => {
  //   const mapped = acceptedFiles.map((file) =>
  //     Object.assign(file, { preview: URL.createObjectURL(file) })
  //   );
  //   setImages((prev) => [...prev, ...mapped]);
  // };

  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: { "image/*": [] },
  //   onDrop,
  // });


  const [uploadProgress, setUploadProgress] = useState({});

  const simulateUpload = (fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({
        ...prev,
        [fileName]: progress,
      }));
      if (progress >= 100) clearInterval(interval);
    }, 200); // Adjust speed here (200ms per step)
  };

  const onDrop = (acceptedFiles) => {
    const mapped = acceptedFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      simulateUpload(file.name);
      return { file, preview };
    });
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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

   const [formData, setFormData] = useState({
    store: "",
    warehouse: "",
    productName: "",
    slug: "",
    sku: "",
    sellingType: "",
    category: "",
    subCategory: "",
    brand: "",
    unit: "",
    barcodeSymbology: "",
    itemBarcode: "",
    description: "",
    productType: "Single",
    quantity: "",
    price: "",
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: "",
    quantityAlert: "",
    variants: {}
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`);
      const data = await res.json();

      // Map data for react-select
      const options = data.map((category) => ({
        value: category._id, // or category.categoryName
        label: category.categoryName,
      }));

      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory.value);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/subcategory/by-category/${categoryId}`
      );
      const data = await res.json();

      const options = data.map((subcat) => ({
        value: subcat._id,
        label: subcat.subCategoryName,
      }));
      setSubcategories(options);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/brands/active-brands`);
      const data = await res.json();

      const options = data.brands.map((brand) => ({
        value: brand._id,
        label: brand.brandName,
      }));

      setBrandOptions(options);
    } catch (error) {
      console.error("Failed to load active brands:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    // fetchSubcategories();
    fetchBrands();
  }, []);

  const subCategoryChange = (selectedOption) => {
    setSelectedsubCategory(selectedOption);
    console.log("Selected subcategory:", selectedOption);
  };
  const handleBrandChange = (selectedOption) => {
    setSelectedBrands(selectedOption);
    console.log("Selected brands:", selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData); // 🔍 See this in console

    try {
      await axios.post(`${BASE_URL}/api/products/create`, formData);
      toast.success("Product created successfully!");
      navigate("/product");
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    }
  };

  const generateBarcode = () => {
    const prefix = "BR"; // Optional
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  return (
    <div className="page-wrapper mt-4">
      <h5 className="mb-3">{steps[step]}</h5>

      <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
        {steps.map((label, index) => {
          const status = stepStatus[index];
          const isActive = index === step;
          const isComplete = status === "complete";
          const isIncomplete = status === "incomplete";

          return (
            <div key={index} className="step-wrapper">
              <div
                className={`circle ${
                  isComplete
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
                  className={`progress-line ${
                    status === "complete"
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
      {/* <form onSubmit={handleSubmit}>
        <div className="p-3 accordion-item border mb-4">
          {step === 0 && (
       
            <div className="accordion-body ">
        
              <div className="row">
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Product Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.productName}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Slug<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.slug}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3 list position-relative">
                    <label className="form-label">
                      SKU<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      className="form-control list"
                      onChange={handleChange}
                      value={formData.sku}
                    />
                    <button type="submit" className="btn btn-primaryadd">
                      Generate
                    </button>
                  </div>
                </div>

                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <div className="add-newplus">
                      <label className="form-label">Brand / Manufacture</label>
                    </div>
                    <Select
                      id="brands"
                      options={brandOptions}
                      value={selectedBrands}
                      onChange={handleBrandChange}
                      isSearchable
                      placeholder="Search or select brands..."
                    />
                  </div>
                </div>

                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <div className="add-newplus">
                      <label className="form-label">
                        Category
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <a
                        href="javascript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#add-product-category"
                      >
                        <i
                          data-feather="plus-circle"
                          className="plus-down-add"
                        />
                        <span>Add New</span>
                      </a>
                    </div>
                    <Select
                      options={categories}
                      value={selectedCategory}
                      onChange={(selected) => {
                        setSelectedCategory(selected);
                        setSelectedSubcategory(null); // reset subcategory
                      }}
                      placeholder="Search or select category..."
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <Select
                      id="subcategory"
                      options={subcategories}
                      value={selectedsubCategory}
                      onChange={subCategoryChange}
                      isSearchable
                      placeholder="Search or select subcategory..."
                    />
                  </div>
                </div>

                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Supplier<span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="Supplier"
                      onChange={handleChange}
                      value={formData.Supplier}
                      isSearchable
                    >
                      <option>Supplier</option>
                      <option>Supplier</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="mb-3 list position-relative">
                    <label className="form-label">
                      Item Barcode
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control list"
                      name="itemBarcode"
                      onChange={handleChange}
                      value={formData.itemBarcode}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-primaryadd"
                      onClick={() => {
                        const barcode = generateBarcode();
                        setFormData((prev) => ({
                          ...prev,
                          itemBarcode: barcode,
                        }));
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Store<span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="store"
                      onChange={handleChange}
                      value={formData.store}
                      isSearchable
                    >
                      <option>Select</option>
                      <option>India Mart</option>
                      <option>india Gadgets</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Warehouse / Location
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="warehouse"
                      onChange={handleChange}
                      value={formData.warehouse}
                      isSearchable
                    >
                      <option>Warehouse</option>
                      <option>Warehouse1</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Supplier<span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="Supplier"
                      onChange={handleChange}
                      value={formData.Supplier}
                      isSearchable
                    >
                      <option>Supplier</option>
                      <option>Supplier</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
         
            <div className="row">
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Purchase Price
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Selling Price
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Wholesale Price
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Quantity
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Tax Type
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleChange}
                  >
                    <option>Select</option>
                    <option>Exclusive</option>
                    <option>Inclusive</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Tax Rate
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                  >
                    <option>Select</option>
                    <option>IGST (8%)</option>
                    <option>GST (5%)</option>
                    <option>SGST (4%)</option>
                    <option>CGST (16%)</option>
                    <option>Gst 18%</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Discount Type
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                  >
                    <option>Select</option>
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Discount Value
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12">
                <div className="mb-3">
                  <label className="form-label">
                    Quantity Alert
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="quantityAlert"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div
                {...getRootProps({
                  className:
                    "dropzone  p-4 text-center image-upload image-upload-two mb-3",
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
                      alt="preview"
                      style={{ height: 120, objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              <div className="col-lg-12 mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  maxLength={300}
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

               <div className="row">
                  <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      SEO Meta Title
                      
                    </label>
                    <input
                      type="text"
                      name="productName"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.productName}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="mb-3">
                    <label className="form-label">
                       SEO Meta Description
                    </label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      onChange={handleChange}
                      value={formData.slug}
                    />
                  </div>
                </div>
               </div>
             
            </>
          )}

          {step === 3 && (
            <>
              <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
                {variantTabs.map((tab) => (
                  <button
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
                <label>Enter {activeTab} Variants (comma separated)</label>
                <input
                  className="form-control"
                  value={formData.variants[activeTab]?.join(", ") || ""}
                  onChange={(e) => inputChange(activeTab, e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={step === 0}
          >
            Previous
          </button>
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={handleSaveDraft}
            >
              Save as Draft
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-success">
                Save
              </button>
            )}
          </div>
        </div>
      </form> */}
      <form onSubmit={handleSubmit}>
  <div className="p-3 accordion-item border mb-4">
    {/* Step 0 - Basic Info */}
    {step === 0 && (
      <div className="accordion-body">
        <div className="row">
          {/* Product Name */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Product Name<span className="text-danger">*</span></label>
            <input
              type="text"
              name="productName"
              className="form-control"
              value={formData.productName}
              onChange={handleChange}
            />
          </div>

          {/* Slug */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Slug<span className="text-danger">*</span></label>
            <input
              type="text"
              name="slug"
              className="form-control"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          {/* SKU */}
          <div className="col-sm-6 col-12 mb-3 position-relative">
            <label className="form-label">SKU<span className="text-danger">*</span></label>
            <input
              type="text"
              name="sku"
              className="form-control"
              value={formData.sku}
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-primaryadd">Generate</button>
          </div>

          {/* Brand */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Brand / Manufacture</label>
            <Select
              options={brandOptions}
              value={selectedBrands}
              onChange={handleBrandChange}
              isSearchable
              placeholder="Search or select brands..."
            />
          </div>

          {/* Category */}
          <div className="col-sm-6 col-12 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label">Category<span className="text-danger">*</span></label>
              <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add-product-category">
                <i data-feather="plus-circle" className="plus-down-add" />
                <span>Add New</span>
              </a>
            </div>
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(selected) => {
                setSelectedCategory(selected);
                setSelectedSubcategory(null);
              }}
              placeholder="Search or select category..."
            />
          </div>

          {/* Subcategory */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Sub Category<span className="text-danger">*</span></label>
            <Select
              options={subcategories}
              value={selectedsubCategory}
              onChange={subCategoryChange}
              placeholder="Search or select subcategory..."
            />
          </div>

          {/* Supplier */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Supplier<span className="text-danger">*</span></label>
            <select className="form-select" name="supplier" value={formData.supplier} onChange={handleChange}>
              <option value="">Select</option>
              <option value="supplier1">Supplier 1</option>
              <option value="supplier2">Supplier 2</option>
            </select>
          </div>

          {/* Item Barcode */}
          <div className="col-sm-6 col-12 mb-3 position-relative">
            <label className="form-label">Item Barcode<span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name="itemBarcode"
              value={formData.itemBarcode}
              readOnly
            />
            <button
              type="button"
              className="btn btn-primaryadd"
              onClick={() =>
                setFormData((prev) => ({ ...prev, itemBarcode: generateBarcode() }))
              }
            >
              Generate
            </button>
          </div>

          {/* Store */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Store<span className="text-danger">*</span></label>
            <select className="form-select" name="store" value={formData.store} onChange={handleChange}>
              <option value="">Select</option>
              <option value="India Mart">India Mart</option>
              <option value="India Gadgets">India Gadgets</option>
            </select>
          </div>

          {/* Warehouse */}
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">Warehouse / Location<span className="text-danger">*</span></label>
            <select className="form-select" name="warehouse" value={formData.warehouse} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Warehouse1">Warehouse 1</option>
            </select>
          </div>
        </div>
      </div>
    )}

    {/* Step 1 - Pricing */}
    {step === 1 && (
      <div className="row">
        {[
          { label: "Purchase Price", name: "purchasePrice" },
          { label: "Selling Price", name: "sellingPrice" },
          { label: "Wholesale Price", name: "wholesalePrice" },
        ].map((field, idx) => (
          <div key={idx} className="col-lg-4 col-sm-6 col-12 mb-3">
            <label className="form-label">{field.label}<span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Quantity<span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Tax Type<span className="text-danger">*</span></label>
          <select className="form-select" name="taxType" value={formData.taxType} onChange={handleChange}>
            <option value="">Select</option>
            <option>Exclusive</option>
            <option>Inclusive</option>
          </select>
        </div>

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Tax Rate<span className="text-danger">*</span></label>
          <select className="form-select" name="tax" value={formData.tax} onChange={handleChange}>
            <option value="">Select</option>
            <option>IGST (8%)</option>
            <option>GST (5%)</option>
            <option>SGST (4%)</option>
            <option>CGST (16%)</option>
            <option>GST (18%)</option>
          </select>
        </div>

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Discount Type<span className="text-danger">*</span></label>
          <select className="form-select" name="discountType" value={formData.discountType} onChange={handleChange}>
            <option value="">Select</option>
            <option>Percentage</option>
            <option>Fixed</option>
          </select>
        </div>

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Discount Value<span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="discountValue" value={formData.discountValue} onChange={handleChange} />
        </div>

        <div className="col-lg-4 col-sm-6 col-12 mb-3">
          <label className="form-label">Quantity Alert<span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="quantityAlert" value={formData.quantityAlert} onChange={handleChange} />
        </div>
      </div>
    )}

    {/* Step 2 - Images and SEO */}
    {step === 2 && (
      <>
        <div {...getRootProps({ className: "dropzone p-4 text-center image-upload image-upload-two mb-3" })}>
          <input {...getInputProps()} />
          <MdImageSearch style={{ fontSize: "50px" }} />
          <p>Drag your image here, or browse</p>
          <p>Supports JPEG, PNG, JPG</p>
        </div>

        <div className="row mt-3">
          {images.map((file, i) => (
            <div className="col-3 mb-3" key={i}>
              <img src={file.preview} className="img-thumbnail" style={{ height: 120, objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <div className="col-lg-12 mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" maxLength={300} value={formData.description} onChange={handleChange} />
        </div>

        <div className="row">
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">SEO Meta Title</label>
            <input type="text" name="seoTitle" className="form-control" value={formData.seoTitle || ""} onChange={handleChange} />
          </div>
          <div className="col-sm-6 col-12 mb-3">
            <label className="form-label">SEO Meta Description</label>
            <input type="text" name="seoDescription" className="form-control" value={formData.seoDescription || ""} onChange={handleChange} />
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
              className={`variant-tab btn btn-sm ${activeTab === tab ? "btn-success" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mb-3">
          <label>Enter {activeTab} Variants (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={formData.variants[activeTab]?.join(", ") || ""}
            onChange={(e) => inputChange(activeTab, e.target.value)}
          />
        </div>
      </>
    )}
  </div>

  {/* Navigation Buttons */}
  <div className="mt-4 d-flex justify-content-between">
    <button type="button" className="btn btn-outline-primary" onClick={handlePrev} disabled={step === 0}>
      Previous
    </button>
    <div>
      <button type="button" className="btn btn-outline-secondary me-2" onClick={handleSaveDraft}>
        Save as Draft
      </button>
      {/* {step < steps.length - 1 ? (
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
      ) : (
        <button type="submit" className="btn btn-success">
          Save
        </button>
      )} */}
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
    Next
  </button>
) : (
  <button
    type="button"
    className="btn btn-success"
    onClick={(e) => {
      if (validateStep()) {
        handleSubmit(e); // manually call submit
      } else {
        toast.error("Please complete all required fields before saving");
      }
    }}
  >
    Save
  </button>
)}

    </div>
  </div>
</form>

    </div>
  );
};

export default ProductForm;

// import React, { useEffect, useState } from "react";
// import "./product.css";
// import Select from "react-select";

// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../../../../pages/config/config";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { TbInfoCircle } from "react-icons/tb";

// const steps = ["Description & Media", "Pricing", "Images", "Variants"];
// const variantTabs = [
//   "Color", "Size", "Expiry", "Material", "Model",
//   "Weight", "Skin type", "Packaging type", "Flavour", "Gender"
// ];

// const ProductForm = () => {
//   const [step, setStep] = useState(0);
//   // const [formData, setFormData] = useState({});
//   const [stepStatus, setStepStatus] = useState(Array(steps.length).fill("pending")); // 'pending' | 'incomplete' | 'complete'
//   const [activeTab, setActiveTab] = useState("Color");

//   const validateStep = () => {
//     if (step === 3) {
//       return !!formData[activeTab];
//     }
//     return true; // Assume all other steps valid for now
//   };

//   const handleNext = () => {
//     const isValid = validateStep();

//     const updatedStatus = [...stepStatus];
//     updatedStatus[step] = isValid ? "complete" : "incomplete";
//     setStepStatus(updatedStatus);

//     if (isValid && step < steps.length - 1) setStep((prev) => prev + 1);
//   };

//   const handlePrev = () => {
//     if (step > 0) setStep((prev) => prev - 1);
//   };

//   const handleSaveDraft = () => alert("Saved as Draft!");
//   // const handleSubmit = () => {
//   //   const updatedStatus = [...stepStatus];
//   //   updatedStatus[step] = validateStep() ? "complete" : "incomplete";
//   //   setStepStatus(updatedStatus);
//   //   alert("Product Saved!");
//   // };

//   const handleInputChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//     const navigate = useNavigate();
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

//  const generateBarcode = () => {
//   const prefix = "BR"; // Optional
//   const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
//   return `${prefix}${randomNumber}`;
// };

//   return (
//     <div className="container mt-4">
//       <h5 className="mb-3">{steps[step]}</h5>

//       {/* Progress Bar */}
//       <div className="progress-wrapper d-flex justify-content-between align-items-center mb-4 position-relative">
//         {steps.map((label, index) => {
//           const status = stepStatus[index];
//           const isActive = index === step;
//           const isComplete = status === "complete";
//           const isIncomplete = status === "incomplete";

//           return (
//             <div key={index} className="step-wrapper">
//               <div
//                 className={`circle ${isComplete ? "complete" : isIncomplete ? "incomplete" : isActive ? "active" : ""}`}
//               >
//                 {index + 1}
//               </div>
//               <div className="step-text">{label}</div>
//               {index < steps.length - 1 && (
//                 <div
//                   className={`progress-line ${stepStatus[index] === "complete"
//                       ? "line-complete"
//                       : stepStatus[index] === "incomplete"
//                         ? "line-incomplete"
//                         : "line-pending"
//                     }`}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Step Content */}
//       <div className="p-3 bg-white rounded shadow-sm">
//         {step === 3 ? (
//           <>
//             <div className="variant-tabs mb-3 d-flex flex-wrap gap-2">
//               {variantTabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`variant-tab btn btn-sm ${activeTab === tab ? "btn-success" : "btn-outline-secondary"}`}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//               <button className="btn btn-outline-primary btn-sm">+ Add More</button>
//             </div>

//             <div>
//               <label className="form-label">Select {activeTab}</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 value={formData[activeTab] || ""}
//                 onChange={(e) => handleInputChange(activeTab, e.target.value)}
//                 placeholder={`Enter ${activeTab}`}
//               />
//             </div>
//           </>
//         ) : (
//           // <p>This is step content for <strong>{steps[step]}</strong>.</p>

//           <div className="accordion-item border mb-4">
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

//         )}
//       </div>

//       {/* Footer Controls */}
//       <div className="mt-4 d-flex justify-content-between">
//         <button className="btn btn-outline-primary" onClick={handlePrev} disabled={step === 0}>
//           Previous
//         </button>
//         <div>
//           <button className="btn btn-outline-secondary me-2" onClick={handleSaveDraft}>
//             Save as draft
//           </button>
//           {step < steps.length - 1 ? (
//             <button className="btn btn-primary" onClick={handleNext}>
//               Next
//             </button>
//           ) : (
//             <button className="btn btn-success" onClick={handleSubmit}>
//               Save
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;

// import React, { useState } from "react";
// import axios from "axios";
// import { TbInfoCircle } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";

// const ProductCreate = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//       store: "",
//       warehouse: "",
//       productName: "",
//       slug: "",
//       sku: "",
//       sellingType: "",
//       category: "",
//       subCategory: "",
//       brand: "",
//       unit: "",
//       barcodeSymbology: "",
//       itemBarcode: "",
//       description: "",
//       //
//       productType: "Single", // Default
//       quantity: "",
//       price: "",
//       taxType: "",
//       tax: "",
//       discountType: "",
//       discountValue: "",
//       quantityAlert: "",

//     });

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//       //   await api.post("/products", formData);
//       await axios.post("http://localhost:5000/api/products/create", formData);
//         alert("Product created successfully!");
//         navigate("/product");
//       } catch (error) {
//         alert("Failed to create product");
//         console.error(error);
//       }
//     };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <h4>Create Product</h4>
//         </div>
//         <form className="add-product-form" onSubmit={handleSubmit}>
//           <div className="accordion-body border-top">
//             <div className="row">
//               <div className="col-sm-6">
//                 <label>Store*</label>
//                 <select name="store" className="form-select" onChange={handleChange} value={formData.store}>
//                   <option value="">Select</option>
//                   <option>Electro Mart</option>
//                   <option>Quantum Gadgets</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Warehouse*</label>
//                 <select name="warehouse" className="form-select" onChange={handleChange} value={formData.warehouse}>
//                   <option value="">Select</option>
//                   <option>Lavish Warehouse</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Product Name*</label>
//                 <input type="text" name="productName" className="form-control" onChange={handleChange} value={formData.productName} />
//               </div>
//               <div className="col-sm-6">
//                 <label>Slug*</label>
//                 <input type="text" name="slug" className="form-control" onChange={handleChange} value={formData.slug} />
//               </div>
//               <div className="col-sm-6">
//                 <label>SKU*</label>
//                 <input type="text" name="sku" className="form-control" onChange={handleChange} value={formData.sku} />
//               </div>
//               <div className="col-sm-6">
//                 <label>Selling Type*</label>
//                 <select name="sellingType" className="form-select" onChange={handleChange} value={formData.sellingType}>
//                   <option value="">Select</option>
//                   <option>Online</option>
//                   <option>POS</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Category*</label>
//                 <select name="category" className="form-select" onChange={handleChange} value={formData.category}>
//                   <option value="">Select</option>
//                   <option>Computers</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Sub Category*</label>
//                 <select name="subCategory" className="form-select" onChange={handleChange} value={formData.subCategory}>
//                   <option value="">Select</option>
//                   <option>Laptop</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Brand*</label>
//                 <select name="brand" className="form-select" onChange={handleChange} value={formData.brand}>
//                   <option value="">Select</option>
//                   <option>Apple</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Unit*</label>
//                 <select name="unit" className="form-select" onChange={handleChange} value={formData.unit}>
//                   <option value="">Select</option>
//                   <option>Pcs</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Barcode Symbology*</label>
//                 <select name="barcodeSymbology" className="form-select" onChange={handleChange} value={formData.barcodeSymbology}>
//                   <option value="">Select</option>
//                   <option>Code 128</option>
//                 </select>
//               </div>
//               <div className="col-sm-6">
//                 <label>Item Barcode*</label>
//                 <input type="text" name="itemBarcode" className="form-control" onChange={handleChange} value={formData.itemBarcode} />
//               </div>
//               <div className="col-12">
//                 <label>Description</label>
//                 <textarea
//                   name="description"
//                   className="form-control"
//                   maxLength={300}
//                   onChange={handleChange}
//                   value={formData.description}
//                 />
//               </div>
//             </div>
//             <div className="d-flex justify-content-end mt-4">
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
