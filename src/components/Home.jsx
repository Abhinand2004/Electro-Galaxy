import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';
import Url from '../assets/root';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${Url}/home`, {
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
                    <Link to={`/product/${product._id}`} key={product._id} >
                    <div  className="home-page__product-card">
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
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
