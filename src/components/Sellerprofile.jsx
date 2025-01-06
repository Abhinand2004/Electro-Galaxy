import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerProfile.scss';

const SellerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({ companyname: "", location: "" });

  const handleSaveClick = async () => {
//    if (companyDetails.company.companyname) return
    try {
      await axios.post("http://localhost:3000/api/companyadd", companyDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding company:");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  useEffect(() => {
    // const fetchCompanyData = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:3000/api/companydetails", {
    //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    //     });
    //     setCompanyDetails(res.data);
       
    //   } catch (error) {
    //     console.error("Error fetching company data:", error);
    //   }
    // };
    // fetchCompanyData();
  }, []);
//   console.log(companyDetails.company.companyname);
  

  return (
    <div className="seller-profile">
      <h2>Company Details</h2>
      {!companyDetails.companyname && !isEditing ? (
        <button onClick={() => setIsEditing(true)}>Add Company</button>
      ) : isEditing ? (
        <div>
          <input type="text" name="companyname" value={companyDetails.companyname} onChange={handleInputChange} />
          <input type="text" name="location" value={companyDetails.location} onChange={handleInputChange} />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Company Name: {companyDetails.companyname}</p>
          <p>Location: {companyDetails.location}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
