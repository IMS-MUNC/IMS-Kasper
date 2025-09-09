
// // final
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import BASE_URL from "../../config/config";
import "../../../styles/purchase/purchase.css";

const AddPurchaseModal = () => {
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/status/active`);
        const users = res.data.users;
        const formattedOptions = users.map((user) => ({
          value: user._id,
          label: `${user.firstName} ${user.lastName} (${user.email})`,
        }));
        setOptions(formattedOptions);
      } catch (err) {
        console.error("Error fetching active users:", err);
      }
    };
    fetchActiveUsers();
  }, []);

  const handleActiveUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        axios
          .get(`${BASE_URL}/api/products/search?name=${searchTerm}`)
          .then((res) => setProducts(res.data))
          .catch((err) => console.error("Search error:", err));
      } else {
        setProducts([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelectProduct = (product) => {
    const alreadyExists = selectedProducts.some((p) => p._id === product._id);
    if (!alreadyExists) {
      const taxMatch = product.tax?.match(/\((\d+)%\)/);
      const taxPercent = taxMatch ? parseFloat(taxMatch[1]) : 0;

      setSelectedProducts([
        ...selectedProducts,
        {
          ...product,
          quantity: 1, // start with 1
          availableQty: product.quantity || 0,
          discount: product.discountValue || 0,
          tax: taxPercent,
        },
      ]);
    }

    setProducts([]);
    setSearchTerm("");
  };

  const updateQuantity = (index, delta) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };
  // const updateQuantity = (index, delta) => {
  //   setSelectedProducts((prev) =>
  //     prev.map((item, i) => {
  //       if (i !== index) return item;

  //       const newQty = item.quantity + delta;
  //       if (newQty < 1) return { ...item, quantity: 1 };
  //       if (newQty > item.availableQty) return { ...item, quantity: item.availableQty };

  //       return { ...item, quantity: newQty };
  //     })
  //   );
  // };

  return (
    <div className="modal fade" id="add-purchase">
    

        <div className="modal-dialog purchase modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="page-title">
                <h4>Add Purchase</h4>
              </div>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3 add-product">
                      <label className="form-label">
                        Supplier Name<span className="text-danger ms-1">*</span>
                      </label>
                      <div className="row">
                        <div className="col-lg-10 col-sm-10 col-10">
                          <Select options={options} value={selectedUser} onChange={handleActiveUserChange} isSearchable
                            placeholder="Search and select a user..." />
                        </div>
                        <div className="col-lg-2 col-sm-2 col-2 ps-0">
                          <div className="add-icon tab">
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_customer">
                              <i data-feather="plus-circle" className="feather-plus-circles" />
                            </a>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Date<span className="text-danger ms-1">*</span>
                      </label>
                      <div className="input-groupicon calender-input">
                        <i data-feather="calendar" className="info-img" />
                        <input type="text" className="datetimepicker form-control p-2" placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Reference<span className="text-danger ms-1">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Product<span className="text-danger ms-1">*</span>
                      </label>
                      <input type="text" className="form-control" placeholder="Search Product" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  

                    {/* Search Result List */}
                    {products.length > 0 && (
                      <div className="search-results border rounded p-3 mb-3">
                        <h6 className="fw-semibold border-bottom pb-2 mb-3">
                          <i className="bi bi-list me-2" />
                          All Products
                          <span className="float-end text-muted small">
                            {products.length} Result{products.length > 1 ? "s" : ""}
                          </span>
                        </h6>

                        {products.map((product) => (
                          <div key={product._id}
                            className="d-flex align-items-start justify-content-between py-2 border-bottom" onClick={() =>
                              handleSelectProduct(product)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-start gap-3">
                              {product.images?.[0] && (
                                <img src={product.images[0].url} alt={product.productName} className="media-image"
                                  style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                              )}
                              <div>
                                <h6 className="fw-bold mb-1">{product.productName}</h6>
                                <p className="text-muted small mb-0">
                                  {product.productCode || "N/A"} • {product.category?.name || "No Category"} •{" "}
                                  {product.subCategory || "No Sub"} • ₹{product.price}/kg • Available Qty -{" "}
                                  {product.quantity || 0}kg
                                </p>
                              </div>
                            </div>

                            <i className="bi bi-pencil text-primary" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                  <div className="col-lg-12">
                    <div className="modal-body-table mt-3">
                      <div className="table-responsive">
                        <table className="table datatable rounded-1">
                          <thead>
                            <tr>
                              <th className="bg-secondary-transparent p-3">
                                Product Name
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Qty
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Purchase Price
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Discount
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Tax(%)
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Tax Amount
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Unit Cost
                              </th>
                              <th className="bg-secondary-transparent p-3">
                                Total Cost
                              </th>
                            </tr>
                          </thead>
                      <tbody>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((product, index) => {
                      const qty = product.availableQty;
                      const price = product.purchasePrice || 0;
                      const discount = product.discount || 0;
                      const tax = product.tax || 0;
                      const subTotal = qty * price;
                      const afterDiscount = subTotal - discount;
                      const taxAmount = (afterDiscount * tax) / 100;
                      const totalCost = afterDiscount + taxAmount;
                      const unitCost = totalCost / qty;

                      return (
                        <tr key={index}>
                          <td>
                            {product.productName}
                            <br />
                            <small className="text-muted">
                              Available: {product.availableQty}
                            </small>
                          </td>
                          <td className="p-0">
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{
                                border: "1px solid #E6EAED",
                                backgroundColor: "#FAFBFE",
                                borderRadius: "8px",
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-sm btn-light px-2"
                                onClick={() => updateQuantity(index, -1)}
                                disabled={product.quantity <= 1}
                              >
                                −
                              </button>
                              <span>{qty}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-light px-2"
                                onClick={() => updateQuantity(index, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>₹{price}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: "80px" }}
                              value={discount}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedProducts((prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? {
                                        ...item,
                                        discount: isNaN(val) ? 0 : val,
                                      }
                                      : item
                                  )
                                );
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: "60px" }}
                              value={tax}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedProducts((prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? { ...item, tax: isNaN(val) ? 0 : val }
                                      : item
                                  )
                                );
                              }}
                            />
                          </td>
                          <td>₹{taxAmount.toFixed(2)}</td>
                          <td>₹{unitCost.toFixed(2)}</td>
                          <td className="fw-semibold text-success">
                            ₹{totalCost.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No products selected.
                      </td>
                    </tr>
                  )}
                </tbody>
                          {/* <tbody>
                            {selectedProducts.length > 0 ? (
                              selectedProducts.map((product, index) => (
                                <tr key={index}>
                                  <td className="p-0">
                                    <div className="d-flex align-items-start gap-3">
                                      {product.images?.[0] && (
                                        <img src={product.images[0].url} alt={product.productName} className="media-image"
                                          style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }} />
                                      )}
                                      <div>
                                        <h6 className="fw-bold mb-0">{product.productName}</h6>
                                    
                                      </div>
                                    </div>

                                  </td>
                                  <td className="p-0">
                                    <div className="d-flex align-items-center gap-2"
                                      style={{ border: "1px solid #E6EAED", backgroundColor: "#FAFBFE", borderRadius: "8PX" }}>
                                      <button type="button" className="btn btn-sm btn-light px-2" onClick={() =>
                                        updateQuantity(index, -1)}
                                        disabled={product.quantity <= 1}>
                                        −
                                      </button>
                                      <span className="product-quantity">{product.quantity}</span>

                                      <button type="button" className="btn btn-sm btn-light px-2" onClick={() =>
                                        updateQuantity(index, 1)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>

                                  <td className="p-0">{product.purchasePrice}</td>
                                  <td className="p-0">{product.discountValue}</td>
                                  <td className="p-0">{product.tax}</td>
                                  <td className="p-0">{product.discountValue}</td>
                                  <td className="p-0">{product.discountValue}</td>
                                  <td className="p-0">{product.discountValue}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center text-muted">
                                  No Products Selected.
                                </td>
                              </tr>
                            )}
                          </tbody> */}

                          
                        </table>
                      </div>
                    </div>
                  </div>
	<div class="row">
							<div class="col-lg-12 float-md-right">
								<div class="total-order m-2 mb-3 ms-auto">
									<ul class="border-1 rounded-1">
										<li class="border-0 border-bottom">
											<h4 class="border-0">Order Tax</h4>
											<h5>$ 0.00</h5>
										</li>
										<li class="border-0 border-bottom">
											<h4 class="border-0">Discount</h4>
											<h5>$ 0.00</h5>
										</li>
										<li class="border-0 border-bottom">
											<h4 class="border-0">Shipping</h4>
											<h5>$ 0.00</h5>
										</li>
										<li class="total border-0">
											<h4 class="border-0">Grand Total</h4>
											<h5>$1800.00</h5>
										</li>
									</ul>
								</div>
							</div>
						</div>
                  
                  <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Order Tax<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Discount<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Shipping<span className="text-danger ms-1">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Status<span className="text-danger ms-1">*</span>
                        </label>
                        <select className="form-select">
                          <option>Select</option>
                          <option>Received</option>
                          <option>Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-3">
                  <div className="mb-3 summer-description-box">
                    <label className="form-label">Description</label>
                    <div id="summernote" />
                    <p className="mt-1">Maximum 60 Words</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

      {/* <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Add Purchase</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Supplier</label>
              <Select
                options={options}
                value={selectedUser}
                onChange={handleActiveUserChange}
                isSearchable
                placeholder="Search and select a user..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Search Product</label>
              <input
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type product name..."
              />
            </div>

            {products.length > 0 && (
              <div className="search-results border rounded p-3 mb-3">
                <h6 className="fw-semibold border-bottom pb-2 mb-3">
                  Search Results
                </h6>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="d-flex align-items-start justify-content-between py-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="d-flex align-items-start gap-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.productName}
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      )}
                      <div>
                        <h6 className="fw-bold mb-1">
                          {product.productName}
                        </h6>
                        <p className="text-muted small mb-0">
                          SKU: {product.sku} • Qty: {product.quantity} • ₹
                          {product.purchasePrice}/unit
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Purchase Price</th>
                    <th>Discount</th>
                    <th>Tax (%)</th>
                    <th>Tax Amt</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.length > 0 ? (
                    selectedProducts.map((product, index) => {
                      const qty = product.availableQty;
                      const price = product.purchasePrice || 0;
                      const discount = product.discount || 0;
                      const tax = product.tax || 0;
                      const subTotal = qty * price;
                      const afterDiscount = subTotal - discount;
                      const taxAmount = (afterDiscount * tax) / 100;
                      const totalCost = afterDiscount + taxAmount;
                      const unitCost = totalCost / qty;

                      return (
                        <tr key={index}>
                          <td>
                            {product.productName}
                            <br />
                            <small className="text-muted">
                              Available: {product.availableQty}
                            </small>
                          </td>
                          <td className="p-0">
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{
                                border: "1px solid #E6EAED",
                                backgroundColor: "#FAFBFE",
                                borderRadius: "8px",
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-sm btn-light px-2"
                                onClick={() => updateQuantity(index, -1)}
                                disabled={product.quantity <= 1}
                              >
                                −
                              </button>
                              <span>{qty}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-light px-2"
                                onClick={() => updateQuantity(index, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>₹{price}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: "80px" }}
                              value={discount}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedProducts((prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? {
                                        ...item,
                                        discount: isNaN(val) ? 0 : val,
                                      }
                                      : item
                                  )
                                );
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: "60px" }}
                              value={tax}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSelectedProducts((prev) =>
                                  prev.map((item, i) =>
                                    i === index
                                      ? { ...item, tax: isNaN(val) ? 0 : val }
                                      : item
                                  )
                                );
                              }}
                            />
                          </td>
                          <td>₹{taxAmount.toFixed(2)}</td>
                          <td>₹{unitCost.toFixed(2)}</td>
                          <td className="fw-semibold text-success">
                            ₹{totalCost.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No products selected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AddPurchaseModal;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import BASE_URL from "../../config/config";
// import Select from "react-select";
// import "../../../styles/purchase/purchase.css"

// const AddPurchaseModal = () => {
//   const [options, setOptions] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState([]);
//   // const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   console.log(products);

//   // Fetch active users
//   const fetchActiveUsers = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/user/status/active`);
//       const users = res.data.users;
//       const formattedOptions = users.map((user) => ({
//         value: user._id,
//         label: `${user.firstName} ${user.lastName} (${user.email})`,
//       }));

//       setOptions(formattedOptions);
//     } catch (err) {
//       console.error("Error fetching active users:", err);
//     }
//   };
//   useEffect(() => {
//     fetchActiveUsers();
//   }, []);

//   const handleActiveUserChange = (selectedOption) => {
//     setSelectedUser(selectedOption);
//     console.log("Selected category:", selectedOption);
//   };

//   // Debounced Search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim()) {
//         axios
//           .get(`${BASE_URL}/api/products/search?name=${searchTerm}`)
//           .then((res) => setProducts(res.data))
//           .catch((err) => console.error("Search error:", err));
//       } else {
//         setProducts([]);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   // const handleSelectProduct = (product) => {
//   //   setSelectedProduct(product); // show details
//   //   setProducts([]);             // hide search results
//   //   setSearchTerm("");           // optional: clear input
//   // };
//   const handleSelectProduct = (product) => {
//     const alreadyExists = selectedProducts.some(p => p._id === product._id);
//     if (!alreadyExists) {
//       setSelectedProducts([
//         ...selectedProducts,
//         { ...product, qty: 1, discount: 0, tax: 0 }
//       ]);
//     }
//     setProducts([]);
//     setSearchTerm("");
//   };


//   const updateQuantity = (index, delta) => {
//     setSelectedProducts((prev) =>
//       prev.map((item, i) =>
//         i === index
//           ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//           : item
//       )
//     );
//   };

//   return (
//     <div className="">
//       {/* Add Purchase */}
//       <div className="modal fade" id="add-purchase">
//         <div className="modal-dialog purchase modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header">
//               <div className="page-title">
//                 <h4>Add Purchase</h4>
//               </div>
//               <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true">×</span>
//               </button>
//             </div>
//             <form>
//               <div className="modal-body">
//                 <div className="row">
//                   <div className="col-lg-4 col-md-6 col-sm-12">
//                     <div className="mb-3 add-product">
//                       <label className="form-label">
//                         Supplier Name<span className="text-danger ms-1">*</span>
//                       </label>
//                       <div className="row">
//                         <div className="col-lg-10 col-sm-10 col-10">
//                           <Select options={options} value={selectedUser} onChange={handleActiveUserChange} isSearchable
//                             placeholder="Search and select a user..." />
//                         </div>
//                         <div className="col-lg-2 col-sm-2 col-2 ps-0">
//                           <div className="add-icon tab">
//                             <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_customer">
//                               <i data-feather="plus-circle" className="feather-plus-circles" />
//                             </a>
//                           </div>
//                         </div>

//                       </div>

//                     </div>
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Date<span className="text-danger ms-1">*</span>
//                       </label>
//                       <div className="input-groupicon calender-input">
//                         <i data-feather="calendar" className="info-img" />
//                         <input type="text" className="datetimepicker form-control p-2" placeholder="dd/mm/yyyy" />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-lg-4 col-sm-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Reference<span className="text-danger ms-1">*</span>
//                       </label>
//                       <input type="text" className="form-control" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-lg-12">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         Product<span className="text-danger ms-1">*</span>
//                       </label>
//                       <input type="text" className="form-control" placeholder="Search Product" value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)} />
//                     </div>
//                     {/* Search Result List */}
//                     {/* {products.length > 0 && (
//                    <div className="search-results border rounded p-2 mb-3">
//                      <strong>Search Results:</strong>
//                      {products.map((product) => (
//                      <div key={product._id} className="p-2 border-bottom cursor-pointer" onClick={()=>
//                        handleSelectProduct(product)}
//                        style={{ cursor: "pointer" }}
//                        >
//                        {product.productName} — {product.brand?.name || "No brand"}
//                      </div>
//                      ))}
//                    </div>
//                    )} */}

//                     {/* Search Result List */}
//                     {products.length > 0 && (
//                       <div className="search-results border rounded p-3 mb-3">
//                         <h6 className="fw-semibold border-bottom pb-2 mb-3">
//                           <i className="bi bi-list me-2" />
//                           All Products
//                           <span className="float-end text-muted small">
//                             {products.length} Result{products.length > 1 ? "s" : ""}
//                           </span>
//                         </h6>

//                         {products.map((product) => (
//                           <div key={product._id}
//                             className="d-flex align-items-start justify-content-between py-2 border-bottom" onClick={() =>
//                               handleSelectProduct(product)}
//                             style={{ cursor: "pointer" }}
//                           >
//                             <div className="d-flex align-items-start gap-3">
//                               {product.images?.[0] && (
//                                 <img src={product.images[0].url} alt={product.productName} className="media-image"
//                                   style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
//                               )}
//                               <div>
//                                 <h6 className="fw-bold mb-1">{product.productName}</h6>
//                                 <p className="text-muted small mb-0">
//                                   {product.productCode || "N/A"} • {product.category?.name || "No Category"} •{" "}
//                                   {product.subCategory || "No Sub"} • ₹{product.price}/kg • Available Qty -{" "}
//                                   {product.quantity || 0}kg
//                                 </p>
//                               </div>
//                             </div>

//                             <i className="bi bi-pencil text-primary" />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   <div className="col-lg-12">
//                     <div className="modal-body-table mt-3">
//                       <div className="table-responsive">
//                         <table className="table datatable rounded-1">
//                           <thead>
//                             <tr>
//                               <th className="bg-secondary-transparent p-3">
//                                 Product Name
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Qty
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Purchase Price
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Discount
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Tax(%)
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Tax Amount
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Unit Cost
//                               </th>
//                               <th className="bg-secondary-transparent p-3">
//                                 Total Cost
//                               </th>
//                             </tr>
//                           </thead>
//                           {/* <tbody>

//                          </tbody> */}
//                           <tbody>
//                             {selectedProducts.length > 0 ? (
//                               selectedProducts.map((product, index) => (
//                                 <tr key={index}>
//                                   <td className="p-0">
//                                     {/* {product.productName} */}
//                                     <div className="d-flex align-items-start gap-3">
//                                       {product.images?.[0] && (
//                                         <img src={product.images[0].url} alt={product.productName} className="media-image"
//                                           style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }} />
//                                       )}
//                                       <div>
//                                         <h6 className="fw-bold mb-0">{product.productName}</h6>
//                                         {/* <p className="text-muted small mb-0">
//                                      {product.productCode || "N/A"} • {product.category?.name || "No Category"} •{" "}
//                                      {product.subCategory || "No Sub"} • ₹{product.price}/kg • Available Qty -{" "}
//                                      {product.quantity || 0}kg
//                                    </p> */}
//                                       </div>
//                                     </div>

//                                   </td>
//                                   {/* <td className="p-0">{product.quantity}</td> */}
//                                   <td className="p-0">
//                                     <div className="d-flex align-items-center gap-2"
//                                       style={{ border: "1px solid #E6EAED", backgroundColor: "#FAFBFE", borderRadius: "8PX" }}>
//                                       <button type="button" className="btn btn-sm btn-light px-2" onClick={() =>
//                                         updateQuantity(index, -1)}
//                                         disabled={product.quantity <= 1}>
//                                         −
//                                       </button>
//                                       <span className="product-quantity">{product.quantity}</span>

//                                       <button type="button" className="btn btn-sm btn-light px-2" onClick={() =>
//                                         updateQuantity(index, 1)}
//                                       >
//                                         +
//                                       </button>
//                                     </div>
//                                   </td>

//                                   <td className="p-0">{product.purchasePrice}</td>
//                                   <td className="p-0">{product.discountValue}</td>
//                                   <td className="p-0">{product.tax}</td>
//                                   <td className="p-0">{product.discountValue}</td>
//                                   <td className="p-0">{product.discountValue}</td>
//                                   <td className="p-0">{product.discountValue}</td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="6" className="text-center text-muted">
//                                   No Products Selected.
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>

                  
//                   <div className="row">
//                     <div className="col-lg-3 col-md-6 col-sm-12">
//                       <div className="mb-3">
//                         <label className="form-label">
//                           Order Tax<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>
//                     </div>
//                     <div className="col-lg-3 col-md-6 col-sm-12">
//                       <div className="mb-3">
//                         <label className="form-label">
//                           Discount<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>
//                     </div>
//                     <div className="col-lg-3 col-md-6 col-sm-12">
//                       <div className="mb-3">
//                         <label className="form-label">
//                           Shipping<span className="text-danger ms-1">*</span>
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>
//                     </div>
//                     <div className="col-lg-3 col-md-6 col-sm-12">
//                       <div className="mb-3">
//                         <label className="form-label">
//                           Status<span className="text-danger ms-1">*</span>
//                         </label>
//                         <select className="form-select">
//                           <option>Select</option>
//                           <option>Received</option>
//                           <option>Pending</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-lg-12 mt-3">
//                   <div className="mb-3 summer-description-box">
//                     <label className="form-label">Description</label>
//                     <div id="summernote" />
//                     <p className="mt-1">Maximum 60 Words</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       {/* /Add Purchase */}
//     </div>
//   );
// };

// export default AddPurchaseModal;
