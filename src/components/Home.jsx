import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';

const HomePage = () => {
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/home',{
                headers:{Authorization:`Berear ${localStorage.getItem('token')}`},
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

    // console.log(products); 

    return (
        <div className="home-page">
            <h1>Featured Products</h1>
            <div className="product-cards">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <img src={product.thumbnail} alt={product.productname} className="product-thumbnail" />
                        <div className="product-info">
                            <h3 className="product-name">{product.productname}</h3>
                            <p className="product-category">{product.category}</p>
                            <p className="product-price">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    );
};

export default HomePage;
