import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BuyerProfile.scss';

const BuyerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', phone: '' });
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [newLocation, setNewLocation] = useState({
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        place: 'home',  // Default value
    });
    const [addresses, setAddresses] = useState([]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLocationChange = (e) => setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    const toggleEdit = () => setIsEditing(!isEditing);
    const toggleAddLocation = () => setShowAddLocation(!showAddLocation);

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
            await axios.post("http://localhost:3000/api/address", newLocation, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewLocation({ pincode: '', locality: '', address: '', city: '', state: '', landmark: '', place: 'home' });
            setShowAddLocation(false);
            fetchAddresses();
        } catch (error) {
            console.error("Error adding location:", error);
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            await axios.delete(`http://localhost:3000/api/deleteaddress/${addressId}`);
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchAddresses();
    }, []);

    return (
        <div className="profile-container">
            <div className="left-side">
                <h2>Buyer Profile</h2>
                {/* Directly writing the fields without using map */}
                <div className="profile-item">
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
                <div className="profile-item">
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
                <div className="profile-item">
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
                <button onClick={toggleEdit} className="edit-btn">
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                {isEditing && <button onClick={saveProfile} className="save-btn">Save Changes</button>}
            </div>
            <div className="right-side">
                <div className="profile-actions">
                    <button onClick={() => console.log('Go to Wishlist')} className="profile-btn">Wishlist</button>
                    <button onClick={() => console.log('Go to My Orders')} className="profile-btn">My Orders</button>
                    <button onClick={() => console.log('Go to Cart')} className="profile-btn">Cart</button>
                    <button onClick={toggleAddLocation} className="add-location-btn">+</button>
                </div>
                <hr />
                {showAddLocation && (
                    <div className="add-location-form">
                        <div className="form-row">
                            {['pincode', 'locality', 'address', 'city', 'state', 'landmark'].map(field => (
                                <div className="profile-item" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={newLocation[field]}
                                        onChange={handleLocationChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="form-row">
                            {/* Static radio buttons for 'home' and 'work' */}
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
                        <button onClick={saveLocation} className="save-location-btn">Save</button>
                    </div>
                )}
                <div className="address-list">
                    {addresses.map(address => (
                        <div key={address._id} className="address-item">
                            <label htmlFor="">Address</label>
                            <p>{`${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Landmark: ${address.landmark}. Place: ${address.place}`}</p>
                            <button className='edit-button'>Edit</button>
                            <button onClick={() => deleteAddress(address._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;
