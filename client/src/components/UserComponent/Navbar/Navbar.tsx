import React from 'react';
import './Navbar.css'

const NavBar = () => {
  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src='' alt="Logo" />
      </div>
      
      {/* Navigation Links */}
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#movies">Movies</a>
        <a href="#theatres">Theatres</a>
        <a href="#orders">Orders</a>
      </div>
      
      {/* User Info */}
      <div className="user-info">
        <button className="user-button">
          <span>Hi, 9562897938</span>
          <i className="user-icon"></i>
        </button>
        
      </div>
    </div>
  );
};

export default NavBar;
