import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbEye, TbSearch, TbTrash } from "react-icons/tb";
import BASE_URL from "../../../pages/config/config";
import Select from "react-select";
import { CiCirclePlus } from "react-icons/ci";
// import AddUserModal from "../../../pages/Modal/users/AddUserModal";
import { toast } from "react-toastify";
import "../../../styles/users.css";
import { BiSearch } from "react-icons/bi";
import { BiChevronDown } from "react-icons/bi";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import Iconss from "../../../assets/images/Iconss.png";
import { Country, State, City } from "country-state-city";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

const Users = () => {
  const [activeRoles, setActiveRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); //for active , inactive
  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  // for bulk delete
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // items page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const addHandleIconClick = () => {
    if (addFileInputRef.current) {
      addFileInputRef.current.click();
    } else {
      console.warn("addFileInputRef is null");
    }
  };
  const editHandleIconClick = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.click();
    } else {
      console.warn("editFileInputRef is null");
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [hover, setHover] = useState(false);
  const [hoveroe, setHoveroe] = useState(false);
  const [hovertw, setHovertw] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  console.log(users);
  console.log("Uploaded image:", profileImage?.[0]?.url);

  const [editUserId, setEditUserdId] = useState(null);

  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    status: "Active",
    profileImage: null,
    country: "",
    state: "",
    city: "",
    postalcode: "",
    address: "",
  });

  // for country, state, city
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStateList(State.getStatesOfCountry(selectedCountry));
      setSelectedState(""); // reset when country changes
      setCityList([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setCityList(City.getCitiesOfState(selectedCountry, selectedState));
      setSelectedCity("");
    }
  }, [selectedState]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // ⬅️ Get token from localStorage

      const res = await axios.get(`${BASE_URL}/api/user/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
      console.log("usersss", res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm || !users.length || !activeRoles.length) return users;
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();
      const search = (searchTerm || "").trim().toLowerCase();


      const matchesSearch = fullName.includes(search) || email.includes(search) || phone.includes(search);
      const matchesStatus = selectedStatus
        ? (user.status || "").toLowerCase() === selectedStatus.toLowerCase()
        : true;


      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, users, activeRoles]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, selectedStatus]);

  // items per page
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // validation rules
  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const zipRegex = /^[0-9]{5,6}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!nameRegex.test(firstName)) newErrors.firstName = "Enter a valid first name";
    if (!nameRegex.test(lastName)) newErrors.lastName = "Enter a valid last name";
    if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    if (!phoneRegex.test(phone)) newErrors.phone = "Phone must be 10 digits";
    if (!selectedRole) newErrors.role = "Role is required";
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedCity) newErrors.city = "City is required";
    if (!zipRegex.test(zip)) newErrors.zip = "Postal code must be 5–6 digits";
    // if (address.length < 5) newErrors.address = "Address must be at least 5 characters";
    if (!passwordRegex.test(password))
      newErrors.password = "Password must be 8+ chars, include uppercase, lowercase, number & symbol";
    if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // if (!selectedRole) {
    //   return toast.error("Please select a role.");
    // }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("role", selectedRole.value); // Role ID
    // formData.append("status", status ? "Active" : "Inactive");  //the backend will now set active by default
    formData.append("country", selectedCountry);
    formData.append("state", selectedState);
    formData.append("city", selectedCity);
    formData.append("postalcode", zip);
    formData.append("address", address);

    //  Append image if provided (multiple format, even if only one)
    if (selectedImages.length > 0) {
      selectedImages.forEach((file) => {
        formData.append("profileImage", file); // match backend's `upload.array("profileImage")`
      });
    }

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(`${BASE_URL}/api/user/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User added successfully!");
      console.log("Created user:", res.data);

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setProfileImage(null);
      setSelectedRole(null);
      // setStatus(true); //the backend will now set active by default
      setSelectedImages([]);
      setCountry("");
      setState("");
      setCity("");
      setZip("");
      setAddress("");
      fetchUsers();

      window.$(`#add-user`).modal("hide");
    } catch (error) {
      console.error("User creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const fetchActiveRoles = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/role/getRole/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formattedRoles = res.data.map((role) => ({
        label: role.roleName,
        value: role._id,
      }));
      setActiveRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching active roles", error);
    }
  };

  useEffect(() => {
    fetchActiveRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/user/userDelete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete user");
    }
  };
  const validateUpdateForm = () => {
    let newErrors = {};

    if (!nameRegex.test(editUserData.firstName)) newErrors.firstName = "Enter a valid first name (letters only, min 2 chars)";
    if (!nameRegex.test(editUserData.lastName)) newErrors.lastName = "Enter a valid last name (letters only, min 2 chars)";

    if (!emailRegex.test(editUserData.email)) newErrors.email = "Invalid email format";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserData.email))
      newErrors.email = "Invalid email address";

    if (!phoneRegex.test(editUserData.phone)) newErrors.phone = "Phone must be 10 digits";
    else if (!/^\d{10}$/.test(editUserData.phone))
      newErrors.phone = "Phone must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateUpdateForm()) return;

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData();
      formData.append("firstName", editUserData.firstName);
      formData.append("lastName", editUserData.lastName);
      formData.append("email", editUserData.email);
      formData.append("phone", editUserData.phone);

      // Role handling
      if (editUserData.role?.value) {
        formData.append("role", editUserData.role.value);
      } else if (typeof editUserData.role === "string") {
        formData.append("role", editUserData.role);
      }

      formData.append("status", editUserData.status === true || editUserData.status === "Active"
        ? "Active"
        : "Inactive");

      // ✅ Add location fields
      formData.append("country", editUserData.country);
      formData.append("state", editUserData.state);
      formData.append("city", editUserData.city);
      formData.append("postalcode", editUserData.postalcode);
      formData.append("address", editUserData.address)

      if (
        editUserData.profileImage &&
        typeof editUserData.profileImage !== "string"
      ) {
        formData.append("profileImage", editUserData.profileImage);
      }

      await axios.put(`${BASE_URL}/api/user/update/${editUserId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User updated successfully");
      fetchUsers();
      window.$(`#edit-user`).modal("hide");
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const handleOpenEditModal = (user) => {
    const getMatchingRole = (roleId) => {
      return activeRoles.find((role) => role.value === roleId);
    };
    const roleId =
      typeof user.role === "string"
        ? user.role
        : user.role?._id || user.role?.value;
    const selectedRole = getMatchingRole(roleId);

    // ✅ preload lists
    const countries = Country.getAllCountries();
    const states = user.country ? State.getStatesOfCountry(user.country) : [];
    const cities =
      user.country && user.state
        ? City.getCitiesOfState(user.country, user.state)
        : [];

    setCountryList(countries);
    setStateList(states);
    setCityList(cities);

    setEditUserdId(user._id);

    // // Find the selected role from activeRoles
    // const selectedRole = activeRoles.find(role => role.value === user.role);

    setEditUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: selectedRole || { label: "Unknown Role", value: user.role }, // fallback
      status: user.status ?? "Active",
      // profileImage: null, // only updated if changed
      profileImage:
        typeof user.profileImage === "string"
          ? user.profileImage
          : user.profileImage?.url || null,
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      postalcode: user.postalcode || "",
      address: user.address || "",
    });
  };

  console.log("Filtering:", users.status, selectedStatus);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // check if any file exceeds 1MB
    const oversizedFile = files.find((file) => file.size > 1 * 1024 * 1024);
    if (oversizedFile) {
      toast.error(`File ${oversizedFile.name} exceeds 1MB size limit.`);
      e.target.value = null; // reset input
      return;
    }
    setSelectedImages(files);
  }

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1 * 1024 * 1024) { // 1MB limit
      toast.error(`File ${file.name} exceeds 1MB size limit.`);
      e.target.value = null; // reset input
      return;
    }
    setEditUserData({
      ...editUserData,
      profileImage: file,
    })
  }

  // handle single checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.includes(id) ? prevUsers.filter((userId) => userId !== id) : [...prevUsers, id]
    );
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  }

  // handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.warn("No users selected for deletion");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/user/bulk-delete`, {
        data: { ids: selectedUsers },
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${selectedUsers.length} users deleted successfully`);
      setSelectedUsers([]);
      setSelectAll(false);
      fetchUsers();
    }
    catch (err) {
      console.error(err);
      toast.error("Bulk delete failed");
    }
  }

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 16);
    const tableColumn = ["First Name", "Last Name", "Email", "Role", "Phone", "Status"];
    const tableRows = [];
    filteredUsers.forEach(user => {
      const userData = [
        user.firstName,
        user.lastName,
        user.email,
        user.role?.roleName || "N/A",
        user.phone,
        user.status || "N/A"
      ];
      tableRows.push(userData);
    });
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('user_list.pdf');
  }

  const handleExportExcel = () => {
    const worksheetData = filteredUsers.map(user => ({
      "First Name": user.firstName,
      "Last Name": user.lastName,
      "Email": user.email,
      "Role": user.role?.roleName || "N/A",
      "Phone": user.phone,
      "Status": user.status || "N/A"
    }));
    // create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "user_list.xlsx");
  }

  return (
    <div className="page-wrapper user-wrappe">
      <div className="content">
        <div className="page-header" style={{ marginBottom: "20px" }}>
          <div className="add-item d-flex">
            <div className="page-title">
              <h4
                className=""
                style={{
                  color: "#262626",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                User Management
              </h4>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              {selectedUsers.length > 0 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleBulkDelete}
                  disabled={selectedUsers.length === 0}
                >
                  Delete ({selectedUsers.length})
                </button>
              )
              }
            </li>
            <li>
              <button type="button" onClick={handleExportPDF} className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <button type="button" onClick={handleExportExcel} className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div
            className="page-btn"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.25)",
              backgroundColor: "#1368EC",
              borderRadius: "4px",
              border: "1px solid #1450AE",
            }}
          >
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-user"
              style={{
                padding: "8px",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "14px",
                color: "#FFFFFF",
              }}
            >
              <CiCirclePlus /> Add User
            </a>
          </div>
        </div>
        <hr
          style={{
            margin: "0",
            height: "1px",
            color: "#bdbdbdff",
            marginBottom: "20px",
          }}
        />
        {/* /product list */}
        <div className="card" style={{ border: "none" }}>
          <div
            className="card-header d-flex align-items-center justify-content-between flex-wrap"
            style={{ padding: "16px 0px 16px 0px" }}
          >
            <div className="search-set">
              <div className="search-input">
                <BiSearch
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search user by name ,email or phone"
                  className="search-inputsrch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
              {/* search end */}
            </div>
            <div
              className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3"
              style={{ gap: "10px", alignItems: "center" }}
            >
              <div
                className="dropdown"
                style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
              >
                <button
                  type="button"
                  className="dropdown-toggle btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                  role="button"
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
                  {selectedStatus || "Status"}
                  <BiChevronDown
                    style={{ marginLeft: "10px", fontSize: "20px" }}
                  />
                </button>
                <ul
                  className="dropdown-menu  dropdown-menu-end p-1"
                  aria-labelledby="statusDropdown"
                  style={{ minWidth: "150px" }}
                >
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => setSelectedStatus("")}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e3f3ff";
                        e.target.style.color = "black";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "initial";
                      }}
                      style={{
                        color: "#676767",
                        // padding: "6px 6px",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        backgroundColor:
                          selectedStatus === "Active"
                            ? "#ffff"
                            : hovertw
                              ? "#e3f3ff"
                              : "transparent",
                      }}
                    >
                      Status
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => setSelectedStatus("Active")}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e3f3ff";
                        e.target.style.color = "black";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "initial";
                      }}
                      style={{
                        color: "#676767",
                        // padding: "6px 6px",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        backgroundColor:
                          selectedStatus === "Active"
                            ? "#ffff"
                            : hover
                              ? "#e3f3ff"
                              : "transparent",
                      }}
                    >
                      Active
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => setSelectedStatus("Inactive")}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e3f3ff";
                        e.target.style.color = "black";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "initial";
                      }}
                      style={{
                        color: "#676767",
                        // padding: "6px 6px",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                        backgroundColor:
                          selectedStatus === "Inactive"
                            ? "#ffff"
                            : hoveroe
                              ? "#e3f3ff"
                              : "transparent",
                      }}
                    >
                      Inactive
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div
              className="table-responsive"
              style={{ border: "1px solid #E6E6E6" }}
            >
              <table className="table">
                <thead
                  className="thead-light"
                  style={{ backgroundColor: "#F1F1F1" }}
                >
                  <tr style={{ textAlign: "start" }}>
                    <th className="no-sort">
                      <label className="">
                        <input
                          type="checkbox"
                          id="select-all" checked={selectAll} onChange={handleSelectAll}
                          style={{ border: "1px solid #676767" }}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      User Name
                    </th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      Phone
                    </th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      Role
                    </th>
                    <th
                      style={{
                        color: "#676767",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        fontFamily: 'Roboto", sans-serif',
                      }}
                    >
                      Status
                    </th>
                    <th
                      className="no-sort"
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
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr style={{ textAlign: "start" }}>
                        <td>
                          <label className="">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleCheckboxChange(user._id)}
                              style={{ border: "1px solid #1d1d1dff" }}
                            />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                            textTransform: "capitalize",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span
                              href="javascript:void(0);"
                              className="avatar avatar-md me-2 no-underline"
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                              }}
                            >
                              {user.profileImage && user.profileImage.url ? (
                                <img
                                  src={user.profileImage.url}
                                  alt="Profile"
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div
                                  className=" text-white  d-flex justify-content-center align-items-center"
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "1px solid #E6E6E6",
                                    textDecoration: "none",
                                  }}
                                >
                                  {user.firstName?.charAt(0)}
                                  {user.lastName?.charAt(0)}
                                </div>
                              )}
                            </span>
                            <span>
                              {user.firstName} {user.lastName}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          {user.phone}
                        </td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          <span
                            className="email"
                            style={{ textDecoration: "none" }}
                          >
                            {user.email}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          {user.role?.roleName}
                        </td>
                        <td
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          {/*  */}
                          <span
                            className={`badge table-badge fw-medium fs-10 ${user.status === "Active" ? "" : ""
                              }`}
                            style={
                              user.status === "Active"
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
                            {user.status}
                          </span>
                          {/*  */}
                        </td>
                        <td
                          className="action-table-data"
                          style={{
                            color: "#262626",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "14px",
                            fontFamily: 'Roboto", sans-serif',
                          }}
                        >
                          <div className="d-flex" style={{ cursor: "pointer" }}>
                            {/* <a className="me-2 p-2">
                              <TbEye />
                            </a> */}
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-user"
                              onClick={() => handleOpenEditModal(user)}
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() => handleDelete(user._id)}
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        style={{
                          color: "#262626",
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "14px",
                          fontFamily: 'Roboto", sans-serif',
                        }}
                        colSpan="6"
                        className="text-center text-muted"
                      >
                        No Users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/*  */}
              <div
                className="d-flex justify-content-end gap-3"
                style={{ padding: "10px 20px" }}
              >
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
                  {filteredUsers.length === 0
                    ? "0 of 0"
                    : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredUsers.length
                    )} of ${filteredUsers.length}`}
                  <button
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
              {/*  */}
            </div>
          </div>
        </div>
        {/* /product list */}

        {/* Add User */}
        <div className="modal" id="add-user">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "970px" }}
          >
            <div
              className="modal-content"
              style={{
                padding: "10px",
              }}
            >
              <div className="page-wrapper-new p-0 pb-5">
                <div className="">
                  <div className="page-title">
                    <h4
                      style={{
                        color: "#262626",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                      }}
                    >
                      Add User
                    </h4>
                  </div>
                  <hr style={{ height: "1px", color: "#bbbbbb" }} />
                </div>
                <form onSubmit={handleAddUser} style={{ padding: "0px 20px" }}>
                  {/* immg */}

                  {/*  */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "2px dashed #dadadaff",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="add-image-circle"
                      style={{
                        display: "flex",
                        border: "2px dashed #dadadaff",
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "grey",
                        cursor: "pointer",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      {selectedImages.length > 0 ? (
                        <img
                          src={URL.createObjectURL(selectedImages[0])}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <>
                          <span
                            style={{
                              color: "#676767",
                              fontSize: "32px",
                              fontWeight: 400,
                              lineHeight: "18px",
                            }}
                          >
                            +
                          </span>
                        </>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={addFileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                          textAlign: "center",
                          backgroundColor: " #E3F3FF",
                          color: "#1368EC",
                          border: "1px solid #BBE1FF",
                          borderRadius: "15px",
                          width: "150px",
                          height: "45px",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={Iconss}
                          alt=""
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span
                          onClick={addHandleIconClick}
                          className="setting-imgupload-btn"
                        >
                          Upload Image
                        </span>
                      </div>
                      <p
                        style={{
                          color: "#888888",
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: 400,
                          fontSize: "12px",
                          marginTop: "10px",
                        }}
                      >
                        Upload an image below 1MB, Accepted File format JPG, PNG
                      </p>
                    </div>

                    <div className="invisible">;lpk</div>
                  </div>
                  {/*  */}

                  <div>
                    {/* fname lname */}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <span>
                            <label
                              className="ffrrstname"
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "14px",
                              }}
                            >
                              First Name
                            </label>
                            <span className="text-danger ms-1">*</span>
                          </span>
                          <input
                            type="text"
                            className="ffrrstnameinput"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                          />
                          {errors.firstName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</p>}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <span>
                            <label
                              className="ffrrstname"
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "14px",
                              }}
                            >
                              Last Name
                            </label>
                            <span className="text-danger ms-1">*</span>
                          </span>
                          <input
                            type="text"
                            className="ffrrstnameinput"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                          />
                          {errors.lastName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</p>}
                        </div>
                      </div>
                    </div>
                    {/* fname lname end*/}

                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          flex: "0 0 50%",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <span>
                            <label
                              className="ffrrstname"
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "14px",
                              }}
                            >
                              Role
                            </label>
                            <span className="text-danger ms-1">*</span>
                          </span>
                          <Select
                            options={activeRoles}
                            value={selectedRole}
                            onChange={setSelectedRole}
                            placeholder="select a role..."
                            isSearchable
                            required
                            // style={{
                            //   backgroundColor: "#FBFBFB",
                            //   color: "#676767",
                            //   fontSize: "14px",
                            //   fontWeight: 400,
                            //   lineHeight: "18px"
                            // }}
                            styles={{
                              control: (base) => ({
                                ...base,
                                backgroundColor: "#FBFBFB",
                                border: "1px solid #C2C2C2",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#676767",
                                outline: "none",
                              }),
                            }}
                          />
                          {errors.role && <p style={{ color: 'red', fontSize: '12px' }}>{errors.role}</p>}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: "0 0 48%",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: "5px",
                            }}
                          >
                            <span>
                              <label
                                className="ffrrstname"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  lineHeight: "14px",
                                }}
                              >
                                Email
                              </label>
                              <span className="text-danger ms-1">*</span>
                            </span>
                            <input
                              type="email"
                              className="ffrrstnameinput"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                            {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: "5px",
                            }}
                          >
                            <span>
                              <label
                                className="ffrrstname"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  lineHeight: "14px",
                                }}
                              >
                                Phone
                              </label>
                              <span className="text-danger ms-1">*</span>
                            </span>
                            <input
                              type="tel"
                              className="ffrrstnameinput"
                              name="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Enter your 10 digit number"
                              required
                            />
                            {errors.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* country start */}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          width: "25%",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Country
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <select
                          className="ffrrstnameinput"
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          style={{
                            backgroundColor: "#FBFBFB",
                            border: "1px solid #C2C2C2",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#676767",
                            outline: "none",
                          }}
                        >
                          <option value="">Select Country</option>
                          {countryList.map((country) => (
                            <option
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          width: "25%",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            State
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <select
                          className="ffrrstnameinput"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          disabled={!selectedCountry}
                          style={{
                            backgroundColor: "#FBFBFB",
                            border: "1px solid #C2C2C2",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#676767",
                            outline: "none",
                          }}
                        >
                          <option value="">Select State</option>
                          {stateList.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          width: "25%",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            City
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="ffrrstnameinput"
                          style={{
                            backgroundColor: "#FBFBFB",
                            border: "1px solid #C2C2C2",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#676767",
                            outline: "none",
                          }}
                        >
                          <option value="">Selected City</option>
                          {cityList.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          width: "25%",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Postal Code
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <input
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="ffrrstnameinput"
                          placeholder="Enter Postal Code"
                          type="number"
                          style={{
                            backgroundColor: "#FBFBFB",
                            border: "1px solid #C2C2C2",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#676767",
                            outline: "none",
                          }}
                        />
                        {errors.zip && <p style={{ color: 'red', fontSize: '12px' }}>{errors.zip}</p>}
                      </div>
                    </div>
                    {/* country end */}
                    {/* address start */}
                    <div style={{ flex: 1, marginBottom: "20px", }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          Address
                        </label>
                        <textarea
                          type="text"
                          className="ffrrstnameinput"
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your permanent Address(optional)"

                        />
                        {errors.address && <p style={{ color: 'red', fontSize: '12px' }}>{errors.address}</p>}
                      </div>
                    </div>
                    {/* address end */}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          flex: "0 0 50%",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        <div style={{ flex: "1" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: "5px",
                            }}
                          >
                            <span>
                              <label
                                className="ffrrstname"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  lineHeight: "14px",
                                }}
                              >
                                Password
                              </label>
                              <span className="text-danger ms-1">*</span>
                            </span>
                            <input
                              type="password"
                              className="ffrrstnameinput"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your Password"
                              required
                            />
                            {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
                          </div>
                        </div>
                        <div style={{ flex: "1" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: "5px",
                            }}
                          >
                            <span>
                              <label
                                className="ffrrstname"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  lineHeight: "14px",
                                }}
                              >
                                Confirm Password
                              </label>
                              <span className="text-danger ms-1">*</span>
                            </span>
                            <input
                              type="password"
                              className="ffrrstnameinput"
                              name="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="confirm your Password"
                              required
                            />
                            {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</p>}
                            <i className="ti ti-eye-off toggle-password" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div
                      style={{
                        flex: "0 0 50%",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
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
                        <div
                          className="dropdown"
                          style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
                        >
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
                            {status ? "Active" : "Inactive"}
                            <BiChevronDown
                              style={{ marginLeft: "10px", fontSize: "20px" }}
                            />
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-end p-1"
                            aria-labelledby="statusDropdown"
                            style={{ marginLeft: "10px" }}
                          >
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => setStatus(true)}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#e3f3ff";
                                  e.target.style.color = "black";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "white";
                                  e.target.style.color = "initial";
                                }}
                              >
                                Active
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => setStatus(false)}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#e3f3ff";
                                  e.target.style.color = "black";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "white";
                                  e.target.style.color = "initial";
                                }}
                              >
                                Inactive
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
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
                    }}
                  >
                    <button
                      // className="settingbtn"
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
                      // className="settingbtn"
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
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal Component */}
        {/* <AddUserModal
        activeRoles={activeRoles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      /> */}

        {/* Edit User */}
        <div className="modal" id="edit-user">
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "970px" }}
          >
            <div className="modal-content" style={{ padding: "10px" }}>
              <div className="page-wrapper-new p-0 pb-5">
                <div className="">
                  <div className="page-title">
                    <h4
                      style={{
                        color: "#262626",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "14px",
                      }}
                    >
                      Edit User
                    </h4>
                  </div>
                  <hr style={{ height: "1px", color: "#bbbbbb" }} />
                </div>
                <form onSubmit={handleUpdate} style={{ padding: "0px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "2px dashed #dadadaff",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Circle Image Preview */}
                    <div
                      className="add-image-circle"
                      style={{
                        border: "2px solid #007bff",
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "grey",
                        cursor: "pointer",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                      onClick={() => editFileInputRef.current.click()} // clicking circle opens file picker
                    >
                      {editUserData.profileImage ? (
                        <img
                          src={
                            typeof editUserData.profileImage === "string"
                              ? editUserData.profileImage
                              : URL.createObjectURL(editUserData.profileImage)
                          }
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: "#676767",
                            fontSize: "32px",
                            fontWeight: 400,
                            lineHeight: "18px",
                          }}
                        >
                          +
                        </span>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={editFileInputRef}
                      style={{ display: "none" }}
                      onChange={handleEditFileChange}
                    />

                    {/* Upload button + hint */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                          textAlign: "center",
                          backgroundColor: "#E3F3FF",
                          color: "#1368EC",
                          border: "1px solid #BBE1FF",
                          borderRadius: "15px",
                          width: "150px",
                          height: "45px",
                          cursor: "pointer",
                        }}
                        onClick={() => editFileInputRef.current.click()}
                      >
                        <img
                          src={Iconss} // your upload icon
                          alt=""
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span className="setting-imgupload-btn">
                          Change Image
                        </span>
                      </div>

                      <p
                        style={{
                          color: "#888888",
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: 400,
                          fontSize: "12px",
                          marginTop: "10px",
                        }}
                      >
                        Upload an image below 1MB, Accepted File format JPG, PNG
                      </p>
                    </div>

                    {/* filler to balance flex (like your invisible div) */}
                    <div className="invisible">.</div>
                  </div>


                  {/* First Name */}
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            First Name{" "}
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <input
                          type="text"
                          className="ffrrstnameinput"
                          value={editUserData.firstName}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              firstName: e.target.value,
                            })
                          }
                        />
                        {errors.firstName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</p>}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Last Name{" "}
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <input
                          type="text"
                          className="ffrrstnameinput"
                          value={editUserData.lastName}
                          onChange={(e) =>
                            setEditUserData({
                              ...editUserData,
                              lastName: e.target.value,
                            })
                          }
                        />
                        {errors.lastName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: "0 0 50%",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          gap: "5px",
                        }}
                      >
                        <span>
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Role
                          </label>
                          <span className="text-danger ms-1">*</span>
                        </span>
                        <Select
                          options={activeRoles}
                          value={editUserData.role}
                          isDisabled={
                            editUserData.role.label === "Unknown Role"
                          }
                          onChange={(selectedOption) => {
                            setEditUserData({
                              ...editUserData,
                              role: selectedOption,
                            });
                          }}
                          placeholder="Search or select a role..."
                          isSearchable
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "#FBFBFB",
                              border: "1px solid #C2C2C2",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#676767",
                              outline: "none",
                            }),
                          }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      style={{
                        flex: "0 0 48%",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <span>
                            <label
                              className="ffrrstname"
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "14px",
                              }}
                            >
                              Email{" "}
                            </label>
                            <span className="text-danger ms-1">*</span>
                          </span>
                          <input
                            type="email"
                            className="ffrrstnameinput"
                            value={editUserData.email}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                email: e.target.value,
                              })
                            }
                          />
                          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
                        </div>
                      </div>

                      {/* Phone */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <span>
                            <label
                              className="ffrrstname"
                              style={{
                                fontWeight: "400",
                                fontSize: "14px",
                                lineHeight: "14px",
                              }}
                            >
                              Phone{" "}
                            </label>
                            <span className="text-danger ms-1">*</span>
                          </span>
                          <input
                            type="tel"
                            className="ffrrstnameinput"
                            value={editUserData.phone}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                phone: e.target.value,
                              })
                            }
                          />
                          {errors.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* country start */}
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "25%",
                      }}
                    >
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          Country
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <select
                        className="ffrrstnameinput"
                        value={editUserData.country}
                        onChange={(e) => {
                          const countryCode = e.target.value;
                          setEditUserData({
                            ...editUserData,
                            country: countryCode,
                            state: "", // reset when country changes
                            city: "",
                          });
                          setStateList(State.getStatesOfCountry(countryCode));
                          setCityList([]);
                        }}
                        style={{
                          backgroundColor: "#FBFBFB",
                          border: "1px solid #C2C2C2",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#676767",
                          outline: "none",
                        }}
                      >
                        <option value="">Select Country</option>
                        {countryList.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "25%",
                      }}
                    >
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          State
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <select
                        className="ffrrstnameinput"
                        value={editUserData.state}
                        onChange={(e) => {
                          const stateCode = e.target.value;
                          setEditUserData({
                            ...editUserData,
                            state: stateCode,
                            city: "",
                          });
                          setCityList(
                            City.getCitiesOfState(
                              editUserData.country,
                              stateCode
                            )
                          );
                        }}
                        disabled={!editUserData.country}
                        style={{
                          backgroundColor: "#FBFBFB",
                          border: "1px solid #C2C2C2",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#676767",
                          outline: "none",
                        }}
                      >
                        <option value="">Select State</option>
                        {stateList.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "25%",
                      }}
                    >
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          City
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <select
                        value={editUserData.city}
                        onChange={(e) => setEditUserData({ ...editUserData, city: e.target.value })}

                        className="ffrrstnameinput"
                        style={{
                          backgroundColor: "#FBFBFB",
                          border: "1px solid #C2C2C2",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#676767",
                          outline: "none",
                        }}
                      >
                        <option value="">Selected City</option>
                        {cityList.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        width: "25%",
                      }}
                    >
                      <span>
                        <label
                          className="ffrrstname"
                          style={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "14px",
                          }}
                        >
                          Postal Code
                        </label>
                        <span className="text-danger ms-1">*</span>
                      </span>
                      <input
                        value={editUserData.postalcode}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            postalcode: e.target.value,
                          })
                        }
                        className="ffrrstnameinput"
                        placeholder="800007"
                        type="number"
                        style={{
                          backgroundColor: "#FBFBFB",
                          border: "1px solid #C2C2C2",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#676767",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                  {/* country end */}
                  {/* address start */}
                  <div style={{ flex: 1, marginBottom: "20px", }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "5px",
                      }}
                    >
                      <label
                        className="ffrrstname"
                        style={{
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "14px",
                        }}
                      >
                        Address
                      </label>
                      <textarea
                        type="text"
                        className="ffrrstnameinput"
                        name="address"
                        value={editUserData.address}
                        onChange={(e) =>
                          setEditUserData({
                            ...editUserData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Address"
                      />
                    </div>
                  </div>
                  {/* address end */}
                  {/* Password */}
                  {/* <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: "0 0 50%",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Password{" "}
                          </label>
                          <input
                            type="password"
                            className="ffrrstnameinput"
                            value={editUserData.password}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                   
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: "5px",
                          }}
                        >
                          <label
                            className="ffrrstname"
                            style={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "14px",
                            }}
                          >
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            className="ffrrstnameinput"
                            value={editUserData.confirmPassword}
                            onChange={(e) =>
                              setEditUserData({
                                ...editUserData,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Status */}
                  <div
                    style={{
                      flex: "0 0 50%",
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    <div style={{ flex: "1" }}>
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
                      <div
                        className="dropdown"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
                      >
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
                          {editUserData.status === "Active" ? "Active" : "Inactive"}
                          <BiChevronDown
                            style={{ marginLeft: "10px", fontSize: "20px" }}
                          />
                        </button>
                        <ul
                          className="dropdown-menu dropdown-menu-end p-1"
                          aria-labelledby="statusDropdown"
                          style={{ marginLeft: "10px" }}
                        >
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() =>
                                setEditUserData({
                                  ...editUserData,
                                  status: "Active",
                                })
                              }
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#e3f3ff";
                                e.target.style.color = "black";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.color = "initial";
                              }}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() =>
                                setEditUserData({
                                  ...editUserData,
                                  status: "Inactive",
                                })
                              }
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#e3f3ff";
                                e.target.style.color = "black";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.color = "initial";
                              }}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
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
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;




// import axios from "axios";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbEye, TbSearch, TbTrash } from "react-icons/tb";
// import BASE_URL from "../../../pages/config/config";
// import Select from "react-select";
// import { CiCirclePlus } from "react-icons/ci";
// // import AddUserModal from "../../../pages/Modal/users/AddUserModal";
// import { toast } from "react-toastify";
// import "../../../styles/users.css";
// import { BiSearch } from "react-icons/bi";
// import { BiChevronDown } from "react-icons/bi";
// import { GrFormPrevious } from "react-icons/gr";
// import { MdNavigateNext } from "react-icons/md";
// import Iconss from "../../../assets/images/Iconss.png";
// import { Country, State, City } from "country-state-city";
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import Papa from 'papaparse';
// import * as XLSX from 'xlsx';
// import { saveAs } from "file-saver";

// const Users = () => {
//   const [activeRoles, setActiveRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState(""); //for active , inactive
//   const addFileInputRef = useRef(null);
//   const editFileInputRef = useRef(null);
//   // for bulk delete
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);

//   // items page
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const addHandleIconClick = () => {
//     if (addFileInputRef.current) {
//       addFileInputRef.current.click();
//     } else {
//       console.warn("addFileInputRef is null");
//     }
//   };
//   const editHandleIconClick = () => {
//     if (editFileInputRef.current) {
//       editFileInputRef.current.click();
//     } else {
//       console.warn("editFileInputRef is null");
//     }
//   };

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [country, setCountry] = useState("");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [zip, setZip] = useState("");
//   const [address, setAddress] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [status, setStatus] = useState(true);
//   const [profileImage, setProfileImage] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [hover, setHover] = useState(false);
//   const [hoveroe, setHoveroe] = useState(false);
//   const [hovertw, setHovertw] = useState(false);

//   const [selectedImages, setSelectedImages] = useState([]);
//   console.log(users);
//   console.log("Uploaded image:", profileImage?.[0]?.url);

//   const [editUserId, setEditUserdId] = useState(null);

//   const [editUserData, setEditUserData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     role: "",
//     password: "",
//     confirmPassword: "",
//     status: "Active",
//     profileImage: null,
//     country: "",
//     state: "",
//     city: "",
//     postalcode: "",
//     address: "",
//   });

//   // for country, state, city
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   useEffect(() => {
//     setCountryList(Country.getAllCountries());
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       setStateList(State.getStatesOfCountry(selectedCountry));
//       setSelectedState(""); // reset when country changes
//       setCityList([]);
//       setSelectedCity("");
//     }
//   }, [selectedCountry]);

//   useEffect(() => {
//     if (selectedState) {
//       setCityList(City.getCitiesOfState(selectedCountry, selectedState));
//       setSelectedCity("");
//     }
//   }, [selectedState]);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token"); // ⬅️ Get token from localStorage

//       const res = await axios.get(`${BASE_URL}/api/user/getuser`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUsers(res.data);
//       console.log("usersss", res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch users");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filteredUsers = useMemo(() => {
//     if (!searchTerm || !users.length || !activeRoles.length) return users;
//     return users.filter((user) => {
//       const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
//       const email = (user.email || "").toLowerCase();
//       const phone = (user.phone || "").toLowerCase();
//       const search = (searchTerm || "").trim().toLowerCase();


//       const matchesSearch = fullName.includes(search) || email.includes(search) || phone.includes(search);
//       const matchesStatus = selectedStatus
//         ? (user.status || "").toLowerCase() === selectedStatus.toLowerCase()
//         : true;


//       return matchesSearch && matchesStatus;
//     });
//   }, [searchTerm, selectedStatus, users, activeRoles]);

//   useEffect(() => {
//     setCurrentPage(1); // Reset to first page on filter change
//   }, [searchTerm, selectedStatus]);

//   // items per page
//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // validation rules
//   const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^[0-9]{10}$/;
//   const zipRegex = /^[0-9]{5,6}$/;
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     let newErrors = {};

//     if (!nameRegex.test(firstName)) newErrors.firstName = "Enter a valid first name";
//     if (!nameRegex.test(lastName)) newErrors.lastName = "Enter a valid last name";
//     if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
//     if (!phoneRegex.test(phone)) newErrors.phone = "Phone must be 10 digits";
//     if (!selectedRole) newErrors.role = "Role is required";
//     if (!selectedCountry) newErrors.country = "Country is required";
//     if (!selectedState) newErrors.state = "State is required";
//     if (!selectedCity) newErrors.city = "City is required";
//     if (!zipRegex.test(zip)) newErrors.zip = "Postal code must be 5–6 digits";
//     // if (address.length < 5) newErrors.address = "Address must be at least 5 characters";
//     if (!passwordRegex.test(password))
//       newErrors.password = "Password must be 8+ chars, include uppercase, lowercase, number & symbol";
//     if (confirmPassword !== password)
//       newErrors.confirmPassword = "Passwords do not match";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     // if (!selectedRole) {
//     //   return toast.error("Please select a role.");
//     // }

//     const formData = new FormData();
//     formData.append("firstName", firstName);
//     formData.append("lastName", lastName);
//     formData.append("email", email);
//     formData.append("phone", phone);
//     formData.append("password", password);
//     formData.append("confirmPassword", confirmPassword);
//     formData.append("role", selectedRole.value); // Role ID
//     // formData.append("status", status ? "Active" : "Inactive");  //the backend will now set active by default
//     formData.append("country", selectedCountry);
//     formData.append("state", selectedState);
//     formData.append("city", selectedCity);
//     formData.append("postalcode", zip);
//     formData.append("address", address);

//     //  Append image if provided (multiple format, even if only one)
//     if (selectedImages.length > 0) {
//       selectedImages.forEach((file) => {
//         formData.append("profileImage", file); // match backend's `upload.array("profileImage")`
//       });
//     }

//     try {
//       const token = localStorage.getItem("token")
//       const res = await axios.post(`${BASE_URL}/api/user/add`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("User added successfully!");
//       console.log("Created user:", res.data);

//       // Reset form
//       setFirstName("");
//       setLastName("");
//       setEmail("");
//       setPhone("");
//       setPassword("");
//       setConfirmPassword("");
//       setProfileImage(null);
//       setSelectedRole(null);
//       // setStatus(true); //the backend will now set active by default
//       setSelectedImages([]);
//       setCountry("");
//       setState("");
//       setCity("");
//       setZip("");
//       setAddress("");
//       fetchUsers();

//       window.$(`#add-user`).modal("hide");
//     } catch (error) {
//       console.error("User creation failed:", error);
//       toast.error(error.response?.data?.message || "Failed to add user");
//     }
//   };

//   const fetchActiveRoles = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const res = await axios.get(`${BASE_URL}/api/role/getRole/active`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const formattedRoles = res.data.map((role) => ({
//         label: role.roleName,
//         value: role._id,
//       }));
//       setActiveRoles(formattedRoles);
//     } catch (error) {
//       console.error("Error fetching active roles", error);
//     }
//   };

//   useEffect(() => {
//     fetchActiveRoles();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       const token = localStorage.getItem("token")
//       await axios.delete(`${BASE_URL}/api/user/userDelete/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("User deleted");
//       fetchUsers();
//     } catch (err) {
//       console.log(err);

//       toast.error("Failed to delete user");
//     }
//   };
//   const validateUpdateForm = () => {
//     let newErrors = {};

//     if (!nameRegex.test(editUserData.firstName)) newErrors.firstName = "Enter a valid first name (letters only, min 2 chars)";
//     if (!nameRegex.test(editUserData.lastName)) newErrors.lastName = "Enter a valid last name (letters only, min 2 chars)";

//     if (!emailRegex.test(editUserData.email)) newErrors.email = "Invalid email format";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUserData.email))
//       newErrors.email = "Invalid email address";

//     if (!phoneRegex.test(editUserData.phone)) newErrors.phone = "Phone must be 10 digits";
//     else if (!/^\d{10}$/.test(editUserData.phone))
//       newErrors.phone = "Phone must be 10 digits";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!validateUpdateForm()) return;

//     try {
//       const token = localStorage.getItem("token")
//       const formData = new FormData();
//       formData.append("firstName", editUserData.firstName);
//       formData.append("lastName", editUserData.lastName);
//       formData.append("email", editUserData.email);
//       formData.append("phone", editUserData.phone);

//       // Role handling
//       if (editUserData.role?.value) {
//         formData.append("role", editUserData.role.value);
//       } else if (typeof editUserData.role === "string") {
//         formData.append("role", editUserData.role);
//       }

//       formData.append("status", editUserData.status === true || editUserData.status === "Active"
//         ? "Active"
//         : "Inactive");

//       // ✅ Add location fields
//       formData.append("country", editUserData.country);
//       formData.append("state", editUserData.state);
//       formData.append("city", editUserData.city);
//       formData.append("postalcode", editUserData.postalcode);
//       formData.append("address", editUserData.address)

//       if (
//         editUserData.profileImage &&
//         typeof editUserData.profileImage !== "string"
//       ) {
//         formData.append("profileImage", editUserData.profileImage);
//       }

//       await axios.put(`${BASE_URL}/api/user/update/${editUserId}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("User updated successfully");
//       fetchUsers();
//       window.$(`#edit-user`).modal("hide");
//     } catch (error) {
//       toast.error("Failed to update user");
//       console.error(error);
//     }
//   };

//   const handleOpenEditModal = (user) => {
//     const getMatchingRole = (roleId) => {
//       return activeRoles.find((role) => role.value === roleId);
//     };
//     const roleId =
//       typeof user.role === "string"
//         ? user.role
//         : user.role?._id || user.role?.value;
//     const selectedRole = getMatchingRole(roleId);

//     // ✅ preload lists
//     const countries = Country.getAllCountries();
//     const states = user.country ? State.getStatesOfCountry(user.country) : [];
//     const cities =
//       user.country && user.state
//         ? City.getCitiesOfState(user.country, user.state)
//         : [];

//     setCountryList(countries);
//     setStateList(states);
//     setCityList(cities);

//     setEditUserdId(user._id);

//     // // Find the selected role from activeRoles
//     // const selectedRole = activeRoles.find(role => role.value === user.role);

//     setEditUserData({
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       role: selectedRole || { label: "Unknown Role", value: user.role }, // fallback
//       status: user.status ?? "Active",
//       // profileImage: null, // only updated if changed
//       profileImage:
//         typeof user.profileImage === "string"
//           ? user.profileImage
//           : user.profileImage?.url || null,
//       country: user.country || "",
//       state: user.state || "",
//       city: user.city || "",
//       postalcode: user.postalcode || "",
//       address: user.address || "",
//     });
//   };

//   console.log("Filtering:", users.status, selectedStatus);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     // check if any file exceeds 1MB
//     const oversizedFile = files.find((file) => file.size > 1 * 1024 * 1024);
//     if (oversizedFile) {
//       toast.error(`File ${oversizedFile.name} exceeds 1MB size limit.`);
//       e.target.value = null; // reset input
//       return;
//     }
//     setSelectedImages(files);
//   }

//   const handleEditFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size > 1 * 1024 * 1024) { // 1MB limit
//       toast.error(`File ${file.name} exceeds 1MB size limit.`);
//       e.target.value = null; // reset input
//       return;
//     }
//     setEditUserData({
//       ...editUserData,
//       profileImage: file,
//     })
//   }

//   // handle single checkbox toggle
//   const handleCheckboxChange = (id) => {
//     setSelectedUsers((prevUsers) =>
//       prevUsers.includes(id) ? prevUsers.filter((userId) => userId !== id) : [...prevUsers, id]
//     );
//   }

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(paginatedUsers.map((user) => user._id));
//     }
//     setSelectAll(!selectAll);
//   }

//   // handle bulk delete
//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) {
//       toast.warn("No users selected for deletion");
//       return;
//     }
//     if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${BASE_URL}/api/user/bulk-delete`, {
//         data: { ids: selectedUsers },
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       toast.success(`${selectedUsers.length} users deleted successfully`);
//       setSelectedUsers([]);
//       setSelectAll(false);
//       fetchUsers();
//     }
//     catch (err) {
//       console.error(err);
//       toast.error("Bulk delete failed");
//     }
//   }

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("User List", 14, 16);
//     const tableColumn = ["First Name", "Last Name", "Email", "Role", "Phone", "Status"];
//     const tableRows = [];
//     filteredUsers.forEach(user => {
//       const userData = [
//         user.firstName,
//         user.lastName,
//         user.email,
//         user.role?.roleName || "N/A",
//         user.phone,
//         user.status || "N/A"
//       ];
//       tableRows.push(userData);
//     });
//     autoTable(doc, {
//       startY: 20,
//       head: [tableColumn],
//       body: tableRows,
//     });
//     doc.save('user_list.pdf');
//   }

//   const handleExportExcel = () => {
//     const worksheetData = filteredUsers.map(user => ({
//       "First Name": user.firstName,
//       "Last Name": user.lastName,
//       "Email": user.email,
//       "Role": user.role?.roleName || "N/A",
//       "Phone": user.phone,
//       "Status": user.status || "N/A"
//     }));
//     // create worksheet
//     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "user_list.xlsx");
//   }

//   return (
//     <div className="page-wrapper user-wrappe">
//       <div className="content">
//         <div className="page-header" style={{ marginBottom: "20px" }}>
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4
//                 className=""
//                 style={{
//                   color: "#262626",
//                   fontSize: "14px",
//                   fontWeight: 400,
//                   lineHeight: "14px",
//                 }}
//               >
//                 User Management
//               </h4>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <li>
//               {selectedUsers.length > 0 && (
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={handleBulkDelete}
//                   disabled={selectedUsers.length === 0}
//                 >
//                   Delete ({selectedUsers.length})
//                 </button>
//               )
//               }
//             </li>
//             <li>
//               <button type="button" onClick={handleExportPDF} className="icon-btn" title="Pdf">
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <button type="button" onClick={handleExportExcel} className="icon-btn" title="Export Excel">
//                 <FaFileExcel />
//               </button>
//             </li>
//           </div>
//           <div
//             className="page-btn"
//             style={{
//               boxShadow: "rgba(0, 0, 0, 0.25)",
//               backgroundColor: "#1368EC",
//               borderRadius: "4px",
//               border: "1px solid #1450AE",
//             }}
//           >
//             <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-user"
//               style={{
//                 padding: "8px",
//                 fontSize: "16px",
//                 fontWeight: 400,
//                 lineHeight: "14px",
//                 color: "#FFFFFF",
//               }}
//             >
//               <CiCirclePlus /> Add User
//             </a>
//           </div>
//         </div>
//         <hr
//           style={{
//             margin: "0",
//             height: "1px",
//             color: "#bdbdbdff",
//             marginBottom: "20px",
//           }}
//         />
//         {/* /product list */}
//         <div className="card" style={{ border: "none" }}>
//           <div
//             className="card-header d-flex align-items-center justify-content-between flex-wrap"
//             style={{ padding: "16px 0px 16px 0px" }}
//           >
//             <div className="search-set">
//               <div className="search-input">
//                 <BiSearch
//                   style={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "10px",
//                     transform: "translateY(-50%)",
//                     zIndex: 1,
//                     pointerEvents: "none",
//                   }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search user by name ,email or phone"
//                   className="search-inputsrch"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{ paddingLeft: "40px" }}
//                 />
//               </div>
//               {/* search end */}
//             </div>
//             <div
//               className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3"
//               style={{ gap: "10px", alignItems: "center" }}
//             >
//               <div
//                 className="dropdown"
//                 style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
//               >
//                 <button
//                   type="button"
//                   className="dropdown-toggle btn-md d-inline-flex align-items-center"
//                   data-bs-toggle="dropdown"
//                   role="button"
//                   style={{
//                     backgroundColor: "#ffffff",
//                     color: "#676767",
//                     fontWeight: 400,
//                     fontSize: "14px",
//                     lineHeight: "14px",
//                     borderRadius: "4px",
//                     border: "1px solid #E6E6E6",
//                     boxShadow: "rgba(0, 0, 0, 0.25)",
//                     padding: "10px",
//                   }}
//                 >
//                   {selectedStatus || "Status"}
//                   <BiChevronDown
//                     style={{ marginLeft: "10px", fontSize: "20px" }}
//                   />
//                 </button>
//                 <ul
//                   className="dropdown-menu  dropdown-menu-end p-1"
//                   aria-labelledby="statusDropdown"
//                   style={{ minWidth: "150px" }}
//                 >
//                   <li>
//                     <button
//                       type="button"
//                       className="dropdown-item rounded-1"
//                       onClick={() => setSelectedStatus("")}
//                       onMouseOver={(e) => {
//                         e.target.style.backgroundColor = "#e3f3ff";
//                         e.target.style.color = "black";
//                       }}
//                       onMouseOut={(e) => {
//                         e.target.style.backgroundColor = "white";
//                         e.target.style.color = "initial";
//                       }}
//                       style={{
//                         color: "#676767",
//                         // padding: "6px 6px",
//                         fontSize: "14px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                         backgroundColor:
//                           selectedStatus === "Active"
//                             ? "#ffff"
//                             : hovertw
//                               ? "#e3f3ff"
//                               : "transparent",
//                       }}
//                     >
//                       Status
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       type="button"
//                       className="dropdown-item"
//                       onClick={() => setSelectedStatus("Active")}
//                       onMouseOver={(e) => {
//                         e.target.style.backgroundColor = "#e3f3ff";
//                         e.target.style.color = "black";
//                       }}
//                       onMouseOut={(e) => {
//                         e.target.style.backgroundColor = "white";
//                         e.target.style.color = "initial";
//                       }}
//                       style={{
//                         color: "#676767",
//                         // padding: "6px 6px",
//                         fontSize: "14px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                         backgroundColor:
//                           selectedStatus === "Active"
//                             ? "#ffff"
//                             : hover
//                               ? "#e3f3ff"
//                               : "transparent",
//                       }}
//                     >
//                       Active
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       type="button"
//                       className="dropdown-item"
//                       onClick={() => setSelectedStatus("Inactive")}
//                       onMouseOver={(e) => {
//                         e.target.style.backgroundColor = "#e3f3ff";
//                         e.target.style.color = "black";
//                       }}
//                       onMouseOut={(e) => {
//                         e.target.style.backgroundColor = "white";
//                         e.target.style.color = "initial";
//                       }}
//                       style={{
//                         color: "#676767",
//                         // padding: "6px 6px",
//                         fontSize: "14px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                         backgroundColor:
//                           selectedStatus === "Inactive"
//                             ? "#ffff"
//                             : hoveroe
//                               ? "#e3f3ff"
//                               : "transparent",
//                       }}
//                     >
//                       Inactive
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="card-body p-0">
//             <div
//               className="table-responsive"
//               style={{ border: "1px solid #E6E6E6" }}
//             >
//               <table className="table">
//                 <thead
//                   className="thead-light"
//                   style={{ backgroundColor: "#F1F1F1" }}
//                 >
//                   <tr style={{ textAlign: "start" }}>
//                     <th className="no-sort">
//                       <label className="">
//                         <input
//                           type="checkbox"
//                           id="select-all" checked={selectAll} onChange={handleSelectAll}
//                           style={{ border: "1px solid #676767" }}
//                         />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "16px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       User Name
//                     </th>
//                     <th
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "16px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       Phone
//                     </th>
//                     <th
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "16px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       Email
//                     </th>
//                     <th
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "16px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       Role
//                     </th>
//                     <th
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "16px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       Status
//                     </th>
//                     <th
//                       className="no-sort"
//                       style={{
//                         color: "#676767",
//                         fontSize: "16px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                         fontFamily: 'Roboto", sans-serif',
//                       }}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedUsers.length > 0 ? (
//                     paginatedUsers.map((user) => (
//                       <tr style={{ textAlign: "start" }}>
//                         <td>
//                           <label className="">
//                             <input
//                               type="checkbox"
//                               checked={selectedUsers.includes(user._id)}
//                               onChange={() => handleCheckboxChange(user._id)}
//                               style={{ border: "1px solid #1d1d1dff" }}
//                             />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>
//                         <td
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                             textTransform: "capitalize",
//                           }}
//                         >
//                           <div className="d-flex align-items-center">
//                             <span
//                               href="javascript:void(0);"
//                               className="avatar avatar-md me-2 no-underline"
//                               style={{
//                                 width: "36px",
//                                 height: "36px",
//                                 borderRadius: "50%",
//                               }}
//                             >
//                               {user.profileImage && user.profileImage.url ? (
//                                 <img
//                                   src={user.profileImage.url}
//                                   alt="Profile"
//                                   style={{
//                                     width: "36px",
//                                     height: "36px",
//                                     borderRadius: "50%",
//                                   }}
//                                 />
//                               ) : (
//                                 <div
//                                   className=" text-white  d-flex justify-content-center align-items-center"
//                                   style={{
//                                     width: "36px",
//                                     height: "36px",
//                                     borderRadius: "50%",
//                                     border: "1px solid #E6E6E6",
//                                     textDecoration: "none",
//                                   }}
//                                 >
//                                   {user.firstName?.charAt(0)}
//                                   {user.lastName?.charAt(0)}
//                                 </div>
//                               )}
//                             </span>
//                             <span>
//                               {user.firstName} {user.lastName}
//                             </span>
//                           </div>
//                         </td>
//                         <td
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                           }}
//                         >
//                           {user.phone}
//                         </td>
//                         <td
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                           }}
//                         >
//                           <span
//                             className="email"
//                             style={{ textDecoration: "none" }}
//                           >
//                             {user.email}
//                           </span>
//                         </td>
//                         <td
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                           }}
//                         >
//                           {user.role?.roleName}
//                         </td>
//                         <td
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                           }}
//                         >
//                           {/*  */}
//                           <span
//                             className={`badge table-badge fw-medium fs-10 ${user.status === "Active" ? "" : ""
//                               }`}
//                             style={
//                               user.status === "Active"
//                                 ? {
//                                   backgroundColor: "#3eb780",
//                                   color: "white",
//                                   padding: "6px 8px 6px 8px",
//                                 }
//                                 : {
//                                   backgroundColor: "#ff0000",
//                                   color: "white",
//                                   padding: "6px 8px 6px 8px",
//                                 }
//                             }
//                           >
//                             {user.status}
//                           </span>
//                           {/*  */}
//                         </td>
//                         <td
//                           className="action-table-data"
//                           style={{
//                             color: "#262626",
//                             fontSize: "16px",
//                             fontWeight: 400,
//                             lineHeight: "14px",
//                             fontFamily: 'Roboto", sans-serif',
//                           }}
//                         >
//                           <div className="d-flex" style={{ cursor: "pointer" }}>
//                             {/* <a className="me-2 p-2">
//                               <TbEye />
//                             </a> */}
//                             <a
//                               className="me-2 p-2"
//                               data-bs-toggle="modal"
//                               data-bs-target="#edit-user"
//                               onClick={() => handleOpenEditModal(user)}
//                             >
//                               <TbEdit />
//                             </a>

//                             <a
//                               className="p-2"
//                               onClick={() => handleDelete(user._id)}
//                             >
//                               <TbTrash />
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         style={{
//                           color: "#262626",
//                           fontSize: "16px",
//                           fontWeight: 400,
//                           lineHeight: "14px",
//                           fontFamily: 'Roboto", sans-serif',
//                         }}
//                         colSpan="6"
//                         className="text-center text-muted"
//                       >
//                         No Users found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {/*  */}
//               <div
//                 className="d-flex justify-content-end gap-3"
//                 style={{ padding: "10px 20px" }}
//               >
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="form-select w-auto"
//                 >
//                   <option value={10}>10 Per Page</option>
//                   <option value={25}>25 Per Page</option>
//                   <option value={50}>50 Per Page</option>
//                   <option value={100}>100 Per Page</option>
//                 </select>
//                 <span
//                   style={{
//                     backgroundColor: "white",
//                     boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
//                     padding: "7px",
//                     borderRadius: "5px",
//                     border: "1px solid #e4e0e0ff",
//                     color: "gray",
//                   }}
//                 >
//                   {filteredUsers.length === 0
//                     ? "0 of 0"
//                     : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
//                       currentPage * itemsPerPage,
//                       filteredUsers.length
//                     )} of ${filteredUsers.length}`}
//                   <button
//                     style={{
//                       border: "none",
//                       color: "grey",
//                       backgroundColor: "white",
//                     }}
//                     onClick={() =>
//                       setCurrentPage((prev) => Math.max(prev - 1, 1))
//                     }
//                     disabled={currentPage === 1}
//                   >
//                     <GrFormPrevious />
//                   </button>{" "}
//                   <button
//                     style={{ border: "none", backgroundColor: "white" }}
//                     onClick={() =>
//                       setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                     }
//                     disabled={currentPage === totalPages}
//                   >
//                     <MdNavigateNext />
//                   </button>
//                 </span>
//               </div>
//               {/*  */}
//             </div>
//           </div>
//         </div>
//         {/* /product list */}

//         {/* Add User */}
//         <div className="modal" id="add-user">
//           <div
//             className="modal-dialog modal-dialog-centered"
//             style={{ maxWidth: "970px" }}
//           >
//             <div
//               className="modal-content"
//               style={{
//                 padding: "10px",
//               }}
//             >
//               <div className="page-wrapper-new p-0 pb-5">
//                 <div className="">
//                   <div className="page-title">
//                     <h4
//                       style={{
//                         color: "#262626",
//                         fontSize: "14px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                       }}
//                     >
//                       Add User
//                     </h4>
//                   </div>
//                   <hr style={{ height: "1px", color: "#bbbbbb" }} />
//                 </div>
//                 <form onSubmit={handleAddUser} style={{ padding: "0px 20px" }}>
//                   {/* immg */}

//                   {/*  */}
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       border: "2px dashed #dadadaff",
//                       padding: "10px",
//                       borderRadius: "8px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     <div
//                       className="add-image-circle"
//                       style={{
//                         display: "flex",
//                         border: "2px dashed #dadadaff",
//                         width: "100px",
//                         height: "100px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         color: "grey",
//                         cursor: "pointer",
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {selectedImages.length > 0 ? (
//                         <img
//                           src={URL.createObjectURL(selectedImages[0])}
//                           alt="Preview"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             pointerEvents: "none",
//                             borderRadius: "50%",
//                           }}
//                         />
//                       ) : (
//                         <>
//                           <span
//                             style={{
//                               color: "#676767",
//                               fontSize: "32px",
//                               fontWeight: 400,
//                               lineHeight: "18px",
//                             }}
//                           >
//                             +
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       ref={addFileInputRef}
//                       style={{ display: "none" }}
//                       onChange={handleFileChange}
//                     />

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "5px",
//                           textAlign: "center",
//                           backgroundColor: " #E3F3FF",
//                           color: "#1368EC",
//                           border: "1px solid #BBE1FF",
//                           borderRadius: "15px",
//                           width: "150px",
//                           height: "45px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <img
//                           src={Iconss}
//                           alt=""
//                           style={{ width: "20px", height: "20px" }}
//                         />
//                         <span
//                           onClick={addHandleIconClick}
//                           className="setting-imgupload-btn"
//                         >
//                           Upload Image
//                         </span>
//                       </div>
//                       <p
//                         style={{
//                           color: "#888888",
//                           fontFamily: '"Roboto", sans-serif',
//                           fontWeight: 400,
//                           fontSize: "12px",
//                           marginTop: "10px",
//                         }}
//                       >
//                         Upload an image below 1MB, Accepted File format JPG, PNG
//                       </p>
//                     </div>

//                     <div className="invisible">;lpk</div>
//                   </div>
//                   {/*  */}

//                   <div>
//                     {/* fname lname */}
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <div style={{ flex: 1 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <span>
//                             <label
//                               className="ffrrstname"
//                               style={{
//                                 fontWeight: "400",
//                                 fontSize: "14px",
//                                 lineHeight: "14px",
//                               }}
//                             >
//                               First Name
//                             </label>
//                             <span className="text-danger ms-1">*</span>
//                           </span>
//                           <input
//                             type="text"
//                             className="ffrrstnameinput"
//                             name="firstName"
//                             value={firstName}
//                             onChange={(e) => setFirstName(e.target.value)}
//                             placeholder="Enter your first name"
//                             required
//                           />
//                           {errors.firstName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</p>}
//                         </div>
//                       </div>
//                       <div style={{ flex: 1 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <span>
//                             <label
//                               className="ffrrstname"
//                               style={{
//                                 fontWeight: "400",
//                                 fontSize: "14px",
//                                 lineHeight: "14px",
//                               }}
//                             >
//                               Last Name
//                             </label>
//                             <span className="text-danger ms-1">*</span>
//                           </span>
//                           <input
//                             type="text"
//                             className="ffrrstnameinput"
//                             name="lastName"
//                             value={lastName}
//                             onChange={(e) => setLastName(e.target.value)}
//                             placeholder="Enter your last name"
//                             required
//                           />
//                           {errors.lastName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</p>}
//                         </div>
//                       </div>
//                     </div>
//                     {/* fname lname end*/}

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           flex: "0 0 50%",
//                           display: "flex",
//                           gap: "20px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <span>
//                             <label
//                               className="ffrrstname"
//                               style={{
//                                 fontWeight: "400",
//                                 fontSize: "14px",
//                                 lineHeight: "14px",
//                               }}
//                             >
//                               Role
//                             </label>
//                             <span className="text-danger ms-1">*</span>
//                           </span>
//                           <Select
//                             options={activeRoles}
//                             value={selectedRole}
//                             onChange={setSelectedRole}
//                             placeholder="select a role..."
//                             isSearchable
//                             required
//                             // style={{
//                             //   backgroundColor: "#FBFBFB",
//                             //   color: "#676767",
//                             //   fontSize: "14px",
//                             //   fontWeight: 400,
//                             //   lineHeight: "18px"
//                             // }}
//                             styles={{
//                               control: (base) => ({
//                                 ...base,
//                                 backgroundColor: "#FBFBFB",
//                                 border: "1px solid #C2C2C2",
//                                 borderRadius: "8px",
//                                 fontSize: "14px",
//                                 fontWeight: 400,
//                                 color: "#676767",
//                                 outline: "none",
//                               }),
//                             }}
//                           />
//                           {errors.role && <p style={{ color: 'red', fontSize: '12px' }}>{errors.role}</p>}
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           flex: "0 0 48%",
//                           display: "flex",
//                           gap: "20px",
//                         }}
//                       >
//                         <div style={{ flex: 1 }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               width: "100%",
//                               gap: "5px",
//                             }}
//                           >
//                             <span>
//                               <label
//                                 className="ffrrstname"
//                                 style={{
//                                   fontWeight: "400",
//                                   fontSize: "14px",
//                                   lineHeight: "14px",
//                                 }}
//                               >
//                                 Email
//                               </label>
//                               <span className="text-danger ms-1">*</span>
//                             </span>
//                             <input
//                               type="email"
//                               className="ffrrstnameinput"
//                               name="email"
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                               placeholder="Enter your email"
//                               required
//                             />
//                             {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
//                           </div>
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               width: "100%",
//                               gap: "5px",
//                             }}
//                           >
//                             <span>
//                               <label
//                                 className="ffrrstname"
//                                 style={{
//                                   fontWeight: "400",
//                                   fontSize: "14px",
//                                   lineHeight: "14px",
//                                 }}
//                               >
//                                 Phone
//                               </label>
//                               <span className="text-danger ms-1">*</span>
//                             </span>
//                             <input
//                               type="tel"
//                               className="ffrrstnameinput"
//                               name="phone"
//                               value={phone}
//                               onChange={(e) => setPhone(e.target.value)}
//                               placeholder="Enter your 10 digit number"
//                               required
//                             />
//                             {errors.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* country start */}
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         marginBottom: "20px",
//                         width: "100%",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: "5px",
//                           width: "25%",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Country
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <select
//                           className="ffrrstnameinput"
//                           value={selectedCountry}
//                           onChange={(e) => setSelectedCountry(e.target.value)}
//                           style={{
//                             backgroundColor: "#FBFBFB",
//                             border: "1px solid #C2C2C2",
//                             borderRadius: "8px",
//                             fontSize: "14px",
//                             fontWeight: 400,
//                             color: "#676767",
//                             outline: "none",
//                           }}
//                         >
//                           <option value="">Select Country</option>
//                           {countryList.map((country) => (
//                             <option
//                               key={country.isoCode}
//                               value={country.isoCode}
//                             >
//                               {country.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: "5px",
//                           width: "25%",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             State
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <select
//                           className="ffrrstnameinput"
//                           value={selectedState}
//                           onChange={(e) => setSelectedState(e.target.value)}
//                           disabled={!selectedCountry}
//                           style={{
//                             backgroundColor: "#FBFBFB",
//                             border: "1px solid #C2C2C2",
//                             borderRadius: "8px",
//                             fontSize: "14px",
//                             fontWeight: 400,
//                             color: "#676767",
//                             outline: "none",
//                           }}
//                         >
//                           <option value="">Select State</option>
//                           {stateList.map((state) => (
//                             <option key={state.isoCode} value={state.isoCode}>
//                               {state.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: "5px",
//                           width: "25%",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             City
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <select
//                           value={selectedCity}
//                           onChange={(e) => setSelectedCity(e.target.value)}
//                           className="ffrrstnameinput"
//                           style={{
//                             backgroundColor: "#FBFBFB",
//                             border: "1px solid #C2C2C2",
//                             borderRadius: "8px",
//                             fontSize: "14px",
//                             fontWeight: 400,
//                             color: "#676767",
//                             outline: "none",
//                           }}
//                         >
//                           <option value="">Selected City</option>
//                           {cityList.map((city) => (
//                             <option key={city.name} value={city.name}>
//                               {city.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: "5px",
//                           width: "25%",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Postal Code
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <input
//                           value={zip}
//                           onChange={(e) => setZip(e.target.value)}
//                           className="ffrrstnameinput"
//                           placeholder="Enter Postal Code"
//                           type="number"
//                           style={{
//                             backgroundColor: "#FBFBFB",
//                             border: "1px solid #C2C2C2",
//                             borderRadius: "8px",
//                             fontSize: "14px",
//                             fontWeight: 400,
//                             color: "#676767",
//                             outline: "none",
//                           }}
//                         />
//                         {errors.zip && <p style={{ color: 'red', fontSize: '12px' }}>{errors.zip}</p>}
//                       </div>
//                     </div>
//                     {/* country end */}
//                     {/* address start */}
//                     <div style={{ flex: 1, marginBottom: "20px", }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                           gap: "5px",
//                         }}
//                       >
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           Address
//                         </label>
//                         <textarea
//                           type="text"
//                           className="ffrrstnameinput"
//                           name="address"
//                           value={address}
//                           onChange={(e) => setAddress(e.target.value)}
//                           placeholder="Enter your permanent Address(optional)"

//                         />
//                         {errors.address && <p style={{ color: 'red', fontSize: '12px' }}>{errors.address}</p>}
//                       </div>
//                     </div>
//                     {/* address end */}
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "20px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           flex: "0 0 50%",
//                           display: "flex",
//                           gap: "20px",
//                         }}
//                       >
//                         <div style={{ flex: "1" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               width: "100%",
//                               gap: "5px",
//                             }}
//                           >
//                             <span>
//                               <label
//                                 className="ffrrstname"
//                                 style={{
//                                   fontWeight: "400",
//                                   fontSize: "14px",
//                                   lineHeight: "14px",
//                                 }}
//                               >
//                                 Password
//                               </label>
//                               <span className="text-danger ms-1">*</span>
//                             </span>
//                             <input
//                               type="password"
//                               className="ffrrstnameinput"
//                               name="password"
//                               value={password}
//                               onChange={(e) => setPassword(e.target.value)}
//                               placeholder="Enter your Password"
//                               required
//                             />
//                             {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}
//                           </div>
//                         </div>
//                         <div style={{ flex: "1" }}>
//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               width: "100%",
//                               gap: "5px",
//                             }}
//                           >
//                             <span>
//                               <label
//                                 className="ffrrstname"
//                                 style={{
//                                   fontWeight: "400",
//                                   fontSize: "14px",
//                                   lineHeight: "14px",
//                                 }}
//                               >
//                                 Confirm Password
//                               </label>
//                               <span className="text-danger ms-1">*</span>
//                             </span>
//                             <input
//                               type="password"
//                               className="ffrrstnameinput"
//                               name="confirmPassword"
//                               value={confirmPassword}
//                               onChange={(e) =>
//                                 setConfirmPassword(e.target.value)
//                               }
//                               placeholder="confirm your Password"
//                               required
//                             />
//                             {errors.confirmPassword && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</p>}
//                             <i className="ti ti-eye-off toggle-password" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* <div
//                       style={{
//                         flex: "0 0 50%",
//                         display: "flex",
//                         gap: "20px",
//                       }}
//                     >
//                       <div style={{ flex: "1" }}>
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           Status
//                         </label>
//                         <div
//                           className="dropdown"
//                           style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
//                         >
//                           <button
//                             className="dropdown-toggle btn-md d-inline-flex align-items-center"
//                             type="button"
//                             id="roleStatus"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                             style={{
//                               backgroundColor: "#ffffff",
//                               color: "#676767",
//                               fontWeight: 400,
//                               fontSize: "16px",
//                               lineHeight: "14px",
//                               borderRadius: "4px",
//                               border: "1px solid #E6E6E6",
//                               boxShadow: "rgba(0, 0, 0, 0.25)",
//                               padding: "10px",
//                             }}
//                           >
//                             {status ? "Active" : "Inactive"}
//                             <BiChevronDown
//                               style={{ marginLeft: "10px", fontSize: "20px" }}
//                             />
//                           </button>
//                           <ul
//                             className="dropdown-menu dropdown-menu-end p-1"
//                             aria-labelledby="statusDropdown"
//                             style={{ marginLeft: "10px" }}
//                           >
//                             <li>
//                               <button
//                                 type="button"
//                                 className="dropdown-item"
//                                 onClick={() => setStatus(true)}
//                                 onMouseOver={(e) => {
//                                   e.target.style.backgroundColor = "#e3f3ff";
//                                   e.target.style.color = "black";
//                                 }}
//                                 onMouseOut={(e) => {
//                                   e.target.style.backgroundColor = "white";
//                                   e.target.style.color = "initial";
//                                 }}
//                               >
//                                 Active
//                               </button>
//                             </li>
//                             <li>
//                               <button
//                                 type="button"
//                                 className="dropdown-item"
//                                 onClick={() => setStatus(false)}
//                                 onMouseOver={(e) => {
//                                   e.target.style.backgroundColor = "#e3f3ff";
//                                   e.target.style.color = "black";
//                                 }}
//                                 onMouseOut={(e) => {
//                                   e.target.style.backgroundColor = "white";
//                                   e.target.style.color = "initial";
//                                 }}
//                               >
//                                 Inactive
//                               </button>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div> */}
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "end",
//                       gap: "10px",
//                       fontFamily: "Roboto, sans-serif",
//                       fontWeight: 400,
//                       fontSize: "16px",
//                       lineHeight: "14px",
//                     }}
//                   >
//                     <button
//                       // className="settingbtn"
//                       data-bs-dismiss="modal"
//                       style={{
//                         border: "1px solid #E6E6E6",
//                         borderRadius: "4px",
//                         padding: "8px",
//                         backgroundColor: "#FFFFFF",
//                         color: "#676767",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       // className="settingbtn"
//                       type="submit"
//                       style={{
//                         border: "1px solid #676767",
//                         borderRadius: "4px",
//                         padding: "8px",
//                         backgroundColor: "#262626",
//                         color: "#FFFFFF",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Add User
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add User Modal Component */}
//         {/* <AddUserModal
//         activeRoles={activeRoles}
//         selectedRole={selectedRole}
//         setSelectedRole={setSelectedRole}
//       /> */}

//         {/* Edit User */}
//         <div className="modal" id="edit-user">
//           <div
//             className="modal-dialog modal-dialog-centered"
//             style={{ maxWidth: "970px" }}
//           >
//             <div className="modal-content" style={{ padding: "10px" }}>
//               <div className="page-wrapper-new p-0 pb-5">
//                 <div className="">
//                   <div className="page-title">
//                     <h4
//                       style={{
//                         color: "#262626",
//                         fontSize: "14px",
//                         fontWeight: 400,
//                         lineHeight: "14px",
//                       }}
//                     >
//                       Edit User
//                     </h4>
//                   </div>
//                   <hr style={{ height: "1px", color: "#bbbbbb" }} />
//                 </div>
//                 <form onSubmit={handleUpdate} style={{ padding: "0px 20px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       border: "2px dashed #dadadaff",
//                       padding: "10px",
//                       borderRadius: "8px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     {/* Circle Image Preview */}
//                     <div
//                       className="add-image-circle"
//                       style={{
//                         border: "2px solid #007bff",
//                         width: "100px",
//                         height: "100px",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         color: "grey",
//                         cursor: "pointer",
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                       }}
//                       onClick={() => editFileInputRef.current.click()} // clicking circle opens file picker
//                     >
//                       {editUserData.profileImage ? (
//                         <img
//                           src={
//                             typeof editUserData.profileImage === "string"
//                               ? editUserData.profileImage
//                               : URL.createObjectURL(editUserData.profileImage)
//                           }
//                           alt="Preview"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             pointerEvents: "none",
//                             borderRadius: "50%",
//                           }}
//                         />
//                       ) : (
//                         <span
//                           style={{
//                             color: "#676767",
//                             fontSize: "32px",
//                             fontWeight: 400,
//                             lineHeight: "18px",
//                           }}
//                         >
//                           +
//                         </span>
//                       )}
//                     </div>

//                     {/* Hidden file input */}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       ref={editFileInputRef}
//                       style={{ display: "none" }}
//                       onChange={handleEditFileChange}
//                     />

//                     {/* Upload button + hint */}
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "5px",
//                           textAlign: "center",
//                           backgroundColor: "#E3F3FF",
//                           color: "#1368EC",
//                           border: "1px solid #BBE1FF",
//                           borderRadius: "15px",
//                           width: "150px",
//                           height: "45px",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => editFileInputRef.current.click()}
//                       >
//                         <img
//                           src={Iconss} // your upload icon
//                           alt=""
//                           style={{ width: "20px", height: "20px" }}
//                         />
//                         <span className="setting-imgupload-btn">
//                           Change Image
//                         </span>
//                       </div>

//                       <p
//                         style={{
//                           color: "#888888",
//                           fontFamily: '"Roboto", sans-serif',
//                           fontWeight: 400,
//                           fontSize: "12px",
//                           marginTop: "10px",
//                         }}
//                       >
//                         Upload an image below 1MB, Accepted File format JPG, PNG
//                       </p>
//                     </div>

//                     {/* filler to balance flex (like your invisible div) */}
//                     <div className="invisible">.</div>
//                   </div>


//                   {/* First Name */}
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "20px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                           gap: "5px",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             First Name{" "}
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <input
//                           type="text"
//                           className="ffrrstnameinput"
//                           value={editUserData.firstName}
//                           onChange={(e) =>
//                             setEditUserData({
//                               ...editUserData,
//                               firstName: e.target.value,
//                             })
//                           }
//                         />
//                         {errors.firstName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</p>}
//                       </div>
//                     </div>

//                     {/* Last Name */}
//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                           gap: "5px",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Last Name{" "}
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <input
//                           type="text"
//                           className="ffrrstnameinput"
//                           value={editUserData.lastName}
//                           onChange={(e) =>
//                             setEditUserData({
//                               ...editUserData,
//                               lastName: e.target.value,
//                             })
//                           }
//                         />
//                         {errors.lastName && <p style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</p>}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Role */}
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "20px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         flex: "0 0 50%",
//                         display: "flex",
//                         gap: "20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                           gap: "5px",
//                         }}
//                       >
//                         <span>
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Role
//                           </label>
//                           <span className="text-danger ms-1">*</span>
//                         </span>
//                         <Select
//                           options={activeRoles}
//                           value={editUserData.role}
//                           isDisabled={
//                             editUserData.role.label === "Unknown Role"
//                           }
//                           onChange={(selectedOption) => {
//                             setEditUserData({
//                               ...editUserData,
//                               role: selectedOption,
//                             });
//                           }}
//                           placeholder="Search or select a role..."
//                           isSearchable
//                           styles={{
//                             control: (base) => ({
//                               ...base,
//                               backgroundColor: "#FBFBFB",
//                               border: "1px solid #C2C2C2",
//                               borderRadius: "8px",
//                               fontSize: "14px",
//                               fontWeight: 400,
//                               color: "#676767",
//                               outline: "none",
//                             }),
//                           }}
//                         />
//                       </div>
//                     </div>

//                     {/* Email */}
//                     <div
//                       style={{
//                         flex: "0 0 48%",
//                         display: "flex",
//                         gap: "20px",
//                       }}
//                     >
//                       <div style={{ flex: 1 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <span>
//                             <label
//                               className="ffrrstname"
//                               style={{
//                                 fontWeight: "400",
//                                 fontSize: "14px",
//                                 lineHeight: "14px",
//                               }}
//                             >
//                               Email{" "}
//                             </label>
//                             <span className="text-danger ms-1">*</span>
//                           </span>
//                           <input
//                             type="email"
//                             className="ffrrstnameinput"
//                             value={editUserData.email}
//                             onChange={(e) =>
//                               setEditUserData({
//                                 ...editUserData,
//                                 email: e.target.value,
//                               })
//                             }
//                           />
//                           {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
//                         </div>
//                       </div>

//                       {/* Phone */}
//                       <div style={{ flex: 1 }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <span>
//                             <label
//                               className="ffrrstname"
//                               style={{
//                                 fontWeight: "400",
//                                 fontSize: "14px",
//                                 lineHeight: "14px",
//                               }}
//                             >
//                               Phone{" "}
//                             </label>
//                             <span className="text-danger ms-1">*</span>
//                           </span>
//                           <input
//                             type="tel"
//                             className="ffrrstnameinput"
//                             value={editUserData.phone}
//                             onChange={(e) =>
//                               setEditUserData({
//                                 ...editUserData,
//                                 phone: e.target.value,
//                               })
//                             }
//                           />
//                           {errors.phone && <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* country start */}
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "20px",
//                       marginBottom: "20px",
//                       width: "100%",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "5px",
//                         width: "25%",
//                       }}
//                     >
//                       <span>
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           Country
//                         </label>
//                         <span className="text-danger ms-1">*</span>
//                       </span>
//                       <select
//                         className="ffrrstnameinput"
//                         value={editUserData.country}
//                         onChange={(e) => {
//                           const countryCode = e.target.value;
//                           setEditUserData({
//                             ...editUserData,
//                             country: countryCode,
//                             state: "", // reset when country changes
//                             city: "",
//                           });
//                           setStateList(State.getStatesOfCountry(countryCode));
//                           setCityList([]);
//                         }}
//                         style={{
//                           backgroundColor: "#FBFBFB",
//                           border: "1px solid #C2C2C2",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           fontWeight: 400,
//                           color: "#676767",
//                           outline: "none",
//                         }}
//                       >
//                         <option value="">Select Country</option>
//                         {countryList.map((country) => (
//                           <option key={country.isoCode} value={country.isoCode}>
//                             {country.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "5px",
//                         width: "25%",
//                       }}
//                     >
//                       <span>
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           State
//                         </label>
//                         <span className="text-danger ms-1">*</span>
//                       </span>
//                       <select
//                         className="ffrrstnameinput"
//                         value={editUserData.state}
//                         onChange={(e) => {
//                           const stateCode = e.target.value;
//                           setEditUserData({
//                             ...editUserData,
//                             state: stateCode,
//                             city: "",
//                           });
//                           setCityList(
//                             City.getCitiesOfState(
//                               editUserData.country,
//                               stateCode
//                             )
//                           );
//                         }}
//                         disabled={!editUserData.country}
//                         style={{
//                           backgroundColor: "#FBFBFB",
//                           border: "1px solid #C2C2C2",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           fontWeight: 400,
//                           color: "#676767",
//                           outline: "none",
//                         }}
//                       >
//                         <option value="">Select State</option>
//                         {stateList.map((state) => (
//                           <option key={state.isoCode} value={state.isoCode}>
//                             {state.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "5px",
//                         width: "25%",
//                       }}
//                     >
//                       <span>
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           City
//                         </label>
//                         <span className="text-danger ms-1">*</span>
//                       </span>
//                       <select
//                         value={editUserData.city}
//                         onChange={(e) => setEditUserData({ ...editUserData, city: e.target.value })}

//                         className="ffrrstnameinput"
//                         style={{
//                           backgroundColor: "#FBFBFB",
//                           border: "1px solid #C2C2C2",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           fontWeight: 400,
//                           color: "#676767",
//                           outline: "none",
//                         }}
//                       >
//                         <option value="">Selected City</option>
//                         {cityList.map((city) => (
//                           <option key={city.name} value={city.name}>
//                             {city.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "5px",
//                         width: "25%",
//                       }}
//                     >
//                       <span>
//                         <label
//                           className="ffrrstname"
//                           style={{
//                             fontWeight: "400",
//                             fontSize: "14px",
//                             lineHeight: "14px",
//                           }}
//                         >
//                           Postal Code
//                         </label>
//                         <span className="text-danger ms-1">*</span>
//                       </span>
//                       <input
//                         value={editUserData.postalcode}
//                         onChange={(e) =>
//                           setEditUserData({
//                             ...editUserData,
//                             postalcode: e.target.value,
//                           })
//                         }
//                         className="ffrrstnameinput"
//                         placeholder="800007"
//                         type="number"
//                         style={{
//                           backgroundColor: "#FBFBFB",
//                           border: "1px solid #C2C2C2",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           fontWeight: 400,
//                           color: "#676767",
//                           outline: "none",
//                         }}
//                       />
//                     </div>
//                   </div>
//                   {/* country end */}
//                   {/* address start */}
//                   <div style={{ flex: 1, marginBottom: "20px", }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         width: "100%",
//                         gap: "5px",
//                       }}
//                     >
//                       <label
//                         className="ffrrstname"
//                         style={{
//                           fontWeight: "400",
//                           fontSize: "14px",
//                           lineHeight: "14px",
//                         }}
//                       >
//                         Address
//                       </label>
//                       <textarea
//                         type="text"
//                         className="ffrrstnameinput"
//                         name="address"
//                         value={editUserData.address}
//                         onChange={(e) =>
//                           setEditUserData({
//                             ...editUserData,
//                             address: e.target.value,
//                           })
//                         }
//                         placeholder="Address"
//                       />
//                     </div>
//                   </div>
//                   {/* address end */}
//                   {/* Password */}
//                   {/* <div
//                     style={{
//                       display: "flex",
//                       gap: "20px",
//                       marginBottom: "20px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         flex: "0 0 50%",
//                         display: "flex",
//                         gap: "20px",
//                       }}
//                     >
//                       <div style={{ flex: "1" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Password{" "}
//                           </label>
//                           <input
//                             type="password"
//                             className="ffrrstnameinput"
//                             value={editUserData.password}
//                             onChange={(e) =>
//                               setEditUserData({
//                                 ...editUserData,
//                                 password: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>

                   
//                       <div style={{ flex: "1" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             width: "100%",
//                             gap: "5px",
//                           }}
//                         >
//                           <label
//                             className="ffrrstname"
//                             style={{
//                               fontWeight: "400",
//                               fontSize: "14px",
//                               lineHeight: "14px",
//                             }}
//                           >
//                             Confirm Password
//                           </label>
//                           <input
//                             type="password"
//                             className="ffrrstnameinput"
//                             value={editUserData.confirmPassword}
//                             onChange={(e) =>
//                               setEditUserData({
//                                 ...editUserData,
//                                 confirmPassword: e.target.value,
//                               })
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div> */}

//                   {/* Status */}
//                   <div
//                     style={{
//                       flex: "0 0 50%",
//                       display: "flex",
//                       gap: "20px",
//                     }}
//                   >
//                     <div style={{ flex: "1" }}>
//                       <label
//                         className="ffrrstname"
//                         style={{
//                           fontWeight: "400",
//                           fontSize: "14px",
//                           lineHeight: "14px",
//                         }}
//                       >
//                         Status
//                       </label>
//                       <div
//                         className="dropdown"
//                         style={{ boxShadow: "rgba(0, 0, 0, 0.25)" }}
//                       >
//                         <button
//                           className="dropdown-toggle btn-md d-inline-flex align-items-center"
//                           type="button"
//                           id="statusDropdown"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                           style={{
//                             backgroundColor: "#ffffff",
//                             color: "#676767",
//                             fontWeight: 400,
//                             fontSize: "16px",
//                             lineHeight: "14px",
//                             borderRadius: "4px",
//                             border: "1px solid #E6E6E6",
//                             boxShadow: "rgba(0, 0, 0, 0.25)",
//                             padding: "10px",
//                           }}
//                         >
//                           {editUserData.status === "Active" ? "Active" : "Inactive"}
//                           <BiChevronDown
//                             style={{ marginLeft: "10px", fontSize: "20px" }}
//                           />
//                         </button>
//                         <ul
//                           className="dropdown-menu dropdown-menu-end p-1"
//                           aria-labelledby="statusDropdown"
//                           style={{ marginLeft: "10px" }}
//                         >
//                           <li>
//                             <button
//                               type="button"
//                               className="dropdown-item"
//                               onClick={() =>
//                                 setEditUserData({
//                                   ...editUserData,
//                                   status: "Active",
//                                 })
//                               }
//                               onMouseOver={(e) => {
//                                 e.target.style.backgroundColor = "#e3f3ff";
//                                 e.target.style.color = "black";
//                               }}
//                               onMouseOut={(e) => {
//                                 e.target.style.backgroundColor = "white";
//                                 e.target.style.color = "initial";
//                               }}
//                             >
//                               Active
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               type="button"
//                               className="dropdown-item"
//                               onClick={() =>
//                                 setEditUserData({
//                                   ...editUserData,
//                                   status: "Inactive",
//                                 })
//                               }
//                               onMouseOver={(e) => {
//                                 e.target.style.backgroundColor = "#e3f3ff";
//                                 e.target.style.color = "black";
//                               }}
//                               onMouseOut={(e) => {
//                                 e.target.style.backgroundColor = "white";
//                                 e.target.style.color = "initial";
//                               }}
//                             >
//                               Inactive
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "end",
//                       gap: "10px",
//                       fontFamily: "Roboto, sans-serif",
//                       fontWeight: 400,
//                       fontSize: "16px",
//                       lineHeight: "14px",
//                     }}
//                   >
//                     <button
//                       type="button"
//                       data-bs-dismiss="modal"
//                       style={{
//                         border: "1px solid #E6E6E6",
//                         borderRadius: "4px",
//                         padding: "8px",
//                         backgroundColor: "#FFFFFF",
//                         color: "#676767",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       style={{
//                         border: "1px solid #676767",
//                         borderRadius: "4px",
//                         padding: "8px",
//                         backgroundColor: "#262626",
//                         color: "#FFFFFF",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;
