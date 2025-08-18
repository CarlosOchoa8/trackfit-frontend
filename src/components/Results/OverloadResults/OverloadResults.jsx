import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
    IoAnalyticsOutline,
    IoBarChartOutline,
    IoFitnessOutline,
    IoGridOutline,
    IoListOutline,
    IoSpeedometerOutline,
    IoTrendingDownOutline,
    IoTrendingUpOutline
} from 'react-icons/io5';
import {
    Area,
    AreaChart,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { itemVariants } from './animations';
import './overloadResults.css';
import { chartTypes, metrics } from './animations';


const OverloadResults = ({ overloadData }) => {
    const [selectedMetric, setSelectedMetric] = useState('volume');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [chartType, setChartType] = useState('line'); // 'line', 'area', 'composed'

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
            short: { day: 'numeric', month: 'short' },
            long: { day: 'numeric', month: 'long', year: 'numeric' },
        };
        return date.toLocaleDateString('es-ES', options[format]);
    };

    // Procesar datos para la gráfica
    const chartData = useMemo(() => {
        if (!overloadData || !overloadData[selectedExercise]) {
            return [];
        }

        const rawPeriods = overloadData[selectedExercise];
        if (!Array.isArray(rawPeriods) || rawPeriods.length === 0) {
            return [];
        }

        return rawPeriods.map((period, index) => ({
            period: `P${index + 1}`,
            periodLabel: `${formatDate(period.from)} - ${formatDate(period.to)}`,
            date: period.to,
            volume: period.metrics.volume.percentage_diff,
            absoluteIntensity: period.metrics.absolute_intensity.percentage_diff,
            weight: period.metrics.weight.percentage_diff,
            density: period.metrics.density.percentage_diff,
            // Valores absolutos para el tooltip
            volumeAbsolute: period.metrics.volume.current_value,
            intensityAbsolute: period.metrics.absolute_intensity.current_value,
            weightAbsolute: period.metrics.weight.current_value,
            densityAbsolute: period.metrics.density.current_value,
            // Cambios absolutos
            volumeChange: period.metrics.volume.absolute_diff,
            intensityChange: period.metrics.absolute_intensity.absolute_diff,
            weightChange: period.metrics.weight.absolute_diff,
            densityChange: period.metrics.density.absolute_diff,
        }));
    }, [overloadData, selectedExercise]);

    // Calcular estadísticas resumidas
    const summary = useMemo(() => {
        if (chartData.length === 0) return null;

        const totalPeriods = chartData.length;
        const metricsKeys = ['volume', 'absoluteIntensity', 'weight', 'density'];

        const avgProgress = metricsKeys.reduce((acc, metric) => {
            const avg = chartData.reduce((sum, item) => sum + item[metric], 0) / totalPeriods;
            acc[metric] = avg;
            return acc;
        }, {});

        const lastPeriod = chartData[chartData.length - 1];

        return {
            totalPeriods,
            avgProgress,
            lastPeriod,
            overallTrend: avgProgress[selectedMetric] > 0 ? 'positive' : 'negative'
        };
    }, [chartData, selectedMetric]);

    // Componente de tooltip personalizado
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <h4 className="tooltip-title">{data.periodLabel}</h4>
                    <div className="tooltip-content">
                        {payload.map((entry, index) => (
                            <div key={index} className="tooltip-item" style={{ color: entry.color }}>
                                <span className="tooltip-label">{entry.name}:</span>
                                <span className="tooltip-value">
                                    {entry.value > 0 ? '+' : ''}{entry.value.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Renderizar la gráfica según el tipo seleccionado
    const renderChart = () => {
        const commonProps = {
            width: '100%',
            height: 400,
            data: chartData,
            margin: { top: 20, right: 30, left: 20, bottom: 60 }
        };

        switch (chartType) {
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="period"
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Change (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke={metrics.find(m => m.key === selectedMetric)?.color}
                            strokeWidth={3}
                            fill="url(#colorGradient)"
                            dot={{ fill: metrics.find(m => m.key === selectedMetric)?.color, strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: metrics.find(m => m.key === selectedMetric)?.color, strokeWidth: 2 }}
                        />
                        {/* Línea de referencia en 0 */}
                        <Line
                            type="monotone"
                            dataKey={() => 0}
                            stroke="#ef4444"
                            strokeDasharray="5 5"
                            dot={false}
                            strokeWidth={1}
                        />
                    </AreaChart>
                );

            case 'composed':
                return (
                    <ComposedChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="period"
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Change (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="volume"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                            name="Volume"
                        />
                        <Line
                            type="monotone"
                            dataKey="absoluteIntensity"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Intensity"
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            name="Weight"
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="density"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Density"
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        />
                    </ComposedChart>
                );

            default: // line
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="period"
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="#6b7280"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Change (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Volume"
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="absoluteIntensity"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Intensity"
                            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            name="Weight"
                            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#f59e0b", strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="density"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Density"
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                        />
                        {/* Línea de referencia en 0 */}
                        <Line
                            type="monotone"
                            dataKey={() => 0}
                            stroke="#ef4444"
                            strokeDasharray="5 5"
                            dot={false}
                            strokeWidth={1}
                            name="Baseline"
                        />
                    </LineChart>
                );
        }
    };

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
        <motion.div
            className="overload-results"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
        >
            {/* Header Section */}
            <div className="overload-header">
                <h2 className="overload-title">
                    <IoAnalyticsOutline className="title-icon" />
                    Progressive Overload Analysis
                </h2>
                <p className="overload-subtitle">
                    Visual progression tracking across training periods
                </p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="summary-section">
                    <div className="summary-cards">
                        <motion.div
                            className="summary-card periods"
                            variants={itemVariants}
                        >
                            <div className="summary-label">Total Periods</div>
                            <div className="summary-value">{summary.totalPeriods}</div>
                        </motion.div>

                        <motion.div
                            className="summary-card trend"
                            variants={itemVariants}
                        >
                            <div className="summary-label">Overall Trend</div>
                            <div className={`summary-value trend-${summary.overallTrend}`}>
                                {summary.overallTrend === 'positive' ? (
                                    <><IoTrendingUpOutline /> Positive</>
                                ) : (
                                    <><IoTrendingDownOutline /> Negative</>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="summary-card average"
                            variants={itemVariants}
                        >
                            <div className="summary-label">Avg {metrics.find(m => m.key === selectedMetric)?.label}</div>
                            <div className="summary-value">
                                {summary.avgProgress[selectedMetric] > 0 ? '+' : ''}
                                {summary.avgProgress[selectedMetric].toFixed(1)}%
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Controls Section */}
            <div className="controls-section">
                {/* Exercise Selector */}
                <div className="exercise-selector">
                    <div className="selector-label">
                        <IoListOutline className="selector-icon" />
                        Exercise:
                    </div>
                    <div className="exercise-buttons">
                        {availableExercises.map(exercise => {
                            const ExerciseIcon = exercise.icon;
                            return (
                                <button
                                    key={exercise.key}
                                    className={`exercise-button ${selectedExercise === exercise.key ? 'active' : ''}`}
                                    onClick={() => setSelectedExercise(exercise.key)}
                                >
                                    <ExerciseIcon className="exercise-icon" />
                                    {exercise.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chart Type Selector */}
                <div className="chart-type-selector">
                    <div className="selector-label">
                        <IoBarChartOutline className="selector-icon" />
                        Chart Type:
                    </div>
                    <div className="chart-type-buttons">
                        {chartTypes.map(type => {
                            const TypeIcon = type.icon;
                            return (
                                <button
                                    key={type.key}
                                    className={`chart-type-button ${chartType === type.key ? 'active' : ''}`}
                                    onClick={() => setChartType(type.key)}
                                >
                                    <TypeIcon className="type-icon" />
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Metric Selector (solo para gráficas individuales) */}
                {chartType !== 'line' && chartType !== 'composed' && (
                    <div className="metric-selector">
                        <div className="selector-label">
                            <IoSpeedometerOutline className="selector-icon" />
                            Metric:
                        </div>
                        <div className="metric-buttons">
                            {metrics.map(metric => {
                                const MetricIcon = metric.icon;
                                return (
                                    <button
                                        key={metric.key}
                                        className={`metric-button ${selectedMetric === metric.key ? 'active' : ''}`}
                                        onClick={() => setSelectedMetric(metric.key)}
                                        style={{ borderColor: selectedMetric === metric.key ? metric.color : undefined }}
                                    >
                                        <MetricIcon className="metric-icon" />
                                        {metric.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Section */}
            <motion.div
                className="chart-section"
                variants={itemVariants}
                key={`${selectedExercise}-${chartType}-${selectedMetric}`}
            >
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Chart Legend Info */}
            <div className="chart-info">
                <div className="info-item">
                    <div className="info-indicator positive"></div>
                    <span>Positive progression (improvement)</span>
                </div>
                <div className="info-item">
                    <div className="info-indicator negative"></div>
                    <span>Negative progression (decline)</span>
                </div>
                <div className="info-item">
                    <div className="info-indicator baseline"></div>
                    <span>Baseline (no change)</span>
                </div>
            </div>
        </motion.div>
    );
};

export default OverloadResults;