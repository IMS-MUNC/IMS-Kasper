import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../pages/config/config';
import { toast } from 'react-toastify';
// import '../../styles/OtpVerification.css'

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      toast.error("No email found for OTP verification");
      navigate("/login");
    }
  }, [location.state, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        email,
        otp,
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data?.token && res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data?.user?._id);

        toast.success("OTP Verified Successfully", {
          position: 'top-center',
        });

        await logDeviceSession(res.data?.user?._id);
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      console.error("OTP verification error:", error);
    }
  };

  const logDeviceSession = (userId) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axios.post(`${BASE_URL}/api/auth/log-device`, {
            userId,
            latitude,
            longitude,
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
      );
    }
  };

  return (
    <div className="otp-verification-page">
      <form onSubmit={handleVerifyOtp} className="otp-form">
        <h3>Enter the OTP sent to your email</h3>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpVerification;
