import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../../config/config';
import { toast } from 'react-toastify';
// import "../../../components/features/customers/AddCustomer.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Select from "react-select";

const EditCustomerModal = ({ customer, onClose, onSuccess }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currency: '',
    website: '',
    notes: '',
    billing: {
      name: '',
      address1: '',
      address2: '',
      country: null,
      state: null,
      city: null,
      postalCode: '',
      pincode: '',
    },
    shipping: {
      name: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
    },
    bank: {
      bankName: '',
      branch: '',
      accountHolder: '',
      accountNumber: '',
      ifsc: '',
    },
    status: true,
  });

  // Prefill form when customer prop changes
  useEffect(() => {
    if (customer) {
      setForm({
        ...customer,
        billing: customer.billing || {
          name: '', address1: '', address2: '', country: null, state: null, city: null, postalCode: '', pincode: ''
        },
        shipping: customer.shipping || {
          name: '', address1: '', address2: '', country: '', state: '', city: '', pincode: ''
        },
        bank: customer.bank || {
          bankName: '', branch: '', accountHolder: '', accountNumber: '', ifsc: ''
        },
        status: typeof customer.status === 'boolean' ? customer.status : true,
      });
    }
  }, [customer]);

  // Fetch countries, states, cities on mount
  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);



  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/countries`,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      const formatted = res.data.map((c) => ({ value: c._id, label: c.name }));
      setCountries(formatted);
    } catch {
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
    } catch {
      toast.error("Failed to fetch states");
    }
  };
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/city/cities`,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setCities(res.data);
    } catch {
      toast.error("Failed to fetch cities");
    }
  };


  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, billing: { ...prev.billing, [name]: value } }));
  };
  const [filteredShippingStates, setFilteredShippingStates] = useState([]);
  const [filteredShippingCities, setFilteredShippingCities] = useState([]);
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, shipping: { ...prev.shipping, [name]: value } }));
  };
  // Copy From Billing handler
  const handleCopyFromBilling = () => {
    setForm((prev) => ({
      ...prev,
      shipping: {
        name: prev.billing.name,
        address1: prev.billing.address1,
        address2: prev.billing.address2,
        country: prev.billing.country,
        state: prev.billing.state,
        city: prev.billing.city,
        pincode: prev.billing.pincode,
      },
    }));
    // Set filtered states/cities for shipping
    if (prev.billing.country) {
      const filteredStates = states.filter((s) => s.country._id === prev.billing.country.value).map((s) => ({ value: s._id, label: s.stateName }));
      setFilteredShippingStates(filteredStates);
    }
    if (prev.billing.state) {
      const filteredCities = cities.filter((c) => c.state._id === prev.billing.state.value).map((c) => ({ value: c._id, label: c.cityName }));
      setFilteredShippingCities(filteredCities);
    }
  };
  const handleShippingCountryChange = (option) => {
    setForm((prev) => ({ ...prev, shipping: { ...prev.shipping, country: option, state: null, city: null } }));
    const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
    setFilteredShippingStates(filtered);
    setFilteredShippingCities([]);
  };
  const handleShippingStateChange = (option) => {
    setForm((prev) => ({ ...prev, shipping: { ...prev.shipping, state: option, city: null } }));
    const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
    setFilteredShippingCities(filtered);
  };
  const handleShippingCityChange = (option) => {
    setForm((prev) => ({ ...prev, shipping: { ...prev.shipping, city: option } }));
  };
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, bank: { ...prev.bank, [name]: value } }));
  };
  const handleCountryChange = (option) => {
    setForm((prev) => ({ ...prev, billing: { ...prev.billing, country: option, state: null, city: null } }));
    const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
    setFilteredStates(filtered);
    setFilteredCities([]);
  };
  const handleStateChange = (option) => {
    setForm((prev) => ({ ...prev, billing: { ...prev.billing, state: option, city: null } }));
    const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
    setFilteredCities(filtered);
  };
  const handleCityChange = (option) => {
    setForm((prev) => ({ ...prev, billing: { ...prev.billing, city: option } }));
  };
  const handleStatusChange = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload for API
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        currency: form.currency,
        website: form.website,
        notes: form.notes,
        billing: {
          ...form.billing,
          country: form.billing.country?.value || '',
          state: form.billing.state?.value || '',
          city: form.billing.city?.value || '',
        },
        shipping: form.shipping,
        bank: form.bank,
        status: form.status,
      };
      await axios.put(`${BASE_URL}/api/customers/${customer._id}`, payload,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      toast.success('Customer updated successfully!');
      setFormSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="modal fade show modal-overlay"
      id="add-customer"
      tabIndex="-1"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <div className="modal-header">
            <div className="page-title">
              <h4>Add Customer</h4>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => document.getElementById("add-customer").style.display = "none"}
            ></button>
          </div>

          <div className="modal-body">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">Add Customer</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <h6 className="text-gray-9 fw-bold mb-2 d-flex">Basic Details</h6>
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-xxl border border-dashed bg-light me-3 flex-shrink-0">
                        <i className="isax isax-image text-primary fs-24" />
                      </div>
                      <div className="d-inline-flex flex-column align-items-start">
                        <div className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2">
                          <i className="isax isax-image me-1" />Upload Image
                          <input type="file" className="form-control image-sign" multiple />
                        </div>
                        <span className="text-gray-9">JPG or PNG format, not exceeding 5MB.</span>
                      </div>
                    </div>
                  </div>
                  <div className="row gx-3">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Name <span className="text-danger ms-1">*</span></label>
                        <input type="text" className="form-control" name="name" value={form.name} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger ms-1">*</span></label>
                        <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number <span className="text-danger ms-1">*</span></label>
                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Currency</label>
                        <select className="select" name="currency" value={form.currency} onChange={handleInputChange} required>
                          <option value="">Select</option>
                          <option value="Dollar">Dollar</option>
                          <option value="Euro">Euro</option>
                          <option value="Yen">Yen</option>
                          <option value="Pound">Pound</option>
                          <option value="Rupee">Rupee</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Website</label>
                        <input type="text" className="form-control" name="website" value={form.website} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <input type="text" className="form-control" name="notes" value={form.notes} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                  <div className="border-top my-2">
                    <div className="row gx-5">
                      <div className="col-md-6 ">
                        <h6 className="mb-3 pt-4">Billing Address</h6>
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input type="text" className="form-control" name="name" value={form.billing.name} onChange={handleBillingChange} />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 1</label>
                              <input type="text" className="form-control" name="address1" value={form.billing.address1} onChange={handleBillingChange} />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 2</label>
                              <input type="text" className="form-control" name="address2" value={form.billing.address2} onChange={handleBillingChange} />
                            </div>
                          </div>
                          {/* Address Info */}
                          <div className="mb-3">
                            {/* <label className="form-label fw-semibold">Address</label> */}
                            <div className="row">

                              <div className="col-md-6 mb-3">
                                <label className="form-label">Country</label>
                                <Select options={countries} value={form.billing.country} onChange={handleCountryChange} placeholder="Select Country" />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">State</label>
                                <Select options={filteredStates} value={form.billing.state} onChange={handleStateChange} isDisabled={!form.billing.country} placeholder="Select State" />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">City</label>
                                <Select options={filteredCities} value={form.billing.city} onChange={handleCityChange} isDisabled={!form.billing.state} placeholder="Select City" />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label className="form-label">Postal Code</label>
                                <input type="text" className="form-control" name="postalCode" value={form.billing.postalCode} onChange={handleBillingChange} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-between mb-3 pt-4">
                          <h6>Shipping Address</h6>
                          <button type="button" onClick={handleCopyFromBilling} className="d-inline-flex align-items-center text-primary text-decoration-underline fs-13 btn btn-link p-0" style={{ boxShadow: 'none' }}>
                            <i className="isax isax-document-copy me-1" />Copy From Billing
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input type="text" className="form-control" name="name" value={form.shipping.name} onChange={handleShippingChange} />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 1</label>
                              <input type="text" className="form-control" name="address1" value={form.shipping.address1} onChange={handleShippingChange} />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="mb-3">
                              <label className="form-label">Address Line 2</label>
                              <input type="text" className="form-control" name="address2" value={form.shipping.address2} onChange={handleShippingChange} />
                            </div>
                          </div>
                          {/* Address Info for Shipping */}
                          <div className="col-md-6 mb-3">

                            <label className="form-label">Country</label>
                            <Select options={countries} value={form.shipping.country} onChange={handleShippingCountryChange} placeholder="Select Country" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">State</label>
                            <Select options={filteredShippingStates} value={form.shipping.state} onChange={handleShippingStateChange} isDisabled={!form.shipping.country} placeholder="Select State" />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">City</label>
                            <Select options={filteredShippingCities} value={form.shipping.city} onChange={handleShippingCityChange} isDisabled={!form.shipping.state} placeholder="Select City" />
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Pincode</label>
                              <input type="text" className="form-control" name="pincode" value={form.shipping.pincode} onChange={handleShippingChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-top my-2">
                    <h6 className="mb-3 pt-4">Banking Details</h6>
                    <div className="row gx-3">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <input type="text" className="form-control" name="bankName" value={form.bank.bankName} onChange={handleBankChange} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Branch</label>
                          <input type="text" className="form-control" name="branch" value={form.bank.branch} onChange={handleBankChange} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Holder</label>
                          <input type="text" className="form-control" name="accountHolder" value={form.bank.accountHolder} onChange={handleBankChange} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Number</label>
                          <input type="text" className="form-control" name="accountNumber" value={form.bank.accountNumber} onChange={handleBankChange} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">IFSC</label>
                          <input type="text" className="form-control" name="ifsc" value={form.bank.ifsc} onChange={handleBankChange} />
                        </div>
                      </div>

                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" checked={form.status} onChange={() => setForm((prev) =>
                          ({ ...prev, status: !prev.status }))} />
                        <label className="form-check-label">Status</label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-4 border-top">
                    <button type="button" className="btn btn-outline-white" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create New'}</button>
                  </div>
                </form>
              </div>{/* end card body */}
            </div>

          </div> {/* modal-body end */}
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;