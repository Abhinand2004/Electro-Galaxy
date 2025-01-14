import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import './SellerProfile.scss';
import Url from '../assets/root';
const SellerProfile = () => {
  const [companyDetails, setCompanyDetails] = useState({ companyname: "", location: "" });
  const [editedCompanyDetails, setEditedCompanyDetails] = useState({ companyname: "", location: "" });
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAdd = async () => {
    try {
      await axios.post(`${Url}/companyadd `, companyDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsAdding(false);
      fetchCompanyDetails();
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${Url}/editcompany`, editedCompanyDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCompanyDetails(editedCompanyDetails);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing company:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditedCompanyDetails({ ...editedCompanyDetails, [name]: value });
    } else {
      setCompanyDetails({ ...companyDetails, [name]: value });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${Url}/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const res = await axios.get(`${Url}/companydetails`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCompanyDetails(res.data.company || { companyname: "", location: "" });
      setEditedCompanyDetails(res.data.company || { companyname: "", location: "" });
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
      <div className="company-details">
        <h2>Company Details</h2>
        {(!companyDetails.companyname && !companyDetails.location) && !isAdding ? (
          <Button variant="contained" color="primary" onClick={() => setIsAdding(true)}>Add Company</Button>
        ) : isAdding ? (
          <div className="form-group">
            <TextField label="Company Name"name="companyname" value={companyDetails.companyname}onChange={handleInputChange}variant="outlined"fullWidth/>
            <TextField label="Location"name="location"value={companyDetails.location}onChange={handleInputChange}variant="outlined"fullWidth
            />
            <div className="form-buttons">
              <Button variant="contained" color="success" onClick={handleSaveAdd}>Save</Button>
              <Button variant="outlined" color="error" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
          <p><strong>Company Name:</strong> <span>{companyDetails.companyname}</span></p>
          <p><strong>Location:</strong> <span>{companyDetails.location}</span></p>
        </div>
        
        )}
        {companyDetails.companyname && companyDetails.location && (
          <Button variant="outlined" color="secondary" className="asd" onClick={() => setIsEditing(!isEditing)}>Edit Company</Button>
        )}
        {isEditing && (
          <div className="form-group">
            <TextField
              label="Edit Company Name"
              name="companyname"
              value={editedCompanyDetails.companyname}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Edit Location"
              name="location"
              value={editedCompanyDetails.location}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
          </div>
        )}
      </div>
      <div className="categories-section">
        <Link to={"/addproduct"}>
          <Button variant="contained" color="success" className='add-product'>Add Product</Button>
        </Link>
        <h3>Categories</h3>
        <div className="categories-container">
          {categories.map((category, index) => (
            <Link to={`/forsale/${category}`} key={index} style={{ textDecoration: 'none' }}>
              <Button variant="outlined" color="primary">{category}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
