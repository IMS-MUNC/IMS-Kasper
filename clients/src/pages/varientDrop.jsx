import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./config/config";


const VarientDrop = () => {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [values, setValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const token = localStorage.getItem("token");
  console.log("Selected Value:", selectedValue);
  console.log("Selected Variant:", selectedVariant);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/variant-attributes/active-variants`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
      .then(res => setVariants(res.data))
      .catch(err => console.error("Error fetching variants:", err));
  }, [token]);

  useEffect(() => {
    if (selectedVariant) {
      axios.get(`${BASE_URL}/api/variant-attributes/values/${encodeURIComponent(selectedVariant)}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
        .then(res => setValues(res.data))
        .catch(err => console.error("Error fetching values:", err));
    } else {
      setValues([]);
      setSelectedValue("");
    }
  }, [selectedVariant, token]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Variant & Value Dropdown</h2>
      <div className="mb-3">
        <label className="form-label">Variant</label>
        <select
          className="form-select"
          value={selectedVariant}
          onChange={e => setSelectedVariant(e.target.value)}
        >
          <option value="">Select Variant</option>
          {variants.map((variant, idx) => (
            <option key={idx} value={variant}>{variant}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Value</label>
        <select
          className="form-select"
          value={selectedValue}
          onChange={e => setSelectedValue(e.target.value)}
          disabled={!selectedVariant}
        >
          <option value="">Select Value</option>
          {values.map((value, idx) => (
            <option key={idx} value={value}>{value}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VarientDrop;
