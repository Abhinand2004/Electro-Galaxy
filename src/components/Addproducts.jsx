import React, { useState } from 'react';
import './Addproducts.scss';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        productName: '',
        category: '',
        price: '',
        thumbnail: null,
        description: '',
        images: [],
        categories: ['Electronics', 'Fashion', 'Home Appliances'],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length <= 5) {
            setProductData({ ...productData, images: files });
        } else {
            alert('You can select a maximum of 5 images.');
        }
    };

    const handleCategoryChange = (e) => {
        setProductData({ ...productData, category: e.target.value });
    };

    const handleThumbnailChange = (e) => {
        setProductData({ ...productData, thumbnail: e.target.files[0] });
    };

    const handleAddProduct = () => {
        console.log('Product Data:', productData);
        // Handle product addition logic here (e.g., API call)
    };

    const renderImagePreviews = () => {
        return productData.images.map((image, index) => (
            <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt={`Product Image ${index + 1}`} />
            </div>
        ));
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <div className="product-form">
                {/* Image Preview Section */}
                <div className="image-previews">
                    {productData.images.length > 0 ? renderImagePreviews() : <p>No images selected</p>}
                </div>

                {/* Product Name */}
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

                {/* Category Dropdown */}
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={productData.category} onChange={handleCategoryChange}>
                        {productData.categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                        <option value="Add New">Add New Category</option>
                    </select>
                    {productData.category === 'Add New' && (
                        <div className="add-category">
                            <input
                                type="text"
                                name="newCategory"
                                placeholder="Enter new category"
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </div>

                {/* Price */}
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

                {/* Thumbnail */}
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

                {/* Product Images */}
                <div className="form-group">
                    <label>Product Images (Max 5)</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                {/* Contact Details */}
                <div className="form-group">
                    <label>Contact Details</label>
                    <textarea
                        name="contactDetails"
                        value={productData.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
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
