// ============================
// FRONTEND: EditWarehouseModal.jsx
// ============================
import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../config/config";

const EditWarehouseModal = ({ selectedWarehouseId, onClose, onUpdated }) => {
    const [form, setForm] = useState({
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
        status: true,
    });

    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    useEffect(() => {
        if (selectedWarehouseId) {
            fetchFormData();
        }
        fetchUsers();
        fetchCountries();
        fetchStates();
        fetchCities();
    }, [selectedWarehouseId]);

    const fetchFormData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/warehouse/${selectedWarehouseId}`);
            const data = res.data.warehouse;
            setForm({
                ...data,
                contactPerson: data.contactPerson
                    ? { value: data.contactPerson._id, label: `${data.contactPerson.firstName} ${data.contactPerson.lastName}` }
                    : null,
                country: data.country ? { value: data.country._id, label: data.country.name } : null,
                state: data.state ? { value: data.state._id, label: data.state.stateName } : null,
                city: data.city ? { value: data.city._id, label: data.city.cityName } : null,
            });
            setFilteredStates(states.filter(s => s.country._id === data.country?._id).map(s => ({ value: s._id, label: s.stateName })));
            setFilteredCities(cities.filter(c => c.state._id === data.state?._id).map(c => ({ value: c._id, label: c.cityName })));
        } catch (err) {
            toast.error("Failed to load warehouse data");
        }
    };

    const fetchUsers = async () => {
        const res = await axios.get(`${BASE_URL}/api/user/status/active`);
        setUsers(res.data.users.map(u => ({ value: u._id, label: `${u.firstName} ${u.lastName}` })));
    };

    const fetchCountries = async () => {
        const res = await axios.get(`${BASE_URL}/api/countries`);
        setCountries(res.data.map(c => ({ value: c._id, label: c.name })));
    };

    const fetchStates = async () => {
        const res = await axios.get(`${BASE_URL}/api/states`);
        setStates(res.data);
    };

    const fetchCities = async () => {
        const res = await axios.get(`${BASE_URL}/api/city/cities`);
        setCities(res.data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, action) => {
        setForm(prev => ({ ...prev, [action.name]: selectedOption }));
    };

    const handleCountryChange = (option) => {
        setForm(prev => ({ ...prev, country: option, state: null, city: null }));
        setFilteredStates(states.filter(s => s.country._id === option.value).map(s => ({ value: s._id, label: s.stateName })));
        setFilteredCities([]);
    };

    const handleStateChange = (option) => {
        setForm(prev => ({ ...prev, state: option, city: null }));
        setFilteredCities(cities.filter(c => c.state._id === option.value).map(c => ({ value: c._id, label: c.cityName })));
    };

    const handleCityChange = (option) => {
        setForm(prev => ({ ...prev, city: option }));
    };

    const handleStatusChange = () => {
        setForm(prev => ({ ...prev, status: !prev.status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/warehouse/${selectedWarehouseId}`, {
                ...form,
                contactPerson: form.contactPerson?.value,
                country: form.country?.value,
                state: form.state?.value,
                city: form.city?.value,
            });
            toast.success("Warehouse updated successfully");
            onUpdated();
            onClose();
        } catch (err) {
            toast.error("Failed to update warehouse");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/warehouse/${selectedWarehouseId}`);
            toast.success("Warehouse deleted successfully");
            onUpdated();
            onClose();
        } catch (err) {
            toast.error("Failed to delete warehouse");
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Warehouse</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {/* Same fields as AddWarehouseModal, prefilled from form state */}
                            <div className="mb-3">
                                <label className="form-label">Warehouse Name</label>
                                <input type="text" className="form-control" name="warehouseName" value={form.warehouseName} onChange={handleInputChange} />
                            </div>
                            {/* ... other form fields like space, items, phone, etc. */}
                            <div className="mb-3">
                                <label className="form-label">Contact Person</label>
                                <Select name="contactPerson" options={users} value={form.contactPerson} onChange={handleSelectChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Country</label>
                                <Select value={form.country} options={countries} onChange={handleCountryChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">State</label>
                                <Select value={form.state} options={filteredStates} onChange={handleStateChange} isDisabled={!form.country} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">City</label>
                                <Select value={form.city} options={filteredCities} onChange={handleCityChange} isDisabled={!form.state} />
                            </div>
                            {/* Status toggle */}
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" checked={form.status} onChange={handleStatusChange} />
                                <label className="form-check-label">Status</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger me-auto" onClick={handleDelete}>Delete</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditWarehouseModal;
