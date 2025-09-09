import React from 'react';

const AddHsnModals = ({ show, onClose, modalData, setModalData, onSubmit }) => {
    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalData.id ? 'Edit HSN' : 'Add HSN'}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            className="form-control my-2"
                            placeholder="HSN Code"
                            value={modalData.hsnCode}
                            onChange={e => setModalData({ ...modalData, hsnCode: e.target.value })}
                        />
                        <input
                            className="form-control my-2"
                            placeholder="Description"
                            value={modalData.description}
                            onChange={e => setModalData({ ...modalData, description: e.target.value })}
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={onSubmit}>Save</button>
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHsnModals;
