import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
const Login = () => {
    const Navigate=useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        pass: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (formData.email === "" || formData.pass === "") {
            alert("Please fill in all fields");
            return;
        }
        try {
            const res=await axios.post("http://localhost:3000/api/login",formData);
            if(res.status===200){
                alert("Login successful");
                console.log(res.data.token);
                localStorage.setItem("token",res.data.token);
                Navigate("/")
            }
            else{
                alert("Login failed");
            }
        } catch (error) {
            alert("An error occurred during login. Please try again later.");
        }
        
    };

   

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="pass" value={formData.pass} onChange={handleChange} required/>
                </div>
                <div className="form-actions">
                    <button type="submit" className="login-btn">Login</button>
                </div>
                <div className="links">
                    <p>Don't have an account? <Link to={"/register"}><span>Register</span></Link></p>
                    <p>Forgot your password?<Link to={"/changepass"}> <span >Click here</span></Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
