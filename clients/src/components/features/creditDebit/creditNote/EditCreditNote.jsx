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
        <div className="mb-2">
          <label>Payment Type</label>
          <select name="paymentType" value={form.paymentType || ''} onChange={handleChange} className="form-control">
            <option value="">Select</option>
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Paid Amount</label>
          <input name="paidAmount" type="number" value={form.paidAmount || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Due Amount</label>
          <input name="dueAmount" type="number" value={form.dueAmount || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Due Date</label>
          <input name="dueDate" type="date" value={form.dueDate ? form.dueDate.slice(0,10) : ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-2">
          <label>Payment Method</label>
          <select name="paymentMethod" value={form.paymentMethod || ''} onChange={handleChange} className="form-control">
            <option value="">Select</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
        {form.paymentMethod === 'Online' && (
          <>
            <div className="mb-2">
              <label>Online Payment Mode</label>
              <select name="onlineMod" value={form.onlineMod || ''} onChange={handleChange} className="form-control">
                <option value="">Select</option>
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
            <div className="mb-2">
              <label>Transaction ID</label>
              <input name="transactionId" value={form.transactionId || ''} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Transaction Date</label>
              <input name="transactionDate" type="date" value={form.transactionDate ? form.transactionDate.slice(0,10) : ''} onChange={handleChange} className="form-control" />
            </div>
          </>
        )}
        {form.paymentMethod === 'Cheque' && (
          <>
            <div className="mb-2">
              <label>Cheque No</label>
              <input name="transactionId" value={form.transactionId || ''} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Transaction Date</label>
              <input name="transactionDate" type="date" value={form.transactionDate ? form.transactionDate.slice(0,10) : ''} onChange={handleChange} className="form-control" />
            </div>
          </>
        )}
        <div className="mb-2">
          <label>Payment Status</label>
          <select name="paymentStatus" value={form.paymentStatus || ''} onChange={handleChange} className="form-control">
            <option value="">Select</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Update</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancel</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </div>
  );
};

export default EditCreditNote;
