import React, { useState } from 'react';
import axios from 'axios';
import './Register.scss'; 
const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        acctype: 'buyer',
        pwd: '',
        cpwd: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.pwd || !formData.cpwd) {
            alert('Please fill out all fields.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3000/api/register', formData);
    
            if (res.status === 200) {
                alert('Registration successful');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration. Please try again later.');
        }
    };
    

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input  type="text"  id="username" name="username" value={formData.username}   onChange={handleChange}   required/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel"  id="phone" name="phone" value={formData.phone} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="userType">User Type</label>
                    <select id="userType" name="acctype" value={formData.acctype} onChange={handleChange} required>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="pwd" value={formData.pwd} onChange={handleChange} required    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input   type="password" id="confirmPassword" name="cpwd" value={formData.cpwd} onChange={handleChange} required/>
                </div>
                <div className="form-actions">
                    <button type="submit" className="register-btn">Register</button>
                    <button type="button" className="login-btn">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
