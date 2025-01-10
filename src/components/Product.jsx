import React, { useEffect, useState } from 'react';
import './Product.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/displayproduct/${id}`);
      setProduct(res.data);
      setCurrentImage(res.data.thumbnail); // Set initial image
    } catch (error) {
      console.error('Error fetching product data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      {/* Wishlist button */}
      <div className="wishlist-button">
        <button>Add to Wishlist</button>
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
              />
            ))}
          </div>
        </div>

        
        <div className="right-side">
          <div className="main-image">
            <img src={currentImage} alt={product.name} />
            <div className="action-buttons">
            <button className="add-to-cart">Add to Cart</button>
            <button className="buy-now">Buy Now</button>
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
