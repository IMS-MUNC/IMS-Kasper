import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css

import calendarIcon from "../assets/img/date.png"; // Use your calendar icon

const CustomDateRangePicker = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      key: "selection",
    },
  ]);

  const handleChange = (item) => {
    setRange([item.selection]);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div style={{ position: "relative", fontFamily: "Arial" }}>
      <div
        onClick={toggleCalendar}
        style={{
          border: "1px solid #E6E6E6",
          borderRadius: "8px",
          padding: "10px 12px",
          width: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          backgroundColor: "white"
        }}
      >
        <span style={{ fontSize: "14px", color: "#333" }}>
          {format(range[0].startDate, "dd/MM/yyyy")} -{" "}
          {format(range[0].endDate, "dd/MM/yyyy")}
        </span>
        <img src={calendarIcon} alt="calendar" style={{ width: "18px", height: "18px" }} />
      </div>

      {showCalendar && (
        <div style={{ position: "absolute", zIndex: 999, marginTop: "10px", right:"50px" }}>
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#1368EC"]}
          />
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
