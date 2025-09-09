import React, { useMemo, useRef, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoIosArrowUp } from "react-icons/io";
import Button from "react-bootstrap/Button";
import { LuCirclePlus } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { Modal, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoChevronDown, GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FiPlusCircle } from "react-icons/fi";
import dayjs from "dayjs";
import "./GiftCard.css";
import html2canvas from "html2canvas";
import { useEffect } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import BASE_URL from "../../../pages/config/config";


const GiftCard = ({ show, handleClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [GiftCardDatas, setGiftCardDatas] = useState([]);
  const [Error, setError] = useState(null);
  const tableRef = useRef(null);
  const [Customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    const fetchGiftData = async () => {
      try {
            const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/api/giftcard/`,{
           headers: {
        Authorization: `Bearer ${token}`,
      },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch giftcard data");
        }
        const data = await response.json();
        console.log(data);
        const updatedData = data.map((item) => ({
          ...item,
          id: item._id, // Mapping _id to id
        }));
        setGiftCardDatas(updatedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGiftData();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
            const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/api/customers/`,{
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

  // Function to handle PDF export
  const handleExportPDF = () => {
    const table = tableRef.current;
    if (!table) {
      console.error("Table reference not found");
      return;
    }
       
    // Use html2canvas to capture the table as an image
    
    html2canvas(table, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190; // Width of the PDF page content (in mm)
        const pageHeight = 295; // Height of A4 page (in mm)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multi-page PDF if the table is too long
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Save the PDF with a filename
        pdf.save("gift_cards.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setError("Failed to generate PDF. Please try again.");
      });
  };


  const handleExportExcel = () => {
  const exportData = filteredGiftCards.map((item) => ({
    "Gift Card": item.giftCard,
    "Customer": getCustomerName(item.customer),
    "Issued Date": dayjs(item.issuedDate).format("YYYY-MM-DD"),
    "Expiry Date": dayjs(item.expiryDate).format("YYYY-MM-DD"),
    "Amount": item.amount,
    "Balance": item.balance,
    "Status": item.status ? "Active" : "Inactive",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "GiftCards");

  XLSX.writeFile(workbook, "gift_cards.xlsx");
};

  const handleCloses = () => setShowModal(false);

  const [formData, setFormData] = useState({
    giftCard: "",
    customer: "",
    issuedDate: "",
    expiryDate: "",
    amount: "",
    balance: "",
    status: false,
  });

  const [editFormData, setEditFormData] = useState({
    giftCard: "",
    customer: "",
    issuedDate: "",
    expiryDate: "",
    amount: "",
    balance: "",
    status: false,
  });
  const [CformData, setCformData] = useState({ addcustomers: "" });

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
      !formData.amount ||
      !formData.balance
    ) {
      setError("All fields are required.");
      console.error("Form data is missing required fields:", formData);
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
      console.log("New Gift Card Added:", data); // Log the response (the added gift card)

      // Optionally, you can update your state here to show the new gift card in the UI
      setGiftCardDatas((prevData) => [...prevData, data]); // Add the new gift card to the list

      // Close the modal after submission
      handleClose();
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
      balance: "",
      status: false,
    });
  };

  const toEditForm = (row) => ({
    id: row.id, // Include the `id` of the gift card for the update
    giftCard: row.giftCard,
    customer: row.customer,
    issuedDate: dayjs(row.issuedDate).format("YYYY-MM-DD"), // Format the date
    expiryDate: dayjs(row.expiryDate).format("YYYY-MM-DD"), // Format the date
    amount: row.amount.toString(), // Ensure amount is a string
    balance: row.balance.toString(), // Ensure balance is a string
    status: row.status === "Active", // Set status to true if it's active
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

    const updatedGiftCardData = {
      ...editFormData,
      issuedDate: dayjs(editFormData.issuedDate).format("YYYY-MM-DD"),
      expiryDate: dayjs(editFormData.expiryDate).format("YYYY-MM-DD"),
      amount: Number(editFormData.amount), // Ensure amount is a number
      balance: Number(editFormData.balance), // Ensure balance is a number
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/giftcard/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedGiftCardData),
        }
      );
      console.log("");

      if (!response.ok) {
        throw new Error("Failed to update gift card");
      }

      const data = await response.json();
      console.log("Updated Gift Card:", data);

      setGiftCardDatas((prevData) =>
        prevData.map((card) =>
          card.id === data.id ? { ...card, ...data } : card
        )
      );

      handleEditClose();
    } catch (err) {
      console.error("Error updating gift card:", err);
      setError("Failed to update gift card. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this gift card?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/api/giftcard/${id}`, {
        method: "DELETE", // HTTP method for deleting data
      });

      if (!response.ok) {
        throw new Error("Failed to delete the gift card");
      }

      // Remove the deleted gift card from the state
      setGiftCardDatas((prevData) =>
        prevData.filter((card) => card._id !== id)
      );
      alert("Gift card deleted successfully");
    } catch (err) {
      console.error("Error deleting gift card:", err);
      setError("Failed to delete the gift card. Please try again.");
    }
  };

  const getCustomerName = (id) =>
  Customers.find((c) => c._id === id)?.addcustomers || "Unknown";

const filteredGiftCards = useMemo(() => {
  const getCustomerName = (id) =>
    Customers.find((c) => c._id === id)?.addcustomers || "Unknown";

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
      (sortOption === "last7days" && dayjs(item.issuedDate).isAfter(sevenDaysAgo))  || 
      (sortOption === "last3days" &&  dayjs(item.issuedDate).isAfter(threeDaysAgo)) ||
      (sortOption === "last2days" &&  dayjs(item.issuedDate).isAfter(twoDaysAgo)) ||
      (sortOption === "last1days" &&  dayjs(item.issuedDate).isAfter(oneDaysAgo));

    return searchMatch && statusMatch && sortMatch;
  });
}, [GiftCardDatas, Customers, searchTerm, statusFilter, sortOption]);


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
        <div className="d-flex bd-highlight justify-content-between align-items-start ">
        <div className=" flex-grow-1 ">
          <div className="h4">Gift Cards</div>
          <div className="text-secondary">Manage your gift cards</div>
        </div>
        <div className="d-flex align-items-center gap-1 p-4 ">
          <Button
            className="text-danger"
            variant="light"
            aria-label="Export as PDF"
            onClick={handleExportPDF}
          >
            <BiSolidFilePdf size={24} />
          </Button>
          <Button
            className="text-success"
            variant="light"
            aria-label="Export as Excel"
             onClick={handleExportExcel}
          >
            <BiSolidFilePdf size={24} />
          </Button>
          <Button
            variant="light"
            aria-label="Refresh"
            className="text-secondary"
             onClick={fetchGiftDataref}
          >
            <HiOutlineRefresh size={20} />
          </Button>
          <Button
            variant="light"
            aria-label="Collapse"
            className="text-secondary"
          >
            <IoIosArrowUp size={18} />
          </Button>

          <Button variant="warning text-white" onClick={handleShow}>
            <LuCirclePlus /> Add Gift Card
          </Button>
        </div>
      </div>
      
      {/* models */}

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
                <Button
                  variant="link"
                  className="text-warning p-0 text-decoration-none d-flex align-items-center gap-1"
                  onClick={() => setShowCustomerModal(true)}
                >
                  <FiPlusCircle style={{ fontSize: "1.1rem" }} />
                  Add New
                </Button>
              </div>
              <Form.Select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="mt-1"
              >
                <option value="">Select</option>
                {Customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.addcustomers}
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
              <Col>
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
              </Col>
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
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleSubmit}>
            Add Gift Card
          </Button>
        </Modal.Footer>
      </Modal>
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
                <Button
                  variant="link"
                  className="text-warning p-0 text-decoration-none d-flex align-items-center gap-1"
                >
                  <FiPlusCircle style={{ fontSize: "1.1rem" }} />
                  Add New
                </Button>
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
                    {c.addcustomers}
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
              <Col>
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
              </Col>
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
        <Modal.Footer>
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
              

                 const name = e.target.addcustomers.value.trim();
              if (!name) return;

              try {
                // 👉 hit your API (or whatever you use) to save
                const res = await fetch(`${BASE_URL}/api/customers/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ addcustomers: name }),
                });
                const saved = await res.json();

                // 👉 pop the new customer into the dropdown list
                setFormData((prev) => ({ ...prev, customer: saved._id }));
                // if you keep a separate customers list:
                // setCustomers((prev) => [...prev, saved]);

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
              <Form.Control name="addcustomers" placeholder="Enter customer name" />
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

      <div className="container-mn">
        <div className="d-flex justify-content-between align-items-center p-3 ">
          <div>
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
            <select className="form-select"  value={statusFilter} aria-label="Default select example" onChange={(e) => setStatusFilter(e.target.value)}>
              <option>Status</option>
               <option value="all">All Status</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
            </select>
            <select className="form-select" value={sortOption}  onChange={(e) => setSortOption(e.target.value)} aria-label="Default select example">
              <option value="all">Sort: All Time</option>
              <option value="last7days">Sort: Last 7 Days</option>
              <option value="last1days">Sort: Last 1 Days</option>
              <option value="last2days">Sort: Last 2 Days</option>
              <option value="last3days">Sort: Last 3 Days</option>
            </select>
          </div>
        </div>
        <div>
          <table className="table" ref={tableRef}>
            <thead className="tableheader">
              <tr>
                <th scope="col">
                  <input type="checkbox" />
                </th>
                <th scope="col">Gift Card</th>
                <th scope="col">Customer</th>
                <th scope="col">Issued Date</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Balance</th>
                <th scope="col">Status</th>
                <th></th>
              </tr>
            </thead>
            
            <tbody>
              
              {filteredGiftCards
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((item, idx) => (
                <tr key={idx}>
                  <th scope="col">
                    <input type="checkbox" />
                  </th>
                  <td>{item.giftCard}</td>
                 <td>{getCustomerName(item.customer)}</td>
                  <td>{dayjs(item.issuedDate).format("YYYY-MM-DD")}</td>
                  <td>{dayjs(item.expiryDate).format("YYYY-MM-DD")}</td>
                  <td>{item.amount}</td>
                  <td>{item.balance}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="iconsms">
                      <button>
                        <IoEyeOutline />
                      </button>
                      <button
                        variant="warning text-white"
                        onClick={() => handleEditOpen(toEditForm(item))}
                      >
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(item._id)}>
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center p-3">
          {/* Row Per Page Section */}
          <div className="d-flex gap-3 align-items-center">
            <div>Rows Per Page</div>

            {/* <select
              className="form-select"
              name="rows"
              id="rows"
              style={{ width: "80px" }}
            >
              
              <option value="10">10</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select> */}

            <select
  className="form-select"
  name="rows"
  id="rows"
  style={{ width: "80px" }}
  value={rowsPerPage}
  onChange={(e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 on change
  }}
>
  <option value="5">5</option>
  <option value="10">10</option>
  <option value="20">20</option>
</select>

            <div>Entries</div>
          </div>
                {/* 
          <div className="d-flex align-items-center gap-3">
            <button className="btn " aria-label="Previous Page">
              <GoChevronLeft size={20} />
            </button>

            <div className="text-center downt">
              <span>1</span>
            </div>

            <button className="btn " aria-label="Next Page">
              <GoChevronRight size={20} />
            </button>
          </div>*/}
          <div className="d-flex align-items-center gap-3">
  <button
    className="btn"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    aria-label="Previous Page"
  >
    <GoChevronLeft size={20} />
  </button>

  <div className="text-center downt">
    <span>{currentPage}</span>
  </div>

  <button
    className="btn"
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(filteredGiftCards.length / rowsPerPage))
      )
    }
    disabled={currentPage === Math.ceil(filteredGiftCards.length / rowsPerPage)}
    aria-label="Next Page"
  >
    <GoChevronRight size={20} />
  </button>
</div>


        </div>
      </div>

      <div className="settings">
        <IoSettingsSharp />
      </div>
    </div>
    </div>
  );
};

export default GiftCard;
