import React, { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import { RiArrowDropUpLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
// import pdf_logo from "../../assets/image/pdf-icon.png";
// import excel_logo from "../../assets/image/excel-logo.png";
import "./Coupons.css";
import { IoIosSearch } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import AddCouponModal from "./AddCouponsModel";
import DeleteModal from "./DeleteModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GoDotFill } from "react-icons/go";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import BASE_URL from "../../../pages/config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Coupons = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const handleShow = () => setShowAddModal(true);
  // const handleClose = () => setShowAddModal(false);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("");
  const [modalMode, setModalMode] = useState("add");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk delete state
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  // Callback for modal
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCoupons(data);
      } else {
        console.error("Error fetching coupons:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Clean up selected coupons when coupon data changes
  useEffect(() => {
    setSelectedCoupons((prev) => prev.filter((id) => coupons.some((c) => c._id === id)));
  }, [coupons]);

  const handleCouponSaved = () => {
    fetchCoupons(); // Re-fetch data after save
  };


  const handleEdit = (coupon) => {
    setModalMode("edit");
    setEditingCoupon(coupon);
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setEditingCoupon(null);
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirmed = async () => {
    if (!couponToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/coupons/${couponToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCoupons((prev) =>
          prev.filter((coupon) => coupon._id !== couponToDelete._id)
        );
        toast.success(`Coupon ${couponToDelete.name} deleted successfully!`);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete coupon: ${errorData.message || 'Unknown error'}`);
        console.error("Delete failed:", errorData.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the coupon. Please try again.");
      console.error("Delete error:", error);
    } finally {
      // Always close the modal and reset state, regardless of success or failure
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };

  // Bulk delete handlers
  const handleCheckboxChange = (couponId) => {
    setSelectedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedCoupons.map((coupon) => coupon._id);
      setSelectedCoupons(allIds);
      setSelectAll(true);
    } else {
      setSelectedCoupons([]);
      setSelectAll(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCoupons.length === 0) return;

    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      // Delete selected coupons
      await Promise.all(
        selectedCoupons.map((id) =>
          fetch(`${BASE_URL}/api/coupons/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      toast.success("Selected coupons deleted successfully");
      setSelectedCoupons([]);
      setSelectAll(false);
      fetchCoupons();
    } catch (error) {
      console.error("Bulk Delete Coupons Error:", error);
      toast.error("Failed to delete selected coupons");
    }
  };

  //pdf and excel converter
  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Coupons");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "coupons.xlsx");
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();

    const tableData = data.map(item => [
      item.name,
      item.code,
      item.description,
      item.type,
      item.discount,
      item.limit,
      new Date(item.valid).toLocaleDateString(),
      item.validStatus
    ]);

    autoTable(doc, {
      head: [["Name", "Code", "Description", "Type", "Discount", "Limit", "Valid", "Status"]],
      body: tableData,
    });

    doc.save("coupons.pdf");
  };
  //component name changes
  const handleShowAdd = () => {
    setModalMode("add");
    setEditingCoupon(null);
    setShowAddModal(true);
  };

  // Pagination logic
  const filteredCoupons = coupons.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesStatus = statusFilter ? item.validStatus === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (sortFilter === "5" || sortFilter === "2") {
      const dateA = new Date(a.valid);
      const dateB = new Date(b.valid);
      return dateB - dateA; // newest first
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <div className="content" >
        
          <div className="page-header">
            <div>
              <h4>Coupons</h4>
              <h6 style={{ color: "#a9aca9" }}>Manage Your Coupons</h6>
            </div>
            <div className="d-flex gap-3 align-items-center">
              {selectedCoupons.length > 0 && (
                <button className="btn btn-danger" onClick={handleBulkDelete}>
                  Delete ({selectedCoupons.length}) Selected
                </button>
              )}
              {/* <span className="pdf-icon"  onClick={() => exportToPDF(coupons)} style={{ cursor: "pointer" }}>
                <img className="img-fluid" src={pdf_logo} alt="pdf_logo" />
              </span>
              <span className="excel-icon" onClick={() => exportToExcel(coupons)} style={{ cursor: "pointer" }}>
                <img
                  className="img-fluid"
                  src={execel_logo}
                  alt="execel_logo"
                />
              </span> */}
              <span className="update-icon" onClick={() => window.location.reload()} style={{ cursor: "pointer",fontSize:'17px' }}> 
                <RxUpdate />
              </span>
              {/* <span className="dropdown-icon">
                <RiArrowDropUpLine />
              </span> */}
              <span className="add-coupons-btn">
                <button onClick={handleShowAdd} className="btn btn-primary">
                  <IoIosAddCircleOutline />
                  Add Coupons
                </button>
              </span>
            </div>
          </div>

          <div className="card table-list-card" style={{}}>
          <div className="">
            <div className="table-top">
              <div className="searchfiler d-flex align-items-center gap-2">
                <IoIosSearch />
                <input
                  style={{ border: "none", outline: "none" }}
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="d-flex gap-3 select-filter">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
                  <option value="">Sort By:</option>
                  <option value="5">Sort By: Last 5 Days</option>
                  <option value="2">Sort By: Last 2 Days</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table datanew">
                <thead>
                  <tr className="table-head">
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={paginatedCoupons.length > 0 && selectedCoupons.length === paginatedCoupons.length}
                          onChange={handleSelectAll}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Discount</th>
                    <th>Limit</th>
                    <th>Valid</th>
                    <th>Status</th>
                    <th className="text-center">
                      {/* <span
                        style={{
                          backgroundColor: "#ff9d42",
                          color: "white",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        <IoMdSettings />
                      </span> */}
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoupons.length > 0 ? (
                    paginatedCoupons.map((item, index) => (
                      <tr key={index} className="table-body">
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedCoupons.includes(item._id)}
                              onChange={() => handleCheckboxChange(item._id)}
                            />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <span
                            style={{
                              backgroundColor: "#f5eefe",
                              color: "#9d88d9",
                              padding: "5px 8px",
                              borderRadius: "5px",
                            }}
                          >
                            {item.code}
                          </span>
                        </td>
                        <td>{item.description}</td>
                        <td>{item.type}</td>
                        <td>{item.discount}</td>
                        <td>{item.limit}</td>
                        <td>
                          {(() => {
                            const date = new Date(item.valid);
                            const day = date.getDate();
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            return `${year}-${month}-${day}`;
                          })()}
                        </td>
                        <td>

                          <span
                            style={{
                              width: "80px",
                              height: "30px",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontWeight: 500,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor:
                                item.validStatus === "Active"
                                  ? "#3db983"
                                  : item.validStatus === "Inactive"
                                    ? "#f90502"
                                    : "#f3f3f3",
                              color:
                                item.validStatus === "Active" ||
                                  item.validStatus === "Inactive"
                                  ? "#ffffff"
                                  : "#000000",
                            }}
                          >
                            <span style={{ color: "white" }}><GoDotFill /></span>
                            {item.validStatus}


                          </span>
                        </td>
                        <td  className="action-table-data">
                          <div className="edit-delete-action" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}}>
                            <a className="" style={{color: "#F2F2F2", border:'1px solid #F2F2F2',alignItems:'center',justifyContent:'center',padding:'4px 6px',borderRadius:'4px'}}><FaRegEdit onClick={() => handleEdit(item)} style={{color:'#73797F'}} /></a>
                            <a className="" style={{color: "#F2F2F2", border:'1px solid #F2F2F2',alignItems:'center',justifyContent:'center',padding:'4px 6px',borderRadius:'4px'}}><RiDeleteBin6Line onClick={() => handleDeleteClick(item)} style={{color:'#73797F'}} /></a> 
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted">
                        No Coupons found.
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
                {filteredCoupons.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredCoupons.length
                  )} of ${filteredCoupons.length}`}
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

      </div>
      <AddCouponModal
        show={showAddModal}
        handleClose={handleClose}
        onSave={handleCouponSaved}
        editCoupon={editingCoupon}
        mode={modalMode}
      />
      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDelete={handleDeleteConfirmed}
      />
    </div>
  );
};

export default Coupons;
