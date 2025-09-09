import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../../../pages/config/config";
import { toast } from "react-toastify";

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: "",
        sku: "",
        brand: "",
        category: "",
        subCategory: "",
        supplier: "",
        itemBarcode: "",
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
        barcodeSymbology: "",
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
    });
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
    // Image state
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/${id}`);
                const data = res.data;
                setFormData({ ...formData, ...data });
                // Set selectedBrand and selectedCategory for dropdowns
                if (data.brand) setSelectedBrands({ value: data.brand._id || data.brand, label: data.brand.brandName || data.brand });
                if (data.category) setSelectedCategory({ value: data.category._id || data.category, label: data.category.categoryName || data.category });
                if (data.subCategory) setSelectedsubCategory({ value: data.subCategory._id || data.subCategory, label: data.subCategory.subCategoryName || data.subCategory });
                if (data.unit) setSelectedUnits({ value: data.unit, label: data.unit });
                if (data.supplier) setSelectedSupplier({ value: data.supplier._id || data.supplier, label: data.supplier.firstName ? `${data.supplier.firstName}${data.supplier.lastName} (${data.supplier.supplierCode})` : data.supplier });
                if (data.warehouse) setSelectedWarehouse({ value: data.warehouse._id || data.warehouse, label: data.warehouse.warehouseName || data.warehouse });
                if (data.hsnCode) setSelectedHSN({ value: data.hsnCode._id || data.hsnCode, label: data.hsnCode.hsnCode ? `${data.hsnCode.hsnCode} - ${data.hsnCode.description || ''}` : data.hsnCode });
                setLoading(false);
            } catch (err) {
                toast.error("Failed to fetch product");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Fetch dropdown options (categories, brands, units, suppliers, warehouses, HSN)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/category/categories`);
                const options = res.data.map((category) => ({ value: category._id, label: category.categoryName }));
                setCategories(options);
            } catch (error) { }
        };
        const fetchBrands = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${BASE_URL}/api/brands/active-brands`, { headers: { Authorization: `Bearer ${token}` } });
                const options = res.data.brands.map((brand) => ({ value: brand._id, label: brand.brandName }));
                setBrandOptions(options);
            } catch (error) { }
        };
        const fetchUnits = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/unit/units/status/active`);
                const options = res.data.units.map((unit) => ({ value: unit.shortName, label: `${unit.unitsName} (${unit.shortName})` }));
                setUnitsOptions(options);
            } catch (error) { }
        };
        const fetchSuppliers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/suppliers/active`);
                const options = res.data.suppliers.map((supplier) => ({ value: supplier._id, label: `${supplier.firstName}${supplier.lastName} (${supplier.supplierCode})` }));
                setOptions(options);
            } catch (error) { }
        };
        const fetchWarehouses = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/warehouse/active`);
                if (res.data.success) {
                    const options = res.data.data.map((wh) => ({ value: wh._id, label: wh.warehouseName }));
                    setOptionsWare(options);
                }
            } catch (error) { }
        };
        const fetchHSN = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/hsn/all`);
                if (res.data.success) {
                    const options = res.data.data.map((item) => ({ value: item._id, label: `${item.hsnCode} - ${item.description || ""}` }));
                    setOptionsHsn(options);
                }
            } catch (error) { }
        };
        fetchCategories();
        fetchBrands();
        fetchUnits();
        fetchSuppliers();
        fetchWarehouses();
        fetchHSN();
    }, []);

    // Handlers for dropdowns
    const handleBrandChange = (selectedOption) => setSelectedBrands(selectedOption);
    const handleUnitChange = (selectedOption) => setSelectedUnits(selectedOption);
    const handleSupplierChange = (selectedOption) => setSelectedSupplier(selectedOption);
    const handleWarehouseChange = (selectedOption) => setSelectedWarehouse(selectedOption);
    const handleHSNChange = (selectedOption) => setSelectedHSN(selectedOption);
    const subCategoryChange = (selectedOption) => setSelectedsubCategory(selectedOption);

    // Generic input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formPayload = new FormData();
        formPayload.append("productName", formData.productName);
        formPayload.append("sku", formData.sku);
        formPayload.append("brand", selectedBrands?.value);
        formPayload.append("category", selectedCategory?.value);
        formPayload.append("subCategory", selectedsubCategory?.value);
        if (selectedSupplier?.value && typeof selectedSupplier.value === 'string' && selectedSupplier.value.trim() !== '') {
            formPayload.append("supplier", selectedSupplier.value);
        }
        formPayload.append("itemBarcode", formData.itemBarcode);
        formPayload.append("store", formData.store);
        formPayload.append("warehouse", selectedWarehouse?.value);
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
        formPayload.append("variants", JSON.stringify(formData.variants));
        images.forEach((imgFile) => {
            formPayload.append("images", imgFile);
        });
        try {
            await axios.put(`${BASE_URL}/api/products/${id}`, formPayload, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Product updated successfully!");
            navigate("/product");
        } catch (err) {
            toast.error("Failed to update product");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page-wrapper mt-4">
            <div className="content">
                <h4>Edit Product</h4>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Example: Product Name */}
                    <div className="mb-3">
                        <label className="form-label">Product Name</label>
                        <input type="text" name="productName" className="form-control" value={formData.productName || ""} onChange={handleChange} />
                    </div>
                    {/* SKU */}
                    <div className="mb-3">
                        <label className="form-label">SKU</label>
                        <input type="text" name="sku" className="form-control" value={formData.sku || ""} onChange={handleChange} />
                    </div>
                    {/* Brand */}
                    <div className="mb-3">
                        <label className="form-label">Brand</label>
                        <select value={selectedBrands?.value || formData.brand} onChange={e => handleBrandChange(brandOptions.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select Brand</option>
                            {brandOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Category */}
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select value={selectedCategory?.value || formData.category} onChange={e => setSelectedCategory(categories.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select Category</option>
                            {categories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* SubCategory */}
                    <div className="mb-3">
                        <label className="form-label">SubCategory</label>
                        <select value={selectedsubCategory?.value || formData.subCategory} onChange={e => subCategoryChange(subcategories.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select SubCategory</option>
                            {subcategories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Supplier */}
                    <div className="mb-3">
                        <label className="form-label">Supplier</label>
                        <select value={selectedSupplier?.value || formData.supplier} onChange={e => handleSupplierChange(options.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select Supplier</option>
                            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Item Barcode */}
                    <div className="mb-3">
                        <label className="form-label">Item Barcode</label>
                        <input type="text" name="itemBarcode" className="form-control" value={formData.itemBarcode || ""} onChange={handleChange} />
                    </div>
                    {/* Store */}
                    <div className="mb-3">
                        <label className="form-label">Store</label>
                        <input type="text" name="store" className="form-control" value={formData.store || ""} onChange={handleChange} />
                    </div>
                    {/* Warehouse */}
                    <div className="mb-3">
                        <label className="form-label">Warehouse</label>
                        <select value={selectedWarehouse?.value || formData.warehouse} onChange={e => handleWarehouseChange(optionsware.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select Warehouse</option>
                            {optionsware.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* HSN */}
                    <div className="mb-3">
                        <label className="form-label">HSN</label>
                        <select value={selectedHSN?.value || formData.hsn} onChange={e => handleHSNChange(optionsHsn.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select HSN</option>
                            {optionsHsn.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Purchase Price */}
                    <div className="mb-3">
                        <label className="form-label">Purchase Price</label>
                        <input type="number" name="purchasePrice" className="form-control" value={formData.purchasePrice || ""} onChange={handleChange} />
                    </div>
                    {/* Selling Price */}
                    <div className="mb-3">
                        <label className="form-label">Selling Price</label>
                        <input type="number" name="sellingPrice" className="form-control" value={formData.sellingPrice || ""} onChange={handleChange} />
                    </div>
                    {/* Wholesale Price */}
                    <div className="mb-3">
                        <label className="form-label">Wholesale Price</label>
                        <input type="number" name="wholesalePrice" className="form-control" value={formData.wholesalePrice || ""} onChange={handleChange} />
                    </div>
                    {/* Retail Price */}
                    <div className="mb-3">
                        <label className="form-label">Retail Price</label>
                        <input type="number" name="retailPrice" className="form-control" value={formData.retailPrice || ""} onChange={handleChange} />
                    </div>
                    {/* Quantity */}
                    <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input type="number" name="quantity" className="form-control" value={formData.quantity || ""} onChange={handleChange} />
                    </div>
                    {/* Unit */}
                    <div className="mb-3">
                        <label className="form-label">Unit</label>
                        <select value={selectedUnits?.value || formData.unit} onChange={e => handleUnitChange(unitsOptions.find(opt => opt.value === e.target.value))} className="form-select">
                            <option value="">Select Unit</option>
                            {unitsOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Tax Type */}
                    <div className="mb-3">
                        <label className="form-label">Tax Type</label>
                        <input type="text" name="taxType" className="form-control" value={formData.taxType || ""} onChange={handleChange} />
                    </div>
                    {/* Tax */}
                    <div className="mb-3">
                        <label className="form-label">Tax</label>
                        <input type="text" name="tax" className="form-control" value={formData.tax || ""} onChange={handleChange} />
                    </div>
                    {/* Discount Type */}
                    <div className="mb-3">
                        <label className="form-label">Discount Type</label>
                        <input type="text" name="discountType" className="form-control" value={formData.discountType || ""} onChange={handleChange} />
                    </div>
                    {/* Discount Value */}
                    <div className="mb-3">
                        <label className="form-label">Discount Value</label>
                        <input type="number" name="discountValue" className="form-control" value={formData.discountValue || ""} onChange={handleChange} />
                    </div>
                    {/* Quantity Alert */}
                    <div className="mb-3">
                        <label className="form-label">Quantity Alert</label>
                        <input type="number" name="quantityAlert" className="form-control" value={formData.quantityAlert || ""} onChange={handleChange} />
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-control" value={formData.description || ""} onChange={handleChange} />
                    </div>
                    {/* SEO Title */}
                    <div className="mb-3">
                        <label className="form-label">SEO Title</label>
                        <input type="text" name="seoTitle" className="form-control" value={formData.seoTitle || ""} onChange={handleChange} />
                    </div>
                    {/* SEO Description */}
                    <div className="mb-3">
                        <label className="form-label">SEO Description</label>
                        <input type="text" name="seoDescription" className="form-control" value={formData.seoDescription || ""} onChange={handleChange} />
                    </div>
                    {/* Item Type */}
                    <div className="mb-3">
                        <label className="form-label">Item Type</label>
                        <select name="itemType" className="form-select" value={formData.itemType} onChange={handleChange}>
                            <option value="Good">Good</option>
                            <option value="Service">Service</option>
                        </select>
                    </div>
                    {/* Advanced Toggle */}
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="advanceSwitch" name="isAdvanced" checked={formData.isAdvanced} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="advanceSwitch">Advanced</label>
                    </div>
                    {/* Advanced Fields */}
                    {formData.isAdvanced && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Lead Time</label>
                                <input type="text" name="leadTime" className="form-control" value={formData.leadTime || ""} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Reorder Level</label>
                                <input type="text" name="reorderLevel" className="form-control" value={formData.reorderLevel || ""} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Initial Stock</label>
                                <input type="text" name="initialStock" className="form-control" value={formData.initialStock || ""} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Track Type</label>
                                <select name="trackType" className="form-select" value={formData.trackType} onChange={handleChange}>
                                    <option value="serial">Serial No</option>
                                    <option value="batch">Batch No</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                            {formData.trackType === "serial" && (
                                <div className="mb-3">
                                    <label className="form-label">Serial Number</label>
                                    <input type="text" name="serialNumber" className="form-control" value={formData.serialNumber || ""} onChange={handleChange} />
                                </div>
                            )}
                            {formData.trackType === "batch" && (
                                <div className="mb-3">
                                    <label className="form-label">Batch Number</label>
                                    <input type="text" name="batchNumber" className="form-control" value={formData.batchNumber || ""} onChange={handleChange} />
                                </div>
                            )}
                            {formData.trackType === "status" && (
                                <div className="form-check mb-3">
                                    <input type="checkbox" className="form-check-input" id="returnable" name="isReturnable" checked={formData.isReturnable} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="returnable">Returnable</label>
                                </div>
                            )}
                        </>
                    )}
                    {/* Expiration Date */}
                    <div className="mb-3">
                        <label className="form-label">Expiration Date</label>
                        <input type="date" name="expirationDate" className="form-control" value={formData.expirationDate || ""} onChange={handleChange} />
                    </div>
                    {/* Variants */}
                    <div className="mb-3">
                        <label className="form-label">Variants (comma separated)</label>
                        <input type="text" name="variants" className="form-control" value={Object.values(formData.variants).join(", ") || ""} onChange={e => setFormData(prev => ({ ...prev, variants: { ...prev.variants, default: e.target.value.split(",").map(v => v.trim()) } }))} />
                    </div>
                    {/* Images */}
                    <div className="mb-3">
                        <label className="form-label">Images</label>
                        <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} className="form-control" />
                        <div className="row mt-3">
                            {images.map((file, i) => (
                                <div className="col-3 mb-3" key={i}>
                                    <img src={file.preview || (file.url ? file.url : "")} className="img-thumbnail" style={{ height: 120, objectFit: "cover" }} alt="Product" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
