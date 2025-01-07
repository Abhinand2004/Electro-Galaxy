import React, { useState, useEffect } from 'react';
import './Editproduct.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProductPage = () => {
    const navigate=useNavigate()
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        images: [],
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/findproduct/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 200) {
                setFormData(res.data.product);
            } else {
                console.error("Failed to fetch product. Status:", res.status);
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const res = await axios.put(`http://localhost:3000/api/editproduct/${id}`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 200) {
                console.log('Product updated successfully:', res.data);
                setIsEditing(false);
            } else {
                console.error("Failed to update product. Status:", res.status);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/deletproduct/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.status === 200) {
                console.log('Product deleted successfully');
                navigate("/sprofile")
            } else {
                console.error("Failed to delete product. Status:", res.status);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="edit-product-page">
            <h1>Edit Product</h1>
            <div className="product-details">
                <div className="product-images">
                    <h3>Images</h3>
                    <div className="images-container">
                        {formData.images.map((image, index) => (
                            <img key={index} src={image} alt={`Product image ${index + 1}`} className="product-image" />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h3>Product Info</h3>
                    {isEditing ? (
                        <div className="edit-fields">
                            <label htmlFor="productName">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
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
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <button onClick={handleSave} className="save-btn">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="product-info-display">
                            <p><strong>Name:</strong> {formData.productName}</p>
                            <p><strong>Category:</strong> {formData.category}</p>
                            <p><strong>Price:</strong> ${formData.price}</p>
                            <p><strong>Quantity:</strong> {formData.quantity}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                            <button onClick={() => setIsEditing(true)} className="edit-btn">
                                Edit
                            </button>
                            <button onClick={handleDelete} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
