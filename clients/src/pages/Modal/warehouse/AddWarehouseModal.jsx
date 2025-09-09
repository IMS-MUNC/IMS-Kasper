

// AddWarehouseModal.jsx
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../config/config";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const itemVolumes = {
//     small: 4,
//     medium: 8,
//     large: 16,
// };

// const calculateItemCapacity = (sqf, sizeKey) => {
//     const height = 8; // in feet
//     const itemVolume = itemVolumes[sizeKey];
//     const efficiency = 0.65;
//     const totalVolume = sqf * height;
//     const usableVolume = totalVolume * efficiency;
//     return Math.floor(usableVolume / itemVolume);
// };

// const AddWarehouseModal = () => {
//     const [users, setUsers] = useState([]);
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);

//     const [filteredStates, setFilteredStates] = useState([]);
//     const [filteredCities, setFilteredCities] = useState([]);
//     const [showMap, setShowMap] = useState(false);
//     const [shelfLevels] = useState(3); // Fixed number of shelf levels per rack
//     const renderRackBarcode = (rackLabel, level) => {
//         const barcode = `${rackLabel}-L${level}`;
//         return <div style={{ fontSize: "10px", color: "#333" }}>{barcode}</div>;
//     };

//     const [form, setForm] = useState({
//         warehouseName: "",
//         space: "",
//         items: "",
//         itemSize: "medium",
//         contactPerson: null,
//         phone: "",
//         email: "",
//         phoneWork: "",
//         streetAddress: "",
//         country: null,
//         state: null,
//         city: null,
//         postalCode: "",
//         status: true,
//     });

//     const isOverfilled = () => {
//         const capacity = calculateItemCapacity(Number(form.space), form.itemSize);
//         const entered = Number(form.items);
//         return entered > capacity;
//     };

//     useEffect(() => {
//         fetchActiveUsers();
//         fetchCountries();
//         fetchStates();
//         fetchCities();
//     }, []);

//     const fetchActiveUsers = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/user/status/active`);
//             const formatted = res.data.users.map((user) => ({
//                 value: user._id,
//                 label: `${user.firstName} ${user.lastName} (${user.email})`,
//             }));
//             setUsers(formatted);
//         } catch {
//             toast.error("Failed to fetch active users");
//         }
//     };

//     const fetchCountries = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/countries`);
//             const formatted = res.data.map((c) => ({ value: c._id, label: c.name }));
//             setCountries(formatted);
//         } catch {
//             toast.error("Failed to fetch countries");
//         }
//     };

//     const fetchStates = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/states`);
//             setStates(res.data);
//         } catch {
//             toast.error("Failed to fetch states");
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/city/cities`);
//             setCities(res.data);
//         } catch {
//             toast.error("Failed to fetch cities");
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleItemSizeChange = (e) => {
//         setForm((prev) => ({ ...prev, itemSize: e.target.value }));
//     };

//     const handleSelectChange = (selectedOption, action) => {
//         setForm((prev) => ({ ...prev, [action.name]: selectedOption }));
//     };

//     const handleCountryChange = (option) => {
//         setForm((prev) => ({ ...prev, country: option, state: null, city: null }));
//         const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
//         setFilteredStates(filtered);
//         setFilteredCities([]);
//     };

//     const handleStateChange = (option) => {
//         setForm((prev) => ({ ...prev, state: option, city: null }));
//         const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
//         setFilteredCities(filtered);
//     };

//     const handleCityChange = (option) => {
//         setForm((prev) => ({ ...prev, city: option }));
//     };

//     const handleStatusChange = () => {
//         setForm((prev) => ({ ...prev, status: !prev.status }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`${BASE_URL}/api/warehouse`, {
//                 ...form,
//                 contactPerson: form.contactPerson?.value || null,
//                 country: form.country?.value || null,
//                 state: form.state?.value || null,
//                 city: form.city?.value || null,
//                 capacityEstimate: calculateItemCapacity(Number(form.space), form.itemSize),
//             });
//             toast.success("Warehouse added successfully");
//         } catch {
//             toast.error("Failed to add warehouse");
//         }
//     };

//     return (
//         <div className="modal fade" id="add-warehouse">
//             <div className="modal-dialog modal-lg modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Add Warehouse</h5>
//                         <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//                     </div>
//                     <form onSubmit={handleSubmit}>
//                         <div className="modal-body">

//                             <div className="row">
//                                 <div className="col-md-12 mb-3">
//                                     <label className="form-label fw-semibold">Warehouse Name <span className="text-danger">*</span></label>
//                                     <input type="text" className="form-control" name="warehouseName" value={form.warehouseName} onChange={handleInputChange} />
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Space (sqf)</label>
//                                     <input type="number" className="form-control" name="space" value={form.space} onChange={handleInputChange} />
//                                     <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={() => setShowMap(true)} disabled={!form.space || isNaN(form.space)}>View Map</button>
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Item Size</label>
//                                     <select className="form-select" value={form.itemSize} onChange={handleItemSizeChange}>
//                                         <option value="small">Small (4 cu ft)</option>
//                                         <option value="medium">Medium (8 cu ft)</option>
//                                         <option value="large">Large (16 cu ft)</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Items</label>
//                                     <input
//                                         type="number"
//                                         className={`form-control ${isOverfilled() ? "is-invalid" : ""}`}
//                                         name="items"
//                                         value={form.items}
//                                         onChange={handleInputChange}
//                                     />
//                                     {isOverfilled() && <div className="invalid-feedback">Entered items exceed estimated capacity!</div>}
//                                 </div>

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Estimated Capacity</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         value={form.space ? calculateItemCapacity(Number(form.space), form.itemSize) : ""}
//                                         placeholder="--"
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Items <span className="text-danger">*</span></label>
//                                     <input type="text" className="form-control" name="items" value={form.items} onChange={handleInputChange} />
//                                 </div>
//                             </div>

//                             {/* Contact */}
//                             <div className="mb-3">
//                                 <label className="form-label fw-semibold">Contact Information</label>
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Contact Person</label>
//                                         <Select
//                                             name="contactPerson"
//                                             options={users}
//                                             value={form.contactPerson}
//                                             onChange={(opt) => handleSelectChange(opt, { name: "contactPerson" })}
//                                             placeholder="Search and select a user"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Phone</label>
//                                         <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Email</label>
//                                         <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Phone (Work)</label>
//                                         <input type="text" className="form-control" name="phoneWork" value={form.phoneWork} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Address */}
//                             <div className="mb-3">
//                                 <label className="form-label fw-semibold">Address</label>
//                                 <div className="row">
//                                     <div className="col-md-12 mb-3">
//                                         <label className="form-label">Street Address</label>
//                                         <input type="text" className="form-control" name="streetAddress" value={form.streetAddress} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Country</label>
//                                         <Select
//                                             options={countries}
//                                             value={form.country}
//                                             onChange={handleCountryChange}
//                                             placeholder="Select Country"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">State</label>
//                                         <Select
//                                             options={filteredStates}
//                                             value={form.state}
//                                             onChange={handleStateChange}
//                                             isDisabled={!form.country}
//                                             placeholder="Select State"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">City</label>
//                                         <Select
//                                             options={filteredCities}
//                                             value={form.city}
//                                             onChange={handleCityChange}
//                                             isDisabled={!form.state}
//                                             placeholder="Select City"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Postal Code</label>
//                                         <input type="text" className="form-control" name="postalCode" value={form.postalCode} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Status */}
//                             <div className="col-md-12 mb-0">
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <label className="form-label mb-0 fw-semibold">Status</label>
//                                     <div className="form-check form-switch">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             checked={form.status}
//                                             onChange={handleStatusChange}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>


//                             {showMap && (
//                                 <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                                         <div className="modal-content">
//                                             <div className="modal-header">
//                                                 <h5 className="modal-title">Warehouse Shelf-Level Rack Layout</h5>
//                                                 <button type="button" className="btn-close" onClick={() => setShowMap(false)} />
//                                             </div>
//                                             <div className="modal-body">
//                                                 <div className="row">
//                                                     {Array.from({ length: Math.floor(form.space / 50) }).map((_, rackIndex) => {
//                                                         const rackLabel = `${String.fromCharCode(65 + Math.floor(rackIndex / 10))}${(rackIndex % 10) + 1}`;
//                                                         return (
//                                                             <div className="col-2 mb-3" key={rackLabel}>
//                                                                 <div className="border p-1 bg-light text-center rounded">
//                                                                     <strong>{rackLabel}</strong>
//                                                                     {Array.from({ length: shelfLevels }).map((_, levelIndex) => (
//                                                                         <div key={levelIndex} className="bg-primary text-white mt-1 py-1 rounded">
//                                                                             {renderRackBarcode(rackLabel, levelIndex + 1)}
//                                                                         </div>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                                 <p className="mt-3 text-muted small">
//                                                     * Multi-level layout — each rack has labeled shelf levels with barcode representation.
//                                                 </p>
//                                             </div>
//                                             <div className="modal-footer">
//                                                 <button className="btn btn-secondary" onClick={() => setShowMap(false)}>Close</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}


//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
//                                 Cancel
//                             </button>
//                             <button type="submit" className="btn btn-primary">
//                                 Save
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddWarehouseModal;

import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../config/config";
import Select from "react-select";
import { toast } from "react-toastify";

const itemVolumes = {
    small: 4,
    medium: 8,
    large: 16,
};

const calculateItemCapacity = (sqf, sizeKey) => {
    const height = 8;
    const efficiency = 0.65;
    const totalVolume = sqf * height;
    const usableVolume = totalVolume * efficiency;
    return Math.floor(usableVolume / itemVolumes[sizeKey]);
};

const generateRacks = (space, sizeKey, shelfLevels) => {
    const rackUnit = 50;
    const totalRacks = Math.floor(space / rackUnit);
    const itemVolume = itemVolumes[sizeKey];
    const height = 8;
    const efficiency = 0.65;
    const racks = [];

    for (let i = 0; i < totalRacks; i++) {
        const rackLabel = `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`;
        const rackVolume = rackUnit * height * efficiency;
        const capacity = Math.floor(rackVolume / itemVolume);
        const levels = Array.from({ length: shelfLevels }).map((_, levelIdx) => ({
            level: levelIdx + 1,
            barcode: `${rackLabel}-L${levelIdx + 1}`,
        }));
        racks.push({ rackLabel, shelfLevels, capacity, levels });
    }

    return racks;
};

const AddWarehouseModal = () => {
    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [shelfLevels] = useState(3);
    const initialForm = {
        warehouseName: "",
        space: "",
        items: "",
        itemSize: "medium",
        contactPerson: null,
        phone: "",
        email: "",
        phoneWork: "",
        streetAddress: "",
        country: null,
        state: null,
        city: null,
        postalCode: "",
        status: "Active",
        // status: true,
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    // const [form, setForm] = useState({
    //     warehouseName: "",
    //     space: "",
    //     items: "",
    //     itemSize: "medium",
    //     contactPerson: null,
    //     phone: "",
    //     email: "",
    //     phoneWork: "",
    //     streetAddress: "",
    //     country: null,
    //     state: null,
    //     city: null,
    //     postalCode: "",
    //     status: true,
    // });

    const isOverfilled = () => {
        const capacity = calculateItemCapacity(Number(form.space), form.itemSize);
        const entered = Number(form.items);
        return entered > capacity;
    };

    useEffect(() => {
        fetchActiveUsers();
        fetchCountries();
        fetchStates();
        fetchCities();
    }, []);

    const fetchActiveUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/user/status/active`);
            const formatted = res.data.users.map((user) => ({
                value: user._id,
                label: `${user.firstName} ${user.lastName} (${user.email})`,
            }));
            setUsers(formatted);
        } catch {
            toast.error("Failed to fetch active users");
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/countries`);
            const formatted = res.data.map((c) => ({ value: c._id, label: c.name }));
            setCountries(formatted);
        } catch {
            toast.error("Failed to fetch countries");
        }
    };

    const fetchStates = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/states`);
            setStates(res.data);
        } catch {
            toast.error("Failed to fetch states");
        }
    };

    const fetchCities = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/city/cities`);
            setCities(res.data);
        } catch {
            toast.error("Failed to fetch cities");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleItemSizeChange = (e) => {
        setForm((prev) => ({ ...prev, itemSize: e.target.value }));
    };

    const handleSelectChange = (selectedOption, action) => {
        setForm((prev) => ({ ...prev, [action.name]: selectedOption }));
    };

    const handleCountryChange = (option) => {
        setForm((prev) => ({ ...prev, country: option, state: null, city: null }));
        const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
        setFilteredStates(filtered);
        setFilteredCities([]);
    };

    const handleStateChange = (option) => {
        setForm((prev) => ({ ...prev, state: option, city: null }));
        const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
        setFilteredCities(filtered);
    };

    const handleCityChange = (option) => {
        setForm((prev) => ({ ...prev, city: option }));
    };

    const handleStatusChange = () => {
        setForm((prev) => ({ ...prev, status: !prev.status }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const racks = generateRacks(Number(form.space), form.itemSize, shelfLevels);
    //         await axios.post(`${BASE_URL}/api/warehouse`, {
    //             ...form,
    //             contactPerson: form.contactPerson?.value || null,
    //             country: form.country?.value || null,
    //             state: form.state?.value || null,
    //             city: form.city?.value || null,
    //             capacityEstimate: calculateItemCapacity(Number(form.space), form.itemSize),
    //             racks,
    //         });
    //         toast.success("Warehouse added successfully");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Failed to add warehouse");
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const racks = generateRacks(
                Number(form.space),
                form.itemSize,
                shelfLevels
            );

            await axios.post(`${BASE_URL}/api/warehouse`, {
                ...form,
                // status: form.status === "Active",   // ⬅️ backend अब भी boolean पाता है

                contactPerson: form.contactPerson?.value || null,
                country: form.country?.value || null,
                state: form.state?.value || null,
                city: form.city?.value || null,
                capacityEstimate: calculateItemCapacity(
                    Number(form.space),
                    form.itemSize
                ),
                racks,
            });

            toast.success("Warehouse added successfully");

            // ✅  RESET FORM
            setForm(initialForm);
            window.$(`#add-warehouse`).modal("hide");

        } catch (error) {
            console.error(error);

            // 409 (Conflict) = duplicate warehouse
            if (error.response?.status === 409) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to add warehouse");
            }
        } finally {
            setLoading(false);
        }
    };
    const renderRackBarcode = (rackLabel, level) => `${rackLabel}-L${level}`;

    return (
        <div className="modal fade" id="add-warehouse">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Warehouse</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Warehouse Details */}
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label fw-semibold">Warehouse Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" name="warehouseName" value={form.warehouseName} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Space (sqf)</label>
                                    <input type="number" className="form-control" name="space" value={form.space} onChange={handleInputChange} />
                                    <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={() => setShowMap(true)} disabled={!form.space || isNaN(form.space)}>View Map</button>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Item Size</label>
                                    <select className="form-select" value={form.itemSize} onChange={handleItemSizeChange}>
                                        <option value="small">Small (4 cu ft)</option>
                                        <option value="medium">Medium (8 cu ft)</option>
                                        <option value="large">Large (16 cu ft)</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Items</label>
                                    <input type="number" className={`form-control ${isOverfilled() ? "is-invalid" : ""}`} name="items" value={form.items} onChange={handleInputChange} />
                                    {isOverfilled() && <div className="invalid-feedback">Entered items exceed estimated capacity!</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Estimated Capacity</label>
                                    <input type="text" className="form-control" readOnly value={form.space ? calculateItemCapacity(Number(form.space), form.itemSize) : ""} placeholder="--" />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Contact Information</label>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Contact Person</label>
                                        <Select name="contactPerson" options={users} value={form.contactPerson} onChange={(opt) => handleSelectChange(opt, { name: "contactPerson" })} placeholder="Search and select a user" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Phone</label>
                                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Phone (Work)</label>
                                        <input type="text" className="form-control" name="phoneWork" value={form.phoneWork} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Address</label>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label">Street Address</label>
                                        <input type="text" className="form-control" name="streetAddress" value={form.streetAddress} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Country</label>
                                        <Select options={countries} value={form.country} onChange={handleCountryChange} placeholder="Select Country" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">State</label>
                                        <Select options={filteredStates} value={form.state} onChange={handleStateChange} isDisabled={!form.country} placeholder="Select State" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">City</label>
                                        <Select options={filteredCities} value={form.city} onChange={handleCityChange} isDisabled={!form.state} placeholder="Select City" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Postal Code</label>
                                        <input type="text" className="form-control" name="postalCode" value={form.postalCode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-md-12 mb-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-label mb-0 fw-semibold">Status</label>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" checked={form.status} onChange={handleStatusChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Rack Layout Preview */}
                            {showMap && (
                                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Warehouse Shelf-Level Rack Layout</h5>
                                                <button type="button" className="btn-close" onClick={() => setShowMap(false)} />
                                            </div>
                                            <div className="modal-body">
                                                <div className="row">
                                                    {generateRacks(Number(form.space), form.itemSize, shelfLevels).map((rack) => (
                                                        <div className="col-2 mb-3" key={rack.rackLabel}>
                                                            <div className="border p-1 bg-light text-center rounded">
                                                                <strong>{rack.rackLabel}</strong>
                                                                {rack.levels.map((level) => (
                                                                    <div key={level.level} className="bg-primary text-white mt-1 py-1 rounded">
                                                                        <div style={{ fontSize: "10px" }}>{level.barcode}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-secondary" onClick={() => setShowMap(false)}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            {/* <button type="submit" className="btn btn-primary">Save</button> */}
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? "Saving…" : "Save Warehouse"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddWarehouseModal;


// final code
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../config/config";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const AddWarehouseModal = () => {
//     const [users, setUsers] = useState([]);
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);

//     const [filteredStates, setFilteredStates] = useState([]);
//     const [filteredCities, setFilteredCities] = useState([]);
//     const [showMap, setShowMap] = useState(false);


//     const [form, setForm] = useState({
//         warehouseName: "",
//         space: "",
//         items: "",
//         contactPerson: null,
//         phone: "",
//         email: "",
//         phoneWork: "",
//         streetAddress: "",
//         country: null,
//         state: null,
//         city: null,
//         postalCode: "",
//         status: true,
//     });

//     // Fetch dropdown data
//     useEffect(() => {
//         fetchActiveUsers();
//         fetchCountries();
//         fetchStates();
//         fetchCities();
//     }, []);

//     const fetchActiveUsers = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/user/status/active`);
//             const formatted = res.data.users.map((user) => ({
//                 value: user._id,
//                 label: `${user.firstName} ${user.lastName} (${user.email})`,
//             }));
//             setUsers(formatted);
//         } catch {
//             toast.error("Failed to fetch active users");
//         }
//     };

//     const fetchCountries = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/countries`);
//             const formatted = res.data.map((c) => ({
//                 value: c._id,
//                 label: c.name,
//             }));
//             setCountries(formatted);
//         } catch {
//             toast.error("Failed to fetch countries");
//         }
//     };

//     const fetchStates = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/states`);
//             setStates(res.data);
//         } catch {
//             toast.error("Failed to fetch states");
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/city/cities`);
//             setCities(res.data);
//         } catch {
//             toast.error("Failed to fetch cities");
//         }
//     };

//     // Handlers
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setForm((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (selectedOption, action) => {
//         setForm((prev) => ({ ...prev, [action.name]: selectedOption }));
//     };

//     const handleCountryChange = (option) => {
//         setForm((prev) => ({
//             ...prev,
//             country: option,
//             state: null,
//             city: null,
//         }));

//         const filtered = states
//             .filter((s) => s.country._id === option.value)
//             .map((s) => ({ value: s._id, label: s.stateName }));
//         setFilteredStates(filtered);
//         setFilteredCities([]);
//     };

//     const handleStateChange = (option) => {
//         setForm((prev) => ({
//             ...prev,
//             state: option,
//             city: null,
//         }));

//         const filtered = cities
//             .filter((c) => c.state._id === option.value)
//             .map((c) => ({ value: c._id, label: c.cityName }));
//         setFilteredCities(filtered);
//     };

//     const handleCityChange = (option) =>
//         setForm((prev) => ({ ...prev, city: option }));

//     const handleStatusChange = () =>
//         setForm((prev) => ({ ...prev, status: !prev.status }));

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`${BASE_URL}/api/warehouse`, {
//                 warehouseName: form.warehouseName,
//                 space: form.space,
//                 items: form.items,
//                 contactPerson: form.contactPerson?.value || null,
//                 phone: form.phone,
//                 email: form.email,
//                 phoneWork: form.phoneWork,
//                 streetAddress: form.streetAddress,
//                 country: form.country?.value || null,
//                 state: form.state?.value || null,
//                 city: form.city?.value || null,
//                 postalCode: form.postalCode,
//                 status: form.status,
//             });
//             toast.success("Warehouse added successfully");
//             // Reset or close modal logic
//         } catch (err) {
//             toast.error("Failed to add warehouse");
//         }
//     };

//     return (
//         <div className="modal fade" id="add-warehouse">
//             <div className="modal-dialog modal-lg modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Add Warehouse</h5>
//                         <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//                     </div>
//                     <form onSubmit={handleSubmit}>
//                         <div className="modal-body">
//                             <div className="row">
//                                 <div className="col-md-12 mb-3">
//                                     <label className="form-label fw-semibold">Warehouse Name <span className="text-danger">*</span></label>
//                                     <input type="text" className="form-control" name="warehouseName" value={form.warehouseName} onChange={handleInputChange} />
//                                 </div>
//                                 {/* <div className="col-md-6 mb-3">
//                                     <label className="form-label">Space <span className="text-danger">*</span></label>
//                                     <input type="text" className="form-control" name="space" value={form.space} onChange={handleInputChange} />
//                                 </div> */}
//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Space (sqf) <span className="text-danger">*</span></label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="space"
//                                         value={form.space}
//                                         onChange={handleInputChange}
//                                     />
//                                     <button
//                                         type="button"
//                                         className="btn btn-sm btn-outline-primary mt-2"
//                                         onClick={() => setShowMap(true)}
//                                         disabled={!form.space || isNaN(form.space)}
//                                     >
//                                         View Map
//                                     </button>
//                                 </div>
//                                 {showMap && (
//                                     <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                                         <div className="modal-dialog modal-dialog-centered modal-lg">
//                                             <div className="modal-content">
//                                                 <div className="modal-header">
//                                                     <h5 className="modal-title">Warehouse Rack Layout</h5>
//                                                     <button type="button" className="btn-close" onClick={() => setShowMap(false)} />
//                                                 </div>
//                                                 <div className="modal-body">
//                                                     <div
//                                                         className="p-3 border rounded"
//                                                         style={{
//                                                             height: "400px",
//                                                             backgroundColor: "#fff",
//                                                             overflowY: "auto",
//                                                             display: "grid",
//                                                             gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
//                                                             gap: "8px",
//                                                         }}
//                                                     >
//                                                         {Array.from({ length: Math.floor(form.space / 50) }).map((_, index) => (
//                                                             <div
//                                                                 key={index}
//                                                                 title={`Rack ${String.fromCharCode(65 + Math.floor(index / 10))}${(index % 10) + 1}`}
//                                                                 style={{
//                                                                     backgroundColor: "#d4e2f0",
//                                                                     border: "1px solid #8aaed1",
//                                                                     borderRadius: "4px",
//                                                                     height: "60px",
//                                                                     display: "flex",
//                                                                     alignItems: "center",
//                                                                     justifyContent: "center",
//                                                                     fontSize: "12px",
//                                                                     fontWeight: "500",
//                                                                 }}
//                                                             >
//                                                                 {String.fromCharCode(65 + Math.floor(index / 10))}{(index % 10) + 1}
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                     <p className="mt-3 text-muted small">
//                                                         *Visual warehouse layout — each block represents a rack (~50 sqf). Labeled as A1, A2, ..., B1, etc.
//                                                     </p>
//                                                 </div>
//                                                 <div className="modal-footer">
//                                                     <button className="btn btn-secondary" onClick={() => setShowMap(false)}>
//                                                         Close
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* {showMap && (
//                                     <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//                                         <div className="modal-dialog modal-dialog-centered modal-lg">
//                                             <div className="modal-content">
//                                                 <div className="modal-header">
//                                                     <h5 className="modal-title">Warehouse Map Preview</h5>
//                                                     <button
//                                                         type="button"
//                                                         className="btn-close"
//                                                         onClick={() => setShowMap(false)}
//                                                     />
//                                                 </div>
//                                                 <div className="modal-body">
//                                                     <div
//                                                         className="border"
//                                                         style={{
//                                                             height: "400px",
//                                                             backgroundColor: "#f0f0f0",
//                                                             position: "relative",
//                                                             display: "grid",
//                                                             gridTemplateColumns: `repeat(auto-fit, minmax(50px, 1fr))`,
//                                                             gap: "4px",
//                                                         }}
//                                                     >
//                                                         {Array.from({ length: Math.floor(form.space / 50) }).map((_, index) => (
//                                                             <div
//                                                                 key={index}
//                                                                 style={{
//                                                                     backgroundColor: "#a3c4f3",
//                                                                     border: "1px solid #ccc",
//                                                                     height: "50px",
//                                                                 }}
//                                                             />
//                                                         ))}
//                                                     </div>
//                                                     <p className="mt-3 text-muted small">
//                                                         *This is a basic visual preview — each block represents ~50 sqf of space.
//                                                     </p>
//                                                 </div>
//                                                 <div className="modal-footer">
//                                                     <button className="btn btn-secondary" onClick={() => setShowMap(false)}>
//                                                         Close
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )} */}

//                                 <div className="col-md-6 mb-3">
//                                     <label className="form-label">Items <span className="text-danger">*</span></label>
//                                     <input type="text" className="form-control" name="items" value={form.items} onChange={handleInputChange} />
//                                 </div>
//                             </div>

//                             {/* Contact */}
//                             <div className="mb-3">
//                                 <label className="form-label fw-semibold">Contact Information</label>
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Contact Person</label>
//                                         <Select
//                                             name="contactPerson"
//                                             options={users}
//                                             value={form.contactPerson}
//                                             onChange={(opt) => handleSelectChange(opt, { name: "contactPerson" })}
//                                             placeholder="Search and select a user"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Phone</label>
//                                         <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Email</label>
//                                         <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Phone (Work)</label>
//                                         <input type="text" className="form-control" name="phoneWork" value={form.phoneWork} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Address */}
//                             <div className="mb-3">
//                                 <label className="form-label fw-semibold">Address</label>
//                                 <div className="row">
//                                     <div className="col-md-12 mb-3">
//                                         <label className="form-label">Street Address</label>
//                                         <input type="text" className="form-control" name="streetAddress" value={form.streetAddress} onChange={handleInputChange} />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Country</label>
//                                         <Select
//                                             options={countries}
//                                             value={form.country}
//                                             onChange={handleCountryChange}
//                                             placeholder="Select Country"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">State</label>
//                                         <Select
//                                             options={filteredStates}
//                                             value={form.state}
//                                             onChange={handleStateChange}
//                                             isDisabled={!form.country}
//                                             placeholder="Select State"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">City</label>
//                                         <Select
//                                             options={filteredCities}
//                                             value={form.city}
//                                             onChange={handleCityChange}
//                                             isDisabled={!form.state}
//                                             placeholder="Select City"
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <label className="form-label">Postal Code</label>
//                                         <input type="text" className="form-control" name="postalCode" value={form.postalCode} onChange={handleInputChange} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Status */}
//                             <div className="col-md-12 mb-0">
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <label className="form-label mb-0 fw-semibold">Status</label>
//                                     <div className="form-check form-switch">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             checked={form.status}
//                                             onChange={handleStatusChange}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
//                             <button type="submit" className="btn btn-primary">Next</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddWarehouseModal;

// normal map 
{/* {showMap && (
                                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Warehouse Layout</h5>
                                                <button type="button" className="btn-close" onClick={() => setShowMap(false)}></button>
                                            </div>
                                            <div className="modal-body">
                                                <div
                                                    className="p-3 border rounded"
                                                    style={{
                                                        height: "400px",
                                                        backgroundColor: "#fff",
                                                        overflowY: "auto",
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {Array.from({ length: Math.floor(form.space / 50) }).map((_, index) => (
                                                        <div
                                                            key={index}
                                                            title={`Rack ${String.fromCharCode(65 + Math.floor(index / 10))}${(index % 10) + 1}`}
                                                            style={{
                                                                backgroundColor: "#d4e2f0",
                                                                border: "1px solid #8aaed1",
                                                                borderRadius: "4px",
                                                                height: "60px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                            }}
                                                        >
                                                            {String.fromCharCode(65 + Math.floor(index / 10))}{(index % 10) + 1}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="mt-3 text-muted small">
                                                    *Each block represents a 50 sqf rack.
                                                </p>
                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-outline-primary" onClick={() => window.print()}>
                                                    🖰 Print Layout
                                                </button>
                                                <button className="btn btn-secondary" onClick={() => setShowMap(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )} */}