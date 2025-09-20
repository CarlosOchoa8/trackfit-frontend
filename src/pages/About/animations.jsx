import {
    IoBarChartOutline,
    IoStopwatchOutline,
    IoTrendingUpOutline,
} from "react-icons/io5";


export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2
        }
    }
};

export const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const cardVariants = {
    hover: {
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(5, 150, 105, 0.15)",
        transition: { duration: 0.3 }
    }
};

export const features = [
    {
        icon: <IoStopwatchOutline size={32} />,
        title: "Simple Tracking",
        description: "Record your workouts quickly and without complications."
    },
    {
        icon: <IoBarChartOutline size={32} />,
        title: "Visual Progress",
        description: "Visualize your evolution with clear and easy-to-understand charts."
    },
    {
        icon: <IoTrendingUpOutline size={32} />,
        title: "Continuous Improvement",
        description: "Identify patterns and optimize your performance day by day."
    }
];

export const heroLogoAnimation = {
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1]
};

export const heroLogoTransition = {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 5
};
