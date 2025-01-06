import React, { useState, useEffect } from 'react';
import './Editproduct.scss';

const EditProductPage = ({ productId }) => {
    // Mock data - Replace with actual product data fetched from an API
    const [product, setProduct] = useState({
        id: productId,
        name: 'Smartphone',
        category: 'Electronics',
        price: 299.99,
        contactDetails: '123-456-7890',
        images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        contactDetails: '',
    });

    useEffect(() => {
        // Set form data to current product details
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            contactDetails: product.contactDetails,
        });
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        // Here, save the updated product data (e.g., make an API call to save)
        setIsEditing(false);
        console.log('Product updated:', formData);
    };

    const handleDelete = () => {
        // Here, delete the product (e.g., make an API call to delete)
        console.log('Product deleted');
    };

    return (
        <div className="edit-product-page">
            <h1>Edit Product</h1>
            <div className="product-details">
                <div className="product-images">
                    <h3>Images</h3>
                    <div className="images-container">
                        {product.images.map((image, index) => (
                            <img key={index} src={image} alt={`Product image ${index + 1}`} className="product-image" />
                        ))}
                    </div>
                    {!isEditing && (
                        <div className="buttons">
                            <button onClick={() => setIsEditing(true)} className="edit-btn">
                                Edit
                            </button>
                            <button onClick={handleDelete} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h3>Product Info</h3>
                    {isEditing ? (
                        <div className="edit-fields">
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="contactDetails">Contact Details</label>
                            <input
                                type="text"
                                name="contactDetails"
                                value={formData.contactDetails}
                                onChange={handleChange}
                                required
                            />
                            <button onClick={handleSave} className="save-btn">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="product-info-display">
                            <p><strong>Name:</strong> {product.name}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Contact:</strong> {product.contactDetails}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
