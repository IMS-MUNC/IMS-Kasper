import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from "jsbarcode";
import { IoIosSearch } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa6";
import axios from 'axios';
import BASE_URL from '../../../../pages/config/config';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IoPrint } from "react-icons/io5";
import { TbEye, TbRefresh, TbTrash } from 'react-icons/tb';

function Barcode() {
  const [product, setProduct] = useState({
    productName: "",
    sku: "",
    price: "",
    expiryDate: "",
    quantity: "",
    barcode: "",
    uniqueBarcodes: [],
    showProductName: false,
    showSku: false,
    showPrice: false,
    showExpiryDate: false,
    showQuantity: false,
  });

  const [numberOfBarcodes, setNumberOfBarcodes] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formRef = useRef(null);
  const searchRef = useRef(null);
  const printRef = useRef(null);

  // Fetch products based on search query
  const searchProducts = async (query) => {
    if (!query || query.length < 1) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/products/search?name=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); setProducts(response.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
      setProducts([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setProducts([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle product selection
  const handleProductSelect = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setProduct(prev => ({
      ...prev,
      productName: selectedProduct.productName || '',
      sku: selectedProduct.sku || '',
      price: selectedProduct.sellingPrice || '',
      quantity: selectedProduct.quantity || '',
      img: selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0].url : '',
      expiryDate: selectedProduct.variants && selectedProduct.variants.Expiry && selectedProduct.variants.Expiry[0] ? selectedProduct.variants.Expiry[0] : '',
      barcode: selectedProduct.itemBarcode || '',
      barcodeImg: '',
    }));
    setSearchQuery(selectedProduct.productName);
    setShowDropdown(false);
    setProducts([]);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear search and selected product
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedProduct(null);
    setProduct({
      productName: "",
      sku: "",
      price: "",
      expiryDate: "",
      quantity: "",
      barcode: "",
      barcodeImg: "",
      uniqueBarcodes: [],
      showProductName: false,
      showSku: false,
      showPrice: false,
      showExpiryDate: false,
      showQuantity: false,
    });
    setProducts([]);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'numberOfBarcodes') {
      setNumberOfBarcodes(parseInt(value));
    } else if (name === 'searchQuery') {
      setSearchQuery(value);
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const generateBarcode = () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    // Helper function to safely get expiry date
    const getExpiryDate = (selectedProduct) => {
      return selectedProduct.variants && selectedProduct.variants.Expiry && selectedProduct.variants.Expiry[0]
        ? selectedProduct.variants.Expiry[0]
        : 'N/A';
    };

    const barcodeNaming = (product, selectedProduct) => {
      if (product.showProductName && product.showQuantity && product.showSku && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Price:${price},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showSku && product.showPrice) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Name:${name},SKU:${sku},Price:${price},QTY:${quantity}`;
      } else if (product.showProductName && product.showQuantity && product.showSku && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU${sku},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},Price:${price},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Price:${price},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku && product.showPrice) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        return `Name:${name},SKU:${sku},Price:${price}`;
      } else if (product.showProductName && product.showSku && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showPrice) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Name:${name},Price:${price},QTY:${quantity}`;
      } else if (product.showProductName && product.showQuantity && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        return `Name:${name},SKU:${sku}`;
      } else if (product.showProductName && product.showPrice) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        return `Name:${name},Price:${price}`;
      } else if (product.showProductName && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity) {
        var name = selectedProduct.productName;
        var quantity = selectedProduct.quantity;
        return `Name:${name},QTY:${quantity}`;
      } else if (product.showSku && product.showPrice && product.showExpiryDate) {
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `SKU:${sku},Price:${price},Exp:${expiry}`;
      } else if (product.showSku && product.showPrice) {
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        return `SKU:${sku},Price:${price}`;
      } else if (product.showSku && product.showExpiryDate) {
        var sku = selectedProduct.sku;
        var expiry = getExpiryDate(selectedProduct);
        return `SKU:${sku},Exp:${expiry}`;
      } else if (product.showSku && product.showQuantity) {
        var sku = selectedProduct.sku;
        var quantity = selectedProduct.quantity;
        return `SKU:${sku},QTY:${quantity}`;
      } else if (product.showPrice && product.showExpiryDate) {
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `Price:${price},Exp:${expiry}`;
      } else if (product.showPrice && product.showQuantity) {
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Price:${price},QTY:${quantity}`;
      } else if (product.showExpiryDate && product.showQuantity) {
        var expiry = getExpiryDate(selectedProduct);
        var quantity = selectedProduct.quantity;
        return `Exp:${expiry},QTY:${quantity}`;
      } else if (product.showProductName) {
        return "Name:" + selectedProduct.productName;
      } else if (product.showSku) {
        return "SKU:" + selectedProduct.sku;
      } else if (product.showPrice) {
        return "Price:" + selectedProduct.sellingPrice;
      } else if (product.showExpiryDate) {
        return "Exp:" + getExpiryDate(selectedProduct);
      } else if (product.showQuantity) {
        return "QTY:" + selectedProduct.quantity;
      } else {
        return "Name:" + selectedProduct.productName || "SKU:" + selectedProduct.sku || "Price:" + selectedProduct.sellingPrice || "Exp:" + getExpiryDate(selectedProduct) || "QTY:" + selectedProduct.quantity || '';
      }
    }

    // const barcodeValue =  barcodeNaming(product, selectedProduct);
    // Generate unique barcodes for each barcode to be printed
    const barcodeCount = numberOfBarcodes || 1;
    const uniqueBarcodes = [];

    for (let i = 0; i < barcodeCount; i++) {
      uniqueBarcodes.push(Math.floor(100000000000 + Math.random() * 900000000000).toString());
    }

    // Use the first barcode for the product state (for display purposes)
    const primaryBarcode = uniqueBarcodes[0];

    setProduct((prev) => ({
      ...prev,
      barcode: primaryBarcode,
      barcodeImg: primaryBarcode,
      uniqueBarcodes: uniqueBarcodes, // Store all unique barcodes
    }));

    setTimeout(() => {
      for (let i = 0; i < barcodeCount; i++) {
        const barcodeId = `barcode-svg-${i}`;
        const barcodeElement = document.getElementById(barcodeId);
        if (barcodeElement) {
          JsBarcode(barcodeElement, uniqueBarcodes[i], {
            format: "CODE128",
            lineColor: "#000",
            width: 1,
            height: 60,
            displayValue: true,
          });
        }
      }
    }, 100);
  };

  const handlePrint = () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 10mm;
                font-family: Arial, sans-serif;
              }
              .barcode-row {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 10mm;
                page-break-inside: avoid;
                gap: 10px;
              }
              .barcode-col {
                flex: 0 0 calc(52% - 5mm);
                max-width: calc(52% - 5mm);
                box-sizing: border-box;
                padding: 5mm;
              }
              .barcode-item {
                border: 2px solid #E6E6E6;
                border-radius: 8px;
                padding: 16px 24px;
                width: 320px;
                height: 280px;
                box-sizing: border-box;
                page-break-inside: avoid;
                text-align: left;
                font-size: 14px;
              }
              .barcode-item svg {
                width: 100%;
                height: 60px;
                margin-top: 10px;
              }
              .barcode-item span {
                display: block;
                margin-bottom: 5px;
              }
              @page {
                size: A4;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
            ${Array.from({ length: Math.ceil((numberOfBarcodes || 1) / 2) })
        .map((_, rowIndex) => {
          const startIndex = rowIndex * 2;
          return `
                  <div class="barcode-row">
                    ${Array.from({ length: Math.min(2, (numberOfBarcodes || 1) - startIndex) })
              .map((_, colIndex) => {
                const index = startIndex + colIndex;
                const barcodeId = `barcode-print-${index}`;
                return `
                          <div class="barcode-col">
                            <div class="barcode-item">
                              ${product.showProductName && product.productName ? `<span style="font-weight: 600; color: black;">${product.productName}</span>` : ''}
                              ${product.showSku && product.sku ? `<span style="color: black;">SKU: ${product.sku}</span>` : ''}
                              ${product.showPrice && product.price ? `<span style="font-weight: 500; color: black;">MRP: ₹${product.price}</span>` : ''}
                              <div style="display: flex; justify-content: space-between;">
                                ${product.showExpiryDate && product.expiryDate ? `<span style="color: black;">Expiry: ${new Date(product.expiryDate).toLocaleDateString()}</span>` : ''}
                                ${product.showQuantity && product.quantity ? `<span style="color: black;">QTY: ${product.quantity}</span>` : ''}
                              </div>
                              <div style="text-align: center;">
                                <svg id="${barcodeId}"></svg>
                              </div>
                            </div>
                          </div>
                        `;
              })
              .join('')}
                  </div>
                `;
        })
        .join('')}
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            ${Array.from({ length: numberOfBarcodes || 1 })
        .map((_, index) => {
          const barcodeId = `barcode-print-${index}`;
          return `
                  JsBarcode("#${barcodeId}", "${product.uniqueBarcodes[index] || product.barcode}", {
                    format: "CODE39",
                    lineColor: "#000",
                    width: 1,
                    height: 60,
                    displayValue: true
                  });
                `;
        })
        .join('')}
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  const handleDownloadPDF = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    const element = printRef.current;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('barcodes.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    // Reset all form data
    setSelectedProduct(null);
    setSearchQuery('');
    setNumberOfBarcodes('');
    setProduct({
      productName: "",
      sku: "",
      price: "",
      expiryDate: "",
      quantity: "",
      barcode: "",
      barcodeImg: "",
      uniqueBarcodes: [],
      showProductName: false,
      showSku: false,
      showPrice: false,
      showExpiryDate: false,
      showQuantity: false,
    });
    setProducts([]);
    setShowDropdown(false);
  };

  const handlePopupClose = () => {
    setIsFormOpen(false); // open popup
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    	// <div className="page-wrapper notes-page-wrapper">
			// 	<div className="content">
			// 		<div className="page-header">
			// 			<div className="add-item d-flex">
			// 				<div className="page-title">
			// 					<h4 className="fw-bold">Print Barcode</h4>
			// 					<h6>Manage your barcodes</h6>
			// 				</div>
			// 			</div>
			// 			<div className="d-flex align-items-center">
			// 				<ul className="table-top-head">
			// 					<li>
			// 						<a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i
			// 								className="ti ti-refresh" /></a>
			// 					</li>
			// 					<li>
			// 						<a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
			// 								className="ti ti-chevron-up" /></a>
			// 					</li>
			// 				</ul>
			// 			</div>
			// 		</div>
			// 		<div className="barcode-content-list">
			// 			<form>
			// 				{/* <div className="row">
			// 					<div className="col-lg-6 col-12">
			// 						<div className="row seacrh-barcode-item mb-1">
			// 							<div className="col-sm-6 mb-3 seacrh-barcode-item-one">
			// 								<label className="form-label">Warehouse<span
			// 										className="text-danger ms-1">*</span></label>
			// 								<select className="select">
			// 									<option>Select</option>
			// 									<option>Lavish Warehouse</option>
			// 									<option>Quaint Warehouse</option>
			// 									<option>Traditional Warehouse</option>
			// 									<option>Cool Warehouse</option>
			// 									<option>Overflow Warehouse</option>
			// 									<option>Nova Storage Hub</option>
			// 									<option>Retail Supply Hub</option>
			// 									<option>EdgeWare Solutions</option>
			// 								</select>
			// 							</div>
			// 							<div className="col-sm-6 mb-3 seacrh-barcode-item-one">
			// 								<label className="form-label">Store<span className="text-danger ms-1">*</span></label>
			// 								<select className="select">
			// 									<option>Select</option>
			// 									<option>Electro Mart</option>
			// 									<option>Quantum Gadgets</option>
			// 									<option>Prime Bazaar</option>
			// 									<option>Gadget World</option>
			// 									<option>Volt Vault</option>
			// 								</select>
			// 							</div>
			// 						</div>
			// 					</div>
			// 				</div> */}
			// 				<div className="row">
			// 					<div className="col-lg-6">
			// 						<div className="mb-3 search-form seacrh-barcode-item">
			// 							<div className="search-form">
			// 								<label className="form-label">Product<span className="text-danger ms-1">*</span></label>
			// 								<div className="position-relative">
			// 									<input type="text" name="searchQuery" value={searchQuery} onChange={handleChange} className="form-control"
			// 				  placeholder="Search Product by Code" />
			// 									<i data-feather="search" className="feather-search" />

                        
			// 								</div>
			// 								<div className="dropdown-menu search-dropdown w-100 h-auto rounded-1 mt-2"
			// 									aria-labelledby="dropdownsearchClickable">
			// 									<ul>
			// 										<li className="fs-14 text-gray-9 mb-2">Amazon Echo Dot</li>
			// 										<li className="fs-14 text-gray-9 mb-2">Armani Belt</li>
			// 										<li className="fs-14 text-gray-9 mb-2">Apple Watch</li>
			// 										<li className="fs-14 text-gray-9">Apple Iphone 14 Pro</li>
			// 									</ul>
			// 								</div>
			// 							</div>
			// 						</div>
			// 					</div>
			// 				</div>
			// 			</form>
			// 			<div className="col-lg-12">
			// 				<div className="p-3 bg-light rounded border mb-3">
			// 					<div className="table-responsive rounded border">
			// 						<table className="table">
			// 							<thead>
			// 								<tr>
			// 									<th>Product</th>
			// 									<th>SKU</th>
			// 									<th>Code</th>
			// 									<th>Qty</th>
			// 									<th className="text-center no-sort bg-secondary-transparent" />
			// 								</tr>
			// 							</thead>
			// 							<tbody>
			// 								<tr>
			// 									<td>
			// 										<div className="d-flex align-items-center">
			// 											<a products className="avatar avatar-md me-2">
			// 												<img src="assets/img/products/stock-img-02.png" alt="product" />
			// 											</a>
			// 											<a products>Nike Jordan</a>
			// 										</div>
			// 									</td>
			// 									<td>PT002</td>
			// 									<td>HG3FK</td>
			// 									<td>
			// 										<div className="product-quantity border-secondary-transparent">
			// 											<span className="quantity-btn"><i data-feather="minus-circle"
			// 													className="feather-search" /></span>
			// 											<input type="text" className="quntity-input" defaultValue={4} />
			// 											<span className="quantity-btn">+<i data-feather="plus-circle"
			// 													className="plus-circle" /></span>
			// 										</div>
			// 									</td>
			// 									<td className="action-table-data">
			// 										<div className="edit-delete-action">
			// 											<a data-bs-toggle="modal" data-bs-target="#delete-modal"
			// 												className="barcode-delete-icon" products>
			// 												<i data-feather="trash-2" className="feather-trash-2" />
			// 											</a>
			// 										</div>
			// 									</td>
			// 								</tr>
			// 								<tr>
			// 									<td>
			// 										<div className="d-flex align-items-center">
			// 											<a products className="avatar avatar-md me-2">
			// 												<img src="assets/img/products/stock-img-03.png" alt="product" />
			// 											</a>
			// 											<a products>Apple Series 5 Watch</a>
			// 										</div>
			// 									</td>
			// 									<td>PT003</td>
			// 									<td>TEUIU7</td>
			// 									<td>
			// 										<div className="product-quantity border-secondary-transparent">
			// 											<span className="quantity-btn"><i data-feather="minus-circle"
			// 													className="feather-search" /></span>
			// 											<input type="text" className="quntity-input" defaultValue={4} />
			// 											<span className="quantity-btn">+<i data-feather="plus-circle"
			// 													className="plus-circle" /></span>
			// 										</div>
			// 									</td>
			// 									<td className="action-table-data">
			// 										<div className="edit-delete-action">
			// 											<a data-bs-toggle="modal" data-bs-target="#delete-modal"
			// 												className="barcode-delete-icon" products>
			// 												<i data-feather="trash-2" className="feather-trash-2" />
			// 											</a>
			// 										</div>
			// 									</td>
			// 								</tr>
			// 							</tbody>
			// 						</table>
			// 					</div>
			// 				</div>
			// 			</div>
			// 			<div className="paper-search-size">
			// 				<div className="row align-items-center">
			// 					<div className="col-lg-6">
			// 						<form className="mb-0">
			// 							<label className="form-label">Paper Size<span className="text-danger ms-1">*</span></label>
			// 							<select className="select">
			// 								<option>Select</option>
			// 								<option>A3</option>
			// 								<option>A4</option>
			// 								<option>A5</option>
			// 								<option>A6</option>
			// 							</select>
			// 						</form>
			// 					</div>
			// 					<div className="col-lg-6 pt-3">
			// 						<div className="row">
			// 							<div className="col-sm-4">
			// 								<div className="search-toggle-list">
			// 									<p>Show Store Name</p>
			// 									<div className="m-0">
			// 										<div
			// 											className="status-toggle modal-status d-flex justify-content-between align-items-center">
			// 											<input type="checkbox" id="user7" className="check" defaultChecked />
			// 											<label htmlFor="user7" className="checktoggle mb-0" />
			// 										</div>
			// 									</div>
			// 								</div>
			// 							</div>
			// 							<div className="col-sm-4">
			// 								<div className="search-toggle-list">
			// 									<p>Show Product Name</p>
			// 									<div className="m-0">
			// 										<div
			// 											className="status-toggle modal-status d-flex justify-content-between align-items-center">
			// 											<input type="checkbox" id="user8" className="check" defaultChecked />
			// 											<label htmlFor="user8" className="checktoggle mb-0" />
			// 										</div>
			// 									</div>
			// 								</div>
			// 							</div>
			// 							<div className="col-sm-4">
			// 								<div className="search-toggle-list">
			// 									<p>Show Price</p>
			// 									<div className="m-0">
			// 										<div
			// 											className="status-toggle modal-status d-flex justify-content-between align-items-center">
			// 											<input type="checkbox" id="user9" className="check" defaultChecked />
			// 											<label htmlFor="user9" className="checktoggle mb-0"> </label>
			// 										</div>
			// 									</div>
			// 								</div>
			// 							</div>
			// 						</div>
			// 					</div>
			// 				</div>
			// 			</div>
			// 			<div className="search-barcode-button">
			// 				<a products className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal"
			// 					data-bs-target="#prints-barcode">
			// 					<span><i className="fas fa-eye me-1" /></span>Generate Barcode
			// 				</a>
			// 				<a products className="btn btn-cancel btn-secondary fs-13 me-2">
			// 					<span><i className="fas fa-power-off me-1" /></span>Reset Barcode
			// 				</a>
			// 				<a products className="btn btn-cancel btn-danger close-btn">
			// 					<span><i className="fas fa-print me-1" /></span>Print Barcode
			// 				</a>
			// 			</div>
			// 		</div>
			// 	</div>
				
			// </div>
    <div className="page-wrapper notes-page-wrapper">
<div className="content">
     {/* Add CSS for loading animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* path */}
      {/* <div >
        <span className="ap-name" style={{ fontWeight: '600' }}>Print Barcode</span>
      </div> */}
		<div className="page-header">
						<div className="add-item d-flex">
							<div className="page-title">
								<h4 className="fw-bold">Print Barcode</h4>
								<h6>Manage your barcodes</h6>
							</div>
						</div>
						<div className="d-flex align-items-center">
							<ul className="table-top-head">
								<li>
									<a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><TbRefresh
											className="ti ti-refresh" /></a>
								</li>
								{/* <li>
									<a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i
											className="ti ti-chevron-up" /></a>
								</li> */}
							</ul>
						</div>
					</div>

          
      <div >
        <div className='card p-4'>
          {/* <strong>Estimate Amount</strong> */}

          <div className="mb-3 search-form seacrh-barcode-item" >
          <div className="search-form">
          <label className="form-label">Product<span className="text-danger ms-1">*</span></label>
             <div ref={searchRef} className="position-relative">
                  <input   name="searchQuery"
                  value={searchQuery}
                  onChange={handleChange} type="text" className="form-control" placeholder="Search Product by Name" />
                  <IoIosSearch data-feather="search" className="feather-search" />
                   {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {products.length > 0 ? (
                    products.map((productItem) => (
                      <div
                        key={productItem._id}
                        onClick={() => handleProductSelect(productItem)}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '500', color: '#333' }}>{productItem.productName}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                      {loading ? 'Searching...' : 'No products found'}
                    </div>
                  )}
                </div>
              )}
                </div>

            {/* <div ref={searchRef} style={{ position: 'relative' }}>
              <div style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <IoIosSearch style={{ fontSize: '25px', marginRight: '8px' }} />
                <input
                  type="text"
                  name="searchQuery"
                  value={searchQuery}
                  onChange={handleChange}
                  placeholder="Search for products..."
                  style={{ border: 'none', outline: 'none', color: "#999797ff", backgroundColor: "#FBFBFB", flex: 1 }} />
                {loading && (
                  <div style={{ width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                )}
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {products.length > 0 ? (
                    products.map((productItem) => (
                      <div
                        key={productItem._id}
                        onClick={() => handleProductSelect(productItem)}
                        style={{
                          padding: '10px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '500', color: '#333' }}>{productItem.productName}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                      {loading ? 'Searching...' : 'No products found'}
                    </div>
                  )}
                </div>
              )}
            </div> */}
          </div>
          </div>

          {/* Selected Product Display */}
          {selectedProduct && (
            <div className="col-lg-12">
        <div className="p-3 bg-light rounded border mb-3">
          <div className="table-responsive rounded border">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>HSN</th>
                    <th>Qty</th>
                   <th>Rate</th>
                  <th>SKU</th>
                  <th>Action</th>
                
                  {/* <th className="text-center no-sort bg-secondary-transparent" /> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                                    {selectedProduct.images && selectedProduct.images[0] && (
                                         <a products className="avatar avatar-md me-2">
                        <img src={selectedProduct.images[0].url} alt="product" />
                      </a>
                            // <img src={selectedProduct.images[0].url} style={{ width: '30px', height: '30px', borderRadius: '6px' }} />
                          )}
                   
                      <a className='text-capitalize'>{selectedProduct.productName}</a>
                    </div>												
                  </td>
                     <td>{selectedProduct.hsnCode || '0'}</td>
                     <td>{selectedProduct.quantity || '0'}</td>
                     <td>₹{selectedProduct.sellingPrice || '0'}.00</td>
                  <td>{selectedProduct.sku}</td>
                  {/* <td>HG3FK</td> */}
                  
                  {/* <td>
                    <div className="product-quantity border-secondary-transparent">
                      <span className="quantity-btn"><i data-feather="minus-circle" className="feather-search" /></span>                                                        
                      <input type="text" className="quntity-input" defaultValue={4} />
                      <span className="quantity-btn">+<i data-feather="plus-circle" className="plus-circle" /></span>
                    </div>
                  </td> */}
                  <td className="action-table-data">
                    <div className="edit-delete-action">
                      <a onClick={clearSearch} data-bs-toggle="modal" data-bs-target="#delete-modal" className="barcode-delete-icon" products>
                        <TbTrash data-feather="trash-2" className="feather-trash-2" />
                      </a>
                    </div>
                  </td>
                </tr>
              
              </tbody>
            </table>
          </div>
        </div>
      </div>
            // <div sclassName="p-3 bg-light rounded border mb-3">
            //   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            //     <div style={{ fontWeight: '600', color: '#495057' }}>Selected Product Details :</div>
            //     <button
            //       onClick={clearSearch}
            //       style={{
            //         background: '#dc3545',
            //         color: 'white',
            //         border: 'none',
            //         padding: '4px 8px',
            //         borderRadius: '4px',
            //         fontSize: '12px',
            //         cursor: 'pointer'
            //       }}
            //     >
            //       Clear
            //     </button>
            //   </div>
            //   <div style={{ fontSize: '14px' }}>
            //     <div style={{ fontSize: '16px', fontWeight: '500' }}>SKU</div>
            //     <div style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>{selectedProduct.sku}</div>
            //     <div style={{ border: '1px solid #ccc', marginTop: '10px', borderRadius: '8px' }}>
            //       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            //         <thead style={{ backgroundColor: '#E6E6E6' }}>
            //           <tr style={{ color: "#676767", }}>
            //             <th style={{ padding: '8px', borderTopLeftRadius: '8px' }}> Variant</th>
            //             <th>Price</th>
            //             <th style={{ borderTopRightRadius: '8px' }}>Quantity</th>
            //           </tr>
            //         </thead>
            //         <tbody>
            //           <tr>
            //             <td style={{ padding: '8px' }}>
            //               {selectedProduct.images && selectedProduct.images[0] && (
            //                 <img src={selectedProduct.images[0].url} style={{ width: '30px', height: '30px', borderRadius: '6px' }} />
            //               )}
            //               {selectedProduct.productName}
            //             </td>
            //             <td>₹{selectedProduct.sellingPrice || '0'}.00</td>
            //             <td>{selectedProduct.quantity || '0'}</td>
            //           </tr>
            //         </tbody>
            //       </table>
            //     </div>
            //   </div>
            // </div>
          )}

          {!selectedProduct && (
            <div style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "white", padding: '40px', borderRadius: '8px', marginTop: '24px', textAlign: 'center' }}>
              <AiFillProduct style={{ fontSize: '25px' }} />
              <br />
              <span style={{ color: '#1368EC' }}>Search Product</span><span> to Generate Barcode</span>
            </div>
          )}
        </div>

        <div className='card p-4 mt-3'>
          <strong>Set Barcode Details</strong>
          <div className="row mt-3">
               <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Number of Barcode to print<span className="text-danger ms-1">*</span></label>
 <input
                  type="number"
                  name="numberOfBarcodes"
                  value={numberOfBarcodes}
                  onChange={handleChange}
                  min="1"
                  placeholder='01'
                   className="form-control"
                  // style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '6px', borderRadius: '8px', width: '100%' }}
                   />
                              {/* <select
                                className="form-select"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Complete">Complete</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                              </select> */}
                            </div>
                          </div>
               <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Lable Formate
                                {/* <span className="text-danger ms-1">*</span> */}
                                </label>
                              <select className="form-select" type="text" >
                                  <option value="">--Select Lable--</option>
                  <option>Large</option>
                  <option>Mediam</option>
                  <option>Small</option>
                </select>
                            </div>
                          </div>
               <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">Page Type & Size
                                {/* <span className="text-danger ms-1">*</span> */}
                                </label>

                              <select
                                className="form-select"
                                name="status"
                               
                              >
                                <option>A4</option>
                            
                              </select>
                            </div>
                          </div>

          </div>

          {/* <div style={{ marginTop: '16px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ width: '100%' }}>
                <div>Number of Barcode to print</div>
                <input
                  type="number"
                  name="numberOfBarcodes"
                  value={numberOfBarcodes}
                  onChange={handleChange}
                  min="1"
                  placeholder='01'
                  style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '6px', borderRadius: '8px', width: '100%' }} />
              </div>

              <div style={{ width: '100%' }}>
                <div>Lable Formate</div>
                <select type="text" style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '6px', borderRadius: '8px', width: '100%' }}>
                  <option>Large</option>
                  <option>Mediam</option>
                  <option>Small</option>
                </select>
              </div>

              <div style={{ width: '100%' }}>
                <div>Page Type & Size</div>
                <select type="text" style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '6px', borderRadius: '8px', width: '100%' }}>
                  <option>A4</option>
                </select>
              </div>
            </div>
          </div> */}
{/* 
          <div style={{ marginTop: '16px' }}>
            <div>Barcode Content Options</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type='checkbox'
                  name="showProductName"
                  checked={product.showProductName}
                  onChange={handleChange} />
                <span>Product Name</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type='checkbox'
                  name="showSku"
                  checked={product.showSku}
                  onChange={handleChange} />
                <span>SKU</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type='checkbox'
                  name="showPrice"
                  checked={product.showPrice}
                  onChange={handleChange} />
                <span>Price</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type='checkbox'
                  name="showExpiryDate"
                  checked={product.showExpiryDate}
                  onChange={handleChange} />
                <span>Expiry Date</span>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input type='checkbox'
                  name="showQuantity"
                  checked={product.showQuantity}
                  onChange={handleChange} />
                <span>Quantity</span>
              </div>
            </div>
          </div> */}

             <div className="paper-search-size">
        <div className="row align-items-center">
       
          <div className="col-lg-6 pt-3">
            {/* <div className="row">
               
              <div className="col-sm-4">
                <div className="search-toggle-list">
                  <p>Show Product Name</p>
                  <div className="m-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <input type="checkbox" id="user8" className="check" defaultChecked />
                      <label htmlFor="user8" className="checktoggle mb-0" />
                    </div>
                  </div>
                </div> 
              </div>
              <div className="col-sm-4">
                <div className="search-toggle-list">
                  <p>Show Price</p>
                  <div className="m-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <input type="checkbox" id="user9" className="check" defaultChecked />
                      <label htmlFor="user9" className="checktoggle mb-0">	</label>
                    </div>
                  </div>
                </div> 
              </div> 
               <div className="col-sm-4">
                <div className="search-toggle-list">
                  <p>Show Expire Date</p>
                  <div className="m-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <input type="checkbox" id="user7" className="check" defaultChecked />
                      <label htmlFor="user7" className="checktoggle mb-0" />
                    </div>
                  </div>
                </div> 
              </div>  
            </div>      
             */}
             <div className="row" style={{ marginTop: '16px' }}>
  <div className="col-sm-4">
    <div className="search-toggle-list">
      <p>Show Product Name</p>
      <div className="m-0">
        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            id="showProductName"
            className="check"
            name="showProductName"
            checked={product.showProductName}
            onChange={handleChange}
          />
          <label htmlFor="showProductName" className="checktoggle mb-0" />
        </div>
      </div>
    </div>
  </div>
   <div className="col-sm-4">
    <div className="search-toggle-list">
      <p>Show Price</p>
      <div className="m-0">
        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            id="showPrice"
            className="check"
            name="showPrice"
            checked={product.showPrice}
            onChange={handleChange}
          />
          <label htmlFor="showPrice" className="checktoggle mb-0" />
        </div>
      </div>
    </div>
  </div>

   <div className="col-sm-4">
    <div className="search-toggle-list">
      <p>Show Expiry Date</p>
      <div className="m-0">
        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            id="showExpiryDate"
            className="check"
            name="showExpiryDate"
            checked={product.showExpiryDate}
            onChange={handleChange}
          />
          <label htmlFor="showExpiryDate" className="checktoggle mb-0" />
        </div>
      </div>
    </div>
  </div>

  {/* <div className="col-sm-4">
    <div className="search-toggle-list">
      <p>Show SKU</p>
      <div className="m-0">
        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            id="showSku"
            className="check"
            name="showSku"
            checked={product.showSku}
            onChange={handleChange}
          />
          <label htmlFor="showSku" className="checktoggle mb-0" />
        </div>
      </div>
    </div>
  </div>

  <div className="col-sm-4">
    <div className="search-toggle-list">
      <p>Show Quantity</p>
      <div className="m-0">
        <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
          <input
            type="checkbox"
            id="showQuantity"
            className="check"
            name="showQuantity"
            checked={product.showQuantity}
            onChange={handleChange}
          />
          <label htmlFor="showQuantity" className="checktoggle mb-0" />
        </div>
      </div>
    </div>
  </div> */}
</div>

          </div>
          {/* <div className="col-lg-6 flex-end">
            <div className="search-barcode-button">                            
        <a   onClick={() => {
              setIsFormOpen(true);
              generateBarcode();
            }}
            disabled={!selectedProduct} className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal" data-bs-target="#prints-barcode">
          <span><TbEye className="fas fa-eye me-1" /></span>Generate Barcode
        </a>
        <a onClick={closeForm} className="btn btn-cancel btn-secondary fs-13 me-2">
          <span><i className="fas fa-power-off me-1" /></span>Cancel 
        </a>
      
      </div>
          </div> */}
        </div>
      </div> 
      {/* <div className="search-barcode-button">                            
        <a className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal" data-bs-target="#prints-barcode">
          <span><i className="fas fa-eye me-1" /></span>Generate Barcode
        </a>
        <a className="btn btn-cancel btn-secondary fs-13 me-2">
          <span><i className="fas fa-power-off me-1" /></span>Reset Barcode
        </a>
        <a className="btn btn-cancel btn-danger close-btn">
          <span><i className="fas fa-print me-1" /></span>Print Barcode
        </a>
      </div> */}
          <div className="search-barcode-button">                            
        <a   onClick={() => {
              setIsFormOpen(true);
              generateBarcode();
            }}
            disabled={!selectedProduct} className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal" data-bs-target="#prints-barcode">
          <span><TbEye className="fas fa-eye me-1" /></span>Generate Barcode
        </a>
        <a onClick={closeForm} className="btn btn-cancel btn-secondary fs-13 me-2">
          <span><i className="fas fa-power-off me-1" /></span>Cancel 
        </a>
      
      </div>
        </div>

        

        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            maxWidth: "690px",
            margin: "auto",
            marginTop: "16px",
          }}
        >
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #E6E6E6",
              backgroundColor: "#FFFFFF",
              color: "#333",
              cursor: "pointer",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
            }}
            onClick={closeForm}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsFormOpen(true);
              generateBarcode();
            }}
            disabled={!selectedProduct}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #E6E6E6",
              backgroundColor: selectedProduct ? "#FFFFFF" : "#f5f5f5",
              color: selectedProduct ? "#333" : "#999",
              cursor: selectedProduct ? "pointer" : "not-allowed",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            Preview
          </button>
        </div> */}

        {/* Show Barcode SVG */}
        {isFormOpen && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(199, 197, 197, 0.4)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            zIndex: '10',
            overflowY: 'auto',
          }}>
            <div ref={formRef} style={{ width: '760px', height: 'auto', margin: 'auto', marginTop: '80px', marginBottom: '80px', backgroundColor: 'white', border: '1px solid #E1E1E1', borderRadius: '8px', padding: '10px 16px', overflowY: 'auto' }}>
              <div style={{ position: 'fixed', width: '725px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E1E1E1', backgroundColor: '#fff', zIndex: '100', marginTop: '-10px', padding: '10px 0px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Pdf"
                    onClick={handleDownloadPDF}
                  >
                    <FaFilePdf style={{ color: "red" }} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Pdf"
                    onClick={handlePrint}
                  >
                    <IoPrint  style={{fontSize:'22px'}} /> Print
                  </button>
                </div>
                <div style={{}}>
                  <span style={{ backgroundColor: 'red', color: 'white', padding: '5px 11px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px' }} onClick={handlePopupClose}>x</span>
                </div>
              </div>

              <div ref={printRef} className='row' style={{ marginTop: '60px', marginLeft: '1px' }}>
                {Array.from({ length: numberOfBarcodes || 1 }).map((_, index) => (
                  <div key={index} className='col-6' style={{ height: '300px', }}>
                    <div style={{ marginTop: "10px", border: '2px solid #E6E6E6', borderRadius: '8px', width: '320px', padding: '16px 24px', height: '280px', marginBottom: '10px' }}>
                      {product.showProductName && product.productName && (
                        <span style={{ fontWeight: '600', color: 'black' }}>{product.productName}</span>
                      )}
                      {product.showSku && product.sku && (
                        <>
                          <br />
                          <span style={{ color: 'black' }}>SKU: {product.sku}</span>
                        </>
                      )}
                      {product.showPrice && product.price && (
                        <>
                          <br /><br />
                          <span style={{ fontWeight: '500', color: 'black' }}>MRP: ₹{product.price}</span>
                        </>
                      )}
                      <br />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {product.showExpiryDate && product.expiryDate && (
                          <span style={{ color: 'black' }}>Expiry: {new Date(product.expiryDate).toLocaleDateString()}</span>
                        )}
                        {product.showQuantity && product.quantity && (
                          <span style={{ color: 'black' }}>QTY: {product.quantity}</span>
                        )}
                      </div>
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        {product.barcode && (
                          <svg id={`barcode-svg-${index}`}></svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
</div>
   

    </div>
  );
}

export default Barcode;







  const generateBarcode = () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    // Helper function to safely get expiry date
    const getExpiryDate = (selectedProduct) => {
      return selectedProduct.variants && selectedProduct.variants.Expire && selectedProduct.variants.Expire[0]
        ? selectedProduct.variants.Expire[0]
        : 'N/A';
    };

    const barcodeNaming = (product, selectedProduct) => {
      if (product.showProductName && product.showQuantity && product.showSku && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Price:${price},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showSku && product.showPrice) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Name:${name},SKU:${sku},Price:${price},QTY:${quantity}`;
      } else if (product.showProductName && product.showQuantity && product.showSku && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU${sku},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},Price:${price},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku && product.showPrice && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Price:${price},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku && product.showPrice) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        return `Name:${name},SKU:${sku},Price:${price}`;
      } else if (product.showProductName && product.showSku && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},SKU:${sku},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity && product.showPrice) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Name:${name},Price:${price},QTY:${quantity}`;
      } else if (product.showProductName && product.showQuantity && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var quantity = selectedProduct.quantity;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},QTY:${quantity},Exp:${expiry}`;
      } else if (product.showProductName && product.showSku) {
        var name = selectedProduct.productName;
        var sku = selectedProduct.sku;
        return `Name:${name},SKU:${sku}`;
      } else if (product.showProductName && product.showPrice) {
        var name = selectedProduct.productName;
        var price = selectedProduct.sellingPrice;
        return `Name:${name},Price:${price}`;
      } else if (product.showProductName && product.showExpiryDate) {
        var name = selectedProduct.productName;
        var expiry = getExpiryDate(selectedProduct);
        return `Name:${name},Exp:${expiry}`;
      } else if (product.showProductName && product.showQuantity) {
        var name = selectedProduct.productName;
        var quantity = selectedProduct.quantity;
        return `Name:${name},QTY:${quantity}`;
      } else if (product.showSku && product.showPrice && product.showExpiryDate) {
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `SKU:${sku},Price:${price},Exp:${expiry}`;
      } else if (product.showSku && product.showPrice) {
        var sku = selectedProduct.sku;
        var price = selectedProduct.sellingPrice;
        return `SKU:${sku},Price:${price}`;
      } else if (product.showSku && product.showExpiryDate) {
        var sku = selectedProduct.sku;
        var expiry = getExpiryDate(selectedProduct);
        return `SKU:${sku},Exp:${expiry}`;
      } else if (product.showSku && product.showQuantity) {
        var sku = selectedProduct.sku;
        var quantity = selectedProduct.quantity;
        return `SKU:${sku},QTY:${quantity}`;
      } else if (product.showPrice && product.showExpiryDate) {
        var price = selectedProduct.sellingPrice;
        var expiry = getExpiryDate(selectedProduct);
        return `Price:${price},Exp:${expiry}`;
      } else if (product.showPrice && product.showQuantity) {
        var price = selectedProduct.sellingPrice;
        var quantity = selectedProduct.quantity;
        return `Price:${price},QTY:${quantity}`;
      } else if (product.showExpiryDate && product.showQuantity) {
        var expiry = getExpiryDate(selectedProduct);
        var quantity = selectedProduct.quantity;
        return `Exp:${expiry},QTY:${quantity}`;
      } else if (product.showProductName) {
        return "Name:" + selectedProduct.productName;
      } else if (product.showSku) {
        return "SKU:" + selectedProduct.sku;
      } else if (product.showPrice) {
        return "Price:" + selectedProduct.sellingPrice;
      } else if (product.showExpiryDate) {
        return "Exp:" + getExpiryDate(selectedProduct);
      } else if (product.showQuantity) {
        return "QTY:" + selectedProduct.quantity;
      } else {
        return "Name:" + selectedProduct.productName || "SKU:" + selectedProduct.sku || "Price:" + selectedProduct.sellingPrice || "Exp:" + getExpiryDate(selectedProduct) || "QTY:" + selectedProduct.quantity || '';
      }
    }

    // Call backend to generate barcode(s) so server-side values are used
    const barcodeCount = parseInt(numberOfBarcodes, 10) || 1;
    const token = localStorage.getItem('token');
    setLoading(true);
    (async () => {
      try {
        const requests = [];
        for (let i = 0; i < barcodeCount; i++) {
          // Attach productId only for the first call so product.itemBarcode is set once
          const body = i === 0 ? { productId: selectedProduct._id } : {};
          requests.push(
            axios.post(`${BASE_URL}/api/products/generate-barcode`, body, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        }

        const responses = await Promise.all(requests);
        const uniqueBarcodes = responses.map((r) => (r && r.data && r.data.barcode) || '');

        // If any response returned an updated product, pick it (usually the first)
        const updatedProduct = responses.find((r) => r && r.data && r.data.product && r.data.product._id);
        if (updatedProduct && updatedProduct.data.product) {
          const prod = updatedProduct.data.product;
          setSelectedProduct(prod);
          setProduct((prev) => ({
            ...prev,
            productName: prod.productName || prev.productName,
            sku: prod.sku || prev.sku,
            price: prod.sellingPrice || prev.price,
            quantity: prod.quantity || prev.quantity,
            barcode: prod.itemBarcode || uniqueBarcodes[0] || prev.barcode,
            barcodeImg: prod.itemBarcode || uniqueBarcodes[0] || prev.barcodeImg,
            uniqueBarcodes,
          }));
        } else {
          setProduct((prev) => ({
            ...prev,
            barcode: uniqueBarcodes[0] || prev.barcode,
            barcodeImg: uniqueBarcodes[0] || prev.barcode,
            uniqueBarcodes,
          }));
        }

        // Render barcode svgs
        setTimeout(() => {
          for (let i = 0; i < barcodeCount; i++) {
            const barcodeId = `barcode-svg-${i}`;
            const barcodeElement = document.getElementById(barcodeId);
            if (barcodeElement) {
              const codeValue = uniqueBarcodes[i] || uniqueBarcodes[0] || '';
              // Choose format: use EAN13/UPC when purely numeric and length 12-13, otherwise CODE128
              let format = 'CODE128';
              if (/^\d{12,13}$/.test(codeValue)) {
                // prefer EAN13 for 12/13-digit numeric codes (many scanners support EAN/UPC family)
                format = 'EAN13';
              }
              JsBarcode(barcodeElement, codeValue, {
                format,
                lineColor: '#000',
                width: 2, // wider bars to improve camera decoding
                height: 100, // taller bars
                margin: 10,
                displayValue: true,
                fontSize: 16,
                textMargin: 6,
              });
            }
          }
        }, 100);
      } catch (err) {
        console.error('generateBarcode API error', err);
        toast.error('Failed to generate barcode from server');
      } finally {
        setLoading(false);
      }
    })();
  };