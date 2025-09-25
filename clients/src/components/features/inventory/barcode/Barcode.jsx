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
    if (!query || query.length < 2) {
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
    <div style={{ marginTop: '60px', padding: '20px', fontFamily: 'sans-serif' }}>

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
      <div style={{ fontSize: 'large', marginLeft: '80px', marginBottom: '20px' }}>
        <span className="ap-name" style={{ fontWeight: '600' }}>Print Barcode</span>
      </div>

      <div style={{ maxWidth: '750px', margin: 'auto', padding: '16px 32px', fontFamily: 'sans-serif' }}>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E1E1E1', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}>
          <strong>Estimate Amount</strong>

          <div style={{ marginTop: '16px' }}>
            <div>Products</div>
            <div ref={searchRef} style={{ position: 'relative' }}>
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

              {/* Dropdown for search results */}
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
          </div>

          {/* Selected Product Display */}
          {selectedProduct && (
            <div style={{ marginTop: '16px', }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: '#495057' }}>Selected Product Details :</div>
                <button
                  onClick={clearSearch}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
              <div style={{ fontSize: '14px' }}>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>SKU</div>
                <div style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "#FBFBFB", padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>{selectedProduct.sku}</div>
                <div style={{ border: '1px solid #ccc', marginTop: '10px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#E6E6E6' }}>
                      <tr style={{ color: "#676767", }}>
                        <th style={{ padding: '8px', borderTopLeftRadius: '8px' }}> Variant</th>
                        <th>Price</th>
                        <th style={{ borderTopRightRadius: '8px' }}>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px' }}>
                          {selectedProduct.images && selectedProduct.images[0] && (
                            <img src={selectedProduct.images[0].url} style={{ width: '30px', height: '30px', borderRadius: '6px' }} />
                          )}
                          {selectedProduct.productName}
                        </td>
                        <td>₹{selectedProduct.sellingPrice || '0'}.00</td>
                        <td>{selectedProduct.quantity || '0'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {!selectedProduct && (
            <div style={{ border: '1px solid #ccc', color: "#999797ff", backgroundColor: "white", padding: '40px', borderRadius: '8px', marginTop: '24px', textAlign: 'center' }}>
              <AiFillProduct style={{ fontSize: '25px' }} />
              <br />
              <span style={{ color: '#1368EC' }}>Search Product</span><span> to Generate Barcode</span>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #E1E1E1', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }} >
          <strong>Set Barcode Details</strong>

          <div style={{ marginTop: '16px' }}>

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
          </div>

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
          </div>
        </div>

        <div
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
        </div>

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
  );
}

export default Barcode;