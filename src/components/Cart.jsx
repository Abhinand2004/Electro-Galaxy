import React, { useEffect, useState } from 'react';
import './Cart.scss';
import axios from 'axios';
import Url from '../assets/root';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchcartdata = async () => {
    try {
      const res = await axios.get(`${Url}/displaycart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCartItems(res.data.cartItems); 
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const increment = async (id) => {
    try {
      const res = await axios.post(`${Url}/quantity/${id}`, { input: true }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        fetchcartdata(); 
      }
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      alert("Error while updating quantity");
    }
  };

  const decrement = async (id) => {
    try {
      const res = await axios.post(`${Url}/quantity/${id}`, { input: false }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.status === 200) {
        fetchcartdata();
      }
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      alert("Error while updating quantity");
    }
  };

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

  const buyeraddress = async () => {
    try {
      const res = await axios.get(`${Url}/displayaddress`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.status === 200 && res.data.length > 0) {
        setAddress(res.data);
      } else {
        alert("Please add an address");
        navigate("/bprofile");
      }
    } catch (error) {
      alert("Please add an address");
    }
  };

  const createseller = async () => {
    try {
      await axios.post(`${Url}/seller`, { id: selectedAddress }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (error) {
      console.error("Error creating seller data:", error);
      alert("An error occurred");
    }
  };

  const decreesquantity = async () => {
    try {
      await axios.put(`${Url}/decreesquantity`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (error) {
      console.error("Error decreesing product quantity:", error);
      alert("Error decreesing product quantity");
    }
  };

  const buynow = async () => {
    if (!selectedAddress) {
      alert("Please select an address");
    } else {
      try {
        const res = await axios.post(`${Url}/order`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (res.status === 200) {
          alert("Product added successfully");
          createseller();
          decreesquantity();
          deletefullcart();
          fetchcartdata();
          navigate("/success");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        alert("An error occurred");
      }
    }
  };

  const deletefullcart = async () => {
    try {
      const res = await axios.delete(`${Url}/wholedeletecart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.status !== 200) {
        alert("Unexpected response status");
      }
    } catch (error) {
      alert("An error occurred while deleting the cart");
    }
  };

  useEffect(() => {
    fetchcartdata();
    buyeraddress();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalAmount = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shippingMessage = totalAmount > 1000 ? (
    <p>You saved ₹50 on shipping!</p>
  ) : (
    <p>₹50 shipping charge applied</p>
  );

  return (
    <div className="cart-page">
      <div className="cart-left">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((cartItem) => (
            cartItem.product && (
              <div className="cart-card" key={cartItem._id}>
                <img src={cartItem.product.thumbnail} alt={cartItem.product.productName} />
                <div className="cart-info">
                  <h2>{cartItem.product.productName}</h2>
                  <p>{cartItem.product.category}</p>
                  <p>Price: ${(cartItem.product.price) * (cartItem.quantity)}</p>
                  <div className="cart-controls">
                    <button onClick={() => decrement(cartItem._id)}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => increment(cartItem._id)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => onDelete(cartItem._id)}>Remove from Cart</button>
                </div>
              </div>
            )
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-right">
          <h2>Your Orders</h2>
          <p>Total Amount: ${totalAmount}</p>
          {shippingMessage}
          <div className="address-check">
            {address.map((addr) => (
              <label key={addr._id}>
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                />
                {`${addr.address}, ${addr.locality}, ${addr.city}, ${addr.state} - ${addr.pincode}. Landmark: ${addr.landmark}. Place: ${addr.place}`}
              </label>
            ))}
          </div>
          <button className="buy-now" onClick={buynow}>Buy Now</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
