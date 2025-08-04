import { motion } from "framer-motion";
import { useMemo } from "react";
import {
    IoArrowDownOutline,
    IoArrowUpOutline,
    IoRemoveOutline,
    IoStatsChartOutline,
    IoTrendingUpOutline
} from "react-icons/io5";
import "./progressResults.css";

const ProgressResults = ({ data }) => {
    // Funciones utilitarias
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
        const exercises = Object.keys(data);
        if (exercises.length === 0) return null;

        const progressions = exercises.map(exercise => {
            const progress = data[exercise]?.progress;
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
    }, [data]);

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="load-progress-results">
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
                    {Object.entries(data).map(([exercise, exerciseData]) => {
                        const { progress } = exerciseData;
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
                                            {formatDate(exerciseData.start_date, 'compact')} - {formatDate(exerciseData.end_date, 'compact')}
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
        </div>
    );
};

export default ProgressResults;