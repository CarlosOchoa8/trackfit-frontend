import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
    IoBarChartOutline,
    IoFitnessOutline,
    IoStatsChartOutline,
    IoTrendingUpOutline,
} from "react-icons/io5";
import "./PerformanceResults.css";

// Importar componentes separados
import OverloadResults from "./OverloadResults/OverloadResults";
import ProgressResults from "./ProgressResults/ProgressResults";
import RmResults from "./RmResults/RmResults";
import VolumeResults from "./VolumeResults/VolumeResults";
import { containerVariants, tabContentVariants } from "./animations";

const PerformanceResults = ({ data }) => {
    const [activeTab, setActiveTab] = useState('overload');

    const performanceData = useMemo(() => {
        console.log(data)
        const apiData = data?.data || {};
        return {
            volumeData: apiData.volume_performance || {},
            oneRMData: apiData.rm_performance || {},
            loadProgressData: apiData.load_progress || {},
            overloadData: apiData.overload_progress || {}
        };
    }, [data]);


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
                    {/* Análisis completo de métricas de entrenamiento */}
                    Workout metrics analysis.
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
                    className={`tab-button ${activeTab === 'rm' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rm')}
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
                <button
                    className={`tab-button ${activeTab === 'overload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overload')}
                >
                    <IoStatsChartOutline className="tab-icon" />
                    Overload
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="tab-content"
                >
                    {activeTab === 'volume' && (
                        <VolumeResults volumeData={performanceData.volumeData} />
                    )}
                    {activeTab === 'rm' && (
                        <RmResults rmData={performanceData.oneRMData} />
                    )}
                    {activeTab === 'progress' && (
                        <ProgressResults progressData={performanceData.loadProgressData} />
                    )}
                    {activeTab === 'overload' && (
                        <OverloadResults overloadData={performanceData.overloadData} />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default PerformanceResults;