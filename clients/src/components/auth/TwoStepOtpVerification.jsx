import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../pages/config/config';
import { toast } from 'react-toastify';
import '../../styles/OtpVerification.css'
import TwoStepImage from '../../assets/images/twostep.png';
import Munc from '../../assets/img/logo/munclogotm.png';
import { jwtDecode } from "jwt-decode";


//two step otp verification component
const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(30); // 30s cooldown
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);


  useEffect(() => {
  const check2FA = async () => {
    const twoFAToken = localStorage.getItem("twoFAToken");
    if (twoFAToken) {
      try {
        const decoded = jwtDecode(twoFAToken);
        if (decoded.exp > Date.now() / 1000) {
          toast.success("2FA already verified. Redirecting...");
          navigate("/dashboard");
          return;
        } else {
          localStorage.removeItem("twoFAToken");
        }
      } catch (error) {
        console.error("Invalid 2FA token", error);
        localStorage.removeItem("twoFAToken");
      }
    }
  };
  check2FA();
}, [navigate]);


  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      toast.error("No email found for OTP verification");
      navigate("/login");
    }
  }, [location.state, navigate]);

  // countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // allow only numbers


    const newOtp = [...otp];
    newOtp[index] = value ? value.slice(-1) : ""; // take only last digit
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email,
        otp: otpCode,
      });

      if (res?.data?.token && res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data?.user?._id);

          // ✅ Store the 2FA token
  if (res?.data?.twoFAToken) {
    localStorage.setItem("twoFAToken", res.data.twoFAToken);
  }

        toast.success("OTP Verified Successfully", {
          position: 'top-center',
        });

        await logDeviceSession(res.data?.user?._id);
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP");
        setOtp(new Array(6).fill(""));  //clear otp fields
        inputRefs.current[0].focus();   //focus first input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      setOtp(new Array(6).fill(""));  //clear otp fields
      inputRefs.current[0].focus();   //focus first input
      console.error("OTP verification error:", error);
    }
  };

  const logDeviceSession = async (userId) => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.post(
            `${BASE_URL}/api/auth/log-device`,
            { userId, latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // console.log("Device logged:", res.data);
        } catch (err) {
          console.error(
            "Device log failed:",
            err.response?.data || err.message
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/resend-otp`, { email });
      toast.success(res.data.message || "OTP resent successfully");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
      setTimer(30); // reset timer
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };



  return (
    <div className="twostep-page">
      <div className="twostep-left">
        <div className="twostep-box">
          <p>
            <img src={Munc} alt="mnc" />
          </p>
          <h2 className="twostep-title">2 Step Verification</h2>
          <p className="twostep-subtitle">
            Please enter the OTP received to confirm your account ownership.{" "}
            <br />
            A code has been sent to <b>{email}</b>
          </p>

          <form onSubmit={handleVerifyOtp} className="twostep-form">
            <div className="twostep-otp-boxes">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="twostep-otp-input"
                />
              ))}
            </div>

            <div className="twostep-resend">
              {timer > 0 ? (
                <p className="resend-text">Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}s</p>
              ) : (
                <p className="resend-action" onClick={!isResending ? handleResendOtp : null}>
                  Didn't get the OTP? <span>{isResending ? "Resending..." : "Resend OTP"}</span>
                </p>
              )}
            </div>

            <button type="submit" className="twostep-submit-btn">
              Submit
            </button>
          </form>
          <p className="twostep-footer">Copyright © 2025 Munches</p>
        </div>
      </div>

      <div className="twostep-right">
        <img
          src={TwoStepImage}
          alt="OTP illustration"
          className="twostep-image"
        />
      </div>
    </div>

  );
};

export default OtpVerification;
