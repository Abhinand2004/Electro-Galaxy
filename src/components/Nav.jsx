import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nav.scss';
import profileImage from "../assets/profile.jpg"; 
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate(); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => { 
        try {
            const res = await axios.get("http://localhost:3000/api/navdata", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setUser(res.data.user);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
    };

    const handleProfileNavigation = () => { 
        if (user.acctype === "buyer") {
            navigate("/bprofile");
        } else {
            navigate("/sprofile");
        }
        setShowDropdown(false); // Close dropdown after navigating
    };

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <span className="logo-text">Electro-Galaxy</span>
            </div>

            <div className="search-bar">
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                    placeholder="Search..." 
                    className="search-input"
                />
            </div>

            <div className="right-section">
                {!token ? (
                    <button className="login-btn" onClick={() => window.location.href = '/login'}>Login</button>
                ) : (
                    <div className="profile-container">
                        <span className="username">{user.username}</span>
                        <div className="profile-wrapper" onClick={handleProfileClick}>
                            <img
                                src={profileImage} 
                                className="profile-img"
                                alt="Profile"
                            />
                        </div>
                        {showDropdown && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={handleProfileNavigation}>Profile</li> 
                                    <li onClick={handleLogout}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Nav;
