import { useState } from "react";
import { IoAnalyticsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
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

    // Variantes de animación para el botón
    const buttonVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
            }
        }
    };

    // Variantes para el contenedor de resultados
    const resultsVariants = {
        hidden: {
            opacity: 0,
            y: 10,
            height: 0
        },
        visible: {
            opacity: 1,
            y: 0,
            height: "auto",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.5
            }
        }
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
                whileTap={{ scale: 0.98 }}
            >
                <motion.span
                    className="button-icon"
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                >
                    <IoAnalyticsOutline className={isLoading ? "pulse-icon" : ""} />
                </motion.span>
                <span className="button-text">
                    {isLoading ? "Calculando..." : "Calcular Rendimiento"}
                </span>
                {isLoading && (
                    <motion.span
                        className="spinner-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
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