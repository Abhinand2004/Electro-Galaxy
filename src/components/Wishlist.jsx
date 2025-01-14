import React, { useEffect, useState } from 'react';
import './Wishlist.scss';
import axios from 'axios';
import Url from '../assets/root';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Wishlistdisplay = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    getdata();
  }, []);

  const onDelete = async (productId, event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const res = await axios.delete(`${Url}/deletewishlist/${productId}`);
      if (res.status === 200) {
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

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`${Url}/addtocart`, { id: productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        alert("Product added to cart successfully");
      } else {
        alert("Error adding product to cart");
      }
    } catch (error) {
      alert("Product is already in the cart");
    }
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-heading">My Wishlist</h1>
      <div className="wishlist-cards">
        {products.length > 0 ? (
          products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="wishlist-card">
                <img src={product.thumbnail} alt={product.productName} className="wishlist-thumbnail" />
                <div className="wishlist-details">
                  <h2 className="wishlist-product-name">{product.productName}</h2>
                  <p className="wishlist-product-category">{product.category}</p>
                  <p className="wishlist-product-price">${product.price}</p>
                  <div className="wishlist-actions">
                    <button className="wishlist-buy-button">Buy Now</button>
                    <button
                      className="wishlist-add-cart-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        addToCart(product._id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <button
                  onClick={(event) => onDelete(product._id, event)}
                  className="wishlist-delete-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
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
