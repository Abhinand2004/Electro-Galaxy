import React, { useEffect, useState } from 'react';
import './Wishlist.scss';
import axios from 'axios';
import Url from '../assets/root';
import { Link } from 'react-router-dom';
const Wishlistdisplay = () => {
  const [products, setProducts] = useState([]);

  // Function to fetch wishlist data
  const getdata = async () => {
    try {
      const res = await axios.get(`${Url}/displaywishlist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProducts(res.data.products);
    } catch (error) {
      console.log("No data found");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getdata();
  }, []);

  const onDelete = async (productId) => {
    try {
      const res = await axios.delete(`${Url}/deletewishlist/${productId}`);
      if (res.status === 200) {
        // Update the state immediately after deletion
        setProducts(products.filter(product => product._id !== productId));
        alert("Product removed from wishlist");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting product from wishlist:', error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-heading">My Wishlist</h1>
      <div className="wishlist-cards">
        {products.length > 0 ? (
          products.map((product) => (
           <Link to={`/product/${product._id}`}  key={product._id}>
            <div  className="wishlist-card">
              <img src={product.thumbnail} alt={product.productName} className="wishlist-thumbnail" />
              <div className="wishlist-details">
                <h2 className="wishlist-product-name">{product.productName}</h2>
                <p className="wishlist-product-category">{product.category}</p>
                <p className="wishlist-product-price">${product.price}</p>
                <div className="wishlist-actions">
                  <button className="wishlist-buy-button">Buy Now</button>
                  <button className="wishlist-add-cart-button">Add to Cart</button>
                </div>
              </div>
              <button onClick={() => onDelete(product._id)} className="wishlist-delete-button">Delete</button>
            </div>
           </Link>
          ))
        ) : (
          <p className="wishlist-empty">No items in wishlist</p>
        )}
      </div>
    </div>
  );
};

export default Wishlistdisplay;
