import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerProfile.scss';
import { Link } from 'react-router-dom';

const SellerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({ companyname: "", location: "" });
  const [categories, setCategories] = useState([]);

  const handleSaveClick = async () => {
    try {
      await axios.post("http://localhost:3000/api/companyadd", companyDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/companydetails", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCompanyDetails(res.data.company);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCompanyDetails();
  }, []);

  return (
    <div className="seller-profile-container">
      <div className="seller-profile-left-side">
        <h2 className="company-details-title">Company Details</h2>
        {!companyDetails.companyname && !isEditing ? (
          <button className="add-company-btn" onClick={() => setIsEditing(true)}>Add Company</button>
        ) : isEditing ? (
          <div className="company-details-edit">
            <input 
              type="text" 
              name="companyname" 
              value={companyDetails.companyname} 
              onChange={handleInputChange} 
              className="companyname-input"
            />
            <input 
              type="text" 
              name="location" 
              value={companyDetails.location} 
              onChange={handleInputChange} 
              className="location-input"
            />
            <button className="save-company-btn" onClick={handleSaveClick}>Save</button>
            <button className="cancel-company-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="company-details-view">
            <p className="company-name">Company Name: {companyDetails.companyname}</p>
            <p className="company-location">Location: {companyDetails.location}</p>
            <button className="edit-company-btn" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )}
      </div>

      <div className="seller-profile-right-side">
        <Link to={"/addproduct"}>
          <button className="add-product-btn">Add Product</button>
        </Link>
        <div className="category-list">
          {categories.map((category, index) => (
            <div key={index} className="category-box">
              <Link to={`/forsale/${category}`}>
              {category}
              
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
