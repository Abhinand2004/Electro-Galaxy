import React, { useState } from 'react';
import axios from 'axios';
import './Register.scss'; 
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import Url from '../assets/root';
import logo from '../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
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
            const res = await axios.post(`${Url}/register`, formData);
            if (res.status === 200) {
                alert('Registration successful');
                navigate("/login");
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
                <div className="register-header">
                    <img src={logo} alt="Logo" className="register-logo" />
                    <h2 className="register-title">Register</h2>
                </div>
                <TextField
                    className="register-username"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className="register-email"
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className="register-phone"
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className="register-acctype"
                    label="User Type"
                    name="acctype"
                    value={formData.acctype}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    select
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </TextField>
                <TextField
                    className="register-password"
                    label="Password"
                    type="password"
                    name="pwd"
                    value={formData.pwd}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className="register-confirm-password"
                    label="Confirm Password"
                    type="password"
                    name="cpwd"
                    value={formData.cpwd}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <div className="form-actions">
                    <Button type="submit" variant="contained" className="register-btn">Register</Button>
                    <Link to="/login">
                        <Button type="button" variant="outlined" className="login-btn">Login</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
