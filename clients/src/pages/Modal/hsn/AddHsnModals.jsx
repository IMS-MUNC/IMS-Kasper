import React from 'react';

const AddHsnModals = ({ show, onClose, modalData, setModalData, onSubmit, errors = {} }) => {
    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h5 className="modal-title">{modalData.id ? 'Edit HSN' : 'Add HSN'}</h5>
                        {/* <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button> */}
                    </div>
                    <div className="modal-body">
                        <label className="form-label">
                            HSN Code
                            <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                            className="form-control my-2"
                            placeholder="HSN Code"
                            value={modalData.hsnCode}
                            onChange={e => setModalData({ ...modalData, hsnCode: e.target.value })}
                        />
                        {errors.hsnCode && (<p className='text-danger'>{errors.hsnCode}</p>)}
                        <label className="form-label">
                            Description
                            <span className="text-danger ms-1">*</span>
                        </label>
                        <input
                            className="form-control my-2"
                            placeholder="Description"
                            value={modalData.description}
                            onChange={e => setModalData({ ...modalData, description: e.target.value })}
                        />
                        {errors.description && (<p className='text-danger'>{errors.description}</p>)}
                    </div>
                    <div className="modal-footer" style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={onSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHsnModals;
