import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BuyerProfile.scss';
import Url from '../assets/root';
import { Navigate, useNavigate } from 'react-router-dom';
const BuyerProfile = () => {
    const Navigate=useNavigate()
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
    const [editLocation, setEditLocation] = useState(null);
    const [showLocationForm, setShowLocationForm] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLocationChange = (e) => setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
    const toggleEdit = () => setIsEditing(!isEditing);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${Url}/buyer`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFormData(res.data.buyer);
        } catch (error) {
            console.error("Error fetching buyer data:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${Url}/displayaddress`, {
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
            await axios.put(`${Url}/editbuyer`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    const wishlist=()=>{
        Navigate("/wishlist")
    }

    const saveLocation = async () => {
        try {
            if (editLocation) {
                await axios.put(`${Url}/editaddress/${editLocation._id}`, newLocation, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setEditLocation(null);
            } else {
                if (newLocation.pincode && newLocation.locality && newLocation.address &&
                    newLocation.city && newLocation.state && newLocation.landmark) {
                    
                        await axios.post(`${Url}/address`, newLocation, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });
                }else{
                    alert("give a proper input datas")
                }
            }
            setNewLocation({ pincode: '', locality: '', address: '', city: '', state: '', landmark: '', place: 'home' });
            setShowLocationForm(false);
            fetchAddresses();
        } catch (error) {
            console.error("Error saving location:", error);
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            await axios.delete(`${Url}/deleteaddress/${addressId}`);
            setAddresses((prevAddresses) => prevAddresses.filter(address => address._id !== addressId));
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const handleEditAddress = (address) => {
        setEditLocation(address);
        setNewLocation({ ...address });
        setShowLocationForm(true);
    };

    const handleAddLocation = () => {
        setEditLocation(null);
        setShowLocationForm(true);
    };
    const cart=()=>{
        Navigate("/cart")
    }
    const order=()=>{
        Navigate("/orders")
    }
    useEffect(() => {
        fetchData();
        fetchAddresses();
    }, []);

    return (
        <div className="buyer-profile-container">
            <div className="buyer-profile-left">
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
                <div className="buyer-actions">
                    <button onClick={handleAddLocation} className="buyer-add-location-btn">+</button>
                    <button className="buyer-cart-btn" onClick={cart}>Cart</button>
                    <button className="buyer-wishlist-btn" onClick={wishlist}>Wishlist</button>
                    <button className="buyer-orders-btn" onClick={order}>My Orders</button>
                </div>
                <hr />
                {showLocationForm && (
                    <div className="buyer-add-location-form">
                        <div className="buyer-form-row">
                            <div className="buyer-profile-item">
                                <label>Pincode</label>
                                <input type="text" name="pincode"  value={newLocation.pincode}  onChange={handleLocationChange} />
                            </div>
                            <div className="buyer-profile-item">
                                <label>Locality</label>
                                <input
                                    type="text"
                                    name="locality"
                                    value={newLocation.locality}
                                    onChange={handleLocationChange}
                                
                                />
                            </div>
                            <div className="buyer-profile-item">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newLocation.address}
                                    onChange={handleLocationChange}
                                />
                            </div>
                            <div className="buyer-profile-item">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={newLocation.city}
                                    onChange={handleLocationChange}
                                
                                />
                            </div>
                            <div className="buyer-profile-item">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={newLocation.state}
                                    onChange={handleLocationChange}
                            
                                />
                            </div>
                            <div className="buyer-profile-item">
                                <label>Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={newLocation.landmark}
                                    onChange={handleLocationChange}
                                
                                />
                            </div>
                        </div>
                        <div className="buyer-form-row">
                            <label>
                                <input  type="radio" name="place" value="home"   checked={newLocation.place === 'home'} onChange={handleLocationChange}/>
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
