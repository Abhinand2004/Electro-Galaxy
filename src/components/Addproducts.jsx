import React, { useState } from 'react';
import axios from 'axios';
import './Addproducts.scss';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Url from '../assets/root';

const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        productName: '',
        category: 'Electronics',
        price: '',
        thumbnail: null,
        description: '',
        quantity: '',
        images: [],
        categories: ['Electronics', 'Mobile', 'TV', 'AC', 'Fan', 'Washing Machine', 'Fridge'],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length <= 5) {
            Promise.all(files.map(fileToBase64)).then(base64Images => {
                setProductData({ ...productData, images: base64Images });
            });
        } else {
            alert('You can select a maximum of 5 images.');
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        fileToBase64(file).then(base64Thumbnail => {
            setProductData({ ...productData, thumbnail: base64Thumbnail });
        });
    };

    const handleAddProduct = async () => {
        const { productName, category, price, thumbnail, description, quantity, images } = productData;

        // Validate fields
        if (!productName || !category || !price || !thumbnail || !description || !quantity || images.length === 0) {
            alert('All fields are required. Please fill in all fields.');
            return;
        }

        try {
            const res = await axios.post(`${Url}/addproduct`, productData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log('Product added successfully:', res.data);
            navigate("/sprofile");
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <div className="product-form">
                <div className="image-previews">
                    {productData.images.length > 0 ? (
                        productData.images.map((image, index) => (
                            <div key={index} className="image-preview">
                                <img src={image} alt={`Product Image ${index + 1}`} />
                            </div>
                        ))
                    ) : (
                        <p>No images selected</p>
                    )}
                </div>

                <div className="form-group">
                    <TextField
                        label="Product Name"
                        name="productName"
                        value={productData.productName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </div>

                <div className="form-group">
                    <TextField
                        label="Category"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        select
                        fullWidth
                        required
                    >
                        {productData.categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </TextField>
                </div>

                <div className="form-group">
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={productData.price}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </div>

                <div className="form-group">
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={productData.quantity}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        required
                        className="file-input"
                    />
                    <small>Upload a thumbnail image</small>
                </div>

                <div className="form-group">
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required
                        className="file-input"
                    />
                    <small>Upload up to 5 product images</small>
                </div>

                <div className="form-group">
                    <TextField
                        label="Description"
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        multiline
                        rows={4}
                    />
                </div>

                <div className="form-actions">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddProduct}
                    >
                        Add Product
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
