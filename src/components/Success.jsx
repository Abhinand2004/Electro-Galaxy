import React from "react";
import './Sucess.scss';

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-circle">
        <div className="success-tick"></div>
      </div>
      <h1>Order Placed Successfully!</h1>
    </div>
  );
};

export default Success;
