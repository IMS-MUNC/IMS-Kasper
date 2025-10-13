import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../styles/login.css";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import MuncLogo from "../../../assets/img/logo/munclogotm.png";
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // state for two factor authentication
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [emailForOtp, setEmailForOtp] = useState("")
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // handle verify for two factor authentication
  //   const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
  //       email: emailForOtp,
  //       otp: otp,
  //        headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (res?.data?.token && res?.data?.user) {
  //       localStorage.setItem("user", JSON.stringify(res.data.user));
  //   localStorage.setItem("token", res.data.token);
  //       toast.success("OTP Verified Successfully", {
  //         position: 'top-center',
  //       });

  //       localStorage.setItem("userId", res.data?.user?._id);
  //       await logDeviceSession(res.data?.user?._id);
  //       navigate("/dashboard");
  //     } else {
  //       // fallback if no success key but still error-like
  //       toast.error("Invalid OTP");
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Invalid OTP");
  //     console.error("OTP verification error:", error);
  //   }
  // }

  //   // for device management
  //   const logDeviceSession = (userId) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           axios.post(`${BASE_URL}/api/auth/log-device`, {
  //             userId,
  //             latitude,
  //             longitude,
  //           })
  //             .then((res) => console.log("Device logged:", res.data))
  //             .catch((err) => console.error("Device log failed:", err.response?.data || err.message));
  //         },
  //         (error) => {
  //           console.error("Geolocation error:", error)
  //         }
  //       )
  //     } else {
  //       console.warn("Geolocation not supported")
  //     }
  //   }


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // <-- Add this line
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email: emailForOtp,
        otp: otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data?.token && res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success("OTP Verified Successfully", {
          position: 'top-center',
        });

        localStorage.setItem("userId", res.data?.user?._id);
        await logDeviceSession(res.data?.user?._id);
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      console.error("OTP verification error:", error);
    }
  }

  // for device management
  const logDeviceSession = (userId) => {
    const token = localStorage.getItem("token"); // <-- Add this line
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axios.post(`${BASE_URL}/api/auth/log-device`, {
            userId,
            latitude,
            longitude,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => console.log("Device logged:", res.data))
            .catch((err) => console.error("Device log failed:", err.response?.data || err.message));
        },
        (error) => {
          console.error("Geolocation error:", error)
        }
      )
    } else {
      console.warn("Geolocation not supported")
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;   // prevent multiple submits
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      let normalizedUser = null;

      if (res?.data?.token && res?.data?.user) {
        const user = res.data.user;
        normalizedUser = {
          ...user,
          _id: user._id || user.id,
        }
        //  Save user and token to localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(normalizedUser)); // <-- Add this
      }
      // for two factor
      if (res.data.twoFactor === true) {
        toast.info("Otp sent to you email")
        navigate("/otp", { state: { email: formData.email } })
        return;
      }
      // const userId = res.data?.user?._id || res.data?.user?.id;
      localStorage.setItem("userId", normalizedUser._id)

      await logDeviceSession(normalizedUser._id);

      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      //reset loading here if login fails
      setLoading(false);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };


  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content authent-content">
            <form onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img src={MuncLogo} alt="img" />
                </div>

                <div className="login-userheading">
                  <h3>Sign In</h3>
                  <h4 className="fs-16">Access the munches panel using your email and passcode.</h4>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email <span className="text-danger"> *</span></label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control border-end-0"
                      placeholder='Enter your email'
                      required
                    />
                    <span className="input-group-text border-start-0">
                      <MdOutlineEmail />
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password <span className="text-danger"> *</span></label>
                  <div className="pass-group input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pass-input form-control border-end-0"
                      required
                      placeholder='Enter your password'
                    />
                    <span
                      className="input-group-text border-start-0 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </div>

                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
                          <input type="checkbox" className="form-control" />
                          <span className="checkmarks" />Remember me
                        </label>
                      </div>
                      <div className="text-end">
                        <Link to="/forgot-password" className="text-orange fs-16 fw-medium">Forgot Password?</Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-login">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing..." : "Sign In"}</button>
                </div>

                {/* <div className="signinform">
                  <h4>New on our platform?<Link to="/register" className="hover-a"> Create an account</Link></h4>
                </div> */}

                <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2025 Kasper Infotech Pvt. Ltd.</p>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;