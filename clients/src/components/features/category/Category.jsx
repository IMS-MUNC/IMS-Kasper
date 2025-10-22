import React, { useEffect, useState } from "react";
import BASE_URL from "../../../pages/config/config";
import axios from "axios";
import { TbChevronUp, TbEdit, TbTrash } from "react-icons/tb";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import CategoryModal from "../../../pages/Modal/categoryModals/CategoryModal";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import { sanitizeInput } from "../../../utils/sanitize";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useTranslation } from 'react-i18next';

const Category = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const nameRegex = /^[A-Za-z]{2,}$/;
  const slugRegex = /^[a-z0-9-]{2,}$/;

  // Edit state
  const [editingCategories, setEditingCategories] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategorySlug, setEditCategorySlug] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Real-time validation for categoryName
  const validateCategoryName = (value) => {
    if (!value) {
      return "Category name is required";
    }
    if (!nameRegex.test(value)) {
      return "Category name must contain only letters (min 2 characters)";
    }
    return "";
  };

  // Handle category name change with real-time validation
  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    if (isEditMode) {
      setEditCategoryName(value);
    } else {
      setCategoryName(value);
    }
    setErrors((prev) => ({
      ...prev,
      categoryName: validateCategoryName(value),
    }));
  };

  // Handle slug change with real-time validation
  const handleSlugChange = (e) => {
    const value = e.target.value;
    if (isEditMode) {
      setEditCategorySlug(value);
    } else {
      setCategorySlug(value);
    }
    setErrors((prev) => ({
      ...prev,
      categorySlug: value && !slugRegex.test(value)
        ? "Enter a valid slug (lowercase letters, numbers, hyphens, min 2 chars)"
        : "",
    }));
  };

  const handleBulkDelete = async () => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/category/categories/bulk-delete`,
        { ids: selectedCategories },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Selected categories deleted");
      setSelectedCategories([]);
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again");
      } else if (err.response?.status === 403) {
        toast.error("You don't have permission to delete categories");
      } else {
        toast.error("Bulk delete failed. Please try again");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/category/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.categoryName = validateCategoryName(categoryName);
    if (categorySlug && !slugRegex.test(categorySlug)) {
      newErrors.categorySlug =
        "Enter a valid slug (lowercase letters, numbers, hyphens, min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).some((key) => newErrors[key])) return;

    try {
      const token = localStorage.getItem("token");
      const cleanName = sanitizeInput(categoryName);
      const cleanSlug = sanitizeInput(categorySlug);

      const payload = { categoryName: cleanName };
      if (cleanSlug && cleanSlug.trim() !== "") {
        payload.categorySlug = cleanSlug;
      }

      await axios.post(`${BASE_URL}/api/category/categories`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category created successfully!");
      setCategoryName("");
      setCategorySlug("");
      setErrors({});
      fetchCategories();
      window.$("#categoryModal").modal("hide");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let newErrors = {};
    newErrors.categoryName = validateCategoryName(editCategoryName);
    if (!slugRegex.test(editCategorySlug)) {
      newErrors.categorySlug =
        "Enter a valid slug (lowercase letters, numbers, hyphens, min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).some((key) => newErrors[key])) return;

    try {
      const token = localStorage.getItem("token");
      const cleanName = sanitizeInput(editCategoryName);
      const cleanSlug = sanitizeInput(editCategorySlug);

      await axios.put(
        `${BASE_URL}/api/category/categories/${editingCategories._id}`,
        {
          categoryName: cleanName,
          categorySlug: cleanSlug,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Category updated successfully");
      setEditingCategories(null);
      setEditCategoryName("");
      setEditCategorySlug("");
      setErrors({});
      setIsEditMode(false);
      fetchCategories();
      window.$("#categoryModal").modal("hide");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      (category?.categoryName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (category?.categorySlug || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleDeleteCategory = async (id, categoryName) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/category/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
      Swal.fire(
        "Deleted!",
        `Category "${categoryName}" has been deleted.`,
        "success"
      );
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    }
  };

  // CSV, Excel, and PDF export functions (unchanged)
  const handleCSV = () => {
    const tableHeader = [
      "Category Code",
      "Category",
      "Category slug",
      "Created On",
    ];
    const csvRows = [
      tableHeader.join(","),
      ...categories.map((e) =>
        [e.categoryCode, e.categoryName, e.categorySlug, e.createdAt].join(",")
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "category.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcel = () => {
    const excelData = categories.map((category) => ({
      "Category Code": category.categoryCode,
      "Category": category.categoryName,
      "Category Slug": category.categorySlug,
      "Created On": new Date(category.createdAt).toLocaleDateString(),
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const columnWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "categories.xlsx");
  };

  const fileInputRef = React.useRef();

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      toast.error("Please select a valid Excel file");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredFields = [
          "Category Code",
          "Category",
          "Category slug",
          "Created On",
        ];
        const valid = results.data.every((row) =>
          requiredFields.every((f) => f in row && row[f] !== "")
        );
        if (!valid) {
          toast.error("File structure does not match the required schema.");
          return;
        }
        try {
          const token = localStorage.getItem("token");
          await axios.post(`${BASE_URL}/api/category/categories`, results.data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Imported successfully!");
          fetchCategories();
        } catch (err) {
          console.error("Error while importing:", err);
          toast.error("Error while importing categories");
        }
      },
    });
  };

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Category", 14, 15);
    const tableColumns = [
      "Category Code",
      "Category",
      "Category slug",
      "Created On",
    ];
    const tableRows = categories.map((e) => [
      e.categoryCode,
      e.categoryName,
      e.categorySlug,
      e.createdAt,
    ]);
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [155, 155, 155], textColor: "white" },
      theme: "striped",
    });
    doc.save("categories.pdf");
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("Category")}</h4>
              <h6>{t("Manage your categories")}</h6>
            </div>
          </div>
          <div
            className="table-top-head me-2"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            {selectedCategories.length > 0 && (
              <div>
                <button className="btn btn-danger" onClick={handleBulkDelete}>
                  Delete Selected ({selectedCategories.length})
                </button>
              </div>
            )}
            <div
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              className="icon-btn"
            >
              <label title="">{t("Export :")} </label>
              <button
                onClick={handlePdf}
                title={t("Download PDF")}
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <FaFilePdf className="fs-20" style={{ color: "red" }} />
              </button>
              <button
                onClick={handleExcel}
                title={t("Download Excel")}
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <FaFileExcel className="fs-20" style={{ color: "orange" }} />
              </button>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
              className="icon-btn"
            >
              <label title="">{t("Import :")}</label>
              <label title={t("Import Excel")}>
                <button
                  type="button"
                  onClick={handleImportClick}
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                  }}
                >
                  <FaFileExcel style={{ color: "green" }} />
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#categoryModal"
              onClick={() => {
                setIsEditMode(false);
                setCategoryName("");
                setCategorySlug("");
                setErrors({});
              }}
            >
              <i className="ti ti-circle-plus me-1" />
              {t("Add Category")}
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder={t("Search category...")}
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          checked={
                            paginatedCategories.length > 0 &&
                            paginatedCategories.every((cat) =>
                              selectedCategories.includes(cat._id)
                            )
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newIds = paginatedCategories.map(
                                (cat) => cat._id
                              );
                              setSelectedCategories((prev) => [
                                ...new Set([...prev, ...newIds]),
                              ]);
                            } else {
                              const idsToRemove = paginatedCategories.map(
                                (cat) => cat._id
                              );
                              setSelectedCategories((prev) =>
                                prev.filter((id) => !idsToRemove.includes(id))
                              );
                            }
                          }}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>{t("Category Code")}</th>
                    <th>{t("Category")}</th>
                    <th>{t("Category slug")}</th>
                    <th>{t("Created On")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category) => (
                      <tr key={category._id} style={{ textAlign: "center" }}>
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories((prev) => [
                                    ...prev,
                                    category._id,
                                  ]);
                                } else {
                                  setSelectedCategories((prev) =>
                                    prev.filter((id) => id !== category._id)
                                  );
                                }
                              }}
                            />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>
                          <span className="text-gray-9">
                            {category.categoryCode}
                          </span>
                        </td>
                        <td>
                          <span className="text-gray-9">
                            {category.categoryName}
                          </span>
                        </td>
                        <td>{category.categorySlug}</td>
                        <td>
                          {new Date(category.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#categoryModal"
                              onClick={() => {
                                setIsEditMode(true);
                                setEditingCategories(category);
                                setEditCategoryName(category.categoryName);
                                setEditCategorySlug(category.categorySlug);
                                setErrors({});
                              }}
                            >
                              <TbEdit />
                            </a>
                            <a
                              className="p-2"
                              onClick={() =>
                                handleDeleteCategory(
                                  category._id,
                                  category.categoryName
                                )
                              }
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        {t("No categories found.")}
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
                <option value={10}>10 {t("Per Page")}</option>
                <option value={25}>25 {t("Per Page")}</option>
                <option value={50}>50 {t("Per Page")}</option>
                <option value={100}>100 {t("Per Page")}</option>
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
                {filteredCategories.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredCategories.length
                    )} of ${filteredCategories.length}`}
                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </button>
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
      </div>

      <CategoryModal
        modalId="categoryModal"
        title={isEditMode ? [t("Edit Category")] : [t("Add Category")]}
        isEditMode={isEditMode}
        categoryName={isEditMode ? editCategoryName : categoryName}
        categorySlug={isEditMode ? editCategorySlug : categorySlug}
        onCategoryChange={handleCategoryNameChange}
        onSlugChange={handleSlugChange}
        onSubmit={isEditMode ? handleUpdate : handleSubmit}
        submitLabel={isEditMode ? [t("Update")] : [t("Submit")]}
        errors={errors}
      />
    </div>
  );
};

export default Category;