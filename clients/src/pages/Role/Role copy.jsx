import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbEye, TbTrash } from "react-icons/tb";
import { toast } from "react-toastify";
import BASE_URL from "../config/config";
import { CiCirclePlus } from "react-icons/ci";
import { RxDotFilled } from "react-icons/rx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";


const Role = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleStatus, setRoleStatus] = useState(true);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleStatus, setEditRoleStatus] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Latest");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [editRolePermissions, setEditRolePermissions] = useState({});

  const modules = ['Category', 'Inventory', 'Sales']; // customize as needed
  const permissionTypes = ['read', 'write', 'update', 'delete', 'all'];

  const loadRoleForEdit = async (roleId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/role/${roleId}`);
      const role = res.data;

      setEditRoleId(role._id);
      setEditRoleName(role.roleName);
      setEditRoleStatus(role.status === "Active");
      setEditRolePermissions(role.modulePermissions || {});

      window.$("#edit-role").modal("show");
    } catch (err) {
      console.error("Failed to load role", err);
      toast.error("Error loading role");
    }
  };

  const toggleEditPermission = (module, type) => {
    setEditRolePermissions((prev) => {
      const modulePerm = prev[module] || {
        read: false,
        write: false,
        update: false,
        delete: false,
        all: false,
      };

      return {
        ...prev,
        [module]: {
          ...modulePerm,
          [type]: !modulePerm[type],
        },
      };
    });
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      const updatedRole = {
        roleName: editRoleName,
        status: editRoleStatus ? "Active" : "Inactive",
        modulePermissions: editRolePermissions,
      };

      await axios.put(`${BASE_URL}/api/role/update/${editRoleId}`, updatedRole);
      toast.success("Role updated");
      fetchRoles();
      window.$("#edit-role").modal("hide");
    } catch (err) {
      console.log(err);
      toast.error("Error updating role");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/role/getRole`);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const newRole = {
        roleName,
        status: roleStatus ? "Active" : "Inactive",
      };

      await axios.post(`${BASE_URL}/api/role/create`, newRole);

      toast.success("Role created");
      fetchRoles();
      setRoleName("");
      setRoleStatus(true);
      window.$("#add-role").modal("hide");
    } catch (err) {
      console.log(err);
      toast.error("Error creating role");
    }
  };

  const handleEditClick = (role) => {
    setEditRoleId(role._id);
    setEditRoleName(role.roleName);
    setEditRoleStatus(role.status === "Active");
  };


  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        //   await axios.delete(`${BASE_URL}/${id}`);
        await axios.delete(`${BASE_URL}/api/role/delete/${id}`);
        toast.success("Role deleted");
        fetchRoles();
      } catch (err) {
        console.log(err);

        toast.error("Error deleting role");
      }
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(roles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Roles.xlsx");
  };

  // Filtered, searched, sorted roles
  const filteredRoles = roles
    .filter((role) => statusFilter === "All" || role.status === statusFilter)
    .filter((role) =>
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "Latest") return dateB - dateA;
      if (sortOrder === "Ascending")
        return a.roleName.localeCompare(b.roleName);
      if (sortOrder === "Descending")
        return b.roleName.localeCompare(a.roleName);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Roles &amp; Permission</h4>
              <h6>Manage your roles</h6>
            </div>
          </div>

          <div className="table-top-head me-2">
            <li>
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={exportToExcel}
              >
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-role"
            >
              <CiCirclePlus className=" me-1" />
              Add Role
            </a>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <input
                    type="text"
                    placeholder="Search roles..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </span>
              </div>
            </div>
           
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      onClick={() => setStatusFilter("All")}
                      className="dropdown-item rounded-1"
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setStatusFilter("Active")}
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setStatusFilter("Inactive")}
                      className="dropdown-item rounded-1"
                    >
                      Inactive
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By : Latest
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      onClick={() => setSortOrder("Latest")}
                      className="dropdown-item rounded-1"
                    >
                      Latest
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setSortOrder("Ascending")}
                      className="dropdown-item rounded-1"
                    >
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setSortOrder("Descending")}
                      className="dropdown-item rounded-1"
                    >
                      Descending
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <div className="form-check form-check-md">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="select-all"
                        />
                      </div>
                    </th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {paginatedRoles.length > 0 ? (
                    paginatedRoles.map((role) => (
                      <tr key={role._id}>
                        <td>
                          <div className="form-check form-check-md">
                            <input
                              className="form-check-input"
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td>{role.roleName}</td>
                        <td>{new Date(role.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge table-badge fw-medium fs-10 ${role.status === "Active"
                                ? "bg-success"
                                : "bg-danger"
                              }`}
                          >
                            <RxDotFilled />
                            {role.status}
                          </span>
                        </td>

                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              onClick={() =>
                                navigate(`/permissions/${role._id}`)
                              }
                            >
                              <TbEye />
                            </a>
                            {/* <a onClick={() => loadRoleForEdit(role._id)}><TbEye /></a> */}

                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-role"
                              onClick={() => handleEditClick(role)}
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDeleteRole(role._id)}
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No more roles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="form-select w-auto"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* Pagination buttons */}
              <div>
                <button
                  className="btn btn-light btn-sm me-2"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm me-1 ${currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                      }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-light btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

      <div>
        {/* Add Role */}
        <div className="modal fade" id="add-role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Create Role</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  <span>×</span>
                </button>
              </div>
              <form onSubmit={handleCreateRole}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="roleStatus"
                        className="check"
                        checked={roleStatus}
                        onChange={(e) => setRoleStatus(e.target.checked)}
                      />
                      <label htmlFor="roleStatus" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Role */}

        {/* Edit Role */}
         <div className="modal fade" id="edit-role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Edit Role</h4>
                <button type="button" className="close" data-bs-dismiss="modal">
                  <span>×</span>
                </button>
              </div>
              <form onSubmit={handleUpdateRole}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRoleName}
                      onChange={(e) => setEditRoleName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="editRoleStatus"
                        className="check"
                        checked={editRoleStatus}
                        onChange={(e) => setEditRoleStatus(e.target.checked)}
                      />
                      <label htmlFor="editRoleStatus" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Role
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

export default Role;
