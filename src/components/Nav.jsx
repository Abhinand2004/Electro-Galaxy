import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nav.scss';
import profileImage from "../assets/profile.jpg"; // Renamed to avoid conflict
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate(); // Fixed capitalization
    const [showDropdown, setShowDropdown] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => { // Renamed to camelCase
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

    const handleProfileNavigation = () => { // Renamed function
        if (user.acctype === "buyer") {
            navigate("/bprofile");
        } else {
            navigate("/sprofile");
        }
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
                <img src="path_to_your_logo.png" alt="Logo" />
            </div>

            <div className="search-bar">
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
            </div>

            <div className="right-section">
                {!token ? (
                    <button className="login-btn" onClick={() => window.location.href = '/login'}>Login</button>
                ) : (
                    <div className="profile-container">
                        <span className="username">{user.username}</span>
                        <div className="profile-wrapper" onClick={handleProfileClick}>
                            <img
                                src={profileImage} // Use the renamed variable here
                                alt="Profile"
                                className="profile-img"
                            />
                        </div>
                        {showDropdown && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={handleProfileNavigation}>Profile</li> {/* Updated function call */}
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
