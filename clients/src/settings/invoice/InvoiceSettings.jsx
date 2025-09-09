import React, { useState } from 'react';
import axios from 'axios';

const InvoiceSettings = () => {
  // State for all fields
  const [form, setForm] = useState({
    company: '',
    logo: '',
    invoicePrefix: 'INV',
    invoiceColor: '',
    invoiceTemplate: '',
    showTax: true,
    showDiscount: true,
    showShipping: true,
    showNotes: true,
    showTerms: true,
    terms: '',
    notes: '',
    createdBy: '',
    updatedBy: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file upload (logo)
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, logo: file }));
    }
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let res;
      if (form.logo && typeof form.logo !== 'string') {
        // Use FormData for file upload
        const formData = new FormData();
        Object.keys(form).forEach(key => {
          if (key === 'logo') {
            formData.append('logo', form.logo);
          } else {
            formData.append(key, form[key]);
          }
        });
        res = await axios.post('/api/invoice-settings', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}`,

          },
        });
      } else {
        res = await axios.post('/api/invoice-settings', form,{

 headers: {
          Authorization: `Bearer ${token}`,
        },
        });
      }
      setSuccess('Invoice settings saved!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving settings');
    }
    setLoading(false);
  };

  return (
    <div className="card flex-fill mb-0">
      <form onSubmit={handleSubmit}>
        <div className="card-header">
          <h4>Invoice Settings</h4>
        </div>
        <div className="card-body ">
          <ul className="logo-company">
            <li>
              <div className="row">
                <div className="col-md-4">
                  <div className="logo-info me-0 mb-3 mb-md-0">
                    <h6>Invoice Logo</h6>
                    <p>Upload Logo of your Company to display in Invoice</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="profile-pic-upload mb-0 me-0">
                    <div className="new-employee-field">
                      <div className="mb-3 mb-md-0">
                        <div className="image-upload mb-0">
                          <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                            <div className="image-uploads">
                              <h4><i data-feather="upload" />Upload Photo</h4>
                            </div>
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            name="logo"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                        </div>
                        <span>For better preview recommended size is 450px x 450px. Max size 5mb.</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="new-logo ms-auto">
                    <a href="#"><img src="assets/img/logo-small.png" alt="Logo" /></a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="localization-info">
            <div className="row align-items-center">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Invoice Prefix</h6>
                  <p>Add prefix to your invoice</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="localization-select">
                  <input type="text" className="form-control" name="invoicePrefix" value={form.invoicePrefix} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Invoice Due</h6>
                  <p>Select due date to display in Invoice</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="localization-select d-flex align-items-center fixed-width">
                  <select className="select" name="dueDays" value={form.dueDays || ''} onChange={handleChange}>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <span className="ms-2">Days</span>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Invoice Round Off</h6>
                  <p>Value Roundoff in Invoice</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="localization-select d-flex align-items-center width-custom">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center me-3">
                    <input type="checkbox" id="user3" className="check" name="roundOff" checked={form.roundOff || false} onChange={handleChange} />
                    <label htmlFor="user3" className="checktoggle" />
                  </div>
                  <select className="select" name="roundOffType" value={form.roundOffType || ''} onChange={handleChange}>
                    <option value="up">Round Off Up</option>
                    <option value="down">Round Off Down</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Show Company Details</h6>
                  <p>Show / Hide Company Details in Invoice</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="localization-select d-flex align-items-center">
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center me-3">
                    <input type="checkbox" id="user4" className="check" name="showCompanyDetails" checked={form.showCompanyDetails || false} onChange={handleChange} />
                    <label htmlFor="user4" className="checktoggle" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Invoice Header Terms</h6>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <textarea rows={4} className="form-control" name="headerTerms" value={form.headerTerms || ''} onChange={handleChange} placeholder="Type your message" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-4">
                <div className="setting-info">
                  <h6>Invoice Footer Terms</h6>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <textarea rows={4} className="form-control" name="footerTerms" value={form.footerTerms || ''} onChange={handleChange} placeholder="Type your message" />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={() => setForm({})}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>Save Changes</button>
          </div>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          {success && <div className="alert alert-success mt-2">{success}</div>}
        </div>
      </form>
    </div>
  );
}

export default InvoiceSettings
