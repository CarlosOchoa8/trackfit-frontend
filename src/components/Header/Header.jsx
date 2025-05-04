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
      
      {/* Menú de Escritorio */}
      <nav className="desktop-menu">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Menú Hamburguesa */}
      <div className="hamburger" onClick={toggleMenu}>
        {/* <motion.div
          className="bar"
          variants={hamburgerAnimations.bar1}
          initial="initial"
          animate={isMenuOpen ? "open" : "initial"}
        />
        <motion.div
          className="bar"
          variants={hamburgerAnimations.bar2}
          initial="initial"
          animate={isMenuOpen ? "open" : "initial"}
        />
        <motion.div
          className="bar"
          variants={hamburgerAnimations.bar3}
          initial="initial"
          animate={isMenuOpen ? "open" : "initial"}
        /> */}
        <IoIosFitness size={30} color="#ffffff" />

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
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
