import React, { useState } from 'react';
import axios from 'axios';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import Url from '../assets/root';
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', pass: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email === "" || formData.pass === "") {
            alert("Please fill in all fields");
            return;
        }
        try {
            const res = await axios.post(`${Url}/login`, formData);
            if (res.status === 200) {
                alert("Login successful");
                localStorage.setItem("token", res.data.token);
                navigate("/");
window.location.reload();

            } else {
                alert("Login failed");
            }
        } catch (error) {
            alert("incorrect Username or password");
        }
    };

    return (
        <Container className="login-container">
            <div className="mobile-screen">
                <form className="login-form" onSubmit={handleSubmit}>
                    <Typography variant="h4" component="h2" className="login-title">Login</Typography>
                    <TextField
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        className="login-input"
                    />
                    <TextField
                        type="password"
                        id="password"
                        name="pass"
                        label="Password"
                        variant="outlined"
                        value={formData.pass}
                        onChange={handleChange}
                        required
                        fullWidth
                        className="login-input"
                    />
                    <div className="form-actions">
                        <Button 
                            type="submit" 
                            variant="contained" 
                            className="login-btn-unique" 
                            color="primary">
                            Login
                        </Button>
                    </div>
                    <div className="links">
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                        <p>Forgot your password? <Link to="/verify">Click here</Link></p>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default Login;