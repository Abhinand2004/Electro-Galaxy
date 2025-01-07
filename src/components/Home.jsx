import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/home', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (res.status === 200) {
                setProducts(res.data); 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="home-page">
            <h1 className="home-page__title">Featured Products</h1>
            <div className="home-page__product-cards">
                {products.map((product) => (
                    <div key={product._id} className="home-page__product-card">
                        <img
                            src={product.thumbnail}
                            alt={product.productname}
                            className="home-page__product-thumbnail"
                        />
                        <div className="home-page__product-info">
                            <h3 className="home-page__product-name">{product.productname}</h3>
                            <p className="home-page__product-category">{product.category}</p>
                            <p className="home-page__product-price">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
