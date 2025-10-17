import React, { useEffect, useState, useRef } from "react";
import { RxUpdate } from "react-icons/rx";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
// import pdf_logo from "../../assets/image/pdf-icon.png";
// import excel_logo from "../../assets/image/excel-logo.png";
import "./Coupons.css";
import { IoIosSearch } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaRegEdit, FaFileExcel, FaFilePdf } from "react-icons/fa";
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
import dayjs from "dayjs";
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
  const [sortOrder, setSortOrder] = useState("Latest");
  const [modalMode, setModalMode] = useState("add");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk delete state
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Ref for file input
  const fileInputRef = useRef(null);

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

  // Function to check and update expired coupons
    const checkAndUpdateExpiredCoupons = async () => {
    // Get the current date and set the time to the beginning of the day (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find coupons where the validity date is strictly before today's date.
    // This means a coupon expiring 'today' will not be included.
    const expiredCoupons = coupons.filter((coupon) => {
      const validDate = new Date(coupon.valid);
      return coupon.validStatus === "Active" && validDate < today;
    });

    if (expiredCoupons.length > 0) {
      try {
        const token = localStorage.getItem("token");

        // Update each expired coupon in the database
        for (const coupon of expiredCoupons) {
          // The check `validDate < today` is implicitly true because of the filter above,
          // but we can keep it for clarity.
          const validDate = new Date(coupon.valid);
          if (coupon.validStatus === "Active" && validDate < today) {
            const response = await fetch(`${BASE_URL}/api/coupons/${coupon._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...coupon,
                validStatus: "Inactive",
              }),
            });

            if (response.ok) {
              // console.log(`Coupon ${coupon.name} has been automatically set to inactive due to expiry.`);
            }
          }
        }

        // Update local state to reflect the changes
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) => {
            const validDate = new Date(coupon.valid);
            // If the coupon is active and its valid date is before today, make it inactive
            if (coupon.validStatus === "Active" && validDate < today) {
              return { ...coupon, validStatus: "Inactive" };
            }
            return coupon;
          })
        );

        if (expiredCoupons.length > 0) {
          toast.info(`${expiredCoupons.length} coupon(s) have been automatically set to inactive.`);
        }
      } catch (error) {
        console.error("Error updating expired coupons:", error);
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Clean up selected coupons when coupon data changes
  useEffect(() => {
    setSelectedCoupons((prev) => prev.filter((id) => coupons.some((c) => c._id === id)));
  }, [coupons]);

  // Check for expired coupons when coupons data changes
  useEffect(() => {
    if (coupons.length > 0) {
      checkAndUpdateExpiredCoupons();
    }
  }, [coupons]);

   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, sortOrder]);

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
  const handleExcel = () => {
    // Prepare data for Excel export
    const excelData = coupons.map(item => ({
      'Name': item.name || '',
      'Code': item.code || '',
      'Description': item.description || '',
      'Type': item.type || '',
      'Discount': item.discount || '',
      'Limit': item.limit || '',
      'Valid Date': new Date(item.valid).toLocaleDateString(),
      'Status': item.validStatus || ''
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Code
      { wch: 30 }, // Description
      { wch: 12 }, // Type
      { wch: 10 }, // Discount
      { wch: 8 },  // Limit
      { wch: 12 }, // Valid Date
      { wch: 10 }  // Status
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coupon List');

    // Export the file
    XLSX.writeFile(workbook, 'coupon-list.xlsx');
  };

  const handlePdf = () => {
    const doc = new jsPDF();

    // Prepare data for PDF
    const pdfData = coupons.map(item => [
      item.name || '',
      item.code || '',
      item.description || '',
      item.type || '',
      item.discount || '',
      item.limit || '',
      new Date(item.valid).toLocaleDateString(),
      item.validStatus || ''
    ]);

    // Add title
    doc.setFontSize(16);
    doc.text('Coupon List', 14, 15);

    // Add table
    autoTable(doc, {
      head: [['Name', 'Code', 'Description', 'Type', 'Discount', 'Limit', 'Valid Date', 'Status']],
      body: pdfData,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save('coupon-list.pdf');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Format data to match backend model
        const formattedData = jsonData.map(item => ({
          name: item.Name || item.name || '',
          code: item.Code || item.code || '',
          description: item.Description || item.description || '',
          type: item.Type || item.type || 'percentage',
          discount: item.Discount || item.discount || '',
          limit: item.Limit || item.limit || 0,
          valid: item['Valid Date'] || item.valid || new Date(),
          validStatus: item.Status || item.validStatus || 'Active'
        }));

        // Send to backend
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/coupons/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ coupons: formattedData })
        });

        if (response.ok) {
          toast.success('Coupons imported successfully!');
          fetchCoupons(); // Refresh the list
        } else {
          const errorData = await response.json();
          toast.error(`Import failed: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import coupons. Please check the file format.');
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset file input
    event.target.value = '';
  };

  //component name changes
  const handleShowAdd = () => {
    setModalMode("add");
    setEditingCoupon(null);
    setShowAddModal(true);
  };

  // Pagination logic
  // Pagination logic
  const filteredCoupons = coupons
    .filter((coupon) => {
      // Status Filter
      if (statusFilter === "" || statusFilter === "All") return true;
      return coupon.validStatus === statusFilter;
    })
    .filter((coupon) => {
      // Type Filter
      if (typeFilter === "" || typeFilter === "All") return true;
      return coupon.type === typeFilter;
    })
    .filter((coupon) => {
      // Search Term Filter
      const term = searchTerm.toLowerCase();
      return (
        coupon.name.toLowerCase().includes(term) ||
        coupon.code.toLowerCase().includes(term) ||
        coupon.description.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
  // Sorting Logic
  if (sortOrder === "Latest") {
    // Sort by creation time (LIFO), assuming a 'createdAt' field exists
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA; // Newest created item first
  }
  if (sortOrder === "Ascending") {
    return a.name.localeCompare(b.name); // A-Z
  }
  if (sortOrder === "Descending") {
    return b.name.localeCompare(a.name); // Z-A
  }
  return 0; // Default: no sorting
});

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOrderLabels = {
    Latest: 'Latest',
    Ascending: 'A-Z',
    Descending: 'Z-A'
  };

  return (
    <div className="page-wrapper">
      <div className="content" >

        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Coupons</h4>
              <h6 className="text-secondary">Manage Your Coupons</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              {selectedCoupons.length > 0 && (
                <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                  Delete ({selectedCoupons.length}) Selected
                </button>
              )}
            </li>
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
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  hidden
                  onChange={handleImport}
                  ref={fileInputRef}
                />
                <FaFileExcel style={{ color: 'green', cursor: 'pointer' }} />
              </label>
            </li>
          </div>
          <div className="page-btn">
            <a onClick={handleShowAdd} className="btn btn-primary">
              <IoIosAddCircleOutline className="me-1" />
              Add Coupons
            </a>
          </div>
        </div>

        <div className="card table-list-card" style={{}}>

          <div className="table-top">
            <div className="searchfiler d-flex align-items-center gap-2">
              <IoIosSearch />
              <input
                style={{ border: "none", outline: "none" }}
                type="search"
                placeholder="Search by coupon name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a
                  className="btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Type : {typeFilter || "All"} <RiArrowDownSLine  className="ms-1" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a onClick={() => setTypeFilter("")} className="dropdown-item">
                      All
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setTypeFilter("percentage")} className="dropdown-item">
                      Percentage
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setTypeFilter("flat")} className="dropdown-item">
                      Flat
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dropdown me-2">
                <a
                  className="btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Status : {statusFilter || "All"} <RiArrowDownSLine  className="ms-1" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a onClick={() => setStatusFilter("")} className="dropdown-item">
                      All
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setStatusFilter("Active")} className="dropdown-item">
                      Active
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setStatusFilter("Inactive")} className="dropdown-item">
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dropdown me-2">
                <a
                  className="btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort By: {sortOrderLabels[sortOrder]} <RiArrowDownSLine  className="ms-1" />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a onClick={() => setSortOrder("Latest")} className="dropdown-item">
                      Latest
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setSortOrder("Ascending")} className="dropdown-item">
                      A-Z
                    </a>
                  </li>
                  <li>
                    <a onClick={() => setSortOrder("Descending")} className="dropdown-item">
                      Z-A
                    </a>
                  </li>
                </ul>
              </div>
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
                            textTransform:'uppercase'
                          }}
                        >
                          {item.code}
                        </span>
                      </td>
                      <td>{item.description.length > 0 ? item.description : "-"}</td>
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
                        className={`badge table-badge fw-medium fs-10 ${item.validStatus === "Active"
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                        >
                          {item.validStatus}
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="iconsms" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <button className=""
                            title="Edit"
                          >
                            <FaRegEdit onClick={() => handleEdit(item)} />
                          </button>
                          <button className=""
                            title="Delete"
                          >
                            <RiDeleteBin6Line onClick={() => handleDeleteClick(item)} />
                          </button>
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
