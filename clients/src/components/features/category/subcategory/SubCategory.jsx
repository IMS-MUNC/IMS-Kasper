import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import "../../../../styles/category/category.css";
import BASE_URL from "../../../../pages/config/config";
import Select from "react-select";
import { CiCirclePlus } from "react-icons/ci";
import { FiXSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import { sanitizeInput } from "../../../../utils/sanitize";
import axios from "axios";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const SubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const [errors, setErrors] = useState({});
  const nameRegex = /^[A-Za-z]{2,}$/;

  // Edit form state variables to prevent direct mutation
  const [editSubCategoryName, setEditSubCategoryName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSelectedCategory, setEditSelectedCategory] = useState(null);
  const [editStatus, setEditStatus] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // NEW STATE: track selected subcategories for bulk delete
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/category/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Map data for react-select
      const options = data.map((category) => ({
        value: category._id, // or category.categoryName
        label: category.categoryName,
        code: category.categoryCode,
        original: category,
      }));

      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    console.log("Selected category:", selectedOption);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };


  // 👉 Handle single checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id)
        ? prev.filter((subId) => subId !== id)
        : [...prev, id]
    );
  };

  // 👉 Handle select all toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubCategories([]);
    } else {
      setSelectedSubCategories(paginatedSubCategories.map((s) => s._id));
    }
    setSelectAll(!selectAll);
  };

  // 👉 Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSubCategories.length === 0) {
      toast.warn("No subcategories selected!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected subcategories?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedSubCategories.map((id) =>
          axios.delete(`${BASE_URL}/api/subcategory/subcategories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      toast.success("Selected subcategories deleted successfully");
      fetchSubcategories();
      setSelectedSubCategories([]);
      setSelectAll(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please login again");
      } else if (error.response?.status === 403) {
        toast.error("Forbidden: You don't have permission to delete subcategories");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete selected subcategories");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!nameRegex.test(subCategoryName)) {
      newErrors.subCategoryName =
        "Enter a valid subcategory name (letters only, min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const token = localStorage.getItem("token")
      if (!selectedCategory || !subCategoryName || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Sanitize before sending
      const cleanName = sanitizeInput(subCategoryName);
      const cleanDescription = sanitizeInput(description);

      const formData = new FormData();
      formData.append("subCategoryName", cleanName);
      formData.append("description", cleanDescription);
      formData.append("status", status);

      images.forEach((file) => formData.append("images", file));

      const res = await fetch(
        `${BASE_URL}/api/subcategory/categories/${selectedCategory.value}/subcategories`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(result.message);

      // ✅ Reset form fields
      setSubCategoryName("");
      setDescription("");
      setStatus(true); // or whatever default
      setImages([]);
      setImagePreviews([]);
      setSelectedCategory(null);

      // Force immediate cleanup before fetching data
      forceCleanupModal();
      closeAddModal();

      // Fetch updated data after modal cleanup
      setTimeout(() => {
        fetchSubcategories();
      }, 100);
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Failed to add subcategory");
      closeAddModal();
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/subcategory/subcategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  const filteredSubCategories = subcategories.filter(
    (subcat) =>
      subcat.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subcat.description &&
        subcat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Prevent multiple simultaneous operations
    if (isUpdating) return;
    setIsUpdating(true);

    let newErrors = {};
    if (!nameRegex.test(editSubCategoryName)) {
      newErrors.subCategoryName =
        "Enter a valid subcategory name (letters only min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("token")
      const cleanName = sanitizeInput(editSubCategoryName);
      const cleanDescription = sanitizeInput(editDescription);

      const formData = new FormData();
      formData.append("subCategoryName", cleanName);
      formData.append("description", cleanDescription);
      formData.append("status", editStatus);
      formData.append("categoryId", editSelectedCategory?.value || editingSubCategory.categoryId);

      if (images.length > 0) {
        images.forEach((file) => formData.append("images", file));
      }


      const res = await axios.put(
        `${BASE_URL}/api/subcategory/subcategory/${editingSubCategory._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Subcategory updated successfully!");

      // Close modal first
      closeEditModal();

      // Clear editing state after modal is closed
      setTimeout(() => {
        setEditingSubCategory(null);
        setEditSubCategoryName("");
        setEditDescription("");
        setEditSelectedCategory(null);
        setEditStatus(true);
        setImages([]);
        setImagePreviews([]);
        setErrors({});
        setSelectedCategory(null);
        setIsUpdating(false);

        // Fetch updated data after state is cleared
        fetchSubcategories();
      }, 150);
    } catch (error) {
      toast.error(error.message || "Failed to update subcategory");
      
      // Close modal first
      closeEditModal();
      
      // Clear editing state even on error
      setTimeout(() => {
        setEditingSubCategory(null);
        setEditSubCategoryName("");
        setEditDescription("");
        setEditSelectedCategory(null);
        setEditStatus(true);
        setImages([]);
        setImagePreviews([]);
        setErrors({});
        setSelectedCategory(null);
        setIsUpdating(false);
      }, 150);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token")
      const res = await axios.delete(
        `${BASE_URL}/api/subcategory/subcategories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      toast.success(res.data.message || "Subcategory deleted successfully");
      fetchSubcategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    }
  };

  // Enhanced modal cleanup functions for Bootstrap 5
  const forceCleanupModal = () => {
    // Remove ALL modal backdrops (in case there are multiple)
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // Remove modal-open class and reset body styles
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.marginRight = '';

    // Remove any Bootstrap 5 specific classes
    document.body.classList.remove('modal-backdrop');
    document.documentElement.style.overflow = '';

    // Force remove any lingering modal states
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    });
  };

  const closeAddModal = () => {
    // Close modal immediately
    const modal = window.$("#add-category");
    modal.modal("hide");

    // Force immediate cleanup
    forceCleanupModal();

    // Additional cleanup after animation
    setTimeout(() => {
      forceCleanupModal();
    }, 100);
  };

  const closeEditModal = () => {
    // Close modal immediately  
    const modal = window.$("#edit-category");
    modal.modal("hide");

    // Force immediate cleanup
    forceCleanupModal();

    // Additional cleanup after animation
    setTimeout(() => {
      forceCleanupModal();
    }, 100);
  };

  // Cancel handlers for modals
  const handleCancelAdd = () => {
    // Clear form fields
    setSubCategoryName("");
    setDescription("");
    setStatus(true);
    setImages([]);
    setImagePreviews([]);
    setSelectedCategory(null);
    setErrors({});

    closeAddModal();
  };

  const handleCancelEdit = () => {
    // Clear editing state completely
    setEditingSubCategory(null);
    setEditSubCategoryName("");
    setEditDescription("");
    setEditSelectedCategory(null);
    setEditStatus(true);
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    
    // Clear any selected category state that might interfere
    setSelectedCategory(null);

    closeEditModal();
  };

  //pdf download------------------------------------------------------------------------------------------------------------------------------------------

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Sub Category", 14, 15);
    const tableColumns = [
      "Category Code",
      "Category",
      "Sub Category",
      "Description",
    ];

    const tableRows = subcategories.map((e) => [
      e.category?.categoryCode,
      e.category?.categoryName,
      e.subCategoryName,
      e.description,
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [155, 155, 155],
        textColor: "white",
      },
      theme: "striped",
    });

    doc.save("sub-categories.pdf");
  }


  //csv upload--------------------------------------------------------------------------------------------------------------------------------------------------

  const handleCSV = () => {
    const tableHeader = [
      "Category Code",
      "Category",
      "Sub Category",
      "Description",
    ];
    const csvRows = [
      tableHeader.join(","),
      ...subcategories.map((e) => [
        e.category?.categoryCode,
        e.category?.categoryName,
        e.subCategoryName,
        e.description,
      ].join(",")),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sub-category.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //excel export--------------------------------------------------------------------------------------------------------------------------------------------------

  const handleExcel = () => {
    // Prepare data for Excel export
    const excelData = subcategories.map((subcategory) => ({
      "Category Code": subcategory.category?.categoryCode || "",
      "Category": subcategory.category?.categoryName || "",
      "Sub Category": subcategory.subCategoryName || "",
      "Description": subcategory.description || "",
      "Status": subcategory.status ? "Active" : "Inactive",
      "Created On": subcategory.createdAt ? new Date(subcategory.createdAt).toLocaleDateString() : "",
    }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 15 }, // Category Code
      { wch: 25 }, // Category
      { wch: 25 }, // Sub Category
      { wch: 30 }, // Description
      { wch: 12 }, // Status
      { wch: 15 }, // Created On
    ];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sub Categories");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "sub-categories.xlsx");
  };


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Sub Category</h4>
              <h6>Manage your sub categories</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              {/*  Bulk Delete Button */}
              {selectedSubCategories.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={handleBulkDelete}
                  disabled={selectedSubCategories.length === 0}
                >
                  Delete ({selectedSubCategories.length}) Selected
                </button>
              )}</li>
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Export : </label>
              <button onClick={handlePdf} title="Download PDF" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFilePdf className="fs-20" style={{ color: "red" }} /></button>
              <button onClick={handleExcel} title="Download Excel" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFileExcel className="fs-20" style={{ color: "orange" }} /></button>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Import : </label>
              <label className="" title="Import Excel">
                <input type="file" accept=".xlsx, .xls" hidden />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            {/* <li>
              <button type="button" className="icon-btn" title="Export Excel" onClick={handleExcel}>
                <FaFileExcel />
              </button>
            </li> */}
          </div>
          <div className="page-btn d-flex gap-2">

            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-category"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Sub Category
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search subcategory..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" checked={selectAll} onChange={handleSelectAll} />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Category Code</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Description</th>
                    <th>Action</th>
                    {/* <th className="no-sort" /> */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubCategories.length > 0 ? (
                    paginatedSubCategories.map((subcat) => (
                      <tr key={subcat._id} style={{ textAlign: "center" }}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" checked={selectedSubCategories.includes(subcat._id)}
                              onChange={() => handleCheckboxChange(subcat._id)} />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{subcat.category?.categoryCode}</td>

                        <td>
                          {subcat.images?.map((img, i) => (
                            <>
                            <div style={{width:'25px', height:'25px', overflow:'hidden',borderRadius:'4px', display:'inline-block', justifyContent:'center', alignItems:'center', }}>
                              <img
                              key={i}
                              src={img}
                              alt="subcat-img"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            </div>
                            </>
                          ))}
                        </td>

                        <td>{subcat.category?.categoryName}</td>
                        <td>{subcat.subCategoryName}</td>
                        <td>{subcat.description}</td>
                        {/* <td>
                          <span className="badge bg-success fw-medium fs-10">
                            Active
                          </span>
                        </td> */}
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className={`me-2 p-2 ${isUpdating ? 'disabled' : ''}`}
                              data-bs-toggle="modal"
                              data-bs-target="#edit-category"
                              style={{ pointerEvents: isUpdating ? 'none' : 'auto', opacity: isUpdating ? 0.5 : 1 }}
                              onClick={() => {
                                if (isUpdating) return;
                                // Set the editing subcategory for reference (read-only)
                                setEditingSubCategory({
                                  ...subcat,
                                  category: subcat.category ? { ...subcat.category } : null,
                                  images: subcat.images ? [...subcat.images] : []
                                });
                                
                                // Populate form state variables
                                setEditSubCategoryName(subcat.subCategoryName || "");
                                setEditDescription(subcat.description || "");
                                setEditSelectedCategory(
                                  categories.find(cat => 
                                    cat.value === (subcat.category?._id || subcat.categoryId)
                                  ) || null
                                );
                                setEditStatus(subcat.status !== false); // Default to true if undefined
                                setImages([]);
                                setImagePreviews([]);
                                setErrors({});
                              }}
                            >
                              <TbEdit />
                            </a>
                            <a
                              className="p-2"
                              onClick={() => handleDelete(subcat._id)}
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select w-auto"
              >
                <option value={10}>10 Per Page</option>
                <option value={25}>25 Per Page</option>
                <option value={50}>50 Per Page</option>
                <option value={100}>100 Per Page</option>
              </select>
              <span
                style={{
                  backgroundColor: "white",
                  boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                  padding: "7px",
                  borderRadius: "5px",
                  border: "1px solid #e4e0e0ff",
                  color: "gray",
                }}
              >
                {filteredSubCategories.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredSubCategories.length
                  )} of ${filteredSubCategories.length}`}
                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </button>{" "}
                <button
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>
        {/* /product list */}
        {/* addd */}
        <div className="modal" id="add-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Add Sub Category</h4>
                </div>
                {/* <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button> */}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Image Upload Section */}
                  <div className="profile-pic-upload mb-3">
                    <div className="profile-pic brand-pic">
                      <span>
                        {images.length > 0 ? (
                          <img
                            src={URL.createObjectURL(images[0])}
                            alt="Preview"
                            height="40"
                            style={{
                              height: "102px",
                              width: "106px",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <>
                            <CiCirclePlus className="plus-down-add" /> Add Image
                          </>
                        )}
                      </span>
                    </div>
                    <div className="mb-0">
                      <input
                        type="file"
                        id="subCategoryImageInput"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImages([file]);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("subCategoryImageInput")
                            .click()
                        }
                        className="btn btn-outline-primary"
                      >
                        Upload Image
                      </button>
                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>

                    <Select
                      id="category"
                      options={categories}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isSearchable
                      placeholder="Search or select category..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                    {errors.subCategoryName && (<p className="text-danger">{errors.subCategoryName}</p>)}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2"
                        className="check"
                        defaultChecked
                        checked={status}
                        onChange={() => setStatus(!status)}
                      />
                      <label htmlFor="user2" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    onClick={handleCancelAdd}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Sub Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* edit */}
        <div className="modal fade" id="edit-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Sub Category</h4>
                </div>
                {/* <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button> */}
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="add-image-upload">
                      <div className="new-employee-field">
                        <div className="profile-pic-upload mb-3">
                          <div className="profile-pic brand-pic">
                            {images.length > 0 ? (
                              <img
                                src={URL.createObjectURL(images[0])}
                                alt="Preview"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : editingSubCategory?.images?.length > 0 ? (
                              <img
                                src={editingSubCategory.images[0]}
                                alt="current"
                                style={{
                                  height: "100px",
                                  width: "100px",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <span>No image</span>
                            )}
                            {(images.length > 0 ||
                              editingSubCategory?.images?.length > 0) && (
                                <a style={{ marginTop: '-100px' }}
                                  href="javascript:void(0);"
                                  onClick={() => {
                                    setImages([]);
                                    setEditingSubCategory({
                                      ...editingSubCategory,
                                      images: [],
                                    });
                                  }}
                                >
                                  <FiXSquare className="x-square-add image-close remove-product fs-12 text-white bg-danger rounded-1" />
                                </a>
                              )}
                          </div>
                          <div className="mb-0">
                            <input
                              type="file"
                              id="editSubCategoryImageInput"
                              accept="image/png, image/jpeg"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setImages([file]);
                                }
                              }}
                              style={{ display: "none" }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("editSubCategoryImageInput")
                                  .click()
                              }
                              className="btn btn-outline-primary"
                            >
                              Change Image
                            </button>
                            <p className="mt-2">JPEG, PNG up to 2 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>

                    <Select
                      id="category"
                      options={categories}
                      isSearchable
                      placeholder="Search or select category..."
                      value={editSelectedCategory}
                      onChange={(selectedOption) => setEditSelectedCategory(selectedOption)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSubCategoryName}
                      onChange={(e) => setEditSubCategoryName(e.target.value)}
                    />
                    {errors.subCategoryName && (
                      <p className="text-danger">{errors.subCategoryName}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category Code<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSelectedCategory?.code || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user3"
                        className="check"
                        checked={editStatus}
                        onChange={(e) => setEditStatus(e.target.checked)}
                      />
                      <label htmlFor="user3" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
