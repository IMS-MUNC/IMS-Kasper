import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import BASE_URL from '../../../pages/config/config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/sales/dashboard/stats`,{
             headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return null;

  const data = {
    labels: ['Total Sale', 'Total Return'],
    datasets: [
      {
        label: 'Quantity',
        data: [stats.totalSaleQty, stats.totalReturnQty],
        backgroundColor: ['#1890ff', '#ff4d4f'],
      },
      {
        label: 'Amount',
        data: [stats.totalSaleAmount, stats.totalReturnAmount],
        backgroundColor: ['#52c41a', '#faad14'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales & Returns Overview' },
    },
  };

  return (
    <Container fluid style={{ padding: '24px' }}>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Sale Quantity</Card.Title>
              <h4>{stats.totalSaleQty}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Sale Amount</Card.Title>
              <h4>₹{stats.totalSaleAmount.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Return Quantity</Card.Title>
              <h4>{stats.totalReturnQty}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Total Return Amount</Card.Title>
              <h4>₹{stats.totalReturnAmount.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-sm">
        <Card.Body>
          <Bar data={data} options={options} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SalesDashboard;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, Row, Col, Spin } from 'antd';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const SalesDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('/api/sales/dashboard/stats');
//         setStats(res.data);
//       } catch (err) {
//         setError('Failed to fetch dashboard stats');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   if (loading) return <Spin size="large" />;
//   if (error) return <div>{error}</div>;
//   if (!stats) return null;

//   const data = {
//     labels: ['Total Sale', 'Total Return'],
//     datasets: [
//       {
//         label: 'Quantity',
//         data: [stats.totalSaleQty, stats.totalReturnQty],
//         backgroundColor: ['#1890ff', '#ff4d4f'],
//       },
//       {
//         label: 'Amount',
//         data: [stats.totalSaleAmount, stats.totalReturnAmount],
//         backgroundColor: ['#52c41a', '#faad14'],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Sales & Returns Overview' },
//     },
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col span={6}>
//           <Card title="Total Sale Quantity">{stats.totalSaleQty}</Card>
//         </Col>
//         <Col span={6}>
//           <Card title="Total Sale Amount">₹{stats.totalSaleAmount.toFixed(2)}</Card>
//         </Col>
//         <Col span={6}>
//           <Card title="Total Return Quantity">{stats.totalReturnQty}</Card>
//         </Col>
//         <Col span={6}>
//           <Card title="Total Return Amount">₹{stats.totalReturnAmount.toFixed(2)}</Card>
//         </Col>
//       </Row>
//       <Card>
//         <Bar data={data} options={options} />
//       </Card>
//     </div>
//   );
// };

// export default SalesDashboard;
