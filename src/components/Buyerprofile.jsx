import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BuyerProfile.scss';

const BuyerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', phone: '' });
    const [newLocation, setNewLocation] = useState({
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        place: 'home',
    });
    const [addresses, setAddresses] = useState([]);
    const [editLocation, setEditLocation] = useState(null); // Track address being edited
    const [showLocationForm, setShowLocationForm] = useState(false); // Toggle form visibility

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLocationChange = (e) => setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    const toggleEdit = () => setIsEditing(!isEditing);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/buyer", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFormData(res.data.buyer);
        } catch (error) {
            console.error("Error fetching buyer data:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/displayaddress", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200 && response.data.length > 0) {
                setAddresses(response.data);
            } else {
                console.log("No addresses found.");
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const saveProfile = async () => {
        try {
            await axios.put("http://localhost:3000/api/editbuyer", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const saveLocation = async () => {
        try {
            if (editLocation) {
                // Update existing address
                await axios.put(`http://localhost:3000/api/editaddress/${editLocation._id}`, newLocation, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEditLocation(null); // Reset after update
            } else {
                // Add new address
                await axios.post("http://localhost:3000/api/address", newLocation, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setNewLocation({ pincode: '', locality: '', address: '', city: '', state: '', landmark: '', place: 'home' });
            setShowLocationForm(false); // Hide form after save
            fetchAddresses();
        } catch (error) {
            console.error("Error saving location:", error);
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            await axios.delete(`http://localhost:3000/api/deleteaddress/${addressId}`);
            setAddresses((prevAddresses) => prevAddresses.filter(address => address._id !== addressId));
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const handleEditAddress = (address) => {
        setEditLocation(address); // Set the address data to be edited
        setNewLocation({ ...address }); // Pre-fill the edit form with address data
        setShowLocationForm(true); // Show form for editing
    };

    const handleAddLocation = () => {
        setEditLocation(null); // Reset edit state to add new address
        setShowLocationForm(true); // Show form for adding
    };

    useEffect(() => {
        fetchData();
        fetchAddresses();
    }, []);

    return (
        <div className="buyer-profile-container">
            <div className="buyer-profile-left">
                {/* Profile Section */}
                <h2>Buyer Profile</h2>
                <div className="buyer-profile-item">
                    <label>Username:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{formData.username}</span>
                    )}
                </div>
                <div className="buyer-profile-item">
                    <label>Email:</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{formData.email}</span>
                    )}
                </div>
                <div className="buyer-profile-item">
                    <label>Phone:</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{formData.phone}</span>
                    )}
                </div>
                <button onClick={toggleEdit} className="buyer-edit-btn">
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                {isEditing && <button onClick={saveProfile} className="buyer-save-btn">Save Changes</button>}
            </div>

            <div className="buyer-profile-right">
                {/* Add or Edit Address Section */}
                <div className="buyer-actions">
                    <button onClick={handleAddLocation} className="buyer-add-location-btn">+</button>
                    <button className="buyer-cart-btn">Cart</button>
                    <button className="buyer-wishlist-btn">Wishlist</button>
                    <button className="buyer-orders-btn">My Orders</button>
                </div>
                <hr />
                {showLocationForm && (
                    <div className="buyer-add-location-form">
                        <div className="buyer-form-row">
                            {['pincode', 'locality', 'address', 'city', 'state', 'landmark'].map(field => (
                                <div className="buyer-profile-item" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={newLocation[field]}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="buyer-form-row">
                            <label>
                                <input
                                    type="radio"
                                    name="place"
                                    value="home"
                                    checked={newLocation.place === 'home'}
                                    onChange={handleLocationChange}
                                />
                                Home
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="place"
                                    value="work"
                                    checked={newLocation.place === 'work'}
                                    onChange={handleLocationChange}
                                />
                                Work
                            </label>
                        </div>
                        <button onClick={saveLocation} className="buyer-save-location-btn">
                            {editLocation ? 'Save Changes' : 'Save'}
                        </button>
                    </div>
                )}

                {/* Address List Section */}
                <div className="buyer-address-list">
                    {addresses.map(address => (
                        <div key={address._id} className="buyer-address-item">
                            <div className="buyer-address-item-box">
                                <label>Address</label>
                                <p>{`${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Landmark: ${address.landmark}. Place: ${address.place}`}</p>
                                <div className="buyer-address-item-buttons">
                                    <button onClick={() => handleEditAddress(address)} className="buyer-edit-button">Edit</button>
                                    <button onClick={() => deleteAddress(address._id)} className="buyer-delete-button">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
