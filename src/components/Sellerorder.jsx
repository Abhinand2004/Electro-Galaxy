import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerOrders.scss';
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
            const res = await axios.put(`${Url}/confirmorder/${orderId}`, { confirm: true });

            if (res.status === 200) {
                sendemail(orderId)
                fetchOrders();
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const handlereject = async (orderId) => {
        sendrejuctmail(orderId);

        try {
            const res = await axios.delete(`${Url}/rejectorder/${orderId}`);

            if (res.status === 200) {
                fetchOrders();
                alert("deleted");
            } else {
                console.log("error");
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const sendemail = async (orderId) => {
        try {
            const res = await axios.post(`${Url}/sendconfirm/${orderId}`, {});
            if (res.status === 200) {
                alert("email sent");
            } else {
                console.log("error sending email");
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const sendrejuctmail = async (orderId) => {
        try {
            const res = await axios.post(`${Url}/rejectmsg/${orderId}`, {});
            if (res.status === 200) {
                alert("email sent");
            } else {
                console.log("error sending reject email");
            }
        } catch (error) {
            console.error('Error sending reject email:', error);
        }
    };

    return (
        <div className="seller-orders-page">
            <h1>Seller Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders yet.</p>
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
                                            <button className="reject-btn" onClick={() => handlereject(order._id)}>Reject</button>
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
