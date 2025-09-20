import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosFitness } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import fitTrackLogo from "../../../fitTrackLogo.svg";
import { mobileMenuAnimations } from './animations';
import "./Header.css";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={fitTrackLogo} className="logo" alt="FitTrack logo" />
        </Link>
      </div>

      <nav className="desktop-menu">
        <ul>
          <li>
            <Link
              to="/"
              className={isActiveLink('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActiveLink('/about') ? 'active' : ''}
            >
              About
            </Link>
          </li>
          {/* <li><a href="#services">Services</a></li> */}
          {/* <li><a href="#contact">Contact</a></li> */}
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isMenuOpen ? 10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <IoIosFitness size={30} color="#ffffff" />
        </motion.div>
      </div>

      {/* Menú desplegable en dispositivos móviles */}
      {isMenuOpen && (
        <motion.div
          className="mobile-menu"
          variants={mobileMenuAnimations}
          initial="initial"
          animate="open"
          exit="exit"
        >
          <ul>
            <li>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={isActiveLink('/') ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={isActiveLink('/about') ? 'active' : ''}
              >
                About
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
