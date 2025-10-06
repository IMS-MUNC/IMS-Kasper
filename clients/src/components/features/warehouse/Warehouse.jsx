import React, { useCallback, useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { PiWarehouseFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import BASE_URL from "../../../pages/config/config";
import Polygon from "../../../assets/images/Polygon-2.png";
import Poly from "../../../assets/images/Polygon-1.png";
import Polygont from "../../../assets/images/Polygon3.png";
import Polygo from "../../../assets/images/Polygon4.png";
import AddWarehouseModal from "../../../pages/Modal/warehouse/AddWarehouseModal";
import axios from "axios";

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const token = localStorage.getItem("token");
  // const toggleFavourite = (warehouse) => {
  //   setFavourites((prev) => {
  //     const exists = prev.find((fav) => fav._id === warehouse._id);
  //     if (exists) {
  //       return prev.filter((fav) => fav._id !== warehouse._id);
  //     } else {
  //       return [...prev, warehouse];
  //     }
  //   });
  // };

  const toggleFavourite = async (warehouse) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/warehouse/${warehouse._id}/toggle-favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWarehouses((prev) =>
        prev.map((wh) =>
          wh._id === warehouse._id
            ? { ...wh, isFavorite: response.data.warehouse.isFavorite }
            : wh
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // <- endpoint

      setWarehouses(res.data.data.reverse());
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Defensive: support both res.data.products and res.data (array)
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(res.data.sales);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setSales([]);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
    fetchSales();
  }, [fetchWarehouses, fetchProducts, fetchSales]);

  const salesMap = sales.reduce((acc, sale) => {
    if (!sale.products || !Array.isArray(sale.products)) return acc;
    sale.products.forEach((p) => {
      if (!p || !p.productId) return;
      const pid =
        typeof p.productId === "object" ? p.productId._id : p.productId;
      if (!pid) return;
      if (!acc[pid]) acc[pid] = 0;
      acc[pid] += p.saleQty || 0;
    });
    return acc;
  }, {});
  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Warehouse header */}
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
            }}
          >
            <span>Warehouse</span>
            <span>
              <MdArrowForwardIos style={{ color: "#b0afafff" }} />
            </span>
            <span style={{fontWeight:'600', color:'black'}}>All Warehouse </span>
          </div>

          {/* Add Warehouse */}

          <Link to="/AddWarehouse">
            <button
              style={{
                border: "1px solid #1450AE",
                backgroundColor: "#1368EC",
                color: "white",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              Add Warehouse
            </button>
          </Link>
        </div>

        {/* Recently Accessed */}
        <div
          style={{
            fontWeight: "500",
            fontSize: "16px",
            color: "#262626",
            marginTop: "20px",
          }}
        >
          <span>Recently Accessed</span>

          {/* Cards */}

          <div
            style={{
              fontWeight: "500",
              fontSize: "16px",
              color: "#262626",
              marginTop: "10px",
              paddingBottom: "4px",
            }}
          >
            {/* Cards */}

            <div style={{ marginTop: "2px" }}>
              <div className="row">
                {console.log("wre", warehouses)}
                {warehouses.map((item) => {
                  const filteredProducts = products.filter(
                    (p) => p.warehouseName === item.warehouseName
                  );
                  const totalStockValue = filteredProducts.reduce(
                    (sum, item) => {
                      const quantity = Number(item.quantity) || 0;
                      const sellingPrice = Number(item.sellingPrice) || 0;
                      return sum + quantity * sellingPrice;
                    },
                    0
                  );

                  return (
                    <div className="col-3" key={item._id}>
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "10px",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "30px",
                          height: "150px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={Polygon}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "auto",
                            top: "auto",
                            right: "0",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Poly}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "auto",
                            top: "auto",
                            right: "0",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Polygont}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "auto",
                            left: "0",
                            top: "0",
                            right: "auto",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Polygo}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "auto",
                            left: "0",
                            top: "0",
                            right: "auto",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        {/* WH-006 and Heart - Left Side */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: "10px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Left: WH-006 */}
                          <div
                            style={{
                              backgroundColor: "#fff",
                              border: "1px solid #e6e6e6",
                              borderRadius: "8px",
                              padding: "10px ",
                              alignItems: "center",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <span>
                              <PiWarehouseFill
                                style={{
                                  color: "#1368EC",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              />
                              <Link to={`/WarehouseDetails/${item._id}`}>
                              {item.warehouseName}
                              </Link>
                            </span>
                          </div>

                          {/* Right: Heart icon */}
                          <div
                            style={{
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                              borderRadius: "8px",
                              width: "fit-content",
                            }}
                          >
                            <FaHeart
                              onClick={() => toggleFavourite(item)}
                              style={{
                                cursor: "pointer",
                                // color: favourites.some(
                                //   (fav) => fav._id === item._id
                                // )
                                //   ? "red"
                                //   : "#1368EC",
                                // fontWeight: "500",
                                // fontSize: "26px",
                                color: item.isFavorite ? "red" : "#1368EC",
                                fontWeight: "500",
                                fontSize: "26px",
                              }}
                            />
                          </div>
                        </div>

                        {/* Bottom Section (Address + Arrow) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            right: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          {/* Address */}
                          <div>
                            <p style={{ margin: "0", fontWeight: "500" }}>
                              {/* Delhi - Ram Prashad */}
                              {item?.city}
                              &nbsp;-&nbsp;{item?.warehouseOwner}
                              {/* {item?.contactPerson?.lastName} */}
                            </p>
                            <span style={{ color: "#1368EC" }}>
                              ₹{totalStockValue.toLocaleString("en-IN")}
                            </span>
                            <span style={{ marginLeft: "4px", fontSize: "16px", color: "#676767" }}>
                              Stock Valuation
                            </span>
                          </div>

                          {/* Arrow */}
                          <div>
                            <Link to={`/WarehouseDetails/${item._id}`}>
                              <FaArrowRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* favrouite */}

        <div
          style={{
            fontWeight: "500",
            fontSize: "16px",
            color: "#262626",
            marginTop: "10px",
            paddingBottom: "4px",
          }}
        >
          <span>Favourite</span>
          {/* hwkbf */}

          <div style={{ marginTop: "2px" }}>
            <div className="row">
              {warehouses
                .filter((item) => item.isFavorite)
                .map((fav) => {
                  const filteredProducts = products.filter(
                    (p) => p.warehouseName === fav.warehouseName
                  );
                  const totalStockValue = filteredProducts.reduce(
                    (sum, item) => {
                      const quantity = Number(item.quantity) || 0;
                      const sellingPrice = Number(item.sellingPrice) || 0;
                      return sum + quantity * sellingPrice;
                    },
                    0
                  );

                  return (
                    <div className="col-3" key={fav._id}>
                      
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "10px",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          height: "150px",
                          position: "relative",
                        }}
                      >
                        
                        <img
                          src={Polygon}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "auto",
                            top: "auto",
                            right: "0",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Poly}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "auto",
                            top: "auto",
                            right: "0",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Polygont}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "auto",
                            left: "0",
                            top: "0",
                            right: "auto",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />

                        <img
                          src={Polygo}
                          alt="Polygon"
                          style={{
                            position: "absolute",
                            bottom: "auto",
                            left: "0",
                            top: "0",
                            right: "auto",
                            width: "100%",
                            height: "50px",
                            zIndex: "0",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#f1f1f1",
                              border: "1px solid #e6e6e6",
                              borderRadius: "8px",
                              padding: "10px",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              <PiWarehouseFill
                                style={{
                                  color: "#1368EC",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              />
                              <Link to={`/WarehouseDetails/${fav._id}`}>
                              {fav.warehouseName}
                              </Link>
                            </span>
                          </div>
                          <div
                            style={{
                              padding: "10px",
                              backgroundColor: "#f1f1f1",
                              borderRadius: "8px",
                              width: "fit-content",
                            }}
                          >
                            <FaHeart
                              onClick={() => toggleFavourite(fav)}
                              style={{
                                cursor: "pointer",
                                color: "red",
                                fontWeight: "500",
                                fontSize: "26px",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            right: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <div>
                            <p style={{ margin: "0", fontWeight: "500" }}>
                              {fav.city} - {fav.warehouseOwner}
                            </p>
                            <span style={{ color: "#1368EC" }}>
                              ₹{totalStockValue.toLocaleString("en-IN")}
                            </span>
                            <span style={{ marginLeft: "4px", fontSize: "16px", color: "#676767" }}>
                              Stock Valuation
                            </span>
                          </div>
                          <div>
                            <Link to={`/WarehouseDetails/${fav._id}`}>
                              <FaArrowRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {warehouses.filter((item) => item.isFavorite).length === 0 && (
                <p>No favourites yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Owened Warehouse */}
 
        {/* <div
          style={{
            fontWeight: "500",
            fontSize: "16px",
            color: "#262626",
            marginTop: "10px",
            paddingBottom: "4px",
          }}
        >
          <span>Owened</span>

        

          <div style={{ marginTop: "2px" }}>
            <div className="row">
              <div className="col-3">
                <div
                  style={{
                    backgroundColor: "rgb(255 255 255)",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "150px",
                    position: "relative", // for absolute positioning inside
                  }}
                >
                  
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: "10px",
                    }}
                  >
                    
                    <div
                      style={{
                        backgroundColor: "#f1f1f1",
                        border: "1px solid #e6e6e6",
                        borderRadius: "8px",
                        padding: "10px ",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <PiWarehouseFill
                          style={{
                            color: "#1368EC",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        />{" "}
                        WH-001
                      </span>
                    </div>

                  
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "8px",
                        width: "fit-content",
                      }}
                    >
                      <FaHeart
                        style={{
                          color: "#1368EC",
                          fontWeight: "500",
                          fontSize: "26px",
                        }}
                      />
                    </div>
                  </div>

                  
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      right: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    
                    <div>
                      <p style={{ margin: "0", fontWeight: "500" }}>
                        Noida - Suraj Kumar
                      </p>
                      <span style={{ color: "#1368EC" }}>$76,986 </span>
                      <span style={{ marginLeft: "4px" }}>Stock Valuation</span>
                    </div>

                    
                    <div>
                      <Link to="/WarehouseDetails">
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div> */}

      
{/* 
        <div
          style={{
            fontWeight: "500",
            fontSize: "16px",
            color: "#262626",
            marginTop: "10px",
            paddingBottom: "4px",
          }}
        >
          <span>Third-Party warehouse</span>

        

          <div style={{ marginTop: "2px" }}>
            <div className="row">
              <div className="col-3">
                <div
                  style={{
                    backgroundColor: "rgb(255 255 255)",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "150px", // Set a fixed or min height
                    position: "relative", // for absolute positioning inside
                  }}
                >
                  
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      marginBottom: "10px",
                    }}
                  >
                    
                    <div
                      style={{
                        backgroundColor: "#f1f1f1",
                        border: "1px solid #e6e6e6",
                        borderRadius: "8px",
                        padding: "10px ",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <PiWarehouseFill
                          style={{
                            color: "#1368EC",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        />{" "}
                        Warehouse Delhi
                      </span>
                    </div>

                    
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "8px",
                        width: "fit-content",
                      }}
                    >
                      <FaHeart
                        style={{
                          color: "#1368EC",
                          fontWeight: "500",
                          fontSize: "26px",
                        }}
                      />
                    </div>
                  </div>

                  
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      right: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    
                    <div>
                      <p style={{ margin: "0", fontWeight: "500" }}>
                        Delhi - Ram Prashad
                      </p>
                      <span style={{ color: "#1368EC" }}>$76,986 </span>
                      <span style={{ marginLeft: "4px" }}>Stock Valuation</span>
                    </div>

                    
                    <div>
                      <Link to="/WarehouseDetails">
                        <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>  */}
        
      </div>
    </div>
  );
}

export default Warehouse;
