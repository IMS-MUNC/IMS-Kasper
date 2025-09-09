import React, { useEffect, useState } from 'react';
import Logation from './Logation';
import BASE_URL from '../config/config';
import axios from 'axios';
import CountryList from './country/CountryList';
import StateList from './state/StateList';
import CityTable from './city/CityList';

const LocationTable = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);


    const [locationData, setLocationData] = useState([]);

    

    const fetchLocations = () => {
        axios.get(`${BASE_URL}/api/locations`)
            .then(res => setLocationData(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleDeleteCountry = async (country) => {
        if (window.confirm(`Are you sure you want to delete country "${country}"?`)) {
            try {
                await axios.delete(`${BASE_URL}/api/locations/country/${country}`);
                fetchLocations();
            } catch (error) {
                console.error('Error deleting country:', error);
            }
        }
    };

    const handleDeleteState = async (state) => {
        if (window.confirm(`Are you sure you want to delete state "${state}"?`)) {
            try {
                await axios.delete(`${BASE_URL}/api/locations/state/${state}`);
                fetchLocations();
            } catch (error) {
                console.error('Error deleting state:', error);
            }
        }
    };

    const handleDeleteCity = async (city) => {
        if (window.confirm(`Are you sure you want to delete city "${city}"?`)) {
            try {
                await axios.delete(`${BASE_URL}/api/locations/city/${city}`);
                fetchLocations();
            } catch (error) {
                console.error('Error deleting city:', error);
            }
        }
    };

    const uniqueCountries = [...new Set(locationData.map(loc => loc.country))];
    const uniqueStates = [...new Set(locationData.flatMap(loc => loc.states?.map(s => s.name)))];
    const uniqueCities = [...new Set(locationData.flatMap(loc => loc.states?.flatMap(s => s.cities)))];


    return (
        <div className='container py-4'>
            <button className='btn btn-success' onClick={handleOpen}>
                Add Location
            </button>


            <CountryList
                countries={uniqueCountries}
                onDeleteCountry={handleDeleteCountry}
                onEditCountry={(c) => alert(`Edit country: ${c}`)} // future logic
            />

            <StateList
                states={uniqueStates}
                onDeleteState={handleDeleteState}
                onEditState={(s) => alert(`Edit state: ${s}`)} // future logic
            />

            <CityTable
                cities={uniqueCities}
                onDeleteCity={handleDeleteCity}
                onEditCity={(c) => alert(`Edit city: ${c}`)} // future logic
            />



            {/* <Logation show={showModal} onClose={handleClose} /> */}
            {/* <Logation show={showModal} onClose={handleClose} onLocationAdded={fetchLocations} /> */}
            <Logation
    show={showModal}
    onClose={handleClose}
    onLocationAdded={fetchLocations}
/>

        </div>
    );
};

export default LocationTable;



// import React, { useEffect, useState } from 'react';
// import BASE_URL from '../config/config';
// import axios from 'axios';

// const Logation = ({ show, onClose }) => {
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
//             .catch(() => {
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
//                 onClose(); // Close modal on success
//             })
//             .catch(error => {
//                 setError(error.response?.data?.message || 'Failed to create location.');
//             });
//     };

//     return (
//         <div className={`modal ${show ? 'd-block show' : 'd-none'}`} tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog">
//                 <div className="modal-content p-3">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Add Location</h5>
//                         <button type="button" className="btn-close" onClick={onClose}></button>
//                     </div>
//                     <div className="modal-body">
//                         <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
//                             {/* Country */}
//                             <label className='row gap-2 py-2'>
//                                 <p className='col-3 my-auto'>Country:</p>
//                                 <select className='col my-1 mx-2 py-1 rounded-2' value={country} onChange={(e) => setCountry(e.target.value)}>
//                                     <option value="">--Select--</option>
//                                     {existingCountries.map((country, index) => (
//                                         <option key={index} value={country}>{country}</option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     className='col my-1 mx-2 py-1 rounded-2'
//                                     placeholder='Or create new country'
//                                     type="text"
//                                     value={country}
//                                     onChange={(e) => setCountry(e.target.value)}
//                                 />
//                             </label>

//                             {/* State */}
//                             <label className='d-flex align-items-center gap-3 justify-content-between'>
//                                 <p className='my-auto'>State:</p>
//                                 <select className='form-select' value={state} onChange={(e) => setState(e.target.value)}>
//                                     <option value="">--Select--</option>
//                                     {existingStates.map((state, index) => (
//                                         <option key={index} value={state}>{state}</option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     className='form-control'
//                                     placeholder='Or create new state'
//                                     type="text"
//                                     value={state}
//                                     onChange={(e) => setState(e.target.value)}
//                                 />
//                             </label>

//                             {/* City */}
//                             <label className='d-flex align-items-center gap-3 justify-content-between'>
//                                 <p className='my-auto'>City:</p>
//                                 <select className='form-select' value={city} onChange={(e) => setCity(e.target.value)}>
//                                     <option value="">--Select--</option>
//                                     {existingCities.map((city, index) => (
//                                         <option key={index} value={city}>{city}</option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     className='form-control'
//                                     placeholder='Or create new city'
//                                     type="text"
//                                     value={city}
//                                     onChange={(e) => setCity(e.target.value)}
//                                 />
//                             </label>

//                             <button className='btn btn-primary mt-3' type="submit">Create Location</button>
//                         </form>
//                         {error && <p className='text-danger mt-2'>{error}</p>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Logation;