import React, { useEffect, useState } from "react";
import "../../../styles/card/card.css";
import BASE_URL from "../../config/config";
import { toast } from "react-toastify";
import axios from "axios";
import PdfIcon from "../../../assets/img/icons/pdf.svg";
import ExcelIcon from "../../../assets/img/icons/excel.svg";
import { CiCirclePlus } from "react-icons/ci";
import { TbChevronUp, TbEdit, TbRefresh, TbTrash } from "react-icons/tb";
import "../../../styles/card/card.css";
import "../../../styles/table/table.css";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import CountryModal from "./CountryEdit";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [, setEditMode] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [sortOption, setSortOption] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCountries, setSelectedCountries] = useState([])

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/countries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCountries(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch countries");
    }
  };

  // const handleAdd = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(`${BASE_URL}/api/countries`, {
  //       name: newName,
  //       code: newCode,
  //        headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     });
  //     toast.success("Country added");
  //     setNewName("");
  //     setNewCode("");
  //     fetchCountries();
  //     window.$(`#add-country`).modal("hide"); // auto close
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Error adding country");
  //   }
  // };



  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${BASE_URL}/api/countries/${editingCountry._id}`, {
  //       name: newName,
  //       code: newCode,
  //        headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     });
  //     toast.success("Country updated");
  //     setEditMode(false);
  //     setEditingCountry(null);
  //     setNewName("");
  //     setNewCode("");
  //     fetchCountries();
  //     window.$(`#add-country`).modal("hide"); // auto close
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to update");
  //   }
  // };


  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/countries`,
        {
          name: newName,
          code: newCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Country added");
      setNewName("");
      setNewCode("");
      fetchCountries();
      window.$(`#add-country`).modal("hide"); // auto close
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding country");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/api/countries/${editingCountry._id}`,
        {
          name: newName,
          code: newCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Country updated");
      setEditMode(false);
      setEditingCountry(null);
      setNewName("");
      setNewCode("");
      fetchCountries();
      window.$(`#edit-country`).modal("hide"); // auto close
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };
  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this country?"))
    const confirmed = await DeleteAlert({
      title: "Delete country?",
      text: "This action cannot be undone.",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed) return;
    try {
      await axios.delete(`${BASE_URL}/api/countries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Deleted");
      fetchCountries();
      Swal.fire("Deleted!", "The country has been deleted.", "success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const filteredCountries = countries.filter(
    (country) =>
      (country?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country?.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleImportExcel = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   try {
  //     const reader = new FileReader();
  //     reader.onload = async (event) => {
  //       const data = new Uint8Array(event.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(sheet);

  //       // Format to match backend model
  //       const formattedData = jsonData.map((item) => ({
  //         name: item["Country Name"],
  //         code: item["Country Code"],
  //       }));

  //       // ✅ Send all at once
  //       const res = await axios.post(`${BASE_URL}/api/countries/import`, {
  //         countries: formattedData,
  //          headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //       });

  //       toast.success(res.data.message);
  //       fetchCountries();
  //     };

  //     reader.readAsArrayBuffer(file);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Import failed");
  //   }
  // };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Country List", 14, 16);
    const tableColumn = ["Country Name", "Country Code"];
    const tableRows = [];
    filteredCountries.forEach((countries) => {
      const countriesData = [
        countries.name,
        countries.code,
      ];
      tableRows.push(countriesData);
    });
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('country_list.pdf')
  }

  const handleExportExcel = () => {
    const worksheetData = countries.map((country) => ({
      "Country Name": country.name,
      "Country Code": country.code,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Countries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "Countries.xlsx");
  };

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortOption === "asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortOption === "desc") {
      return (b.name || "").localeCompare(a.name || "")
    }
    if (sortOption === "recent") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0;
  });

  // filter by time (if backend returns createdAt field)
  let finalCountries = sortedCountries;
  if (sortOption === "last7") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    finalCountries = sortedCountries.filter((c) => new Date(c.createdAt) >= sevenDaysAgo)
  }

  if (sortOption === "lastMonth") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    finalCountries = sortedCountries.filter((c) => new Date(c.createdAt) >= oneMonthAgo)
  }

  const totalPages = Math.ceil(finalCountries.length / itemsPerPage) || 1;
  const paginatedCountries = finalCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBulkDelete = async () => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/countries/bulk-delete`, {
        ids: selectedCountries,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Selected countries deleted");
      setSelectedCountries([]);
      fetchCountries();
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Unauthorired. Please login again");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete country");
      } else {
        toast.error("Bulk delete failed.Please try again")
      }
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Countries</h4>
              <h6>Manage Your Countries</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              <button
                onClick={handleExportPDF}
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Pdf"
                className="icon-btn"
              >
                <FaFilePdf />
              </button>
            </li>
            {/* <li>
              <label className="icon-btn m-0" title="Import Excel">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  style={{ display: "none" }}
                />
                <FaFileExcel style={{ color: "green" }} />
              </label>
            </li> */}
            <li>
              <button
                type="button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Export Excel"
                id="collapse-header"
                className="icon-btn"
                onClick={handleExportExcel}
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
              data-bs-target="#add-country"
              onClick={() => {
                setNewName("");
                setNewCode("");
                setEditMode(false);
              }}
            >
              <CiCirclePlus className="me-1" />
              Add Country
            </a>
          </div>
        </div>
        {selectedCountries.length > 0 && (
          <div className="mb-3">
            <div className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected({selectedCountries.length})
            </div>
          </div>
        )}
        {/* /product list */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search country..."
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
                  Sort By : Last 7 Days
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                      onClick={() => setSortOption("recent")}
                    >
                      Recently Added
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                      onClick={() => setSortOption("asc")}
                    >
                      Ascending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                      onClick={() => setSortOption("desc")}
                    >
                      Desending
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                      onClick={() => setSortOption("lastMonth")}
                    >
                      Last Month
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                      onClick={() => setSortOption("last7")}
                    >
                      Last 7 Days
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
                  <tr style={{ textAlign: 'center' }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox"
                          checked={paginatedCountries.length > 0 && paginatedCountries.every((coun) => selectedCountries.includes(coun._id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newIds = paginatedCountries.map((coun) => coun._id);
                              setSelectedCountries((prev) => [
                                ...new Set([...prev, ...newIds]),
                              ])
                            } else {
                              const idsToRemove = paginatedCountries.map((coun) => coun._id);
                              setSelectedCountries((prev) => prev.filter((id) => !idsToRemove.includes(id)))
                            }
                          }}
                          id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Country Name</th>
                    <th>Country Code</th>
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {finalCountries.length > 0 ? (
                    paginatedCountries.map((country) => (
                      <tr key={country._id} style={{ textAlign: 'center' }}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" checked={
                              paginatedCountries.length > 0 &&
                              paginatedCountries.every((c) => selectedCountries.includes(c._id))
                            }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCountries((prev) => [
                                    ...prev,
                                    country._id
                                  ])
                                } else {
                                  setSelectedCountries((prev) =>
                                    prev.filter((id) => id !== country._id))
                                }
                              }} />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td className="text-gray-9">{country.name}</td>
                        <td>{country.code}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-country"
                              onClick={() => {
                                setEditMode(true);
                                setEditingCountry(country);
                                setNewName(country.name);
                                setNewCode(country.code);
                              }}
                            >
                              <TbEdit />
                            </a>
                            <a
                              className="p-2"
                              onClick={() => handleDelete(country._id)}
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
                        No countries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* pagination start */}
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
                {finalCountries.length === 0
                  ? "0 of 0"
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    finalCountries.length
                  )} of ${finalCountries.length}`}
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
            {/* pagination end */}
          </div>
        </div>
        {/* /product list */}
      </div>
      <div>
        {/* Add Country */}

        <CountryModal
          modalId="add-country"
          title="Add Country"
          name={newName}
          code={newCode}
          onNameChange={(e) => setNewName(e.target.value)}
          onCodeChange={(e) => setNewCode(e.target.value)}
          onSubmit={handleAdd}
          submitLabel="Add Country"
        />

        <CountryModal
          modalId="edit-country"
          title="Edit Country"
          name={newName}
          code={newCode}
          onNameChange={(e) => setNewName(e.target.value)}
          onCodeChange={(e) => setNewCode(e.target.value)}
          onSubmit={handleUpdate}
          submitLabel="Update Country"
        />
        {/* /Add Country */}
      </div>
    </div>
  );
};

export default Country;

// import React, { useEffect, useState } from "react";
// import "../../../styles/card/card.css";
// import "../../../styles/table/table.css";
// import BASE_URL from "../../config/config";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { CiCirclePlus } from "react-icons/ci";
// import { TbEdit, TbTrash } from "react-icons/tb";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import CountryModal from "./CountryEdit";

// const Country = () => {
//   const [countries, setCountries] = useState([]);
//   const [newName, setNewName] = useState("");
//   const [newCode, setNewCode] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [editingCountry, setEditingCountry] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const countriesPerPage = 5;

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   const fetchCountries = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/countries`);
//       setCountries(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch countries");
//     }
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/countries`, {
//         name: newName,
//         code: newCode,
//       });
//       toast.success("Country added");
//       setNewName("");
//       setNewCode("");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Error adding country");
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${BASE_URL}/api/countries/${editingCountry._id}`, {
//         name: newName,
//         code: newCode,
//       });
//       toast.success("Country updated");
//       setEditMode(false);
//       setEditingCountry(null);
//       setNewName("");
//       setNewCode("");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this country?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/api/countries/${id}`);
//       toast.success("Deleted");
//       fetchCountries();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete");
//     }
//   };

//   // Filtered and Paginated countries
//   const filteredCountries = countries.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.code.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const indexOfLast = currentPage * countriesPerPage;
//   const indexOfFirst = indexOfLast - countriesPerPage;
//   const currentCountries = filteredCountries.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="page-header">
//           <div className="add-item d-flex">
//             <div className="page-title">
//               <h4>Countries</h4>
//               <h6>Manage Your Countries</h6>
//             </div>
//           </div>
//           <div className="table-top-head me-2">
//             <button className="icon-btn" title="PDF">
//               <FaFilePdf />
//             </button>
//             <button className="icon-btn" title="Excel">
//               <FaFileExcel />
//             </button>
//           </div>
//           <div className="page-btn">
//             <a
//               href="#"
//               className="btn btn-primary"
//               data-bs-toggle="modal"
//               data-bs-target="#add-country"
//               onClick={() => {
//                 setNewName("");
//                 setNewCode("");
//                 setEditMode(false);
//               }}
//             >
//               <CiCirclePlus className="me-1" />
//               Add Country
//             </a>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header d-flex justify-content-between align-items-center">
//             <input
//               type="text"
//               placeholder="Search country..."
//               className="form-control w-25"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>

//           <div className="card-body p-0">
//             <div className="table-responsive">
//               <table className="table datatable">
//                 <thead className="thead-light">
//                   <tr>
//                     <th>#</th>
//                     <th>Country Name</th>
//                     <th>Country Code</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentCountries.length > 0 ? (
//                     currentCountries.map((country, index) => (
//                       <tr key={country._id}>
//                         <td>{indexOfFirst + index + 1}</td>
//                         <td>{country.name}</td>
//                         <td>{country.code}</td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-primary me-2"
//                             data-bs-toggle="modal"
//                             data-bs-target="#edit-country"
//                             onClick={() => {
//                               setEditMode(true);
//                               setEditingCountry(country);
//                               setNewName(country.name);
//                               setNewCode(country.code);
//                             }}
//                           >
//                             <TbEdit />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => handleDelete(country._id)}
//                           >
//                             <TbTrash />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="text-center text-muted">
//                         No countries found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="d-flex justify-content-center my-3">
//               <nav>
//                 <ul className="pagination">
//                   {[...Array(totalPages).keys()].map((num) => (
//                     <li
//                       key={num}
//                       className={`page-item ${currentPage === num + 1 ? "active" : ""}`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(num + 1)}
//                       >
//                         {num + 1}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <CountryModal
//         modalId="add-country"
//         title="Add Country"
//         name={newName}
//         code={newCode}
//         onNameChange={(e) => setNewName(e.target.value)}
//         onCodeChange={(e) => setNewCode(e.target.value)}
//         onSubmit={handleAdd}
//         submitLabel="Add Country"
//       />

//       <CountryModal
//         modalId="edit-country"
//         title="Edit Country"
//         name={newName}
//         code={newCode}
//         onNameChange={(e) => setNewName(e.target.value)}
//         onCodeChange={(e) => setNewCode(e.target.value)}
//         onSubmit={handleUpdate}
//         submitLabel="Update Country"
//       />
//     </div>
//   );
// };

// export default Country;
