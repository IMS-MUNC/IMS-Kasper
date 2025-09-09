import React, { useEffect, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { TbEdit, TbTrash } from "react-icons/tb";
import "../../../../styles/category/category.css";
import BASE_URL from "../../../../pages/config/config";
import Select from "react-select";
import { CiCirclePlus } from "react-icons/ci";
import { FiXSquare } from "react-icons/fi";
import { toast } from "react-toastify";

const SubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchCategories = async () => {
    try {
          const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/category/categories`,{
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Map data for react-select
      const options = data.map((category) => ({
        value: category._id, // or category.categoryName
        label: category.categoryName,
      }));

      setCategories(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    console.log("Selected category:", selectedOption);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          const token = localStorage.getItem("token");

      if (!selectedCategory || !subCategoryName || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("subCategoryName", subCategoryName);
      formData.append("description", description);
      formData.append("status", status);

      images.forEach((file) => formData.append("images", file));

      const res = await fetch(
        `${BASE_URL}/api/subcategory/categories/${selectedCategory.value}/subcategories`,
        {
          method: "POST",
          body: formData,
           headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(result.message);

      // ✅ Reset form fields
      setSubCategoryName("");
      setDescription("");
      setStatus(true); // or whatever default
      setImages([]);
      setSelectedCategory(null);
      fetchSubcategories();
      window.$("#add-category").modal("hide");
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Failed to add subcategory");
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
          const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/subcategory/subcategories`,{
         headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Sub Category</h4>
              <h6>Manage your sub categories</h6>
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
              data-bs-target="#add-category"
            >
              <i className="ti ti-circle-plus me-1" />
              Add Sub Category
            </a>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search" />
                </span>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Category
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Computers
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Electronics
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Shoe
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Electronics
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
                  Status
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Inactive
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
                    <th>Category Code</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Description</th>
                    {/* <th>Status</th> */}
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  {subcategories.length > 0 ? (
                    subcategories.map((subcat) => (
                      <tr>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{subcat.category?.categoryCode}</td>

                        <td>
                          {subcat.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="subcat-img"
                              height="50"
                              width="50"
                              className="me-1"
                            />
                          ))}
                        </td>

                        <td>{subcat.category?.categoryName}</td>
                        <td>{subcat.subCategoryName}</td>
                        <td>{subcat.description}</td>
                        {/* <td>
                          <span className="badge bg-success fw-medium fs-10">
                            Active
                          </span>
                        </td> */}
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-country"
                            >
                              <TbEdit />
                            </a>
                            <a className="p-2" >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /product list */}
        {/* addd */}
        <div className="modal fade" id="add-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Add Sub Category</h4>
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
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    {/* <div className="add-image-upload">
                      <div className="add-image">
                        <span className="fw-normal">
                          <i
                            data-feather="plus-circle"
                            className="plus-down-add"
                          />{" "}
                          Add Image
                        </span>
                      </div>
                      <div className="new-employee-field">
                        <div className="mb-0">
                          <div className="image-upload mb-2">
                            <input type="file" />
                            <div className="image-uploads">
                              <h4 className="fs-13 fw-medium">Upload Image</h4>
                            </div>
                          </div>
                          <span>JPEG, PNG up to 2 MB</span>
                        </div>
                      </div>
                    </div> */}
                    <div className="add-choosen">
                      <div className="mb-3">
                        <div className="image-upload image-upload-two">
                          <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                          />
                          <div className="image-uploads">
                            <CiCirclePlus className="plus-down-add me-0" />
                            <h4>Add Images</h4>
                          </div>
                        </div>
                      </div>
                      <div className="phone-img">
                        {imagePreviews.map((src, index) => (
                          <img
                            key={index}
                            src={src}
                            alt="preview"
                            // style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "8px" }}
                          />
                        ))}
                        <a href="javascript:void(0);">
                          <FiXSquare className="x-square-add remove-product" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>

                    <Select
                      id="category"
                      options={categories}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      isSearchable
                      placeholder="Search or select category..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category Name
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2"
                        className="check"
                        defaultChecked
                        checked={status}
                        onChange={() => setStatus(!status)}
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
                    Add Sub Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* edit */}
        <div className="modal fade" id="edit-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Sub Category</h4>
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
              <form >
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="add-image-upload">
                      <div className="add-image p-1 border-solid">
                        <img src="assets/img/products/laptop.png" alt="image" />
                        <a href="javascript:void(0);">
                          <i
                            data-feather="x"
                            className="x-square-add image-close remove-product fs-12 text-white bg-danger rounded-1"
                          />
                        </a>
                      </div>
                      <div className="new-employee-field">
                        <div className="mb-0">
                          <div className="image-upload mb-2">
                            <input type="file" />
                            <div className="image-uploads">
                              <h4 className="fs-13 fw-medium">Change Image</h4>
                            </div>
                          </div>
                          <span>JPEG, PNG up to 2 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category<span className="text-danger ms-1">*</span>
                    </label>
                    <select className="select">
                      <option>Select</option>
                      <option selected>Computers</option>
                      <option>Shoe</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Sub Category<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Laptop"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Category Code<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="CT001"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Description<span className="text-danger ms-1">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      defaultValue={"Efficient Productivity"}
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user3"
                        className="check"
                        defaultChecked
                      />
                      <label htmlFor="user3" className="checktoggle" />
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

export default SubCategory;
