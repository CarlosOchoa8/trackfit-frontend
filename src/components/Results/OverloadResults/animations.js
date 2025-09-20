import {
    IoAnalyticsOutline,
    IoBarChartOutline,
    IoFitnessOutline,
    IoGridOutline,
    IoSpeedometerOutline,
    IoTrendingUpOutline
} from 'react-icons/io5';

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const metrics = [
        { key: 'weight', label: 'Weight', icon: IoFitnessOutline, unit: '%', color: '#f59e0b' },
        { key: 'volume', label: 'Volume', icon: IoBarChartOutline, unit: '%', color: '#3b82f6' },
        { key: 'density', label: 'Density', icon: IoTrendingUpOutline, unit: '%', color: '#10b981' },
        { key: 'absoluteIntensity', label: 'Intensity', icon: IoSpeedometerOutline, unit: '%', color: '#8b5cf6' },
    ];

export const chartTypes = [
        { key: 'area', label: 'Area', icon: IoAnalyticsOutline },
        { key: 'line', label: 'Line', icon: IoTrendingUpOutline },
        { key: 'composed', label: 'Combined', icon: IoGridOutline }
    ];
