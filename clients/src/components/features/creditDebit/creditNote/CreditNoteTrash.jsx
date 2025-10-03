import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbTrash, TbRestore } from "react-icons/tb";
import BASE_URL from "../../../pages/config/config";

const CreditNoteTrash = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

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
  const handleRestore = async (noteId) => {
    try {
      await axios.put(`${BASE_URL}/api/credit-notes/restore/${noteId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (error) {
      alert("Failed to restore credit note");
    }
  };

  // Permanently delete credit note
  const handlePermanentDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to permanently delete this credit note?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/credit-notes/hard/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (error) {
      alert("Failed to permanently delete credit note");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="fw-bold mb-3">Credit Note Trash</h4>
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
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleRestore(note._id)}>
                      <TbRestore /> Restore
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handlePermanentDelete(note._id)}>
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

export default CreditNoteTrash;
