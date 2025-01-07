import React, { useState } from 'react';
import axios from 'axios';
import './Addproducts.scss';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        productName: '',
        category: 'Electronics', 
        price: '',
        thumbnail: null,
        description: '',
        images: [],
        categories: ['Electronics', 'mobile','Tv','AC','Fan','wahing-meshine','fridge'],
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

    const handleCategoryChange = (e) => {
        setProductData({ ...productData, category: e.target.value });
    };

    const handleAddProduct = async () => {
        const { productName, category, price, thumbnail, description, images } = productData;

        // Validate fields
        if (!productName || !category || !price || !thumbnail || !description || images.length === 0) {
            alert('All fields are required. Please fill in all fields.');
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/addproduct", productData, {
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
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        value={productData.productName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleCategoryChange}
                    >
                        {productData.categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Thumbnail</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Images (Max 5)</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleAddProduct} className="add-product-btn">
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
