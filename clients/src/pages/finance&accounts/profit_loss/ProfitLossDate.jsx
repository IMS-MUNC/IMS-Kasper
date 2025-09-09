// import React, { useState } from 'react';
// import './ProfitLossDate.css';

// const days = ["M", "T", "W", "T", "F"];
// const weeks = [
//   [1, 2, 3, 4, 5],
//   [6,7, 8, 9, 10, 11,12],
//   [13,14, 15, 16, 17, 18, 19],
//   [20,21, 22, 23, 24, 25,26],
//   [27,28, 29, 30, 31],
// ];

// const ProfitLossUI = () => {
//   const [selectedRange, setSelectedRange] = useState(null);

//   return (
//     <div className="pl-container">
//       <p className="top-text">Please select a time period to generate the P&L (Profit & Loss) statement.</p>

//       <div className="calendar-container">
//         <div className="month-label" style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"14px",color:"#262626"}}>Month</div>

//         <div className="calendar-grid">
//           {weeks.map((week, weekIdx) => (
//             <div className="calendar-week" key={weekIdx}>
//               {week.map((day, dayIdx) => (
//                 <div
//                   key={dayIdx}
//                   className={`calendar-day ${
//                     dayIdx === 3 || dayIdx === 4 ? "more-sales" : "min-sales"
//                   }`}
//                 >
//                   {day}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div className="day-labels">
//           {days.map((d, i) => (
//             <span key={i}>{d}</span>
//           ))}
//         </div>

//         <div className="legend">
//           <span>Min No. Sales</span>
//           <div className="legend-box light" />
//           <div className="legend-box mid" />
//           <div className="legend-box dark" />
//           <div className="legend-box dark" />
//           <div className="legend-box dark" />
//           <span>Max No. Sales</span>
//         </div>
//       </div>

//       <div className="stats-box">
//         <div className="time-period-select">
//           <a href="#" className="select-time-link">Select Time Period</a>
//         </div>

//         <div className="stats-row">
//           <div className="stat-item">
//             <div className="label">Sales Amount</div>
//             <div className="value">₹ 00.00</div>
//           </div>
//           <div className="stat-item">
//             <div className="label">Taxes</div>
//             <div className="value">₹ 00.00</div>
//           </div>
//           <div className="stat-item">
//             <div className="label">Profit</div>
//             <div className="value">₹ 00.00</div>
//           </div>
//           <div className="stat-item">
//             <div className="label">Net Margin</div>
//             <div className="value">0%</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfitLossUI;


import React from 'react';
import { Link } from 'react-router-dom';


const ProfitLossDate = () => {
  return (
    <div>
       <div className='d-flex flex-column justify-content-center align-items-center gap-4'>
        <div>
          <span style={{fontWeight:"400",fontFamily:'"Roboto", sans-serif', color:"#262626", fontSize:"16px"}}>Please select a time period to generate the P&L (Profit & Loss) statement.</span>
        </div>
           <div>
              <span style={{fontWeight:"400",fontFamily:'"Roboto", sans-serif', color:"#262626", fontSize:"16px"}}>Months</span>
               <div className='d-flex flex-column gap-1'>
                 <div className='d-flex  gap-1'>
                  <button className="invisible" style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>00</button>
                  <button className="invisible" style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>00</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>01</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>02</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>03</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>04</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>05</button>
                 </div>
                 <div className='d-flex  gap-1'>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>06</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>07</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>08</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>09</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>10</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>11</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>12</button>
                 </div>
                  <div className='d-flex  gap-1'>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>13</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>14</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>15</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>16</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>17</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>18</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>19</button>
                 </div>
                  <div className='d-flex  gap-1'>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>20</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>21</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>22</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>23</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>24</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>25</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>26</button>
                 </div>
                  <div className='d-flex  gap-1'>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>27</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>28</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>29</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>30</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}}>31</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}} className="invisible">00</button>
                  <button style={{border:"none", backgroundColor:"rgb(225 225 225)", color:"#262626",padding:"4px 8px"}} className="invisible">00</button>
                 </div>
               </div>
           </div>
           

           <div className='d-flex gap-5' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"14px",color:"#262626"}}> 
            <span>M</span>
            <span>W</span>
            <span>F</span>
           </div>

            <div className='d-flex align-items-center gap-2'>
              <span style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"14px"}}>Min No. Sales</span>
              <button style={{backgroundColor:"#E1E1E1", border:"none", padding:"16px", borderRadius:"3px"}}></button>
              <button style={{backgroundColor:"#CEDFF7", border:"none", padding:"16px", borderRadius:"3px"}}></button>
              <button style={{backgroundColor:"#8AB6F9", border:"none", padding:"16px", borderRadius:"3px"}}></button>
              <button style={{backgroundColor:"#1368EC", border:"none", padding:"16px", borderRadius:"3px"}}></button>
              <button style={{backgroundColor:"#0F53BD", border:"none", padding:"16px", borderRadius:"3px"}}></button>
              <span  style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"14px"}}>Max No. Sales</span>
            </div>

             <div style={{backgroundColor:"white", borderRadius:"8px", padding:"20px", width:"1200px",padding:"25px 30px", display:"flex", flexDirection:"column", gap:"20px",border:"1px solid rgb(230, 230, 230)"}}>
                 <Link style={{color:"#1368EC",fontFamily:'"Roboto", sans-serif', fontSize:"14px", fontWeight:"400"}}>Select Time Period</Link>
                  <div className='d-flex justify-content-between'>
                       <div className='d-flex flex-column align-items-center gap-3'>
                        <label htmlFor="" style={{color:"#676767", fontSize:"16px", fontFamily:'"Roboto", sans-serif', fontWeight:"400"}}>Sales Amount</label>
                         <span style={{color:"#262626", fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"20px"}}>₹ 00.00</span>
                       </div>
                        <div className='d-flex flex-column align-items-center gap-3'>
                        <label htmlFor="" style={{color:"#676767", fontSize:"16px", fontFamily:'"Roboto", sans-serif', fontWeight:"400"}}>Taxes</label>
                         <span style={{color:"#262626", fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"20px"}}>₹ 00.00</span>
                       </div>
                        <div className='d-flex flex-column align-items-center gap-3'>
                        <label htmlFor="" style={{color:"#676767", fontSize:"16px", fontFamily:'"Roboto", sans-serif', fontWeight:"400"}}>Profit</label>
                         <span style={{color:"#262626", fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"20px"}}>₹ 00.00</span>
                       </div>
                        <div className='d-flex flex-column align-items-center gap-3'>
                        <label htmlFor="" style={{color:"#676767", fontSize:"16px", fontFamily:'"Roboto", sans-serif', fontWeight:"400"}}>Net Margin</label>
                         <span style={{color:"#262626", fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"20px"}}>0%</span>
                       </div>
                  </div>
             </div>
    </div>
    </div>
  );
}

export default ProfitLossDate;
