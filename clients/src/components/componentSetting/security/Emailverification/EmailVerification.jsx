// import React, { useState } from 'react';
// import "../Emailverification/EmailVerification.css";
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import axios from 'axios';
// import BASE_URL from '../../../../pages/config/config';

// const EmailVerification = ({ isOpen, onClose }) => {
//     const [form, setForm] = useState({
//         newEmail: "",
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
//             await axios.post(`${BASE_URL}/api/email/send-otp`, {
//                 newEmail: form.newEmail
//             });
//             alert("OTP sent to new email.");
//             setOtpSent(true);
//         } catch (error) {
//             alert(error.response?.data?.error || "Failed to send OTP");
//         }
//     };

//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         try {
//             const userData = JSON.parse(localStorage.getItem("user"))
//             const currentEmail = userData.email;
//             const res = await axios.post(`${BASE_URL}/api/email/verify-otp`, {
//                 ...form,
//                 currentEmail
//             });
//             alert(res.data.message);
//             localStorage.setItem("currentEmail", form.newEmail); // update localStorage
//             setForm({ newEmail: "", otp: "" });
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
//                     <h3>Update Email</h3>
//                     <button className='verfiyclose-btn' onClick={onClose}>x</button>
//                 </div>

//                 <form onSubmit={handleVerifyOtp} className='verifymodal-form'>
//                     <label>
//                         New Email
//                         <input
//                             type="email"
//                             name="newEmail"
//                             value={form.newEmail}
//                             onChange={handleChange}
//                             required
//                         />
//                     </label>
//                     <button type="button" className="verifysend-btn" onClick={handleSendOtp} disabled={!form.newEmail}>
//                         Send OTP
//                     </button>
//                             <label>
//                                 OTP
//                                 <div className="verifyotp-field">
//                                     <input
//                                         type={showOtp ? "text" : "password"}
//                                         name="otp"
//                                         value={form.otp}
//                                         onChange={handleChange}
//                                 required
//                                 disabled={!otpSent}
//                                     />
//                                     <span
//                                         className="toggle-otp"
//                                         onClick={() => setShowOtp(prev => !prev)}
//                                         style={{ position: 'absolute', marginLeft: '-30px' }}
//                                     >
//                                         {showOtp ? <IoEyeOffOutline /> : <IoEyeOutline />}
//                                     </span>
//                                 </div>
//                             </label>

//                             <div className="verifymodal-actions">
//                                 <button type="button" className='verifycancel-btn' onClick={onClose}>Cancel</button>
//                                 <button type="submit" className='verifysave-btn' disabled={!otpSent}>Save Changes</button>
//                             </div>
//                 </form>
//             </div>
//         </div>
//     );
// };  

// export default EmailVerification;



import React, { useState, useRef } from "react";
// import "./EmailVerification.css";
import axios from "axios";
import BASE_URL from "../../../../pages/config/config";

const EmailVerification = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
const token = localStorage.getItem("token");


  const handleSendOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/api/email/send-otp`,
         { newEmail: email ,
            headers: {
        Authorization: `Bearer ${token}`,
      },

         });
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        otpRefs[index + 1].current.focus();
      }

    }
  };

  const handleResend = () => {
    handleSendOtp();
  };

  const handleSubmit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const currentEmail = userData.email;
      const otpString = otp.join("");
      await axios.post(`${BASE_URL}/api/email/verify-otp`, {
        currentEmail,
        newEmail: email,
        otp: otpString,
          headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      setStep(3);
      setTimeout(() => {
        onClose();
      }, 3000)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to verify OTP");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pphnnemail-overlay">
      <div className="pphnnemail-card">
        {step === 1 && (
          <>
            <h3 className="eerrerhead">Email Verification</h3>
            <label className="enterlabeler">Enter Email</label>
            <input 
              className="pphnnemail-otp-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="pphnnemail-btn black"
              onClick={handleSendOtp}
              disabled={!email}
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="eerrerhead">Email Verification</h3>
            <label>Enter Email</label>
            <input className="pphnnemail-otp-input"
              type="email" value={email} disabled />

            <p className="pphnnemail-info">
              Enter Verification Code sent to your Email
            </p>
            <div className="pphnnemail-otp-boxes">
              {otp.map((digit, idx) => (
                <input
                  className="pphnnemail-otp-input"
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={otpRefs[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                />
              ))}
            </div>
            <p className="pphnnemail-resend">
              Have not received the OTP?{" "}
              <span className="seededagain" onClick={handleResend}>Send again</span>
            </p>
            <button
              className="pphnnemail-btn black"
              onClick={handleSubmit}
              disabled={otp.join("").length !== 6}
            >
              Submit
            </button>
          </>
        )}

        {step === 3 && (
          <div className="pphnnemail-success">
            <p>Email verified successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

