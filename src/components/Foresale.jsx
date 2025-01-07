import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Foresale.scss';
import { Link, useParams } from 'react-router-dom';

const ForSalePage = () => {
    const [productsForSale, setProductsForSale] = useState([]);
    const { id } = useParams();  // Correctly extract `id`

    const fetchdata = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/category/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (res.status === 200) {
                setProductsForSale(res.data);
            } else {
                console.error("Failed to fetch data. Status:");
            }
        } catch (error) {
            console.error("Error fetching data:");
        }
    };

    useEffect(() => {
        fetchdata();
    }, [id]); 

    return (
        <div className="for-sale-page">
            <h1>Products for Sale</h1>
            <div className="product-cards">
                {productsForSale.map((product) => (
                  <Link to={`/editproduct/${product._id}`}  key={product._id}>
                    <div className="product-card">
                        <img src={product.thumbnail} alt={product.name} className="product-thumbnail" />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-category">{product.category}</p>
                            <p className="product-price">${product.price}</p>
                            <p className="contact-details">Contact: {product.contactDetails}</p>
                        </div>
                    </div>
                  </Link>
                ))}
            </div>
        </div>
    );
};

export default ForSalePage;
