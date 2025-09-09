import React, { useEffect, useState } from "react";
import {
  TbChevronUp,
  TbInfoCircle,
  TbLifebuoy,
  TbList,
  TbRefresh,
} from "react-icons/tb";
import "../../../../styles/product/product.css";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FiImage } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../../pages/config/config";

const ProductCreate = () => {
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
    //
    productType: "Single", // Default
    quantity: "",
    price: "",
    taxType: "",
    tax: "",
    discountType: "",
    discountValue: "",
    quantityAlert: "",
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
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Create Product</h4>
              <h6>Create new product</h6>
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
              <Link to="back"></Link>back to product
            </button>
          </div>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="add-product">
            <div
              className="accordions-items-seperate"
              id="accordionSpacingExample"
            >
              {/* product */}
              <div className="accordion-item border mb-4">
                <h2 className="accordion-header" id="headingSpacingOne">
                  <div
                    className="accordion-button collapsed bg-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#SpacingOne"
                    aria-expanded="true"
                    aria-controls="SpacingOne"
                  >
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <TbInfoCircle className="text-primary me-2" />
                        <span>Product Information</span>
                      </h5>
                    </div>
                  </div>
                </h2>
                <div
                  id="SpacingOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingSpacingOne"
                >
                  <div className="accordion-body border-top">
                    <div className="row">
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
                          >
                            <option>Select</option>
                            <option>Electro Mart</option>
                            <option>Quantum Gadgets</option>
                            <option>Gadget World</option>
                            <option>Volt Vault</option>
                            <option>Elite Retail</option>
                            <option>Prime Mart</option>
                            <option>NeoTech Store</option>
                          </select>
                        </div>
                        {/* <div className="mb-3">
                          <label className="form-label">
                            Store<span className="text-danger ms-1">*</span>
                          </label>
                          <Select
                            options={storeOptions}
                            classNamePrefix="react-select"
                            defaultValue={storeOptions[0]}
                          />
                        </div> */}
                      </div>
                      <div className="col-sm-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Warehouse<span className="text-danger ms-1">*</span>
                          </label>
                          <select
                            className="form-select"
                            name="warehouse"
                            onChange={handleChange}
                            value={formData.warehouse}
                          >
                            <option>Select</option>
                            <option>Lavish Warehouse</option>
                            <option>Quaint Warehouse</option>
                            <option>Traditional Warehouse</option>
                            <option>Cool Warehouse</option>
                            <option>Overflow Warehouse</option>
                            <option>Nova Storage Hub</option>
                            <option>Retail Supply Hub</option>
                            <option>EdgeWare Solutions</option>
                          </select>
                        </div>
                      </div>
                    </div>
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
                    </div>
                    <div className="row">
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
                          <label className="form-label">
                            Selling Type
                            <span className="text-danger ms-1">*</span>
                          </label>
                          <select
                            className="form-select"
                            name="sellingType"
                            onChange={handleChange}
                            value={formData.sellingType}
                          >
                            <option>Select</option>
                            <option>Online</option>
                            <option>POS</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="addservice-info">
                      <div className="row">
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
                              // id="category"
                              // options={categories}
                              // value={selectedCategory}
                              // onChange={handleCategoryChange}
                              // isSearchable
                              // placeholder="Search or select category..."
                              options={categories}
                              value={selectedCategory}
                              onChange={(selected) => {
                                setSelectedCategory(selected);
                                setSelectedSubcategory(null); // reset subcategory
                              }}
                              placeholder="Search or select category..."
                            />
                            {/* <select className="form-select" name="category" onChange={handleChange} value={formData.category}>
                              <option>Select</option>
                              <option>Computers</option>
                              <option>Electronics</option>
                              <option>Shoe</option>
                              <option>Cosmetics</option>
                              <option>Groceries</option>
                              <option>Furniture</option>
                              <option>Bags</option>
                              <option>Phone</option>
                            </select> */}
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
                            {/* <select
                              className="form-select"
                              name="subCategory"
                              onChange={handleChange}
                              value={formData.subCategory}
                            >
                              <option>Select</option>
                              <option>Laptop</option>
                              <option>Desktop</option>
                              <option>Sneakers</option>
                              <option>Formals</option>
                              <option>Wearables</option>
                              <option>Speakers</option>
                              <option>Handbags</option>
                              <option>Travel</option>
                              <option>Sofa</option>
                            </select> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="add-product-new">
                      <div className="row">
                        <div className="col-sm-6 col-12">
                          <div className="mb-3">
                            <div className="add-newplus">
                              <label className="form-label">
                                Brand<span className="text-danger ms-1">*</span>
                              </label>
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
                                Unit<span className="text-danger ms-1">*</span>
                              </label>
                            </div>
                            <select
                              name="unit"
                              className="form-select"
                              onChange={handleChange}
                              value={formData.unit}
                            >
                              <option>Select</option>
                              <option>Kg</option>
                              <option>Pcs</option>
                              <option>L</option>
                              <option>dz</option>
                              <option>bx</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <div className="add-newplus">
                            <label className="form-label">
                              Barcode Symbology
                              <span className="text-danger ms-1">*</span>
                            </label>
                          </div>
                          <select
                            name="barcodeSymbology"
                            className="form-select"
                            onChange={handleChange}
                            value={formData.barcodeSymbology}
                          >
                            <option>Select</option>
                            <option>Code 128</option>
                            <option>Code 39</option>
                            <option>UPC-A</option>
                            <option>UPC_E</option>
                            <option>EAN-8</option>
                            <option>EAN-13</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Barcode Symbology
                          </label>
                          <select className="form-select">
                            <option>Choose</option>
                            <option>Code 128</option>
                            <option>Code 39</option>
                            <option>UPC-A</option>
                            <option>UPC-E</option>
                            <option>EAN-8</option>
                            <option>EAN-13</option>
                          </select>
                        </div>
                      </div>
                      {/* <div className="col-lg-6 col-sm-6 col-12">
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
                          />
                          <button type="submit" className="btn btn-primaryadd">
                            Generate
                          </button>
                        </div>
                      </div> */}
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
      readOnly // Optional: prevent user editing after generate
    />
    <button
      type="button"
      className="btn btn-primaryadd"
      onClick={() => {
        const barcode = generateBarcode();
        setFormData((prev) => ({ ...prev, itemBarcode: barcode }));
      }}
    >
      Generate
    </button>
  </div>
</div>

                    </div>
                    {/* Editor */}
                    <div className="col-lg-12">
                      <label>Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        maxLength={300}
                        onChange={handleChange}
                        value={formData.description}
                      />
                      {/* <div className="summer-description-box">
                        <label className="form-label">Description</label>
                        <div id="summernote" />
                        <p className="fs-14 mt-1">Maximum 60 Words</p>
                      </div> */}
                    </div>
                    {/* /Editor */}
                  </div>
                </div>
              </div>
              {/* pricing */}
              <div className="accordion-item border mb-4">
                <h2 className="accordion-header" id="headingSpacingTwo">
                  <div
                    className="accordion-button collapsed bg-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#SpacingTwo"
                    aria-expanded="true"
                    aria-controls="SpacingTwo"
                  >
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <TbLifebuoy className="text-primary me-2" />

                        <span>Pricing &amp; Stocks</span>
                      </h5>
                    </div>
                  </div>
                </h2>
                <div
                  id="SpacingTwo"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingSpacingTwo"
                >
                  <div className="accordion-body border-top">
                    <div className="mb-3s">
                      <label className="form-label">
                        Product Type<span className="text-danger ms-1">*</span>
                      </label>
                      <div className="single-pill-product mb-3">
                        <ul
                          className="nav nav-pills"
                          id="pills-tab1"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <span
                              className="custom_radio me-4 mb-0 active"
                              id="pills-home-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-home"
                              role="tab"
                              aria-controls="pills-home"
                              aria-selected="true"
                            >
                              <input
                                type="radio"
                                name="productType"
                                value="Single"
                                checked={formData.productType === "Single"}
                                onChange={handleChange}
                              />
                              <span className="checkmark" /> Single Product
                            </span>
                          </li>
                          <li className="nav-item" role="presentation">
                            <span
                              className="custom_radio me-2 mb-0"
                              id="pills-profile-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-profile"
                              role="tab"
                              aria-controls="pills-profile"
                              aria-selected="false"
                            >
                              <input
                                type="radio"
                                name="productType"
                                value="Variable"
                                checked={formData.productType === "Variable"}
                                onChange={handleChange}
                              />
                              <span className="checkmark" /> Variable Product
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                      {/* single product */}
                      <div
                        // className="tab-pane fade show active"
                        // id="pills-home"
                        // role="tabpanel"
                        // aria-labelledby="pills-home-tab"
                        className="tab-pane fade show active"
                        id="pills-home"
                      >
                        {formData.productType === "Single" && (
                          <div className="single-product">
                            <div className="row">
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
                                    Price
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
                                    Tax
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
                          </div>
                        )}
                      </div>

                      {/* varient product */}
                      <div
                        className="tab-pane fade"
                        id="pills-profile"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      >
                        <div className="row select-color-add">
                          <div className="col-lg-6 col-sm-6 col-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Variant Attribute{" "}
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <div className="row">
                                <div className="col-lg-10 col-sm-10 col-10">
                                  <select
                                    className="form-control variant-select select-option"
                                    id="colorSelect"
                                  >
                                    <option>Choose</option>
                                    <option>Color</option>
                                    <option value="red">Red</option>
                                    <option value="black">Black</option>
                                  </select>
                                </div>
                                <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                  <div className="add-icon tab">
                                    <a
                                      className="btn btn-filter"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add-product-category"
                                    >
                                      <i className="feather feather-plus-circle" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className="selected-hide-color"
                              id="input-show"
                            >
                              <label className="form-label">
                                Variant Attribute{" "}
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <div className="row align-items-center">
                                <div className="col-lg-10 col-sm-10 col-10">
                                  <div className="mb-3">
                                    <input
                                      className="input-tags form-control"
                                      id="inputBox"
                                      type="text"
                                      data-role="tagsinput"
                                      name="specialist"
                                      defaultValue="red, black"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                  <div className="mb-3 ">
                                    <a
                                      href="javascript:void(0);"
                                      className="remove-color"
                                    >
                                      <i className="far fa-trash-alt" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="modal-body-table border"
                          id="variant-table"
                        >
                          <div className="table-responsive">
                            <table className="table border">
                              <thead>
                                <tr>
                                  <th>Variantion</th>
                                  <th>Variant Value</th>
                                  <th>SKU</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th className="no-sort" />
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="color"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="red"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={1234}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="product-quantity">
                                      <span className="quantity-btn">
                                        <i
                                          data-feather="minus-circle"
                                          className="feather-search"
                                        />
                                      </span>
                                      <input
                                        type="text"
                                        className="quntity-input form-control"
                                        defaultValue={2}
                                      />
                                      <span className="quantity-btn">
                                        +
                                        <i
                                          data-feather="plus-circle"
                                          className="plus-circle"
                                        />
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={50000}
                                      />
                                    </div>
                                  </td>
                                  <td className="action-table-data">
                                    <div className="edit-delete-action">
                                      <div className="input-block add-lists">
                                        <label className="checkboxs">
                                          <input
                                            type="checkbox"
                                            defaultChecked
                                          />
                                          <span className="checkmarks" />
                                        </label>
                                      </div>
                                      <a
                                        className="me-2 p-2"
                                        href="javascript:void(0);"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-variation"
                                      >
                                        <i
                                          data-feather="plus"
                                          className="feather-edit"
                                        />
                                      </a>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#delete-modal"
                                        className="p-2"
                                        href="javascript:void(0);"
                                      >
                                        <i
                                          data-feather="trash-2"
                                          className="feather-trash-2"
                                        />
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="color"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue="black"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={2345}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="product-quantity">
                                      <span className="quantity-btn">
                                        <i
                                          data-feather="minus-circle"
                                          className="feather-search"
                                        />
                                      </span>
                                      <input
                                        type="text"
                                        className="quntity-input form-control"
                                        defaultValue={3}
                                      />
                                      <span className="quantity-btn">
                                        +
                                        <i
                                          data-feather="plus-circle"
                                          className="plus-circle"
                                        />
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="add-product">
                                      <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={50000}
                                      />
                                    </div>
                                  </td>
                                  <td className="action-table-data">
                                    <div className="edit-delete-action">
                                      <div className="input-block add-lists">
                                        <label className="checkboxs">
                                          <input
                                            type="checkbox"
                                            defaultChecked
                                          />
                                          <span className="checkmarks" />
                                        </label>
                                      </div>
                                      <a
                                        className="me-2 p-2"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-variation"
                                      >
                                        <i
                                          data-feather="plus"
                                          className="feather-edit"
                                        />
                                      </a>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#delete-modal"
                                        className="p-2"
                                        href="javascript:void(0);"
                                      >
                                        <i
                                          data-feather="trash-2"
                                          className="feather-trash-2"
                                        />
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* image */}
              <div className="accordion-item border mb-4">
                <h2 className="accordion-header" id="headingSpacingThree">
                  <div
                    className="accordion-button collapsed bg-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#SpacingThree"
                    aria-expanded="true"
                    aria-controls="SpacingThree"
                  >
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <FiImage className="text-primary me-2" />
                        <span>Images</span>
                      </h5>
                    </div>
                  </div>
                </h2>
                <div
                  id="SpacingThree"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingSpacingThree"
                >
                  <div className="accordion-body border-top">
                    <div className="text-editor add-list add">
                      <div className="col-lg-12">
                        <div className="add-choosen">
                          <div className="mb-3">
                            <div className="image-upload image-upload-two">
                              <input
                                type="file"
                                //   multiple
                                //  onChange={handleImageChange}
                              />
                              <div className="image-uploads">
                                <CiCirclePlus className="plus-down-add me-0" />
                                <h4>Add Images</h4>
                              </div>
                            </div>
                          </div>
                          <div className="phone-img">
                            <img
                              src="assets/img/products/phone-add-2.png"
                              alt="image"
                            />
                            <a href="javascript:void(0);">
                              <i
                                data-feather="x"
                                className="x-square-add remove-product"
                              />
                            </a>
                          </div>
                          <div className="phone-img">
                            <img
                              src="assets/img/products/phone-add-1.png"
                              alt="image"
                            />
                            <a href="javascript:void(0);">
                              <i
                                data-feather="x"
                                className="x-square-add remove-product"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* custom filed */}
              <div className="accordion-item border mb-4">
                <h2 className="accordion-header" id="headingSpacingFour">
                  <div
                    className="accordion-button collapsed bg-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#SpacingFour"
                    aria-expanded="true"
                    aria-controls="SpacingFour"
                  >
                    <div className="d-flex align-items-center justify-content-between flex-fill">
                      <h5 className="d-flex align-items-center">
                        <TbList className="text-primary me-2" />
                        <span>Custom Fields</span>
                      </h5>
                    </div>
                  </div>
                </h2>
                <div
                  id="SpacingFour"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingSpacingFour"
                >
                  <div className="accordion-body border-top">
                    <div>
                      <div className="p-3 bg-light rounded d-flex align-items-center border mb-3">
                        <div className=" d-flex align-items-center">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="warranties"
                              defaultValue="option1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="warranties"
                            >
                              Warranties
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="manufacturer"
                              defaultValue="option2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="manufacturer"
                            >
                              Manufacturer
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="expiry"
                              defaultValue="option2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="expiry"
                            >
                              Expiry
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6 col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Warranty
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <select className="form-select">
                              <option>Select</option>
                              <option>Replacement Warranty</option>
                              <option>On-Site Warranty</option>
                              <option>Accidental Protection Plan</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">
                              Manufacturer
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6 col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Manufactured Date
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <div className="input-groupicon calender-input">
                              <i data-feather="calendar" className="info-img" />
                              <input
                                type="text"
                                className="datetimepicker form-control"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6 col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Expiry On
                              <span className="text-danger ms-1">*</span>
                            </label>
                            <div className="input-groupicon calender-input">
                              <i data-feather="calendar" className="info-img" />
                              <input
                                type="text"
                                className="datetimepicker form-control"
                                placeholder="dd/mm/yyyy"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* action button */}
          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-end mb-4">
              <button type="button" className="btn btn-secondary me-2">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;

// import React from "react";
// import { TbChevronUp, TbInfoCircle, TbLifebuoy, TbList, TbRefresh } from "react-icons/tb";
// import "../../../../styles/product/product.css";
// // import "../../../../styles/style.css";
// import { Link } from "react-router-dom";
// import Select from "react-select";
// import { FiImage } from "react-icons/fi";
// const ProductCreate = () => {
//   // const storeOptions = [
//   //   { value: "", label: "Select" },
//   //   { value: "electro_mart", label: "Electro Mart" },
//   //   { value: "quantum_gadgets", label: "Quantum Gadgets" },
//   //   { value: "gadget_world", label: "Gadget World" },
//   //   { value: "volt_vault", label: "Volt Vault" },
//   //   { value: "elite_retail", label: "Elite Retail" },
//   //   { value: "prime_mart", label: "Prime Mart" },
//   //   { value: "neotech_store", label: "NeoTech Store" },
//   // ];
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

//           {/* <div className="table-top-head">
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><TbChevronUp /></a>
//         </li>
//       </div> */}

//           <div className="page-btn mt-0">
//             <button className="btn btn-secondary">
//               <Link to="back"></Link>back to product
//             </button>
//             {/* <a href="product-list.html" className="btn btn-secondary"><i data-feather="arrow-left" className="me-2" />Back to Product</a> */}
//           </div>
//         </div>

//         <form className="add-product-form">
//           <div className="add-product">
//             <div
//               className="accordions-items-seperate"
//               id="accordionSpacingExample"
//             >
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
//                           <select className="form-select">
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
//                           <select className="form-select">
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
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Slug<span className="text-danger ms-1">*</span>
//                           </label>
//                           <input type="text" className="form-control" />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-6 col-12">
//                         <div className="mb-3 list position-relative">
//                           <label className="form-label">
//                             SKU<span className="text-danger ms-1">*</span>
//                           </label>
//                           <input type="text" className="form-control list" />
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
//                           <select className="form-select">
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
//                             <select className="form-select">
//                               <option>Select</option>
//                               <option>Computers</option>
//                               <option>Electronics</option>
//                               <option>Shoe</option>
//                               <option>Cosmetics</option>
//                               <option>Groceries</option>
//                               <option>Furniture</option>
//                               <option>Bags</option>
//                               <option>Phone</option>
//                             </select>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Sub Category
//                               <span className="text-danger ms-1">*</span>
//                             </label>
//                             <select className="form-select">
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
//                             </select>
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
//                             <select className="form-select">
//                               <option>Select</option>
//                               <option>Lenevo</option>
//                               <option>Beats</option>
//                               <option>Nike</option>
//                               <option>Apple</option>
//                               <option>Amazon</option>
//                               <option>Woodmart</option>
//                             </select>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-12">
//                           <div className="mb-3">
//                             <div className="add-newplus">
//                               <label className="form-label">
//                                 Unit<span className="text-danger ms-1">*</span>
//                               </label>
//                             </div>
//                             <select className="form-select">
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
//                           <select className="form-select">
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
//                       <div className="col-lg-6 col-sm-6 col-12">
//                         <div className="mb-3 list position-relative">
//                           <label className="form-label">
//                             Item Barcode
//                             <span className="text-danger ms-1">*</span>
//                           </label>
//                           <input type="text" className="form-control list" />
//                           <button type="submit" className="btn btn-primaryadd">
//                             Generate
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Editor */}
//                     <div className="col-lg-12">
//                       <div className="summer-description-box">
//                         <label className="form-label">Description</label>
//                         <div id="summernote" />
//                         <p className="fs-14 mt-1">Maximum 60 Words</p>
//                       </div>
//                     </div>
//                     {/* /Editor */}
//                   </div>
//                 </div>
//               </div>
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
//                         <TbLifebuoy className="text-primary me-2"/>

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
//                                 className="form-control"
//                                 name="payment"
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
//                                 className="form-control"
//                                 name="sign"
//                               />
//                               <span className="checkmark" /> Variable Product
//                             </span>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="tab-content" id="pills-tabContent">
//                       <div
//                         className="tab-pane fade show active"
//                         id="pills-home"
//                         role="tabpanel"
//                         aria-labelledby="pills-home-tab"
//                       >
//                         <div className="single-product">
//                           <div className="row">
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Quantity
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <input type="text" className="form-control" />
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Price
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <input type="text" className="form-control" />
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Tax Type
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <select className="form-select">
//                                   <option>Select</option>
//                                   <option>Exclusive</option>
//                                   <option>Inclusive</option>
//                                 </select>
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Tax<span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <select className="form-select">
//                                   <option>Select</option>
//                                   <option>IGST (8%)</option>
//                                   <option>GST (5%)</option>
//                                   <option>SGST (4%)</option>
//                                   <option>CGST (16%)</option>
//                                   <option>Gst 18%</option>
//                                 </select>
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Discount Type
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <select className="form-select">
//                                   <option>Select</option>
//                                   <option>Percentage</option>
//                                   <option>Fixed</option>
//                                 </select>
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Discount Value
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <input className="form-control" type="text" />
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-sm-6 col-12">
//                               <div className="mb-3">
//                                 <label className="form-label">
//                                   Quantity Alert
//                                   <span className="text-danger ms-1">*</span>
//                                 </label>
//                                 <input type="text" className="form-control" />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
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
//                               <input type="file" />
//                               <div className="image-uploads">
//                                 <i
//                                   data-feather="plus-circle"
//                                   className="plus-down-add me-0"
//                                 />
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
// {/* action button */}
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
//       {/* <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
//         <p className="mb-0 text-gray-9">
//           2014 - 2025 © DreamsPOS. All Right Reserved
//         </p>
//         <p>
//           Designed &amp; Developed by{" "}
//           <a href="javascript:void(0);" className="text-primary">
//             Dreams
//           </a>
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default ProductCreate;
