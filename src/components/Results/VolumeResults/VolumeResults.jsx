import { motion } from "framer-motion";
import {
    IoCalendarOutline,
    IoFitnessOutline,
    IoStatsChartOutline,
} from "react-icons/io5";
import { itemVariants } from "./animations";
import "./volumeResults.css";


const VolumeResults = ({ volumeData }) => {

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


    return (
        <div className="volume-results">
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
                                    {Object.entries(sessions).map(([date, sessionData]) => (
                                        <div key={date} className="effective-volume-session">
                                            <span className="session-date-small">
                                                {formatDate(date, 'compact')}
                                            </span>
                                            <span className="effective-percentage">
                                                {sessionData.effective_volume}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolumeResults;