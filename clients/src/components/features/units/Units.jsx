import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import BASE_URL from "../../../pages/config/config";
import { toast } from "react-toastify";
import EditUnitModal from "../../../pages/Modal/unitsModals/EditUnitsModals.jsx";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import { sanitizeInput } from "../../../utils/sanitize.js";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
const Units = () => {
  const [unitData, setUnitData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); //for active , inactive
  // items page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [unitsName, setUnitsName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState(true); // true = Active
  const [errors, setErrors] = useState({})

  // === START BULK DELETE STATE CHANGES ===
  // const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  const unitNameRegex = /^[A-Za-z\s]{2,50}$/;
  const shortNameRegex = /^[A-Za-z]{1,10}$/;

  // Function to reset form fields
  const resetForm = () => {
    setUnitsName("");
    setShortName("");
    setStatus(true);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    // validate unit Name
    if (!unitNameRegex.test(unitsName)) {
      newErrors.unitsName = "Unit name must be 2–50 letters only.";
    }
    if (!shortNameRegex.test(shortName)) {
      newErrors.shortName = "Short name must be 1–10 letters only.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    const formData = {
      unitsName,
      shortName,
      status: status ? "Active" : "Inactive",
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/unit/units`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Unit created successfully!");
      resetForm();
      fetchUnits(); // Refresh unit list
      window.$(`#add-units`).modal("hide");
    } catch (error) {
      console.error("Error creating unit:", error);
      toast.error("Failed to create unit.");
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/unit/units`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUnitData(res.data);
    } catch (error) {
      console.error("Fetch Units Error:", error);
    }
  };

  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    window.$("#edit-units").modal("show"); // If using Bootstrap modal
  };

  const [selectedUnits, setSelectedUnits] = useState([]);

  const handleCheckboxChange = (unitId) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = unitData.map((unit) => unit._id);
      setSelectedUnits(allIds);
      setSelectAll(true);
    } else {
      setSelectedUnits([]);
      setSelectAll(false);
    }
  };

  const exportToExcel = () => {
    const selected = unitData.filter((unit) =>
      selectedUnits.includes(unit._id)
    );

    // If no units are selected, export all units
    const dataToExport = selected.length === 0 ? unitData : selected;

    if (dataToExport.length === 0) {
      toast.warn("No units available to export.");
      return;
    }

    // Format data for Excel export
    const formattedData = dataToExport.map((unit) => ({
      "Unit Name": unit.unitsName,
      "Short Name": unit.shortName,
      "Status": unit.status,
      "Created At": new Date(unit.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Units");

    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `units_${timestamp}.xlsx`);
    toast.success("Excel file exported successfully!");
  };

  const exportToPDF = () => {
    const selected = unitData.filter((unit) =>
      selectedUnits.includes(unit._id)
    );

    // If no units are selected, export all units
    const dataToExport = selected.length === 0 ? unitData : selected;

    if (dataToExport.length === 0) {
      toast.warn("No units available to export.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Units List", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["Unit", "Short Name", "Status", "Created At"]],
      body: dataToExport.map((u) => [
        u.unitsName,
        u.shortName,
        u.status,
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`units_${timestamp}.pdf`);
    toast.success("PDF exported successfully!");
  };

  const handleDeleteUnit = async (unitId, unitsName) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/unit/units/${unitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Unit deleted successfully");
      fetchUnits(); // Refresh the list
      Swal.fire("Deleted!", `Unit "${unitsName}" has been deleted.`, "success");
    } catch (error) {
      console.error("Delete Unit Error:", error);
      toast.error("Failed to delete unit");
    }
  };

  // === START BULK DELETE FUNCTION ===
  const handleBulkDelete = async () => {
    if (selectedUnits.length === 0) return;

    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      // Option A: if backend supports a bulk API endpoint, prefer this:
      // await axios.post(`${BASE_URL}/api/unit/units/bulk-delete`, { ids: selectedUnits }, { headers: { Authorization: `Bearer ${token}` }});

      // Option B: fallback to multiple delete calls (current safe approach)
      await Promise.all(
        selectedUnits.map((id) =>
          axios.delete(`${BASE_URL}/api/unit/units/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      toast.success("Selected units deleted successfully");
      setSelectedUnits([]);
      setSelectAll(false);
      fetchUnits();
    } catch (error) {
      console.error("Bulk Delete Units Error:", error.response?.data || error.message);
      toast.error("Failed to delete selected units");
    }
  };


  useEffect(() => {
    setSelectedUnits((prev) => prev.filter((id) => unitData.some((u) => u._id === id)));

  }, [unitData]);

  const filteredUnits = unitData
    .filter((u) => {
      const matchesSearch = u.unitsName?.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesStatus = selectedStatus
        ? u.status === selectedStatus
        : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by creation date in descending order (LIFO - newest first)
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    })

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Units</h4>
              <h6>Manage your units</h6>
            </div>
          </div>
          {/* <ul className="table-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf">
                <img src="assets/img/icons/pdf.svg" alt="img" />
              </a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel">
                <img src="assets/img/icons/excel.svg" alt="img" />
              </a>
            </li>
            <li>
              <a
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Refresh"
              >
                <i className="ti ti-refresh" />
              </a>
            </li>
            <li>
              <a
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Collapse"
                id="collapse-header"
              >
                <i className="ti ti-chevron-up" />
              </a>
            </li>
          </ul> */}

          <div className="table-top-head me-2">
            <li>
              {selectedUnits.length > 0 && (
                <button className="btn btn-danger ms-2" onClick={handleBulkDelete}>
                  Delete ({selectedUnits.length}) Selected
                </button>
              )}
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Export : </label>
              <button onClick={exportToPDF} title="Download PDF" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFilePdf className="fs-20" style={{ color: "red" }} /></button>
              <button onClick={exportToExcel} title="Download Excel" style={{
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
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={exportToExcel}
              >
                <FaFileExcel />
              </button>
            </li> */}
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-units"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Unit
            </a>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search Units..."
                  className="form-control"
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
                  Sort by : {selectedStatus || "All Status"}
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("")}
                    >
                      All Status
                    </button>
                  </li>
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("Active")}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button

                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("Inactive")}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: 'start' }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          checked={unitData.length > 0 && selectedUnits.length === unitData.length}
                          onChange={handleSelectAll}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Unit</th>
                    <th>Short name</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center", width: "120px" }}>Action</th>
                    {/* <th className="no-sort" /> */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUnits.length > 0 ? (
                    paginatedUnits.map((unit) => (
                      <tr key={unit._id}>
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedUnits.includes(unit._id)}
                              onChange={() => handleCheckboxChange(unit._id)}
                            />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td className="text-gray-9">{unit.unitsName}</td>
                        <td>{unit.shortName}</td>
                        <td>{new Date(unit.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}</td>
                        <td>
                          {/* <span className="badge table-badge bg-success fw-medium fs-10">
                            Active
                          </span> */}
                          <span
                            className={`badge table-badge fw-medium fs-10 ${unit.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                              }`}
                          >
                            {unit.status}
                          </span>
                        </td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-units"
                              onClick={() => handleEditClick(unit)} // ✅ pass the unit
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDeleteUnit(unit._id)}
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No Units found.
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
                {filteredUnits.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredUnits.length
                  )} of ${filteredUnits.length}`}
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
      </div>

      {/* Add Unit */}
      <div className="modal" id="add-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4>Add Unit</h4>
                {/* <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button> */}
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Unit<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={unitsName}
                    onChange={(e) => setUnitsName(e.target.value)}
                    required
                  />
                  {errors.unitsName && <p className="text-danger">{errors.unitsName}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Short Name<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    required
                  />
                  {errors.shortName && <p className="text-danger">{errors.shortName}</p>}
                </div>
                <div className="mb-0">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label">Status</span>
                    <input
                      type="checkbox"
                      id="unitStatus"
                      className="check"
                      checked={status}
                      onChange={() => setStatus(!status)}
                    />
                    <label htmlFor="unitStatus" className="checktoggle" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Unit */}

      {/* Edit Unit */}
      <EditUnitModal selectedUnit={selectedUnit} onUnitUpdated={fetchUnits} errors={errors} />
      {/* /Edit Unit */}
    </div>
  );
};

export default Units;
