import { motion } from "framer-motion";
import { IoFitnessOutline } from "react-icons/io5";
import "./rmResults.css";

const OneRMResults = ({ data }) => {
    const formatNumber = (num, options = {}) => {
        const {
            maximumFractionDigits = 1,
            minimumFractionDigits = 0,
            locale = 'es-ES'
        } = options;

        return new Intl.NumberFormat(locale, {
            maximumFractionDigits,
            minimumFractionDigits
        }).format(num);
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="onerm-results">
            <div className="metrics-section">
                <h4 className="section-title">
                    <IoFitnessOutline className="section-icon" />
                    1RM Estimated per Exercise
                </h4>
                <div className="rm-cards-grid">
                    {Object.entries(data).map(([exercise, formulas]) => (
                        <motion.div
                            key={exercise}
                            className="rm-exercise-card"
                            variants={itemVariants}
                        >
                            <div className="rm-card-header">
                                <h5 className="rm-card-title">{exercise}</h5>
                            </div>
                            <div className="rm-formulas-container">
                                <div className="rm-formula-row main-formula">
                                    <span className="rm-formula-label">Epley</span>
                                    <span className="rm-formula-result">
                                        {formatNumber(formulas.epley)} lbs
                                    </span>
                                </div>
                                <div className="rm-formula-row">
                                    <span className="rm-formula-label">Brzycki</span>
                                    <span className="rm-formula-result">
                                        {formatNumber(formulas.brzycki)} lbs
                                    </span>
                                </div>
                                <div className="rm-formula-row">
                                    <span className="rm-formula-label">Lombardi</span>
                                    <span className="rm-formula-result">
                                        {formatNumber(formulas.lombardi)} lbs
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OneRMResults;
