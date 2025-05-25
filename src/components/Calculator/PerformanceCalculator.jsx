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
import { httpRequest } from "../../helpers/httpRequest";

// TODO remover esto
const testData = [
    {
        "name": "HackSquat",
        "data": [
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 11,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 10,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 9,
                "series": 1,
                "intensityMeasure": "10"
            }
        ]
    },
    {
        "name": "Press Militar",
        "data": [
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 11,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 10,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 9,
                "series": 1,
                "intensityMeasure": "10"
            }
        ]
    },
    {
        "name": "Sentadilla Zumo",
        "data": [
            {
                "date": "2025-05-08",
                "weight": 115,
                "reps": 11,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-08",
                "weight": 111,
                "reps": 10,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-09",
                "weight": 120,
                "reps": 9,
                "series": 1,
                "intensityMeasure": "10"
            }
        ]
    },
    {
        "name": "Tricep",
        "data": [
            {
                "date": "2025-05-06",
                "weight": 115,
                "reps": 11,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-06",
                "weight": 115,
                "reps": 10,
                "series": 1,
                "intensityMeasure": "10"
            },
            {
                "date": "2025-05-06",
                "weight": 115,
                "reps": 9,
                "series": 1,
                "intensityMeasure": "10"
            }
        ]
    }
]


const PerformanceCalculator = ({ exerciseData, handlePerformanceResults }) => {

    const [isLoading, setIsLoading] = useState(false);
    // const [showResults, setShowResults] = useState(false);

    const handleRequest = (e) => {
        e.preventDefault()
        console.log("HANDLE REQUEST");
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
                exercises: testData.map(item => ({
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
                "http://localhost:80/trackfit_api/calculate",
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