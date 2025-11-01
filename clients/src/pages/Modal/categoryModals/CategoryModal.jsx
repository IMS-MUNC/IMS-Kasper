import React from "react";
import { createPortal } from "react-dom";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const modalContent = (
    <div className="modal" id={modalId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h5 className="modal-title">{title}</h5>
            {/* <button
              type="button"
              className=""
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ color: 'white', backgroundColor: 'red', borderRadius: '50%' }}
            >x</button> */}
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  {t("Category Name")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={onCategoryChange}
                  placeholder={t("Category Name (only letters allowed)")}
                />
                {errors.categoryName && (
                  <p className="text-danger">{errors.categoryName}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {t("Category Slug")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={categorySlug}
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                    onSlugChange({ target: { value: cleaned } })
                  }}
                  placeholder={t("Slug (lowercase letters, numbers, hyphens)")}
                />
                {errors.categorySlug && (
                  <p className="text-danger">{errors.categorySlug}</p>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '5px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("Cancel")}
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
  return createPortal(modalContent, document.body);
};

export default CategoryModal;
