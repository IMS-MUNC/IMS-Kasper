import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ title, labels, datasets, dates }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter labels/datasets by date if dates prop is provided
  let filteredLabels = labels;
  let filteredDatasets = datasets;
  if (dates && dates.length === labels.length && (startDate || endDate)) {
    const filterFn = (dateStr) => {
      const date = new Date(dateStr);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    };
    const indices = dates.map((d, i) => filterFn(d) ? i : null).filter(i => i !== null);
    filteredLabels = indices.map(i => labels[i]);
    filteredDatasets = datasets.map(ds => ({
      ...ds,
      data: indices.map(i => ds.data[i])
    }));
  }

    // Show only top 10 products by total value (sum of all datasets for each product)
    if (filteredLabels.length > 10) {
      // Calculate total for each label
      const totals = filteredLabels.map((label, idx) => {
        return datasets.reduce((sum, ds) => sum + (ds.data[idx] || 0), 0);
      });
      // Get indices of top 10 totals
      const topIndices = totals
        .map((total, idx) => ({ total, idx }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
        .map(obj => obj.idx);
      filteredLabels = topIndices.map(i => filteredLabels[i]);
      filteredDatasets = filteredDatasets.map(ds => ({
        ...ds,
        data: topIndices.map(i => ds.data[i])
      }));
    }

  const data = {
    labels: filteredLabels,
    datasets: filteredDatasets.map((ds, i) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || `rgba(54, 162, 235, 0.${i+5})`,
    }))
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: !!title, text: title },
    },
  };
  return (
    <div>
      {/* <div style={{marginBottom:16, display:'flex', gap:8, alignItems:'center'}}>
        <label>Date Filter:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <span>to</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div> */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graph;
