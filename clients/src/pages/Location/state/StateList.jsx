// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../config/config';
// import StateTable from './State';

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



import React from 'react'

const StateList =  ({states = [], onDeleteState, onEditState }) => {

console.log("states")

  return (
    <div className="my-3">
    <h5>States</h5>
    <table className="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {states.map((state, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{state}</td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2" onClick={() => onEditState(state)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDeleteState(state)}>Delete</button>
                        </td>
                    </tr>
                ))}
        </tbody>
    </table>
</div>
  )
}

export default StateList