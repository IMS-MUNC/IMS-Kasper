import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";

const EditUnitModal = ({ selectedUnit, onUnitUpdated }) => {
  const [unitsName, setUnitsName] = useState("");
  const [shortName, setShortName] = useState("");
  const [status, setStatus] = useState(true);
const token = localStorage.getItem("token");
  useEffect(() => {
    if (selectedUnit) {
      setUnitsName(selectedUnit.unitsName);
      setShortName(selectedUnit.shortName);
      setStatus(selectedUnit.status === "Active");
    }
  }, [selectedUnit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        unitsName,
        shortName,
        status: status ? "Active" : "Inactive",
      };
      const response = await axios.put(
        `${BASE_URL}/api/unit/units/${selectedUnit._id}`,
        updatedData,{
           headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );
      console.log("Update response:", response.data);
      onUnitUpdated(); // Refresh list or close modal
      window.$("#edit-units").modal("hide"); // jQuery style close
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  

  return (
    <div className="modal fade" id="edit-units">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="page-title">
              <h4>Edit Unit</h4>
            </div>
            <button
              type="button"
              className="close bg-danger text-white fs-16"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Unit<span className="text-danger ms-1">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={unitsName}
                  onChange={(e) => setUnitsName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Short Name<span className="text-danger ms-1">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-0">
                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                  <span className="status-label">Status</span>
                  <input
                    type="checkbox"
                    id="user3"
                    className="check"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                  <label htmlFor="user3" className="checktoggle" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-2 btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUnitModal;
