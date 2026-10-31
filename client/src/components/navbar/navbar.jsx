import React, { useState } from "react";
import { FaSearch, FaTwitter, FaFacebookF, FaInstagram, FaBars} from "react-icons/fa";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const toggleSearch = () => {
    setSearch(!search);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/login");               // redirect
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">Blog</div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Your Space</Link>

          {/* ✅ CONDITIONAL AUTH LINKS */}
          {!isLoggedIn ? (
            <>

              <Link to="/login">Login/Signup</Link>
            </>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        <div className="icons">
          <FaSearch className="icon" onClick={toggleSearch} />
          <FaTwitter className="icon" />
          <FaFacebookF className="icon" />
          <FaInstagram className="icon" />
          <FaBars className="menu-icon" onClick={toggleMenu} />
        </div>
      </header>

      {search && (
        <div className="search-bar">
          <input type="text" placeholder="Search.." />
          <FaTimes className="icon close-icon" onClick={toggleSearch} />
        </div>
      )}
    </>
  );
};

export default NavBar;
