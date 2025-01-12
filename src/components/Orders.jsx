import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Order.scss';
import Url from '../assets/root';

const Orderspage = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${Url}/orderdisplay`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrders(res.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="orders-container">
            <h1>Your Orders</h1>
            <div className="orders-grid">
                {orders.map((order) => (
                    order.products.map((product) => (
                        <div key={product.product._id} className="order-card">
                            <img src={product.product.thumbnail} alt={product.product.name} />
                            <div className="order-details">
                                <h2>{product.product.name}</h2>
                                <p>Category: {product.product.category}</p>
                                <p>Price: ${product.product.price}</p>
                                <div className="order-actions">
                                    <button className="details-button">More Details</button>
                                    <button className="cancel-button">Cancel Order</button>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default Orderspage;
