import React, { useState, useCallback, useEffect, useRef } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import {
  FaSearch,
  FaArrowRight,
  FaAngleLeft,
  FaChevronRight,
} from "react-icons/fa";


import { IoFilter } from 'react-icons/io5';
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import { RiArrowUpDownLine } from "react-icons/ri";
// import "./Godown.css";
import Popup from "./popup";
import { Link, useParams } from "react-router-dom";

import BASE_URL from "../../../pages/config/config";
import axios from "axios";

function Godown() {
  const { id } = useParams();
  const [warehouses, setWarehouses] = useState([]);
  const [zones, setZones] = useState([]);
  const [warehousesDetails, setWarehousesDetails] = useState(null); // State for warehouse details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedproduct, setSelectedProduct] = useState(null);

  const [selectedItem, setSelectedItem] = useState({ zone: "", grid: "" });
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCellFilter, setSelectedCellFilter] = useState(''); // For cell filtering in table

  // Blocks data structure from warehouse database
  const [blocks, setBlocks] = useState([]);

  // Fetch warehouse details including blocks data
  const fetchWarehouseDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/warehouse/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Warehouse Details:", res.data.warehouse);

      setWarehousesDetails(res.data.warehouse);
      // Set blocks data from warehouse response
      if (res.data.warehouse.blocks) {
        setBlocks(res.data.warehouse.blocks);
      }
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Dummy data for the product table
  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/api/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // <- endpoint
      // console.log("Warehouseserer:", res.data.data);

      setWarehouses(res.data.data); // backend: { success, data }
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchWarehouseDetails(); // Fetch warehouse details when component mounts
  }, [fetchWarehouses, fetchWarehouseDetails]);

  //Grid
  const [grid, setGrid] = useState([]);
  useEffect(() => {
    if (warehousesDetails?.layout?.zones) {
      const zoneCount = Number(warehousesDetails?.layout?.zones || 0);
      const zoneArray = Array.from(
        { length: zoneCount },
        (_, i) => `Zone ${i + 1}`
      );
      setZones(zoneArray);
    } else {
      setZones([]);
    }
  }, [warehousesDetails]);

  const [popup, setPopup] = useState(false);
  const formRef = useRef(null);
  const handlePopup = (cell, zone) => {
    try {
      // console.log('handlePopup called with:', { cell, zone, currentPopupState: popup });
      
      // Safety checks for cell and zone parameters
      if (!cell || !zone) {
        console.error('Invalid cell or zone data:', { cell, zone });
        return;
      }
      
      const cellName = cell.name || cell;
      // console.log('Setting selectedItem to:', { zone: zone, grid: cellName });
      
      setSelectedItem({ zone: zone, grid: cellName });
      setSearchQuery(''); // Clear search query when opening popup
      setShowDropdown(false); // Hide dropdown when opening popup
      setPopup(!popup);
      
      // console.log('handlePopup completed successfully');
    } catch (error) {
      console.error('Error in handlePopup:', error);
    }
  }
  const closeForm = () => {
    setPopup(false);
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


  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [activeTabs, setActiveTabs] = useState({});
  const [stagedProducts, setStagedProducts] = useState([]); // Staging area for products before assignment

  // Search functionality
  const [product, setProducts] = useState([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch products filtered by warehouse ID
        // console.log("Fetching products for warehouse ID:", id); // Debug log
        const res = await axios.get(`${BASE_URL}/api/products?warehouse=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("API Response:", res.data); // Debug log
        // console.log("Products array:", res.data.products); // Debug log
        const products = res.data.products || res.data; // Handle both response formats
        setProducts(products);
        setAllProducts(products); // Store all products
        if (products.length > 0) {
        }
        // Initialize all to "general"
        const initialTabs = products.reduce((acc, product) => {
          acc[product._id] = "general";
          return acc;
        }, {});
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [id]);

  // Product search functionality
  const handleProductSearch = (query) => {
    // console.log("Search query:", query); // Debug log
    // console.log("All products:", allProducts); // Debug log
    setSearchQuery(query);
    setProductSearchQuery(query);

    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter((product) => {
      return (

        product.productName?.toLowerCase().includes(searchTerm) ||
        (product.brand &&
          typeof product.brand === "object" &&
          product.brand.name?.toLowerCase().includes(searchTerm)) ||
        (product.brand &&
          typeof product.brand === "string" &&
          product.brand.toLowerCase().includes(searchTerm)) ||
        product.seoTitle?.toLowerCase().includes(searchTerm) ||
        product.seoDescription?.toLowerCase().includes(searchTerm) ||
        (product.category &&
          typeof product.category === "object" &&
          product.category.name?.toLowerCase().includes(searchTerm)) ||
        (product.category &&
          typeof product.category === "string" &&
          product.category.toLowerCase().includes(searchTerm)) ||
        (product.subcategory &&
          typeof product.subcategory === "object" &&
          product.subcategory.name?.toLowerCase().includes(searchTerm)) ||
        (product.subcategory &&
          typeof product.subcategory === "string" &&
          product.subcategory.toLowerCase().includes(searchTerm))
      );
    });

    // console.log("Filtered products:", filteredProducts); // Debug log
    setProducts(filteredProducts);
    setSearchResults(filteredProducts);  // ✅ update dropdown
    setShowDropdown(true);
    // console.log("Dropdown should show:", true, "Results count:", filteredProducts.length); // Debug log
  };

  // Function to get assigned products for the selected cell
  const getAssignedProducts = () => {
    try {
      // console.log('getAssignedProducts called with selectedItem:', selectedItem);
      // console.log('blocks data:', blocks);
      
      // Safety checks for all required data
      if (!selectedItem || !selectedItem.zone || !selectedItem.grid) {
        // console.log('Missing selectedItem data, returning empty array');
        return [];
      }
      
      if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        // console.log('Missing or invalid blocks data, returning empty array');
        return [];
      }

      const zoneData = blocks.find(block => block && block.zone === selectedItem.zone);
      // console.log('Found zoneData:', zoneData);
      if (!zoneData) {
        console.log('No zone data found, returning empty array');
        return [];
      }

      const cellData = zoneData.cells?.find(cell => cell && cell.name === selectedItem.grid);
      // console.log('Found cellData:', cellData);
      if (!cellData) {
        // console.log('No cell data found, returning empty array');
        return [];
      }

      // Get items array (which contains only productId)
      const items = Array.isArray(cellData.items) ? cellData.items : [];
      // console.log('Raw items from cell:', items);
      
      // Check if items already have full product details (new format)
      // or need to be enriched from the products array (legacy format)
      const enrichedItems = items.map((item, index) => {
        // If item already has productName and sku, it's the new enhanced format
        if (item.productName && item.sku) {
          return {
            ...item,
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            barcode: item.barcode || `BARCODE-${item.productId}`,
            quantity: item.quantity || 1
          };
        }
        
        // Legacy format - need to lookup product details
        const productId = item.productId || item._id || item;
        const fullProduct = product.find(p => p._id === productId);
        
        if (fullProduct) {
          return {
            ...fullProduct,
            productId: fullProduct._id,
            productName: fullProduct.productName,
            sku: fullProduct.sku,
            barcode: fullProduct.barcode || `BARCODE-${fullProduct._id}`,
            quantity: item.quantity || 1
          };
        } else {
          // Fallback if product not found
          return {
            productId: productId,
            productName: 'Unknown Product',
            sku: 'N/A',
            barcode: `BARCODE-${productId}`,
            quantity: item.quantity || 1
          };
        }
      });
      
      // console.log('Enriched items:', enrichedItems);
      return enrichedItems;
    } catch (error) {
      console.error('Error in getAssignedProducts:', error);
      return [];
    }
  };

  // Component to display staged products
  const StagedProductsDisplay = () => {
    if (!stagedProducts || stagedProducts.length === 0) {
      return null;
    }

    return (
      <div style={{ marginBottom: "20px" }}>
        
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {stagedProducts.map((item, index) => {
            const productName = String(item.productName || item.name || "Product Name");
            const sku = String(item.sku || item.productId || "N/A");
            const quantity = String(item.quantity || 1);
            const targetLocation = item.targetZone && item.targetGrid 
              ? `${item.targetZone}-${item.targetGrid}` 
              : "General Warehouse";
            
            return (
              <div
                key={index}
                style={{
                  padding: "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  backgroundColor: "#fff9c4", // Light yellow to indicate staging
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", color: "#262626", marginBottom: "4px" }}>
                    {productName}
                  </div>
                  <div style={{ fontSize: "14px", color: "#676767" }}>
                    SKU: {sku} | Target: {targetLocation}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <label style={{ fontSize: "14px", color: "#262626" }}>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        setStagedProducts(prev => 
                          prev.map((product, idx) => 
                            idx === index ? { ...product, quantity: newQuantity } : product
                          )
                        );
                      }}
                      style={{
                        width: "60px",
                        padding: "4px 6px",
                        border: "1px solid #d0d0d0",
                        borderRadius: "4px",
                        fontSize: "14px",
                        textAlign: "center"
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(item, true)}
                    style={{
                      backgroundColor: "#ff4757",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component to display assigned products
  const AssignedProductsDisplay = () => {
    try {
      // console.log('AssignedProductsDisplay rendering...');
      const assignedProducts = getAssignedProducts();
      
      // Only show "no products" message if there are no assigned products AND no staged products
      if ((!assignedProducts || assignedProducts.length === 0) && (!stagedProducts || stagedProducts.length === 0)) {
        return (
          <p style={{ color: "#676767", margin: "20px 0" }}>
            You haven't added any products yet.
            <br /> Use <span style={{ color: "#177ecc" }}>
              browse
            </span> or <span style={{ color: "#177ecc" }}>search</span> to
            get started.
          </p>
        );
      }

      // If there are no assigned products but there are staged products, show a different message
      // if (!assignedProducts || assignedProducts.length === 0) {
      //   return (
      //     <div>
      //       <h3 style={{ color: "#262626", margin: "10px 0", fontSize: "18px", fontWeight: "600" }}>
      //         Assigned Products (0)
      //       </h3>
      //       <p style={{ color: "#676767", margin: "10px 0", fontSize: "14px" }}>
      //         No products assigned yet. Click "Done" to assign staged products.
      //       </p>
      //     </div>
      //   );
      // }

      return (
        <div>
          <h3 style={{ color: "#262626", margin: "10px 0", fontSize: "18px", fontWeight: "600" }}>
            Assigned Products ({assignedProducts.length})
          </h3>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {assignedProducts.map((item, index) => {
            // Debug: Log the exact structure of each item
            // console.log(`Assigned product ${index}:`, item);
            
            return (
              <div
                key={index}
                style={{
                  padding: "12px",
                  margin: "8px 0",
                  border: "1px solid #E1E1E1",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", color: "#262626", fontSize: "16px", marginBottom: "4px" }}>
                      {item.productName || "Unknown Product"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                      <strong>SKU:</strong> {item.sku || "N/A"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                      <strong>Quantity:</strong> {item.quantity || 1}
                    </div>
                    {item.barcode && (
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        <strong>Barcode:</strong> {item.barcode}
                      </div>
                    )}
                  </div>
                    <div style={{ marginLeft: "12px" }}>
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                        onClick={() => handleRemoveProduct(item, false)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering assigned products:', error);
      return (
        <p style={{ color: "#dc3545", margin: "20px 0" }}>
          Error loading assigned products. Please try again.
        </p>
      );
    }
  };

  const handleSelectedProduct = (selectedProduct) => {
    try {
      setSelectedProduct(selectedProduct);
      setSearchQuery(''); // Clear search after selection
      setShowDropdown(false);
      
      // Add product to staging area instead of immediate assignment
      setStagedProducts(prevStaged => {
        const existingProduct = prevStaged.find(p => p._id === selectedProduct._id);
        if (existingProduct) {
          // Product already staged, don't add duplicate
          return prevStaged;
        }
        return [...prevStaged, {
          ...selectedProduct,
          targetZone: selectedItem.zone || null,
          targetGrid: selectedItem.grid || null,
          quantity: 1 // Default quantity
        }];
      });
      
      // console.log("Product added to staging area:", selectedProduct.productName);
      
    } catch (error) {
      console.error("Error adding product to staging area:", error);
    }
  };

  // Handle assignment of staged products when Done button is clicked
  const handleDoneAssignment = async () => {
    try {
      const token = localStorage.getItem("token");
      
      for (const stagedProduct of stagedProducts) {
        // Check if a specific cell is targeted for assignment
        if (stagedProduct.targetZone && stagedProduct.targetGrid) {
          // Find the cell index based on the grid name
          const zoneData = blocks.find(block => block.zone === stagedProduct.targetZone);
          const cellIndex = zoneData?.cells.findIndex(cell => cell.name === stagedProduct.targetGrid);
          
          if (cellIndex !== -1) {
            // Assign product to the specific cell in the database with full product details
            const assignResponse = await axios.put(
              `${BASE_URL}/api/warehouse/${id}/zone/${stagedProduct.targetZone}/cell/${cellIndex}`,
              { 
                productId: stagedProduct._id,
                productName: stagedProduct.productName,
                sku: stagedProduct.sku,
                quantity: stagedProduct.quantity || 1
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (assignResponse.data.success) {
              // Update the local blocks state to reflect the assignment using server response
              const addedItem = assignResponse.data.addedItem;
              setBlocks(prevBlocks => {
                return prevBlocks.map(block => {
                  if (block.zone === stagedProduct.targetZone) {
                    return {
                      ...block,
                      cells: block.cells.map(cell => {
                        if (cell.name === stagedProduct.targetGrid) {
                          return {
                            ...cell,
                            items: [...(cell.items || []), addedItem]
                          };
                        }
                        return cell;
                      })
                    };
                  }
                  return block;
                });
              });
              
              // console.log("Product successfully assigned to cell:", stagedProduct.targetZone, stagedProduct.targetGrid);
              // console.log("Added item details:", addedItem);
            }
          }
        } else {
          // If no specific cell is targeted, add to warehouse's general product list
          const updateResponse = await axios.put(
            `${BASE_URL}/api/products/${stagedProduct._id}`,
            { warehouse: id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (updateResponse.data.success) {
            // console.log("Product successfully assigned to warehouse");
          }
        }
        
        // Add to the warehouse's general product list if not already present
        setProducts(prevProducts => {
          const existingProduct = prevProducts.find(p => p._id === stagedProduct._id);
          if (existingProduct) {
            return prevProducts;
          }
          return [...prevProducts, stagedProduct];
        });
        
        setAllProducts(prevAllProducts => {
          const existingProduct = prevAllProducts.find(p => p._id === stagedProduct._id);
          if (existingProduct) {
            return prevAllProducts;
          }
          return [...prevAllProducts, stagedProduct];
        });
      }
      
      // Clear staging area after successful assignment
      setStagedProducts([]);
      // console.log("All staged products have been assigned successfully");
      
      // Close the popup after successful assignment
      setPopup(false);
      
    } catch (error) {
      console.error("Error assigning staged products:", error);
    }
  };

  const handleCancelAssignPopup = () => {
      setPopup(false);
      setStagedProducts([]); // Clear staging area on cancel
  }

  // Handle removing products from staging area or assigned products
  const handleRemoveProduct = async (productToRemove, isStaged = false) => {
    try {
      if (isStaged) {
        // Remove from staging area
        setStagedProducts(prevStaged => 
          prevStaged.filter(product => product._id !== productToRemove._id)
        );
        // console.log("Product removed from staging area:", productToRemove.productName);
      } else {
        // Remove from assigned products (from specific cell)
        const token = localStorage.getItem("token");
        
        // For assigned products, we need to use the selectedItem context for zone and grid
        if (selectedItem && selectedItem.zone && selectedItem.grid) {
          const zoneData = blocks.find(block => block.zone === selectedItem.zone);
          const cellIndex = zoneData?.cells.findIndex(cell => cell.name === selectedItem.grid);
          
          if (cellIndex !== -1) {
            // Get the product ID - it could be in productId field or _id field
            const productId = productToRemove.productId || productToRemove._id;
            
            // console.log("=== REMOVE PRODUCT DEBUG ===");
            // console.log("Product to remove details:", productToRemove);
            // console.log("Extracted productId:", productId, "Type:", typeof productId);
            // console.log("Zone:", selectedItem.zone, "Grid:", selectedItem.grid, "CellIndex:", cellIndex);
            // console.log("Request URL:", `${BASE_URL}/api/warehouse/${id}/zone/${selectedItem.zone}/cell/${cellIndex}/remove`);
            // console.log("Request data:", { productId });
            
            // Validate that we have productId
            if (!productId) {
              console.error("Missing productId:", { productId });
              alert("Error: Missing product ID. Cannot remove product.");
              return;
            }
            
            // Remove product from the specific cell in the database using correct endpoint
            const removeResponse = await axios.delete(
              `${BASE_URL}/api/warehouse/${id}/zone/${selectedItem.zone}/cell/${cellIndex}/remove`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                data: {
                  productId: productId
                }
              }
            );
            
            // console.log("=== REMOVE RESPONSE ===");
            // console.log("Response status:", removeResponse.status);
            // console.log("Response data:", removeResponse.data);
            // console.log("Response headers:", removeResponse.headers);
            
            if (removeResponse.status === 200) {
              // console.log("✅ Product successfully removed from cell:", selectedItem.zone, selectedItem.grid);
              // console.log("Refreshing warehouse data...");
              // Refresh warehouse data from server to ensure consistency
              await fetchWarehouseDetails();
              // console.log("✅ Warehouse data refreshed");
            } else {
              console.error("❌ Failed to remove product from database:", removeResponse.data);
            }
          } else {
            console.error("Cell not found for removal");
          }
        } else {
          console.error("No selected item context for removal");
        }
      }
      
    } catch (error) {
      console.error("=== REMOVE ERROR ===");
      console.error("Error removing product:", error);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
      alert(`Error removing product: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle zone selection change
  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
  };

  // Helper function to get all stored products from the selected zone
  const getAllStoredProducts = () => {
    if (!selectedZone || !blocks) return [];
    
    const zoneData = blocks.find(block => block.zone === selectedZone);
    if (!zoneData || !zoneData.cells) return [];
    
    const allProducts = [];
    zoneData.cells.forEach(cell => {
      if (cell.items && cell.items.length > 0) {
        cell.items.forEach(item => {
          // Enrich item with full product details and fallback values
          let enrichedItem;
          
          // If item already has productName and sku, it's the new enhanced format
          if (item.productName && item.sku) {
            enrichedItem = {
              ...item,
              productId: item.productId,
              productName: item.productName,
              sku: item.sku,
              barcode: item.barcode || `BARCODE-${item.productId}`,
              quantity: item.quantity || 1,
              cellName: cell.name
            };
          } else {
            // Legacy format - need to lookup product details
            const productId = item.productId || item._id || item;
            const fullProduct = product.find(p => p._id === productId);
            
            if (fullProduct) {
              enrichedItem = {
                ...fullProduct,
                productId: fullProduct._id,
                productName: fullProduct.productName,
                sku: fullProduct.sku,
                barcode: fullProduct.barcode || `BARCODE-${fullProduct._id}`,
                quantity: item.quantity || 1,
                cellName: cell.name
              };
            } else {
              // Fallback if product not found
              enrichedItem = {
                productId: productId,
                productName: 'Unknown Product',
                sku: 'N/A',
                barcode: `BARCODE-${productId}`,
                quantity: item.quantity || 1,
                cellName: cell.name
              };
            }
          }
          
          allProducts.push(enrichedItem);
        });
      }
    });
    
    return allProducts;
  };

  // Helper function to get all available cells in the selected zone
  const getAvailableCells = () => {
    if (!selectedZone || !blocks) return [];
    
    const zoneData = blocks.find(block => block.zone === selectedZone);
    if (!zoneData || !zoneData.cells) return [];
    
    return zoneData.cells.map(cell => cell.name).sort((a, b) => {
      // Convert to numbers for proper numerical sorting
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      
      // If both are valid numbers, sort numerically
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      // If one or both are not numbers, fall back to alphabetical sorting
      return a.localeCompare(b);
    });
  };

  // Filter products based on selected cell
  const getFilteredProducts = () => {
    const allProducts = getAllStoredProducts();
    
    if (!selectedCellFilter) {
      return allProducts;
    }
    
    return allProducts.filter(product => product.cellName === selectedCellFilter);
  };


  return (
    <div className="page-wrapper">
      <div className="content">

        {/* Breadcrumb Navigation */}
        <div style={{ padding: "20px", overflowY: "auto", height: "88vh" }}>

          {/* header : links */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "#676767",
                display: "flex",
                gap: "16px",
                fontWeight: "500",
                alignItems: "center",
              }}
            >
              <span>Warehouses</span>
              <MdArrowForwardIos style={{ color: "#b0afafff" }} />
              <Link
                style={{ color: "#676767", textDecoration: "none" }}
                to={"/Warehouse"}
              >
                All Warehouse
              </Link>
              <MdArrowForwardIos style={{ color: "#b0afafff" }} />
              <Link
                style={{ color: "#676767", textDecoration: "none" }}
                to={"/WarehouseDetails/" + warehousesDetails?._id}
              >
                {warehousesDetails?.warehouseName}
              </Link>
              <MdArrowForwardIos style={{ color: "#b0afafff" }} />
              <span
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#262626",
                }}
              >
                Godown
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: "9px",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                backgroundColor: "white",
                width: "80%",
                gap: "19px",
                justifyContent: "space-between",
                padding: "4px 16px",
                border: "1px solid #e6e6e6",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  padding: "4px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <FaSearch />
                <input
                  type="search"
                  placeholder="Search Items"
                  style={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "white",
                    width: "100%",
                  }}
                />
              </div>
              {/* <div
              style={{
                padding: "4px",
                border: "1px solid #f1f1f1",
                borderRadius: "4px",
              }}
            >
              <RiArrowUpDownLine />
            </div> */}
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "0px 0px",
                border: "1px solid #e6e6e6",
                borderRadius: "8px",
                width: "20%",
                
              }}
            >
              <select
                name="zone"
                value={selectedZone}
                onChange={handleZoneChange}
                style={{ border: "none", outline: "none", backgroundColor:'#fff' }}
              >
                <option
                  value=""
                  style={{
                    padding: "4px 16px",
                    color: "#676767",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  All Zones
                </option>
                {blocks.map((block, index) => (
                  <option
                    key={index}
                    value={block.zone}
                    style={{
                      padding: "4px 16px",
                      color: "#676767",
                      fontFamily: "Roboto",
                      fontWeight: "400",
                      fontSize: "16px",
                    }}
                  >
                    {block.zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone Grid */}
          {blocks.length > 0 ? (
            blocks
              .filter((block) => selectedZone === "" || block.zone === selectedZone)
              .map((block, idx) => {
                return (
                  <>
                  <div style={{display: selectedZone ? 'flex': ''}}>
                    <div key={idx} style={{width: '40%', margin: '0 auto' }}>
                      <div
                        style={{
                          margin: "0 auto",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            transform: "rotate(-0deg)",
                            backgroundColor: "#3f99e1",
                            padding: "24px",
                            color: "#FFF",
                            justifyContent: "space-between",
                            display: "flex",
                            border: "1px solid #e6e6e6",
                            borderRadius: "8px",
                            marginTop: "40px",
                            marginBottom: "20px",
                            width: selectedZone ? "100%" : "100%",
                          }}
                        >
                          <span className="invisible">hg</span>
                          <span className="zone-text">{block.zone}</span>
                          <span style={{ transform: "rotate(0deg)" }}>
                            <FaArrowRight />
                          </span>
                        </div>
                      </div>

                      <main
                        style={{
                          width: selectedZone ? "100%" : "100%",
                          margin: "0 auto",
                          display: "grid",
                          gridTemplateRows: `repeat(${warehousesDetails?.layout?.columns || 4}, 1fr)`,
                          gridTemplateColumns: `repeat(${warehousesDetails?.layout?.rows || 5}, 1fr)`,
                          gridRowGap: "10px",
                          gridColumnGap: "10px",
                          justifyContent: "space-between",
                        }}
                      >
                        {block.cells.map((cell, cellIdx) => (
                          <div
                            key={cellIdx}
                            onClick={() => handlePopup(cell, block.zone)}
                            style={{
                              border: "1px solid #e6e6e6",
                              color: "#000000",
                              borderRadius: "8px",
                              fontFamily: "Roboto",
                              fontWeight: "400",
                              fontSize: "16px",
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              cursor: "pointer",
                              backgroundColor: cell.items.length > 0 ? '#e3f3ff' : '#ffffff',
                              minHeight: "40px",
                              marginBottom: "20px",
                            }}
                          >
                            {cell.name}
                          </div>
                        ))}
                      </main>
                    </div>

                      {/* Table - Only show when a specific zone is selected */}
                      {selectedZone && selectedZone !== "" && (
                        <>
                          {/* table */}
                          <div style={{ width: '40%', margin: '0 auto', marginTop:'20px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '16px 24px',
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              border: '1px solid #e6e6e6',
                              backgroundColor: '#ffffff',
                              marginTop: '20px',
                            }}
                          >
                            <div style={{ padding: '8px', borderRadius: '4px', gap: '8px', color: '#676767', fontFamily: 'Roboto', fontWeight: '400', fontSize: '16px' }}>Assign Product </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                              <select 
                                name='cellFilter' 
                                id='cellFilter' 
                                value={selectedCellFilter}
                                onChange={(e) => setSelectedCellFilter(e.target.value)}
                                style={{ border: '1px solid #e6e6e6', padding: '8px', borderRadius: '4px', gap: '8px', color: '#676767', fontFamily: 'Roboto', fontWeight: '400', fontSize: '16px' }}
                              >
                                <option value=''>Cell: All</option>
                                {getAvailableCells().map(cellName => (
                                  <option key={cellName} value={cellName}>Cell: {cellName}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div style={{ backgroundColor: '#ffffff' }}>
                            <table
                              style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                backgroundColor: '#fff',
                                padding: '16px 24px',
                              }}
                            >
                              <thead style={{ backgroundColor: '#f1f1f1' }}>
                                <tr
                                  style={{
                                    padding: '24px',
                                    color: '#676767',
                                    fontFamily: 'Roboto',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                  }}
                                >
                                  <th style={{ padding: '10px', textAlign: 'left' }}>Product Name</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>SKU</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>QTY</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>Cell Id</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getFilteredProducts().length > 0 ? (
                                  getFilteredProducts().map((product, index) => (
                                    <tr key={`${product.cellName}-${index}`}>
                                      <td
                                        style={{
                                          padding: '10px',
                                          borderBottom: '1px solid #e6e6e6',
                                        }}
                                      >
                                        {product.productName || 'N/A'}
                                      </td>
                                      <td
                                        style={{
                                          padding: '10px',
                                          textAlign: 'center',
                                          borderBottom: '1px solid #e6e6e6',
                                        }}
                                      >
                                        {product.sku || 'N/A'}
                                      </td>
                                      <td
                                        style={{
                                          padding: '10px',
                                          textAlign: 'center',
                                          borderBottom: '1px solid #e6e6e6',
                                        }}
                                      >
                                        {product.quantity || 0}
                                      </td>
                                      <td
                                        style={{
                                          padding: '10px',
                                          textAlign: 'center',
                                          borderBottom: '1px solid #e6e6e6',
                                        }}
                                      >
                                        {product.cellName}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        borderBottom: '1px solid #e6e6e6',
                                        color: '#999',
                                        fontStyle: 'italic'
                                      }}
                                    >
                                      {selectedCellFilter ? `No products found in cell ${selectedCellFilter}` : 'No products stored in this zone'}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          </div>
                        </>
                      )}

                    </div>
                  </>
                );
              })
          ) : (
            <div></div>
          )}

          {/* popup */}
          {popup && (
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
              padding: '100px',
            }}
            >
              <div ref={formRef} style={{ width: '800px', height: '660px', margin: 'auto', marginTop: '10px', padding: '10px 16px', overflowY: 'auto', borderRadius: '8px' }}>

                {/* Search Box */}


                {/* Add New Customer Button */}
                <div
                  style={{
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    //  alignItems: 'center',
                    zIndex: "1000",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "20px",
                      borderRadius: "8px",
                      textAlign: "center",
                      width: "100%",
                      overflowY: "auto",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#1368ec",
                        color: "#fff",
                        padding: "16px 18px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ margin: "0",color:'white' }}>Assign Product</h2>

                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0px",
                          marginBottom: "20px",
                          padding: "5px 10px",
                        }}
                      >
                        
                        <span
                          style={{
                            color: "#262626",
                            fontFamily: "roboto",
                            fontWeight: "400",
                            fontSize: "16px",
                          }}
                        >
                          {selectedItem.zone}
                        </span>
                        -
                        <span
                          style={{
                            color: "#676767",
                            fontFamily: "roboto",
                            fontWeight: "400",
                            fontSize: "16px",
                            marginLeft: "20px",
                          }}
                        >
                          Cell: <span
                          style={{
                            color: "#262626",
                            fontFamily: "roboto",
                            fontWeight: "400",
                            fontSize: "16px",
                          }}
                        >
                          {selectedItem.grid}
                        </span>
                        </span>
                        
                      </div>

                      {/* search bar */}

                      {/* Search Box */}
                      <div style={{ position: "relative", marginBottom: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E1E1E1",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            padding: "6px 12px",
                          }}
                        >
                          <IoSearch
                            style={{
                              fontSize: "20px",
                              marginRight: "10px",
                              color: "#C2C2C2",
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search by name, email, or phone number..."
                            value={searchQuery}
                            onChange={(e) => handleProductSearch(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              fontSize: "16px",
                              border: "none",
                              outline: "none",
                              color: "#333",
                            }}
                          />
                        </div>

                        {/* Search Results Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              backgroundColor: "white",
                              border: "1px solid #E1E1E1",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              maxHeight: "300px",
                              overflowY: "auto",
                              zIndex: 1000,
                            }}
                          >
                            {searchResults.map((product) => (
                              <div
                                key={product._id}
                                onClick={() => handleSelectedProduct(product)} // you can replace with select handler
                                style={{ padding: "12px 16px", cursor: "pointer" }}
                              >
                                <div style={{ fontWeight: "600", textAlign: "left" }}>
                                  {product.productName || "No Name"}
                                </div>
                                <div style={{ fontSize: "14px", color: "#666" }}>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* No Results Message */}
                        {showDropdown &&
                          searchResults.length === 0 &&
                          searchQuery.trim() !== "" && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "white",
                                border: "1px solid #E1E1E1",
                                borderRadius: "8px",
                                padding: "16px",
                                textAlign: "center",
                                color: "#666",
                                zIndex: 1000,
                              }}
                            >
                              No product found matching "{searchQuery}"
                            </div>
                          )}
                      </div>

                      <div
                        style={{
                          border: "1px solid #c2c2c2",
                          color: "#ffffff",
                          borderRadius: "8px",
                          gap: "10px",
                          marginTop: "5px",
                        }}
                      >
                        <div style={{ padding: "10px 16px" }}>
                          <StagedProductsDisplay />
                          <AssignedProductsDisplay />
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "20px",
                            justifyContent: "right",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <button
                            onClick={handleCancelAssignPopup}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#6B7778",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDoneAssignment}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            bottom: "0px",
            width: "100%",
            backgroundColor: "#f7f7f7",
            padding: "10px",
            left: "1px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "5px 15px",
                  borderRadius: "5px",
                }}
              ></div>
              <span>Available</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "#e3f3ff",
                  padding: "5px 15px",
                  borderRadius: "5px",
                }}
              ></div>
              <span>Occupied</span>
            </div>
           {/* <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "#1368ec",
                  padding: "5px 15px",
                  borderRadius: "5px",
                }}
              ></div>
              <span>Selected</span>
            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Godown;
