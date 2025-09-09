 <div className="all-customers">
      <div className="breadcrumb">
        <div>All Customers</div>
        <div style={{ gap: "16px", display: "flex" }}>
          <button onClick={() => { setSelectedCustomer(null); setShowAddModal(true); }} className="add-btn">
            + Add New Customer
          </button>
          <select className="create-btn">
            <option value="">Create</option>
            <option value="">Create Sales</option>
            <option value="">Create Quotation</option>
            <option value="">Create Invoice</option>
          </select>
        </div>
      </div>

      <div className="top-bar">
        <div className="filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">New</button>
          <button className="filter-btn">
            <FaPlus />
          </button>
        </div>

        <div className="icon-group" style={{ display: "flex", gap: "16px" }}>
          <div
            className="icon-box"
            style={{
              borderRadius: "4px",
              gap: "4px",
              padding: "4px",
              border: "1px solid #F1F1F1",
              olor: "#676767",
            }}
          >
            <CiSearch />
            <IoFilter />
          </div>
          <div
            className="icon-box"
            style={{
              borderRadius: "4px",
              padding: "4px",
              border: "1px solid #F1F1F1",
              color: "#676767",
            }}
          >
            <LuArrowUpDown />
          </div>
        </div>
      </div>

      <table className="customer-table">
        <thead>
          <tr style={{ backgroundColor: "#e6e6e6" }}>
            <th>
              <input type="checkbox" />
            </th>
            <th>Customer Name</th>
            <th>Address</th>
            <th>Contact No.</th>
            <th>Total Order</th>
            <th>Total Spent</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, i) => (
            <tr
              key={cust._id || i}
              style={{ cursor: "pointer" }}
            >
              <td>
                <input type="checkbox" />
              </td>

              
              <td onClick={() => handleCustomerClick(cust)}>
                <div className="customer-info">
                  <img
                    src="https://via.placeholder.com/32"
                    alt="avatar"
                    className="avatar"
                  />
                  {cust.name}
                </div>
              </td>


              <td>{formatAddress(cust.billing)}</td>
              <td>{cust.phone}</td>
              <td>-</td>
              <td>-</td>
              <td>
                <button onClick={e => { e.stopPropagation(); handleEditCustomer(cust); }} style={{marginRight: 8}}>Edit</button>
                <button onClick={e => { e.stopPropagation(); handleDeleteCustomer(cust._id); }} style={{color: 'red'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <select style={{ border: "1px solid #F1F1F1", padding: "4px" }}>
          <option>10 per page</option>
        </select>
        <div style={{ border: "1px solid #F1F1F1", padding: "4px" }}>
          <span>1-25 of 369</span>
          <button style={{ border: "none", background: "transparent" }}>
            <MdKeyboardArrowLeft />
          </button>
          <button style={{ border: "none", background: "transparent" }}>
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>


      {showAddModal && !showEditModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchCustomers(); }}
        />
      )}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setShowEditModal(false); fetchCustomers(); }}
        />
      )}

      {/* Pop Up data */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <div className="modal-header">
              <span>All Customers</span> <IoIosArrowForward />{" "}
              <strong>{selectedCustomer.name}</strong>
            </div>

            <div className="modal-stats">
              <div className="stat-card">
                <p>Total Spent</p>
                <h3>₹ 175,489</h3>
              </div>
              <div className="stat-card">
                <p>Order</p>
                <h3>6</h3>
              </div>
              <div className="stat-card">
                <p>Initial Purchase Date</p>
                <h3>2/09/2023</h3>
              </div>
              <div className="stat-card">
                <FaExclamationTriangle
                  style={{ color: "#007aff", backgroundColor: "#f5f6fa" }}
                />
                <p>Dues Amount</p>
                <h3>₹ 75,489</h3>
              </div>
            </div>

            <div className="modal-details">
              <div className="profile-box">
                <h4>User Profile</h4>
                <p>
                  <strong>Name:</strong> {selectedCustomer.name}
                </p>
                <p>
                  <strong>Address:</strong> {selectedCustomer.address}
                </p>
                <p>
                  <strong>Phone No.:</strong> {selectedCustomer.contact}
                </p>
              </div>

              <div className="orders-box">
                <h4
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Recent Orders <span>12/09/2025</span>
                </h4>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>🦽 Wheel Chair</td>
                      <td>10</td>
                      <td>₹ 50,000.00</td>
                    </tr>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>💺 Office Chair</td>
                        <td>5</td>
                        <td>₹ 25,000.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>


// import React from 'react'

// function PopUpCustomerDetails() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default PopUpCustomerDetails