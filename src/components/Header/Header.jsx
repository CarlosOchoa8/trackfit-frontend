import React, { useState } from "react";
import "./Header.css";
import { motion } from "framer-motion";
import { hamburgerAnimations, mobileMenuAnimations } from './animations';
import { IoIosFitness } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Mi Logo</h1>
      </div>
      
      <nav className="desktop-menu">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
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
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About us</a></li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
