// components/modals/CountryModal.jsx
import React from "react";

const CountryModal = ({
  modalId,
  title,
  name,
  code,
  onNameChange,
  onCodeChange,
  onSubmit,
  submitLabel = "Submit",
}) => {
  return (
    <div className="modal" id={modalId}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="page-title">
              <h4>{title}</h4>
            </div>
            {/* <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button> */}
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Country Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={onNameChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Country Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={onCodeChange}
                />
              </div>
            </div>
            <div className="modal-footer" style={{display:'flex', gap:'10px'}}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
