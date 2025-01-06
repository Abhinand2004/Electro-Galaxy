import React, { useState, useEffect } from 'react';
import './Foresale.scss'

const ForSalePage = () => {
    const [productsForSale, setProductsForSale] = useState([]);

    useEffect(() => {
        // Fetch product data for sale from an API (or mock data for now)
        // Example mock data
        const mockProductsForSale = [
            {
                id: 1,
                name: 'Smartphone',
                category: 'Electronics',
                price: 299.99,
                contactDetails: '123-456-7890',
                thumbnail: 'https://via.placeholder.com/150',
            },
            {
                id: 2,
                name: 'Laptop',
                category: 'Electronics',
                price: 999.99,
                contactDetails: '987-654-3210',
                thumbnail: 'https://via.placeholder.com/150',
            },
            {
                id: 3,
                name: 'Jacket',
                category: 'Fashion',
                price: 49.99,
                contactDetails: '555-666-7777',
                thumbnail: 'https://via.placeholder.com/150',
            },
            {
                id: 4,
                name: 'Coffee Maker',
                category: 'Home Appliances',
                price: 89.99,
                contactDetails: '888-999-0000',
                thumbnail: 'https://via.placeholder.com/150',
            },
        ];

        setProductsForSale(mockProductsForSale);
    }, []);

    return (
        <div className="for-sale-page">
            <h1>Products for Sale</h1>
            <div className="product-cards">
                {productsForSale.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.thumbnail} alt={product.name} className="product-thumbnail" />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-category">{product.category}</p>
                            <p className="product-price">${product.price}</p>
                            <p className="contact-details">Contact: {product.contactDetails}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForSalePage;
