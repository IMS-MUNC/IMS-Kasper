import React, { useState, useCallback, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

//host
import BASE_URL from "../../../pages/config/config";
import axios from "axios";

const Popup = ({ isOpen, onClose, selectedItem, zoneName = "Zone 01" }) => {
  if (!isOpen) return null;

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const [activeTabs, setActiveTabs] = useState({});

  // Search functionality
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/products`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },

        });
        setProducts(res.data);
        setAllProducts(res.data); // Store all products
        if (res.data.length > 0) {
        }
        // Initialize all to "general"
        const initialTabs = res.data.reduce((acc, product) => {
          acc[product._id] = "general";
          return acc;
        }, {});
        setActiveTabs(initialTabs);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Product search functionality
  const handleProductSearch = (query) => {
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

    setProducts(filteredProducts);
    setSearchResults(filteredProducts);  // ✅ update dropdown
  setShowDropdown(true);  
  };

  

  return (
    <div
      style={{
        position: "fixed",
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
          <h2 style={{ margin: "0" }}>Assign Product</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            <IoMdClose />
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              padding: "5px 10px",
            }}
          >
            <span
              style={{
                color: "#676767",
                fontFamily: "roboto",
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              {zoneName}
            </span>
            {/* grid name */}
            <span
              style={{
                color: "#262626",
                fontFamily: "roboto",
                fontWeight: "400",
                fontSize: "16px",
              }}
            >
              {selectedItem}
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
                    onClick={() => console.log("Selected product:", product)} // you can replace with select handler
                    style={{ padding: "12px 16px", cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: "600" }}>
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
              <p style={{ color: "#676767", margin: "20px 0" }}>
                You haven't added any products yet.
                <br /> Use <span style={{ color: "#177ecc" }}>
                  browse
                </span> or <span style={{ color: "#177ecc" }}>search</span> to
                get started.
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "20px",
                justifyContent: "right",
                display: "flex",
              }}
            >
              <button
                onClick={onClose}
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
  );
};

export default Popup;
