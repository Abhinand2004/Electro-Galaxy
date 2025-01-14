import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Alert } from '@mui/material';
import './Passchange.scss';
import Url from '../assets/root';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pwd: "",
        cpwd: "",
        email: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.email = localStorage.getItem("email");
        const { pwd, cpwd } = formData;

       
        if (pwd !== cpwd) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.put(`${Url}/passchange`, formData);

            if (res.status === 200) {
                setSuccess('Password changed successfully');
                localStorage.removeItem('email')
                navigate("/login");
            } else {
                setError('Password change failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="change-password-container">
        <form className="change-password-form" onSubmit={handleSubmit}>
            <Typography variant="h4" component="h2" gutterBottom>
                Change Password
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <TextField
                label="New Password"
                type="password"
                name="pwd"
                value={formData.pwd}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />

            <TextField
                label="Confirm Password"
                type="password"
                name="cpwd"
                value={formData.cpwd}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />

            <Button type="submit" variant="contained" color="primary" className="change-password-btn">
                Change Password
            </Button>

            <div className="links">
                <Typography variant="body2">
                    Remember your password? <Link to="/login">Login</Link>
                </Typography>
            </div>
        </form>
        </div>
    );
};

export default ChangePassword;