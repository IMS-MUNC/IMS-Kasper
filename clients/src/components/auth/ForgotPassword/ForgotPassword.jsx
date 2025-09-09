import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../../pages/config/config";
import { toast } from "react-toastify";
import MuncLogo from "../../../assets/img/logo/munclogotm.png";
import { Link, useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(""); // OTP state as string
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // const handleRequestOtp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
  //     toast.success("OTP sent to your email");
  //     setStep(2);
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Failed to send OTP");
  //   }
  // };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(`${BASE_URL}/api/user/verify-otp-reset`, {
  //       email,
  //       otp, // 6-digit OTP combined
  //       newPassword,
  //     });
  //     alert("Password reset successfully!");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "OTP verification failed");
  //   }
  // };

  // OTP input handler
  const handleOtpChange = (e, index) => {
    let value = e.target.value.replace(/\D/, ""); // allow only digits
    if (value.length > 1) value = value[0]; // only 1 digit per box

    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // auto focus next input
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleRequestOtp = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
    toast.success('OTP sent to your email');
    setStep(2);
  } catch (err) {
     toast.error(err.response?.data?.message || 'Failed to send OTP');
  }
};

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${BASE_URL}/api/auth/verify-otp-reset`, {
      email,
      otp,
      newPassword
    });
     toast.success('Password reset successfully!');
      // reset form fields
      setEmail("");
      setOtp("");
      setNewPassword("");
      setStep(1);

      // navigate to login page
      navigate("/login");
  } catch (err) {
     toast.error(err.response?.data?.message || 'OTP verification failed');
  }
};

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content authent-content">
            {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <div className="login-userset">
                            <div className="login-logo logo-normal">
                                <img src={MuncLogo} alt="img" />
                            </div>
                            {/* <a href="index.html" className="login-logo logo-white">
                                <img src={MuncLogo} alt="Img" />
                            </a> */}
                            <div className="login-userheading">
                                <h3>Forgot password?</h3>
                                <h4>If you forgot your password, well, then we’ll email you instructions to reset your
                                    password.</h4>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email <span className="text-danger"> *</span></label>
                                <div className="input-group">
                                    <input type="text"  className="form-control border-end-0"       value={email}
          onChange={(e) => setEmail(e.target.value)}
          required/>
                                    <span className="input-group-text border-start-0">
                                        <i className="ti ti-mail" />
                                    </span>
                                </div>
                            </div>
                            <div className="form-login">
                                <button type="submit" className="btn btn-login">Send OTP</button>
                            </div>
                            <div className="signinform text-center">
                                {/* <h4>Return to<a href="signin.html" className="hover-a"> login </a></h4> */}
                              <h4>Already have an account ? <Link to="/login" className="hover-a">Sign In Instead</Link></h4>

                            </div>

                        </div>
                    </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="digit-group">
                <div className="login-userset">
                  <div className="login-logo logo-normal">
                    <img src={MuncLogo} alt="img" />
                  </div>
                  <div className="login-userheading">
                    <h3>Enter OTP and Reset Password</h3>
                    <h4>
                      Please enter the 6-digit OTP received on your email.
                    </h4>
                  </div>

                  {/* OTP Input */}
                  <div className="text-center otp-input mb-3">
                    <div className="d-flex align-items-center justify-content-center">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          className="rounded mx-1 w-25 py-2 text-center fs-20 fw-bold"
                          maxLength={1}
                          value={otp[i] || ""}
                          onChange={(e) => handleOtpChange(e, i)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="mb-3">
                    <label className="form-label">
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;


// import React, { useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';
// import { toast } from 'react-toastify';

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
// const [step, setStep] = useState(1);
// const [otp, setOtp] = useState('');
// const [newPassword, setNewPassword] = useState('');

// const handleRequestOtp = async (e) => {
//   e.preventDefault();
//   try {
//     await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
//     toast.success('OTP sent to your email');
//     setStep(2);
//   } catch (err) {
//     alert(err.response?.data?.message || 'Failed to send OTP');
//   }
// };

// const handleVerifyOtp = async (e) => {
//   e.preventDefault();
//   try {
//     await axios.post(`${BASE_URL}/api/user/verify-otp-reset`, {
//       email,
//       otp,
//       newPassword
//     });
//     alert('Password reset successfully!');
//   } catch (err) {
//     alert(err.response?.data?.message || 'OTP verification failed');
//   }
// };


// return (
//   <div className="main-wrapper">
//         <div className="account-content">
//             <div className="login-wrapper forgot-pass-wrap bg-img">
//                 <div className="login-content authent-content">
//                    {step === 1 ? (
//       // <form onSubmit={handleRequestOtp}>
//       //   <h2>Forgot Password</h2>
//       //   <input
//       //     type="email"
//       //     placeholder="Enter email"
//       //     value={email}
//       //     onChange={(e) => setEmail(e.target.value)}
//       //     required
//       //   />
//       //   <button type="submit">Send OTP</button>
//       // </form>
//       <form onSubmit={handleRequestOtp}>
//                         <div className="login-userset">
//                             <div className="login-logo logo-normal">
//                                 <img src="assets/img/logo.svg" alt="img" />
//                             </div>
//                             <a href="index.html" className="login-logo logo-white">
//                                 <img src="assets/img/logo-white.svg" alt="Img" />
//                             </a>
//                             <div className="login-userheading">
//                                 <h3>Forgot password?</h3>
//                                 <h4>If you forgot your password, well, then we’ll email you instructions to reset your
//                                     password.</h4>
//                             </div>
//                             <div className="mb-3">
//                                 <label className="form-label">Email <span className="text-danger"> *</span></label>
//                                 <div className="input-group">
//                                     <input type="text"  className="form-control border-end-0"       value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required/>
//                                     <span className="input-group-text border-start-0">
//                                         <i className="ti ti-mail" />
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="form-login">
//                                 <button type="submit" className="btn btn-login">Send OTP</button>
//                             </div>
//                             <div className="signinform text-center">
//                                 <h4>Return to<a href="signin.html" className="hover-a"> login </a></h4>
//                             </div>

//                         </div>
//                     </form>
//     ) : (
//  <form onSubmit={handleVerifyOtp} className="digit-group">
//           <div className="login-userset">
//             <div className="login-logo logo-normal">
//               <img src="assets/img/logo.svg" alt="img" />
//             </div>
//             <a href="index.html" className="login-logo logo-white">
//               <img src="assets/img/logo-white.svg" alt="Img" />
//             </a>
//             <div>
//               <div className="login-userheading">
//                 <h3>Enter OTP and Reset Password</h3>
//                 <h4>Please enter the OTP received to confirm your account ownership. A code has been send to ******<a href="../../cdn-cgi/l/email-protection.html" className="__cf_email__" data-cfemail="90f4fff5d0f5e8f1fde0fcf5bef3fffd">[email&nbsp;protected]</a></h4>
//               </div>
//               <div className="text-center otp-input">
//                 <div className="d-flex align-items-center mb-3">
//                   <input type="text" className=" rounded w-100 py-sm-3 py-2 text-center fs-10 fw-bold me-3" id="digit-1" name="digit-1" data-next="digit-2" maxLength={1} />
//                   <input type="text" className=" rounded w-100 py-sm-3 py-2 text-center fs-10 fw-bold me-3" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" maxLength={1} />
//                   <input type="text" className=" rounded w-100 py-sm-3 py-2 text-center fs-10 fw-bold me-3" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" maxLength={1} />
//                   <input type="text" className=" rounded w-100 py-sm-3 py-2 text-center fs-10 fw-bold" id="digit-4" name="digit-4" data-next="digit-5" data-previous="digit-3" maxLength={1} />
//                 </div>
//                 <div>
//                   <div className="badge bg-danger-transparent mb-3">
//                     <p className="d-flex align-items-center "><i className="ti ti-clock me-1" />09:59</p>
//                   </div>
//                   <div className="mb-3 d-flex justify-content-center">
//                     <p className="text-gray-9">Didn't get the OTP? <a href="javascript:void(0);" className="text-primary">Resend OTP</a></p>
//                   </div>
//                 </div>
//               </div>
//               <div className="mb-3">
//                 <button type="submit" className="btn btn-primary w-100">Submit</button>
//               </div>
//             </div>
            
//           </div>
//         </form>

//       // <form onSubmit={handleVerifyOtp}>
//       //   <h2>Enter OTP and Reset Password</h2>
//       //   <input
//       //     type="text"
//       //     placeholder="OTP"
//       //     value={otp}
//       //     onChange={(e) => setOtp(e.target.value)}
//       //     required
//       //   />
//       //   <input
//       //     type="password"
//       //     placeholder="New Password"
//       //     value={newPassword}
//       //     onChange={(e) => setNewPassword(e.target.value)}
//       //     required
//       //   />
//       //   <button type="submit">Reset Password</button>
//       // </form>
//     )}
                    
//                 </div>
//             </div>
//         </div>
//     </div>
//   // <div className="form-container">
//   //   {step === 1 ? (
//   //     <form onSubmit={handleRequestOtp}>
//   //       <h2>Forgot Password</h2>
//   //       <input
//   //         type="email"
//   //         placeholder="Enter email"
//   //         value={email}
//   //         onChange={(e) => setEmail(e.target.value)}
//   //         required
//   //       />
//   //       <button type="submit">Send OTP</button>
//   //     </form>
//   //   ) : (
//   //     <form onSubmit={handleVerifyOtp}>
//   //       <h2>Enter OTP and Reset Password</h2>
//   //       <input
//   //         type="text"
//   //         placeholder="OTP"
//   //         value={otp}
//   //         onChange={(e) => setOtp(e.target.value)}
//   //         required
//   //       />
//   //       <input
//   //         type="password"
//   //         placeholder="New Password"
//   //         value={newPassword}
//   //         onChange={(e) => setNewPassword(e.target.value)}
//   //         required
//   //       />
//   //       <button type="submit">Reset Password</button>
//   //     </form>
//   //   )}
//   // </div>
// );

// }

// export default ForgotPassword;