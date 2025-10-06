
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import BASE_URL from "../../../pages/config/config";


const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28"];

const PaymentStatusChart = ({ token, fromDate, toDate }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/sales`, {
        params: { fromDate, toDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Count by paymentStatus
      const grouped = {};
      res.data.sales.forEach((sale) => {
        if (!grouped[sale.paymentStatus]) {
          grouped[sale.paymentStatus] = 0;
        }
        grouped[sale.paymentStatus] += 1;
      });

      const data = Object.keys(grouped).map((status) => ({
        name: status,
        value: grouped[status],
      }));

      setChartData(data);
    } catch (err) {
      console.error("Error fetching payment status", err);
      setChartData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, [fromDate, toDate]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PaymentStatusChart;

