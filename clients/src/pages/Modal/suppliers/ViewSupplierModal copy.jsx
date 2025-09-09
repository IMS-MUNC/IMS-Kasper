import React from 'react';
import './viewsupplier.css'; // Assuming you have a CSS file for styles

const ViewSupplierModal = ({ supplierId, onClose }) => {


      const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierId) {
      axios.get(`${BASE_URL}/api/suppliers/${supplierId}`)
        .then(res => {
          setSupplier(res.data);
        })
        .catch(() => {
          setSupplier(null);
        })
        .finally(() => setLoading(false));
    }
  }, [supplierId]);

  if (!supplierId) return null;


  return (
       <div className="page-wrapper">
  {/* Start Content */}
  <div className="content content-two">
    {/* Page Header */}
    <div className="d-flex d-block align-items-center justify-content-between flex-wrap gap-3 mb-3">
      <div>
        <h6><a href="customers.html"><i className="isax isax-arrow-left fs-16 me-2" />Customers</a></h6>
      </div>
      <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
        <div className="dropdown">
          <a href="javascript:void(0);" className="dropdown-toggle btn btn-primary d-flex align-items-center fs-14 fw-semibold" data-bs-toggle="dropdown">
            Add New
          </a>
          <ul className="dropdown-menu  dropdown-menu-end">
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-text fs-14 me-2" />Invoice </a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-send fs-14 me-2" /> Expense</a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-add fs-14 me-2" /> Credit Notes</a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-recive fs-14 me-2" /> Debit Notes</a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document fs-14 me-2" /> Purchase Order</a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-download fs-14 me-2" /> Quotation</a>
            </li>
            <li>
              <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-forward fs-14 me-2" /> Delivery Challan</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    {/* End Page Header */}
    {/* start row */}
    <div className="row">
      <div className="col-xl-8">
        {/* Start User */}
        <div className="card bg-light customer-details-info position-relative overflow-hidden">
          <div className="card-body position-relative z-1">

                 
            {loading ? (
              <div>Loading...</div>
            ) : supplier ? (
            //   <div>
            //     <h5>{supplier.firstName} {supplier.lastName}</h5>
            //     <p><strong>Business Type:</strong> {supplier.businessType}</p>
            //     <p><strong>GSTIN:</strong> {supplier.gstin}</p>
            //     <p><strong>Email:</strong> {supplier.email}</p>
            //     <p><strong>Phone:</strong> {supplier.phone}</p>
            //     <p><strong>Address:</strong> {supplier.address}</p>
            //     <p><strong>Country:</strong> {supplier.country?.name || supplier.country}</p>
            //     <p><strong>State:</strong> {supplier.state?.stateName || supplier.state}</p>
            //     <p><strong>City:</strong> {supplier.city?.cityName || supplier.city}</p>
            //     <p><strong>Postal Code:</strong> {supplier.postalCode}</p>
            //     <p><strong>Status:</strong> {supplier.status ? 'Active' : 'Inactive'}</p>
            //     <h6>Bank Details</h6>
            //     <p><strong>Bank Name:</strong> {supplier.bank?.bankName}</p>
            //     <p><strong>Branch:</strong> {supplier.bank?.branch}</p>
            //     <p><strong>Account Holder:</strong> {supplier.bank?.accountHolder}</p>
            //     <p><strong>Account Number:</strong> {supplier.bank?.accountNumber}</p>
            //     <p><strong>IFSC:</strong> {supplier.bank?.ifsc}</p>
            //     <h6>Billing Address</h6>
            //     <p><strong>Name:</strong> {supplier.billing?.name}</p>
            //     <p><strong>Address1:</strong> {supplier.billing?.address1}</p>
            //     <p><strong>Address2:</strong> {supplier.billing?.address2}</p>
            //     <p><strong>Country:</strong> {supplier.billing?.country?.name || supplier.billing?.country}</p>
            //     <p><strong>State:</strong> {supplier.billing?.state?.stateName || supplier.billing?.state}</p>
            //     <p><strong>City:</strong> {supplier.billing?.city?.cityName || supplier.billing?.city}</p>
            //     <p><strong>Postal Code:</strong> {supplier.billing?.postalCode}</p>
            //     <h6>Shipping Address</h6>
            //     <p><strong>Name:</strong> {supplier.shipping?.name}</p>
            //     <p><strong>Address1:</strong> {supplier.shipping?.address1}</p>
            //     <p><strong>Address2:</strong> {supplier.shipping?.address2}</p>
            //     <p><strong>Country:</strong> {supplier.shipping?.country?.name || supplier.shipping?.country}</p>
            //     <p><strong>State:</strong> {supplier.shipping?.state?.stateName || supplier.shipping?.state}</p>
            //     <p><strong>City:</strong> {supplier.shipping?.city?.cityName || supplier.shipping?.city}</p>
            //     <p><strong>Pincode:</strong> {supplier.shipping?.pincode}</p>
            //     <h6>Images</h6>
            //     <div className="d-flex flex-wrap gap-2">
            //       {supplier.images?.map((img, idx) => (
            //         <img key={idx} src={img.url} alt="Supplier" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            //       ))}
            //     </div>
            //   </div>
             <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="avatar avatar-xxl rounded-circle flex-shrink-0">
                  <img src="assets/img/users/user-08.jpg" alt="user-01" className="img-fluid rounded-circle border border-white border-2" />
                </div>
                <div className>
                  <p className="text-primary fs-14 fw-medium mb-1">Cl-12345</p>
                  <h6 className="mb-2"> Robert George <img src="assets/img/icons/confirme.svg" alt="confirme" className="ms-1" /></h6>
                  <p className="fs-14 fw-regular"><i className="isax isax-location fs-14 me-1 text-gray-9" /> 4712 Cherry Ridge Drive Rochester, NY 14620.</p>
                </div>
              </div>
              <a href="#" className="btn btn-outline-white border border-1 border-grey border-sm bg-white"><i className="isax isax-edit-2 fs-13 fw-semibold text-dark me-1" /> Edit Profile </a>
            </div>
            ) : (
              <div>Supplier not found.</div>
            )}
         
           
            <div className="card border-0 shadow shadow-none mb-0 bg-white">
              <div className="card-body border-0 shadow shadow-none">
                <ul className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-0 m-0 list-unstyled">
                  <li>
                    <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-sms fs-14 me-2" />Email Address</h6>
                    <p> <a href="https://kanakku.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="ef85808781af8a978e829f838ac18c8082">[email&nbsp;protected]</a> </p>
                  </li>
                  <li>
                    <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-call fs-14 me-2" />Phone</h6>
                    <p> +158578 54840 </p>
                  </li>
                  <li>
                    <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-building fs-14 me-2" />Company </h6>
                    <p> TrueAI Technologies</p>
                  </li>
                  <li>
                    <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-global fs-14 me-2" />Website</h6>
                    <p className="d-flex align-items-center"> www.example.com <i className="isax isax-link fs-14 ms-1 text-primary" /></p>
                  </li>
                </ul>
              </div>
            </div>
          </div>{/* end card body */}
          <img src="assets/img/icons/elements-01.svg" alt="elements-01" className="img-fluid customer-details-bg" />
        </div>{/* end card */}
        {/* End User */}
        {/* Start Statistics */}
        <div className="card">
          <div className="card-body">
            <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Invoice Statistics </h6>
            <ul className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-0 m-0 list-unstyled">
              <li>
                <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-primary me-2" /> Total Invoice </p>
                <h6 className="fs-16 fw-600"> $56900.54</h6>
              </li>
              <li>
                <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-info me-2" /> Outstanding </p>
                <h6 className="fs-16 fw-600"> $56900.54</h6>
              </li>
              <li>
                <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-danger me-2" /> Overdue </p>
                <h6 className="fs-16 fw-600"> $56900.54</h6>
              </li>
              <li>
                <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-purple me-2" /> Draft </p>
                <h6 className="fs-16 fw-600"> $56900.54</h6>
              </li>
              <li>
                <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-error me-2" /> Cancelled </p>
                <h6 className="fs-16 fw-600"> $56900.54</h6>
              </li>
            </ul>
          </div>
        </div>
        {/* End Statistics */}
        {/* Start Tablelist */}
        <div className="card table-info">
          <div className="card-body">
            <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Invoice </h6>
            <div className="table-responsive table-nowrap">
              <table className="table border  m-0">
                <thead className="table-light">
                  <tr>
                    <th className="no-sort">ID</th>
                    <th>Created On</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th className="no-sort">Status</th>
                    <th>Due Date</th>
                    <th className="no-sort" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00025</a>
                    </td>
                    <td>22 Feb 2025</td>
                    <td className="text-dark">$10,000</td>
                    <td className>$5,000</td>
                    <td>
                      <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00024</a>
                    </td>
                    <td>07 Feb 2025</td>
                    <td className="text-dark">$25,750</td>
                    <td className>$10,750</td>
                    <td>
                      <span className="badge badge-soft-warning badge-sm d-inline-flex align-items-center">Unpaid<i className="isax isax-slash ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00023</a>
                    </td>
                    <td>30 Jan 2025</td>
                    <td className="text-dark">$50,125</td>
                    <td className>$20,000</td>
                    <td>
                      <span className="badge badge-soft-danger badge-sm d-inline-flex align-items-center">Cancelled<i className="isax isax-close-circle ms-1" /></span>
                    </td>
                    <td>13 Feb 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00022</a>
                    </td>
                    <td>17 Jan 2025</td>
                    <td className="text-dark">$75,900</td>
                    <td className>$50,000</td>
                    <td>
                      <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
                    </td>
                    <td>30 Jan 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00019</a>
                    </td>
                    <td>02 Dec 2024</td>
                    <td className="text-dark">$2,50,000</td>
                    <td className>$1,25,000</td>
                    <td>
                      <span className="badge badge-soft-warning badge-sm d-inline-flex align-items-center">Unpaid<i className="isax isax-slash ms-1" /></span>
                    </td>
                    <td>15 Dec 2024</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00017</a>
                    </td>
                    <td>30 Nov 2024</td>
                    <td className="text-dark">$7,50,300</td>
                    <td className>$2,50,500</td>
                    <td>
                      <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
                    </td>
                    <td>12 Nov 2024</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00016</a>
                    </td>
                    <td>12 Oct 2024</td>
                    <td className="text-dark">$9,99,999</td>
                    <td className>$4,00,000</td>
                    <td>
                      <span className="badge badge-soft-danger badge-sm d-inline-flex align-items-center">Uncollectable<i className="isax isax-danger ms-1" /></span>
                    </td>
                    <td>25 Oct 2024</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00014</a>
                    </td>
                    <td>09 Sep 2024</td>
                    <td className="text-dark">$10,000</td>
                    <td className>$5,000</td>
                    <td>
                      <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00013</a>
                    </td>
                    <td>13 Sep 2025</td>
                    <td className="text-dark">$10,000</td>
                    <td className>$5,000</td>
                    <td>
                      <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00012</a>
                    </td>
                    <td>12 Sep 2025</td>
                    <td className="text-dark">$10,000</td>
                    <td className>$5,000</td>
                    <td>
                      <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="invoice-details.html" className="link-default">INV00011</a>
                    </td>
                    <td>10 Aug 2025</td>
                    <td className="text-dark">$10,000</td>
                    <td className>$5,000</td>
                    <td>
                      <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
                    </td>
                    <td>04 Mar 2025</td>
                    <td className="action-item">
                      <a href="javascript:void(0);" data-bs-toggle="dropdown">
                        <i className="fa-solid fa-ellipsis" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
                        </li>
                        <li>
                          <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* End Tablelist */}
      </div>{/* end col */}
      <div className="col-xl-4">
        {/* Start Notes */}
        <div className="card">
          <div className="card-body">
            <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Notes </h6>
            <p className="text-truncate line-clamb-3"> Keep in mind that in order to be deductible, your employees’ pay must be reasonable and necessary for conducting business to qualify for </p>
          </div>{/* end card body */}
        </div>{/* end card */}
        {/* End Notes */}
        {/* Start Payment */}
        <div className="card">
          <div className="card-body">
            <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Payments History </h6>
            {/* Pay1 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
                  <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
                </a>
                <div>
                  <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
                  <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
                </div>
              </div>
              <div>
                <p className="mb-0 fs-13"> Amount </p>
                <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
              </div>
              <div className="text-end">
                <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
              </div>
            </div>
            {/* Pay2 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
                  <img src="assets/img/icons/transaction-02.svg" className="rounded-circle" alt="img" />
                </a>
                <div>
                  <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
                  <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
                </div>
              </div>
              <div>
                <p className="mb-0 fs-13"> Amount </p>
                <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
              </div>
              <div className="text-end">
                <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
              </div>
            </div>
            {/* Pay3 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
                  <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
                </a>
                <div>
                  <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
                  <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
                </div>
              </div>
              <div>
                <p className="mb-0 fs-13"> Amount </p>
                <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
              </div>
              <div className="text-end">
                <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
              </div>
            </div>
            {/* Pay4 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
                  <img src="assets/img/icons/transaction-02.svg" className="rounded-circle" alt="img" />
                </a>
                <div>
                  <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
                  <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
                </div>
              </div>
              <div>
                <p className="mb-0 fs-13"> Amount </p>
                <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
              </div>
              <div className="text-end">
                <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
              </div>
            </div>
            {/* Pay5 */}
            <div className="d-flex align-items-center justify-content-between mb-0">
              <div className="d-flex align-items-center">
                <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
                  <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
                </a>
                <div>
                  <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
                  <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
                </div>
              </div>
              <div>
                <p className="mb-0 fs-13"> Amount </p>
                <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
              </div>
              <div className="text-end">
                <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
              </div>
            </div>
          </div>{/* end card body */}
        </div>{/* end card */}
        {/* End Payment */}
        {/* Start Recent Activities */}
        <div className="card flex-fill overflow-hidden">
          <div className="card-body pb-0">
            <div className="mb-0">
              <h6 className="mb-1 pb-3 mb-3 border-bottom">Recent Activities</h6>
              <div className="recent-activities recent-activities-two">
                <div className="d-flex align-items-center pb-3">
                  <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
                  <div className="recent-activities-flow">
                    <p className="mb-1">Status Changed to <span className="text-gray-9 fw-semibold">Partially Paid</span></p>
                    <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />19 Jan 2025</p>
                  </div>
                </div>
                <div className="d-flex align-items-center pb-3">
                  <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
                  <div className="recent-activities-flow">
                    <p className="mb-1"><span className="text-gray-9 fw-semibold">$300</span> Partial Amount Paid on <span className="text-gray-9 fw-semibold">Paypal</span></p>
                    <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />18 Jan 2025</p>
                  </div>
                </div>
                <div className="d-flex align-items-center pb-3">
                  <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
                  <div className="recent-activities-flow">
                    <p className="mb-1">New Expenses added <span className="text-gray-9 fw-semibold">#TR018756</span></p>
                    <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />18 Jan 2025</p>
                  </div>
                </div>
                <div className="d-flex align-items-center pb-3">
                  <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
                  <div className="recent-activities-flow">
                    <p className="mb-1">Estimate Created <span className="text-gray-9 fw-semibold">#ES458789</span></p>
                    <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />17 Jan 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>{/* end card body */}
          <a href="javascript:void(0);" className="btn w-100 fs-14 py-2 shadow-lg fw-medium">View All</a>
        </div>{/* end card */}
        {/* End Recent Activities */}
      </div>
    </div>
    {/* end row */}
   
  </div>
  {/* End Content */}
</div>
  )
}

export default ViewSupplierModal


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../config/config';

// const ViewSupplierModal = ({ supplierId, onClose }) => {
//   const [supplier, setSupplier] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (supplierId) {
//       axios.get(`${BASE_URL}/api/suppliers/${supplierId}`)
//         .then(res => {
//           setSupplier(res.data);
//         })
//         .catch(() => {
//           setSupplier(null);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [supplierId]);

//   if (!supplierId) return null;

//   return (
//             <div className="page-wrapper">
//   {/* Start Content */}
//   <div className="content content-two">
//     {/* Page Header */}
//     <div className="d-flex d-block align-items-center justify-content-between flex-wrap gap-3 mb-3">
//       <div>
//         <h6><a href="customers.html"><i className="isax isax-arrow-left fs-16 me-2" />Customers</a></h6>
//       </div>
//       <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
//         <div className="dropdown">
//           <a href="javascript:void(0);" className="dropdown-toggle btn btn-primary d-flex align-items-center fs-14 fw-semibold" data-bs-toggle="dropdown">
//             Add New
//           </a>
//           <ul className="dropdown-menu  dropdown-menu-end">
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-text fs-14 me-2" />Invoice </a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-send fs-14 me-2" /> Expense</a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-add fs-14 me-2" /> Credit Notes</a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-money-recive fs-14 me-2" /> Debit Notes</a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document fs-14 me-2" /> Purchase Order</a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-download fs-14 me-2" /> Quotation</a>
//             </li>
//             <li>
//               <a href="javascript:void(0);" className="dropdown-item"> <i className="isax isax-document-forward fs-14 me-2" /> Delivery Challan</a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//     {/* End Page Header */}
//     {/* start row */}
//     <div className="row">
//       <div className="col-xl-8">
//         {/* Start User */}
//         <div className="card bg-light customer-details-info position-relative overflow-hidden">
//           <div className="card-body position-relative z-1">
//             <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
//               <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
//                 <div className="avatar avatar-xxl rounded-circle flex-shrink-0">
//                   <img src="assets/img/users/user-08.jpg" alt="user-01" className="img-fluid rounded-circle border border-white border-2" />
//                 </div>
//                 <div className>
//                   <p className="text-primary fs-14 fw-medium mb-1">Cl-12345</p>
//                   <h6 className="mb-2"> Robert George <img src="assets/img/icons/confirme.svg" alt="confirme" className="ms-1" /></h6>
//                   <p className="fs-14 fw-regular"><i className="isax isax-location fs-14 me-1 text-gray-9" /> 4712 Cherry Ridge Drive Rochester, NY 14620.</p>
//                 </div>
//               </div>
//               <a href="#" className="btn btn-outline-white border border-1 border-grey border-sm bg-white"><i className="isax isax-edit-2 fs-13 fw-semibold text-dark me-1" /> Edit Profile </a>
//             </div>
//             <div className="card border-0 shadow shadow-none mb-0 bg-white">
//               <div className="card-body border-0 shadow shadow-none">
//                 <ul className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-0 m-0 list-unstyled">
//                   <li>
//                     <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-sms fs-14 me-2" />Email Address</h6>
//                     <p> <a href="https://kanakku.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="ef85808781af8a978e829f838ac18c8082">[email&nbsp;protected]</a> </p>
//                   </li>
//                   <li>
//                     <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-call fs-14 me-2" />Phone</h6>
//                     <p> +158578 54840 </p>
//                   </li>
//                   <li>
//                     <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-building fs-14 me-2" />Company </h6>
//                     <p> TrueAI Technologies</p>
//                   </li>
//                   <li>
//                     <h6 className="mb-1 fs-14 fw-semibold"> <i className="isax isax-global fs-14 me-2" />Website</h6>
//                     <p className="d-flex align-items-center"> www.example.com <i className="isax isax-link fs-14 ms-1 text-primary" /></p>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>{/* end card body */}
//           <img src="assets/img/icons/elements-01.svg" alt="elements-01" className="img-fluid customer-details-bg" />
//         </div>{/* end card */}
//         {/* End User */}
//         {/* Start Statistics */}
//         <div className="card">
//           <div className="card-body">
//             <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Invoice Statistics </h6>
//             <ul className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-0 m-0 list-unstyled">
//               <li>
//                 <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-primary me-2" /> Total Invoice </p>
//                 <h6 className="fs-16 fw-600"> $56900.54</h6>
//               </li>
//               <li>
//                 <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-info me-2" /> Outstanding </p>
//                 <h6 className="fs-16 fw-600"> $56900.54</h6>
//               </li>
//               <li>
//                 <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-danger me-2" /> Overdue </p>
//                 <h6 className="fs-16 fw-600"> $56900.54</h6>
//               </li>
//               <li>
//                 <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-purple me-2" /> Draft </p>
//                 <h6 className="fs-16 fw-600"> $56900.54</h6>
//               </li>
//               <li>
//                 <p className="mb-2"> <i className="fa-solid fa-circle fs-10 text-error me-2" /> Cancelled </p>
//                 <h6 className="fs-16 fw-600"> $56900.54</h6>
//               </li>
//             </ul>
//           </div>
//         </div>
//         {/* End Statistics */}
//         {/* Start Tablelist */}
//         <div className="card table-info">
//           <div className="card-body">
//             <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Invoice </h6>
//             <div className="table-responsive table-nowrap">
//               <table className="table border  m-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th className="no-sort">ID</th>
//                     <th>Created On</th>
//                     <th>Amount</th>
//                     <th>Paid</th>
//                     <th className="no-sort">Status</th>
//                     <th>Due Date</th>
//                     <th className="no-sort" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00025</a>
//                     </td>
//                     <td>22 Feb 2025</td>
//                     <td className="text-dark">$10,000</td>
//                     <td className>$5,000</td>
//                     <td>
//                       <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00024</a>
//                     </td>
//                     <td>07 Feb 2025</td>
//                     <td className="text-dark">$25,750</td>
//                     <td className>$10,750</td>
//                     <td>
//                       <span className="badge badge-soft-warning badge-sm d-inline-flex align-items-center">Unpaid<i className="isax isax-slash ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00023</a>
//                     </td>
//                     <td>30 Jan 2025</td>
//                     <td className="text-dark">$50,125</td>
//                     <td className>$20,000</td>
//                     <td>
//                       <span className="badge badge-soft-danger badge-sm d-inline-flex align-items-center">Cancelled<i className="isax isax-close-circle ms-1" /></span>
//                     </td>
//                     <td>13 Feb 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00022</a>
//                     </td>
//                     <td>17 Jan 2025</td>
//                     <td className="text-dark">$75,900</td>
//                     <td className>$50,000</td>
//                     <td>
//                       <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
//                     </td>
//                     <td>30 Jan 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00019</a>
//                     </td>
//                     <td>02 Dec 2024</td>
//                     <td className="text-dark">$2,50,000</td>
//                     <td className>$1,25,000</td>
//                     <td>
//                       <span className="badge badge-soft-warning badge-sm d-inline-flex align-items-center">Unpaid<i className="isax isax-slash ms-1" /></span>
//                     </td>
//                     <td>15 Dec 2024</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00017</a>
//                     </td>
//                     <td>30 Nov 2024</td>
//                     <td className="text-dark">$7,50,300</td>
//                     <td className>$2,50,500</td>
//                     <td>
//                       <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
//                     </td>
//                     <td>12 Nov 2024</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00016</a>
//                     </td>
//                     <td>12 Oct 2024</td>
//                     <td className="text-dark">$9,99,999</td>
//                     <td className>$4,00,000</td>
//                     <td>
//                       <span className="badge badge-soft-danger badge-sm d-inline-flex align-items-center">Uncollectable<i className="isax isax-danger ms-1" /></span>
//                     </td>
//                     <td>25 Oct 2024</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00014</a>
//                     </td>
//                     <td>09 Sep 2024</td>
//                     <td className="text-dark">$10,000</td>
//                     <td className>$5,000</td>
//                     <td>
//                       <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00013</a>
//                     </td>
//                     <td>13 Sep 2025</td>
//                     <td className="text-dark">$10,000</td>
//                     <td className>$5,000</td>
//                     <td>
//                       <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00012</a>
//                     </td>
//                     <td>12 Sep 2025</td>
//                     <td className="text-dark">$10,000</td>
//                     <td className>$5,000</td>
//                     <td>
//                       <span className="badge badge-soft-success badge-sm d-inline-flex align-items-center">Paid<i className="isax isax-tick-circle ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>
//                       <a href="invoice-details.html" className="link-default">INV00011</a>
//                     </td>
//                     <td>10 Aug 2025</td>
//                     <td className="text-dark">$10,000</td>
//                     <td className>$5,000</td>
//                     <td>
//                       <span className="badge badge-soft-primary badge-sm d-inline-flex align-items-center">Partially Paid<i className="isax isax-timer ms-1" /></span>
//                     </td>
//                     <td>04 Mar 2025</td>
//                     <td className="action-item">
//                       <a href="javascript:void(0);" data-bs-toggle="dropdown">
//                         <i className="fa-solid fa-ellipsis" />
//                       </a>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <a href="invoice-details.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-eye me-2" />View</a>
//                         </li>
//                         <li>
//                           <a href="edit-invoice.html" className="dropdown-item d-flex align-items-center"><i className="isax isax-edit me-2" />Edit</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center"><i className="isax isax-archive-2 me-2" />Archive</a>
//                         </li>
//                         <li>
//                           <a href="javascript:void(0);" className="dropdown-item d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#delete_modal"><i className="isax isax-trash me-2" />Delete</a>
//                         </li>
//                       </ul>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {/* End Tablelist */}
//       </div>{/* end col */}
//       <div className="col-xl-4">
//         {/* Start Notes */}
//         <div className="card">
//           <div className="card-body">
//             <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Notes </h6>
//             <p className="text-truncate line-clamb-3"> Keep in mind that in order to be deductible, your employees’ pay must be reasonable and necessary for conducting business to qualify for </p>
//           </div>{/* end card body */}
//         </div>{/* end card */}
//         {/* End Notes */}
//         {/* Start Payment */}
//         <div className="card">
//           <div className="card-body">
//             <h6 className="pb-3 mb-3 border-1 border-bottom border-gray"> Payments History </h6>
//             {/* Pay1 */}
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <div className="d-flex align-items-center">
//                 <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
//                   <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
//                 </a>
//                 <div>
//                   <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
//                   <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
//                 </div>
//               </div>
//               <div>
//                 <p className="mb-0 fs-13"> Amount </p>
//                 <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
//               </div>
//               <div className="text-end">
//                 <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
//               </div>
//             </div>
//             {/* Pay2 */}
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <div className="d-flex align-items-center">
//                 <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
//                   <img src="assets/img/icons/transaction-02.svg" className="rounded-circle" alt="img" />
//                 </a>
//                 <div>
//                   <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
//                   <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
//                 </div>
//               </div>
//               <div>
//                 <p className="mb-0 fs-13"> Amount </p>
//                 <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
//               </div>
//               <div className="text-end">
//                 <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
//               </div>
//             </div>
//             {/* Pay3 */}
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <div className="d-flex align-items-center">
//                 <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
//                   <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
//                 </a>
//                 <div>
//                   <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
//                   <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
//                 </div>
//               </div>
//               <div>
//                 <p className="mb-0 fs-13"> Amount </p>
//                 <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
//               </div>
//               <div className="text-end">
//                 <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
//               </div>
//             </div>
//             {/* Pay4 */}
//             <div className="d-flex align-items-center justify-content-between mb-3">
//               <div className="d-flex align-items-center">
//                 <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
//                   <img src="assets/img/icons/transaction-02.svg" className="rounded-circle" alt="img" />
//                 </a>
//                 <div>
//                   <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
//                   <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
//                 </div>
//               </div>
//               <div>
//                 <p className="mb-0 fs-13"> Amount </p>
//                 <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
//               </div>
//               <div className="text-end">
//                 <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
//               </div>
//             </div>
//             {/* Pay5 */}
//             <div className="d-flex align-items-center justify-content-between mb-0">
//               <div className="d-flex align-items-center">
//                 <a href="javascript:void(0);" className="avatar avatar-md flex-shrink-0 me-2">
//                   <img src="assets/img/icons/transaction-01.svg" className="rounded-circle" alt="img" />
//                 </a>
//                 <div>
//                   <h6 className="fs-14 fw-semibold mb-1"><a href="javascript:void(0);">Andrew James</a></h6>
//                   <p className="fs-13"><a href="invoice-details.html" className="link-default">#INV45478</a></p>
//                 </div>
//               </div>
//               <div>
//                 <p className="mb-0 fs-13"> Amount </p>
//                 <p className="mb-0 fs-14 fw-semibold text-gray-9"> $417 </p>
//               </div>
//               <div className="text-end">
//                 <span className="badge badge-sm badge-soft-success"> Paid <i className="isax isax-tick-circle fs-10 fw-semibold ms-1" /></span>
//               </div>
//             </div>
//           </div>{/* end card body */}
//         </div>{/* end card */}
//         {/* End Payment */}
//         {/* Start Recent Activities */}
//         <div className="card flex-fill overflow-hidden">
//           <div className="card-body pb-0">
//             <div className="mb-0">
//               <h6 className="mb-1 pb-3 mb-3 border-bottom">Recent Activities</h6>
//               <div className="recent-activities recent-activities-two">
//                 <div className="d-flex align-items-center pb-3">
//                   <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
//                   <div className="recent-activities-flow">
//                     <p className="mb-1">Status Changed to <span className="text-gray-9 fw-semibold">Partially Paid</span></p>
//                     <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />19 Jan 2025</p>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center pb-3">
//                   <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
//                   <div className="recent-activities-flow">
//                     <p className="mb-1"><span className="text-gray-9 fw-semibold">$300</span> Partial Amount Paid on <span className="text-gray-9 fw-semibold">Paypal</span></p>
//                     <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />18 Jan 2025</p>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center pb-3">
//                   <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
//                   <div className="recent-activities-flow">
//                     <p className="mb-1">New Expenses added <span className="text-gray-9 fw-semibold">#TR018756</span></p>
//                     <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />18 Jan 2025</p>
//                   </div>
//                 </div>
//                 <div className="d-flex align-items-center pb-3">
//                   <span className="border z-1 border-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-white p-1"><i className="fa fa-circle fs-8 text-primary" /></span>
//                   <div className="recent-activities-flow">
//                     <p className="mb-1">Estimate Created <span className="text-gray-9 fw-semibold">#ES458789</span></p>
//                     <p className="mb-0 d-inline-flex align-items-center fs-13"><i className="isax isax-calendar-25 me-1" />17 Jan 2025</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>{/* end card body */}
//           <a href="javascript:void(0);" className="btn w-100 fs-14 py-2 shadow-lg fw-medium">View All</a>
//         </div>{/* end card */}
//         {/* End Recent Activities */}
//       </div>
//     </div>
//     {/* end row */}
   
//   </div>
//   {/* End Content */}
// </div>
//     // <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true" role="dialog">
//     //   <div className="modal-dialog modal-dialog-centered modal-lg">
//     //     <div className="modal-content">
//     //       <div className="modal-header">
//     //         <h4>Supplier Details</h4>
//     //         <button type="button" className="close" aria-label="Close" onClick={onClose}>
//     //           <span aria-hidden="true">&times;</span>
//     //         </button>
//     //       </div>
    //       <div className="modal-body">
    //         {loading ? (
    //           <div>Loading...</div>
    //         ) : supplier ? (
    //           <div>
    //             <h5>{supplier.firstName} {supplier.lastName}</h5>
    //             <p><strong>Business Type:</strong> {supplier.businessType}</p>
    //             <p><strong>GSTIN:</strong> {supplier.gstin}</p>
    //             <p><strong>Email:</strong> {supplier.email}</p>
    //             <p><strong>Phone:</strong> {supplier.phone}</p>
    //             <p><strong>Address:</strong> {supplier.address}</p>
    //             <p><strong>Country:</strong> {supplier.country?.name || supplier.country}</p>
    //             <p><strong>State:</strong> {supplier.state?.stateName || supplier.state}</p>
    //             <p><strong>City:</strong> {supplier.city?.cityName || supplier.city}</p>
    //             <p><strong>Postal Code:</strong> {supplier.postalCode}</p>
    //             <p><strong>Status:</strong> {supplier.status ? 'Active' : 'Inactive'}</p>
    //             <h6>Bank Details</h6>
    //             <p><strong>Bank Name:</strong> {supplier.bank?.bankName}</p>
    //             <p><strong>Branch:</strong> {supplier.bank?.branch}</p>
    //             <p><strong>Account Holder:</strong> {supplier.bank?.accountHolder}</p>
    //             <p><strong>Account Number:</strong> {supplier.bank?.accountNumber}</p>
    //             <p><strong>IFSC:</strong> {supplier.bank?.ifsc}</p>
    //             <h6>Billing Address</h6>
    //             <p><strong>Name:</strong> {supplier.billing?.name}</p>
    //             <p><strong>Address1:</strong> {supplier.billing?.address1}</p>
    //             <p><strong>Address2:</strong> {supplier.billing?.address2}</p>
    //             <p><strong>Country:</strong> {supplier.billing?.country?.name || supplier.billing?.country}</p>
    //             <p><strong>State:</strong> {supplier.billing?.state?.stateName || supplier.billing?.state}</p>
    //             <p><strong>City:</strong> {supplier.billing?.city?.cityName || supplier.billing?.city}</p>
    //             <p><strong>Postal Code:</strong> {supplier.billing?.postalCode}</p>
    //             <h6>Shipping Address</h6>
    //             <p><strong>Name:</strong> {supplier.shipping?.name}</p>
    //             <p><strong>Address1:</strong> {supplier.shipping?.address1}</p>
    //             <p><strong>Address2:</strong> {supplier.shipping?.address2}</p>
    //             <p><strong>Country:</strong> {supplier.shipping?.country?.name || supplier.shipping?.country}</p>
    //             <p><strong>State:</strong> {supplier.shipping?.state?.stateName || supplier.shipping?.state}</p>
    //             <p><strong>City:</strong> {supplier.shipping?.city?.cityName || supplier.shipping?.city}</p>
    //             <p><strong>Pincode:</strong> {supplier.shipping?.pincode}</p>
    //             <h6>Images</h6>
    //             <div className="d-flex flex-wrap gap-2">
    //               {supplier.images?.map((img, idx) => (
    //                 <img key={idx} src={img.url} alt="Supplier" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
    //               ))}
    //             </div>
    //           </div>
    //         ) : (
    //           <div>Supplier not found.</div>
    //         )}
    //       </div>
//     //       <div className="modal-footer">
//     //         <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//   );
// };

// export default ViewSupplierModal;