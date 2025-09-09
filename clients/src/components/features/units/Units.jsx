import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import BASE_URL from "../../../pages/config/config";
import { toast } from "react-toastify";
import EditUnitModal from "../../../pages/Modal/unitsModals/EditUnitsModals.jsx";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";

const Units = () => {
  const [unitData, setUnitData] = useState([]);
  console.log(unitData);

  const [unitsName, setUnitsName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState(true); // true = Active

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      unitsName,
      shortName,
      status: status ? "Active" : "Inactive",
    };

    try {
          const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/api/unit/units`, formData,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      toast.success("Unit created successfully!");
      setUnitsName("");
      setShortName("");
      setStatus(true);
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
          const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/unit/units`,{
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
    } else {
      setSelectedUnits([]);
    }
  };

  const exportToExcel = () => {
    const selected = unitData.filter((unit) =>
      selectedUnits.includes(unit._id)
    );
    if (selected.length === 0) {
      toast.warn("No units selected.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(selected);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Units");
    XLSX.writeFile(wb, "units.xlsx");
  };

  const exportToPDF = () => {
    const selected = unitData.filter((unit) =>
      selectedUnits.includes(unit._id)
    );
    if (selected.length === 0) {
      toast.warn("No units selected.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Units List", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Unit", "Short Name", "Status", "Created At"]],
      body: selected.map((u) => [
        u.unitsName,
        u.shortName,
        u.status,
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("units.pdf");
  };

  const handleDeleteUnit = async (unitId, unitsName) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
          const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/unit/units/${unitId}`,{
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
              <button
                type="button"
                className="icon-btn"
                title="Pdf"
                onClick={exportToPDF}
              >
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input type="file" accept=".xlsx, .xls" hidden />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            <li>
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={exportToExcel}
              >
                <FaFileExcel />
              </button>
            </li>
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
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="table-dropdown my-xl-auto right-content">
              <div className="dropdown">
                <a
                  
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      
                      className="dropdown-item rounded-1"
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
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          id="select-all"
                          onChange={handleSelectAll}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Unit</th>
                    <th>Short name</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {unitData.length > 0 ? (
                    unitData.map((unit) => (
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
                        <td>{new Date(unit.createdAt).toLocaleString()}</td>
                        <td>
                          {/* <span className="badge table-badge bg-success fw-medium fs-10">
                            Active
                          </span> */}
                          <span
                            className={`badge table-badge fw-medium fs-10 ${
                              unit.status === "Active"
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
          </div>
        </div>
        {/* /product list */}
      </div>

      {/* Add Unit */}
      {/* <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Unit</h4>
              </div>
              <button
                type="button"
                className="close bg-danger text-white fs-16"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Unit<span className="text-danger ms-1">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Short Name<span className="text-danger ms-1">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-0">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label">Status</span>
                    <input
                      type="checkbox"
                      id="user2"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user2" className="checktoggle" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
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
      </div> */}

      <div className="modal fade" id="add-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h4>Add Unit</h4>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
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
      {/* <div className="modal fade" id="edit-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Edit Unit</h4>
              </div>
              <button
                type="button"
                className="close bg-danger text-white fs-16"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Unit<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Kilograms"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Short Name<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="kg"
                  />
                </div>
                <div className="mb-0">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label">Status</span>
                    <input
                      type="checkbox"
                      id="user3"
                      className="check"
                      defaultChecked
                    />
                    <label htmlFor="user3" className="checktoggle" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
      <EditUnitModal selectedUnit={selectedUnit} onUnitUpdated={fetchUnits} />
      {/* /Edit Unit */}
    </div>
  );
};

export default Units;
