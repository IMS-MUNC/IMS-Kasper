import React, { useState } from 'react';
import axios from 'axios';
import MuncLogo from "../../../assets/img/logo/munclogotm.png";
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import BASE_URL from '../../../pages/config/config';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Please agree to the terms and privacy policy.");
      return;
    }

    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    try {
      // ✅ POST request to mock API
      // const res = await axios.post('http://localhost:3000/users', user);
      await axios.post(`${BASE_URL}/api/users/register`, user);


      // console.log('User saved:', res.data);
      alert('User Registered Successfully!');
      navigate('/login');  // Navigate to dashboard
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });

    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to register. Please try again!');
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper register-wrap bg-img">
          <div className="login-content authent-content">
            <form onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <img src={MuncLogo} alt="img" />
                </div>

                <div className="login-userheading">
                  <h3>Register</h3>
                  <h4>Create New Account</h4>
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name <span className="text-danger"> *</span></label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control border-end-0"
                      required
                    />
                    <span className="input-group-text border-start-0">
                      <FiUser />
                    </span>
                  </div>
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
                    />
                    <span
                      className="input-group-text border-start-0 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password <span className="text-danger"> *</span></label>
                  <div className="pass-group input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pass-inputs form-control border-end-0"
                      required
                    />
                    <span
                      className="input-group-text border-start-0 cursor-pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </div>

                {/* Terms */}
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-sm-8">
                      <div className="custom-control custom-checkbox justify-content-start">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                          />
                          <span className="checkmarks" /> I agree to the <a href="#" className="text-primary">Terms &amp; Privacy</a>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="form-login">
                  <button type="submit" className="btn btn-login">Sign Up</button>
                </div>

                <div className="signinform">
                  <h4>Already have an account ? <Link to="/login" className="hover-a">Sign In Instead</Link></h4>
                </div>

                <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2025 Kasper Infotech Pvt. Ltd.</p>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;