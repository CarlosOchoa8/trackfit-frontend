import { useState } from "react";
import { IoAnalyticsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import {
    buttonVariants,
    iconAnimation,
    buttonTapAnimation,
    spinnerAnimation,
    resultsVariants
} from "./animations";
import "./PerformanceCalculator.css";

const PerformanceCalculator = ({ exerciseData }) => {
    console.log("CALCULADOR DE PERFORMANCAI===============data", exerciseData);

    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleRequest = () => {
        console.log("HANDLE REQUEST");
        setIsLoading(true);

        // Simulación de carga
        setTimeout(() => {
            setIsLoading(false);
            setShowResults(true);
        }, 1000);
    };

    return (
        <div className="performance-container">
            <motion.button
                onClick={handleRequest}
                disabled={isLoading}
                className={`calculate-button ${isLoading ? 'loading' : ''}`}
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
                whileTap={buttonTapAnimation}
            >
                <motion.span
                    className="button-icon"
                    initial={iconAnimation.initial}
                    animate={iconAnimation.animate}
                    transition={iconAnimation.transition}
                >
                    <IoAnalyticsOutline className={isLoading ? "pulse-icon" : ""} />
                </motion.span>
                <span className="button-text">
                    {isLoading ? "Calculando..." : "Calcular Rendimiento"}
                </span>
                {isLoading && (
                    <motion.span
                        className="spinner-container"
                        initial={spinnerAnimation.initial}
                        animate={spinnerAnimation.animate}
                        transition={spinnerAnimation.transition}
                    >
                        <div className="spinner"></div>
                    </motion.span>
                )}
            </motion.button>

            {showResults && (
                <motion.div
                    className="results-container"
                    initial="hidden"
                    animate="visible"
                    variants={resultsVariants}
                >
                    <h3 className="results-title">Resultados de Rendimiento</h3>
                    <p className="results-text">Información resultante de calcular rendimiento</p>
                </motion.div>
            )}
        </div>
    );
};

export default PerformanceCalculator;