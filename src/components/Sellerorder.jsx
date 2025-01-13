import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerOrders.css'; // External CSS for styling
import Url from '../assets/root';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${Url}/sellerorders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setOrders(res.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirm = async (orderId) => {
        try {
       const res=     await axios.put(`${Url}/confirmorder/${orderId}`, { confirm: true });

       if (res.status===200) {
        fetchOrders();
        
       }else{
        console.log("error");
        
       }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };
console.log(orders);

    return (
        <div className="seller-orders-page">
            <h1>Seller Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Product Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order.buyername}</td>
                                <td>{order.product.product.productName}</td>
                                <td>{order.address.address}, {order.address.locality}, {order.address.city}, {order.address.state} - {order.address.pincode}. Landmark: {order.address.landmark}. Place: {order.address.place}</td>
                                <td>
                                    {order.confirmorder ? (
                                         <button className="confirmed-btn" disabled>Confirmed</button>
                                    ) : (
                                        <>
                                        <button className="confirm-btn" onClick={() => handleConfirm(order._id)}>Confirm</button>
                                        <button className="reject-btn">Reject</button>
                                        </>                                        
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SellerOrders;
