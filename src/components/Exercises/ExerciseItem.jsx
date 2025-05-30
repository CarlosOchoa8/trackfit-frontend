import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import "./ExerciseItem.css";


const ExerciseItem = ({ exercisesData }) => {
    // Estado para controlar qué grupos de fecha están expandidos
    const [expandedGroups, setExpandedGroups] = useState({});

    const formatDate = (date) => {
        if (!date) { return '-'; }

        // Si es un objeto Date
        if (date instanceof Date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Si es un string en formato ISO (YYYY-MM-DD)
        if (typeof date === 'string' && date.includes('-')) {
            try {
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`;
            } catch (error) {
                console.error("Error al formatear la fecha:", error);
                return date; // Devuelve el string original si hay un error
            }
        }

        // Si es un timestamp (número) - por si acaso
        if (typeof date === 'number') {
            const dateObj = new Date(date);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Si no es ninguno de los anteriores, devolver el valor original
        return String(date);
    };

    // Función para agrupar los datos por fecha
    const groupDataByDate = (data) => {
        const groupedData = {};

        data.forEach(entry => {
            const dateKey = entry.date;
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = [];
            }
            groupedData[dateKey].push(entry);
        });

        // Convertir el objeto agrupado en un array de objetos
        return Object.keys(groupedData).map(date => ({
            date,
            entries: groupedData[date]
        }));
    };

    // Calcular el promedio de un valor numérico en un array de objetos
    const calculateAverage = (array, property) => {
        if (!array || array.length === 0) { return 0; }
        const sum = array.reduce((acc, item) => acc + parseFloat(item[property] || 0), 0);
        return (sum / array.length).toFixed(1);
    };

    // Alternar la expansión de un grupo de fecha
    const toggleExpandGroup = (exerciseIndex, dateIndex) => {
        const key = `${exerciseIndex}-${dateIndex}`;
        setExpandedGroups(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Verificar si un grupo está expandido
    const isGroupExpanded = (exerciseIndex, dateIndex) => {
        const key = `${exerciseIndex}-${dateIndex}`;
        return expandedGroups[key];
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
                    exercisesData.map((item, exerciseIndex) => {
                        // Agrupar los datos por fecha
                        const groupedData = groupDataByDate(item.data);

                        return (
                            <motion.div
                                key={exerciseIndex}
                                className="exercise-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: exerciseIndex * 0.1 }}
                            >
                                <div className="exercise-header">
                                    <div className="exercise-image-placeholder" />
                                    <div className="exercise-info">
                                        <h3 className="exercise-name">{item.name}</h3>
                                        <span className="exercise-count">
                                            {groupedData.length} {groupedData.length === 1 ? 'sesión' : 'sesiones'} con un total de {item.data.length} {item.data.length === 1 ? 'serie' : 'series'}
                                        </span>
                                    </div>
                                </div>

                                {/* Tabla de datos agrupados por fecha */}
                                <div className="exercise-table">
                                    <div className="table-header">
                                        <span>Fecha</span>
                                        <span>Series</span>
                                        <span>Peso promedio</span>
                                        <span>Reps promedio</span>
                                        <span>RPE / RIR</span>
                                    </div>
                                    <div className="table-body">
                                        {groupedData.map((dateGroup, dateIndex) => (
                                            <React.Fragment key={dateIndex}>
                                                <div
                                                    className={`table-row date-group ${isGroupExpanded(exerciseIndex, dateIndex) ? 'expanded' : ''}`}
                                                    onClick={() => toggleExpandGroup(exerciseIndex, dateIndex)}
                                                >
                                                    <span>{formatDate(dateGroup.date)}</span>
                                                    <span>{dateGroup.entries.length}</span>
                                                    <span>{calculateAverage(dateGroup.entries, 'weight')} kg</span>
                                                    <span>{calculateAverage(dateGroup.entries, 'reps')}</span>
                                                    <span>{dateGroup.entries[0].intensityMeasure || '-'}</span>
                                                </div>

                                                {/* Detalles de series expandibles */}
                                                <AnimatePresence>
                                                    {isGroupExpanded(exerciseIndex, dateIndex) && (
                                                        <motion.div
                                                            className="series-details"
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="series-details-header">
                                                                <span>Serie</span>
                                                                <span>Peso (kg)</span>
                                                                <span>Repeticiones</span>
                                                            </div>
                                                            {dateGroup.entries.map((entry, entryIndex) => (
                                                                <div key={entryIndex} className="series-detail-row">
                                                                    <span>Serie {entryIndex + 1}</span>
                                                                    <span>{entry.weight || '-'}</span>
                                                                    <span>{entry.reps || '-'}</span>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExerciseItem;