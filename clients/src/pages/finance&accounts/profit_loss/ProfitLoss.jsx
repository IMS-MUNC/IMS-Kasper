import React from 'react';
import CustomDateRangePicker from '../../../components/CustomDateRangePicker';
import { IoIosSearch } from "react-icons/io";
import ProfitLossUI from '../profit_loss/ProfitLossDate';
import { useNavigate,Link } from 'react-router-dom';


const ProfitLoss = () => {
  const navigate= useNavigate()
  return (
    <div className="page-wrapper">
      <div className="content">
         <div className='d-flex flex-column gap-4'>
       <span style={{fontFamily:'"Roboto", sans-serif', fontWeight:"500", fontSize:"18px",color:"#262626"}}>Profit & Loss</span>
         <div style={{padding:"0 50px"}}>
             <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center gap-1' style={{border:"1px solid #E6E6E6", borderRadius:"8px", width:"820px", backgroundColor:"white", padding:"8px 24px"}}>
             <IoIosSearch style={{color:"rgb(34 33 33)", fontSize:"20px"}}/>
            <input type="search" placeholder='Search Here' style={{border:"none", outline:"none", width:"100%" , fontFamily:'"Roboto", sans-serif', fontWeight:"400", color:"#C2C2C2", fontSize:"16px"}}/>
          </div>
           <div><Link to="/profit_lossdate_choose" style={{textDecoration:"none"}}><CustomDateRangePicker /></Link></div>
       </div>
         </div>

         <div>
            <ProfitLossUI/>
         </div>
    </div>
          </div>
          </div>
  );
}

export default ProfitLoss;
