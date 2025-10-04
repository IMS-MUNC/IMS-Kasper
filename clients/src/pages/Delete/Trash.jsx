import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbTrash, TbRestore } from "react-icons/tb";
import BASE_URL from "../config/config";

const Trash = () => {
  const [deletedPurchases, setDeletedPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch soft-deleted purchases
  const fetchDeletedPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/purchases`, {
        params: { isDeleted: true },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedPurchases(res.data.purchases || []);
    } catch (error) {
      setDeletedPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPurchases();
  }, []);

  // Restore purchase (set isDeleted: false)
  const handleRestore = async (purchaseId) => {
    try {
      await axios.put(`${BASE_URL}/api/purchases/${purchaseId}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedPurchases((prev) => prev.filter((p) => p._id !== purchaseId));
    } catch (error) {
      alert("Failed to restore purchase");
    }
  };

  // Permanently delete purchase
  const handlePermanentDelete = async (purchaseId) => {
    if (!window.confirm("Are you sure you want to permanently delete this purchase?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/purchases/${purchaseId}/permanent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedPurchases((prev) => prev.filter((p) => p._id !== purchaseId));
    } catch (error) {
      alert("Failed to permanently delete purchase");
    }
  };


    const [deletedNotes, setDeletedNotes] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const token = localStorage.getItem("token");
  
    // Fetch soft-deleted credit notes
    const fetchDeletedNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/credit-notes/all`, {
          params: { isDeleted: true },
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeletedNotes(res.data.data || []);
      } catch (error) {
        setDeletedNotes([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDeletedNotes();
    }, []);
  
    // Restore credit note (set isDeleted: false)
    const handleRestores = async (noteId) => {
      try {
        await axios.put(`${BASE_URL}/api/credit-notes/restore/${noteId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchDeletedNotes(); // Instantly refresh list
      } catch (error) {
        alert("Failed to restore credit note");
      }
    };

    // Permanently delete credit note
    const handlePermanentDeletes = async (noteId) => {
      if (!window.confirm("Are you sure you want to permanently delete this credit note?")) return;
      try {
        await axios.delete(`${BASE_URL}/api/credit-notes/hard/${noteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchDeletedNotes(); // Instantly refresh list
      } catch (error) {
        alert("Failed to permanently delete credit note");
      }
    };
  
  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="fw-bold mb-3">Trash </h4>
         {loading ? (
          <div>Loading...</div>
        ) : deletedPurchases.length === 0 ? (
          <div className="card">
            <div className="card-body text-center">
              <h5 className="my-5">No deleted purchases found.</h5>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table datatable text-center align-middle">
                  <thead className="thead-light text-center">
                    <tr>
                      <th>Supplier</th>
                      <th>Reference</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedPurchases.map((purchase) => (
                      <tr key={purchase._id}>
                        <td>{purchase.supplier ? `${purchase.supplier.firstName} ${purchase.supplier.lastName}` : "N/A"}</td>
                        <td>{purchase.referenceNumber}</td>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td><span className="badge bg-danger">Deleted</span></td>
                        <td>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleRestore(purchase._id)}><TbRestore /> Restore</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handlePermanentDelete(purchase._id)}><TbTrash /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )} 

         
                {loading ? (
                  <div>Loading...</div>
                ) : deletedNotes.length === 0 ? (
                  <div>No deleted credit notes found.</div>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedNotes.map((note) => (
                        <tr key={note._id}>
                          <td>{note.creditNoteId || note._id}</td>
                          <td>{note.creditNoteDate ? new Date(note.creditNoteDate).toLocaleDateString() : '-'}</td>
                          <td>{note.sale?.customer?.name || note.billFrom?.name || note.billTo?.name || '-'}</td>
                          <td>{note.total || note.amount || note.grandTotal || '-'}</td>
                          <td>{note.status || '-'}</td>
                          <td>
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleRestores(note._id)}>
                              <TbRestore /> Restore
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handlePermanentDeletes(note._id)}>
                              <TbTrash /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
      </div>

    </div>
    
  );
};

export default Trash;





