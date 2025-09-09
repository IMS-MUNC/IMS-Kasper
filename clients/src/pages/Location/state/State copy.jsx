import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import StateModal from "../../Modal/StateModal";
import BASE_URL from "../../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const State = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/countries`);
      // Assuming res.data is an array of { name: "United States", ... }
      const options = res.data.map((country) => ({
        value: country.name,
        label: country.name,
      }));
      setCountries(options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch countries");
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    console.log("Selected country:", selectedOption);
  };
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
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Inactive
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      New Joiners
                    </a>
                  </li>
                </ul>
              </div>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      {/* Add State */}
      <div className="modal fade" id="add-state">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add State</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="mb-3">
                    <label className="form-label">
                      Country Name <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={handleChange}
                      placeholder="Select a country"
                      isSearchable
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      State Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                 
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fs-13 fw-medium p-2 px-3"
                >
                  Add State
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add State */}

      {/* <StateModal
    modalId="add-country"
    title="Add Country"
   
    submitLabel="Add Country"
  />

  <StateModal
    modalId="edit-country"
    title="Edit Country"
   
    submitLabel="Update Country"
  /> */}
    </div>
  );
};

export default State;


// county state and city locATION WALA
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../config/config';
// import StateTable from './StateList';

// const StatePage = () => {
//     const [states, setStates] = useState([]);

//     const fetchStates = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/locations`);
//             const stateList = [
//                 ...new Set(res.data.flatMap(loc => loc.states?.map(s => s.name)))
//             ];
//             setStates(stateList);
//         } catch (error) {
//             console.error('Error fetching states:', error);
//         }
//     };

//     const handleDeleteState = async (state) => {
//         if (window.confirm(`Are you sure you want to delete state "${state}"?`)) {
//             try {
//                 await axios.delete(`${BASE_URL}/api/locations/state/${state}`);
//                 fetchStates();
//             } catch (error) {
//                 console.error('Error deleting state:', error);
//             }
//         }
//     };

//     const handleEditState = (state) => {
//         alert(`Edit state: ${state}`);
//     };

//     useEffect(() => {
//         fetchStates();
//     }, []);

//     return (
//         <div className="container py-4">
//             <h2>State Management</h2>
//             <StateTable
//                 states={states}
//                 onDeleteState={handleDeleteState}
//                 onEditState={handleEditState}
//             />
//         </div>
//     );
// };

// export default StatePage;

// const StateTable = ({states = [], onDeleteState, onEditState }) => (

//     <div className="my-3">
//         <h5>States</h5>
//         <table className="table table-bordered">
//             <thead>
//                 <tr>
//                     <th>#</th>
//                     <th>State</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {states.map((state, i) => (
//                     <tr key={i}>
//                         <td>{i + 1}</td>
//                         <td>{state}</td>
//                         <td>
//                             <button className="btn btn-sm btn-primary me-2" onClick={() => onEditState(state)}>Edit</button>
//                             <button className="btn btn-sm btn-danger" onClick={() => onDeleteState(state)}>Delete</button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     </div>
// );

// export default StateTable;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import BASE_URL from "../../config/config";

// const CountryManagement = () => {
//   const [countries, setCountries] = useState([]);
//   const [newName, setNewName] = useState("");
//   const [newCode, setNewCode] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [editingCountry, setEditingCountry] = useState(null);

//   // Fetch countries on mount
//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   const fetchCountries = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/countries`);
//       setCountries(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch countries");
//     }
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${BASE_URL}/api/countries`, { name: newName, code: newCode });
//       toast.success("Country added");
//       setNewName("");
//       setNewCode("");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Error adding country");
//     }
//   };

//   const handleEdit = (country) => {
//     setEditMode(true);
//     setEditingCountry(country);
//     setNewName(country.name);
//     setNewCode(country.code);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${BASE_URL}/api/countries/${editingCountry._id}`, {
//         name: newName,
//         code: newCode,
//       });
//       toast.success("Country updated");
//       setEditMode(false);
//       setEditingCountry(null);
//       setNewName("");
//       setNewCode("");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this country?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/countries/${id}`);
//       toast.success("Deleted");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">Country Management</h2>

//       {/* Add/Edit Form */}
//       <form onSubmit={editMode ? handleUpdate : handleAdd}>
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <input
//               type="text"
//               placeholder="Country Name"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               className="form-control"
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <input
//               type="text"
//               placeholder="Country Code"
//               value={newCode}
//               onChange={(e) => setNewCode(e.target.value)}
//               className="form-control"
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <button type="submit" className="btn btn-primary w-100">
//               {editMode ? "Update Country" : "Add Country"}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Country Table */}
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th>#</th>
//             <th>Country Name</th>
//             <th>Code</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {countries.map((country, index) => (
//             <tr key={country._id}>
//               <td>{index + 1}</td>
//               <td>{country.name}</td>
//               <td>{country.code}</td>
//               <td>
//                 <button
//                   onClick={() => handleEdit(country)}
//                   className="btn btn-sm btn-info me-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(country._id)}
//                   className="btn btn-sm btn-danger"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {countries.length === 0 && (
//             <tr>
//               <td colSpan="4" className="text-center text-muted">
//                 No countries found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CountryManagement;
