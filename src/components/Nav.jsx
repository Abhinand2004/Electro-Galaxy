import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nav.scss';
import profileImage from "../assets/profile.jpg";
import logoImage from "../assets/logo.png"; // Import your logo here
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import Url from '../assets/root';
const Nav = () => {
    const navigate = useNavigate(); 
    const [showDropdown, setShowDropdown] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser ] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => { 
        try {
            const res = await axios.get(`${Url}/navdata`, {
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
        setShowDropdown(null); // Close dropdown after navigating
    };

    const handleProfileClick = (event) => {
        setShowDropdown(event.currentTarget);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <AppBar position="static">
            <Toolbar className="navbar">
                <div className="logo">
                    <img src={logoImage} alt="Electro-Galaxy Logo" className="logo-img" />
                </div>

                <div className="search-bar">
                    <div className="search-icon">
                        <SearchIcon />
                    </div>
                    <InputBase 
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
                            <IconButton onClick={handleProfileClick}>
                                <img
                                    src={profileImage} 
                                    className="profile-img"
                                    alt="Profile"
                                />
                            </IconButton>
                            <Menu
                                anchorEl={showDropdown}
                                open={Boolean(showDropdown)}
                                onClose={() => setShowDropdown(null)}
                            >
                                <MenuItem onClick={handleProfileNavigation}>Profile</MenuItem> 
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Nav;
