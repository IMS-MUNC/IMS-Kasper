import React from "react";

const CategoryModal = ({
  modalId,
  title,
  // isEditMode,
  categoryName,
  categorySlug,
  onCategoryChange,
  onSlugChange,
  onSubmit,
  submitLabel = "Submit",
  errors = {}
}) => {
   return (
    <div className="modal" id={modalId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className=""
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ color: 'white', backgroundColor: 'red', borderRadius: '50%' }}
            >x</button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={onCategoryChange}
                  required
                  placeholder="Category Name (only letters allowed)"
                />
                {errors.categoryName && (
                  <p className="text-danger">{errors.categoryName}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Category Slug 
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={categorySlug}
                  onChange={(e) => {
                    const value = e.target.value;
                    const stringOnly = value.replace(/[^a-zA-Z\s-]/g, "");
                    onSlugChange({ target: { value: stringOnly } })
                  }}
                  placeholder="Optional slug (only letters allowed)"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
