import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from "jsbarcode";
import { IoIosSearch } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { FaFilePdf } from "react-icons/fa6";
import axios from 'axios';
import barcodeDetector from '../../../../utils/barcodeDetector';
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
  const [labelFormat, setLabelFormat] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const lookupDetectorRef = useRef(null);
  const lookupVideoRef = useRef(null);
  const lookupDetectionLockRef = useRef(false);

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

  // Fetch latest product from server and open preview modal
  const handlePreview = async (productId) => {
    try {
      if (!productId) return;
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/products/preview/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res && res.data) {
        const prod = res.data;
        // update selectedProduct and product preview state
        // res.data returns a barcode-centric preview object
        // normalize and prefer the DB-stored itemBarcode
        const barcodeVal = prod.itemBarcode ? String(prod.itemBarcode).trim() : '';
        setSelectedProduct((prev) => ({
          ...prev,
          _id: prod._id,
          productName: prod.productName,
          sellingPrice: prod.sellingPrice || prod.sellingPrice,
          unit: prod.unit,
          itemBarcode: barcodeVal || null,
          availableQty: prod.availableQty,
          images: prod.images || prev.images,
        }));
        setProduct((prev) => ({ ...prev, productName: prod.productName || prev.productName, price: prod.sellingPrice || prev.price, unit: prod.unit || prev.unit, barcode: barcodeVal, uniqueBarcodes: barcodeVal ? [barcodeVal] : [] }));
        // render into svg
        setTimeout(() => {
          const svg = document.getElementById('barcode-svg-0');
          if (svg && barcodeVal) {
            const format = /^\d{12,13}$/.test(barcodeVal) ? 'EAN13' : 'CODE128';
            JsBarcode(svg, barcodeVal, { format, lineColor: '#000', width: 2, height: 100, margin: 10, displayValue: true, fontSize: 16, textMargin: 6 });
          }
        }, 50);
        setIsFormOpen(true);
      } else {
        toast.error('Unable to fetch product for preview');
      }
    } catch (err) {
      console.error('handlePreview error', err);
      toast.error('Unable to fetch product for preview');
    }
  };

  // When a product is selected, auto-generate or display existing barcode in realtime
  // useEffect(() => {
  //   const autoGenerate = async () => {
  //     if (!selectedProduct) return;
  //     // Only render an existing barcode from the selected product — do NOT auto-generate.
  //     const existing = selectedProduct.itemBarcode || selectedProduct.barcode;
  //     if (existing) {
  //       setProduct((prev) => ({ ...prev, barcode: existing, uniqueBarcodes: [existing] }));
  //       setTimeout(() => {
  //         const svg = document.getElementById('barcode-svg-0');
  //         if (svg) {
  //           const format = /^\d{12,13}$/.test(existing) ? 'EAN13' : 'CODE128';
  //           JsBarcode(svg, existing, { format, lineColor: '#000', width: 2, height: 100, margin: 10, displayValue: true, fontSize: 16, textMargin: 6 });
  //         }
  //       }, 50);
  //     }
  //   };
  //   autoGenerate();
  // }, [selectedProduct]);

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
      expiryDate: selectedProduct.variants && selectedProduct.variants.Expire && selectedProduct.variants.Expire[0] ? selectedProduct.variants.Expire[0] : '',
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
    setLabelFormat('');
    setPageSize('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'numberOfBarcodes') {
      setNumberOfBarcodes(parseInt(value));
    } else if (name === 'searchQuery') {
      setSearchQuery(value);
    } else if (name === 'labelFormat') {
      setLabelFormat(value);
    } else if (name === 'pageSize') {
      setPageSize(value);
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

    // If the product already has a barcode attached, warn and show preview instead
    const existingBarcode = selectedProduct.itemBarcode || product.barcode;
    if (existingBarcode) {
      toast.warn('This product already has a barcode. Showing preview.');
      // open preview modal with DB data
      handlePreview(selectedProduct._id);
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

        // Render barcode svgs immediately with improved visual parameters for camera decoding
        const renderBarcodeFor = (idx, codeValue) => {
          const barcodeId = `barcode-svg-${idx}`;
          const barcodeElement = document.getElementById(barcodeId);
          if (!barcodeElement) return;
          let format = 'CODE128';
          if (/^\d{12,13}$/.test(codeValue)) format = 'EAN13';
          JsBarcode(barcodeElement, codeValue, {
            format,
            lineColor: '#000',
            width: 2,
            height: 100,
            margin: 10,
            displayValue: true,
            fontSize: 16,
            textMargin: 6,
          });
        };

        for (let i = 0; i < barcodeCount; i++) {
          const codeValue = uniqueBarcodes[i] || uniqueBarcodes[0] || '';
          renderBarcodeFor(i, codeValue);
        }
      } catch (err) {
        console.error('generateBarcode API error', err);
        toast.error('Failed to generate barcode from server');
      } finally {
        setLoading(false);
      }
    })();
  };

  // Lookup a product by barcode value and open a dedicated modal showing DB barcode
  const handleLookupByCode = async (code) => {
    try {
      const trimmed = String(code || '').trim();
      if (!trimmed) {
        toast.error('Please enter a barcode to lookup');
        return;
      }
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/products/barcode/${encodeURIComponent(trimmed)}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res && res.data) {
        const prod = res.data;
        // normalize barcode value from DB and set into local state
        const barcodeVal = prod.itemBarcode ? String(prod.itemBarcode).trim() : '';
        setSelectedProduct((prev) => ({
          ...prev,
          _id: prod._id,
          productName: prod.productName || prev.productName,
          sellingPrice: prod.sellingPrice || prev.sellingPrice,
          unit: prod.unit || prev.unit,
          itemBarcode: barcodeVal || null,
          availableQty: prod.availableQty || prev.availableQty,
          images: prod.images || prev.images,
        }));
        setProduct((prev) => ({ ...prev, productName: prod.productName || prev.productName, price: prod.sellingPrice || prev.price, unit: prod.unit || prev.unit, barcode: barcodeVal, uniqueBarcodes: barcodeVal ? [barcodeVal] : [] }));
        // render into svg after modal opens
        setTimeout(() => {
          const svg = document.getElementById('barcode-lookup-svg');
          if (svg && barcodeVal) {
            const format = /^\d{12,13}$/.test(barcodeVal) ? 'EAN13' : 'CODE128';
            JsBarcode(svg, barcodeVal, { format, lineColor: '#000', width: 2, height: 100, margin: 10, displayValue: true, fontSize: 16, textMargin: 6 });
          }
        }, 150);
        setIsLookupOpen(true);
        // show single success toast with product name and price
        try {
          const label = prod.productName ? `${prod.productName}` : 'Product found';
          const priceLabel = prod.sellingPrice != null ? ` - ₹${Number(prod.sellingPrice).toFixed(2)}` : '';
          toast.success(`${label}${priceLabel}`);
        } catch (e) { /* ignore toast errors */ }
        // Dispatch a global event so other parts of the app (POS) can react and add the product to cart if desired
        try {
          if (typeof window !== 'undefined' && window.CustomEvent) {
            window.dispatchEvent(new CustomEvent('barcode:found', { detail: prod }));
          }
        } catch (e) { /* ignore */ }
        // Keep the detector running so the camera remains open; modal close will stop it.
      } else {
        toast.error('Product not found for this barcode');
      }
    } catch (err) {
      console.error('lookupByCode error', err);
      toast.error(err.response?.data?.message || 'Failed to lookup barcode');
    }
  };

  // Start/stop camera detector when lookup modal opens/closes
  useEffect(() => {
    let mounted = true;
    const startDetector = async () => {
      if (!isLookupOpen) return;
      const videoEl = lookupVideoRef.current || document.getElementById('barcode-lookup-video');
      if (!videoEl) return;

      const onDetected = async (code) => {
        if (!code) return;
        // prevent rapid duplicate handling
        if (lookupDetectionLockRef.current) return;
        lookupDetectionLockRef.current = true;
        try {
          await handleLookupByCode(code);
          if (navigator && navigator.vibrate) navigator.vibrate(80);
        } catch (err) {
          // handled by lookup
        }
        // release lock after short cooldown so scanning can continue
        setTimeout(() => { lookupDetectionLockRef.current = false; }, 1500);
      };

      try {
        // keep camera open after detection in this modal (autoStopOnDetect: false)
        lookupDetectorRef.current = await barcodeDetector.startVideoDetector(videoEl, onDetected, { formats: ['ean_13', 'code_128'], autoStopOnDetect: false, cooldownMs: 1500 });
      } catch (err) {
        console.error('Failed to start lookup video detector', err);
      }
    };

    if (isLookupOpen && mounted) startDetector();

    return () => {
      mounted = false;
      if (lookupDetectorRef.current && typeof lookupDetectorRef.current.stop === 'function') {
        try { lookupDetectorRef.current.stop(); } catch (e) {}
        lookupDetectorRef.current = null;
      }
    };
  }, [isLookupOpen]);

  const handlePrint = () => {
    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    // Copy the modal's HTML and styles for printing
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
              .barcode-scanner-link {
                border: 2px solid #E6E6E6;
                border-radius: 8px;
                padding: 16px 24px;
                width: 320px;
                height: 280px;
                box-sizing: border-box;
                page-break-inside: avoid;
                text-align: left;
                font-size: 14px;
                margin: 0 auto 16px auto;
              }
              .barcode-scanner-link svg {
                width: 100%;
                height: 60px;
                margin-top: 10px;
              }
              .barcode-scanner-link h6, .barcode-scanner-link p {
                margin: 0 0 5px 0;
              }
              @page {
                size: A4;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div id="barcode-print-root">${printContent}</div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            (${function (barcodes, numberOfBarcodes) {
        for (let i = 0; i < (numberOfBarcodes || 1); i++) {
          const svg = document.getElementById(`barcode-svg-${i}`);
          if (svg) {
            window.JsBarcode(svg, barcodes[i] || barcodes[0] || '', {
              format: "CODE128",
              lineColor: "#000",
              width: 1,
              height: 60,
              displayValue: true
            });
          }
        }
        window.onload = function () {
          window.print();
          window.onafterprint = function () {
            window.close();
          };
        };
      }.toString()})(${JSON.stringify(product.uniqueBarcodes)}, ${numberOfBarcodes || 1});
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
    setLabelFormat('');
    setPageSize('');
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
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" onClick={() => location.reload()}><TbRefresh
                  className="ti ti-refresh" /></a>
              </li>

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
                  <input name="searchQuery"
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
                              <div style={{ fontWeight: '500', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={productItem?.images[0]?.url} style={{ width: '30px' }} />
                                {productItem.productName}
                              </div>
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

                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Lable Format
                    {/* <span className="text-danger ms-1">*</span> */}
                  </label>
                  <select className="form-select" type="text" name='labelFormat' value={labelFormat} onChange={handleChange}>
                    <option value="">--Select Lable--</option>
                    <option value="large">Large</option>
                    <option value="mediam">Mediam</option>
                    <option value="small">Small</option>
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
                    name="pageSize"
                    value={pageSize}
                    onChange={handleChange}
                  >
                    <option>--select Page Size--</option>
                    <option value="a4">A4</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="paper-search-size">
              <div className="row align-items-center">
                <div className="row mt-3 " >
                  <div className="col-4 col-sm-2">
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
                  <div className="col-4 col-sm-2">
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

                  <div className="col-4 col-sm-2">
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
                </div>
              </div>
            </div>

            <div className="barcode-content-list border-top pt-3 mt-3">
              <div className="search-barcode-button">
                {/* <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter barcode to lookup"
                    className="form-control"
                    style={{ maxWidth: '280px' }}
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                  />
                  <a onClick={() => handleLookupByCode(lookupCode)}
                    className="btn btn-outline-primary me-2 mt-0"
                    data-bs-toggle="modal" data-bs-target="#prints-barcode-by-code">
                    Lookup Barcode
                  </a>
                </div> */}

                {selectedProduct && (selectedProduct.itemBarcode || product.barcode) ? (
                  <a onClick={() => handlePreview(selectedProduct._id)}
                    className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal" data-bs-target="#prints-barcode">
                    <span><TbEye className="fas fa-eye me-1" /></span>Preview Barcode
                  </a>
                ) : (
                  <a onClick={() => {
                    setIsFormOpen(true);
                    generateBarcode();
                  }}
                    disabled={!selectedProduct} className="btn btn-submit btn-primary me-2 mt-0" data-bs-toggle="modal" data-bs-target="#prints-barcode">
                    <span><TbEye className="fas fa-eye me-1" /></span>Generate Barcode
                  </a>
                )}
                <a onClick={closeForm} className="btn btn-cancel btn-secondary fs-13 me-2">
                  <span><i className="fas fa-power-off me-1" /></span>Clear
                </a>
              </div>
            </div>
          </div>

          {/* Show Barcode SVG */}
          {isFormOpen && (
            <div className="modal fade" id="prints-barcode" style={{ backgroundColor: 'rgba(199, 197, 197, 0.4)', backdropFilter: 'blur(1px)', }}>
              <div className="modal-dialog modal-dialog-centered stock-adjust-modal barcode-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="page-title">
                      <h4>Barcode</h4>
                    </div>
                    <button type="button" className="close bg-danger text-white fs-16 shadow-none" data-bs-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body pb-0">
                    <div className="d-flex justify-content-end">
                      <a onClick={handleDownloadPDF} className="btn btn-cancel close-btn btn-danger shadow-none me-2">
                        <span><FaFilePdf className="fas fa-print me-2" /></span>
                      </a>
                      <a onClick={handlePrint} className="btn btn-cancel close-btn btn-danger shadow-none">
                        <span><IoPrint className="fas fa-print me-2" /></span>
                        Print Barcode</a>
                    </div>

                    <div ref={printRef} className="row mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {/* Show fetched product details for preview: name, price, unit, available qty */}
                      {product.productName && (
                        <div style={{ width: '100%', marginBottom: '8px' }}>
                          <strong>{product.productName}</strong>
                          <div style={{ fontSize: '14px', color: '#444' }}>
                            {product.price != null && <span style={{ marginRight: '12px' }}>Price: ₹{Number(product.price).toFixed(2)}</span>}
                            {product.unit && <span style={{ marginRight: '12px' }}>Unit: {product.unit}</span>}
                            {selectedProduct?.availableQty != null && <span>Available: {selectedProduct.availableQty}</span>}
                            {selectedProduct?.itemBarcode != null && <span>barcode: {selectedProduct.itemBarcode}</span>}
                          </div>
                        </div>
                      )}
                      {Array.from({ length: numberOfBarcodes || 1 }).map((_, index) => (
                        <div className="col-sm-4" style={{
                          width: 'calc(33.333% - 7px)',
                          display: 'inline-block',
                          verticalAlign: 'top',
                          boxSizing: 'border-box',

                        }}>
                          <div className="barcode-scanner-link text-center" style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            backgroundColor: '#fff',
                            margin: '5px 0',
                            width: '90%',
                            height: '200px',
                          }}>
                            {product.showProductName && product.productName && (
                              <h6>{product.productName}</h6>
                            )}

                            {product.showPrice && product.price && (
                              <p>Price: ₹{product.price}</p>

                            )}
                            {product.showExpiryDate && product.expiryDate && (
                              <p>Expiry: {new Date(product.expiryDate).toLocaleDateString()}</p>
                            )}
                            {product.barcode && (
                              <svg id={`barcode-svg-${index}`}></svg>
                            )}
                          </div>
                        </div>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Lookup-by-barcode modal (separate from prints-barcode) */}
          {isLookupOpen && (
            <div className="modal fade show" id="prints-barcode-by-code" style={{ display: 'block', backgroundColor: 'rgba(199, 197, 197, 0.4)', backdropFilter: 'blur(1px)' }}>
              <div className="modal-dialog modal-dialog-centered stock-adjust-modal barcode-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="page-title">
                      <h4>Lookup Barcode</h4>
                    </div>
                    <button type="button" className="close bg-danger text-white fs-16 shadow-none" onClick={() => { setIsLookupOpen(false); }} aria-label="Close">
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body pb-0">
                    <div ref={printRef} className="row mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {product.productName && (
                        <div style={{ width: '100%', marginBottom: '8px' }}>
                          <strong>{product.productName}</strong>
                          <div style={{ fontSize: '14px', color: '#444' }}>
                            {product.price != null && <span style={{ marginRight: '12px' }}>Price: ₹{Number(product.price).toFixed(2)}</span>}
                            {product.unit && <span style={{ marginRight: '12px' }}>Unit: {product.unit}</span>}
                            {selectedProduct?.availableQty != null && <span>Available: {selectedProduct.availableQty}</span>}
                            {selectedProduct?.itemBarcode != null && <span> Barcode: {selectedProduct.itemBarcode}</span>}
                          </div>
                        </div>
                      )}

                      <div className="col-sm-12" style={{ width: '100%', display: 'inline-block' }}>
                        <div className="barcode-scanner-link text-center" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff', margin: '5px 0' }}>
                          {/* small visible camera preview for scanning */}
                          <div style={{ marginBottom: '8px' }}>
                            <video id="barcode-lookup-video" ref={lookupVideoRef} style={{ width: 240, height: 160, borderRadius: 6, background: '#000' }} autoPlay muted playsInline />
                          </div>
                          {product.barcode && (
                            <svg id={`barcode-lookup-svg`}></svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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