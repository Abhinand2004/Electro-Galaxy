import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BuyerProfile.scss';

const BuyerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        location: [], 
    });
    const [newLocation, setNewLocation] = useState(''); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);
        try {
            const res = await axios.put("http://localhost:3000/api/editbuyer", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log(res.data);
        } catch (error) {
            console.error("Error updating buyer data:", error);
        }
    };

    const handleAddLocation = () => {
        if (newLocation) {
            setFormData({ ...formData, location: [...formData.location, newLocation] });
            setNewLocation('');
            handleSaveClick()
            
        } else {
            alert('Please enter a valid location');
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/buyer", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setFormData({
                username: res.data.buyer.username,
                email: res.data.buyer.email,
                phone: res.data.buyer.phone,
                location: res.data.buyer.location || [],
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="profile-container">
            <div className="left-side">
                <h2>Buyer Profile</h2>
                <div className="profile-info">
                    <div className="profile-item">
                        <label>Username:</label>
                        {isEditing ? (
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                        ) : (
                            <span>{formData.username}</span>
                        )}
                    </div>
                    <div className="profile-item">
                        <label>Email:</label>
                        {isEditing ? (
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        ) : (
                            <span>{formData.email}</span>
                        )}
                    </div>
                    <div className="profile-item">
                        <label>Phone Number:</label>
                        {isEditing ? (
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        ) : (
                            <span>{formData.phone}</span>
                        )}
                    </div>
                </div>

                <button onClick={handleEditClick} className="edit-btn">
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                {isEditing && (
                    <button onClick={handleSaveClick} className="save-btn">
                        Save Changes
                    </button>
                )}
            </div>

            <div className="right-side">
                <div className="profile-actions">
                    <button onClick={() => console.log('Go to Wishlist')} className="profile-btn">Wishlist</button>
                    <button onClick={() => console.log('Go to My Orders')} className="profile-btn">My Orders</button>
                    <button onClick={() => console.log('Go to Cart')} className="profile-btn">Cart</button>
                </div>

                <hr />

                <div className="location-section">
                    <h3>Locations</h3>
                    <div className="location-input">
                        <input
                            type="text"
                            placeholder="Add a new location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        <button onClick={handleAddLocation} className="add-location-btn">
                            Add Location
                        </button>
                    </div>
                    <ul className="location-list">
                        {formData.location.map((location, index) => (
                            <li key={index} className="location-item">
                                <span>{location}</span>
                                <button className="delete-btn">Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
