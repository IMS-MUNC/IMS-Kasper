import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import "../../../styles/category/category.css";
import axios from "axios";
import BASE_URL from "../../../pages/config/config";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { hasPermission } from "../../../utils/permission/hasPermission";

const Brand = () => {
  const [brandName, setBrandName] = useState("");
  const [status, setStatus] = useState(true); // true = Active
  const [selectedImages, setSelectedImages] = useState([]);

  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editStatus, setEditStatus] = useState(true);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [brands, setBrands] = useState([]);

  console.log(brands);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    console.log("Create Permission:", hasPermission("brand", "create"));
    console.log("Read Permission:", hasPermission("brand", "read"));
    console.log("Update Permission:", hasPermission("brand", "update"));
    console.log("Delete Permission:", hasPermission("brand", "delete"));
  }, []);

 //======================================================================================================
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token"); // Make sure the token is stored here after login

      const res = await axios.get(`${BASE_URL}/api/brands/getBrands`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });

      setBrands(res.data.brands);
    } catch (error) {
      console.error(
        "Fetch Brands Error:",
        error.response?.data || error.message
      );
    }
  };

  //==================================================================================================

 const handleAddBrand = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("brandName", brandName);
  formData.append("status", status ? "Active" : "Inactive");

  selectedImages.forEach((file) => {
    formData.append("image", file);
  });

  try {
    const token = localStorage.getItem("token"); // ✅ get token from storage

    const res = await axios.post(
      `${BASE_URL}/api/brands/addBrands`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ include token in headers
        },
      }
    );

    console.log("Brand Added:", res.data);

    // Reset form
    setBrandName("");
    setStatus(true);
    setSelectedImages([]);

    // fetchBrands to refresh list
    fetchBrands();
    window.$(`#add-brand`).modal("hide");

    toast.success("Brand added successfully!");
  } catch (error) {
    console.error("Add Brand Error:", error.response?.data || error.message);

    toast.error(
      error.response?.data?.message || "Failed to add brand. Please try again."
    );
  }
};

// ==================================================================================================
const handleEditBrand = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("brandName", editBrandName);
  formData.append("status", editStatus ? "Active" : "Inactive");

  selectedImages.forEach((file) => {
    formData.append("image", file); // "image" must match multer field name
  });

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${BASE_URL}/api/brands/editBrands/${editBrandId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBrands();
    window.$(`#edit-brand`).modal("hide");
    toast.success("Brand updated successfully!");
  } catch (error) {
    console.error("Update brand failed:", error.response?.data || error.message);
    toast.error("Failed to update brand");
  }
};

const handleOpenEditModal = (brand) => {
  console.log("Editing brand:", brand); // ✅ Debug log
  setEditBrandId(brand._id);
  setEditBrandName(brand.brandName);
  setEditStatus(brand.status === "Active");
  setEditImagePreview(brand.image?.[0]?.url); // Show current image
  setSelectedImages([]); // Reset selected files
};



///================================================================================== 



const handleDeleteBrand = async (brandId, brandName) => {
  const confirmed = await DeleteAlert({});
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${BASE_URL}/api/brands/deleteBrand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchBrands();
    Swal.fire(
      "Deleted!",
      `Brand "${brandName}" has been deleted.`,
      "success"
    );
  } catch (error) {
    console.error("Delete brand failed:", error.response?.data || error.message);
    toast.error("Failed to delete brand");
  }
};


  const filteredBrands = brands
    .filter((brand) => {
      if (statusFilter === "All") return true;
      return brand.status === statusFilter;
    })
    .filter((brand) =>
      brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortOrder === "Latest") return dateB - dateA;
      if (sortOrder === "Ascending")
        return a.brandName.localeCompare(b.brandName);
      if (sortOrder === "Descending")
        return b.brandName.localeCompare(a.brandName);
      return 0;
    });



  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);






  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Brand</h4>
              <h6>Manage your brands</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input type="file" accept=".xlsx, .xls" hidden />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li>
            <li>
              <button type="button" className="icon-btn" title="Export Excel">
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#add-brand"
            >
              <CiCirclePlus className=" me-1" />
              Add Brand
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search brands..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Brand</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.map((brand) => (
                    <tr key={brand._id}>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <a
                            href="#"
                            className="avatar avatar-md bg-light-900 p-1 me-2"
                          >
                            <img
                              className="object-fit-contain"
                              // src={brand.image?.[0] || "assets/img/default.png"}
                              src={brand.image?.[0]?.url}
                              alt={brand.brandName}
                            />
                          </a>
                          <a href="#">{brand.brandName}</a>
                        </div>
                      </td>
                      <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge table-badge fw-medium fs-10 ${
                            brand.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {brand.status}
                        </span>
                      </td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a
                            className="me-2 p-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-brand"
                            onClick={() => handleOpenEditModal(brand)}
                          >
                            <TbEdit />
                          </a>

                          <a
                            className="p-2"
                            onClick={() =>
                              handleDeleteBrand(brand._id, brand.brandName)
                            }
                          >
                            <TbTrash />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
               
              </table>
            </div>
            {/* pagination */}
            <div className="d-flex justify-content-between align-items-center p-3">
             
              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  value={itemsPerPage}

                  className="form-select w-auto"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
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
                    className={`btn btn-sm me-1 ${
                      currentPage === i + 1
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
        <div>
          {/* Add Brand */}
          <div className="modal fade" id="add-brand">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="page-title">
                    <h4>Add Brand</h4>
                  </div>
                  <button
                    type="button"
                    className="close bg-danger text-white fs-16"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form onSubmit={handleAddBrand}>
                  <div className="modal-body new-employee-field">
                    <div className="profile-pic-upload mb-3">
                      <div className="profile-pic brand-pic">
                        <span>
                          {selectedImages.length > 0 ? (
                            <img
                              src={URL.createObjectURL(selectedImages[0])}
                              alt="Preview"
                              height="60"
                            />
                          ) : (
                            <>
                              <CiCirclePlus className="plus-down-add" /> Add
                              Image
                            </>
                          )}{" "}
                        </span>
                      </div>
                      <div>
                        <div className="image-upload mb-0">
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) =>
                              setSelectedImages(Array.from(e.target.files))
                            }
                          />
                          <div className="image-uploads">
                            <h4>Upload Image</h4>
                          </div>
                        </div>
                        <p className="mt-2">JPEG, PNG up to 2 MB</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Brand<span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="user2"
                          className="check"
                          checked={status}
                          onChange={(e) => setStatus(e.target.checked)}
                        />
                        <label htmlFor="user2" className="checktoggle" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn me-2 btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Brand
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* /Add Brand */}
        </div>

        <div className="modal fade" id="edit-brand">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Brand</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleEditBrand}>
                <div className="modal-body new-employee-field">
                  <div className="profile-pic-upload mb-3">
                    <div className="profile-pic brand-pic">
                      <span>
                        {editImagePreview && (
                          <img
                            src={editImagePreview}
                            alt="Current"
                            height="60"
                          />
                        )}
                      </span>
                      <a href="javascript:void(0);" className="remove-photo">
                        <i data-feather="x" className="x-square-add" />
                      </a>
                    </div>
                    <div>
                      
                      <div className="image-upload mb-0">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedImages(files);
                            if (files[0]) {
                              setEditImagePreview(
                                URL.createObjectURL(files[0])
                              );
                            }
                          }}
                        />
                        <div className="image-uploads">
                          <h4>Change Image</h4>
                        </div>
                      </div>

                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Brand<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user4"
                        className="check"
                        checked={editStatus}
                        onChange={(e) => setEditStatus(e.target.checked)}
                      />
                      <label htmlFor="user4" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn me-2 btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
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

export default Brand;
