// Navbar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import Button from './Button/Button';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('Email');
    localStorage.removeItem('AuthToken');
    navigate('/signup');
  };

  const username = localStorage.getItem('Username');

  return (
    <nav className="navbar-common p-4 d-flex justify-content-between">
      <div className="navbar-brand">
        <span className="navbar-username ">Welcome, {username}</span>
      </div>

      <ul className="navbar-list p-0 m-0">
        <li className="d-flex">
          {localStorage.getItem('AuthToken') ? (
            <div className="navbar-authenticated">
              <Button className="navbar-logout px-3 py-2 bg-danger" onClick={handleLogout} text="Log Out">
              </Button>
            </div>
          ) : (
            <div className="d-flex">
              <a href="/login">
                <button className="navbar-button">Log In</button>
              </a>
              <a href="/signup">
                <button className="navbar-button">Sign Up</button>
              </a>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
