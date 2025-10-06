
// import React, { useEffect, useState } from "react";
// import {
//   ComposedChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
//   Line,
//   ResponsiveContainer,
// } from "recharts";
// import axios from "axios";

// import BASE_URL from "../../../pages/config/config";
// const SalesGraph = ({ token }) => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Internal Filters
//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");
//   const [product, setProduct] = useState("");
//   const [productsList, setProductsList] = useState([]);

//   // 🔹 Fetch available products (for dropdown)
// //   const fetchProducts = async () => {
// //     try {
// //       const res = await axios.get(`${BASE_URL}/api/products`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setProductsList(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching products", err);
// //     }
// //   };

// const fetchProducts = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/api/products`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // ✅ Check structure and safely set
//     if (Array.isArray(res.data)) {
//       setProductsList(res.data);
//     } else if (Array.isArray(res.data.products)) {
//       setProductsList(res.data.products);
//     } else {
//       setProductsList([]);
//     }
//   } catch (err) {
//     console.error("Error fetching products", err);
//     setProductsList([]);
//   }
// };


//   const fetchSales = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_URL}/api/sales`, {
//         params: { month, year, product },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // ✅ Group sales by product
//       const grouped = {};
//       res.data.sales.forEach((sale) => {
//         sale.products.forEach((p) => {
//           if (!grouped[p.productName]) {
//             grouped[p.productName] = { sales: 0, cost: 0, profit: 0 };
//           }
//           const sales = p.quantity * p.price;
//           const cost = p.quantity * (p.cost || p.price * 0.6); // fallback
//           const profit = sales - cost;

//           grouped[p.productName].sales += sales;
//           grouped[p.productName].cost += cost;
//           grouped[p.productName].profit += profit;
//         });
//       });

//       const data = Object.keys(grouped).map((name) => ({
//         product: name,
//         sales: grouped[name].sales,
//         cost: grouped[name].cost,
//         profit: grouped[name].profit,
//       }));

//       setChartData(data);
//     } catch (err) {
//       console.error("Error fetching sales", err);
//       setChartData([]);
//     }
//     setLoading(false);
//   };
  

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     fetchSales();
//   }, [month, year, product]);

//   return (
//     <div className="card p-3">
//       <h5>📊 Sales vs Cost vs Profit</h5>

//       {/* 🔹 Filters Row */}
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label>Month</label>
//           <select
//             className="form-select"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="1">January</option>
//             <option value="2">February</option>
//             <option value="3">March</option>
//             <option value="4">April</option>
//             <option value="5">May</option>
//             <option value="6">June</option>
//             <option value="7">July</option>
//             <option value="8">August</option>
//             <option value="9">September</option>
//             <option value="10">October</option>
//             <option value="11">November</option>
//             <option value="12">December</option>
//           </select>
//         </div>

//         <div className="col-md-4">
//           <label>Year</label>
//           <select
//             className="form-select"
//             value={year}
//             onChange={(e) => setYear(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="2023">2023</option>
//             <option value="2024">2024</option>
//             <option value="2025">2025</option>
//           </select>
//         </div>

//         <div className="col-md-4">
//           <label>Product</label>
//           {/* <select
//             className="form-select"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//           >
//             <option value="">All Products</option>
//             {productsList.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.productName}
//               </option>
//             ))}
//           </select> */}
//           <select
//   className="form-select"
//   value={product}
//   onChange={(e) => setProduct(e.target.value)}
// >
//   <option value="">All Products</option>
//   {Array.isArray(productsList) &&
//     productsList.map((p) => (
//       <option key={p._id} value={p._id}>
//         {p.productName}
//       </option>
//     ))}
// </select>
//         </div>
//       </div>

//       {/* 🔹 Chart */}
//       <div style={{ width: "100%", height: 400 }}>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <ResponsiveContainer>
//             <ComposedChart
//               data={chartData}
//               margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="product" angle={-30} textAnchor="end" interval={0} />
//               <YAxis yAxisId="left" label={{ value: "Sales/Cost", angle: -90, position: "insideLeft" }} />
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 label={{ value: "Profit", angle: -90, position: "insideRight" }}
//               />
//               <Tooltip />
//               <Legend />
//               <Bar yAxisId="left" dataKey="sales" fill="#a17c00" name="Sales" />
//               <Bar yAxisId="left" dataKey="cost" fill="#00bfff" name="Cost" />
//               <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#333" name="Profit" />
//             </ComposedChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesGraph;




import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import BASE_URL from "../../../pages/config/config";


const SalesGraph = ({ token, filterStatus, filterPaymentStatus, fromDate, toDate, sortBy }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      let startDate = "";
      let endDate = "";
      let sort = "";

      if (sortBy === "Recently Added") {
        const now = new Date();
        endDate = now.toISOString().slice(0, 10);
        const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
        startDate = fiveDaysAgo.toISOString().slice(0, 10);
      } else if (sortBy === "Ascending") {
        sort = "asc";
      } else if (sortBy === "Desending") {
        sort = "desc";
      }

      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: {
          status: filterStatus,
          paymentStatus: filterPaymentStatus,
          startDate,
          endDate,
          fromDate,
          toDate,
          sort,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Group sales by product
      const grouped = {};
      res.data.sales.forEach((sale) => {
        sale.products.forEach((p) => {
          if (!grouped[p.productName]) {
            grouped[p.productName] = 0;
          }
          grouped[p.productName] += p.quantity; // change to (p.quantity * p.price) for revenue
        });
      });

      const data = Object.keys(grouped).map((name) => ({
        product: name,
        quantity: grouped[name],
      }));

      setChartData(data);
    } catch (err) {
      console.error("Error fetching sales", err);
      setChartData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, [filterStatus, filterPaymentStatus, fromDate, toDate, sortBy]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" angle={-30} textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesGraph;

