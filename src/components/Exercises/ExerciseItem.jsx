import { motion } from "framer-motion";
import React from "react";
import "./ExerciseItem.css";


const ExerciseItem = ({ exercisesData }) => {
    return (
        <div className="exercise-item-cont">
            {(!exercisesData || exercisesData.length === 0 || !exercisesData[0].exercise.name) ? (
                <p>No hay ejercicios registrados aún.</p>
            ) : (
                exercisesData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="exercise-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className="exercise-header">
                            <div className="exercise-image-placeholder" />
                            <h3 className="exercise-name">{item.exercise.name}</h3>
                        </div>

                        {/* Tabla de datos */}
                        <div className="exercise-table">
                            <div className="table-header">
                                <span>Fecha</span>
                                <span>Peso</span>
                                <span>Reps</span>
                                <span>Series</span>
                                <span>Intensidad</span>
                            </div>
                            {item.exercise.data.map((entry, i) => (
                                <div key={i} className="table-row">
                                    <span>{entry.date || '-'}</span>
                                    <span>{entry.weight}</span>
                                    <span>{entry.reps}</span>
                                    <span>{entry.series}</span>
                                    <span>{entry.intensityMeasure}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default ExerciseItem;
