import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Passchange.scss';

const ChangePassword = () => {

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
formData.email=localStorage.getItem("email");
        const { pwd, cpwd, email } = formData;

        // Check if passwords match
        if (pwd !== cpwd) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Send formData directly to the server
            const res = await axios.put("http://localhost:3000/api/passchange", formData);

            if (res.status === 200) {
                setSuccess('Password changed successfully');
                localStorage.removeItem("email");
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
                <h2>Change Password</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="pwd"
                        value={formData.pwd}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="cpwd"
                        value={formData.cpwd}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="change-password-btn">Change Password</button>
                </div>

                <div className="links">
                    <p>Remember your password? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
