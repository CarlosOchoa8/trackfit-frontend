import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ExerciseItem.css";


const ExerciseItem = ({ exercisesData }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        // Si la fecha ya está en formato YYYY-MM-DD, puedes mostrarla así o formatearla
        // Por ejemplo, convertir de YYYY-MM-DD a DD/MM/YYYY
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <motion.div
            className="exercise-item-cont"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="form-header">
                <h1 className="form-title">Mis Ejercicios</h1>
                <p className="form-subtitle">Registro de tus entrenamientos</p>
            </div>

            <AnimatePresence>
                {(!exercisesData || exercisesData.length === 0) ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="empty-exercises"
                    >
                        <div className="empty-icon">
                            <svg className="exercise-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p>No hay ejercicios registrados aún.</p>
                        <span className="empty-subtitle">Los ejercicios que registres aparecerán aquí.</span>
                    </motion.div>
                ) : (
                    exercisesData.map((item, index) => (
                        <motion.div
                            key={index}
                            className="exercise-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <div className="exercise-header">
                                <div className="exercise-image-placeholder" />
                                <div className="exercise-info">
                                    <h3 className="exercise-name">{item.name}</h3>
                                    <span className="exercise-count">{item.data.length} {item.data.length === 1 ? 'registro' : 'registros'}</span>
                                </div>
                            </div>

                            {/* Tabla de datos */}
                            <div className="exercise-table">
                                <div className="table-header">
                                    <span>Fecha</span>
                                    <span>Peso (kg)</span>
                                    <span>Repeticiones</span>
                                    <span>Series</span>
                                    <span>RPE / RIR</span>
                                </div>
                                <div className="table-body">
                                    {item.data.map((data, i) => (
                                        <div key={i} className="table-row">
                                            <span>{formatDate(data.date)}</span>
                                            <span>{data.weight || '-'}</span>
                                            <span>{data.reps || '-'}</span>
                                            <span>{data.series || '-'}</span>
                                            <span>{data.intensityMeasure || '-'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExerciseItem;
