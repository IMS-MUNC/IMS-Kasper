import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddCountryModal = () => {
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!countryName || !countryCode) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/api/countries", {
        name: countryName,
        code: countryCode, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Country added successfully");
      // Optionally reset form or reload list
      setCountryName("");
      setCountryCode("");
      document.getElementById("closeAddCountryModal").click(); // Close modal
    } catch (err) {
      console.error(err);
      toast.error("Failed to add country");
    }
  };

  return (
    <div className="modal fade" id="add-country">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="page-title">
              <h4>Add Country</h4>
            </div>
            <button
              type="button"
              id="closeAddCountryModal"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <label className="form-label">
                    Country Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Country Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary fs-13 fw-medium p-2 px-3"
              >
                Add Country
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCountryModal;
