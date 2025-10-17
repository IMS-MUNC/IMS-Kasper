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
import { sanitizeInput } from "../../utils/sanitize";
import "../../styles/role.css"
import { BiSearch } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import IConnie from "../../assets/images/IConnie.png";
import Erdit from "../../assets/images/erdit.png";
import { LiaEditSolid } from "react-icons/lia";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import autoTable from "jspdf-autotable";
import jsPDF from 'jspdf';


const Role = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  // const [roleStatus, setRoleStatus] = useState(true);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");
  // const [editRoleStatus, setEditRoleStatus] = useState(true);


  const [errors, setErrors] = useState({});
  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;;

  // const [statusFilter, setStatusFilter] = useState("Latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Latest");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editRolePermissions, setEditRolePermissions] = useState({});

  const modules = ['Category', 'Inventory', 'Sales']; // customize as needed
  const permissionTypes = ['read', 'write', 'update', 'delete', 'all'];
  const token = localStorage.getItem("token");
  const loadRoleForEdit = async (roleId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/role/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const role = res.data;

      setEditRoleId(role._id);
      setEditRoleName(role.roleName);
      // setEditRoleStatus(role.status === "Active");
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
    let newErrors = {};
    if (!nameRegex.test(editRoleName)) {
      newErrors.roleName = "Enter a valid subcategory name (letters only, min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const updatedRole = {
        roleName: sanitizeInput(editRoleName),
        // status: editRoleStatus ? "Active" : "Inactive",
        modulePermissions: editRolePermissions,
      };

      await axios.put(`${BASE_URL}/api/role/update/${editRoleId}`, updatedRole, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
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
      const res = await axios.get(`${BASE_URL}/api/role/getRole`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles", err);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!nameRegex.test(roleName)) {
      newErrors.roleName = "Enter a valid subcategory name (letters only, min 2 chars)";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const newRole = {
        roleName,
        // status: roleStatus ? "Active" : "Inactive",
      };

      await axios.post(`${BASE_URL}/api/role/create`, newRole, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Role created");
      fetchRoles();
      setRoleName("");
      // setRoleStatus(true);
      window.$("#add-role").modal("hide");
    } catch (err) {
      console.log(err);
      toast.error("Error creating role");
    }
  };

  const handleEditClick = (role) => {
    setEditRoleId(role._id);
    setEditRoleName(role.roleName);
    // setEditRoleStatus(role.status === "Active");
    setEditRolePermissions(role.modulePermissions || {});
  };


  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        //   await axios.delete(`${BASE_URL}/${id}`);
        await axios.delete(`${BASE_URL}/api/role/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Role deleted");
        fetchRoles();
      } catch (err) {
        console.log(err);

        toast.error("Error deleting role");
      }
    }
  };


  // Filtered, searched, sorted roles
  const filteredRoles = roles
    // .filter((role) => sortOrder === "Latest" || role.status === sortOrder)
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


  // const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleViewPermissions = (roleName) => {
    localStorage.setItem("selectedRoleName", roleName);
    navigate("/permissions");
  };


  const handleExportExcel = () => {
    const worksheetData = filteredRoles.map((user) => {
      const formattedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return {
        "Role Name": user.roleName,
        "Created At": formattedDate
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "role_list.xlsx")
  }


  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Role List", 14, 16);
    const tableColumn = ["Role", "Created At"];
    const tableRows = [];
    filteredRoles.forEach((user) => {
      const formattedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      const RoleData = [
        user.roleName,
        formattedDate
      ];
      tableRows.push(RoleData);
    })
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    })
    doc.save('role_list.pdf')
  }

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
              <button type="button" onClick={handleExportPDF} className="icon-btn" title="Pdf">
                <FaFilePdf style={{ color: 'red' }} />
              </button>
            </li>
            <li>
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={handleExportExcel}
              >
                <FaFileExcel style={{ color: 'green' }} />
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
        <hr style={{ height: "1px", color: "#bbbbbb" }} />
        <div className="card crdrd">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input" style={{ position: 'relative' }}>
                <BiSearch
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by role..."
                  className="search-inputsrch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                />
              </div>
            </div>

            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3" style={{ gap: '10px' }}>
              {/* <div className="dropdown" style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}>
                <button
                  type="button"
                  className="dropdown-toggle btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  role="button"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "14px",
                    borderRadius: "4px",
                    border: "1px solid #E6E6E6",
                    boxShadow: "rgba(0, 0, 0, 0.25)",
                    padding: "10px",
                  }}
                >
                  {statusFilter || "Status"}
                  <IoIosArrowDown style={{ marginLeft: "10px", fontSize: "20px" }} />
                </button>
                <ul className="dropdown-menu  dropdown-menu-end p-1" aria-labelledby="statusDropdown">
                  <li>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("Status")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Status
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("Active")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("Inactive")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div> */}

              <div className="dropdown" style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}>
                <button
                  href="javascript:void(0);"
                  className="dropdown-toggle btn-md d-inline-flex align-items-center" type="button" id="statusDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#676767",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "14px",
                    borderRadius: "4px",
                    border: "1px solid #E6E6E6",
                    boxShadow: "rgba(0, 0, 0, 0.25)",
                    padding: "10px",
                  }}
                >
                  {sortOrder}{" "}
                  <img src={IConnie} alt="" style={{ marginLeft: "10px", fontSize: "20px" }} />
                </button>
                <ul className="dropdown-menu  dropdown-menu-end p-1" aria-labelledby="statusDropdown">
                  <li>
                    <button
                      type="button"
                      onClick={() => setSortOrder("Latest")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Latest
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setSortOrder("Ascending")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Ascending
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setSortOrder("Descending")}
                      className="dropdown-item"
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                    >
                      Descending
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable tblerole">
                <thead
                  className="thead-light tblerolethead"
                  style={{ backgroundColor: "#F1F1F1" }}
                >
                  <tr style={{ textAlign: "center" }}>
                    {/* <th className="no-sort">
                      <div className="form-check form-check-md">
                        <input
                          style={{ border: "1px solid #676767" }}
                          className="form-check-input"
                          type="checkbox"
                          id="select-all"
                        />
                      </div>
                    </th> */}
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >Role</th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >Created Date</th>
                    {/* <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >Status</th> */}
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="tbleroletbody">
                  {paginatedRoles.length > 0 ? (
                    paginatedRoles.map((role) => (
                      <tr key={role._id} style={{ textAlign: "center" }}>
                        {/* <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          <div className="form-check form-check-md">
                            <input
                              style={{ border: "1px solid #676767" }}
                              className="form-check-input"
                              type="checkbox"
                            />
                          </div>
                        </td> */}
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >{role.roleName}</td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >{new Date(role.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        </td>
                        {/* <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          <span
                            className={`badge table-badge fw-medium fs-10 ${role.status === "Active" ? "" : ""
                              }`}
                            style={
                              role.status === "Active"
                                ? {
                                  backgroundColor: "#3eb780",
                                  color: "white",
                                  padding: "6px 8px 6px 8px",
                                }
                                : {
                                  backgroundColor: "#ff0000",
                                  color: "white",
                                  padding: "6px 8px 6px 8px",
                                }
                            }
                          >
                            {role.status}
                          </span>
                        </td> */}

                        <td className="action-table-data"
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              // onClick={() =>
                              //   navigate(`/permissions/${role._id}`)
                              // }
                              onClick={() => handleViewPermissions(role.roleName)}
                              title="View"
                            >
                              <TbEye />
                            </a>
                            {/* <a onClick={() => loadRoleForEdit(role._id)}><TbEye /></a> */}

                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-role"
                              onClick={() => handleEditClick(role)}
                              title="Edit"
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDeleteRole(role._id)}
                              title="Delete"
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
            <div className="d-flex justify-content-end align-items-center p-3" style={{ gap: "10px" }}
            >
              <div className="d-flex justify-content-end align-items-center"
                style={{
                  backgroundColor: "white",
                  boxShadow: "rgba #0000000a(0, 0, 0, 0.04) 0px 3px 8px",
                }}
              >
                <label className="me-2">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="form-select w-auto"
                >
                  <option value={10}>10 Per Page</option>
                  <option value={25}>25 Per Page</option>
                  <option value={50}>50 Per Page</option>
                  <option value={100}>100 Per Page</option>
                </select>
              </div>

              {/* Pagination buttons */}
              {/* Pagination buttons */}
              <span
                style={{
                  backgroundColor: "white",
                  boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
                  padding: "7px",
                  borderRadius: "5px",
                  border: "1px solid #e4e0e0ff",
                  color: "gray",
                }}
              >
                {filteredRoles.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    filteredRoles.length
                  )} of ${filteredRoles.length}`}
                <button
                  type="button"
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <GrFormPrevious />
                </button>{" "}
                <button
                  type="button"
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

      <div>
        {/* Add Role */}
        <div className="modal" id="add-role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="p-3">
                <h4
                  style={{
                    color: "#262626",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  Create Role
                </h4>
                <hr
                  style={{ margin: "0", height: "1px", color: "#bdbdbdff" }}
                />
              </div>
              <form onSubmit={handleCreateRole}>
                <div className="modal-body">
                  <div className="mb-3" style={{ position: "relative" }}>
                    <label
                      className="form-label"
                      style={{
                        color: "#262626",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                      }}
                    >
                      Role Name
                    </label>
                    <span className="text-danger ms-1">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Enter user role here"
                      required
                    />
                  </div>
                  <div className="mb-0">
                    {/* i remove this from below div status-toggle modal-status */}
                    {/* <div className=" d-flex flex-column" style={{ gap: '4px' }}>
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          Status
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <div className="dropdown" style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}>
                        <button
                          className="dropdown-toggle btn-md d-inline-flex align-items-center"
                          type="button"
                          id="roleStatus"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#676767",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "14px",
                            borderRadius: "4px",
                            border: "1px solid #E6E6E6",
                            boxShadow: "rgba(0, 0, 0, 0.25)",
                            padding: "10px",
                          }}
                        >
                          {roleStatus ? "Active" : "Inactive"}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="statusDropdown"
                        >
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setRoleStatus(true)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setRoleStatus(false)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "14px",
                    margin: "10px"
                  }}
                >
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    style={{
                      border: "1px solid #E6E6E6",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#FFFFFF",
                      color: "#676767",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      border: "1px solid #676767",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#262626",
                      color: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* /Add Role */}

        {/* Edit Role */}
        <div className="modal" id="edit-role">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="p-3">
                <h4
                  style={{
                    color: "#262626",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  Edit Role
                </h4>
              </div>
              <hr style={{ margin: "0", height: "1px", color: "#bdbdbdff" }} />
              <form onSubmit={handleUpdateRole}>
                <div className="modal-body">
                  <div className="mb-3" style={{ position: "relative" }}>
                    <label
                      style={{
                        color: "#262626",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                      }}
                      className="form-label"
                    >
                      Role Name
                    </label>
                    <span className="text-danger ms-1">*</span>
                    <input
                      type="text"
                      className="form-control"
                      value={editRoleName}
                      onChange={(e) => setEditRoleName(e.target.value)}
                      required
                    />
                    <LiaEditSolid
                      style={{
                        position: "absolute",
                        top: "70%",
                        left: "430px",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    {/* i remove from status-toggle modal-status */}
                    {/* <div className=" d-flex flex-column" style={{ gap: '4px' }}>
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          Status
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <div className="dropdown" style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}>
                        <button
                          className="dropdown-toggle btn-md d-inline-flex align-items-center"
                          type="button"
                          id="statusDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#676767",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "14px",
                            borderRadius: "4px",
                            border: "1px solid #E6E6E6",
                            boxShadow: "rgba(0, 0, 0, 0.25)",
                            padding: "10px",
                          }}
                        >
                          {editRoleStatus ? "Active" : "Inactive"}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="statusDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => setEditRoleStatus(true)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setEditRoleStatus(false)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f3ff'; e.target.style.color = 'black'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = 'initial'; }}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "14px",
                    margin: "10px"
                  }}
                >
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    style={{
                      border: "1px solid #E6E6E6",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#FFFFFF",
                      color: "#676767",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      border: "1px solid #676767",
                      borderRadius: "4px",
                      padding: "8px",
                      backgroundColor: "#262626",
                      color: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                  >
                    Save
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
