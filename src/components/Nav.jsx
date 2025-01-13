import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nav.scss';
import profileImage from "../assets/profile.jpg";
import logoImage from "../assets/logo.png"; // Import your logo here
import { useNavigate } from 'react-router-dom';
import Url from '../assets/root';

const Nav = () => {
    const navigate = useNavigate(); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState('');
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
     
            navigate("/bprofile");
       
        setShowDropdown(false); 
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search query:", searchQuery);
    };

    return (
        <nav className="navbar">
            <div className="left-section">
                <div className="logo">
                    <img src={logoImage} alt="Electro-Galaxy Logo" className="logo-img" />
                </div>

                
            </div>
            <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="search-input" 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)} 
                    />
                </div>
            <div className="nav-links">
                <a href="/" className="nav-item">Home</a>
                <a href="/cart" className="nav-item">Cart</a>
                <a href="/wishlist" className="nav-item">Wishlist</a>
                {user.acctype === "seller" && (
 <>
 <a href="/sprofile" className="nav-item">Seller Profile</a>
 <a href="/sellerorders" className="nav-item">Orders</a>
</>                )}
            </div>

            <div className="right-section">
                {!token ? (
                    <button className="login-btn" onClick={() => window.location.href = '/login'}>Login</button>
                ) : (
                    <div className="profile-container">
                        <span className="username">{user.username}</span>
                        <div className="profile-img-container" onClick={() => setShowDropdown(!showDropdown)}>
                            <img src={profileImage} alt="Profile" className="profile-img" />
                        </div>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={handleProfileNavigation}>
                                   profile
                                </button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Nav;
