import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Button, Row, Col, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";

const PurchaseReport = () => {
    const [report, setReport] = useState([]);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({ purchase: 0, quantity: 0, return: 0 });
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

    const fetchReport = async (newPage = page) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const params = { page: newPage, limit };
            if (search) params.search = search;
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            const res = await axios.get("/api/purchases/report", {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReport(res.data.data);
            setTotals(res.data.totals);
            setPagination(res.data.pagination || { totalPages: 1, currentPage: newPage });
            setPage(newPage);
        } catch (err) {
            toast.error("Failed to fetch report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(1);
        // eslint-disable-next-line
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchReport(1);
    };

    const handlePageChange = (newPage) => {
        fetchReport(newPage);
    };

    return (
        <div className="pagewrapper">
            <div className="content">
                <div className="" style={{ marginTop: '70px', marginLeft: '100px' }}>
                    <h4>Purchase Report</h4>
                    <Form onSubmit={handleFilter} className="mb-3">
                        <Row className="align-items-end">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Reference, Supplier, Product..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? "Loading..." : "Filter"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="mb-3">
                        <strong>Total Purchases:</strong> {totals.purchase} | <strong>Total Quantity:</strong> {totals.quantity} | <strong>Total Return:</strong> {totals.return}
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference</th>
                                <th>Supplier</th>
                                <th>Status</th>
                                <th>Products</th>
                                <th>Total Qty</th>
                                <th>Total Return</th>
                                <th>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((row) => (
                                <tr key={row._id}>
                                    <td>{row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : ""}</td>
                                    <td>{row.referenceNumber}</td>
                                    <td>{row.supplier?.firstName} {row.supplier?.lastName}</td>
                                    <td>{row.status}</td>
                                    <td>
                                        {row.products.map((p, idx) => (
                                            <div key={idx}>
                                                {p.product?.productName} ({p.quantity})
                                            </div>
                                        ))}
                                    </td>
                                    <td>{row.products.reduce((sum, p) => sum + (p.quantity || 0), 0)}</td>
                                    <td>{row.products.reduce((sum, p) => sum + (p.returnQty || 0), 0)}</td>
                                    <td>{row.grandTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={page === i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pagination.totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(pagination.totalPages)} disabled={page === pagination.totalPages} />
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseReport;
