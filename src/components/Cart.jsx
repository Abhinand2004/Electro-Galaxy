import React, { useEffect, useState } from 'react';
import './Cart.scss';
import axios from 'axios';
import Url from '../assets/root';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch cart data from the backend
  const fetchcartdata = async () => {
    try {
      const res = await axios.get(`${Url}/displaycart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCartItems(res.data.cartItems); // Adjust if needed based on the response
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Increment product quantity
  const increment = async (id) => {
    try {
      const res = await axios.post(`${Url}/quantity/${id}`, { input: true }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        fetchcartdata(); // Re-fetch the cart data to reflect updated quantity
      }
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      alert("Error while updating quantity");
    }
  };

  // Decrement product quantity
  const decrement = async (id) => {
    try {
      const res = await axios.post(`${Url}/quantity/${id}`, { input: false }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        fetchcartdata(); // Re-fetch the cart data to reflect updated quantity
      }
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      alert("Error while updating quantity");
    }
  };

  // Remove product from cart
  const onDelete = async (productId) => {
    try {
      const res = await axios.delete(`${Url}/deletecart/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        setCartItems(cartItems.filter(item => item._id !== productId));
        alert("Product removed from cart");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchcartdata();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Total calculation
  const totalAmount = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-left">
        {cartItems.map((cartItem) => (
          cartItem.product && (
            <div className="cart-card" key={cartItem._id}>
              <img src={cartItem.product.thumbnail} alt={cartItem.product.productName} />
              <div className="cart-info">
                <h2>{cartItem.product.productName}</h2>
                <p>{cartItem.product.category}</p>
                <p>Price: ${cartItem.product.price}</p>
                <div className="cart-controls">
                  <button onClick={() => decrement(cartItem._id)}>-</button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={() => increment(cartItem._id)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => onDelete(cartItem._id)}>Remove from Cart</button>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="cart-right">
        <h2>Your Orders</h2>
        <p>Total Amount: ${totalAmount}</p>
        <div className="address-check">
          <label>
            <input type="checkbox" /> Address 1
          </label>
          <label>
            <input type="checkbox" /> Address 2
          </label>
        </div>
        <button className="buy-now">Buy Now</button>
      </div>
    </div>
  );
};

export default CartPage;
