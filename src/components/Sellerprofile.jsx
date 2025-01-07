import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerProfile.scss';
import { Link } from 'react-router-dom';

const SellerProfile = () => {
  const [companyDetails, setCompanyDetails] = useState({ companyname: "", location: "" });
  const [editedCompanyDetails, setEditedCompanyDetails] = useState({ companyname: "", location: "" }); // New state for edited data
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAdd = async () => {
    try {
      await axios.post("http://localhost:3000/api/companyadd", companyDetails, {
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
      await axios.put("http://localhost:3000/api/editcompany", editedCompanyDetails, { // Use editedCompanyDetails here
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      console.log("Successfully saved");
      setCompanyDetails(editedCompanyDetails); // Update companyDetails after save
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing company:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditedCompanyDetails({ ...editedCompanyDetails, [name]: value }); // Update edited data
    } else {
      setCompanyDetails({ ...companyDetails, [name]: value });
    }
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
      setCompanyDetails(res.data.company || { companyname: "", location: "" });
      setEditedCompanyDetails(res.data.company || { companyname: "", location: "" }); // Also initialize the edited data
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
        {(!companyDetails.companyname && !companyDetails.location) && !isAdding ? (
          <button className="add-company-btn" onClick={() => setIsAdding(true)}>Add Company</button>
        ) : isAdding ? (
          <div className="company-details-form">
            <input
              type="text"
              name="companyname"
              value={companyDetails.companyname}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="companyname-input"
            />
            <input
              type="text"
              name="location"
              value={companyDetails.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="location-input"
            />
            <div className="form-buttons">
              <button className="save-add-btn" onClick={handleSaveAdd}>Save</button>
              <button className="cancel-add-btn" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="company-details-view">
            <p><strong>Company Name:</strong> {companyDetails.companyname}</p>
            <p><strong>Location:</strong> {companyDetails.location}</p>
          </div>
        )}

        {/* Show Edit Company button only if company details exist */}
        {companyDetails.companyname && companyDetails.location && (
          <button className="edit-company-btn" onClick={() => setIsEditing(!isEditing)}>Edit Company</button>
        )}

        {isEditing && (
          <div className="edit-company-form">
            <input
              type="text"
              name="companyname"
              value={editedCompanyDetails.companyname} // Use editedCompanyDetails here
              onChange={handleInputChange}
              placeholder="Edit company name"
              className="companyname-input"
            />
            <input
              type="text"
              name="location"
              value={editedCompanyDetails.location} // Use editedCompanyDetails here
              onChange={handleInputChange}
              placeholder="Edit location"
              className="location-input"
            />
            <button className="save-edit-btn" onClick={handleSaveEdit}>Save</button>
          </div>
        )}
      </div>

      <div className="seller-profile-right-side">
        <Link to={"/addproduct"}>
          <button className="add-product-btn">Add Product</button>
        </Link>
        <div className="category-list">
          {categories.map((category, index) => (
            <Link to={`/forsale/${category}`} key={index}>
              <div className="category-box">
                {category}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
