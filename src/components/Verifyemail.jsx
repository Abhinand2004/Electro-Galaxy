import React, { useState } from 'react';
import axios from 'axios';
import './Verifyemail.scss';
import { Link } from 'react-router-dom';
import Url from '../assets/root';
const VerifyEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        
      try {
        if (!email) {
            setMessage('Please enter an email address.');
            return;
        }
        const res=await axios.post (`${Url}/verifyemail`  ,{email});
        if(res.status===200){
            localStorage.setItem("email",email)
            setMessage("Verification email sent successfully");
        }
        else{
            setMessage("Verification email failed to send");
        }
      } catch (error) {
        alert("email donot exist")
      }
        
    };


    return (
        <div className="verify-email-container">
            <form className="verify-email-form" onSubmit={handleVerify}>
                <h2>Verify Your Email</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
                </div>
                {message && <p className="message">{message}</p>}
                <div className="form-actions">
                    <button type="submit" className="verify-btn">Verify Email</button>
                </div>
                <div className="login-link">
                    <p>Already have an account? <Link to={"/login"}><span>Login</span></Link></p>
                </div>
            </form>
        </div>
    );
};

export default VerifyEmail;
