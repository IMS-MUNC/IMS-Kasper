import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from '../../config/config';

const EditDebitNoteModals = ({ noteData, onEditSuccess }) => {
    const [formState, setFormState] = useState({ ...noteData });
    const [loading, setLoading] = useState(false);
const token = localStorage.getItem("token");
    useEffect(() => {
        setFormState({ ...noteData });
    }, [noteData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormState({ ...formState, [name]: checked });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...formState.products];
        updatedProducts[index][key] = value;
        setFormState({ ...formState, products: updatedProducts });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formState };
            await axios.put(`${BASE_URL}/api/debit-notes/${formState._id}`, payload,{
                headers: {
        Authorization: `Bearer ${token}`,
      },
            });
            toast.success('Debit Note updated!');
            if (onEditSuccess) onEditSuccess();
        } catch (err) {
            toast.error('Failed to update debit note');
        } finally {
            setLoading(false);
        }
    };

    if (!formState) return null;

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h5 className="modal-title">Edit Debit Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3">
                    <label className="form-label">Reference Number</label>
                    <input type="text" className="form-control" name="referenceNumber" value={formState.referenceNumber || ''} onChange={handleChange} />
                </div>
                {/* Add more fields as needed, similar to AddDebitNoteModals */}
                {/* Example for editing products */}
                <div className="mb-3">
                    <label className="form-label">Products</label>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Return Qty</th>
                                <th>Unit</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formState.products && formState.products.length > 0 ? formState.products.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.product?.productName || p.product?.name || p.product || '-'}</td>
                                    <td><input type="number" className="form-control" value={p.quantity} onChange={e => handleProductChange(i, 'quantity', e.target.value)} /></td>
                                    <td><input type="number" className="form-control" value={p.returnQty} onChange={e => handleProductChange(i, 'returnQty', e.target.value)} /></td>
                                    <td>{p.unit}</td>
                                    <td><input type="number" className="form-control" value={p.purchasePrice} onChange={e => handleProductChange(i, 'purchasePrice', e.target.value)} /></td>
                                    <td><input type="number" className="form-control" value={p.discount} onChange={e => handleProductChange(i, 'discount', e.target.value)} /></td>
                                    <td><input type="number" className="form-control" value={p.tax} onChange={e => handleProductChange(i, 'tax', e.target.value)} /></td>
                                    <td>{p.totalCost || p.total}</td>
                                </tr>
                            )) : <tr><td colSpan="8">No products</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
    );
};

export default EditDebitNoteModals;
