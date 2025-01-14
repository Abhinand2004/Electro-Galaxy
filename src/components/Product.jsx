import React, { useEffect, useState } from 'react';
import './Product.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../assets/root';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${Url}/displayproduct/${id}`);
      setProduct(res.data);
      setCurrentImage(res.data.thumbnail);
    } catch (error) {
      console.error('Error fetching product data', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`${Url}/addwishlist`, { id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        alert("Product added to wishlist successfully");
      } else {
        alert("Error adding product to wishlist");
      }
    } catch (error) {
      alert("Product is already in the wishlist");
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`${Url}/addtocart`, { id }, {
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

  const buynow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      navigate('/login');
      return;
    }

    addToCart();
    navigate("/cart");
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="wishlist-button">
        <button onClick={addToWishlist} className="wishlist-heart-button">
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>

      <div className="main-page">
        <div className="left-side">
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.productName} ${index + 1}`}
                onClick={() => setCurrentImage(image)}
                onMouseEnter={() => setCurrentImage(image)}
              />
            ))}
          </div>
        </div>

        <div className="right-side">
          <div className="main-image">
            <img src={currentImage} alt={product.productName} />
            <div className="action-buttons">
              <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
              <button className="buy-now" onClick={buynow}>Buy Now</button>
            </div>
          </div>

          <div className="details-section">
            <h1 className="product-name">{product.productName}</h1>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-stock">Stock available: {product.quantity} nos</p>
            <p className="product-description">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
