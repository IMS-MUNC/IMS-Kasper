import React from "react";

const StateModal = ({
  modalId,
  title,
  editStateName,
  editStateCode,
  onNameChange,
  onCodeChange,
  onSubmit,
  submitLabel = "Submit",
}) => {
  return (
    <div className="modal" id={modalId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            {/* <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button> */}
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  State Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editStateName}
                  onChange={onNameChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  State Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={editStateCode}
                  onChange={onCodeChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '10px' }}>
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

export default StateModal;
