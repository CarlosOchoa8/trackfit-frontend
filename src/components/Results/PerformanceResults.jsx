import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoTrendingUpOutline,
    IoBarChartOutline,
    IoCalendarOutline,
    IoFitnessOutline
} from "react-icons/io5";
import "./PerformanceResults.css";

const PerformanceResults = ({ data }) => {
    const [activeTab, setActiveTab] = useState('volume');

    // Extraer datos
    const volumeData = data?.data?.volume_performance || {};
    const oneRMData = data?.data?.['1rm_performance'] || {};

    // Función para formatear números
    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-ES', {
            maximumFractionDigits: 1
        }).format(num);
    };

    // Función para formatear fechas
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="performance-results"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <div className="results-header">
                <h3 className="results-main-title">
                    <IoTrendingUpOutline className="header-icon" />
                    Performance Analysis
                </h3>
                <p className="results-subtitle">
                    Detailed workout metrics
                </p>
            </div>

            {/* Tabs */}
            <div className="results-tabs">
                <button
                    className={`tab-button ${activeTab === 'volume' ? 'active' : ''}`}
                    onClick={() => setActiveTab('volume')}
                >
                    <IoBarChartOutline className="tab-icon" />
                    Volume
                </button>
                <button
                    className={`tab-button ${activeTab === '1rm' ? 'active' : ''}`}
                    onClick={() => setActiveTab('1rm')}
                >
                    <IoFitnessOutline className="tab-icon" />
                    1RM Estimated
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'volume' && (
                    <motion.div
                        key="volume"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="tab-content"
                    >
                        {/* Volumen por ejercicio */}
                        <div className="metrics-section">
                            <h4 className="section-title">
                                <IoFitnessOutline className="section-icon" />
                                Total Volume by Exercise
                            </h4>
                            <div className="metrics-grid">
                                {Object.entries(volumeData.total_volume || {}).map(([exercise, volume]) => (
                                    <motion.div
                                        key={exercise}
                                        className="metric-card"
                                        variants={itemVariants}
                                    >
                                        <div className="metric-header">
                                            <span className="metric-label">{exercise}</span>
                                        </div>
                                        <div className="metric-value">
                                            {formatNumber(volume)} <span className="metric-unit">kg</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Volumen por sesión */}
                        <div className="metrics-section">
                            <h4 className="section-title">
                                <IoCalendarOutline className="section-icon" />
                                Volume per session
                            </h4>
                            <div className="session-list">
                                {Object.entries(volumeData.total_session_volume || {})
                                    .sort(([a], [b]) => new Date(b) - new Date(a))
                                    .map(([date, volume]) => (
                                        <motion.div
                                            key={date}
                                            className="session-item"
                                            variants={itemVariants}
                                        >
                                            <div className="session-date">
                                                <IoCalendarOutline className="date-icon" />
                                                {formatDate(date)}
                                            </div>
                                            <div className="session-volume">
                                                {formatNumber(volume)} kg
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === '1rm' && (
                    <motion.div
                        key="1rm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="tab-content"
                    >
                        <div className="metrics-section">
                            <h4 className="section-title">
                                <IoFitnessOutline className="section-icon" />
                                1RM Estimated per Exercise
                            </h4>
                            <div className="rm-cards-grid">
                                {Object.entries(oneRMData).map(([exercise, formulas]) => (
                                    <div key={exercise} className="rm-exercise-card">
                                        <div className="rm-card-header">
                                            <h5 className="rm-card-title">{exercise}</h5>
                                        </div>
                                        <div className="rm-formulas-container">
                                            <div className="rm-formula-row main-formula">
                                                <span className="rm-formula-label">Epley</span>
                                                <span className="rm-formula-result">{formatNumber(formulas.epley)} lbs</span>
                                            </div>
                                            <div className="rm-formula-row">
                                                <span className="rm-formula-label">Brzycki</span>
                                                <span className="rm-formula-result">{formatNumber(formulas.brzycki)} lbs</span>
                                            </div>
                                            <div className="rm-formula-row">
                                                <span className="rm-formula-label">Lombardi</span>
                                                <span className="rm-formula-result">{formatNumber(formulas.lombardi)} lbs</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PerformanceResults;