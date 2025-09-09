import React from 'react'

const varient = () => {
  return (
    <div>
      <div className="fn-conatiner">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex bd-highlight justify-content-between align-items-start">
                <div className="p-3 mt-0 flex-grow-1">
                    <div className="h4">Variant Attributes</div>
                    <div className="text-secondary">Manage your variant attributes</div>
                </div>

                <div className="d-flex align-items-center gap-1 p-4 mt-0">
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
                        <AiOutlineFileExcel size={24} />
                    </Button>

                    <Button
                        variant="light"
                        aria-label="Refresh"
                        className="text-secondary"
                        onClick={fetchVariants}
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
                    <button className="btn btn-warning text-white" onClick={handleShow}>
                        <LuCirclePlus /> Add Variant
                    </button>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloses} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Variant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="variant">
                            <Form.Label>
                                Variant <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter variant (e.g., Size, Color)"
                                name="variant"
                                value={formData.variant}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="value" className="mt-3">
                            <Form.Label>
                                Values <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter values separated by comma (e.g., XS, S, M, L)"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        Enter Value separated by comma

                        <Form.Group
                            controlId="status"
                            className="mt-4 d-flex align-items-center justify-content-between"
                        >
                            <Form.Label className="me-3 mb-0">Status</Form.Label>
                            <Form.Check
                                type="switch"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-dark" onClick={handleCloses}>
                        Cancel
                    </button>
                    <button className="btn btn-warning text-white" onClick={handleSubmit}>
                        Add Variant
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleEditClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Variant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editVariant">
                            <Form.Label>
                                Variant <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="variant"
                                value={editFormData.variant}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="editValue" className="mt-3">
                            <Form.Label>
                                Values <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="value"
                                value={editFormData.value}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group
                            controlId="editStatus"
                            className="mt-4 d-flex align-items-center justify-content-between"
                        >
                            <Form.Label className="me-3 mb-0">Status</Form.Label>
                            <Form.Check
                                type="switch"
                                name="status"
                                checked={editFormData.status}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-dark" onClick={handleEditClose}>
                        Cancel
                    </button>
                    <button className="btn btn-warning" onClick={handleEditSubmit}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body className="text-center py-4">
                    <div className="d-flex justify-content-center mb-3">
                        <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                            <RiDeleteBinLine size={28} className="text-danger" />
                        </div>
                    </div>
                    <h5 className="fw-bold">Delete Variant</h5>
                    <p>Are you sure you want to delete variant?</p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button className="btn btn-dark" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-warning" onClick={() => handleDelete(pendingDeleteId)}>
                            Yes Delete
                        </button>
                    </div>
                </Modal.Body>
            </Modal>




            <div className="container-mn">
                <div className="d-flex justify-content-between align-items-center p-3">
                    <div>
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
                        <select
                                                    aria-label="Default select example"

                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
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
                                <th scope="col">Variant</th>
                                <th scope="col">Values</th>
                                <th scope="col">Created Date</th>
                                <th scope="col">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVariants
                                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                .map((item, idx) => (
                                    <tr key={idx}>
                                        <th scope="col">
                                            <input type="checkbox" />
                                        </th>
                                        <td>{item.variant}</td>
                                        <td>{item.value}</td>
                                        <td>{dayjs(item.createdAt).format("DD MMM YYYY")}</td>
                                        <td>
                                            <span className={`badge ${item.status ? "badge-success" : "badge-danger"}`}>
                                                {item.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="iconsms">
                                                {/* <button>
                                                    <IoEyeOutline />
                                                </button> */}
                                                <button onClick={() => handleEditOpen(item)}>
                                                    <FiEdit />
                                                </button>
                                                <button onClick={() => openDeleteModal(item.id)}>
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
                    <div className="d-flex gap-3 align-items-center">
                        <div>Row Per Page</div>
                        <select
                            className="form-select"
                            name="rows"
                            id="rows"
                            style={{ width: "80px" }}
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <div>Entries</div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn"
                            style={{ border: "none", background: "transparent" }}
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
                            style={{ border: "none", background: "transparent" }}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, Math.ceil(filteredVariants.length / rowsPerPage))
                                )
                            }
                            disabled={currentPage === Math.ceil(filteredVariants.length / rowsPerPage)}
                            aria-label="Next Page"
                        >
                            <GoChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="settings">
                <IoSettingsSharp />
            </div> */}
        </div>
    </div>
  )
}

export default varient
