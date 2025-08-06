import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
    IoAnalyticsOutline,
    IoArrowDownOutline,
    IoArrowUpOutline,
    IoBarChartOutline,
    IoCalendarOutline,
    IoFitnessOutline,
    IoGridOutline,
    IoListOutline,
    IoRemoveOutline,
    IoSpeedometerOutline,
    IoTrendingDownOutline,
    IoTrendingUpOutline
} from 'react-icons/io5';
import './overloadResults.css';
import { itemVariants } from './animations';


const OverloadResults = ({ overloadData }) => {
    const [selectedMetric, setSelectedMetric] = useState('volume');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    // Extraer ejercicios disponibles
    const availableExercises = useMemo(() => {
        if (!overloadData) return [];

        const exercises = Object.keys(overloadData);
        return exercises.map(exercise => ({
            key: exercise,
            name: exercise,
            icon: IoFitnessOutline
        }));
    }, [overloadData]);

    useEffect(() => {
        if (availableExercises.length > 0 && !selectedExercise) {
            setSelectedExercise(availableExercises[0].key);
        }
    }, [availableExercises, selectedExercise]);

    const formatDate = (dateStr, format = 'short') => {
        const date = new Date(dateStr);
        const options = {
            short: { day: 'numeric', month: 'short', year: '2-digit' },
            long: { day: 'numeric', month: 'long', year: 'numeric' },
        };
        return date.toLocaleDateString('es-ES', options[format]);
    };

    const formatNumber = (num, options = {}) => {
        const { maximumFractionDigits = 1, compactDisplay = false } = options;

        if (compactDisplay && Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (compactDisplay && Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }

        return new Intl.NumberFormat('es-ES', {
            maximumFractionDigits,
            minimumFractionDigits: 0
        }).format(num);
    };

    const getProgressIndicator = (percentageChange) => {
        if (percentageChange > 10) {
            return {
                icon: IoTrendingUpOutline,
                color: '#059669',
                bg: '#ecfdf5',
                status: 'Excellent Progress'
            };
        } else if (percentageChange > 0) {
            return {
                icon: IoArrowUpOutline,
                color: '#16a34a',
                bg: '#f0fdf4',
                status: 'Positive Progress'
            };
        } else if (percentageChange < -10) {
            return {
                icon: IoTrendingDownOutline,
                color: '#dc2626',
                bg: '#fef2f2',
                status: 'Significant Decline'
            };
        } else if (percentageChange < 0) {
            return {
                icon: IoArrowDownOutline,
                color: '#ea580c',
                bg: '#fff7ed',
                status: 'Minor Decline'
            };
        } else {
            return {
                icon: IoRemoveOutline,
                color: '#6b7280',
                bg: '#f9fafb',
                status: 'No Change'
            };
        }
    };

    const processedData = useMemo(() => {
        if (!overloadData || !overloadData[selectedExercise]) {
          return { periods: [], summary: null };
        }

        const rawPeriods = overloadData[selectedExercise];
        if (!Array.isArray(rawPeriods) || rawPeriods.length === 0) {
          return { periods: [], summary: null };
        }

        const periods = rawPeriods.map((period, index) => ({
            id: index,
            from: period.from,
            to: period.to,
            duration: Math.ceil((new Date(period.to) - new Date(period.from)) / (1000 * 60 * 60 * 24)),
            metrics: period.metrics
        }));

        const totalPeriods = periods.length;
        const metricsProgress = {
            volume: periods.map(p => p.metrics.volume.percentage_diff),
            absolute_intensity: periods.map(p => p.metrics.absolute_intensity.percentage_diff),
            density: periods.map(p => p.metrics.density.percentage_diff)
        };

        const avgProgress = {
            volume: metricsProgress.volume.reduce((sum, val) => sum + val, 0) / totalPeriods,
            absolute_intensity: metricsProgress.absolute_intensity.reduce((sum, val) => sum + val, 0) / totalPeriods,
            density: metricsProgress.density.reduce((sum, val) => sum + val, 0) / totalPeriods
        };

        return { periods, summary: { totalPeriods, avgProgress } };
    }, [overloadData, selectedExercise]);


    const metrics = [
        { key: 'volume', label: 'Volume', icon: IoBarChartOutline, unit: '' },
        { key: 'absolute_intensity', label: 'Intensity', icon: IoSpeedometerOutline, unit: 'lbs' },
        { key: 'density', label: 'Density', icon: IoFitnessOutline, unit: '' }
    ];

    if (!overloadData || Object.keys(overloadData).length === 0) {
        return (
            <div className="overload-results">
                <div className="empty-state">
                    <IoAnalyticsOutline className="empty-icon" />
                    <h3>No Overload Data Available</h3>
                    <p>Start tracking your workouts to see overload progression analysis.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overload-results">
            {/* Header Section */}
            <div className="overload-header">
                <h2 className="overload-title">
                    <IoAnalyticsOutline className="title-icon" />
                    Progressive Overload Analysis
                </h2>
                <p className="overload-subtitle">
                    Track your progression across different training periods
                </p>
            </div>

            {/* Exercise Selector */}
            <div className="exercise-selector">
                <div className="selector-label">
                    <IoListOutline className="selector-icon" />
                    Select Exercise to Analyze:
                </div>
                <div className="exercise-buttons">
                    {availableExercises.map(exercise => {
                        const ExerciseIcon = exercise.icon;
                        return (
                            <button
                                key={exercise.key}
                                className={`exercise-button ${selectedExercise === exercise.key ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedExercise(exercise.key);
                                    setSelectedPeriod(null);
                                }}
                            >
                                <ExerciseIcon className="exercise-button-icon" />
                                <span className="exercise-button-text">{exercise.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary Cards */}
            {processedData.summary && (
                <div className="summary-section">
                    <div className="summary-cards">
                        <motion.div className="summary-card" variants={itemVariants}>
                            <div className="summary-label">Total Periods</div>
                            <div className="summary-value">{processedData.summary.totalPeriods}</div>
                        </motion.div>
                        <motion.div className="summary-card volume" variants={itemVariants}>
                            <div className="summary-label">Avg Volume Progress</div>
                            <div className="summary-value">
                                {processedData.summary.avgProgress.volume >= 0 ? '+' : ''}
                                {formatNumber(processedData.summary.avgProgress.volume)}%
                            </div>
                        </motion.div>
                        <motion.div className="summary-card intensity" variants={itemVariants}>
                            <div className="summary-label">Avg Intensity Progress</div>
                            <div className="summary-value">
                                {processedData.summary.avgProgress.absolute_intensity >= 0 ? '+' : ''}
                                {formatNumber(processedData.summary.avgProgress.absolute_intensity)}%
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Metric Selector */}
            <div className="metric-selector">
                <div className="selector-label">
                    <IoGridOutline className="selector-icon" />
                    Select Metric to Analyze:
                </div>
                <div className="metric-buttons">
                    {metrics.map(metric => {
                        const MetricIcon = metric.icon;
                        return (
                            <button
                                key={metric.key}
                                className={`metric-button ${selectedMetric === metric.key ? 'active' : ''}`}
                                onClick={() => setSelectedMetric(metric.key)}
                            >
                                <MetricIcon className="metric-icon" />
                                {metric.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Selection Info */}
            <div className="current-selection">
                <div className="selection-info">
                    <span className="selection-exercise">
                        {selectedExercise}
                    </span>
                    <span className="selection-separator">•</span>
                    <span className="selection-metric">
                        {metrics.find(m => m.key === selectedMetric)?.label}
                    </span>
                </div>
            </div>

            {/* Timeline Visualization */}
            {processedData.periods.length > 0 ? (
                <div className="timeline-section">
                    <h3 className="timeline-title">
                        {metrics.find(m => m.key === selectedMetric)?.label} Progression Timeline
                    </h3>
                    <div className="timeline-container">
                        <AnimatePresence>
                            {processedData.periods.map((period, index) => {
                                const metric = period.metrics[selectedMetric];
                                const indicator = getProgressIndicator(metric.percentage_diff);
                                const IndicatorIcon = indicator.icon;

                                return (
                                    <motion.div
                                        key={`${selectedExercise}-${period.id}`}
                                        className="timeline-item"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        style={{ backgroundColor: indicator.bg }}
                                        onClick={() => setSelectedPeriod(selectedPeriod === period.id ? null : period.id)}
                                    >
                                        <div className="timeline-header">
                                            <div className="timeline-period">
                                                <IoCalendarOutline className="calendar-icon" />
                                                <span className="period-dates">
                                                    {formatDate(period.from)} - {formatDate(period.to)}
                                                </span>
                                                <span className="period-duration">
                                                    ({period.duration} days)
                                                </span>
                                            </div>
                                            <div className="progress-indicator" style={{ color: indicator.color }}>
                                                <IndicatorIcon className="indicator-icon" />
                                                <span className="progress-percentage">
                                                    {metric.percentage_diff >= 0 ? '+' : ''}{formatNumber(metric.percentage_diff)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="progress-bar-container">
                                            <div className="progress-bar-background">
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${Math.min(Math.abs(metric.percentage_diff), 100)}%`,
                                                        backgroundColor: indicator.color
                                                    }}
                                                />
                                            </div>
                                            <span className="progress-status" style={{ color: indicator.color }}>
                                                {indicator.status}
                                            </span>
                                        </div>

                                        {/* Detailed metrics when expanded */}
                                        <AnimatePresence>
                                            {selectedPeriod === period.id && (
                                                <motion.div
                                                    className="timeline-details"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="details-grid">
                                                        <div className="detail-item">
                                                            <span className="detail-label">Previous Value:</span>
                                                            <span className="detail-value">
                                                                {formatNumber(metric.previous, { compactDisplay: true })}
                                                                {metrics.find(m => m.key === selectedMetric)?.unit}
                                                            </span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <span className="detail-label">Next Value:</span>
                                                            <span className="detail-value">
                                                                {formatNumber(metric.next, { compactDisplay: true })}
                                                                {metrics.find(m => m.key === selectedMetric)?.unit}
                                                            </span>
                                                        </div>
                                                        <div className="detail-item highlight">
                                                            <span className="detail-label">Absolute Change:</span>
                                                            <span className="detail-value" style={{ color: indicator.color }}>
                                                                {(metric.weight_diff || metric.dens_diff) >= 0 ? '+' : ''}
                                                                {formatNumber(metric.weight_diff || metric.dens_diff, { compactDisplay: true })}
                                                                {metrics.find(m => m.key === selectedMetric)?.unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="no-data-message">
                    <IoAnalyticsOutline className="no-data-icon" />
                    <h3>No Data Available</h3>
                    <p>No progression data found for {selectedExercise}.</p>
                </div>
            )}

            {/* Quick Insights */}
            {processedData.periods.length > 0 && (
                <div className="insights-section">
                    <h3 className="insights-title">Quick Insights - {selectedExercise}</h3>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <div className="insight-header">
                                <IoTrendingUpOutline className="insight-icon positive" />
                                <span>Best Progress Period</span>
                            </div>
                            <div className="insight-content">
                                {(() => {
                                    const bestPeriod = processedData.periods.reduce((best, period) =>
                                        period.metrics[selectedMetric].percentage_diff > best.metrics[selectedMetric].percentage_diff ? period : best
                                    );
                                    return (
                                        <div>
                                            <div className="insight-period">
                                                {formatDate(bestPeriod.from)} - {formatDate(bestPeriod.to)}
                                            </div>
                                            <div className="insight-value positive">
                                                +{formatNumber(bestPeriod.metrics[selectedMetric].percentage_diff)}%
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="insight-card">
                            <div className="insight-header">
                                <IoTrendingDownOutline className="insight-icon negative" />
                                <span>Challenging Period</span>
                            </div>
                            <div className="insight-content">
                                {(() => {
                                    const worstPeriod = processedData.periods.reduce((worst, period) =>
                                        period.metrics[selectedMetric].percentage_diff < worst.metrics[selectedMetric].percentage_diff ? period : worst
                                    );
                                    return (
                                        <div>
                                            <div className="insight-period">
                                                {formatDate(worstPeriod.from)} - {formatDate(worstPeriod.to)}
                                            </div>
                                            <div className="insight-value negative">
                                                {formatNumber(worstPeriod.metrics[selectedMetric].percentage_diff)}%
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverloadResults;
