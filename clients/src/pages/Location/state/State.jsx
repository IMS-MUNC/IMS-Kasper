

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

const State = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateName, setStateName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      const res = await axios.get(`${BASE_URL}/api/countries`,{
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
      const res = await axios.get(`${BASE_URL}/api/states`,{
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

  const handleDeleteState = async (id) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      await axios.delete(`${BASE_URL}/api/states/${id}`);
      toast.success("State deleted");
      fetchStates();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting state");
    }
  };

  console.log("State opening:", states);

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
              >
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            <li>
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
            </li>
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
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search country..."
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
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Recently Added
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Desending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Last Month
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
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
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>State Name</th>
                    <th>Country Name</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {states.length > 0 ? (
                    states.map((state) => (
                      <tr key={state._id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
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
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDeleteState(state._id)}
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
        </div>
        {/* /product list */}
      </div>
      {/* Add State Modal */}
      <div className="modal fade" id="add-state">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleAddState}>
              <div className="modal-header">
                <h4 className="modal-title">Add State</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  &times;
                </button>
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
              <div className="modal-footer">
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
