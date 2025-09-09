import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';
import { TbEdit, TbTrash } from 'react-icons/tb';
import AddHsnModals from '../../../../pages/Modal/hsn/AddHsnModals';
import { toast } from 'react-toastify';
import BASE_URL from '../../../../pages/config/config';
import * as XLSX from "xlsx";

const HSNList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [modalData, setModalData] = useState({ hsnCode: '', description: '', id: null });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => { load(); }, [page, limit, search]);

  const load = async () => {
    try {
      const token = localStorage.getItem("token"); 
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
    try {
      await axios.delete(`${BASE_URL}/api/hsn/${id}`,{
                   headers: {
          Authorization: `Bearer ${token}`, // ✅ token sent properly
        },
      });
      load();
    } catch (err) {
      console.error('Error deleting HSN:', err);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token"); 
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


  const fileInputRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem("token"); 
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


  // const handleModalSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem("token"); 
  //     if (modalData.id) {
  //       await axios.put(`${BASE_URL}/api/hsn/${modalData.id}`, modalData);
  //     } else {
  //       await axios.post(`${BASE_URL}/api/hsn`, modalData);
  //     }
  //     setModalData({ hsnCode: '', description: '', id: null });
  //     setShowModal(false);
  //     load();
  //   } catch (err) {
  //     console.error('Save error:', err);
  //   }
  // };



const handleModalSubmit = async () => {
  try {
    const token = localStorage.getItem("token"); 

    if (modalData.id) {
      // Update HSN
      await axios.put(
        `${BASE_URL}/api/hsn/${modalData.id}`,
        modalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("HSN updated successfully ✅");
    } else {
      // Create HSN
      await axios.post(
        `${BASE_URL}/api/hsn`,
        modalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("HSN created successfully 🎉");
    }

    // Reset and reload
    setModalData({ hsnCode: "", description: "", id: null });
    setShowModal(false);
    load();

  } catch (err) {
    console.error("Save error:", err);
    toast.error("Failed to save HSN ❌");
  }
};

  const openModal = (item = null) => {
    if (item) setModalData({ hsnCode: item.hsnCode, description: item.description, id: item._id });
    else setModalData({ hsnCode: '', description: '', id: null });
    setShowModal(true);
  };

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
              <button type="button" className="icon-btn" title="Pdf">
                <FaFilePdf />
              </button>
            </li>
            <li>
              <label className="icon-btn m-0" title="Import Excel">
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
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>HSN Code</th>
                    <th>Description</th>
                    <th>Created Date</th>
                    <th className="no-sort" />
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
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>{hsn.hsnCode}</td>
                        <td>{hsn.description}</td>
                        <td>{new Date(hsn.createdAt).toLocaleDateString()}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a
                              className="me-2 p-2"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-brand"
                              onClick={() => openModal(hsn)}
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
            <div className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex justify-content-end align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  value={limit}
                  onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
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
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm me-1 ${page === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <AddHsnModals
          show={showModal}
          onClose={() => setShowModal(false)}
          modalData={modalData}
          setModalData={setModalData}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default HSNList;
