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
import AddCouponModal from "./AddCouponsModel";
import DeleteModal from "./DeleteModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GoDotFill } from "react-icons/go";
import BASE_URL from "../../../pages/config/config";
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


  // Callback for modal
  const fetchCoupons = async () => {
    try {
          const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/coupons`,{
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
      const response = await fetch(
        `${BASE_URL}/api/coupons/${couponToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCoupons((prev) =>
          prev.filter((coupon) => coupon._id !== couponToDelete._id)
        );
        setShowDeleteModal(false);
        setCouponToDelete(null);
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
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



  return (
    <div className="page-wrapper">
      <div className="content" >
        <div className="px-3 py-4">
          <div className="coupons-header">
            <div>
              <strong>Coupons</strong>
              <p style={{ color: "#a9aca9" }}>Manage Your Coupons</p>
            </div>
            <div className="d-flex gap-3">
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
              <span className="update-icon"  onClick={() => window.location.reload()} style={{cursor:"pointer"}}>
                <RxUpdate />
              </span>
              <span className="dropdown-icon">
                <RiArrowDropUpLine />
              </span>
              <span className="add-coupons-btn">
                <button onClick={handleShowAdd}>
                  <IoIosAddCircleOutline />
                  Add Coupons
                </button>
              </span>
            </div>
          </div>
          <div
            className="table-main-conatner"
            style={{ backgroundColor: "white" }}
          >
            <div className="filter-section d-flex align-items-center justify-content-between py-4">
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
                <select  value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
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

            <div className="table-coupons-container">
              <table className="w-100">
                <thead style={{ backgroundColor: "#f9fafc" }}>
                  <tr className="table-head">
                    <th>Name</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Discount</th>
                    <th>Limit</th>
                    <th>Valid</th>
                    <th>Status</th>
                    <th>
                      <span
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
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {coupons
                    .filter(
                      (item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        item.code
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        item.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                          
                    )
                    .map((item, index) => (
                      <tr key={index} className="table-body">
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
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontWeight: 500,
                              backgroundColor:
                                item.validStatus === "Active"
                                  ? "#3db983"
                                  : item.validStatus === "Inactive"
                                  ? "#f90502"
                                  : "#f3f3f3", // default fallback
                              color:
                                item.validStatus === "Active" ||
                                item.validStatus === "Inactive"
                                  ? "#ffffff"
                                  : "#000000", // default fallback
                            }}
                          >
                            {item.validStatus}
                          </span>
                        </td>
                        <td className="d-flex gap-2">
                          {" "}
                          <span
                            style={{
                              border: "1px solid rgb(229 227 227)",
                              padding: "3px",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "22px",
                            }}
                          >
                            <FaRegEdit onClick={() => handleEdit(item)} />{" "}
                          </span>{" "}
                          <span
                            style={{
                              border: "1px solid rgb(229 227 227)",
                              padding: "3px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "22px",
                            }}
                          >
                            {" "}
                            <RiDeleteBin6Line
                              onClick={() => handleDeleteClick(item)}
                            />
                          </span>
                        </td>
                      </tr>
                    ))} */}
                    {coupons
  .filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesStatus = statusFilter ? item.validStatus === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  })
  .sort((a, b) => {
    if (sortFilter === "5" || sortFilter === "2") {
      const dateA = new Date(a.valid);
      const dateB = new Date(b.valid);
      return dateB - dateA; // newest first
    }
    return 0;
  })
  .map((item, index) => (
    <tr key={index} className="table-body">
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
            width:"80px",
            height:"30px",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: 500,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
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
           <span style={{color:"white"}}><GoDotFill /></span>
          {item.validStatus}
         
         
        </span>
      </td>
      <td className="d-flex gap-2">
        <span
          style={{
            border: "1px solid rgb(229 227 227)",
            padding: "3px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
          }}
        >
          <FaRegEdit onClick={() => handleEdit(item)} />
        </span>
        <span
          style={{
            border: "1px solid rgb(229 227 227)",
            padding: "3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
          }}
        >
          <RiDeleteBin6Line onClick={() => handleDeleteClick(item)} />
        </span>
      </td>
    </tr>
))}

                </tbody>
              </table>
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
