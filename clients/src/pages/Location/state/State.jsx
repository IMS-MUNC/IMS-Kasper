import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import StateModal from "../../Modal/StateModal";
import BASE_URL from "../../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import CountryModal from "../country/CountryEdit";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const State = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateName, setStateName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStates, setSelectedStates] = useState([])

  const [editingState, setEditingState] = useState(null); // 🔄 For edit modal
  const [editStateName, setEditStateName] = useState("");
  const [editStateCode, setEditStateCode] = useState("");

  //   const [editCountry, setEditCountry] = useState(null);
  const [, setEditMode] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchCountries();
    fetchStates();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/countries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const options = res.data.map((country) => ({
        value: country._id,
        label: country.name,
      }));
      setCountries(options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch countries");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/states`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStates(res.data); // data contains populated country
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch states");
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };
  const handleAddState = async (e) => {
    e.preventDefault();
    if (!selectedCountry || !stateName.trim()) {
      toast.error("Both country and state name are required.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/states`,
        {
          stateName: stateName,
          stateCode: stateName.slice(0, 2).toUpperCase(),
          country: selectedCountry.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("State added");
      setStateName("");
      setSelectedCountry(null);
      fetchStates();
      window.$(`#add-state`).modal("hide");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding state");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/states/${editingState._id}`,
        {
          stateName: editStateName,
          stateCode: editStateCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Editing state ID:", editingState?._id);

      toast.success("State updated");
      setEditMode(false);
      setEditingState(null);
      setEditStateName("");
      setEditStateCode("");
      fetchStates();
      window.$(`#edit-state`).modal("hide");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };
  // const handleAddState = async (e) => {
  //   e.preventDefault();
  //   if (!selectedCountry || !stateName.trim()) {
  //     toast.error("Both country and state name are required.");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${BASE_URL}/api/states`, {
  //       stateName: stateName,
  //       stateCode: stateName.slice(0, 2).toUpperCase(),
  //       country: selectedCountry.value,
  //     });

  //     toast.success("State added");
  //     setStateName("");
  //     setSelectedCountry(null);
  //     fetchStates();
  //     window.$(`#add-state`).modal("hide");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Error adding state");
  //   }
  // };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${BASE_URL}/api/states/${editingState._id}`, {
  //       stateName: editStateName,
  //       stateCode: editStateCode,
  //     });
  //     console.log("Editing state ID:", editingState?._id);

  //     toast.success("State updated");
  //     setEditMode(false);
  //     setEditingState(null);
  //     setEditStateName("");
  //     setEditStateCode("");
  //     fetchStates(); // Call state list refresh, not fetchCountries
  //     window.$(`#edit-state`).modal("hide");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to update");
  //   }
  // };

  //   const handleUpdate = async (e) => {
  //     e.preventDefault();
  //     try {
  //       await axios.put(`${BASE_URL}/api/countries/${editingState._id}`, {
  //         stateName: editStateName, // ✅ corrected here
  //         stateCode: editStateCode
  //     });
  //       toast.success("State updated");
  //       setEditMode(false);
  //       setEditingState(null);
  //       setEditStateName("");
  //       setEditStateCode("");
  //       fetchCountries();
  //       window.$(`#add-state`).modal("hide"); // auto close

  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to update");
  //     }
  //   };

  const filteredStates = states.filter(
    (state) =>
      (state?.stateName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (state?.stateCode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("State List", 14, 16);
    const tableColumn = ["State Name", "State Code"];
    const tableRows = [];
    filteredStates.forEach((states) => {
      const stateData = [
        states.stateName,
        states.country?.name,
      ];
      tableRows.push(stateData);
    });
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('state_list.pdf')
  }

  const handleExportExcel = () => {
    const worksheetData = states.map((state) => ({
      "State Name": state.stateName,
      "Country Name": state.country?.name || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "States");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "States.xlsx");
  };
  const sortedStates = [...filteredStates].sort((a, b) => {
    if (sortOption === "asc") {
      return (a.stateName || "").localeCompare(b.stateName || "");
    }
    if (sortOption === "desc") {
      return (b.stateName || "").localeCompare(a.stateName || "");
    }

    if (sortOption === "recent") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0;
  });

  // filter by time (if backend returns createdAt field)
  let finalStates = sortedStates;
  if (sortOption === "last7") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    finalStates = sortedStates.filter((c) => new Date(c.createdAt) >= sevenDaysAgo)
  }

  if (sortOption === "lastMonth") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    finalStates = sortedStates.filter((c) => new Date(c.createdAt) >= oneMonthAgo)
  }

  const totalPages = Math.ceil(finalStates.length / itemsPerPage) || 1;
  const paginatedStates = finalStates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteState = async (id) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      await axios.delete(`${BASE_URL}/api/states/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("State deleted");
      fetchStates();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting state");
    }
  };

  console.log("State opening:", states);

  const handleBulkDelete = async () => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/states/bulk-delete`, {
        ids: selectedStates,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Selected countries deleted");
      setSelectedStates([]);
      fetchStates();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Unauthorired. Please login again");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete state");
      } else {
        toast.error("Bulk delete failed.Please try again")
      }
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>States</h4>
              <h6>Manage Your States</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Pdf"
                className="icon-btn"
                onClick={handleExportPDF}
              >
                <FaFilePdf  style={{color:'red'}}/>
              </button>
            </li>
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Export Excel"
                id="collapse-header"
                className="icon-btn"
                onClick={handleExportExcel}
              >
                <FaFileExcel style={{ color: "green" }} />
              </button>
            </li>
            {/* <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Export Excel"
                id="collapse-header"
                className="icon-btn"
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
              data-bs-target="#add-state"
            >
              <i className="ti ti-circle-plus me-1" />
              Add State
            </a>
          </div>
        </div>
        {selectedStates.length > 0 && (
          <div className="mb-3">
            <div className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected({selectedStates.length})
            </div>
          </div>
        )}
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search state..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By : {
                    sortOption === "recent" ? "Recently Added" :
                      sortOption === "asc" ? "Ascending" :
                        sortOption === "desc" ? "Descending" :
                          sortOption === "lastMonth" ? "Last Month" :
                            sortOption === "last7" ? "Last 7 Days" : ""
                  }
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1"
                      onClick={() => setSortOption("recent")}>
                      Recently Added
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1"
                      onClick={() => setSortOption("asc")}>
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1"
                      onClick={() => setSortOption("desc")}>
                      Descending
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1"
                      onClick={() => setSortOption("lastMonth")}>
                      Last Month
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" className="dropdown-item rounded-1"
                      onClick={() => setSortOption("last7")}>
                      Last 7 Days
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
                  <tr style={{ textAlign: 'center' }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox"
                          checked={paginatedStates.length > 0 && paginatedStates.every((state) => selectedStates.includes(state._id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newIds = paginatedStates.map((state) => state._id);
                              setSelectedStates((prev) => [
                                ...new Set([...prev, ...newIds]),
                              ])
                            } else {
                              const idsToRemove = paginatedStates.map((state) => state._id);
                              setSelectedStates((prev) => prev.filter((id) => !idsToRemove.includes(id)))
                            }
                          }}
                          id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>State Name</th>
                    <th>Country Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStates.length > 0 ? (
                    paginatedStates.map((state) => (
                      <tr key={state._id} style={{ textAlign: 'center' }}>
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedStates.includes(state._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStates((prev) => [...prev, state._id]);
                                } else {
                                  setSelectedStates((prev) => prev.filter((id) => id !== state._id));
                                }
                              }}
                            />

                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td className="text-gray-9">{state.stateName}</td>
                        <td>{state.country?.name}</td>

                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-state"
                              onClick={() => {
                                setEditingState(state); // state is the object you're editing
                                setEditStateName(state.stateName); // ✅ Set this correctly
                                setEditStateCode(state.stateCode); // ✅ Set this correctly
                                console.log("Edit Clicked:", state); // ✅ Debug log
                              }}
                              title="Edit"
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDeleteState(state._id)}
                              title="Delete"
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
                        No countries found.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* <tbody>
                  <tr>
                    <td>
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                      </label>
                    </td>
                    <td className="text-gray-9">California</td>
                    <td>United States</td>

                    <td className="action-table-data">
                      <div className="edit-delete-action">
                        <a
                          className="me-2 p-2"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-country"
                        >
                          <TbEdit />
                        </a>
                        <a className="p-2">
                          <TbTrash />
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody> */}
              </table>
            </div>
          </div>
          {/* pagination start */}
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
              {finalStates.length === 0
                ? "0 of 0"
                : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  finalStates.length
                )} of ${finalStates.length}`}
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
          {/* pagination end */}
        </div>
        {/* /product list */}
      </div>
      {/* Add State Modal */}
      <div className="modal" id="add-state">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleAddState}>
              <div className="modal-header">
                <h4 className="modal-title">Add State</h4>
                {/* <button type="button" className="close" data-bs-dismiss="modal">
                  &times;
                </button> */}
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>
                    Country <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={handleChange}
                    placeholder="Select country"
                  />
                </div>
                <div className="mb-3">
                  <label>
                    State Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add State
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <StateModal
        modalId="edit-state"
        title="Edit State"
        editStateName={editStateName}
        editStateCode={editStateCode}
        onNameChange={(e) => setEditStateName(e.target.value)}
        onCodeChange={(e) => setEditStateCode(e.target.value)}
        onSubmit={handleUpdate}
        submitLabel="Update State"
      />
    </div>
  );
};

export default State;
