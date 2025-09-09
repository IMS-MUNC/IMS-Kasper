import React from 'react'

const Prefixes = () => {
  return (
    <div>
        <div className='prefixes-container' 
         style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
        }}
        >
             <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            Prefixes
          </h1>
          <hr style={{ margin: "0" }} />
        </div>

         <div className="prefixes-content px-3 py-3">
             <form action="" style={{display:"flex", flexDirection:"column", gap:"20px"}}>
             <div style={{display:"flex", gap:"20px"}}>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Product (SKU)
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SKU - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Supplier
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SUP - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Purchase
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='PU - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Purchase Return
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SPU - '/>
                  </div>
             </div>
             <div style={{display:"flex", gap:"20px"}}>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Sales
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SA - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Sales Return
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SR - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Customer
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='CT - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Expense
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='EX - '/>
                  </div>
             </div>
             <div style={{display:"flex", gap:"20px"}}>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Stock Transfer
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='ST - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Stock Adjustment
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SA - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Sales Order
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='SO - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    POS Invoice
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='PINV - '/>
                  </div>
             </div>
             <div style={{display:"flex", gap:"20px"}}>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Estimation
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='EST - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Transaction
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='TRN - '/>
                  </div>
                <div
                 style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "5px",
                  }}
                > 
                    <label style={{ fontWeight: "500" }} htmlFor="">
                    Employee
                  </label>
                   <input style={{ border: "1px solid #cbc6c6", padding: "8px 5px",borderRadius:"5px" }} type="text" placeholder='EMP - '/>
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
  )
}

export default Prefixes