import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';
import { TbEdit, TbTrash } from 'react-icons/tb';
import AddHsnModals from '../../../../pages/Modal/hsn/AddHsnModals';
import { toast } from 'react-toastify';
import BASE_URL from '../../../../pages/config/config';
import * as XLSX from "xlsx";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import DeleteAlert from "../../../../utils/sweetAlert/DeleteAlert";
import { sanitizeInput } from "../../../../utils/sanitize";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HSNList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [modalData, setModalData] = useState({ hsnCode: '', description: '', id: null });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const hsnRegex = /^[0-9]{2,8}$/;
  // === BULK DELETE STATE ===
  const [selectedHSN, setSelectedHSN] = useState([]);


  useEffect(() => { load(); }, [page, limit, search]);

  const load = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/hsn/paginated`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      setData(res.data.items);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error loading HSN:', err);
    }
  };

  const remove = async (id) => {
    const confirmed = await DeleteAlert({});
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/hsn/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      load();
      toast.success("HSN deleted successfully!");
    } catch (err) {
      console.error('Error deleting HSN:', err);
      toast.error("Failed to delete HSN. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${BASE_URL}/api/hsn/export`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hsn.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // PDF download functionality
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("HSN List", 14, 15);
    const tableColumns = [
      "HSN Code",
      "Description",
      "Created Date",
    ];

    const tableRows = data.map((e) => [
      e.hsnCode,
      e.description,
      new Date(e.createdAt).toLocaleDateString(),
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

    doc.save("hsn-list.pdf");
  };

  // Excel export functionality
  const handleExcel = () => {
    // Prepare data for Excel export
    const excelData = data.map((hsn) => ({
      "HSN Code": hsn.hsnCode,
      "Description": hsn.description,
      "Created Date": new Date(hsn.createdAt).toLocaleDateString(),
    }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 15 }, // HSN Code
      { wch: 40 }, // Description
      { wch: 15 }, // Created Date
    ];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "HSN List");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "hsn-list.xlsx");
  };


  const fileInputRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("token")
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Format to match backend model
        const formattedData = jsonData.map((item) => ({
          hsnCode: item["HSN Code"],
          description: item["HSN Description"],
        }));

        // ✅ Send all at once
        const res = await axios.post(`${BASE_URL}/api/hsn/import`, {
          hsnItems: formattedData,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token sent properly
          },
        });

        toast.success(res.data.message);
        load();
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      toast.error("Import failed");
    }
  };


  const handleModalSubmit = async () => {
    let newErrors = {};
    const { hsnCode, description, id } = modalData;

    // Validate HSN Code
    const hsnRegex = /^[0-9]{2,8}$/;
    if (!hsnCode || !hsnCode.trim()) {
      newErrors.hsnCode = "HSN code is required";
    } else if (!hsnRegex.test(hsnCode.trim())) {
      newErrors.hsnCode = "HSN code must be 2-8 digits";
    }

    // Validate Description
    if (!description || !description.trim()) {
      newErrors.description = "Description is required";
    }

    // If there are validation errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const cleanhsnCode = sanitizeInput(hsnCode.trim());
      const cleanhsnDescription = sanitizeInput(description.trim());

      if (modalData.id) {
        // Update existing HSN
        await axios.put(`${BASE_URL}/api/hsn/${modalData.id}`, {
          hsnCode: cleanhsnCode,
          description: cleanhsnDescription
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("HSN updated successfully!");
      } else {
        // Create new HSN
        await axios.post(`${BASE_URL}/api/hsn`, {
          hsnCode: cleanhsnCode,
          description: cleanhsnDescription
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("HSN created successfully!");
      }

      // Reset modal and reload data
      setModalData({ hsnCode: '', description: '', id: null });
      setShowModal(false);
      setErrors({});
      load();
    } catch (err) {
      console.error('Save error:', err);

      // Handle specific error cases
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid data provided");
      } else if (err.response?.status === 409) {
        toast.error("HSN code already exists");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized. Please login again");
      } else {
        toast.error("Failed to save HSN. Please try again");
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setModalData({ hsnCode: item.hsnCode, description: item.description, id: item._id });
    } else {
      setModalData({ hsnCode: '', description: '', id: null });
    }
    setErrors({}); // Clear any previous errors
    setShowModal(true);
  };

  // === BULK DELETE HANDLERS ===
  const handleCheckboxChange = (id) => {
    setSelectedHSN((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((item) => item._id); // current page data
      setSelectedHSN(allIds);
    } else {
      setSelectedHSN([]);
    }
  };

  // bulk delete start from here

  const handleBulkDelete = async () => {
    if (selectedHSN.length === 0) return;
    if (!window.confirm(`Delete ${selectedHSN.length} selected HSN records?`)) return;

    try {
      const token = localStorage.getItem("token")
      await Promise.all(
        selectedHSN.map((id) => axios.delete(`${BASE_URL}/api/hsn/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }))
      );
      toast.success("Selected HSNs deleted");
      setSelectedHSN([]);
      load();
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("Failed to delete selected HSNs");
    }
  };

  useEffect(() => {
    setSelectedHSN((prev) => prev.filter((id) => data.some((d) => d._id === id)));
  }, [data]);



  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Hsn List</h4>
              <h6>Manage your Hsn</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>

              {selectedHSN.length > 0 && (
                <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                  Delete ({selectedHSN.length}) Selected
                </button>
              )}

            </li>
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Export : </label>
              <button onClick={handlePdf} title="Download PDF" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFilePdf className="fs-20" style={{ color: "red" }} /></button>
              <button onClick={handleExcel} title="Download Excel" style={{
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                border: "none",
              }}><FaFileExcel className="fs-20" style={{ color: "orange" }} /></button>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: '5px' }} className="icon-btn">
              <label className="" title="">Import : </label>
              <label className="" title="Import Excel">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  hidden
                  onChange={handleImport}
                  ref={fileInputRef}
                />
                <FaFileExcel style={{ color: 'green', cursor: 'pointer' }} />
              </label>
            </li>
            {/* <li>
              <button type="button" className="icon-btn" title="Export Excel" onClick={handleExcel}>
                <FaFileExcel />
              </button>
            </li> */}
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              onClick={() => openModal()}
            >
              <CiCirclePlus className=" me-1" />
              Add Hsn
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
                  placeholder="Search hsn code or description..."
                  className="form-control"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr style={{ textAlign: 'start' }}>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" checked={data.length > 0 && selectedHSN.length === data.length}
                          onChange={handleSelectAll} />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>HSN Code</th>
                    <th>Description</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">No HSN records found.</td>
                    </tr>
                  ) : (
                    data.map((hsn) => (
                      <tr key={hsn._id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" checked={selectedHSN.includes(hsn._id)}
                              onChange={() => handleCheckboxChange(hsn._id)} />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{hsn.hsnCode}</td>
                        <td>{hsn.description.length > 100 ? hsn.description.slice(0, 100) + '...' : hsn.description}</td>
                        <td>{new Date(hsn.createdAt).toLocaleDateString("en-GB", {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                openModal(hsn);
                              }}
                            >
                              <TbEdit />
                            </a>
                            <a
                              className="p-2"
                              onClick={() => remove(hsn._id)}
                            >
                              <TbTrash />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            <div
              className="d-flex justify-content-end gap-3"
              style={{ padding: "10px 20px" }}
            >
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
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
                {total === 0
                  ? "0 of 0"
                  : `${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}`}
                <button
                  style={{
                    border: "none",
                    color: "grey",
                    backgroundColor: "white",
                  }}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <GrFormPrevious />
                </button>
                <button
                  style={{ border: "none", backgroundColor: "white" }}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                >
                  <MdNavigateNext />
                </button>
              </span>
            </div>
          </div>
        </div>
        <AddHsnModals
          show={showModal}
          onClose={() => setShowModal(false)}
          modalData={modalData}
          setModalData={setModalData}
          onSubmit={handleModalSubmit}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default HSNList;
