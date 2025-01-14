import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nav.scss';
import profileImage from "../assets/profile.jpg";
import logoImage from "../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import Url from '../assets/root';
import { FaHome, FaShoppingCart, FaHeart, FaBoxOpen, FaEnvelope } from 'react-icons/fa'; 

const Nav = ({ setName }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNavLinks, setShowNavLinks] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState('');

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

    useEffect(() => {
        if (location.pathname === '/') {
            // Refresh or fetch data logic when navigating to homepage
            fetchData(); // Or any other function to fetch/display data
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.href = '/login';
    };

    const handleProfileNavigation = () => {
        navigate("/bprofile");
        setShowDropdown(false);
    };

    const handleNavigation = (path) => {
        if (token) {
            navigate(path);
        } else {
            navigate('/login');
        }
        setShowNavLinks(false); // Close the nav links after navigation
    };

    return (
        <nav className="navbar">
            <div className="left-section">
                <div className="logo" onClick={() => handleNavigation('/')}>
                    <span className="company-name">Electro-Galaxy</span>
                    <img src={logoImage} alt="Electro-Galaxy Logo" className="logo-img" />
                </div>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className={`nav-links ${showNavLinks ? 'active' : ''} navi`}>
                <a onClick={() => handleNavigation('/')} className="nav-item"><FaHome /></a>
                <a onClick={() => handleNavigation('/cart')} className="nav-item"><FaShoppingCart /></a>
                <a onClick={() => handleNavigation('/wishlist')} className="nav-item"><FaHeart /></a>
                {user.acctype === "seller" && (
                    <>
                        <a onClick={() => handleNavigation('/sprofile')} className="nav-item">Seller</a>
                        <a onClick={() => handleNavigation('/sellerorders')} className="nav-item"><FaEnvelope /></a>
                    </>
                )}
            </div>

            <button className="menu-btn" onClick={() => setShowNavLinks(!showNavLinks)}></button>

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
                                <button onClick={handleProfileNavigation}>Profile</button>
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
