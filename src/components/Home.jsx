import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';
import Url from '../assets/root';
import { Link } from 'react-router-dom';

const HomePage = ({name}) => {
    console.log(name);
    
    const [products, setProducts] = useState([]);
    const token=localStorage.getItem("token")
    const fetchData = async () => {
        try {
            const res = await axios.get(`${Url}/home`,);
            if (res.status === 200) {
                setProducts(res.data); 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchDatawithtoken = async () => {
        try {
            const res = await axios.get(`${Url}/homewithtoken`, {
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
        if (token) {
            fetchDatawithtoken()
        }else{
        fetchData();

        }
    }, []);

    return (
        <div className="home-page">
            <h1 className="home-page__title">Featured Products</h1>
            <div className="home-page__product-cards">
                {
                 products.filter((product) =>
                    product.category.toLowerCase().includes(name.toLowerCase())).map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id} >
                    <div  className="home-page__product-card">
                        <img
                            src={product.thumbnail}
                            alt={product.productName}
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
