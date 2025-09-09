// components/AddUserModal.js
import React from "react";
import Select from "react-select";
import { CiCirclePlus } from "react-icons/ci";

const AddUserModal = ({ activeRoles, selectedRole, setSelectedRole }) => {
  return (
    <div className="modal fade" id="add-user">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="page-wrapper-new p-0">
            <div className="content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Add User</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    {/* Profile Image */}
                    <div className="col-lg-12">
                      <div className="new-employee-field">
                        <div className="profile-pic-upload mb-2">
                          <div className="profile-pic">
                            <span>
                              <i
                                data-feather="plus-circle"
                                className="plus-down-add"
                              />
                              Add Image
                            </span>
                          </div>
                          <div className="mb-0">
                            <div className="image-upload mb-0">
                              <input type="file" />
                              <div className="image-uploads">
                                <h4>Upload Image</h4>
                              </div>
                            </div>
                            <p className="fs-13 mt-2">JPEG, PNG up to 2 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Name */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          First Name<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Last Name<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>

                    {/* Role Dropdown */}
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Role<span className="text-danger ms-1">*</span>
                        </label>
                        <Select
                          options={activeRoles}
                          value={selectedRole}
                          onChange={setSelectedRole}
                          placeholder="Search or select a role..."
                          isSearchable
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Email<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="email" className="form-control" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Phone<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="tel" className="form-control" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Password<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="pass-group">
                          <input type="password" className="pass-input form-control" />
                          <i className="ti ti-eye-off toggle-password" />
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Confirm Password<span className="text-danger ms-1">*</span>
                        </label>
                        <div className="pass-group">
                          <input type="password" className="pass-input form-control" />
                          <i className="ti ti-eye-off toggle-password" />
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="col-lg-12">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input type="checkbox" id="user1" className="check" defaultChecked />
                        <label htmlFor="user1" className="checktoggle"> </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
