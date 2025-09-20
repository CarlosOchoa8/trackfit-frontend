import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosFitness } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import fitTrackLogo from "../../../fitTrackLogo.svg";
import { contactVariants } from "./animations";
import "./Footer.css";


const Footer = () => {
    const [isContactExpanded, setIsContactExpanded] = useState(false);
    const location = useLocation();

    const toggleContact = () => {
        setIsContactExpanded(!isContactExpanded);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };


    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <Link to="/">
                        <img src={fitTrackLogo} className="footer-logo-img" alt="FitTrack logo" />
                    </Link>
                    <p className="footer-tagline">Your definitive fitness tracker</p>
                </div>

                <nav className="footer-nav">
                    <div className="footer-section">
                        <h3>Menu</h3>
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
                    </div>
                </nav>

                <div className="footer-contact">
                    <div className="contact-toggle" onClick={toggleContact}>
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isContactExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <IoIosFitness size={24} color="#059669" />
                        </motion.div>
                        <span>Contact Info</span>
                    </div>

                    <motion.div
                        className="contact-info"
                        variants={contactVariants}
                        initial="initial"
                        animate={isContactExpanded ? "expanded" : "collapsed"}
                    >
                        {/* <div className="contact-item">
                            <IoMailOutline size={18} />
                            <span>info@fittrack.com</span>
                        </div>
                        <div className="contact-item">
                            <IoCallOutline size={18} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="contact-item">
                            <IoLocationOutline size={18} />
                            <span>Ciudad Juárez, Chihuahua</span>
                        </div> */}
                    </motion.div>
                </div>

                {/* <div className="footer-social">
                    <h3>Follow us</h3>
                    <div className="social-icons">
                        <motion.a
                            href="#instagram"
                            variants={socialVariants}
                            whileHover="hover"
                            className="social-link"
                        >
                            <IoLogoInstagram size={24} />
                        </motion.a>
                        <motion.a
                            href="#twitter"
                            variants={socialVariants}
                            whileHover="hover"
                            className="social-link"
                        >
                            <IoLogoTwitter size={24} />
                        </motion.a>
                        <motion.a
                            href="#facebook"
                            variants={socialVariants}
                            whileHover="hover"
                            className="social-link"
                        >
                            <IoLogoFacebook size={24} />
                        </motion.a>
                    </div>
                </div> */}
            </div>

            <div className="footer-bottom">
                <div className="footer-divider"></div>
                <div className="footer-copyright">
                    <p>&copy; 2025 FitTrack. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#privacy">Privacy policy</a>
                        <span className="separator">|</span>
                        <a href="#terms">Services terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;