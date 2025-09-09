import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../../config/config';
import { toast } from 'react-toastify';
// import "../../../components/features/customers/AddCustomer.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Select from "react-select";
import { TbCopy } from "react-icons/tb";

const AddCustomerModal = ({ onClose, onSuccess }) => {
  const fileInputRef = React.useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch countries, states, cities on mount
  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

const token = localStorage.getItem("token");

  
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

  // File upload handler
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
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
        shipping: {
          ...form.shipping,
          country: form.shipping.country?.value || '',
          state: form.shipping.state?.value || '',
          city: form.shipping.city?.value || '',
        },
        bank: form.bank,
        status: form.status,
      };
      // If image is selected, use FormData
      if (selectedImage) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        formData.append('image', selectedImage);
        await axios.post(`${BASE_URL}/api/customers`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,

           },
        });
      } else {
        await axios.post(`${BASE_URL}/api/customers`, payload,{
          headers: {
        Authorization: `Bearer ${token}`,
      },
        });
      }
      toast.success('Customer created successfully!');
      setFormSubmitted(true);
      setForm({
        name: '', email: '', phone: '', currency: '', website: '', notes: '',
        billing: { name: '', address1: '', address2: '', country: null, state: null, city: null, postalCode: '', pincode: '' },
        shipping: { name: '', address1: '', address2: '', country: '', state: '', city: '', pincode: '' },
        bank: { bankName: '', branch: '', accountHolder: '', accountNumber: '', ifsc: '' },
        status: true,
      });
      setSelectedImage(null);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast.error('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="modal fade show "
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
              onClick={onClose}
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
            <button
              className="drag-upload-btn btn btn-sm btn-primary position-relative mb-2"
              onClick={handleUploadClick}
              type="button"
            >
              <i className="isax isax-image me-1" />Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
            {selectedImage && (
              <span className="text-gray-9">Selected: {selectedImage.name}</span>
            )}
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
              <button type="button" onClick={handleCopyFromBilling} className="d-inline-flex align-items-center text-primary text-decoration-underline fs-13 btn btn-link p-0" style={{boxShadow:'none'}}>
                <TbCopy  className="me-1" />Copy From Billing
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

export default AddCustomerModal;


// import React, { useState } from "react";
// // import "./AddCustomer.css";
// import "../../../styles/customer/customer.css";
// import "../../../components/features/customers/AddCustomer.css";
// // import "./AddCustomerModal.css"; // modal-specific styles
// import { IoIosArrowForward } from "react-icons/io";
// import { Link } from "react-router-dom";

// function AddCustomerModal({ onClose }) {
//   const [formSubmitted, setFormSubmitted] = useState(false);

//   const handleSave = () => {
//     setFormSubmitted(true);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close-btn" onClick={onClose}>×</button>
//         <div className="add-customer-container">
//           <div style={{ display: "flex", marginBottom: "20px" }}>
//             <span className="add-breadcrumb-grey">Customer</span>
//             <span className="add-breadcrumb-arrow">
//               <IoIosArrowForward />
//             </span>
//             <span className="add-breadcrumb-dark">Add Customer</span>
//           </div>

//           <div className="add-business-basic">
//             {formSubmitted && (
//               <div
//                 style={{
//                   marginTop: "16px",
//                   marginBottom: "20px",
//                   width: "100%",
//                   border: "1px solid #007B42",
//                   backgroundColor: "#BAFFDF",
//                   borderRadius: "8px",
//                   padding: "10px 16px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   maxWidth: "500px",
//                   marginInline: "auto",
//                 }}
//               >
//                 🎉 Great! You have successfully created a customer.
//               </div>
//             )}

//             <div className="add-form-wrapper">
//               {/* Basic Details */}
//               <div className="add-form-card">
//                 <h3>Basic Details</h3>
//                 <div className="add-form-group">
//                   <label>Customer</label>
//                   <input type="text" placeholder="Enter Name" />
//                 </div>
//                 <div className="add-form-row">
//                   <div className="add-form-group">
//                     <label>Phone Number</label>
//                     <input type="text" placeholder="Enter No." />
//                   </div>
//                   <div className="add-form-group">
//                     <label>Email Address</label>
//                     <input type="email" placeholder="Enter Email" />
//                   </div>
//                 </div>
//               </div>

//               <div className="add-form-card">
//                 <h3>Business Address</h3>
//                 <div className="add-form-group">
//                   <label>Address Line 1</label>
//                   <textarea placeholder="Type here" rows={3}></textarea>
//                 </div>

//                 <div className="add-form-row">
//                   <div className="add-form-group">
//                     <label>State</label>
//                     <select style={{ color: "#676767" }}>
//                       <option style={{ color: "#676767" }}>Select State</option>
//                     </select>
//                   </div>

//                   <div className="add-form-group">
//                     <label>City</label>
//                     <select style={{ color: "#676767" }}>
//                       <option style={{ color: "#676767" }}>Select City</option>
//                     </select>
//                   </div>

//                   <div className="add-form-group">
//                     <label>Pin Code</label>
//                     <input
//                       type="text"
//                       placeholder="Enter Here"
//                       className="add-custom-input"
//                       style={{ color: "#676767" }}
//                     />
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     width: "100%",
//                     gap: "24px",
//                     marginTop: "24px",
//                   }}
//                 >
//                   {!formSubmitted ? (
//                     <>
//                       <button className="add-draft-btn">Draft</button>
//                       <button className="add-save-btn" onClick={handleSave}>
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <Link to="/AllCustomer" className="add-done-btn">
//                       Done
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddCustomerModal;
