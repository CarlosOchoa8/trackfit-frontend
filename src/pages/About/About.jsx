import { motion } from "framer-motion";
import fitTrackLogo from "../../../fitTrackLogo.svg";
import "./About.css";
import {
    cardVariants,
    containerVariants,
    itemVariants,
    features,
    heroLogoAnimation,
    heroLogoTransition
} from "./animations.jsx";

const About = () => {
    return (
        <motion.div
            className="about-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.section
                className="about-hero"
                variants={itemVariants}
            >
                <div className="hero-content">
                    <motion.div
                        className="hero-logo"
                        animate={heroLogoAnimation}
                        transition={heroLogoTransition}
                    >
                        <img src={fitTrackLogo} alt="TrackFit Logo" />
                    </motion.div>
                    <h1>TrackFit</h1>
                    <p className="hero-subtitle">
                        Fitness tracking, simplified.
                    </p>
                </div>
            </motion.section>

            {/* Main Content */}
            <motion.section
                className="main-content"
                variants={itemVariants}
            >
                <div className="content-wrapper">
                    <motion.div className="description" variants={itemVariants}>
                        <p>
                            TrackFit helps you know your fitness progress in a simple and effective way.
                            No complications, just info.
                        </p>
                    </motion.div>

                    <motion.div
                        className="features-minimal"
                        variants={itemVariants}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-item"
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <div className="feature-content">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA Section */}
            {/* <motion.section
                className="cta-minimal"
                variants={itemVariants}
            >
                <motion.button
                    className="cta-button-minimal"
                    whileHover={{
                        scale: 1.02,
                        backgroundColor: "#047857"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/'}
                >
                    <IoFitnessOutline size={20} />
                    Start Tracking
                </motion.button>
            </motion.section> */}
        </motion.div>
    );
};

export default About;