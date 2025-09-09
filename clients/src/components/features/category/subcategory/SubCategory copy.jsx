import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';

const CategoryCodeManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [previewCodes, setPreviewCodes] = useState([]);

  // Fetch all categories on mount
  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const fetchCategories = async () => {
  //   try {
  //     const res = await axios.get('/api/category/categories');
  //     setCategories(res.data);
  //   } catch (err) {
  //     console.error('Error fetching categories', err);
  //   }
  // };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/category/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = categories.map((cat) => cat._id);
    setSelectedCategories(allIds);
  };

  const previewSelectedCodes = () => {
    const filtered = categories.filter((cat) => selectedCategories.includes(cat._id));
    const withCodes = filtered.map((cat, index) => ({
      ...cat,
      previewCode: `CAT-${String(index + 1).padStart(4, '0')}`,
    }));
    setPreviewCodes(withCodes);
  };

  const handleSave = async () => {
    try {
      await axios.post(`${BASE_URL}/api/category/bulk-assign-codes`, {
        selectedIds: selectedCategories,
      });
      alert('Category codes saved successfully');
      fetchCategories();
      setSelectedCategories([]);
      setPreviewCodes([]);
    } catch (err) {
      console.error('Error saving category codes', err);
      alert('Failed to save category codes');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Category Code Assigner</h2>

      <div className="border p-4 rounded shadow">
        <button
          onClick={handleSelectAll}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Select All
        </button>

        <div className="max-h-60 overflow-y-auto border p-2 mb-4">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => toggleCategory(cat._id)}
                className="mr-2"
              />
              <span>{cat.categoryName}</span>
              <span className="ml-auto text-sm text-gray-500">
                {cat.categoryCode || '—'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={previewSelectedCodes}
          disabled={selectedCategories.length === 0}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Preview Codes
        </button>
      </div>

      {previewCodes.length > 0 && (
        <div className="mt-6 border p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Code Preview</h3>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Slug</th>
                <th className="border px-4 py-2">New Code</th>
              </tr>
            </thead>
            <tbody>
              {previewCodes.map((cat) => (
                <tr key={cat._id}>
                  <td className="border px-4 py-2">{cat.categoryName}</td>
                  <td className="border px-4 py-2">{cat.categorySlug}</td>
                  <td className="border px-4 py-2 font-bold text-green-600">
                    {cat.previewCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Codes to DB
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCodeManager;





// import React from "react";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import { TbEdit, TbTrash } from "react-icons/tb";

// const SubCategory = () => {
//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4 className="fw-bold">Sub Category</h4>
//               <h6>Manage your sub categories</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//                       <li>
//                         <button type="button" className="icon-btn" title="Pdf">
//                           <FaFilePdf />
//                         </button>
//                       </li>
//                       <li>
//                         <label className="icon-btn m-0" title="Import Excel">
//                           <input type="file" accept=".xlsx, .xls" hidden />
//                           <FaFileExcel style={{ color: "green" }} />
//                         </label>
//                       </li>
//                       <li>
//                         <button type="button" className="icon-btn" title="Export Excel">
//                           <FaFileExcel />
//                         </button>
//                       </li>
//                     </div>
//           <div className="page-btn">
//             <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-category"
//             >
//               <i className="ti ti-circle-plus me-1" />
//               Add Sub Category
//             </a>
//           </div>
//         </div>
//         {/* /product list */}
//         <div className="card">
//           <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
//             <div className="search-set">
//               <div className="search-input">
//                 <span className="btn-searchset">
//                   <i className="ti ti-search fs-14 feather-search" />
//                 </span>
//               </div>
//             </div>
//             <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
//               <div className="dropdown me-2">
//                 <a
//                   href="javascript:void(0);"
//                   className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
//                   data-bs-toggle="dropdown"
//                 >
//                   Category
//                 </a>
//                 <ul className="dropdown-menu  dropdown-menu-end p-3">
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Computers
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Electronics
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Shoe
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="javascript:void(0);"
//                       className="dropdown-item rounded-1"
//                     >
//                       Electronics
//                     </a>
//                   </li>
//                 </ul>
//               </div>
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
//                         <input type="checkbox" id="select-all" />
//                         <span className="checkmarks" />
//                       </label>
//                     </th>
//                     <th>Image</th>
//                     <th>Sub Category</th>
//                     <th>Category</th>
//                     <th>Category Code</th>
//                     <th>Description</th>
//                     <th>Status</th>
//                     <th className="no-sort" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <label className="checkboxs">
//                         <input type="checkbox" />
//                         <span className="checkmarks" />
//                       </label>
//                     </td>
//                     <td>
//                       <a className="avatar avatar-md me-2">
//                         <img
//                           src="assets/img/products/stock-img-01.png"
//                           alt="product"
//                         />
//                       </a>
//                     </td>
//                     <td>Laptop</td>
//                     <td>Computers</td>
//                     <td>CT001</td>
//                     <td>Efficient Productivity</td>
//                     <td>
//                       <span className="badge bg-success fw-medium fs-10">
//                         Active
//                       </span>
//                     </td>
//                     <td className="action-table-data">
//                       <div className="edit-delete-action">
//                         <a
//                           className="me-2 p-2"
//                           data-bs-toggle="modal"
//                           data-bs-target="#edit-country"
                       
//                         >
//                           <TbEdit />
//                         </a>
//                         <a
//                           className="p-2"
//                         >
//                           <TbTrash />
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* /product list */}
//       </div>
//     </div>
//   );
// };

// export default SubCategory;




