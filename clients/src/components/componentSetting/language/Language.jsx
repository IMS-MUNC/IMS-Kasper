import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import eng from "../../../assets/images/eng.svg";
import ger from "../../../assets/images/ger.svg";
import ara from "../../../assets/images/ara.svg";
import fre from "../../../assets/images/fre.svg";
import { AiOutlineDownload } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import './Language.css'


const Language = ({ progress = 80, progress2 = 70, progress3 = 50, progress4 = 30}) => {
    const [isOnRTL, setIsOnRTL] = useState (false);
    const [isOnRTLTwo, setIsOnRTLTwo] = useState (false);
    const [isOnRTLThree, setIsOnRTLThree] = useState (false);
    const [isOnRTLFour, setIsOnRTLFour] = useState (false);          
    const [isOnDef, setIsOnDef] = useState (false);
    const [isOnDefTwo, setIsOnDefTwo] = useState (false);
    const [isOnDefThree, setIsOnDefThree] = useState (false);
    const [isOnDefFour, setIsOnDefFour] = useState (false);
    const [isOnSta, setIsOnSta] = useState (false);
    const [isOnStaTwo, setIsOnStaTwo] = useState (false);
    const [isOnStaThree, setIsOnStaThree] = useState (false);
    const [isOnStaFour, setIsOnStaFour] = useState (false);
  return (
    <div>
        <div className="lanaguage-container"
         style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
        >
             <div className="py-1">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 15px"}}>
                 <h1  style={{ fontSize: "17px" }}>
            Language
          </h1>
           <div style={{display:"flex", gap:"20px"}}>
            <select name="" id="" style={{padding:"8px 5px",  border: "1px solid rgb(211, 211, 211)", borderRadius:"5px"}}>
                <option value="">Select Langaiage</option>
                <option value="">English</option>
                <option value="">Arabic</option>
                <option value="">Chinese</option>
            </select>
             <button className='settingbtn' style={{padding:"8px 5px", border:"none", borderRadius:"5px", backgroundColor:"#81BDff", color:"white",}}>Add Translation</button>
           </div>
            </div>
          <hr style={{ margin: "0" }} />
        </div>

        <div className="language-content px-3 py-3">
             <div style={{display:"flex", justifyContent:"space-between"}}>
                 <div style={{ border: "1px solid rgb(211, 211, 211)", borderRadius:"5px", padding:"8px 5px"}}>
                     <IoIosSearch />
                     <input style={{border:"none", outline:"none"}} type="search" placeholder='Search'/>
                 </div>
                  <button style={{color:"white", backgroundColor:"black", border:"none", borderRadius:"5px"}}><CiFilter /> Import Samples</button>
             </div>
              
             <div className='py-5'>
                 <table className='language-settings' style={{ width:"100%",border:"1px solid rgb(211, 211, 211)"}}>
                 <thead style={{backgroundColor:"#F9FAFB", color:"#1B2850", borderBottom:"1px solid rgb(211, 211, 211)"}}> 
                    <tr>
                        <th style={{padding:"10px 5px"}}><input type="checkbox" /></th>
                        <th style={{padding:"10px 5px"}}>Language</th>
                        <th style={{padding:"10px 5px"}}>Code</th>
                        <th style={{padding:"10px 5px"}}>RTL</th>
                        <th style={{padding:"10px 5px"}}>Default</th>
                        <th style={{padding:"10px 5px"}}>Total</th>
                        <th style={{padding:"10px 5px"}}>Done</th>
                        <th style={{padding:"10px 5px"}}>Progress</th>
                        <th style={{padding:"10px 5px"}}>Status</th>
                    </tr>
                 </thead>
                 <tbody style={{borderBottom:"1px solid rgb(211, 211, 211)",}}>
                    <tr>
                        <td style={{padding:"15px 5px"}}><input type="checkbox" /></td>
                        <td style={{padding:"15px 5px"}}><span><img src={eng} alt="" /> English</span></td>
                        <td>en</td>
                        <td>
                 <div
                  onClick={() => setIsOnRTL(!isOnRTL)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnRTL ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnRTL
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                 </td>
                  <td >
                       <div
                  onClick={() => setIsOnDef(!isOnDef)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnDef ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnDef
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                  </td> 
                   <td>2145</td>
                   <td>1815</td>
                    <td style={{padding:"10px 5px" , display:"flex", alignItems:"center", gap:"5px"}}>
                        <div className="circular-progress" style={{ '--progress': progress, '--color': '#FE9F43' }}>
      <span className="value">{progress}%</span>
    </div> 
         80%
                    </td>
                     <td>
                        <div
                  onClick={() => setIsOnSta(!isOnSta)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnSta ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnSta
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                     </td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Web</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>App</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Admin</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><AiOutlineDownload /></button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><RiDeleteBinLine /></button></td>
                    </tr>
                     <tr>
                        <td style={{padding:"15px 5px"}}><input type="checkbox" /></td>
                        <td style={{padding:"15px 5px"}}><span><img src={ger} alt="" /> English</span></td>
                        <td>Ar</td>
                        <td>
                 <div
                  onClick={() => setIsOnRTLTwo(!isOnRTLTwo)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnRTLTwo ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnRTLTwo
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                 </td>
                  <td >
                       <div
                  onClick={() => setIsOnDefTwo(!isOnDefTwo)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnDefTwo ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnDefTwo
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                  </td> 
                   <td>2132</td>
                   <td>1235</td>
                    <td style={{padding:"10px 5px" , display:"flex", alignItems:"center", gap:"5px"}}>
                        <div className="circular-progress" style={{ '--progress': progress2, '--color': '#06AED4' }}>
      <span className="value">{progress2}%</span>
    </div> 
         70%
                    </td>
                     <td>
                        <div
                  onClick={() => setIsOnStaTwo(!isOnStaTwo)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnStaTwo ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnStaTwo
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                     </td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Web</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>App</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Admin</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><AiOutlineDownload /></button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><RiDeleteBinLine /></button></td>
                    </tr>
                     <tr>
                        <td style={{padding:"15px 5px"}}><input type="checkbox" /></td>
                        <td style={{padding:"15px 5px"}}><span><img src={ara} alt="" /> English</span></td>
                        <td>zh</td>
                        <td>
                 <div
                  onClick={() => setIsOnRTLThree(!isOnRTLThree)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnRTLThree ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnRTLThree
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                 </td>
                  <td >
                       <div
                  onClick={() => setIsOnDefThree(!isOnDefThree)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnDefThree ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnDefThree
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                  </td> 
                   <td>4323</td>
                   <td>3333</td>
                    <td style={{padding:"10px 5px" , display:"flex", alignItems:"center", gap:"5px"}}>
                        <div className="circular-progress" style={{ '--progress': progress3,  '--color': '#6938EF' }}>
      <span className="value">{progress3}%</span>
    </div> 
         50%
                    </td>
                     <td>
                        <div
                  onClick={() => setIsOnStaThree(!isOnStaThree)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnStaThree ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnStaThree
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                     </td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Web</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>App</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Admin</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><AiOutlineDownload /></button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><RiDeleteBinLine /></button></td>
                    </tr>
                     <tr>
                        <td style={{padding:"15px 5px"}}><input type="checkbox" /></td>
                        <td style={{padding:"15px 5px"}}><span><img src={fre} alt="" /> English</span></td>
                        <td>hi</td>
                        <td>
                 <div
                  onClick={() => setIsOnRTLFour(!isOnRTLFour)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnRTLFour ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnRTLFour
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                 </td>
                  <td >
                       <div
                  onClick={() => setIsOnDefFour(!isOnDefFour)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnDefFour ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnDefFour
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                  </td> 
                   <td>6433</td>
                   <td>2829</td>
                    <td style={{padding:"10px 5px" , display:"flex", alignItems:"center", gap:"5px"}}>
                        <div className="circular-progress" style={{ '--progress': progress4,  '--color': 'red' }}>
      <span className="value">{progress4}%</span>
    </div> 
         30%
                    </td>
                     <td>
                        <div
                  onClick={() => setIsOnStaFour(!isOnStaFour)}
                  style={{
                    width: "47px",
                    height: "24px",
                    backgroundColor: isOnStaFour ? "#00C389" : "#ccc",
                    borderRadius: "999px",
                    padding: "2px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease-in-out",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      transition: "transform 0.2s ease-in-out",
                      transform: isOnStaFour
                        ? "translateX(23px)"
                        : "translateX(0px)",
                    }}
                  ></div>
                </div>
                     </td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Web</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>App</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}>Admin</button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><AiOutlineDownload /></button></td>
                      <td><button style={{ border:"1px solid rgb(211, 211, 211)", backgroundColor:"white"}}><RiDeleteBinLine /></button></td>
                    </tr>
                 </tbody>
              </table>
             </div>
        </div>

        </div>
    </div>
  )
}

export default Language