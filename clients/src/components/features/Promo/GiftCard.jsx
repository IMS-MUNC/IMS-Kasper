import React, { useMemo, useRef, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import Button from "react-bootstrap/Button";
import { LuCirclePlus } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTrash, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { Modal, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoChevronDown, GoChevronLeft, GoChevronRight } from "react-icons/go";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import dayjs from "dayjs";
import "./GiftCard.css";
import html2canvas from "html2canvas";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import BASE_URL from "../../../pages/config/config";
import DeleteAlert from "../../../utils/sweetAlert/DeleteAlert";


const GiftCard = ({ show, handleClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [GiftCardDatas, setGiftCardDatas] = useState([]);
  const [Error, setError] = useState(null);
  const tableRef = useRef(null);
  const fileInputRef = useRef(null);
  const [Customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Bulk delete state management
  const [selectedGiftCards, setSelectedGiftCards] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Function to check and update expired gift cards
  const checkAndUpdateExpiredGiftCards = async (giftCards) => {
    const currentDate = new Date();
    const expiredCards = giftCards.filter(card => {
      const expiryDate = new Date(card.expiryDate);
      return card.status === true && expiryDate < currentDate;
    });

    if (expiredCards.length > 0) {
      try {
        const token = localStorage.getItem("token");
        
        // Update each expired card
        for (const card of expiredCards) {
          await fetch(`${BASE_URL}/api/giftcard/${card._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...card,
              status: false // Set to inactive
            }),
          });
        }
        
        // Update local state to reflect changes
        const updatedCards = giftCards.map(card => {
          const expiryDate = new Date(card.expiryDate);
          if (card.status === true && expiryDate < currentDate) {
            return { ...card, status: false };
          }
          return card;
        });
        
        return updatedCards;
      } catch (error) {
        console.error('Error updating expired gift cards:', error);
        return giftCards;
      }
    }
    
    return giftCards;
  };

  useEffect(() => {
    const fetchGiftData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/api/giftcard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch giftcard data");
        }
        const data = await response.json();
        console.log(data);
        
        // Check and update expired gift cards
        const updatedData = await checkAndUpdateExpiredGiftCards(data);
        
        const finalData = updatedData.map((item) => ({
          ...item,
          id: item._id, // Mapping _id to id
        }));
        setGiftCardDatas(finalData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGiftData();
  }, []);

  // Periodic check for expired gift cards
  useEffect(() => {
    const checkExpiredCards = async () => {
      if (GiftCardDatas.length > 0) {
        const updatedCards = await checkAndUpdateExpiredGiftCards(GiftCardDatas);
        if (JSON.stringify(updatedCards) !== JSON.stringify(GiftCardDatas)) {
          const finalData = updatedCards.map((item) => ({
            ...item,
            id: item._id,
          }));
          setGiftCardDatas(finalData);
        }
      }
    };

    // Check immediately when component mounts and data is available
    if (GiftCardDatas.length > 0) {
      checkExpiredCards();
    }

    // Set up interval to check every hour (3600000 ms)
    const interval = setInterval(checkExpiredCards, 3600000);

    return () => clearInterval(interval);
  }, [GiftCardDatas]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/api/customers/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Customers data");
        }
        const data = await response.json();

        setCustomers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCustomers();
  }, []);

  // PDF download functionality
  const handlePdf = () => {
    const doc = new jsPDF();
    doc.text("Gift Card List", 14, 15);
    const tableColumns = [
      "Gift Card",
      "Customer",
      "Issued Date",
      "Expiry Date",
      "Amount",
      "Status",
    ];

    const tableRows = filteredGiftCards.map((e) => [
      e.giftCard,
      getCustomerName(e.customer),
      new Date(e.issuedDate).toLocaleDateString(),
      new Date(e.expiryDate).toLocaleDateString(),
      e.amount,
      e.status ? "Active" : "Inactive",
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

    doc.save("gift-card-list.pdf");
  };


  // Excel export functionality
  const handleExcel = () => {
    // Prepare data for Excel export
    const excelData = filteredGiftCards.map((giftCard) => ({
      "Gift Card": giftCard.giftCard,
      "Customer": getCustomerName(giftCard.customer),
      "Issued Date": new Date(giftCard.issuedDate).toLocaleDateString(),
      "Expiry Date": new Date(giftCard.expiryDate).toLocaleDateString(),
      "Amount": giftCard.amount,
      "Status": giftCard.status ? "Active" : "Inactive",
    }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better formatting
    const columnWidths = [
      { wch: 15 }, // Gift Card
      { wch: 20 }, // Customer
      { wch: 15 }, // Issued Date
      { wch: 15 }, // Expiry Date
      { wch: 10 }, // Amount
      { wch: 10 }, // Status
    ];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gift Card List");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "gift-card-list.xlsx");
  };

  // Import Excel functionality
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
          giftCard: item["Gift Card"],
          customer: item["Customer"],
          issuedDate: item["Issued Date"],
          expiryDate: item["Expiry Date"],
          amount: item["Amount"],
          status: item["Status"] === "Active",
        }));

        // Send all at once
        const res = await fetch(`${BASE_URL}/api/giftcard/import`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            giftCardItems: formattedData,
          }),
        });

        const result = await res.json();
        if (res.ok) {
          toast.success(result.message || "Import successful");
          // Refresh the data
          window.location.reload();
        } else {
          toast.error(result.message || "Import failed");
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      toast.error("Import failed");
    }
  };

  const handleCloses = () => {
    setShowModal(false);
    // Clear form fields when modal is closed
    setFormData({
      giftCard: "",
      customer: "",
      issuedDate: "",
      expiryDate: "",
      amount: "",
      status: false,
    });
    setError(null); // Clear any errors
  };

  const [formData, setFormData] = useState({
    giftCard: "",
    customer: "",
    issuedDate: "",
    expiryDate: "",
    amount: "",
    status: false,
  });

  const [editFormData, setEditFormData] = useState({
    giftCard: "",
    customer: "",
    issuedDate: "",
    expiryDate: "",
    amount: "",
    status: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation to ensure all fields are filled
    if (
      !formData.giftCard ||
      !formData.customer ||
      !formData.issuedDate ||
      !formData.expiryDate ||
      !formData.amount 
    ) {
      setError("All fields are required.");
      console.error("Form data is missing required fields:", formData);
      return;
    }

    // Date validation: Ensure issued date is before expiry date
    const issuedDate = dayjs(formData.issuedDate);
    const expiryDate = dayjs(formData.expiryDate);
    const today = dayjs().startOf('day');

    if (issuedDate.isAfter(expiryDate)) {
      toast.error("Issued date must be before expiry date. Please select valid dates.");
      setError("Issued date must be before expiry date.");
      return;
    }

    if (expiryDate.isBefore(today)) {
      toast.error("Expiry date must be a future date. Please select a valid expiry date.");
      setError("Expiry date must be a future date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/giftcard/`, {
        method: "POST", // Send a POST request
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Indicate that we're sending JSON
        },
        body: JSON.stringify(formData), // Send the form data as a JSON string
      });

      // Check if the response is not OK (status 2xx)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.message || "Failed to add gift card"); // Display error from the server if available
      }

      const data = await response.json(); // Parse the response data
      // console.log("New Gift Card Added:", data); // Log the response (the added gift card)

      toast.success("Gift card added successfully!"); // Show success toast

      // Optionally, you can update your state here to show the new gift card in the UI
      setGiftCardDatas((prevData) => [...prevData, data]); // Add the new gift card to the list

      // Close the modal after submission
      handleCloses();
    } catch (err) {
      setError(err.message); // Set error state if something goes wrong
      console.error("Error:", err.message);
    }
  };


  const handleEditOpen = (card) => {
    console.log("Selected Gift Card:", card);
    setEditFormData(card); // preload data
    setShowEditModal(true);
  };
  const handleEditClose = () => {
    setShowEditModal(false);
    setEditFormData({
      id: "",
      giftCard: "",
      customer: "",
      issuedDate: "",
      expiryDate: "",
      amount: "",
      status: false,
    });
  };

  const toEditForm = (row) => ({
    id: row._id, // Include the `_id` of the gift card for the update
    giftCard: row.giftCard,
    customer: row.customer,
    issuedDate: dayjs(row.issuedDate).format("YYYY-MM-DD"), // Format the date
    expiryDate: dayjs(row.expiryDate).format("YYYY-MM-DD"), // Format the date
    amount: row.amount.toString(), // Ensure amount is a string
    status: row.status, // Use the boolean status directly
  });

  const toISO = (prettyDate) => {
    // 24 Dec 2024 ➜ 2024‑12‑24
    const [d, mon, y] = prettyDate.split(" ");
    const m = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mon) / 3 + 1)
      .toString()
      .padStart(2, "0");
    return `${y}-${m}-${d.padStart(2, "0")}`;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Date validation: Ensure issued date is before expiry date
    const issuedDate = dayjs(editFormData.issuedDate);
    const expiryDate = dayjs(editFormData.expiryDate);
    const today = dayjs().startOf('day');

    if (issuedDate.isAfter(expiryDate)) {
      toast.error("Issued date must be before expiry date. Please select valid dates.");
      setError("Issued date must be before expiry date.");
      return;
    }

    if (expiryDate.isBefore(today)) {
      toast.error("Expiry date must be a future date. Please select a valid expiry date.");
      setError("Expiry date must be a future date.");
      return;
    }

    const updatedGiftCardData = {
      ...editFormData,
      issuedDate: dayjs(editFormData.issuedDate).format("YYYY-MM-DD"),
      expiryDate: dayjs(editFormData.expiryDate).format("YYYY-MM-DD"),
      amount: Number(editFormData.amount), // Ensure amount is a number
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/giftcard/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedGiftCardData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update gift card");
      }

      const result = await response.json();
      console.log("Updated Gift Card:", result);

      // Update the state with the updated gift card data
      setGiftCardDatas((prevData) =>
        prevData.map((card) =>
          card._id === editFormData.id ? { ...card, ...result.data } : card
        )
      );

      toast.success(result.message || "Gift card updated successfully");
      handleEditClose();
    } catch (err) {
      console.error("Error updating gift card:", err);
      toast.error(err.message || "Failed to update gift card. Please try again.");
      setError("Failed to update gift card. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await DeleteAlert({
      title: "Are you sure?",
      text: "You won't be able to revert this gift card deletion!",
      confirmButtonText: "Yes, delete it!"
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/giftcard/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete the gift card");
      }

      const result = await response.json();
      
      // Remove the deleted gift card from the state
      setGiftCardDatas((prevData) =>
        prevData.filter((card) => card._id !== id)
      );
      
      toast.success(result.message || "Gift card deleted successfully");
    } catch (err) {
      console.error("Error deleting gift card:", err);
      toast.error(err.message || "Failed to delete the gift card. Please try again.");
      setError("Failed to delete the gift card. Please try again.");
    }
  };

  // Bulk delete functionality
  const handleCheckboxChange = (id) => {
    setSelectedGiftCards((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select/unselect all on current page
  const handleSelectAll = (pageIds, allSelectedOnPage) => {
    if (allSelectedOnPage) {
      setSelectedGiftCards((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedGiftCards((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  // Bulk delete selected gift cards
  const handleBulkDelete = async () => {
    if (selectedGiftCards.length === 0) return;

    const confirmed = await DeleteAlert({
      title: "Are you sure?",
      text: `You won't be able to revert the deletion of ${selectedGiftCards.length} gift card${selectedGiftCards.length > 1 ? 's' : ''}!`,
      confirmButtonText: "Yes, delete them!"
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedGiftCards.map((id) =>
          fetch(`${BASE_URL}/api/giftcard/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      // Remove deleted gift cards from state
      setGiftCardDatas((prevData) =>
        prevData.filter((card) => !selectedGiftCards.includes(card._id))
      );
      
      toast.success(`${selectedGiftCards.length} gift card${selectedGiftCards.length > 1 ? 's' : ''} deleted successfully`);
      setSelectedGiftCards([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Bulk delete failed:", err);
      toast.error("Failed to delete selected gift cards");
    }
  };

  const getCustomerName = (id) => {
    if (!id) return "No Customer";
    if (!Customers || Customers.length === 0) return "Loading...";
    const customer = Customers.find((c) => c._id === id);
    return customer?.name || "Unknown Customer";
  };

  const filteredGiftCards = useMemo(() => {

    const now = dayjs();
    const sevenDaysAgo = now.subtract(7, "day");
    const threeDaysAgo = now.subtract(3, "day");
    const twoDaysAgo = now.subtract(2, "day");
    const oneDaysAgo = now.subtract(1, "day");

    return GiftCardDatas.filter((item) => {
      const customerName = getCustomerName(item.customer);

      const searchMatch =
        item.giftCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status) ||
        (statusFilter === "inactive" && !item.status);

      const sortMatch =
        sortOption === "all" ||
        (sortOption === "last7days" && dayjs(item.issuedDate).isAfter(sevenDaysAgo)) ||
        (sortOption === "last3days" && dayjs(item.issuedDate).isAfter(threeDaysAgo)) ||
        (sortOption === "last2days" && dayjs(item.issuedDate).isAfter(twoDaysAgo)) ||
        (sortOption === "last1days" && dayjs(item.issuedDate).isAfter(oneDaysAgo));

      return searchMatch && statusMatch && sortMatch;
    });
  }, [GiftCardDatas, Customers, searchTerm, statusFilter, sortOption]);

  const totalPages = Math.ceil(filteredGiftCards.length / itemsPerPage);


  const fetchGiftDataref = async () => {
    try {
      setGiftCardDatas([]);
      const response = await fetch(`${BASE_URL}/api/giftcard/`);
      if (!response.ok) {
        throw new Error("Failed to fetch giftcard data");
      }
      const data = await response.json();
      const updatedData = data.map((item) => ({
        ...item,
        id: item._id,
      }));
      setGiftCardDatas(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGiftDataref();
  }, []);


  const handleShow = () => setShowModal(true);
  return (
    <div className="page-wrapper">
      <div className="content">

        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Gift Cards</h4>
              <h6>Manage your gift cards</h6>
            </div>
          </div>
          <div className="table-top-head me-2">
            <li>
              {selectedGiftCards.length > 0 && (
                <button className="btn btn-danger me-2" onClick={handleBulkDelete}>
                  Delete ({selectedGiftCards.length}) Selected
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
          </div>
          <div className="page-btn">
            <a
              href="#"
              className="btn btn-primary"
              data-bs-toggle="modal"
              onClick={handleShow}
            >
              <LuCirclePlus className=" me-1" />
              Add Gift Card
            </a>
          </div>
        </div>

        <div className="card table-list-card">

          <div className="table-top">
            <div className="d-flex gap-3 align-items-center">
              {" "}
              <div className="input-group rounded">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="🔍︎ Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex gap-3">
              <select className="form-select" value={statusFilter} aria-label="Default select example" onChange={(e) => setStatusFilter(e.target.value)}>
                
                <option value="all">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)} aria-label="Default select example">
                <option value="all">Sort</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last1days">Last 1 Days</option>
                <option value="last2days">Last 2 Days</option>
                <option value="last3days">Last 3 Days</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table datanew" ref={tableRef}>
              <thead>
                <tr className="table-head">
                  <th scope="col" style={{ width: "50px" }}>
                    <input
                      type="checkbox"
                      checked={
                        filteredGiftCards
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .length > 0 &&
                        filteredGiftCards
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .every((item) => selectedGiftCards.includes(item._id))
                      }
                      onChange={(e) => {
                        const pageIds = filteredGiftCards
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((item) => item._id);
                        const allSelectedOnPage = pageIds.every((id) =>
                          selectedGiftCards.includes(id)
                        );
                        handleSelectAll(pageIds, allSelectedOnPage);
                      }}
                    />
                  </th>
                  <th scope="col">Gift Card</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Issued Date</th>
                  <th scope="col">Expiry Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th style={{textAlign:'center'}}>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredGiftCards
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedGiftCards.includes(item._id)}
                          onChange={(e) => handleCheckboxChange(item._id, e.target.checked)}
                        />
                      </td>
                      <td>{item.giftCard}</td>
                      <td>{getCustomerName(item.customer)}</td>
                      <td>{dayjs(item.issuedDate).format("YYYY-MM-DD")}</td>
                      <td>{dayjs(item.expiryDate).format("YYYY-MM-DD")}</td>
                      <td>{item.amount}</td>
                      <td>
                        <span
                          className={`badge ${item.status ? "badge-success" : "badge-danger"
                            }`}
                        >
                          {item.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="iconsms" style={{display:'flex', justifyContent:'center', gap:'10px'}}>
                          {/* <button>
                            <IoEyeOutline />
                          </button> */}
                          <button
                            variant="warning text-white"
                            onClick={() => handleEditOpen(toEditForm(item))}
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button onClick={() => handleDelete(item._id)}
                            title="Delete"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

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
              <option value={5}>5 Per Page</option>
              <option value={10}>10 Per Page</option>
              <option value={20}>20 Per Page</option>
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
              {filteredGiftCards.length === 0
                ? "0 of 0"
                : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                  currentPage * itemsPerPage,
                  filteredGiftCards.length
                )} of ${filteredGiftCards.length}`}
              <button
                style={{
                  border: "none",
                  color: "grey",
                  backgroundColor: "white",
                }}
                title="Previous"
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
                title="Next"
                disabled={currentPage === totalPages}
              >
                <MdNavigateNext />
              </button>
            </span>
          </div>


        </div>
        </div>
      
        {/* add models */}
        <Modal show={showModal} onHide={handleCloses} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Gift Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="giftCard">
                <Form.Label>
                  Gift Card <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter gift card name"
                  name="giftCard"
                  value={formData.giftCard}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="customer" className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="mb-0">
                    Customer <span className="text-danger">*</span>
                  </Form.Label>
                  {/* <Button
                    variant="link"
                    className="text-warning p-0 text-decoration-none d-flex align-items-center gap-1"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    <FiPlusCircle style={{ fontSize: "1.1rem" }} />
                    Add New
                  </Button> */}
                </div>
                <Form.Select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="mt-1"
                >
                  <option value="">
                    {Customers.length === 0 ? "Loading customers..." : "Select Customer"}
                  </option>
                  {Customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row className="mt-3">
                <Col>
                  <Form.Group controlId="issuedDate">
                    <Form.Label>
                      Issued Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="issuedDate"
                      value={dayjs(formData.issuedDate).format("YYYY-MM-DD")}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="expiryDate">
                    <Form.Label>
                      Expiry Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Form.Group controlId="amount">
                    <Form.Label>
                      Amount <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                {/* <Col>
                  <Form.Group controlId="balance">
                    <Form.Label>
                      Balance <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col> */}
              </Row>

              <Form.Group
                controlId="status"
                className="mt-4 d-flex align-items-center justify-content-between"
              >
                <Form.Label className=" me-3 mb-0">Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className=""
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{gap:'10px'}}>
            <Button variant="dark" onClick={handleCloses}>
              Cancel
            </Button>
            <Button variant="warning" onClick={handleSubmit}>
              Add Gift Card
            </Button>
          </Modal.Footer>
        </Modal>

        {/* edit modal */}
        <Modal show={showEditModal} onHide={handleEditClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Gift Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editGiftCard">
                <Form.Label>
                  Gift Card <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="giftCard"
                  value={editFormData.giftCard}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, giftCard: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="editCustomer" className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Label className="mb-0">
                    Customer <span className="text-danger">*</span>
                  </Form.Label>
                  {/* <Button
                    variant="link"
                    className="text-warning p-0 text-decoration-none d-flex align-items-center gap-1"
                  >
                    <FiPlusCircle style={{ fontSize: "1.1rem" }} />
                    Add New
                  </Button> */}
                </div>
                <Form.Select
                  name="customer"
                  value={editFormData.customer}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, customer: e.target.value })
                  }
                  className="mt-1"
                >
                  <option value="">Select</option>
                  {Customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row className="mt-3">
                <Col>
                  <Form.Group controlId="editIssuedDate">
                    <Form.Label>
                      Issued Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="issuedDate"
                      value={editFormData.issuedDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          issuedDate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="editExpiryDate">
                    <Form.Label>
                      Expiry Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="expiryDate"
                      value={editFormData.expiryDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Form.Group controlId="editAmount">
                    <Form.Label>
                      Amount <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={editFormData.amount}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                {/* <Col>
                  <Form.Group controlId="editBalance">
                    <Form.Label>
                      Balance <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="balance"
                      value={editFormData.balance}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          balance: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col> */}
              </Row>

              <Form.Group
                controlId="editStatus"
                className="mt-4 d-flex align-items-center justify-content-between"
              >
                <Form.Label className="me-3 mb-0">Status</Form.Label>
                <Form.Check
                  type="switch"
                  name="status"
                  checked={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.checked })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{gap:'10px'}}>
            <Button variant="dark" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button variant="warning" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ───────────────── Add‑Customer Modal ──────────────── */}
        <Modal
          show={showCustomerModal}
          onHide={() => setShowCustomerModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Customer</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form
              id="addCustomerForm"
              onSubmit={async (e) => {
                e.preventDefault();


                const name = e.target.customerName.value.trim();
                if (!name) return;

                try {
                  // 👉 hit your API (or whatever you use) to save
                  const res = await fetch(`${BASE_URL}/api/customers/`, {
                    method: "POST",
                    headers: { 
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ 
                      name: name,
                      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                      phone: "0000000000"
                    }),
                  });
                  const saved = await res.json();

                  // 👉 pop the new customer into the dropdown list
                  setFormData((prev) => ({ ...prev, customer: saved._id }));
                  // Update the customers list with the new customer
                  setCustomers((prev) => [...prev, saved]);

                  setShowCustomerModal(false);
                } catch (err) {
                  console.error(err);
                  alert("Couldn’t add customer. Please try again.");
                }
              }}
            >
              <Form.Group controlId="customer">
                <Form.Label>
                  Customer <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control name="customerName" placeholder="Enter customer name" />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="dark" onClick={() => setShowCustomerModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" type="submit" form="addCustomerForm" >
              Add Customer
            </Button>
          </Modal.Footer>
        </Modal>

    </div>
  );
};

export default GiftCard;
