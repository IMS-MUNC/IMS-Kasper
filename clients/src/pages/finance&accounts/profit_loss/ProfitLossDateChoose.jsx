import React from 'react';
import { Link } from 'react-router-dom';
import CustomDateRangePicker from '../../../components/CustomDateRangePicker';
import { IoIosSearch } from "react-icons/io";
import ProfitLossUI from './ProfitLossDate';
import logo from '../../../assets/img/chair.png'
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";


const ProfitLossDateChoose = () => {
  const data = [
    { product: "Chair", amount: "₹ 205.00", taxes: "5%", netProfit: "₹ 65.00", product: "3 Pieces * 2 Variants" },
    { product: "Chair", amount: "₹ 205.00", taxes: "5%", netProfit: "₹ 65.00", product: "3 Pieces * 2 Variants" },
    { product: "Chair", amount: "₹ 205.00", taxes: "5%", netProfit: "₹ 65.00", product: "3 Pieces * 2 Variants" },
    { product: "Chair", amount: "₹ 205.00", taxes: "5%", netProfit: "₹ 65.00", product: "3 Pieces * 2 Variants" },

  ];
  return (
    <div className='page-wrapper d-flex flex-column gap-4'>
      <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "500", fontSize: "18px", color: "#262626", padding: '10px 10px' }}>Profit & Loss</span>
      <div style={{ padding: "0 50px" }}>
        <div className='d-flex justify-content-between align-items-center' style={{width:'100%'}}>
          <div className='d-flex align-items-center gap-1' style={{ borderRadius: "2px", border: "1px solid #E6E6E6", borderRadius: "8px", width: "82%", backgroundColor: "white", padding: "8px 24px" }}>
            <IoIosSearch style={{ color: "rgb(34 33 33)", fontSize: "20px" }} />
            <input type="search" placeholder='Search Here' style={{ borderRadius: "2px", border: "none", outline: "none", width: "100%", fontFamily: '"Roboto", sans-serif', fontWeight: "400", color: "#C2C2C2", fontSize: "16px" }} />
          </div>
          <div><Link to="/profit_lossdate_choose" style={{ textDecoration: "none" }}><CustomDateRangePicker /></Link></div>
        </div>
      </div>
      <div className='d-flex flex-column justify-content-center align-items-center gap-4'>

        <div className='d-flex gap-5'>
          <div>
            <span style={{ fontWeight: "400", fontFamily: '"Roboto", sans-serif', color: "#262626", fontSize: "16px" }}>Jan</span>
            <div className='d-flex flex-column gap-1'>
              <div className='d-flex  gap-1'>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>01</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>02</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>03</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>04</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>05</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>06</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#89B4F5", color: "white", padding: "4px 8px" }}>07</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>08</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>09</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>10</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>11</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>12</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>13</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>14</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>15</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>16</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>17</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>18</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>19</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>20</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>21</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>22</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#1368EC", color: "white", padding: "4px 8px" }}>23</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>24</button>
                <Link to="/profit_lossselect_date" style={{ textDecoration: "none" }}><button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>25</button></Link>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>26</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>27</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>28</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9)", color: "#262626", padding: "4px 8px" }}>29</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>30</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>31</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }} className="invisible">00</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }} className="invisible">00</button>
              </div>
            </div>
            <div className='d-flex gap-5 justify-content-center py-5' style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "14px", color: "#262626" }}>
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>
          </div>

          <div>
            <span style={{ fontWeight: "400", fontFamily: '"Roboto", sans-serif', color: "#262626", fontSize: "16px" }}>Feb</span>
            <div className='d-flex flex-column gap-1'>
              <div className='d-flex  gap-1'>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>

                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>01</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>02</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>03</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#1368EC", color: "white", padding: "4px 8px" }}>04</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>05</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>06</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>07</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>08</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>09</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>10</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>11</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>12</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>13</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#1368EC", color: "white", padding: "4px 8px" }}>14</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>15</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>16</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>17</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>18</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>19</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#89B4F5", color: "white", padding: "4px 8px" }}>20</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>21</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>22</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>23</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>24</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>25</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>26</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>27</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>28</button>
              </div>
            </div>
            <div className='d-flex gap-5 justify-content-center py-5' style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "14px", color: "#262626" }}>
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>
          </div>

          <div>
            <span style={{ fontWeight: "400", fontFamily: '"Roboto", sans-serif', color: "#262626", fontSize: "16px" }}>Mar</span>
            <div className='d-flex flex-column gap-1'>
              <div className='d-flex  gap-1'>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>
                <button className="invisible" style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>00</button>

                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>01</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>02</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>03</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#1368EC", color: "white", padding: "4px 8px" }}>04</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>05</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>06</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>07</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>08</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>09</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>10</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>11</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>12</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>13</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#89B4F5", color: "white", padding: "4px 8px" }}>14</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>15</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>16</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>17</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>18</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#CEDFF7", color: "#262626", padding: "4px 8px" }}>19</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#89B4F5", color: "white", padding: "4px 8px" }}>20</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>21</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>22</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>23</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>24</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>25</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>26</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>27</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>28</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#0F53BD", color: "white", padding: "4px 8px" }}>29</button>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "rgb(225 225 225)", color: "#262626", padding: "4px 8px" }}>30</button>
              </div>
              <div className='d-flex  gap-1'>
                <button style={{ borderRadius: "2px", border: "none", backgroundColor: "#8AB6F9", color: "#262626", padding: "4px 8px" }}>31</button>
              </div>
            </div>
            <div className='d-flex gap-5 justify-content-center py-2' style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "14px", color: "#262626" }}>
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>
          </div>
        </div>

        {/* <div className='d-flex gap-5' style={{fontFamily:'"Roboto", sans-serif', fontWeight:"400", fontSize:"14px",color:"#262626"}}> 
            <span>M</span>
            <span>W</span>
            <span>F</span>
           </div> */}

        <div className='d-flex align-items-center gap-2'>
          <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "14px" }}>Min No. Sales</span>
          <button style={{ backgroundColor: "#E1E1E1", borderRadius: "2px", border: "none", padding: "16px", borderRadius: "3px" }}></button>
          <button style={{ backgroundColor: "#CEDFF7", borderRadius: "2px", border: "none", padding: "16px", borderRadius: "3px" }}></button>
          <button style={{ backgroundColor: "#8AB6F9", borderRadius: "2px", border: "none", padding: "16px", borderRadius: "3px" }}></button>
          <button style={{ backgroundColor: "#1368EC", borderRadius: "2px", border: "none", padding: "16px", borderRadius: "3px" }}></button>
          <button style={{ backgroundColor: "#0F53BD", borderRadius: "2px", border: "none", padding: "16px", borderRadius: "3px" }}></button>
          <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "14px" }}>Max No. Sales</span>
        </div>


        <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px", width: "1200px", padding: "25px 30px", display: "flex", flexDirection: "column", gap: "20px", border: "1px solid rgb(230, 230, 230)" }}>
          <Link style={{ color: "#1368EC", fontFamily: '"Roboto", sans-serif', fontSize: "14px", fontWeight: "400" }}>01/01/2025-31/03/2025</Link>
          <div className='d-flex justify-content-between'>
            <div className='d-flex flex-column align-items-center gap-3'>
              <label htmlFor="" style={{ color: "#676767", fontSize: "16px", fontFamily: '"Roboto", sans-serif', fontWeight: "400" }}>Sales Amount</label>
              <span style={{ color: "#262626", fontFamily: '"Roboto", sans-serif', fontWeight: "500", fontSize: "20px" }}>₹ 65,27,618.00</span>
            </div>
            <div className='d-flex flex-column align-items-center gap-3'>
              <label htmlFor="" style={{ color: "#676767", fontSize: "16px", fontFamily: '"Roboto", sans-serif', fontWeight: "400" }}>Taxes</label>
              <span style={{ color: "#EC2513", fontFamily: '"Roboto", sans-serif', fontWeight: "500", fontSize: "20px" }}> ₹ 4,618.00</span>
            </div>
            <div className='d-flex flex-column align-items-center gap-3'>
              <label htmlFor="" style={{ color: "#676767", fontSize: "16px", fontFamily: '"Roboto", sans-serif', fontWeight: "400" }}>Profit</label>
              <span style={{ color: "#26B20A", fontFamily: '"Roboto", sans-serif', fontWeight: "500", fontSize: "20px" }}>₹ 61,019.00</span>
            </div>
            <div className='d-flex flex-column align-items-center gap-3'>
              <label htmlFor="" style={{ color: "#676767", fontSize: "16px", fontFamily: '"Roboto", sans-serif', fontWeight: "400" }}>Net Margin</label>
              <span style={{ color: "#26B20A", fontFamily: '"Roboto", sans-serif', fontWeight: "500", fontSize: "20px" }}>8.2%</span>
            </div>
          </div>
        </div>

      </div>
      <div className="table-container-inflow" style={{ border: "1px solid #E6E6E6", backgroundColor: "white", margin: "0 auto", width: "1200px", marginBottom:'50px'}}>
        <table className="" style={{ margin: "0 auto", width: "1200px" }}>
          <thead style={{
            backgroundColor: "#E6E6E6", color: "#676767", fontFamily: '"Roboto", sans-serif',
            fontWeight: "400", fontSize: "16px"
          }}>
            <tr>
              <th style={{ padding: "15px 20px", }}><input type="checkbox" /></th>
              <th style={{ padding: "15px 20px", }}>Product</th>
              <th style={{ padding: "15px 20px", }}>Amount</th>
              <th style={{ padding: "15px 20px", }}>Taxes</th>
              <th style={{ padding: "15px 20px", }}>Net Profit</th>
              <th style={{ padding: "15px 20px" }}>Product</th>

            </tr>
          </thead>
          <tbody style={{
            backgroundColor: "white",
            color: "#262626", fontFamily: '"Roboto", sans-serif', fontWeight: "400", fontSize: "16px"
          }}>
            {data.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6E6E6", cursor: "pointer" }}
                onClick={() => navigate("/credit")}>
                <td style={{ padding: "10px 20px" }}><input type="checkbox" /></td>
                <td style={{ padding: "10px 20px" }}><span><img src={logo} alt="logo" /></span>{item.product}</td>
                <td style={{ padding: "10px 20px" }}>{item.amount}</td>
                <td style={{ padding: "10px 20px" }}>{item.taxes}</td>
                <td style={{ padding: "10px 20px" }}>{item.netProfit}</td>
                <td style={{ padding: "10px 20px" }}>{item.product}</td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-end gap-3" style={{ padding: "10px 50px" }}>
          <span style={{
            backgroundColor: "white", boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
            padding: "7px", borderRadius: "5px", border: "1px solid #e4e0e0ff"
          }}>
            10 <span style={{ color: "grey" }}>per page</span>
          </span>
          <span style={{
            backgroundColor: "white", boxShadow: "rgb(0 0 0 / 4%) 0px 3px 8px",
            padding: "7px", borderRadius: "5px", border: "1px solid #e4e0e0ff"
          }}>
            1-4 <span style={{ color: "grey" }}>of 4</span>{" "}
            <button style={{ border: "none", color: "grey", backgroundColor: "white" }}>
              <GrFormPrevious />
            </button>{" "}
            <button style={{ border: "none", backgroundColor: "white" }}>
              <MdNavigateNext />
            </button>
          </span>
        </div>
      </div>

    </div>
  );
}

export default ProfitLossDateChoose;
