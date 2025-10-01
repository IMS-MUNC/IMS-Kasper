import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Select from "react-select";
import { toast } from 'react-toastify';
import BASE_URL from '../../config/config';
import { TbCirclePlus, TbCopy } from "react-icons/tb";

const AddSupplierModals = ({ onClose, onSuccess, editSupplier }) => {
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessType: '',
    companyName: '',
    companyWebsite: '',
    gstin: '',
    email: '',
    phone: '',
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
      country: null,
      state: null,
      city: null,
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

  useEffect(() => {
    if (editSupplier) {
      setForm({
        firstName: editSupplier.firstName || '',
        lastName: editSupplier.lastName || '',
        companyName: editSupplier.companyName || '',
        companyWebsite: editSupplier.companyWebsite || '',
        businessType: editSupplier.businessType || '',
        gstin: editSupplier.gstin || '',
        email: editSupplier.email || '',
        phone: editSupplier.phone || '',
        billing: editSupplier.billing || {
          name: '',
          address1: '',
          address2: '',
          country: null,
          state: null,
          city: null,
          postalCode: '',
          pincode: '',
        },
        shipping: editSupplier.shipping || {
          name: '',
          address1: '',
          address2: '',
          country: null,
          state: null,
          city: null,
          pincode: '',
        },
        bank: editSupplier.bank || {
          bankName: '',
          branch: '',
          accountHolder: '',
          accountNumber: '',
          ifsc: '',
        },
        status: typeof editSupplier.status === 'boolean' ? editSupplier.status : true,
      });
      if (editSupplier.images) {
        setSelectedImages(editSupplier.images.map(img => ({
          file: null,
          preview: img.url
        })));
      }
    }
  }, [editSupplier]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredShippingStates, setFilteredShippingStates] = useState([]);
  const [filteredShippingCities, setFilteredShippingCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gstDetails, setGstDetails] = useState(null);
  const [gstLoading, setGstLoading] = useState(false);
  const [gstError, setGstError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const token = localStorage.getItem("token");

  const businessTypeOptions = [
    { value: 'Manufacturer', label: 'Manufacturer' },
    { value: 'Wholesaler', label: 'Wholesaler' },
    { value: 'Distributor', label: 'Distributor' }
  ];

  // Regex patterns for validation
  const regexPatterns = {
    firstName: /^[a-zA-Z\s]{1,50}$/,
    lastName: /^[a-zA-Z\s]{1,50}$/,
    companyName: /^[a-zA-Z0-9\s&.-]{1,100}$/,
    companyWebsite: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/,
    postalCode: /^\d{6}$/,
    
    pincode: /^\d{6}$/,
    bankName: /^[a-zA-Z0-9\s&.-]{1,100}$/,
    branch: /^[a-zA-Z0-9\s&.-]{1,100}$/,
    accountHolder: /^[a-zA-Z\s]{1,100}$/,
    accountNumber: /^\d{9,18}$/,
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  };

  // Sanitization function
  const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().replace(/<[^>]*>/g, '').substring(0, 500); // Trim, remove HTML tags, limit length
  };

  // Validation function
  const validateField = (name, value) => {
    if (!value) return true; // Empty is valid for optional fields
    if (!regexPatterns[name]) return true; // No regex for this field
    return regexPatterns[name].test(value);
  };

  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities();
  }, []);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
    const sanitizedValue = sanitizeInput(value);
    setForm((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Validate and set errors
    if (!validateField(name, sanitizedValue)) {
      setValidationErrors((prev) => ({ ...prev, [name]: `Invalid ${name} format` }));
    } else {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (section, name, option) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: option,
        ...(name === 'country' ? { state: null, city: null } : {}),
        ...(name === 'state' ? { city: null } : {}),
      }
    }));
    if (section === 'billing') {
      if (name === 'country') {
        const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
        setFilteredStates(filtered);
        setFilteredCities([]);
      }
      if (name === 'state') {
        const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
        setFilteredCities(filtered);
      }
    }
    if (section === 'shipping') {
      if (name === 'country') {
        const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
        setFilteredShippingStates(filtered);
        setFilteredShippingCities([]);
      }
      if (name === 'state') {
        const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
        setFilteredShippingCities(filtered);
      }
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setForm((prev) => ({ ...prev, bank: { ...prev.bank, [name]: sanitizedValue } }));

    // Validate and set errors
    if (!validateField(name, sanitizedValue)) {
      setValidationErrors((prev) => ({ ...prev, [name]: `Invalid ${name} format` }));
    } else {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // GSTIN verification
  const handleVerifyGSTIN = async () => {
    setGstLoading(true);
    setGstError('');
    try {
      const res = await axios.post(`${BASE_URL}/api/suppliers/verify-gstin`, {

        gstin: form.gstin,
      },
        {
        headers: {
        Authorization: `Bearer ${token}`,
      },
        });
      const data = res.data;
      if (data.valid) {
        setForm(prev => ({
          ...prev,
          businessType: data.businessType || prev.businessType,
          billing: {
            ...prev.billing,
            address1: data.address || prev.billing.address1,
            state: states.find(s => s.stateName.toLowerCase() === data.state?.toLowerCase()) ? { value: states.find(s => s.stateName.toLowerCase() === data.state?.toLowerCase())._id, label: data.state } : prev.billing.state,
          }
        }));
        setGstDetails({
          name: data.name,
          address: data.address,
          state: data.state,
          businessType: data.businessType,
          valid: true
        });
      }
    } catch (err) {
      setGstError('GSTIN verification failed');
      setGstDetails(null);
    } finally {
      setGstLoading(false);
    }
  };

  // File upload handlers
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

    // const handleFileChange = (e) => {
    //   const files = Array.from(e.target.files);
    //   // check if any file exceeds 1MB
    //   const oversizedFile = files.find((file) => file.size > 1 * 1024 * 1024);
    //   if (oversizedFile) {
    //     toast.error(`File ${oversizedFile.name} exceeds 1MB size limit.`);
    //     e.target.value = null; // reset input
    //     return;
    //   }
    //   setSelectedImages(files);
    // }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
     const oversizedFile = files.find((file) => file.size > 1 * 1024 * 1024);
    const imagePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
  
     if (oversizedFile) {
        toast.error(`File ${oversizedFile.name} exceeds 1MB size limit.`);
        e.target.value = null; // reset input
        return;
      }
      setSelectedImages(files);
      setSelectedImages(imagePreviews);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Copy billing to shipping
  const handleCopyFromBilling = () => {
    setForm((prev) => ({
      ...prev,
      shipping: { ...prev.billing }
    }));
    if (prev.billing.country) {
      const filteredStates = states.filter((s) => s.country._id === prev.billing.country.value).map((s) => ({ value: s._id, label: s.stateName }));
      setFilteredShippingStates(filteredStates);
    }
    if (prev.billing.state) {
      const filteredCities = cities.filter((c) => c.state._id === prev.billing.state.value).map((c) => ({ value: c._id, label: c.cityName }));
      setFilteredShippingCities(filteredCities);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'companyName', 'companyWebsite', 'gstin', 'email', 'phone'];

    // Check required fields
    requiredFields.forEach(field => {
      if (!form[field] || form[field].trim() === '') {
        errors[field] = `${field} is required`;
      }
    });

    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const sanitizedValue = sanitizeInput(value);
        if (!validateField(key, sanitizedValue)) {
          errors[key] = `Invalid ${key} format`;
        }
      } else if (typeof value === 'object' && value !== null) {
        // For nested objects like billing, shipping, bank
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string') {
            const sanitizedSubValue = sanitizeInput(subValue);
            if (!validateField(subKey, sanitizedSubValue)) {
              errors[subKey] = `Invalid ${subKey} format`;
            }
          }
        });
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix validation errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        billing: {
          ...form.billing,
          country: form.billing.country?.value || null,
          state: form.billing.state?.value || null,
          city: form.billing.city?.value || null,
        },
        shipping: {
          ...form.shipping,
          country: form.shipping.country?.value || null,
          state: form.shipping.state?.value || null,
          city: form.shipping.city?.value || null,
        }
      };

      if (selectedImages.length > 0 && selectedImages.some(img => img.file)) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (key === 'billing' || key === 'shipping') return; // skip these here
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        // Append billing and shipping once
        formData.append('billing', JSON.stringify(payload.billing));
        formData.append('shipping', JSON.stringify(payload.shipping));
        selectedImages.forEach(img => {
          if (img.file) formData.append('images', img.file);
        });
        if (editSupplier && editSupplier._id) {
          await axios.put(`${BASE_URL}/api/suppliers/${editSupplier._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' ,
                      Authorization: `Bearer ${token}`,

            },
          });
        } else {
          await axios.post(`${BASE_URL}/api/suppliers`, formData, {
            headers: { 'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}`,

             },
          });
        }
      } else {
        if (editSupplier && editSupplier._id) {
          await axios.put(`${BASE_URL}/api/suppliers/${editSupplier._id}`, payload,{
            headers: {
            Authorization: `Bearer ${token}`,
          },
          });
        } else {
          await axios.post(`${BASE_URL}/api/suppliers`, payload,{
            headers: {
            Authorization: `Bearer ${token}`,
          },
          });
        }
      }
      toast.success(editSupplier ? 'Supplier updated successfully!' : 'Supplier created successfully!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast.error(editSupplier ? 'Failed to update supplier' : 'Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" id="add-supplier" tabIndex="-1"
   style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} aria-modal="true" role="dialog">
   <div className="modal-dialog modal-dialog-centered modal-lg">
     <div className="modal-content">
       <div className="modal-header">
         <h4>{editSupplier ? 'Edit Supplier' : 'Add Supplier'}</h4>
         <button type="button" className="close" aria-label="Close" onClick={onClose}>
           <span aria-hidden="true">×</span>
         </button>
       </div>

       {/* Main Form */}
       <form onSubmit={handleSubmit}>
         <div className="modal-body">
           {/* Image Upload */}
           {/* <div className="mb-3">
             <label className="form-label">Profile Images</label>
             <input type="file" ref={fileInputRef} multiple style={{ display: 'none' }} onChange={handleFileChange}
               accept="image/*" />
             <div className="image-uploads" onClick={handleUploadClick}
               style={{ cursor: 'pointer', border: '1px dashed gray', padding: '20px', textAlign: 'center' }}>
               <h5>Click to Upload</h5>
             </div>
             <div className="mt-3 d-flex flex-wrap gap-3">
               {selectedImages.map((img, index) => (
               <div key={index} className="position-relative">
                 <img src={img.preview} alt="Preview"
                   style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                 {img.file && (
                 <button type="button" onClick={()=> removeImage(index)}
                   style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                   >
                   &times;
                 </button>
                 )}
               </div>
               ))}
             </div>
           </div> */}

           <div className="col-lg-12">
             <div className="new-employee-field">
               <div className="profile-pic-upload mb-2">
                 <div className="profile-pic">
                   {selectedImages.map((img, index) => (
                   <div key={index} className="position-relative">
                     <img src={img.preview} alt="Preview" style={{
                width: '100px',
                height: '100px',
                // objectFit: 'cover',
                borderRadius: '8px'
              }} />
                     {img.file && (
                     <button type="button" onClick={()=> removeImage(index)}
                       style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                       >
                       &times;
                     </button>
                     )}
                   </div>
                   ))}

                   {/* Show "Add Image" only when no image is uploaded */}
                   {selectedImages.length === 0 && (
                   <span>
                     <TbCirclePlus className="plus-down-add" /> Add Image
                   </span>
                   )}
                 </div>

                 <div className="mb-0">
                   <div className="image-upload mb-2" style={{backgroundColor:"#007aff"}}>
                     <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                     <div className="image-uploads" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                       <h4>Upload Image</h4>
                     </div>
                   </div>
                   <p>JPEG, PNG up to 1 MB</p>
                 </div>
               </div>
             </div>
           </div>

           <div className="row">
             <div className="col-md-6 mb-3">
               <label>First Name</label><span className="text-danger ms-1">*</span>
               <input type="text" name="firstName" className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`} value={form.firstName}
                 onChange={handleInputChange} />
               {validationErrors.firstName && <div className="invalid-feedback">{validationErrors.firstName}</div>}
             </div>
             <div className="col-md-6 mb-3">
               <label>Last Name</label> <span className="text-danger ms-1">*</span>
               <input type="text" name="lastName" className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`} value={form.lastName}
                 onChange={handleInputChange} />
               {validationErrors.lastName && <div className="invalid-feedback">{validationErrors.lastName}</div>}
             </div>
             <div className="col-md-6 mb-3">
               <label>Company Name</label>  <span className="text-danger ms-1">*</span>
               <input type="text" name="companyName" className={`form-control ${validationErrors.companyName ? 'is-invalid' : ''}`} value={form.companyName}
                 onChange={handleInputChange} />
               {validationErrors.companyName && <div className="invalid-feedback">{validationErrors.companyName}</div>}
             </div>
             <div className="col-md-6 mb-3">
               <label>Company Website</label>  <span className="text-danger ms-1">*</span>
               <input type="text" name="companyWebsite" className={`form-control ${validationErrors.companyWebsite ? 'is-invalid' : ''}`} value={form.companyWebsite}
                 onChange={handleInputChange} />
               {validationErrors.companyWebsite && <div className="invalid-feedback">{validationErrors.companyWebsite}</div>}
             </div>

             <div className="col-md-6 mb-3">
               <label>Business Type</label>  <span className="text-danger ms-1">*</span>
               <Select options={businessTypeOptions} value={businessTypeOptions.find(opt=> opt.value ===
                 form.businessType)}
                 onChange={option => handleInputChange({ target: { name: 'businessType', value: option.value } })}
                 placeholder="Select Type"
                 />
             </div>
             <div className="col-md-6 mb-3">
               <label>GSTIN</label>  <span className="text-danger ms-1">*</span>
               <div className="d-flex gap-2">
                 <input type="text" name="gstin" className={`form-control ${validationErrors.gstin ? 'is-invalid' : ''}`} value={form.gstin}
                   onChange={handleInputChange} />
                 <button type="button" className="btn btn-outline-primary" onClick={handleVerifyGSTIN}
                   disabled={!form.gstin || gstLoading || validationErrors.gstin}>
                   {gstLoading ? 'Verifying...' : 'Verify'}
                 </button>
               </div>
               {validationErrors.gstin && <div className="invalid-feedback">{validationErrors.gstin}</div>}
               {gstError && <small className="text-danger">{gstError}</small>}
               {gstDetails?.valid && (
               <div className="alert alert-success mt-2">
                 <div><strong>Name:</strong> {gstDetails.name}</div>
                 <div><strong>Address:</strong> {gstDetails.address}</div>
                 <div><strong>State:</strong> {gstDetails.state}</div>
                 <div><strong>Business Type:</strong> {gstDetails.businessType}</div>
               </div>
               )}
             </div>
             <div className="col-md-6 mb-3">
               <label>Email</label>  <span className="text-danger ms-1">*</span>
               <input type="email" name="email" className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} value={form.email}
                 onChange={handleInputChange} />
               {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
             </div>
             <div className="col-md-6 mb-3">
               <label>Phone</label>  <span className="text-danger ms-1">*</span>
               <input type="text" name="phone" className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`} value={form.phone}
                 onChange={handleInputChange} />
               {validationErrors.phone && <div className="invalid-feedback">{validationErrors.phone}</div>}
             </div>
             {/* Billing Address */}
             <div className="border-top my-2">
               <div className="row gx-5">
                 <div className="col-md-6 ">
                   <h6 className="mb-3 pt-4">Billing Address</h6>
                   <div className="row">
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Name</label>
                         <input type="text" className="form-control" name="name" value={form.billing.name} onChange={e=>
                         setForm(prev => ({ ...prev, billing: { ...prev.billing, name: e.target.value } }))} />
                       </div>
                     </div>
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Address Line 1</label>
                         <input type="text" className="form-control" name="address1" value={form.billing.address1}
                           onChange={e=> setForm(prev => ({ ...prev, billing: { ...prev.billing, address1:
                         e.target.value } }))} />
                       </div>
                     </div>
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Address Line 2</label>
                         <input type="text" className="form-control" name="address2" value={form.billing.address2}
                           onChange={e=> setForm(prev => ({ ...prev, billing: { ...prev.billing, address2:
                         e.target.value } }))} />
                       </div>
                     </div>
                     <div className="mb-3">
                       <div className="row">
                         <div className="col-md-6 mb-3">
                           <label className="form-label">Country</label>
                           <Select options={countries} value={form.billing.country} onChange={option=>
                             handleSelectChange('billing', 'country', option)} placeholder="Select Country" />
                         </div>
                         <div className="col-md-6 mb-3">
                           <label className="form-label">State</label>
                           <Select options={filteredStates} value={form.billing.state} onChange={option=>
                             handleSelectChange('billing', 'state', option)} isDisabled={!form.billing.country}
                             placeholder="Select State" />
                         </div>
                         <div className="col-md-6 mb-3">
                           <label className="form-label">City</label>
                           <Select options={filteredCities} value={form.billing.city} onChange={option=>
                             handleSelectChange('billing', 'city', option)} isDisabled={!form.billing.state}
                             placeholder="Select City" />
                         </div>
                         <div className="col-md-6 mb-3">
                           <label className="form-label">Postal Code</label>
                           <input type="text" className={`form-control ${validationErrors.postalCode ? 'is-invalid' : ''}`} name="postalCode" value={form.billing.postalCode}
                             onChange={e=> {
                               const sanitizedValue = sanitizeInput(e.target.value);
                               setForm(prev => ({ ...prev, billing: { ...prev.billing, postalCode: sanitizedValue } }));
                               if (!validateField('postalCode', sanitizedValue)) {
                                 setValidationErrors((prev) => ({ ...prev, postalCode: `Invalid postalCode format` }));
                               } else {
                                 setValidationErrors((prev) => ({ ...prev, postalCode: '' }));
                               }
                             }} />
                           {validationErrors.postalCode && <div className="invalid-feedback">{validationErrors.postalCode}</div>}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 {/* Shipping Address */}
                 <div className="col-md-6">
                   <div className="d-flex align-items-center justify-content-between mb-3 pt-4">
                     <h6>Shipping Address</h6>
                     <button type="button" onClick={handleCopyFromBilling}
                       className="d-inline-flex align-items-center text-primary text-decoration-underline fs-13 btn btn-link p-0"
                       style={{boxShadow:'none'}}>
                       <TbCopy className="me-1" />Copy From Billing
                     </button>
                   </div>
                   <div className="row">
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Name</label>
                         <input type="text" className="form-control" name="name" value={form.shipping.name}
                           onChange={e=> setForm(prev => ({ ...prev, shipping: { ...prev.shipping, name: e.target.value
                         } }))} />
                       </div>
                     </div>
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Address Line 1</label>
                         <input type="text" className="form-control" name="address1" value={form.shipping.address1}
                           onChange={e=> setForm(prev => ({ ...prev, shipping: { ...prev.shipping, address1:
                         e.target.value } }))} />
                       </div>
                     </div>
                     <div className="col-12">
                       <div className="mb-3">
                         <label className="form-label">Address Line 2</label>
                         <input type="text" className="form-control" name="address2" value={form.shipping.address2}
                           onChange={e=> setForm(prev => ({ ...prev, shipping: { ...prev.shipping, address2:
                         e.target.value } }))} />
                       </div>
                     </div>
                     <div className="col-md-6 mb-3">
                       <label className="form-label">Country</label>
                       <Select options={countries} value={form.shipping.country} onChange={option=>
                         handleSelectChange('shipping', 'country', option)} placeholder="Select Country" />
                     </div>
                     <div className="col-md-6 mb-3">
                       <label className="form-label">State</label>
                       <Select options={filteredShippingStates} value={form.shipping.state} onChange={option=>
                         handleSelectChange('shipping', 'state', option)} isDisabled={!form.shipping.country}
                         placeholder="Select State" />
                     </div>
                     <div className="col-md-6 mb-3">
                       <label className="form-label">City</label>
                       <Select options={filteredShippingCities} value={form.shipping.city} onChange={option=>
                         handleSelectChange('shipping', 'city', option)} isDisabled={!form.shipping.state}
                         placeholder="Select City" />
                     </div>
                     <div className="col-md-6">
                       <div className="mb-3">
                         <label className="form-label">Pincode</label>
                         <input type="text" className={`form-control ${validationErrors.pincode ? 'is-invalid' : ''}`} name="pincode" value={form.shipping.pincode}
                           onChange={e=> {
                             const sanitizedValue = sanitizeInput(e.target.value);
                             setForm(prev => ({ ...prev, shipping: { ...prev.shipping, pincode: sanitizedValue } }));
                             if (!validateField('pincode', sanitizedValue)) {
                               setValidationErrors((prev) => ({ ...prev, pincode: `Invalid pincode format` }));
                             } else {
                               setValidationErrors((prev) => ({ ...prev, pincode: '' }));
                             }
                           }} />
                         {validationErrors.pincode && <div className="invalid-feedback">{validationErrors.pincode}</div>}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             {/* Bank Details */}
             <div className="col-12 border-top pt-3 mt-2">
               <h6>Bank Details</h6>
             </div>
             <div className="col-md-4 mb-3">
               <label>Bank Name</label>
               <input type="text" name="bankName" className="form-control" value={form.bank.bankName}
                 onChange={handleBankChange} />
             </div>
             <div className="col-md-4 mb-3">
               <label>Branch</label>
               <input type="text" name="branch" className="form-control" value={form.bank.branch}
                 onChange={handleBankChange} />
             </div>
             <div className="col-md-4 mb-3">
               <label>Account Holder</label>
               <input type="text" name="accountHolder" className="form-control" value={form.bank.accountHolder}
                 onChange={handleBankChange} />
             </div>
             <div className="col-md-6 mb-3">
               <label>Account Number</label>
               <input type="text" name="accountNumber" className={`form-control ${validationErrors.accountNumber ? 'is-invalid' : ''}`} value={form.bank.accountNumber}
                 onChange={handleBankChange} />
               {validationErrors.accountNumber && <div className="invalid-feedback">{validationErrors.accountNumber}</div>}
             </div>
             <div className="col-md-6 mb-3">
               <label>IFSC</label>
               <input type="text" name="ifsc" className={`form-control ${validationErrors.ifsc ? 'is-invalid' : ''}`} value={form.bank.ifsc}
                 onChange={handleBankChange} />
               {validationErrors.ifsc && <div className="invalid-feedback">{validationErrors.ifsc}</div>}
             </div>
           </div>
           <div></div>
           <div className="d-flex justify-content-start align-items-start mb-3 ">
             <span>Status</span>
             <div className="form-check form-switch ms-1">
               <input className="form-check-input" type="checkbox" checked={form.status} onChange={()=> setForm((prev) =>
               ({ ...prev, status: !prev.status }))} />
             </div>
           </div>
         </div>
         <div className="modal-footer" style={{display:'flex', gap:'5px'}}>
           <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
           <button type="submit" className="btn btn-primary" disabled={loading}>
             {loading ? 'Saving...' : (editSupplier ? 'Update Supplier' : 'Add Supplier')}
           </button>
         </div>
       </form>

     </div>
   </div>
 </div>
  );
};

export default AddSupplierModals;


// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import Select from "react-select";
// import { toast } from 'react-toastify';
// import BASE_URL from '../../config/config';

// const AddSupplierModals = ({ onClose, onSuccess }) => {
//   const fileInputRef = useRef(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     businessType: '',
//     gstin: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: null,
//     state: null,
//     country: null,
//     postalCode: '',
//     status: true,
//     bank: {
//       bankName: '',
//       branch: '',
//       accountHolder: '',
//       accountNumber: '',
//       ifsc: '',
//     },
//   });
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredStates, setFilteredStates] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [gstDetails, setGstDetails] = useState(null);
//   const [gstLoading, setGstLoading] = useState(false);
//   const [gstError, setGstError] = useState('');

//   // Fetch countries, states, cities on mount
  
//   useEffect(() => {
//     fetchCountries();
//     fetchStates();
//     fetchCities();
//   }, []);


  
//   const fetchCountries = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/countries`);
//       const formatted = res.data.map((c) => ({ value: c._id, label: c.name }));
//       setCountries(formatted);
//     } catch {
//       toast.error("Failed to fetch countries");
//     }
//   };
//   const fetchStates = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/states`);
//       setStates(res.data);
//     } catch {
//       toast.error("Failed to fetch states");
//     }
//   };
//   const fetchCities = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/city/cities`);
//       setCities(res.data);
//     } catch {
//       toast.error("Failed to fetch cities");
//     }
//   };
  

//   // Input handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleVerifyGSTIN = async () => {
//     setGstLoading(true);
//     setGstError('');
//     try {
//       const res = await axios.post(`${BASE_URL}/api/suppliers/verify-gstin`, { gstin: form.gstin });
//       setGstDetails(res.data);
//       // Optionally autofill fields
//       if (res.data.valid) {
//         setForm(prev => ({
//           ...prev,
//           businessType: res.data.businessType || prev.businessType,
//           address: res.data.address || prev.address,
//           state: res.data.state ? { value: '', label: res.data.state } : prev.state,
//           // Add more autofill as needed
//         }));
//       }
//     } catch (err) {
//       setGstError('GSTIN verification failed');
//       setGstDetails(null);
//     } finally {
//       setGstLoading(false);
//     }
//   };
//   const handleSelectChange = (name, option) => {
//     setForm((prev) => ({ ...prev, [name]: option }));
//     if (name === 'country') {
//       const filtered = states.filter((s) => s.country._id === option.value).map((s) => ({ value: s._id, label: s.stateName }));
//       setFilteredStates(filtered);
//       setFilteredCities([]);
//       setForm((prev) => ({ ...prev, state: null, city: null }));
//     }
//     if (name === 'state') {
//       const filtered = cities.filter((c) => c.state._id === option.value).map((c) => ({ value: c._id, label: c.cityName }));
//       setFilteredCities(filtered);
//       setForm((prev) => ({ ...prev, city: null }));
//     }
//   };
 


//   const handleBankChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, bank: { ...prev.bank, [name]: value } }));
//   };







//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         firstName: form.firstName,
//         lastName: form.lastName,
//         businessType: form.businessType,
//         gstin: form.gstin,
//         email: form.email,
//         phone: form.phone,
//         address: form.address,
//         city: form.city?.value || '',
//         state: form.state?.value || '',
//         country: form.country?.value || '',
//         postalCode: form.postalCode,
//         status: form.status,
//         bank: form.bank,
//       };
//       // If image is selected, use FormData
//       if (selectedImage) {
//         const formData = new FormData();
//         Object.entries(payload).forEach(([key, value]) => {
//           if (typeof value === 'object' && value !== null) {
//             formData.append(key, JSON.stringify(value));
//           } else {
//             formData.append(key, value);
//           }
//         });
//         formData.append('image', selectedImage);
//         await axios.post(`${BASE_URL}/api/suppliers`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await axios.post(`${BASE_URL}/api/suppliers`, payload);
//       }
//       toast.success('Supplier created successfully!');
//       if (onSuccess) onSuccess();
//       if (onClose) onClose();
//     } catch (err) {
//       toast.error('Failed to create supplier');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedImage(file);
//   };
//   const handleUploadClick = (e) => {
//     e.preventDefault();
//     if (fileInputRef.current) fileInputRef.current.click();
//   };


//   const businessTypeOptions = [
//   { value: 'Manufacturer', label: 'Manufacturer' },
//   { value: 'Wholesaler', label: 'Wholesaler' },
//   { value: 'Distributor', label: 'Distributor' }
// ];
//   return (
//     <div className="modal fade show" id="add-supplier"
//       tabIndex="-1"
//       style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//       aria-modal="true"
//       role="dialog">
//       <div className="modal-dialog modal-dialog-centere modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <div className="page-title">
//               <h4>Add Supplier</h4>
//             </div>
//             <button type="button" className="close" aria-label="Close" onClick={onClose}>
//               <span aria-hidden="true">×</span>
//             </button>
//           </div>
//       <form onSubmit={handleSubmit}>
//         <div className="modal-body">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="new-employee-field">
//                 <div className="profile-pic-upload mb-2">
//                   <div className="profile-pic">
//                     <span><i data-feather="plus-circle" className="plus-down-add" />Add Image</span>
//                   </div>
//                   <div className="mb-0">
//                     <div className="image-upload mb-2">
//                       <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
//                       <div className="image-uploads" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
//                         <h4>Upload Image</h4>
//                       </div>
//                     </div>
//                     <p>JPEG, PNG up to 2 MB</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">First Name <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="firstName" value={form.firstName} onChange={handleInputChange} />
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">Last Name <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="lastName" value={form.lastName} onChange={handleInputChange} />
//               </div>
//             </div>	
//             {/* <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">Business Types <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="businessType" value={form.businessType} onChange={handleInputChange} />
//               </div>
              
//             </div>	 */}
//             <div className="col-lg-6">
//   <div className="mb-3">
//     <label className="form-label">
//       Business Types <span className="text-danger">*</span>
//     </label>
//     <Select
//       name="businessType"
//       options={businessTypeOptions}
//       value={businessTypeOptions.find(option => option.value === form.businessType)}
//       onChange={selectedOption =>
//         handleInputChange({
//           target: { name: 'businessType', value: selectedOption.value }
//         })
//       }
//       isSearchable
//       placeholder="Select Business Type"
//     />
//   </div>
// </div>



//             <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">GSTIN <span className="text-danger">*</span></label>
//                 <div className="d-flex align-items-center gap-2">
//                   <input type="text" className="form-control" name="gstin" value={form.gstin} onChange={handleInputChange} />
//                   <button type="button" className="btn btn-outline-primary" style={{whiteSpace:'nowrap'}} onClick={handleVerifyGSTIN} disabled={gstLoading || !form.gstin}>
//                     {gstLoading ? 'Verifying...' : 'Verify GST' }
//                   </button>
//                 </div>
//                 {gstError && <div className="text-danger mt-1">{gstError}</div>}
//                 {gstDetails && gstDetails.valid && (
//                   <div className="alert alert-success mt-2 p-2">
//                     <div><strong>Name:</strong> {gstDetails.name}</div>
//                     <div><strong>Address:</strong> {gstDetails.address}</div>
//                     <div><strong>State:</strong> {gstDetails.state}</div>
//                     <div><strong>Business Type:</strong> {gstDetails.businessType}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">Email <span className="text-danger">*</span></label>
//                 <input type="email" className="form-control" name="email" value={form.email} onChange={handleInputChange} />
//               </div>
//             </div>								
//             <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">Phone <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleInputChange} />
//               </div>
//             </div>									
//             <div className="col-lg-12">
//               <div className="mb-3">
//                 <label className="form-label">Address <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="address" value={form.address} onChange={handleInputChange} />
//               </div>
//             </div>
           
//             <div className="col-lg-6 col-sm-10 col-10">
//               <div className="mb-3">
//                 <label className="form-label">Country <span className="text-danger">*</span></label>
//                 <Select options={countries} value={form.country} onChange={option => handleSelectChange('country', option)} placeholder="Select Country" />
//                         </div>
//             </div>
//             <div className="col-lg-6 col-sm-10 col-10">
//               <div className="mb-3">
//                 <label className="form-label">State <span className="text-danger">*</span></label>
//                 <Select options={filteredStates} value={form.state} onChange={option => handleSelectChange('state', option)} isDisabled={!form.country} placeholder="Select State" />
//               </div>
//             </div>
            
//              <div className="col-lg-6 col-sm-10 col-10">
//               <div className="mb-3">
//                 <label className="form-label">City <span className="text-danger">*</span></label>
//                 <Select options={filteredCities} value={form.city} onChange={option => handleSelectChange('city', option)} isDisabled={!form.state} placeholder="Select City" />
//               </div>
//             </div>
//               <div className="col-lg-6">
//               <div className="mb-3">
//                 <label className="form-label">Postal Code <span className="text-danger">*</span></label>
//                 <input type="text" className="form-control" name="postalCode" value={form.postalCode} onChange={handleInputChange} />
//               </div>
//             </div>


//              <div className="border-top my-2">
//         <h6 className="mb-3 pt-4">Banking Details</h6>
//         <div className="row gx-3">
//           <div className="col-lg-4 col-md-6">
//             <div className="mb-3">
//               <label className="form-label">Bank Name</label>
//               <input type="text" className="form-control" name="bankName" value={form.bank.bankName} onChange={handleBankChange} />
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6">
//             <div className="mb-3">
//               <label className="form-label">Branch</label>
//               <input type="text" className="form-control" name="branch" value={form.bank.branch} onChange={handleBankChange} />
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6">
//             <div className="mb-3">
//               <label className="form-label">Account Holder</label>
//               <input type="text" className="form-control" name="accountHolder" value={form.bank.accountHolder} onChange={handleBankChange} />
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6">
//             <div className="mb-3">
//               <label className="form-label">Account Number</label>
//               <input type="text" className="form-control" name="accountNumber" value={form.bank.accountNumber} onChange={handleBankChange} />
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6">
//             <div className="mb-3">
//               <label className="form-label">IFSC</label>
//               <input type="text" className="form-control" name="ifsc" value={form.bank.ifsc} onChange={handleBankChange} />
//             </div>
//           </div>
//         </div>
//       </div>
          
//             <div className="col-md-12">
//               <div className="mb-0">
//                 <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
//                   <span className="status-label">Status</span>
//                   {/* <input type="checkbox" id="users5" className="check" checked={form.status} onChange={() => setForm(prev => ({ ...prev, status: !prev.status }))} /> */}
//                   {/* <label htmlFor="users5" className="checktoggle mb-0" /> */}
//                    <div className="form-check form-switch">
//   <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked checked={form.status} onChange={() => setForm(prev => ({ ...prev, status: !prev.status }))}/>
// </div>
//                 </div>

//               </div>	
//             </div>
//           </div>
//         </div>
//         <div className="modal-footer">
//           <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
//           <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Add Supplier'}</button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>

//   )
// }

// export default AddSupplierModals
