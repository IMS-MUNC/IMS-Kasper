import React, {useState} from "react";
import light from '../../../assets/images/theme-img-08.jpg'
import dark from '../../../assets/images/theme-img-09.jpg'
import automatic  from '../../../assets/images/theme-img-10.jpg'

const Appearance = () => {
      const colors = [
  { hex: '#FFA54F', ring: '#FFE0C2' }, // Orange with light ring (selected)
  { hex: '#7465FF' },                  // Purple
  { hex: '#049DC2' },                  // Blue
  { hex: '#E55604' },                  // Deep Orange
];
     const [selectedColor, setSelectedColor] = useState(colors[0].hex);
     const [isExpanSidebar, setIsExpandSidebar] = useState(false)
   
  return (
    <div>
      <div
        className="appearance-container"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
      >
        <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            Appearance
          </h1>
          <hr style={{ margin: "0" }} />
        </div>
        <div className="appearance-content  px-3 py-3">
            <form action="" style={{display:"flex", flexDirection:"column", gap:"20px"}}>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "500" }}>Select Theme</span>
              <span>Choose accent colour of website</span>
            </div>
            <div style={{display:"flex", gap:"20px"}}>
              <img src={light} alt="light" />
              <img src={dark} alt="dark" />
              <img src={automatic} alt="automatic" />
            </div>
          </div>
           <div style={{display:"flex", alignItems:"center", gap:"370px"}}>
             <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "500" }}>Accent Color</span>
              <span>Choose accent colour of website</span>
            </div>
             <div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
      {colors.map((color, idx) => {
        const isSelected = selectedColor === color.hex;
        return (
          <div
            key={idx}
            onClick={() => setSelectedColor(color.hex)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isSelected ? color.ring : color.hex,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: color.hex,
              }}
            />
          </div>
        );
      })}
    </div>
             </div>
           </div>
            <div style={{display:"flex", alignItems:"center", gap:"370px"}}>
               <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "500" }}>Expand Sidebar</span>
              <span>Choose accent colour of website</span>
            </div>
              <div
                onClick={() => setIsExpandSidebar(!isExpanSidebar)}
                style={{
                  width: "47px",
                  height: "24px",
                  backgroundColor: isExpanSidebar ? "#00C389" : "#ccc",
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
                    transform: isExpanSidebar
                      ? "translateX(23px)"
                      : "translateX(0px)",
                  }}
                ></div>
              </div>
            </div>
             <div style={{display:"flex", alignItems:"center", gap:"350px",}}>
             <div  style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "500" }}>Sidebar Size</span>
              <span>Select size of the sidebar to display</span>
            </div>
             <div>
                <select name="" id="" style={{
                    border:"1px solid rgb(203, 198, 198)",
                    padding:"8px 5px",
                    borderRadius:"5px",
                    width:"200px"
                }}>
                    <option value="">Small-85px</option>
                    <option value="">Large-250px</option>
                </select>
             </div>
           </div>
            <div style={{display:"flex", alignItems:"center",gap:"400px"}}>
             <div  style={{ display: "flex", flexDirection: "column",}}>
              <span style={{ fontWeight: "500" }}>Font Family</span>
              <span>Select font family of website</span>
            </div>
             <div >
                <select name="" id="" style={{
                    border:"1px solid rgb(203, 198, 198)",
                    padding:"8px 5px",
                    borderRadius:"5px",
                    width:"200px"
                }}>
                    <option value="">Nunito</option>
                    <option value="">Poppins</option>
                </select>
             </div>
           </div>
             <div style={{display:"flex", justifyContent:"end", gap:"10px"}}>
              <button className="settingbtn" style={{border:"none", padding:"10px", backgroundColor:"#81BDff", color:"white", borderRadius:"5px"}}>Cancel</button>
              <button className="settingbtn" style={{border:"none", padding:"10px", backgroundColor:"#007AFF", color:"white", borderRadius:"5px"}}>Save Changes</button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
