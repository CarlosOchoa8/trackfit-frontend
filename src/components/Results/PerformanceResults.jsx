import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoTrendingUpOutline,
    IoBarChartOutline,
    IoCalendarOutline,
    IoFitnessOutline,
    IoStatsChartOutline,
    IoArrowUpOutline,
    IoArrowDownOutline,
    IoRemoveOutline
} from "react-icons/io5";
import "./PerformanceResults.css";

const PerformanceResults = ({ data }) => {
    const [activeTab, setActiveTab] = useState('volume');

    // Extraer datos de manera más robusta
    const {
        volumeData,
        oneRMData,
        loadProgressData
    } = useMemo(() => {
        const apiData = data?.data || {};
        return {
            volumeData: apiData.volume_performance || {},
            oneRMData: apiData['1rm_performance'] || {},
            loadProgressData: apiData.load_progress || {}
        };
    }, [data]);

    // Función para formatear números con soporte para diferentes rangos
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

    // Función para formatear fechas con más opciones
    const formatDate = (dateStr, format = 'short') => {
        const date = new Date(dateStr);
        const options = {
            short: { day: 'numeric', month: 'short' },
            long: { day: 'numeric', month: 'long', year: 'numeric' },
            compact: { day: '2-digit', month: '2-digit' }
        };

        return date.toLocaleDateString('es-ES', options[format]);
    };

    // Función para determinar el ícono y color de progreso
    const getProgressIndicator = (weightDiff, percentage) => {
        const numericPercentage = parseFloat(percentage.replace('%', ''));

        if (weightDiff > 0) {
            return {
                icon: IoArrowUpOutline,
                color: '#059669',
                bgColor: '#ecfdf5',
                borderColor: '#10b981',
                text: 'Progreso positivo'
            };
        } else if (weightDiff < 0) {
            return {
                icon: IoArrowDownOutline,
                color: '#dc2626',
                bgColor: '#fef2f2',
                borderColor: '#f87171',
                text: 'Regresión'
            };
        } else {
            return {
                icon: IoRemoveOutline,
                color: '#6b7280',
                bgColor: '#f9fafb',
                borderColor: '#d1d5db',
                text: 'No changes'
            };
        }
    };

    // Calcular estadísticas de progreso
    const progressStats = useMemo(() => {
        const exercises = Object.keys(loadProgressData);
        if (exercises.length === 0) return null;

        const progressions = exercises.map(exercise => {
            const progress = loadProgressData[exercise]?.progress;
            return {
                exercise,
                weightDiff: progress?.weight_diff || 0,
                percentage: parseFloat(progress?.percentage_progression?.replace('%', '') || '0')
            };
        });

        const totalProgression = progressions.reduce((sum, p) => sum + p.percentage, 0);
        const averageProgression = totalProgression / progressions.length;
        const positiveProgressions = progressions.filter(p => p.weightDiff > 0).length;

        return {
            averageProgression,
            positiveProgressions,
            totalExercises: exercises.length,
            progressions
        };
    }, [loadProgressData]);

    // Animaciones mejoradas
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
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    const tabContentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
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
                    Análisis completo de métricas de entrenamiento
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
                <button
                    className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('progress')}
                >
                    <IoStatsChartOutline className="tab-icon" />
                    Load Progress
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'volume' && (
                    <motion.div
                        key="volume"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
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

                        {/* Volumen efectivo */}
                        {volumeData.effective_volume && Object.keys(volumeData.effective_volume).length > 0 && (
                            <div className="metrics-section">
                                <h4 className="section-title">
                                    <IoStatsChartOutline className="section-icon" />
                                    Effective Volume
                                </h4>
                                <div className="effective-volume-grid">
                                    {Object.entries(volumeData.effective_volume).map(([exercise, sessions]) => (
                                        <motion.div
                                            key={exercise}
                                            className="effective-volume-card"
                                            variants={itemVariants}
                                        >
                                            <h5 className="effective-volume-title">{exercise}</h5>
                                            <div className="effective-volume-sessions">
                                                {Object.entries(sessions).map(([date, data]) => (
                                                    <div key={date} className="effective-volume-session">
                                                        <span className="session-date-small">
                                                            {formatDate(date, 'compact')}
                                                        </span>
                                                        <span className="effective-percentage">
                                                            {data.effective_volume}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === '1rm' && (
                    <motion.div
                        key="1rm"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'progress' && (
                    <motion.div
                        key="progress"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="tab-content"
                    >
                        {/* Resumen de progreso */}
                        {progressStats && (
                            <div className="metrics-section">
                                <h4 className="section-title">
                                    <IoStatsChartOutline className="section-icon" />
                                    Progress Summary
                                </h4>
                                <div className="progress-summary-grid">
                                    <motion.div className="progress-summary-card" variants={itemVariants}>
                                        <div className="summary-label">Progreso Promedio</div>
                                        <div className="summary-value">
                                            {formatNumber(progressStats.averageProgression, { maximumFractionDigits: 2 })}%
                                        </div>
                                    </motion.div>
                                    <motion.div className="progress-summary-card" variants={itemVariants}>
                                        <div className="summary-label">Ejercicios Mejorados</div>
                                        <div className="summary-value">
                                            {progressStats.positiveProgressions}/{progressStats.totalExercises}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        )}

                        {/* Progreso por ejercicio */}
                        <div className="metrics-section">
                            <h4 className="section-title">
                                <IoTrendingUpOutline className="section-icon" />
                                Load Progress by Exercise
                            </h4>
                            <div className="progress-cards-grid">
                                {Object.entries(loadProgressData).map(([exercise, data]) => {
                                    const { progress } = data;
                                    const indicator = getProgressIndicator(
                                        progress.weight_diff,
                                        progress.percentage_progression
                                    );
                                    const ProgressIcon = indicator.icon;

                                    return (
                                        <motion.div
                                            key={exercise}
                                            className="progress-exercise-card"
                                            variants={itemVariants}
                                            style={{
                                                borderColor: indicator.borderColor,
                                                backgroundColor: indicator.bgColor
                                            }}
                                        >
                                            <div className="progress-card-header">
                                                <h5 className="progress-card-title">{exercise}</h5>
                                                <div
                                                    className="progress-indicator"
                                                    style={{ color: indicator.color }}
                                                >
                                                    <ProgressIcon className="progress-icon" />
                                                    <span className="progress-text">{indicator.text}</span>
                                                </div>
                                            </div>

                                            <div className="progress-details">
                                                <div className="progress-period">
                                                    <span className="period-label">Period:</span>
                                                    <span className="period-dates">
                                                        {formatDate(data.start_date, 'compact')} - {formatDate(data.end_date, 'compact')}
                                                    </span>
                                                </div>

                                                <div className="progress-metrics">
                                                    <div className="progress-metric">
                                                        <span className="metric-label">Initial weight:</span>
                                                        <span className="metric-value">
                                                            {formatNumber(progress.start_weight)} kg
                                                        </span>
                                                    </div>
                                                    <div className="progress-metric">
                                                        <span className="metric-label">Final weight:</span>
                                                        <span className="metric-value">
                                                            {formatNumber(progress.end_weight)} kg
                                                        </span>
                                                    </div>
                                                    <div className="progress-metric highlight">
                                                        <span className="metric-label">Difference:</span>
                                                        <span
                                                            className="metric-value"
                                                            style={{ color: indicator.color }}
                                                        >
                                                            {progress.weight_diff >= 0 ? '+' : ''}{formatNumber(progress.weight_diff)} kg
                                                        </span>
                                                    </div>
                                                    <div className="progress-metric highlight">
                                                        <span className="metric-label">Progress:</span>
                                                        <span
                                                            className="metric-value"
                                                            style={{ color: indicator.color }}
                                                        >
                                                            {progress.percentage_progression}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default PerformanceResults;