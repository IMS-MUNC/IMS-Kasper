import { useMemo, useRef, useState, useEffect } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import BASE_URL from "../../../pages/config/config";
import Pagination from "../../../utils/pagination/Pagination";

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
      console.log("Fetched Data:", updatedData);
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
      setVariantData((prevData) => [...prevData, { ...data, id: data._id }]);
      handleCloses();
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
      status: item.status || true,
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
      setVariantData((prevData) =>
        prevData.map((item) => (item.id === data.id ? { ...item, ...data } : item))
      );
      handleEditClose();
    } catch (err) {
      console.error("Error updating variant:", err);
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

  const filteredVariants = useMemo(() => {
    return variantData.filter((item) => {
      const variant = item?.variant?.toLowerCase() || "";
      const value = item?.value?.toLowerCase() || "";
      const search = searchTerm?.toLowerCase() || "";
      const searchMatch = variant.includes(search) || value.includes(search);
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status) ||
        (statusFilter === "inactive" && !item.status);
      return searchMatch && statusMatch;
    });
  }, [variantData, searchTerm, statusFilter]);

  const handleExportPDF = () => {
    const table = tableRef.current;
    if (!table) {
      console.error("Table reference not found");
      return;
    }
    html2canvas(table, { scale: 2 }).then((canvas) => {
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
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    });
  };

  const handleExportExcel = () => {
    const exportData = filteredVariants.map((item) => ({
      Variant: item.variant,
      Values: item.value,
      "Created Date": dayjs(item.createdDate).format("DD MMM YYYY"),
      Status: item.status ? "Active" : "Inactive",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Variants");
    XLSX.writeFile(workbook, "variants.xlsx");
  };

  const handleCloses = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
            <li>
              <a onClick={handleExportPDF} title="Download PDF">
                <FaFilePdf className="fs-20" style={{ color: "red" }} />
              </a>
            </li>
            <li>
              <a onClick={handleExportExcel} title="Download Excel">
                <FaFileExcel className="fs-20" style={{ color: "green" }} />
              </a>
            </li>
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
                <Button
                  className="btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) || "Status"}
                </Button>
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
                        <input type="checkbox" id="select-all" />
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
                  {filteredVariants
                    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                    .map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td className="text-gray-9">{item.variant}</td>
                        <td>{item.value}</td>
                        <td>{dayjs(item.createdAt).format("DD MMM YYYY")}</td>
                        <td>
                          <span
                            className={`badge table-badge fw-medium fs-10 ${
                              item.status ? "bg-success" : "bg-danger"
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
                    ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalItems={filteredVariants.length}
            />
          </div>
        </div>
        <Modal show={showModal} onHide={handleCloses} centered>
          <Modal.Header closeButton>
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
            <Button variant="dark" onClick={handleCloses}>
              Cancel
            </Button>
            <Button variant="warning" onClick={handleSubmit}>
              Add Variant
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showEditModal} onHide={handleEditClose} centered>
          <Modal.Header closeButton>
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
            <Button variant="dark" onClick={handleEditClose}>
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