import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || ""; // Set your API base URL

const VariantDropdown = () => {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [values, setValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    // Fetch all unique variants with status:true
    axios.get(`${BASE_URL}/api/variant/active-variants`, { withCredentials: true })
      .then(res => setVariants(res.data))
      .catch(err => console.error("Error fetching variants:", err));
  }, []);

  useEffect(() => {
    if (selectedVariant) {
      // Fetch values for selected variant
      axios.get(`${BASE_URL}/api/variant/values/${encodeURIComponent(selectedVariant)}`, { withCredentials: true })
        .then(res => setValues(res.data))
        .catch(err => console.error("Error fetching values:", err));
    } else {
      setValues([]);
      setSelectedValue("");
    }
  }, [selectedVariant]);

  return (
    <div>
      <label>Variant</label>
      <select
        className="form-select mb-3"
        value={selectedVariant}
        onChange={e => setSelectedVariant(e.target.value)}
      >
        <option value="">Select Variant</option>
        {variants.map((variant, idx) => (
          <option key={idx} value={variant}>{variant}</option>
        ))}
      </select>

      <label>Value</label>
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
  );
};

export default VariantDropdown;
