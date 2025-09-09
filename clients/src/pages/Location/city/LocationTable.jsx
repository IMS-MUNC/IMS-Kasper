// import React from 'react';

// const LocationTable = ({ locationData }) => {
//     return (
//         <div className="table-responsive">
//             <table className="table table-striped">
//                 <thead>
//                     <tr>
//                         <th>Countries</th>
//                         <th>States</th>
//                         <th>Cities</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {locationData.map((location, locIndex) => {
//                         const countryRowSpan = location.states.length;
//                         let countryPrinted = false;

//                         return (
//                             <React.Fragment key={locIndex}>
//                                 {location.states.map((state, stateIndex) => (
//                                     <tr key={stateIndex}>
//                                         {!countryPrinted && (
//                                             <td rowSpan={countryRowSpan}>
//                                                 {location.country}
//                                             </td>
//                                         )}
//                                         <td>{state.name}</td>
//                                         <td>{state.cities.join(', ')}</td>
//                                         {countryPrinted = true}
//                                     </tr>
//                                 ))}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default LocationTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../config/config';

const CountryStateCityTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/locations`);
      const data = res.data;

      const formattedRows = [];

      data.forEach((location) => {
        const country = location.country;
        location.states.forEach((state) => {
          const stateName = state.name;
          state.cities.forEach((city) => {
            formattedRows.push({ country, state: stateName, city });
          });
        });
      });

      setRows(formattedRows);
    } catch (error) {
      console.error('Error fetching locations', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Country, State, and City Table</h3>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.country}</td>
              <td>{row.state}</td>
              <td>{row.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && <p>No locations found.</p>}
    </div>
  );
};

export default CountryStateCityTable;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../config/config';

// const LocationManager = () => {
//   const [locations, setLocations] = useState([]);
//   const [form, setForm] = useState({ country: '', state: '', city: '' });
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   // Load all countries and their structure
//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     // const res = await axios.get(`${BASE_URL}/api/location`);
//     const res = await axios.get(`${BASE_URL}/api/locations`);

//     setLocations(res.data);
//   };

//   const fetchStates = async (country) => {
//     const res = await axios.get(`${BASE_URL}/api/location/${country}/states`);
//     setStates(res.data);
//   };

//   const fetchCities = async (country, state) => {
//     const res = await axios.get(`${BASE_URL}/api/location/${country}/${state}/cities`);
//     setCities(res.data);
//   };

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCreateLocation = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/location', form);
//       fetchLocations();
//       setForm({ country: '', state: '', city: '' });
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error creating location');
//     }
//   };

//   const handleDeleteCity = async (country, state, city) => {
//     if (window.confirm('Delete this city?')) {
//       await axios.delete(`${BASE_URL}/api/location`, {
//         data: { country, state, city }
//       });
//       fetchCities(country, state);
//       fetchLocations();
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3 className="mb-3">Location Manager</h3>

//       <form onSubmit={handleCreateLocation} className="row g-3 mb-4">
//         <div className="col-md-4">
//           <label className="form-label">Country</label>
//           <input type="text" name="country" value={form.country} onChange={handleInputChange} className="form-control" required />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">State</label>
//           <input type="text" name="state" value={form.state} onChange={handleInputChange} className="form-control" required />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">City</label>
//           <input type="text" name="city" value={form.city} onChange={handleInputChange} className="form-control" required />
//         </div>
//         <div className="col-12">
//           <button type="submit" className="btn btn-primary">Add Location</button>
//         </div>
//       </form>

//       <div className="row mb-4">
//         <div className="col-md-6">
//           <label className="form-label">Select Country</label>
//           <select className="form-select" onChange={(e) => {
//             const country = e.target.value;
//             setSelectedCountry(country);
//             fetchStates(country);
//             setCities([]);
//           }}>
//             <option value="">-- Select --</option>
//             {locations.map(loc => (
//               <option key={loc._id} value={loc.country}>{loc.country}</option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-6">
//           <label className="form-label">Select State</label>
//           <select className="form-select" onChange={(e) => {
//             const state = e.target.value;
//             setSelectedState(state);
//             fetchCities(selectedCountry, state);
//           }}>
//             <option value="">-- Select --</option>
//             {states.map((st, i) => (
//               <option key={i} value={st}>{st}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {cities.length > 0 && (
//         <div>
//           <h5>Cities in {selectedState}, {selectedCountry}</h5>
//           <ul className="list-group">
//             {cities.map((city, i) => (
//               <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
//                 {city}
//                 <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCity(selectedCountry, selectedState, city)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationManager;
