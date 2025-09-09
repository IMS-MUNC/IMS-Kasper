// import React, { useState } from 'react';
// import "../Emailverification/EmailVerification.css";
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import axios from 'axios';
// import BASE_URL from '../../../../pages/config/config';

// const MobileVerification = ({ isOpen, onClose }) => {
//     const [form, setForm] = useState({
//         mobile: "",
//         otp: ""
//     });

//     const [otpSent, setOtpSent] = useState(false);
//     const [showOtp, setShowOtp] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSendOtp = async () => {
//         try {
//             await axios.post(`${BASE_URL}/api/mobile/send-otp`, {
//                 mobile: form.mobile
//             });
//             alert("OTP sent to your mobile number.");
//             setOtpSent(true);
//         } catch (error) {
//             alert(error.response?.data?.error || "Failed to send OTP");
//         }
//     };

//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         try {
//             const currentEmail = localStorage.getItem("currentEmail");
//             const res = await axios.post(`${BASE_URL}/api/mobile/verify-otp`, {
//                 mobile: form.mobile,
//                 otp: form.otp,
//                 email: currentEmail
//             });
//             alert(res.data.message);
//             localStorage.setItem("currentMobile", form.mobile); // update localStorage
//             setForm({ mobile: "", otp: "" });
//             setOtpSent(false);
//             onClose();
//         } catch (error) {
//             alert(error.response?.data?.error || "Failed to verify OTP");
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className='verifymodal-overlay'>
//             <div className="verifymodal-box">
//                 <div className="verifymodal-header">
//                     <h3>Change Phone Number</h3>
//                     <button className='verfiyclose-btn' onClick={onClose}>x</button>
//                 </div>

//                 <form onSubmit={handleVerifyOtp} className='verifymodal-form'>
//                     <label>
//                         New Phone Number
//                         <input
//                             type="tel"
//                             name="mobile"
//                             value={form.mobile}
//                             onChange={handleChange}
//                             required
//                             pattern="[0-9]{10}" // Exactly 10 digits
//                             title="Please enter a 10-digit mobile number"
//                         />
//                     </label>
//                     <button type="button" className="verifysend-btn" onClick={handleSendOtp} disabled={!form.mobile}>
//                         Send OTP
//                     </button>
//                     <label>
//                         OTP
//                         <div className="verifyotp-field">
//                             <input
//                                 type={showOtp ? "text" : "password"}
//                                 name="otp"
//                                 value={form.otp}
//                                 onChange={handleChange}
//                                 required
//                                 disabled={!otpSent}
//                             />
//                             <span
//                                 className="toggle-otp"
//                                 onClick={() => setShowOtp(prev => !prev)}
//                                 style={{ position: 'absolute', marginLeft: '-30px' }}
//                             >
//                                 {showOtp ? <IoEyeOffOutline /> : <IoEyeOutline />}
//                             </span>
//                         </div>
//                     </label>

//                     <div className="verifymodal-actions">
//                         <button type="button" className='verifycancel-btn' onClick={onClose}>Cancel</button>
//                         <button type="submit" className='verifysave-btn' disabled={!otpSent}>Save Changes</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default MobileVerification;



import React, { useState, useRef } from "react";
import "../Emailverification/EmailVerification.css";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";

const MobileVerification = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1=enter phone, 2=enter OTP, 3=success
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const otpRefs = Array.from({ length: 6 }, () => useRef());
const token = localStorage.getItem("token");

  const handleSendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/mobile/send-otp`, { mobile ,
         headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs[index + 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/mobile/verify-otp`, {
        mobile,
        otp: otp.join(""),
        
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      localStorage.setItem("currentMobile", mobile);
      setStep(3);
      setTimeout(() => {
        onClose();
      }, 3000); // auto-close after 3s
    } catch (error) {
      alert(error.response?.data?.error || "Failed to verify OTP");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pphnnemail-overlay">
      <div className="pphnnemail-card">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <h3 className="eerrerhead">Phone Verification</h3>
            <div>
              <label style={{ width: '100%' }}>Enter Phone Number</label>
              <input className="pphnnemail-otp-input" style={{ width: '100%', marginBottom: '20px', marginTop: '10px' }}
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 54123"
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit mobile number"
              />
            </div>
            <button
              type="button"
              className="pphnnemail-btn black"
              onClick={handleSendOtp}
              disabled={!mobile}
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h3 className="eerrerhead">Phone Verification</h3>
            <label>Enter Phone Number</label>
            <input className="pphnnemail-otp-input" type="tel" value={mobile} readOnly />
            <div className="pphnnemail-info">
              Enter Verification Code sent to your Phone Number
            </div>
            <div className="pphnnemail-otp-boxes">
              {otp.map((digit, index) => (
                <input
                  className="pphnnemail-otp-input"
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>
            <div className="pphnnemail-resend">
              Have not received the OTP?{" "}
              <span onClick={handleSendOtp}>Send again</span>
            </div>
            <button
              type="button"
              className="pphnnemail-btn black"
              onClick={handleVerifyOtp}
              disabled={otp.join("").length !== 6}
            >
              Submit
            </button>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="pphnnemail-success">
            Phone verified successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVerification;
