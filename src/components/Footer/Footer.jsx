import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosFitness, IoLogoInstagram, IoLogoTwitter, IoLogoFacebook } from "react-icons/io";
import { IoMailOutline, IoLocationOutline, IoCallOutline } from "react-icons/io5";
import fitTrackLogo from "../../../fitTrackLogo.svg";
import "./Footer.css";

const Footer = () => {
    const [isContactExpanded, setIsContactExpanded] = useState(false);

    const toggleContact = () => {
        setIsContactExpanded(!isContactExpanded);
    };

    const socialVariants = {
        hover: {
            scale: 1.2,
            rotate: 5,
            transition: { duration: 0.3 }
        }
    };

    const contactVariants = {
        initial: { opacity: 0, height: 0 },
        expanded: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.4, ease: "easeInOut" }
        },
        collapsed: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={fitTrackLogo} className="footer-logo-img" alt="FitTrack logo" />
                    <p className="footer-tagline">Your definitive fitness tracker</p>
                    {/* <p className="footer-tagline">Tu compañero fitness definitivo</p> */}
                </div>

                <nav className="footer-nav">
                    <div className="footer-section">
                        <h3>Menu</h3>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* <div className="footer-section">
                        <h3>Servicios</h3>
                        <ul>
                            <li><a href="#training">Entrenamiento Personal</a></li>
                            <li><a href="#nutrition">Planes Nutricionales</a></li>
                            <li><a href="#tracking">Seguimiento Fitness</a></li>
                            <li><a href="#community">Comunidad</a></li>
                        </ul>
                    </div> */}
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
                        <span>Contact</span>
                    </div>

                    {/* TODO hacer esto */}
                    {/* <motion.div
                        className="contact-info"
                        variants={contactVariants}
                        initial="initial"
                        animate={isContactExpanded ? "expanded" : "collapsed"}
                    >
                        <div className="contact-item">
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
                        </div>
                    </motion.div> */}
                </div>

                <div className="footer-social">
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
                </div>
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