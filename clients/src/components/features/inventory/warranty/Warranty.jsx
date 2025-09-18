import { useMemo, useRef, useState, useEffect } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import Button from "react-bootstrap/Button";
import { LuCirclePlus } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { Modal, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import dayjs from "dayjs";
// import "./Warranty.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import axios from "axios";
import { TbEdit, TbPdf, TbRefresh, TbSearch, TbTrash } from "react-icons/tb";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import BASE_URL from "../../../../pages/config/config";
import Pagination from "../../../../utils/pagination/Pagination";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';





const calculateDuration = (fromDate, toDate) => {
  if (!fromDate || !toDate) return "";

  const from = new Date(fromDate);
  const to = new Date(toDate);

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();

  const totalMonths = years * 12 + months;

  return `${(totalMonths / 12).toFixed(1)} years`;
};



const Warranty = ({ show, handleClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [Warrantydata, setWarrantydata] = useState([]);
  const [Error, setError] = useState(null);
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);



// console.log("Warranty data:", Warrantydata);



  const fetchWarrantyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/warranty/`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch warranty data");
      }
      const data = await response.json();
      console.log("Fetched warranty data:", data);
      const updatedData = data.map((item) => ({
        ...item,
        id: item._id,
      }));
      
      // Sort by creation date in descending order (LIFO - newest first)
      const sortedData = updatedData.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.fromDate);
        const dateB = new Date(b.createdAt || b.fromDate);
        return dateB - dateA; // Newest first
      });
      
      setWarrantydata(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarrantyData();
  }, []);



  const handleExportPDF = () => {
    const table = tableRef.current;
    if (!table) {
      console.error("Table reference not found");
      return;
    }
    html2canvas(table, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save("warranties.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setError("Failed to generate PDF. Please try again.");
      });
  };


  const handleExportExcel = () => {
    const dataToExport = filteredWarranties;
    const exportData = dataToExport.map((item) => ({
      Warranty: item.warranty,
      Description: item.description,
      From: item.fromDate ? new Date(item.fromDate).toLocaleDateString() : "",
      To: item.toDate ? new Date(item.toDate).toLocaleDateString() : "",
      Duration: calculateDuration(item.fromDate, item.toDate),
      Status: item.status ? "Active" : "Inactive",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Warranties");
    XLSX.writeFile(workbook, "warranties.xlsx");
  };

  const handleCloses = () => setShowModal(false);

  const [formData, setFormData] = useState({
    warranty: "",
    description: "",
    duration: "",
    fromDate: "",
    toDate: "",
    status: false,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    warranty: "",
    description: "",
    duration: "",
    fromDate: "",
    toDate: "",
    status: false,
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

      const response = await fetch(`${BASE_URL}/api/warranty/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add warranty");
      }
      const data = await response.json();
      console.log("New Warranty Added:", data);
      const newWarranty = { ...data, id: data._id };
      toast.success("New Warranty added.");
      // Add new warranty at the beginning of the array (LIFO order)
      setWarrantydata((prevData) => [newWarranty, ...prevData]);
      handleCloses();
      // Reset form data
      setFormData({
        warranty: "",
        description: "",
        duration: "",
        fromDate: "",
        toDate: "",
        status: false,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error:", err.message);
    }
  };

  const handleEditOpen = (card) => {
    // console.log("Opening edit modal for card:", card);
    
    // Format dates for HTML date inputs (YYYY-MM-DD format)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setEditFormData({
      id: card.id || "",
      warranty: card.warranty || "",
      description: card.description || "",
      duration: card.duration || "",
      fromDate: formatDateForInput(card.fromDate),
      toDate: formatDateForInput(card.toDate),
      status: card.status || false,
    });
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditFormData({
      id: "",
      warranty: "",
      description: "",
      duration: "",
      fromDate: "",
      toDate: "",
      status: false,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedForm = {
      ...editFormData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-calculate duration from fromDate and toDate
    if ((name === "fromDate" || name === "toDate") && updatedForm.fromDate && updatedForm.toDate) {
      updatedForm.duration = calculateDuration(updatedForm.fromDate, updatedForm.toDate);
    }

    setEditFormData(updatedForm);
  };



  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editFormData.warranty || !editFormData.fromDate || !editFormData.toDate || !editFormData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Prepare data for submission
      const submitData = {
        ...editFormData,
        duration: calculateDuration(editFormData.fromDate, editFormData.toDate)
      };

      // console.log("Submitting edit data:", submitData);

      const response = await fetch(`${BASE_URL}/api/warranty/${editFormData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update warranty");
      }
      
      const data = await response.json();
      // console.log("Updated Warranty:", data);
      // console.log("Edit Form Data ID:", editFormData.id);
      
      // Ensure we use the correct ID for updating
      const updatedWarranty = { 
        ...data, 
        id: data._id || data.id || editFormData.id,
        duration: calculateDuration(data.fromDate || editFormData.fromDate, data.toDate || editFormData.toDate)
      };
      
      // console.log("Updated Warranty with ID:", updatedWarranty);
      
      setWarrantydata((prevData) => {
         const newData = prevData.map((card) => {
          //  console.log("Comparing:", card.id, "with", updatedWarranty.id);
           return card.id === updatedWarranty.id ? updatedWarranty : card;
         });
        //  console.log("New warranty data:", newData);
         return newData;
       });
       
       // Force refresh to ensure UI updates
       setTimeout(() => {
         fetchWarrantyData();
       }, 100);
       
       setError(""); // Clear any previous errors
       handleEditClose();
       toast.success("Warranty updated successfully.");
    } catch (err) {
      console.error("Error updating warranty:", err);
      setError(err.message || "Failed to update warranty. Please try again.");
    }
  };


  const handleDelete = async (id) => {
    try {
          const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/warranty/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete the warranty");
      }
      // Update both state arrays
      setWarrantydata((prev) => prev.filter((item) => item.id !== id));
      setShowDeleteModal(false);
      setPendingDeleteId(null);
      toast.success("Warranty deleted successfully.");
      // alert("Warranty deleted successfully");
    } catch (err) {
      console.error("Error deleting warranty:", err);
      setError("Failed to delete the warranty. Please try again.");
    }
  };


  const filteredWarranties = useMemo(() => {
    return Warrantydata.filter((item) => {
      const warranty = item?.warranty || "";
      const description = item?.description || "";
      const searchMatch =
        warranty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status) ||
        (statusFilter === "inactive" && !item.status);
      return searchMatch && statusMatch;
    });
  }, [Warrantydata, searchTerm, statusFilter]);



  const openDeleteModal = (id) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleShow = () => setShowModal(true);


  return (
    	<div className="page-wrapper">
				<div className="content">
					<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4 className="fw-bold">Warranties</h4>
								<h6>Manage your warranties</h6>
							</div>
						</div>
						<ul className="table-top-head">
							<li>
								<a data-bs-toggle="tooltip"  title="Pdf" onClick={handleExportPDF}><FaFilePdf className="fs-20" style={{color:"red"}} /></a>
										
							</li>
							<li>
								<a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel" onClick={handleExportExcel}><FaFileExcel className="fs-20" style={{color:"green"}}/></a>

							</li>
							<li>
								<a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()}><TbRefresh/></a>
							</li>
							{/* <li>
								<a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
										className="ti ti-chevron-up" /></a>
							</li> */}
						</ul>
						<div className="page-btn">
							<a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-warranty" onClick={handleShow}><i
									className="ti ti-circle-plus me-1" />Add Warranty</a>
						</div>
					</div>
					{/* /product list */}
					<div className="card">
						<div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
							<div className="search-set">
								<div className="search-input">
									<input
										type="text"
										className="form-control"
										placeholder="Search warranties..."
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
											<th>Warranty</th>
											<th>Description</th>
                      <th>From Date</th>
                      <th>To Date</th>
											<th>Duration</th>
											<th>Status</th>
											<th className="no-sort" />
										</tr>
									</thead>
                <tbody>

                  {filteredWarranties
                    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                    .map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td className="text-gray-9"> <td>{item.warranty}</td></td>
                        <td>
                          <p className="description-para"><td>{item.description}</td></p>
                        </td>
                        <td>{dayjs(item.fromDate).format("YYYY-MM-DD")}</td>
                        <td> {dayjs(item.toDate).format("YYYY-MM-DD")}</td>

                        <td>{calculateDuration(item.fromDate, item.toDate)}</td>
                        <td>
                          <span
                            className={`badge table-badge fw-medium fs-10  ${item.status ? "badge-success" : "badge-danger"}`}
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a className="me-2 p-2" href="#" data-bs-toggle="modal"
                              data-bs-target="#edit-warranty" onClick={() => handleEditOpen(item)}>
                              <TbEdit data-feather="edit" className="feather-edit" />
                            </a>
                            <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2"
                              onClick={() => openDeleteModal(item.id)}>
                              <TbTrash data-feather="trash-2" className="feather-trash-2" />
                              {/* <RiDeleteBinLine /> */}
                            </a>
                          </div>
                        </td>
                      </tr>

                    ))}


                </tbody>
								</table>
							</div>
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
                {filteredWarranties.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    filteredWarranties.length
                  )} of ${filteredWarranties.length}`}
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
                    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredWarranties.length / rowsPerPage)))
                  }
                  disabled={currentPage === Math.ceil(filteredWarranties.length / rowsPerPage)}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
					</div>
					{/* /add modal list */}
            <Modal show={showModal} onHide={handleCloses} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Warranty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="warranty">
              <Form.Label>
                Warranty <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter warranty"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
              />
            </Form.Group>

            {/* //to date */}
            <Row className="mt-3">
              <Col>
                <Form.Group controlId="fromDate">
                  <Form.Label>
                    From Date  <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Date"
                    min={1}
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="toDate">
                  <Form.Label>
                    To Date  <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Date"
                    min={1}
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Form.Group controlId="description">
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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
          <Button variant="warning text-white" onClick={handleSubmit}>
            Add Warranty
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* editmodal */}
      <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Warranty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editWarranty">
              <Form.Label>
                Warranty <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="warranty"
                value={editFormData.warranty}
                onChange={handleEditChange}
              />
            </Form.Group>
            {/* <Row className="mt-3">
              <Col>
                <Form.Group controlId="editDuration">
                  <Form.Label>
                    Duration <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={editFormData.duration}
                    onChange={handleEditChange}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row> */}
            <Row className="mt-3">
              <Col>
                <Form.Group controlId="fromDate">
                  <Form.Label>
                    From Date  <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Date"
                    min={1}
                    name="fromDate"
                    value={editFormData.fromDate}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="toDate">
                  <Form.Label>
                    To Date  <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="Date"
                    min={1}
                    name="toDate"
                    value={editFormData.toDate}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="editDescription" className="mt-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editFormData.description}
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
          {/* <Button variant="dark" onClick={handleEditClose}>
            Cancel
          </Button> */}
          <Button variant="warning" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* delete modal*/}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-danger bg-opacity-10 rounded-circle p-3">
              <RiDeleteBinLine size={28} className="text-danger" />
            </div>
          </div>
          <h5 className="fw-bold">Delete Warranty</h5>
          <p>Are you sure you want to delete warranty?</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="dark" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={() => handleDelete(pendingDeleteId)}>
              Yes Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
				</div>
				
			</div>
    // <div className="fn-conatiner">
    //   {Error && <div className="alert alert-danger">{Error}</div>}
    //   <div className="d-flex bd-highlight justify-content-between align-items-start">
    //     <div className="p-3 mt-3 flex-grow-1">
    //       <div className="h4">Warranties</div>
    //       <div className="text-secondary">Manage your Warranties</div>
    //     </div>
    //     <div className="d-flex align-items-center gap-1 p-4 mt-3">
    //       <Button
    //         className="text-danger"
    //         variant="light"
    //         aria-label="Export as PDF"
    //         onClick={handleExportPDF}
    //       >
    //         <BiSolidFilePdf size={24} />
    //       </Button>
    //       <Button
    //         className="text-success"
    //         variant="light"
    //         aria-label="Export as Excel"
    //         onClick={handleExportExcel}
    //       >
    //         <BiSolidFilePdf size={24} />
    //       </Button>

    //       <Button
    //         variant="light"
    //         aria-label="Refresh"
    //         className="text-secondary"
    //         onClick={() => {

    //           fetchWarranties();
    //         }}
    //       >
    //         <HiOutlineRefresh size={20} />
    //       </Button>
    //       <Button
    //         variant="light"
    //         aria-label="Collapse"
    //         className="text-secondary"
    //       >
    //         <IoIosArrowUp size={18} />
    //       </Button>
    //       <Button variant="warning text-white" onClick={handleShow}>
    //         <LuCirclePlus /> Add Warranty
    //       </Button>
    //     </div>
    //   </div>
    //   <Modal show={showModal} onHide={handleCloses} centered>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Add Warranty</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <Form>
    //         <Form.Group controlId="warranty">
    //           <Form.Label>
    //             Warranty <span className="text-danger">*</span>
    //           </Form.Label>
    //           <Form.Control
    //             type="text"
    //             placeholder="Enter warranty"
    //             name="warranty"
    //             value={formData.warranty}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>

    //         {/* //to date */}
    //         <Row className="mt-3">
    //           <Col>
    //             <Form.Group controlId="fromDate">
    //               <Form.Label>
    //                 From Date  <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 type="Date"
    //                 min={1}
    //                 name="fromDate"
    //                 value={formData.fromDate}
    //                 onChange={handleChange}
    //               />
    //             </Form.Group>
    //           </Col>
    //           <Col>
    //             <Form.Group controlId="toDate">
    //               <Form.Label>
    //                 To Date  <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 type="Date"
    //                 min={1}
    //                 name="toDate"
    //                 value={formData.toDate}
    //                 onChange={handleChange}
    //               />
    //             </Form.Group>
    //           </Col>
    //         </Row>

    //         <Row className="mt-3">
    //           <Col>
    //             <Form.Group controlId="description">
    //               <Form.Label>
    //                 Description <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 as="textarea"
    //                 name="description"
    //                 value={formData.description}
    //                 onChange={handleChange}
    //               />
    //             </Form.Group>
    //           </Col>
    //         </Row>
    //         <Form.Group
    //           controlId="status"
    //           className="mt-4 d-flex align-items-center justify-content-between"
    //         >
    //           <Form.Label className="me-3 mb-0">Status</Form.Label>
    //           <Form.Check
    //             type="switch"
    //             name="status"
    //             checked={formData.status}
    //             onChange={handleChange}
    //           />
    //         </Form.Group>
    //       </Form>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="dark" onClick={handleCloses}>
    //         Cancel
    //       </Button>
    //       <Button variant="warning text-white" onClick={handleSubmit}>
    //         Add Warranty
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    //   <Modal show={showEditModal} onHide={handleEditClose} centered>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Edit Warranty</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <Form>
    //         <Form.Group controlId="editWarranty">
    //           <Form.Label>
    //             Warranty <span className="text-danger">*</span>
    //           </Form.Label>
    //           <Form.Control
    //             type="text"
    //             name="warranty"
    //             value={editFormData.warranty}
    //             onChange={handleEditChange}
    //           />
    //         </Form.Group>
    //         <Row className="mt-3">
    //           <Col>
    //             <Form.Group controlId="editDuration">
    //               <Form.Label>
    //                 Duration <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 type="text"
    //                 name="duration"
    //                 value={editFormData.duration}
    //                 onChange={handleEditChange}
    //                 readOnly
    //               />
    //             </Form.Group>
    //           </Col>
    //         </Row>
    //         <Row className="mt-3">
    //           <Col>
    //             <Form.Group controlId="fromDate">
    //               <Form.Label>
    //                 From Date  <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 type="Date"
    //                 min={1}
    //                 name="fromDate"
    //                 value={editFormData.fromDate}
    //                 onChange={handleEditChange}
    //               />
    //             </Form.Group>
    //           </Col>
    //           <Col>
    //             <Form.Group controlId="toDate">
    //               <Form.Label>
    //                 To Date  <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 type="Date"
    //                 min={1}
    //                 name="toDate"
    //                 value={editFormData.toDate}
    //                 onChange={handleEditChange}
    //               />
    //             </Form.Group>
    //           </Col>
    //         </Row>
    //         <Form.Group controlId="editDescription" className="mt-3">
    //           <Form.Label>
    //             Description <span className="text-danger">*</span>
    //           </Form.Label>
    //           <Form.Control
    //             as="textarea"
    //             name="description"
    //             value={editFormData.description}
    //             onChange={handleEditChange}
    //           />
    //         </Form.Group>
    //         <Form.Group
    //           controlId="editStatus"
    //           className="mt-4 d-flex align-items-center justify-content-between"
    //         >
    //           <Form.Label className="me-3 mb-0">Status</Form.Label>
    //           <Form.Check
    //             type="switch"
    //             name="status"
    //             checked={editFormData.status}
    //             onChange={handleEditChange}
    //           />
    //         </Form.Group>
    //       </Form>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="dark" onClick={handleEditClose}>
    //         Cancel
    //       </Button>
    //       <Button variant="warning" onClick={handleEditSubmit}>
    //         Save Changes
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    //   <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
    //     <Modal.Body className="text-center py-4">
    //       <div className="d-flex justify-content-center mb-3">
    //         <div className="bg-danger bg-opacity-10 rounded-circle p-3">
    //           <RiDeleteBinLine size={28} className="text-danger" />
    //         </div>
    //       </div>
    //       <h5 className="fw-bold">Delete Warranty</h5>
    //       <p>Are you sure you want to delete warranty?</p>
    //       <div className="d-flex justify-content-center gap-3 mt-4">
    //         <Button variant="dark" onClick={() => setShowDeleteModal(false)}>
    //           Cancel
    //         </Button>
    //         <Button variant="warning" onClick={() => handleDelete(pendingDeleteId)}>
    //           Yes Delete
    //         </Button>
    //       </div>
    //     </Modal.Body>
    //   </Modal>
    //   <div className="container-mn">
    //     <div className="d-flex justify-content-between align-items-center p-3">
    //       <div>
    //         <div className="input-group rounded">
    //           <input
    //             type="search"
    //             className="form-control rounded"
    //             placeholder="🔍︎ Search"
    //             aria-label="Search"
    //             aria-describedby="search-addon"
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //           />
    //         </div>
    //       </div>
    //       <div className="d-flex gap-3">

    //         <select
    //           className="form-select"
    //           value={statusFilter}
    //           aria-label="Default select example"
    //           onChange={(e) => setStatusFilter(e.target.value)}
    //         >
    //           <option value="all">All Statuses</option>
    //           <option value="active">Active</option>
    //           <option value="inactive">Inactive</option>
    //         </select>
    //       </div>
    //     </div>
    //     <div>
    //       <table className="table" ref={tableRef}>
    //         <thead className="tableheader">
    //           <tr>
    //             <th scope="col">
    //               <input type="checkbox" />
    //             </th>
    //             <th scope="col">Warranty</th>
    //             <th scope="col">Description</th>
    //             <th scope="col">Duration</th>
    //             <th scope="col">To Date</th>
    //             <th scope="col">From Date</th>
    //             <th scope="col">Status</th>
    //             <th></th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {filteredWarranties
    //             .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    //             .map((item, idx) => (
    //               <tr key={idx}>
    //                 <th scope="col">
    //                   <input type="checkbox" />
    //                 </th>
    //                 <td>{item.warranty}</td>
    //                 <td>{item.description}</td>
    //                 {/* <td>{`${item.duration}`}</td> */}
    //                 <td>{calculateDuration(item.fromDate, item.toDate)}</td>
    //                 <td> {dayjs(item.toDate).format("YYYY-MM-DD")}</td>
    //                 <td>{dayjs(item.fromDate).format("YYYY-MM-DD")}</td>
    //                 <td>

    //                   <span
    //                     className={`badge ${item.status ? "badge-success" : "badge-danger"}`}
    //                   >
    //                     {item.status ? "Active" : "Inactive"}
    //                   </span>
    //                 </td>
    //                 <td>
    //                   <div className="iconsms">
    //                     <button>
    //                       <IoEyeOutline />
    //                     </button>

    //                     <button onClick={() => handleEditOpen(item)}>
    //                       <FiEdit />
    //                     </button>
    //                     <button onClick={() => openDeleteModal(item.id)}>
    //                       <RiDeleteBinLine />
    //                     </button>
    //                   </div>
    //                 </td>
    //               </tr>
    //             ))}
    //         </tbody>
    //       </table>
    //     </div>
    //     {/* CHANGE: Fixed pagination to use filteredWarranties */}
    //     <div className="d-flex justify-content-between align-items-center p-3">
    //       <div className="d-flex gap-3 align-items-center">
    //         <div>Rows Per Page</div>
    //         <select
    //           className="form-select"
    //           name="rows"
    //           id="rows"
    //           style={{ width: "80px" }}
    //           value={rowsPerPage}
    //           onChange={(e) => {
    //             setRowsPerPage(Number(e.target.value));
    //             setCurrentPage(1);
    //           }}
    //         >
    //           <option value="5">5</option>
    //           <option value="10">10</option>
    //           <option value="20">20</option>
    //         </select>
    //         <div>Entries</div>
    //       </div>
    //       <div className="d-flex align-items-center gap-3">
    //         <button
    //           className="btn"
    //           style={{ border: "none", background: "transparent" }}
    //           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    //           disabled={currentPage === 1}
    //           aria-label="Previous Page"
    //         >
    //           <GoChevronLeft size={20} />
    //         </button>
    //         <div className="text-center downt">
    //           <span>{currentPage}</span>
    //         </div>
    //         <button
    //           className="btn"
    //           style={{ border: "none", background: "transparent" }}
    //           onClick={() =>
    //             setCurrentPage((prev) =>
    //               Math.min(prev + 1, Math.ceil(filteredWarranties.length / rowsPerPage))
    //             )
    //           }
    //           disabled={currentPage === Math.ceil(filteredWarranties.length / rowsPerPage)}
    //           aria-label="Next Page"
    //         >
    //           <GoChevronRight size={20} />
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    //   {/* <div className="settings">
    //     <IoSettingsSharp />
    //   </div> */}
    // </div>
  );
};

export default Warranty;

