import { motion } from "framer-motion";
import { useState } from "react";
import { IoAnalyticsOutline } from "react-icons/io5";
import { httpRequest } from "../../helpers/httpRequest";
import {
    buttonTapAnimation,
    buttonVariants,
    iconAnimation,
    spinnerAnimation
} from "./animations";
import "./PerformanceCalculator.css";


const PerformanceCalculator = ({ exerciseData, handlePerformanceResults }) => {

    const [isLoading, setIsLoading] = useState(false);
    // const [showResults, setShowResults] = useState(false);

    const handleRequest = (e) => {
        e.preventDefault()
        setIsLoading(true);

        // Simulación de carga
        setTimeout(() => {
            setIsLoading(false);
            // setShowResults(true);
        }, 1000);

        setTimeout(() => {
            setIsLoading(false);
            // setShowResults(true);
            const body = {
                exercises: exerciseData.map(item => ({
                // exercises: testData.map(item => ({
                    name: item.name,
                    data: item.data
                }))
            };
            const request = httpRequest();
            const rapidApiOptions = {
                headers: {
                    "Content-Type": "application/json"
                },
                body
            };
            request.post(
                `${import.meta.env.VITE_EXERCISE_BACKEND_API}/calculate`,
                rapidApiOptions
            )
                .then(data => {
                    handlePerformanceResults(data);
                })
                .catch(console.error);
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
                    {isLoading ? "Calculating..." : "Calculate Performance"}
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

            {/* {showResults && (
                <motion.div
                    className="results-container"
                    initial="hidden"
                    animate="visible"
                    variants={resultsVariants}
                >
                    <h3 className="results-title">Resultados de Rendimiento</h3>
                    <p className="results-text">Información resultante de calcular rendimiento</p>
                </motion.div>
            )} */}
        </div>
    );
};

export default PerformanceCalculator;