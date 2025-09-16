// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../../pages/config/config";
// import axios from "axios";
// import { TbChevronUp, TbEdit, TbTrash } from "react-icons/tb";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { toast } from "react-toastify";
// import CategoryModal from "../../../pages/Modal/categoryModals/CategoryModal";
// import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
// import Swal from "sweetalert2";
// import Swal from "sweetalert2";
// import { sanitizeInput } from "../../../utils/sanitize";
// import { BiChevronDown } from "react-icons/bi";
// import { GrFormPrevious } from "react-icons/gr";
// import { MdNavigateNext } from "react-icons/md";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import Papa from "papaparse";

// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [categorySlug, setCategorySlug] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   // edit
//   const [editingCategories, setEditingCategories] = useState(null);
//   const [editCategoryName, setEditCategoryName] = useState("");
//   const [editCategorySlug, setEditCategorySlug] = useState("");
//   const [, setEditMode] = useState(false);

//   // Control modal mode
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [selectedCategories, setSelectedCategories] = useState([]);

//   const handleBulkDelete = async () => {
//     const confirmed = await DeleteAlert({});
//     if (!confirmed) return;

//     try {
//           const token = localStorage.getItem("token");
//       await axios.post(`${BASE_URL}/api/category/categories/bulk-delete`, {
//         ids: selectedCategories,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Selected categories deleted");
//       setSelectedCategories([]);
//       fetchCategories();
//     } catch (err) {
//       console.log(err);

//       toast.error("Bulk delete failed");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//           const token = localStorage.getItem("token");

//       const res = await fetch(`${BASE_URL}/api/category/categories`,{
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!categoryName || !categorySlug) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//           const token = localStorage.getItem("token");

//       await axios.post(`${BASE_URL}/api/category/categories`, {
//         categoryName: categoryName,
//         categorySlug: categorySlug,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Category created successfully!");

//       // Reset form
//       setCategoryName("");
//       setCategorySlug("");
//       // Refresh list
//       fetchCategories();
//       // Close modal
//       // window.$("#categoryModal").modal("hide");
//     } catch (err) {
//       console.error("Error creating category:", err);
//       toast.error(err.response?.data?.message || "Error creating category");
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//           const token = localStorage.getItem("token");

//       await axios.put(
//         `${BASE_URL}/api/category/categories/${editingCategories._id}`,
//         {
//           categoryName: editCategoryName,
//           categorySlug: editCategorySlug,
//           headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         },
        
//       );
//       console.log("Editing Countries ID:", editingCategories?._id);

//       toast.success("State updated");
//       setEditMode(false);
//       setEditingCategories(null);
//       setEditCategoryName("");
//       setEditCategorySlug("");
//       fetchCategories(); // Call state list refresh, not fetchCountries
//       window.$(`#categoryModal`).modal("hide");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update");
//     }
//   };

//   const filteredCategories = categories.filter(
//     (categories) =>
//       (categories?.categoryName || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (categories?.categorySlug || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedCategories = filteredCategories.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

//   const handleDeleteCategory = async (id, categoryName) => {
//     const confirmed = await DeleteAlert({});
//     if (!confirmed) return;

//     try {
//           const token = localStorage.getItem("token");

//       await axios.delete(`${BASE_URL}/api/category/categories/${id}`,{
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast.success("Category deleted successfully");
//       fetchCategories(); // refresh list
//       Swal.fire(
//         "Deleted!",
//         `Category "${categoryName}" has been deleted.`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Failed to delete category");
//     }
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Category</h4>
//               <h6>Manage your categories</h6>
//             </div>
//           </div>
//           {/* <ul className="table-top-head">
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
//         </li>
//         <li>
//           <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
//         </li>
//       </ul> */}
//           <div className="table-top-head me-2">
//             <li>
//               <button type="button" className="icon-btn" title="Pdf">
//                 <FaFilePdf />
//               </button>
//             </li>
//             <li>
//               <label className="icon-btn m-0" title="Import Excel">
//                 <input type="file" accept=".xlsx, .xls" hidden />
//                 <FaFileExcel style={{ color: "green" }} />
//               </label>
//             </li>
//             <li>
//               <button type="button" className="icon-btn" title="Export Excel">
//                 <FaFileExcel />
//               </button>
//             </li>
//           </div>
//           <div className="page-btn">
//             {/* <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#categoryModal  "
//               onClick={() => {
//                 setIsEditMode(false);
//                 setCategoryName("");
//                 setCategorySlug("");
//                 setEditMode(false);
//               }}
//             >
//               <i className="ti ti-circle-plus me-1" />
//               Add Category
//             </a> */}
//             <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#categoryModal"
//               onClick={() => {
//                 setIsEditMode(false);
//                 setCategoryName("");
//                 setCategorySlug("");
//               }}
//             >
//               <i className="ti ti-circle-plus me-1" />
//               Add Category
//             </a>
//           </div>
//         </div>
//         {selectedCategories.length > 0 && (
//           <div className="mb-3">
//             <button className="btn btn-danger" onClick={handleBulkDelete}>
//               Delete Selected ({selectedCategories.length})
//             </button>
//           </div>
//         )}
//         {/* /product list */}
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <input
//                   type="text"
//                   placeholder="Search country..."
//                   className="form-control"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               <div className="dropdown">
//                 <a
//                   href="javascript:void(0);"
//                   className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
//                   data-bs-toggle="dropdown"
//                 >
//                   Status
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Active
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Inactive
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable">
//                 <thead className="thead-light">
//                   <tr>
//                     <th className="no-sort">
//                       <label className="checkboxs">
//                       <input
//                         type="checkbox"
//                         checked={
//                           paginatedCategories.length > 0 &&
//                           paginatedCategories.every((cat) =>
//                             selectedCategories.includes(cat._id)
//                           )
//                         }
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             const newIds = paginatedCategories.map((cat) => cat._id);
//                             setSelectedCategories((prev) => [...new Set([...prev, ...newIds])]);
//                           } else {
//                             const idsToRemove = paginatedCategories.map((cat) => cat._id);
//                             setSelectedCategories((prev) =>
//                               prev.filter((id) => !idsToRemove.includes(id))
//                             );
//                           }
//                         }}
//                       />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Category Code</th>
//                     <th>Category</th>
//                     <th>Category slug</th>
//                     <th>Created On</th>
//                     <th className="no-sort" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedCategories.length > 0 ? (
//                     paginatedCategories.map((category) => (
//                       <tr key={category._id}>
//                         <td>
//                           <label className="checkboxs">
//                           <input
//                             type="checkbox"
//                             checked={selectedCategories.includes(category._id)}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedCategories((prev) => [...prev, category._id]);
//                               } else {
//                                 setSelectedCategories((prev) =>
//                                   prev.filter((id) => id !== category._id)
//                                 );
//                               }
//                             }}
//                           />
//                             <span className="checkmarks" />
//                           </label>
//                         </td>
//                         <td>
//                           <span className="text-gray-9">
//                             {category.categoryCode}
//                           </span>
//                         </td>
//                         <td>
//                           <span className="text-gray-9">
//                             {category.categoryName}
//                           </span>
//                         </td>
//                         <td>{category.categorySlug}</td>
//                         <td>{new Date(category.createdAt).toLocaleString()}</td>

//                         <td className="action-table-data">
//                           <div className="edit-delete-action">
//                             {/* <a
//                               className="me-2 p-2"
//                               data-bs-toggle="modal"
//                               data-bs-target="#categoryModal"
//                               onClick={() => {
//                                 setIsEditMode(true);
//                                 setEditingCategories(category);
//                                 setEditCategoryName(category.categoryName);
//                                 setEditCategorySlug(category.categorySlug);
//                               }}
//                             >
//                               <TbEdit />
//                             </a> */}
//                             <a
//                               className="me-2 p-2"
//                               data-bs-toggle="modal"
//                               data-bs-target="#categoryModal"
//                               onClick={() => {
//                                 setIsEditMode(true);
//                                 setEditingCategories(category);
//                                 setEditCategoryName(category.categoryName);
//                                 setEditCategorySlug(category.categorySlug);
//                               }}
//                             >
//                               <TbEdit />
//                             </a>

//                             <a
//                               className="p-2"
//                               onClick={() =>
//                                 handleDeleteCategory(
//                                   category._id,
//                                   category.categoryName
//                                 )
//                               }
//                             >
//                               <TbTrash />
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="text-center text-muted">
//                         No categories found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* pagination */}
//             <div className="d-flex justify-content-between align-items-center p-3">
//           {/* <div>
//             Showing {indexOfFirstItem + 1}-
//             {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
//             {filteredCategories.length}
//           </div> */}
//           <div className="d-flex justify-content-end align-items-center">
//   <label className="me-2">Items per page:</label>
//   <select
//     value={itemsPerPage}
//     onChange={(e) => {
//       setItemsPerPage(Number(e.target.value));
//       setCurrentPage(1); // reset to first page
//     }}
//     className="form-select w-auto"
//   >
//     <option value={10}>10</option>
//     <option value={25}>25</option>
//     <option value={50}>50</option>
//     <option value={100}>100</option>
//   </select>
// </div>
//           <div>
//             <button
//               className="btn btn-light btn-sm me-2"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 className={`btn btn-sm me-1 ${
//                   currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
//                 }`}
//                 onClick={() => setCurrentPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               className="btn btn-light btn-sm"
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//           </div>
//         </div>
//         {/* /product list */}
        
//       </div>
//       {/* <CategoryModal
//         modalId="categoryModal"
//         title={isEditMode ? "Edit Category" : "Add Category"}
//         categoryName={isEditMode ? editCategoryName : setCategoryName}
//         categorySlug={isEditMode ? editCategorySlug : setCategorySlug}
//         onCategoryChange={
//           isEditMode
//             ? (e) => setEditCategoryName(e.target.value)
//             : (e) => setCategoryName(e.target.value)
//         }
//         onSlugChange={
//           isEditMode
//             ? (e) => setEditCategorySlug(e.target.value)
//             : (e) => setCategorySlug(e.target.value)
//         }
//         onSubmit={isEditMode ? handleUpdate : handleSubmit}
//         submitLabel={isEditMode ? "Update" : "Submit"}
//       /> */}

//       <CategoryModal
//         modalId="categoryModal"
//         title={isEditMode ? "Edit Category" : "Add Category"}
//         isEditMode={isEditMode}
//         categoryName={isEditMode ? editCategoryName : categoryName}
//         categorySlug={isEditMode ? editCategorySlug : categorySlug}
//         onCategoryChange={
//           isEditMode
//             ? (e) => setEditCategoryName(e.target.value)
//             : (e) => setCategoryName(e.target.value)
//         }
//         onSlugChange={
//           isEditMode
//             ? (e) => setEditCategorySlug(e.target.value)
//             : (e) => setCategorySlug(e.target.value)
//         }
//         onSubmit={isEditMode ? handleUpdate : handleSubmit}
//         submitLabel={isEditMode ? "Update" : "Submit"}
//       />

//       {/* <CategoryModal
//           modalId="add-category"
//           title="Add Category"
//           categoryName={categoryName}
//           categorySlug={categorySlug}
//           onCategoryChange={(e) => setCategoryName(e.target.value)}
//           onSlugChange={(e) => setCategorySlug(e.target.value)}
//           onSubmit={handleSubmit}
//           submitLabel="Add Category"
//         />
    
//         <CategoryModal
//           modalId="edit-category"
//           title="Edit category"
//           editCategoryName={editCategoryName}
//           editCategorySlug={editCategorySlug}
//           onCategoryChange={(e) => setEditCategoryName(e.target.value)}
//           onSlugChange={(e) => setEditCategorySlug(e.target.value)}
//           onSubmit={handleUpdate}
//           submitLabel="Update Category"
//         />
//        */}
//       {/* /Add Category */}
//     </div>
//   );
// };

// export default Category;



import React, { useEffect, useState } from "react";
import BASE_URL from "../../../pages/config/config";
import axios from "axios";
import { TbChevronUp, TbEdit, TbTrash } from "react-icons/tb";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import CategoryModal from "../../../pages/Modal/categoryModals/CategoryModal";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import Swal from "sweetalert2";
import { sanitizeInput } from "../../../utils/sanitize";
import { BiChevronDown } from "react-icons/bi";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const nameRegex = /^[A-Za-z]{2,}$/;
  const slugRegex = /^[a-z0-9-]{2,}$/;

  // edit
  const [editingCategories, setEditingCategories] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategorySlug, setEditCategorySlug] = useState("");
  const [, setEditMode] = useState(false);

  // Control modal mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleBulkDelete = async () => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token")
      await axios.post(`${BASE_URL}/api/category/categories/bulk-delete`, {
        ids: selectedCategories,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Selected categories deleted");
      setSelectedCategories([]);
      fetchCategories();
    } catch (err) {
      console.log(err);

      toast.error("Bulk delete failed");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${BASE_URL}/api/category/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!nameRegex.test(categoryName)) {
      newErrors.categoryName =
        "Enter a valid category name (letters only, min 2 chars)";
    }
    // if(!slugRegex.test(categorySlug)) {
    //   newErrors.categorySlug = "Enter a valid slug (lowercase letters, numbers, hyphens, min 2 chars)";
    // }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const token = localStorage.getItem("token")
      const cleanName = sanitizeInput(categoryName);
      const cleanSlug = sanitizeInput(categorySlug);

      const payload = { categoryName: cleanName };
      if (cleanSlug && cleanSlug.trim() !== "") {
        payload.categorySlug = cleanSlug;
      }

      await axios.post(`${BASE_URL}/api/category/categories`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Category created successfully!");

      // Reset form
      setCategoryName("");
      setCategorySlug("");
      // Refresh list
      fetchCategories();
      // Close modal
      // window.$("#categoryModal").modal("hide");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!nameRegex.test(editCategoryName)) {
      newErrors.categoryName =
        "Enter a valid category name (letters only, min 2 chars)";
    }
    if (!slugRegex.test(editCategorySlug)) {
      newErrors.categorySlug =
        "Enter a valid slug (lowercase letters, numbers, hyphens, min 2 chars)";
    }
    setErrors(newErrors);

    // Stop update if validation fails
    if (Object.keys(newErrors).length > 0) return;
    try {
      const token = localStorage.getItem("token")
      const cleanName = sanitizeInput(editingCategories.categoryName);
      const cleanSlug = sanitizeInput(editingCategories.categorySlug);

      await axios.put(
        `${BASE_URL}/api/category/categories/${editingCategories._id}`,
        {
          categoryName: cleanName,
          categorySlug: cleanSlug,
        
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      // console.log("Editing Countries ID:", editingCategories?._id);

      toast.success("State updated");
      setEditMode(false);
      setEditingCategories(null);
      setEditCategoryName("");
      setEditCategorySlug("");
      fetchCategories(); // Call state list refresh, not fetchCountries
      window.$(`#categoryModal`).modal("hide");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const filteredCategories = categories.filter(
    (categories) =>
      (categories?.categoryName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (categories?.categorySlug || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleDeleteCategory = async (id, categoryName) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/category/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category deleted successfully");
      fetchCategories(); // refresh list
      Swal.fire(
        "Deleted!",
        `Category "${categoryName}" has been deleted.`,
        "success"
      );
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    }
  };

  //csv upload--------------------------------------------------------------------------------------------------------------------------------------------------

  const handleCSV = () => {
    const tableHeader = [
      "Category Code",
      "Category",
      "Category slug",
      "Created On",
    ];
    const csvRows = [
      tableHeader.join(","),
      ...categories.map((e) =>
        [e.categoryCode, e.categoryName, e.categorySlug, e.createdAt].join(",")
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "category.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //excell file upload--------------------------------------------------------------------------------------------------------------------------------------------------

  const fileInputRef = React.useRef();

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      alert("Please select a valid file");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredFields = [
          "Category Code",
          "Category",
          "Category slug",
          "Created On",
        ];
        const valid = results.data.every((row) =>
          requiredFields.every((f) => f in row && row[f] !== "")
        );
        if (!valid) {
          alert("structure does not match the required schema.");
          return;
        }
        // Optionally: convert types (grandTotal, orderTax, orderDiscount, shipping to Number, date to Date)

        // Send to backend
        try {
          await axios.post(`${BASE_URL}/api/category/categories`, payload);
          toast.success("Imported successfully!");
        } catch (err) {
          alert("Error while Import");
        }
      },
    });
  };

  //pdf download----------------------------------------------------------------------------------------------------------------------------------------

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Category", 14, 15);
    const tableColumns = [
      "Category Code",
      "Category",
      "Category slug",
      "Created On",
    ];

    const tableRows = categories.map((e) => [
      e.categoryCode,
      e.categoryName,
      e.categorySlug,
      e.createdAt,
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [155, 155, 155],
        textColor: "white",
      },
      theme: "striped",
    });

    doc.save("categories.pdf");
  };

  return (
    <div className="page-wrapper">
      <div className="content" style={{ marginTop: "50px" }}>
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Category</h4>
              <h6>Manage your categories</h6>
            </div>
          </div>
          {/* <ul className="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
        </li>
      </ul> */}
          <div className="table-top-head me-2">
            <li>
              <button
                type="button"
                className="icon-btn"
                title="Pdf"
                onClick={handlePdf}
              >
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
                <button
                  type="button"
                  onClick={handleImportClick}
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                  }}
                >
                  <FaFileExcel style={{ color: "green" }} />
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            </li>
            <li>
              <button
                type="button"
                className="icon-btn"
                title="Export Excel"
                onClick={handleCSV}
              >
                <FaFileExcel />
              </button>
            </li>
          </div>
          <div className="page-btn">
            {/* <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#categoryModal  "
              onClick={() => {
                setIsEditMode(false);
                setCategoryName("");
                setCategorySlug("");
                setEditMode(false);
              }}
            >
              <i className="ti ti-circle-plus me-1" />
              Add Category
            </a> */}
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#categoryModal"
              onClick={() => {
                setIsEditMode(false);
                setCategoryName("");
                setCategorySlug("");
              }}
            >
              <i className="ti ti-circle-plus me-1" />
              Add Category
            </a>
          </div>
        </div>
        {selectedCategories.length > 0 && (
          <div className="mb-3">
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedCategories.length})
            </button>
          </div>
        )}
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search category..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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
                  <tr style={{ textAlign: "center" }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input
                          type="checkbox"
                          checked={
                            paginatedCategories.length > 0 &&
                            paginatedCategories.every((cat) =>
                              selectedCategories.includes(cat._id)
                            )
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newIds = paginatedCategories.map(
                                (cat) => cat._id
                              );
                              setSelectedCategories((prev) => [
                                ...new Set([...prev, ...newIds]),
                              ]);
                            } else {
                              const idsToRemove = paginatedCategories.map(
                                (cat) => cat._id
                              );
                              setSelectedCategories((prev) =>
                                prev.filter((id) => !idsToRemove.includes(id))
                              );
                            }
                          }}
                        />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Category Code</th>
                    <th>Category</th>
                    <th>Category slug</th>
                    <th>Created On</th>
                    {/* <th className="no-sort" /> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category) => (
                      <tr key={category._id} style={{ textAlign: "center" }}>
                        <td>
                          <label className="checkboxs">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(
                                category._id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories((prev) => [
                                    ...prev,
                                    category._id,
                                  ]);
                                } else {
                                  setSelectedCategories((prev) =>
                                    prev.filter((id) => id !== category._id)
                                  );
                                }
                              }}
                            />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>
                          <span className="text-gray-9">
                            {category.categoryCode}
                          </span>
                        </td>
                        <td>
                          <span className="text-gray-9">
                            {category.categoryName}
                          </span>
                        </td>
                        <td>{category.categorySlug}</td>
                        <td>{new Date(category.createdAt).toLocaleString()}</td>

                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            {/* <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#categoryModal"
                              onClick={() => {
                                setIsEditMode(true);
                                setEditingCategories(category);
                                setEditCategoryName(category.categoryName);
                                setEditCategorySlug(category.categorySlug);
                              }}
                            >
                              <TbEdit />
                            </a> */}
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#categoryModal"
                              onClick={() => {
                                setIsEditMode(true);
                                setEditingCategories(category);
                                setEditCategoryName(category.categoryName);
                                setEditCategorySlug(category.categorySlug);
                              }}
                            >
                              <TbEdit />
                            </a>

                            <a
                              className="p-2"
                              onClick={() =>
                                handleDeleteCategory(
                                  category._id,
                                  category.categoryName
                                )
                              }
                            >
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
            {/* pagination */}
           
              {/* <div>
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
            {filteredCategories.length}
          </div> */}
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
                  {filteredCategories.length === 0
                    ? "0 of 0"
                    : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                        currentPage * itemsPerPage,
                        filteredCategories.length
                      )} of ${filteredCategories.length}`}
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

              {/* rece */}
            
          </div>
        </div>
        {/* /product list */}
      </div>
      {/* <CategoryModal
        modalId="categoryModal"
        title={isEditMode ? "Edit Category" : "Add Category"}
        categoryName={isEditMode ? editCategoryName : setCategoryName}
        categorySlug={isEditMode ? editCategorySlug : setCategorySlug}
        onCategoryChange={
          isEditMode
            ? (e) => setEditCategoryName(e.target.value)
            : (e) => setCategoryName(e.target.value)
        }
        onSlugChange={
          isEditMode
            ? (e) => setEditCategorySlug(e.target.value)
            : (e) => setCategorySlug(e.target.value)
        }
        onSubmit={isEditMode ? handleUpdate : handleSubmit}
        submitLabel={isEditMode ? "Update" : "Submit"}
      /> */}

      <CategoryModal
        modalId="categoryModal"
        title={isEditMode ? "Edit Category" : "Add Category"}
        isEditMode={isEditMode}
        categoryName={isEditMode ? editCategoryName : categoryName}
        categorySlug={isEditMode ? editCategorySlug : categorySlug}
        onCategoryChange={
          isEditMode
            ? (e) => setEditCategoryName(e.target.value)
            : (e) => setCategoryName(e.target.value)
        }
        onSlugChange={
          isEditMode
            ? (e) => setEditCategorySlug(e.target.value)
            : (e) => setCategorySlug(e.target.value)
        }
        onSubmit={isEditMode ? handleUpdate : handleSubmit}
        submitLabel={isEditMode ? "Update" : "Submit"}
        errors={errors}
      />
    </div>
  );
};

export default Category;
