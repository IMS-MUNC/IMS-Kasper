import React, { useMemo, useRef, useState, useEffect } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import BASE_URL from "../../../pages/config/config";
import Pagination from "../../../utils/pagination/Pagination";
import { toast, ToastContainer } from 'react-toastify';

const Variant = ({ show, handleClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [variantData, setVariantData] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [variantDropdown, setVariantDropdown] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [valueDropdown, setValueDropdown] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const fetchVariants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/variant-attributes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch variant data");
      }
      const data = await res.json();
      const updatedData = data.map((item) => ({
        ...item,
        id: item._id,
      }));
      // console.log("Fetched Data:", updatedData);
      setVariantData(updatedData);
    } catch (err) {
      console.error("Error fetching variants:", err);
      setError("Failed to fetch variants");
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const [formData, setFormData] = useState({
    variant: "",
    value: "",
    createdDate: dayjs().format("YYYY-MM-DD"),
    status: true,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    variant: "",
    value: "",
    createdDate: "",
    status: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/variant-attributes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add variant");
      }
      const data = await response.json();
      toast.success("New Variant added.");
      setVariantData((prevData) => [...prevData, { ...data, id: data._id }]);
      handleCloses();
      setFormData("");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err.message);
    }
  };

  const handleEditOpen = (item) => {
    setEditFormData({
      id: item.id || "",
      variant: item.variant || "",
      value: item.value || "",
      createdDate: item.createdDate || "",
      status: item.status !== undefined ? item.status : true,
    });
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditFormData({ id: "", variant: "", value: "", createdDate: "", status: true });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/variant-attributes/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update variant");
      }
      const data = await response.json();
      // Refetch data to ensure consistency
      await fetchVariants();
      toast.success("Variant edited successfully.");
      handleEditClose();
    } catch (err) {
      // console.error("Error updating variant:", err);
      setError("Failed to update variant. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/variant-attributes/${pendingDeleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the variant");
      }
      toast.success("Variant deleted successfully.");
      setVariantData((prev) => prev.filter((item) => item.id !== pendingDeleteId));
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    } catch (err) {
      console.error("Error deleting variant:", err);
      setError("Failed to delete the variant. Please try again.");
    }
  };

  const openDeleteModal = (id) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle individual variant selection
  const handleVariantSelection = (variantId) => {
    setSelectedVariants(prev => {
      if (prev.includes(variantId)) {
        return prev.filter(id => id !== variantId);
      } else {
        return [...prev, variantId];
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVariants([]);
      setSelectAll(false);
    } else {
      // Only select variants on the current page
      const currentPageVariants = filteredVariants
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
      const currentPageVariantIds = currentPageVariants.map(variant => variant._id);
      setSelectedVariants(currentPageVariantIds);
      setSelectAll(true);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedVariants.length === 0) {
      toast.warn("No variants selected!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected variants?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedVariants.map((id) =>
          fetch(`${BASE_URL}/api/variant-attributes/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      toast.success("Selected variants deleted successfully");
      fetchVariants();
      setSelectedVariants([]);
      setSelectAll(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please login again");
      } else if (error.response?.status === 403) {
        toast.error("Forbidden: You don't have permission to delete variants");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete selected variants");
      }
    }
  };

  const filteredVariants = useMemo(() => {
    return variantData
      .filter((item) => {
        const variant = item?.variant?.toLowerCase() || "";
        const value = item?.value?.toLowerCase() || "";
        const search = searchTerm?.toLowerCase() || "";
        const searchMatch = variant.includes(search) || value.includes(search);
        const statusMatch =
          statusFilter === "all" ||
          (statusFilter === "active" && item.status) ||
          (statusFilter === "inactive" && !item.status);
        return searchMatch && statusMatch;
      })
      .sort((a, b) => {
        // Sort by creation date in descending order (LIFO - newest first)
        const dateA = new Date(a.createdAt || a.createdDate || 0);
        const dateB = new Date(b.createdAt || b.createdDate || 0);
        return dateB - dateA;
      });
  }, [variantData, searchTerm, statusFilter]);

  useEffect(() => {
  const totalPages = Math.ceil(filteredVariants.length / rowsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }
}, [filteredVariants, rowsPerPage]);


  // Sync selectAll state with selectedVariants (only for current page)
  useEffect(() => {
    if (filteredVariants.length > 0) {
      // Only check variants on the current page
      const currentPageVariants = filteredVariants
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

      if (currentPageVariants.length > 0) {
        const allCurrentPageSelected = currentPageVariants.every(variant =>
          selectedVariants.includes(variant._id)
        );
        setSelectAll(allCurrentPageSelected);
      } else {
        setSelectAll(false);
      }
    } else {
      setSelectAll(false);
    }
  }, [selectedVariants, filteredVariants, currentPage, rowsPerPage]);

  const handleExportPDF = () => {
    // Create a temporary table without action columns for PDF export
    const tempTable = document.createElement('table');
    tempTable.className = 'table datatable';
    tempTable.style.width = '100%';
    tempTable.style.borderCollapse = 'collapse';
    
    // Create header without action column
    const thead = document.createElement('thead');
    thead.className = 'thead-light';
    const headerRow = document.createElement('tr');
    
    const headers = ['Variant', 'Values', 'Created Date', 'Status'];
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.border = '1px solid #ddd';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f8f9fa';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    tempTable.appendChild(thead);
    
    // Create body with data rows (excluding action column)
    const tbody = document.createElement('tbody');
    filteredVariants.forEach(item => {
      const row = document.createElement('tr');
      
      // Variant column
      const variantCell = document.createElement('td');
      variantCell.textContent = item.variant;
      variantCell.style.border = '1px solid #ddd';
      variantCell.style.padding = '8px';
      row.appendChild(variantCell);
      
      // Values column
      const valueCell = document.createElement('td');
      valueCell.textContent = item.value;
      valueCell.style.border = '1px solid #ddd';
      valueCell.style.padding = '8px';
      row.appendChild(valueCell);
      
      // Created Date column
      const dateCell = document.createElement('td');
      dateCell.textContent = dayjs(item.createdAt).format("DD MMM YYYY");
      dateCell.style.border = '1px solid #ddd';
      dateCell.style.padding = '8px';
      row.appendChild(dateCell);
      
      // Status column
      const statusCell = document.createElement('td');
      statusCell.textContent = item.status ? "Active" : "Inactive";
      statusCell.style.border = '1px solid #ddd';
      statusCell.style.padding = '8px';
      statusCell.style.color = item.status ? '#28a745' : '#dc3545';
      statusCell.style.fontWeight = 'bold';
      row.appendChild(statusCell);
      
      tbody.appendChild(row);
    });
    
    tempTable.appendChild(tbody);
    
    // Temporarily add to DOM for html2canvas
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    document.body.appendChild(tempTable);
    
    html2canvas(tempTable, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = 0;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("variants.pdf");
      
      // Clean up temporary table
      document.body.removeChild(tempTable);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
      
      // Clean up temporary table in case of error
      if (document.body.contains(tempTable)) {
        document.body.removeChild(tempTable);
      }
    });
  };

  const handleExportExcel = () => {
    const exportData = filteredVariants.map((item) => ({
      Variant: item.variant,
      Values: item.value,
      "Created Date": dayjs(item.createdAt).format("DD MMM YYYY"),
      Status: item.status ? "Active" : "Inactive",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Variants");
    XLSX.writeFile(workbook, "variants.xlsx");
  };

  const handleCloses = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Fetch all variants for dropdown (status true only)
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/variant-attributes/active-variants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setVariantDropdown(data))
      .catch(err => console.error("Error fetching variant dropdown:", err));
  }, []);

  // Fetch values for selected variant and split comma-separated values
  useEffect(() => {
    if (selectedVariant) {
      const token = localStorage.getItem("token");
      fetch(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(selectedVariant)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          // If backend returns array of comma-separated strings, flatten them
          let values = [];
          data.forEach(val => {
            if (typeof val === 'string') {
              values.push(...val.split(',').map(v => v.trim()).filter(Boolean));
            }
          });
          setValueDropdown(values);
        })
        .catch(err => console.error("Error fetching value dropdown:", err));
    } else {
      setValueDropdown([]);
      setSelectedValue("");
    }
  }, [selectedVariant]);

  return (
    <div className="page-wrapper">
      <div className="content">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Variant Attributes</h4>
              <h6>Manage your variant attributes</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Export : </label>
              <button onClick={handleExportPDF} title="Download PDF" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFilePdf className="fs-20" style={{ color: "red" }} /></button>
              <button onClick={handleExportExcel} title="Download Excel" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFileExcel className="fs-20" style={{ color: "orange" }} /></button>
            </li>
            {/* <li>
              <a onClick={handleExportExcel} title="Download Excel">
                <FaFileExcel className="fs-20" style={{ color: "green" }} />
              </a>
            </li> */}
            <li>
              <button
                title="Refresh"
                onClick={() => location.reload()}
                className="fs-20"
                style={{
                  backgroundColor: "white",
                  padding: "5px 5px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e8eaebff",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                <TbRefresh className="ti ti-refresh" />
              </button>
            </li>
          </ul>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-variant"
              onClick={handleShow}
            >
              <i className="ti ti-circle-plus me-1" />
              Add Variant
            </a>
          </div>
        </div>
        {selectedVariants.length > 0 && (
          <div className="mb-3">
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedVariants.length})
            </button>
          </div>
        )}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search variants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="table-dropdown my-xl-auto right-content">
              <div className="dropdown">
                <a
                  className="btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) || "Status"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a
                      className="dropdown-item rounded-1"
                      onClick={() => setStatusFilter("all")}
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item rounded-1"
                      onClick={() => setStatusFilter("active")}
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item rounded-1"
                      onClick={() => setStatusFilter("inactive")}
                    >
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable" ref={tableRef}>
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Variant</th>
                    <th>Values</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="d-flex flex-column align-items-center">
                          <div className="mb-2">
                            <i className="fas fa-box-open fa-3x text-muted"></i>
                          </div>
                          <p className="text-muted mb-1">
                            {statusFilter === "active" 
                              ? "No Active Variants Found" 
                              : statusFilter === "inactive" 
                              ? "No Inactive Variants Found"
                              : searchTerm 
                              ? "No Variants Match Your Search"
                              : "No Variants Available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredVariants
                      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                      .map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <label className="checkboxs">
                              <input
                                type="checkbox"
                                checked={selectedVariants.includes(item._id)}
                                onChange={() => handleVariantSelection(item._id)}
                              />
                              <span className="checkmarks" />
                            </label>
                          </td>
                          <td className="text-gray-9">{item.variant}</td>
                          <td>{item.value}</td>
                          <td>{dayjs(item.createdAt).format("DD MMM YYYY")}</td>
                          <td>
                            <span
                              className={`badge table-badge fw-medium fs-10 ${item.status ? "bg-success" : "bg-danger"
                                }`}
                            >
                              {item.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="action-table-data">
                            <div className="edit-delete-action">
                              <a
                                className="me-2 p-2"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-variant"
                                onClick={() => handleEditOpen(item)}
                              >
                                <TbEdit className="feather-edit" />
                              </a>
                              <a
                                className="p-2"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                                onClick={() => openDeleteModal(item.id)}
                              >
                                <TbTrash className="feather-trash-2" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
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
                {filteredVariants.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    filteredVariants.length
                  )} of ${filteredVariants.length}`}
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
                    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredVariants.length / rowsPerPage)))
                  }
                  disabled={currentPage === Math.ceil(filteredVariants.length / rowsPerPage)}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* DROPDOWN UI BELOW TABLE */}
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
          </div>
        </div> */}

        <Modal show={showModal} onHide={handleCloses} centered>
          <Modal.Header>
            <Modal.Title>Add Variant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="variant">
                <Form.Label>
                  Variant <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter variant (e.g., Size, Color)"
                  name="variant"
                  value={formData.variant}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="value" className="mt-3">
                <Form.Label>
                  Values <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter values separated by comma (e.g., XS, S, M, L)"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                />
              </Form.Group>
              <small>Enter values separated by commas</small>
              <Form.Group
                controlId="status"
                className="mt-4 d-flex align-items-center justify-content-between"
              >
                <Form.Label className="me-3 mb-0">Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleCloses} className="me-2">
              Cancel
            </Button>
            <Button variant="warning" onClick={handleSubmit}>
              Add Variant
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={handleEditClose} centered>
          <Modal.Header>
            <Modal.Title>Edit Variant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editVariant">
                <Form.Label>
                  Variant <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="variant"
                  value={editFormData.variant}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editValue" className="mt-3">
                <Form.Label>
                  Values <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="value"
                  value={editFormData.value}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group
                controlId="editStatus"
                className="mt-4 d-flex align-items-center justify-content-between"
              >
                <Form.Label className="me-3 mb-0">Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="status"
                  checked={editFormData.status}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleEditClose} className="me-2">
              Cancel
            </Button>
            <Button variant="warning" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this variant?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Variant;