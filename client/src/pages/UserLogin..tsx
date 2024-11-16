import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseUrl from '../utils/Url';

const UserLoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string>('');
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(()=>{
    const email = localStorage.getItem('userEmail')

    if(email){
      navigate('/')
    }
  })

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "") {
      setError("Email address is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    console.log(email, 'This is email');

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}api/user/login`, { email });

      console.log(response, 'This is response');

      if (response.status === 201) {
        setError(`${response.data.message}`);
      } else if (response.status === 200) {
        setShowOtp(true);
      }
      setLoading(false);
    } catch (error: any) {
      setError(`${error.message}`);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(otp, 'this is otp submitting');

    if (!otp) {
      setOtpError('OTP is required');
      return;
    } else if (otp.length < 4) {
      setOtpError('OTP should contain 4 digits');
      return;
    }

    try {
      setShowLoading(true);
      const response = await axios.post(`${baseUrl}api/user/verify-otp`, { otp,email });

      console.log(response, 'This is response from verify otp');

      if (response.status === 201) {
        setOtpError(response.data.message);
        setShowLoading(false);
        return;
      } else if (response.status === 200) {

        localStorage.setItem('userAccessToken', response.data.AccessToken);
        localStorage.setItem('userRefreshToken', response.data.RefreshToken);
        localStorage.setItem('userEmail',email)

        navigate('/');
        setShowLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#483D8B",
      }}
    >
      <div className="container" style={{ maxWidth: "600px", minHeight: "400px"}}>
        <div className="card p-5">
          <h3 className="text-start mb-5"> Please Login Here ...</h3>
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {!showOtp &&
                <button type="submit" className="btn btn-primary w-50">
                  {loading ? 'SENDING OTP' : 'SUBMIT'}
                </button>}
            </div>
          </form>
          {
            showOtp &&
            <form onSubmit={handleOtpSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="otp" className="form-label">
                  Enter OTP
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {otpError && <div className="text-danger mt-2">{otpError}</div>}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button type="submit" className="btn btn-primary w-50">
                  {showLoading ? 'SUBMITTING OTP' : 'SUBMIT OTP'}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
