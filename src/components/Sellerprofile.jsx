import React, { useState } from 'react';
import './Sellerprofile.scss';

const SellerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        location: '',
    });

    const [categories, setCategories] = useState([
        { name: 'Laptops', count: 10 },
        { name: 'Smartphones', count: 20 },
        { name: 'Headphones', count: 15 },
        { name: 'Tablets', count: 8 }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        console.log('Saved company data:', formData);
    };

    const handleAddProduct = (category) => {
        const updatedCategories = categories.map((cat) =>
            cat.name === category
                ? { ...cat, count: cat.count + 1 }
                : cat
        );
        setCategories(updatedCategories);
    };

    const handleAddCompanyData = () => {
        setFormData({
            companyName: 'Tech Electronics',
            email: 'contact@techelectronics.com',
            phone: '987-654-3210',
            location: '123 Tech St, Silicon Valley',
        });
    };

    return (
        <div className="seller-profile-container">
            <div className="left-side">
                <h2>Seller Profile</h2>
                {formData.companyName === '' ? (
                    <button onClick={handleAddCompanyData} className="add-company-btn">
                        Add Company Data
                    </button>
                ) : (
                    <div className="profile-info">
                        <div className="profile-item">
                            <label>Company Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{formData.companyName}</span>
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
                            <label>Phone Number:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{formData.phone}</span>
                            )}
                        </div>
                    </div>
                )}

                {formData.companyName !== '' && (
                    <button onClick={handleEditClick} className="edit-btn">
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                )}
                {isEditing && formData.companyName !== '' && (
                    <button onClick={handleSaveClick} className="save-btn">
                        Save Changes
                    </button>
                )}
            </div>

            <div className="right-side">
                <div className="category-box">
                    <h3>Product Categories</h3>
                    <div className="category-list">
                        {categories.map((category, index) => (
                            <div key={index} className="category-item">
                                <span>{category.name}</span>
                                <span className="product-count">Count: {category.count}</span>
                                <button
                                    onClick={() => handleAddProduct(category.name)}
                                    className="add-product-btn"
                                >
                                    Add Product
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="add-product">
                    <h3>Add New Product</h3>
                    <button className="add-product-btn">Add Product</button>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
