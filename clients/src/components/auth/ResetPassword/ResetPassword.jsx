// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';

// function ResetPassword() {
//   const { token } = useParams();
//   const [newPassword, setNewPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, { newPassword });
//       alert(res.data.message);
//     } catch (err) {
//       alert(err.response.data.message || 'Reset failed');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Reset Your Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Reset Password</button>
//       </form>
//     </div>
//   );
// }

// export default ResetPassword;



import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../../pages/config/config.js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import MuncLogo from "../../../assets/img/logo/munclogotm.png";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/verify-otp-reset`, {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper forgot-pass-wrap bg-img">
          <div className="login-content authent-content">
            <form onSubmit={handleReset}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img src={MuncLogo} alt="logo" />
                </div>

                <div className="login-userheading">
                  <h3>Reset Your Password</h3>
                  <h4>
                    Please enter your new password below and confirm it to reset
                    your account password.
                  </h4>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-login">
                  <button type="submit" className="btn btn-login">
                    Reset Password
                  </button>
                </div>

                <div className="signinform text-center">
                  <h4>
                    Remember your password?{" "}
                    <span
                      className="hover-a"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/login")}
                    >
                      Login Instead
                    </span>
                  </h4>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
