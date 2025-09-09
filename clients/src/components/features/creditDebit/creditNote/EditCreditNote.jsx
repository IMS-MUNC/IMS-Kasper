import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const EditCreditNote = ({ noteId, onClose, onUpdated }) => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/api/credit-notes/${noteId}`)
      .then(res => setForm(res.data.data))
      .catch(() => setError('Failed to fetch credit note'))
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${BASE_URL}/api/credit-notes/${noteId}`,
         form);
      setSuccess('Credit note updated');
      if (onUpdated) onUpdated();
    } catch (err) {
      setError('Failed to update credit note');
    }
    setLoading(false);
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div>
      <h4>Edit Credit Note</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Reference Number</label>
          <input name="referenceNumber" value={form.referenceNumber || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Status</label>
          <input name="status" value={form.status || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Amount</label>
          <input name="amount" value={form.amount || ''} onChange={handleChange} className="form-control" />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="btn btn-primary" disabled={loading}>Update</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancel</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </div>
  );
};

export default EditCreditNote;
