import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import BASE_URL from "../../config/config";
import { toast } from "react-toastify";
import Select from "react-select";
import CityModal from "../../Modal/CityModal";

const City = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [cityName, setCityName] = useState("");
//   const [editId, setEditId] = useState(null);
  const [editCityName, setEditCityName] = useState("");
  const [editCityCode, setEditCityCode] = useState("");
const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities(); // 👈
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/countries`,{
          headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setCountries(res.data);
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
      setStates(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch states");
    }
  };

  //   const fetchCities = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}/api/city/cities`);
  //       setCities(res.data);
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Failed to fetch cities");
  //     }
  //   };
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/city/cities`,{
          headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setCities(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch cities");
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);

    const filtered = states
      .filter((s) => s.country._id === selectedOption.value)
      .map((s) => ({
        value: s._id,
        label: s.stateName,
      }));

    setFilteredStates(filtered);
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!selectedCountry || !selectedState || !cityName.trim()) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${BASE_URL}/api/city/cities`, {
  //       cityName: cityName,
  //       cityCode: cityName.slice(0, 2).toUpperCase(),
  //       state: selectedState.value,
  //       country: selectedCountry.value,
  //         headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     });

  //     toast.success("City added successfully");

  //     // Reset form
  //     setCityName("");
  //     setSelectedCountry(null);
  //     setSelectedState(null);
  //     setFilteredStates([]);

  //     fetchCities(); // Refresh states if needed
  //     window.$(`#add-city`).modal("hide");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Error adding city");
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedCountry || !selectedState || !cityName.trim()) {
    toast.error("All fields are required");
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/api/city/cities`,
      {
        cityName: cityName,
        cityCode: cityName.slice(0, 2).toUpperCase(),
        state: selectedState.value,
        country: selectedCountry.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("City added successfully");

    // Reset form
    setCityName("");
    setSelectedCountry(null);
    setSelectedState(null);
    setFilteredStates([]);

    fetchCities(); // Refresh states if needed
    window.$(`#add-city`).modal("hide");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Error adding city");
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();
  if (!selectedCountry || !selectedState || !cityName.trim()) {
    toast.error("All fields are required");
    return;
  }

  try {
    await axios.put(
      `${BASE_URL}/api/city/cities/${editCityData._id}`,
      {
        cityName: editCityName,
        cityCode: editCityName.slice(0, 2).toUpperCase(),
        state: selectedState.value,
        country: selectedCountry.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("City updated successfully");
    fetchCities();

    // Reset
    setEditCityData(null);
    setEditCityName("");
    setSelectedCountry(null);
    setSelectedState(null);
    setFilteredStates([]);
    window.$(`#edit-city`).modal("hide");
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating city");
  }
};

  const countryOptions = countries.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/city/cities/${id}`,{
          headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      toast.success("City deleted successfully");
      fetchCities(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting city");
    }
  };

  const handleEditClick = (city) => {
    const countryOption = {
      value: city.country._id,
      label: city.country.name,
    };

    const filtered = states
      .filter((s) => s.country._id === city.country._id)
      .map((s) => ({ value: s._id, label: s.stateName }));

    const stateOption = {
      value: city.state._id,
      label: city.state.stateName,
    };

    setSelectedCountry(countryOption);
    setFilteredStates(filtered);
    setSelectedState(stateOption);
    setCityName(city.cityName);
    setEditCityData(city);
  };
  const [editCityData, setEditCityData] = useState("");

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   if (!selectedCountry || !selectedState || !cityName.trim()) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   try {
  //     await axios.put(`${BASE_URL}/api/city/cities/${editCityData._id}`, {
  //       cityName: editCityName,
  //       cityCode: editCityName.slice(0, 2).toUpperCase(),
  //       state: selectedState.value,
  //       country: selectedCountry.value,
  //         headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     });

  //     toast.success("City updated successfully");
  //     fetchCities();

  //     // Reset
  //     setEditCityData(null);
  //     setEditCityName("");
  //     setSelectedCountry(null);
  //     setSelectedState(null);
  //     setFilteredStates([]);
  //     window.$(`#edit-city`).modal("hide");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Error updating city");
  //   }
  // };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Cities</h4>
              <h6>Manage Your Cities</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button type="button" className="icon-btn" title="Pdf">
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
              <button type="button" className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-city"
            >
              <i className="ti ti-circle-plus me-1" />
              Add City
            </a>
          </div>
        </div>

        {/* City Table */}
        <div className="card">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <a href="#" className="dropdown-toggle btn btn-white btn-md">
                  Sort By : Last 7 Days
                </a>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>City Name</th>
                    <th>State Name</th>
                    <th>Country Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td className="text-gray-9">{city.cityName}</td>
                      <td>{city.state?.stateName}</td>
                      <td>{city.country?.name}</td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a
                            className="me-2 p-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-city"
                            onClick={() => handleEditClick(city)}
                          >
                            <TbEdit />
                          </a>
                          <a
                            className="p-2"
                            onClick={() => handleDelete(city._id)}
                          >
                            <TbTrash />
                          </a>
                        </div>
                      </td>
                    </tr>
                    // <tr key={city._id}>
                    //   <td>{city.cityName}</td>
                    //   <td>{city.state?.stateName}</td>
                    //   <td>{city.country?.name}</td>
                    //   <td>
                    //     <div className="edit-delete-action">
                    //       <a className="me-2 p-2" onClick={() => handleEdit(city)}>
                    //         <TbEdit />
                    //       </a>
                    //       <a className="p-2" onClick={() => handleDelete(city._id)}>
                    //         <TbTrash />
                    //       </a>
                    //     </div>
                    //   </td>
                    // </tr>
                  ))}
                  {!cities.length && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No cities found
                      </td>
                    </tr>
                  )}

                  {/* Loop dynamic cities here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add City Modal */}
        <div className="modal fade" id="add-city">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add City</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>
                      Country <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={countryOptions}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select country"
                    />
                  </div>

                  <div className="mb-3">
                    <label>
                      State <span className="text-danger">*</span>
                    </label>
                    <Select
                      options={filteredStates}
                      value={selectedState}
                      onChange={handleStateChange}
                      placeholder="Select state"
                      isDisabled={!selectedCountry}
                    />
                  </div>

                  <div className="mb-3">
                    <label>
                      City Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
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
                    Add City
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <CityModal
          modalId="edit-city"
          title="Edit City"
          editStateName={editCityName}
          editStateCode={editCityCode}
          onNameChange={(e) => setEditCityName(e.target.value)}
          onCodeChange={(e) => setEditCityCode(e.target.value)}
          onSubmit={handleUpdate}
          submitLabel="Update State"
        />
      </div>
    </div>
  );
};

export default City;

// semi final
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbTrash } from "react-icons/tb";
// import BASE_URL from "../../config/config";
// import { toast } from "react-toastify";
// import Select from "react-select"

// const City = () => {
// //   const [countries, setCountries] = useState([]);
// //   const [states, setStates] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //     const [selectedCountry, setSelectedCountry] = useState(null);
// //     const [selectedState, setSelectedState] = useState(null);

// //   useEffect(() => {
// //     fetchCountries();
// //     fetchStates();
// //   }, []);

// //   const fetchCountries = async () => {
// //     try {
// //       const res = await axios.get(`${BASE_URL}/api/states`);
// //       const options = res.data.map((state) => ({
// //         value: state._id,
// //         label: state.stateName,
// //       }));
// //       setStates(options);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Failed to fetch State");
// //     }
// //   };
// //   const fetchStates = async () => {
// //     try {
// //       const res = await axios.get(`${BASE_URL}/api/countries`);
// //       const options = res.data.map((country) => ({
// //         value: country._id,
// //         label: country.name,
// //       }));
// //       setCountries(options);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Failed to fetch countries");
// //     }
// //   };

// //   const handleChange = (selectedOption) => {
// //     setSelectedCountry(selectedOption);
// //   };
// //   const handleStateChange = (selectedOption) => {
// //     setSelectedState(selectedOption);
// //   };

// const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [cityName, setCityName] = useState("");

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   const fetchCountries = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/countries`);
//       const options = res.data.map((country) => ({
//         value: country._id,
//         label: country.name,
//       }));
//       setCountries(options);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch countries");
//     }
//   };

//   const fetchStates = async (countryId) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/states/countries/${countryId}`);
//       const options = res.data.map((state) => ({
//         value: state._id,
//         label: state.stateName,
//       }));
//       setStates(options);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch states");
//     }
//   };

//   const handleCountryChange = (selectedOption) => {
//     setSelectedCountry(selectedOption);
//     setSelectedState(null); // Clear previous state
//     fetchStates(selectedOption.value); // Fetch states for selected country
//   };

//   const handleStateChange = (selectedOption) => {
//     setSelectedState(selectedOption);
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4>Cities</h4>
//               <h6>Manage Your Cities</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Pdf"
//                 className="icon-btn"
//               >
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <label className="icon-btn m-0" title="Import Excel">
//                 <input
//                   type="file"
//                   accept=".xlsx, .xls"
//                   style={{ display: "none" }}
//                 />
//                 <FaFileExcel style={{ color: "green" }} />
//               </label>
//             </li>
//             <li>
//               <button
//                 type="button"
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="top"
//                 title="Export Excel"
//                 id="collapse-header"
//                 className="icon-btn"
//               >
//                 <FaFileExcel />
//               </button>
//             </li>
//           </div>
//           <div className="page-btn">
//             <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-city"
//             >
//               <i className="ti ti-circle-plus me-1" />
//               Add City
//             </a>
//           </div>
//         </div>
//         {/* /product list */}
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <span className="btn-searchset">
//                   <i className="ti ti-search fs-14 feather-search" />
//                 </span>
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               <div className="dropdown">
//                 <a
//                   href="javascript:void(0);"
//                   className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
//                   data-bs-toggle="dropdown"
//                 >
//                   Sort By : Last 7 Days
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable ">
//                 <thead className="thead-light">
//                   <tr>
//                     <th className="no-sort">
//                       <label className="checkboxs">
//                         <input type="checkbox" id="select-all" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>City Name</th>
//                     <th>State Name</th>
//                     <th>Country Name</th>
//                     <th className="no-sort" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </td>
//                     <td className="text-gray-9">Los Angles</td>
//                     <td>California</td>
//                     <td>United States</td>

//                     <td className="action-table-data">
//                       <div className="edit-delete-action">
//                         <a
//                           className="me-2 p-2"
//                           data-bs-toggle="modal"
//                           data-bs-target="#edit-state"
//                           //   onClick={() => {
//                           //     setEditingState(state); // state is the object you're editing
//                           //     setEditStateName(state.stateName); // ✅ Set this correctly
//                           //     setEditStateCode(state.stateCode); // ✅ Set this correctly
//                           //     console.log("Edit Clicked:", state); // ✅ Debug log
//                           //   }}
//                         >
//                           <TbEdit />
//                         </a>

//                         <a
//                           className="p-2"
//                           //   onClick={() => handleDeleteState(state._id)}
//                         >
//                           <TbTrash />
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* /product list */}
//       </div>
//       <div className="modal fade" id="add-city">
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h4>Add City</h4>
//             <button type="button" className="close" data-bs-dismiss="modal">
//               ×
//             </button>
//           </div>
//           <form>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <label>
//                   Country <span className="text-danger">*</span>
//                 </label>
//                 <Select
//                   options={countries}
//                   value={selectedCountry}
//                   onChange={handleCountryChange}
//                   placeholder="Select country"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>
//                   State <span className="text-danger">*</span>
//                 </label>
//                 <Select
//                   options={states}
//                   value={selectedState}
//                   onChange={handleStateChange}
//                   placeholder="Select state"
//                   isDisabled={!selectedCountry} // Disable if no country selected
//                 />
//               </div>

//               <div className="mb-3">
//                 <label>
//                   City Name <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={cityName}
//                   onChange={(e) => setCityName(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Add City
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//       {/* <div className="modal fade" id="add-city">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <div className="page-title">
//                 <h4>Add City</h4>
//               </div>
//               <button
//                 type="button"
//                 className="close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">×</span>
//               </button>
//             </div>
//             <form>
//               <div className="modal-body">
//                 <div className="row">

//                   <div className="mb-3">
//                   <label>
//                     Country <span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     options={countries}
//                     value={selectedCountry}
//                     onChange={handleChange}
//                     placeholder="Select country"
//                   />
//                 </div>

//                   <div className="mb-3">
//                   <label>
//                     State <span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     options={states}
//                     value={selectedState}
//                     onChange={handleStateChange}
//                     placeholder="Select country"
//                   />
//                 </div>

//                   <div className="mb-3">
//                     <label className="form-label">
//                       City Name <span className="text-danger">*</span>
//                     </label>
//                     <input type="text" className="form-control" />
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
//                   data-bs-dismiss="modal"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary fs-13 fw-medium p-2 px-3"
//                 >
//                   Add City
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default City;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../config/config';
// import LocationTable from './LocationTable';
// // import LocationTable from './LocationTable';

// const CreateLocationForm = () => {
//     const [country, setCountry] = useState('');
//     const [state, setState] = useState('');
//     const [city, setCity] = useState('');
//     const [error, setError] = useState('');
//     const [existingCountries, setExistingCountries] = useState([]);
//     const [existingStates, setExistingStates] = useState([]);
//     const [existingCities, setExistingCities] = useState([]);
//     const [locationData, setLocationData] = useState([]);

//     useEffect(() => {
//         axios.get(`${BASE_URL}/api/locations`)
//             .then(response => {
//                 const data = response.data;
//                 setLocationData(data);
//                 const uniqueCountries = [...new Set(data.map(loc => loc.country))];
//                 setExistingCountries(uniqueCountries);
//             })
//             .catch(error => {
//                 setError('Failed to fetch location data.');
//             });
//     }, []);

//     useEffect(() => {
//         const states = locationData
//             .filter(loc => loc.country === country)
//             .flatMap(loc => loc.states || [])
//             .map(state => state.name);
//         setExistingStates([...new Set(states)]);
//     }, [country, locationData]);

//     useEffect(() => {
//         const cities = locationData
//             .filter(loc => loc.country === country)
//             .flatMap(loc => loc.states || [])
//             .filter(st => st.name === state)
//             .flatMap(st => st.cities || []);
//         setExistingCities([...new Set(cities)]);
//     }, [country, state, locationData]);

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!country || !state || !city) {
//             setError('Please fill in all fields.');
//             return;
//         }

//         axios.post(`${BASE_URL}/api/locations`, { country, state, city })
//             .then(response => {
//                 setLocationData([...locationData, response.data]);
//                 setCountry('');
//                 setState('');
//                 setCity('');
//                 setError('');
//             })
//             .catch(error => {
//                 setError(error.response?.data?.message || 'Failed to create location.');
//             });
//     };

//     return (
//         <div>
//             <div className='container py-5'>
//                 <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
//                     <label className='row gap-2 py-2'>
//                         <p className='col-2 my-auto'>Country:</p>
//                         <select className='col-2 my-1 mx-2 py-1 rounded-2' value={country} onChange={(e) => setCountry(e.target.value)}>
//                             <option value="">--Select--</option>
//                             {existingCountries.map((country, index) => (
//                                 <option key={index} value={country}>{country}</option>
//                             ))}
//                         </select>
//                         <input
//                             className='col-4 my-1 mx-2 py-1 rounded-2'
//                             placeholder='Or create new country'
//                             type="text"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                         />
//                     </label>

//                     <label className='d-flex align-items-center gap-3 justify-content-between'>
//                         <p className='my-auto'>State:</p>
//                         <select className='form-select' value={state} onChange={(e) => setState(e.target.value)}>
//                             <option value="">--Select--</option>
//                             {existingStates.map((state, index) => (
//                                 <option key={index} value={state}>{state}</option>
//                             ))}
//                         </select>
//                         <input
//                             className='form-control'
//                             placeholder='Or create new state'
//                             type="text"
//                             value={state}
//                             onChange={(e) => setState(e.target.value)}
//                         />
//                     </label>

//                     <label className='d-flex align-items-center gap-3 justify-content-between'>
//                         <p className='my-auto'>City:</p>
//                         <select className='form-select' value={city} onChange={(e) => setCity(e.target.value)}>
//                             <option value="">--Select--</option>
//                             {existingCities.map((city, index) => (
//                                 <option key={index} value={city}>{city}</option>
//                             ))}
//                         </select>
//                         <input
//                             className='form-control'
//                             placeholder='Or create new city'
//                             type="text"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                         />
//                     </label>

//                     <button className='btn btn-primary mt-3' type="submit">Create Location</button>
//                 </form>
//                 {error && <p className='text-danger mt-2'>{error}</p>}
//             </div>

//             <div className="category-table container mx-auto">
//                 <LocationTable locationData={locationData} />
//             </div>
//         </div>
//     );
// };

// export default CreateLocationForm;
