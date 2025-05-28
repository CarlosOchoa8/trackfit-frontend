import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ExerciseForm.css";

import { httpRequest } from "../../helpers/httpRequest";

// Objeto inicial para un conjunto de serie
const initialSeriesData = {
    weight: "",
    reps: "",
    intensityMeasure: ""
};

const initForm = {
    name: "",
    date: new Date(),
    seriesCount: 1, // Cantidad de series
    seriesData: [{ ...initialSeriesData }] // Array que contendrá los datos de cada serie
};

const rapidApiOptions = {
    headers: {
        "x-rapidapi-key": import.meta.env.VITE_EXERCISE_API_KEY,
        "x-rapidapi-host": import.meta.env.VITE_EXERCISE_API_HOST,
    },
};

const ExerciseForm = ({ handleSubmit }) => {
    const [form, setForm] = useState(initForm);
    const [exercisesList, setExercisesList] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [activeField, setActiveField] = useState(null);

    // Inicializar la fecha cuando el componente se monta
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            date: new Date()
        }));
    }, []);

    // Efecto para actualizar el array de datos de series cuando cambia el contador de series
    useEffect(() => {
        if (form.seriesCount > 0) {
            // Mantener los datos de series existentes y añadir nuevos si es necesario
            const newSeriesData = [...form.seriesData];

            // Si necesitamos más entradas, añadirlas
            while (newSeriesData.length < form.seriesCount) {
                newSeriesData.push({ ...initialSeriesData });
            }

            // Si tenemos demasiadas entradas, recortarlas
            if (newSeriesData.length > form.seriesCount) {
                newSeriesData.length = form.seriesCount;
            }

            setForm(prev => ({
                ...prev,
                seriesData: newSeriesData
            }));
        }
    }, [form.seriesCount]);

    const handleForm = (e) => {
        const { name, value } = e.target;

        // Manejo especial para el campo de fecha
        if (name === "date") {
            const dateObj = new Date(value);
            dateObj.setHours(0, 0, 0, 0);

            setForm({
                ...form,
                [name]: dateObj
            });
        }
        // Manejo especial para el contador de series
        else if (name === "seriesCount") {
            // Asegurarse de que el valor sea un número entre 1 y 10
            const count = Math.max(1, Math.min(10, parseInt(value) || 1));

            setForm({
                ...form,
                [name]: count
            });
        }
        else {
            setForm({
                ...form,
                [name]: value,
            });
        }
    };

    const detectIntensityType = (value) => {
        const numValue = parseFloat(value);

        if (isNaN(numValue)) {return null};

        if (numValue >= 0 && numValue <= 5.5) {
            return "RIR";
        } else if (numValue >= 6 && numValue <= 10) {
            return "RPE";
        } else {
            return null;
        }
    };

    const getIntensityTooltip = (value) => {
        const type = detectIntensityType(value);

        if (type === "RIR") {
            return `RIR - Reps in Reserve (0-5.5)
            Repetitions you could perform before muscular failure
    
            RIR Scale:
            - 0: Muscular failure - Cannot do more reps
            - 1: 1 rep in reserve - Very close to failure
            - 2: 2 reps in reserve - High effort
            - 3: 3 reps in reserve - Moderate effort
            - 4-5: 4-5 reps in reserve - Light effort`;
                } else if (type === "RPE") {
                    return `RPE - Rate of Perceived Exertion (6-10)
            Subjective perception of effort performed
            
            RPE Scale:
            - 6-7: Easy - Can talk comfortably
            - 8: Moderately difficult - Difficult conversation
            - 9: Very difficult - Can barely speak
            - 10: Maximum effort - Cannot maintain intensity`;
                }

        return `Intensity Measurement (0-10)
    
        RIR (0-5.5): Reps in Reserve
        → Repetitions you could do before failure
        
        RPE (6-10): Rate of Perceived Exertion
        → Subjective perception of effort performed
        
        The system automatically detects which scale to use based on the number you enter.`;
    };

    // Función para manejar cambios en los datos de una serie específica
    const handleSeriesDataChange = (index, field, value) => {
        let processedValue = value;

        if (field === 'intensityMeasure') {
            if (value === '') {
                processedValue = '';
            } else {
                const numValue = parseFloat(value);

                if (isNaN(numValue)) {
                    return; // No permitir valores no numéricos
                }

                // Aplicar límites: mínimo 0, máximo 10
                if (numValue < 0) {
                    processedValue = '0';
                } else if (numValue > 10) {
                    processedValue = '10';
                } else {
                    // Redondear a pasos de 0.5
                    processedValue = (Math.round(numValue * 2) / 2).toString();
                }
            }
        }

        // Validaciones para weight y reps (sin cambios)
        if (field === 'weight' || field === 'reps') {
            if (value === '') {
                processedValue = '';
            } else {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < 0) {
                    return;
                }
                processedValue = value;
            }
        }

        const updatedSeriesData = [...form.seriesData];
        updatedSeriesData[index] = {
            ...updatedSeriesData[index],
            [field]: processedValue
        };

        setForm({
            ...form,
            seriesData: updatedSeriesData
        });
    };

    const loadExercises = (newOffset = 0) => {
        setLoading(true);
        const request = httpRequest();

        request
            .get(`https://exercisedb.p.rapidapi.com/exercises?limit=10&offset=${newOffset}`, rapidApiOptions)
            .then((data) => {
                setExercisesList(data);
                setOffset(newOffset);
            })
            .catch((error) => {
                console.error("Error cargando ejercicios:", error);
            })
            .finally(() => setLoading(false));
    };

    const pickExercise = (ex) => {
        setSelectedExercise(ex);
        setForm({
            ...form,
            name: ex.name
        });
        setShowPicker(false);
    };

    const handlePageChange = (direction) => {
        const newOffset = direction === "next" ? offset + 10 : offset - 10;
        if (newOffset >= 0) loadExercises(newOffset);
    };

    // Formatea la fecha para el input de tipo date
    const formatDateForInput = (date) => {
        if (!date) return "";

        // Si ya es un string en formato YYYY-MM-DD, devuélvelo tal cual
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        // Convertir a objeto Date si es un string en otro formato
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Verificar si es una fecha válida
        if (!(dateObj instanceof Date) || isNaN(dateObj)) {
            return "";
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función para manejar el envío del formulario
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Crear una estructura de datos para enviar
        const formToSubmit = {
            name: form.name,
            date: form.date instanceof Date ? formatDateForInput(form.date) : form.date,
            series: form.seriesData.map(seriesItem => ({
                weight: parseFloat(seriesItem.weight) || 0,
                reps: parseInt(seriesItem.reps) || 0,
                intensityMeasure: seriesItem.intensityMeasure || ""
            }))
        };

        // Llamar a la función handleSubmit que viene como prop
        handleSubmit(formToSubmit);

        // Opcional: resetear el formulario después de enviar
        // setForm(initForm);
    };

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="form-header">
                <h1 className="form-title">Registrar Ejercicio</h1>
                <p className="form-subtitle">Ingresa los detalles de tu entrenamiento</p>
            </div>

            <form
                className="form-content"
                onSubmit={handleFormSubmit}
            >
                <div className="form-layout">
                    <div
                        className="form-image-container"
                        onClick={() => {
                            setShowPicker(true);
                            if (exercisesList.length === 0) loadExercises();
                        }}
                    >
                        {selectedExercise ? (
                            <div className="selected-exercise">
                                <img
                                    src={selectedExercise.gifUrl}
                                    alt={selectedExercise.name}
                                    className="exercise-gif"
                                />
                                <div className="change-exercise">Cambiar</div>
                            </div>
                        ) : (
                            <div className="empty-exercise">
                                <svg className="exercise-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 8V16M18 12H6M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Seleccionar ejercicio</span>
                            </div>
                        )}
                    </div>

                    <div className="form-fields">
                        <div className="input-group">
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="exercise-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("name")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-name"
                                    className={form.name || activeField === "name" ? "active" : ""}
                                >
                                    Nombre del ejercicio
                                </label>
                                <div className={`input-underline ${activeField === "name" ? "active" : ""}`}></div>
                            </div>

                            <div className="input-field">
                                <input
                                    type="date"
                                    id="exercise-date"
                                    name="date"
                                    value={formatDateForInput(form.date)}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("date")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-date"
                                    className="active"
                                >
                                    Fecha
                                </label>
                                <div className={`input-underline ${activeField === "date" ? "active" : ""}`}></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-field">
                                <input
                                    type="number"
                                    id="exercise-series-count"
                                    name="seriesCount"
                                    min="1"
                                    max="10"
                                    value={form.seriesCount}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("seriesCount")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-series-count"
                                    className="active"
                                >
                                    Número de series
                                </label>
                                <div className={`input-underline ${activeField === "seriesCount" ? "active" : ""}`}></div>
                            </div>
                        </div>

                        {/* Sección de series dinámicas */}
                        <div className="series-container">
                            <h3 className="series-title">Detalles de cada serie</h3>

                            <AnimatePresence>
                                {form.seriesData.map((seriesItem, index) => (
                                    <motion.div
                                        key={`series-${index}`}
                                        className="series-card"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="series-header">
                                            <h4 className="series-number">Serie {index + 1}</h4>
                                        </div>

                                        <div className="input-group">
                                            <div className="input-field">
                                                <input
                                                    type="number"
                                                    id={`weight-${index}`}
                                                    value={seriesItem.weight}
                                                    onChange={(e) => handleSeriesDataChange(index, "weight", e.target.value)}
                                                    onFocus={() => setActiveField(`weight-${index}`)}
                                                    onBlur={() => setActiveField(null)}
                                                    required
                                                />
                                                <label
                                                    htmlFor={`weight-${index}`}
                                                    className={seriesItem.weight || activeField === `weight-${index}` ? "active" : ""}
                                                >
                                                    Peso (kg)
                                                </label>
                                                <div className={`input-underline ${activeField === `weight-${index}` ? "active" : ""}`}></div>
                                            </div>

                                            <div className="input-field">
                                                <input
                                                    type="number"
                                                    id={`reps-${index}`}
                                                    value={seriesItem.reps}
                                                    onChange={(e) => handleSeriesDataChange(index, "reps", e.target.value)}
                                                    onFocus={() => setActiveField(`reps-${index}`)}
                                                    onBlur={() => setActiveField(null)}
                                                    required
                                                />
                                                <label
                                                    htmlFor={`reps-${index}`}
                                                    className={seriesItem.reps || activeField === `reps-${index}` ? "active" : ""}
                                                >
                                                    Repeticiones
                                                </label>
                                                <div className={`input-underline ${activeField === `reps-${index}` ? "active" : ""}`}></div>
                                            </div>
                                        </div>

                                        <div className="input-field intensity-field-container">
                                            <input
                                                type="number"
                                                id={`intensity-${index}`}
                                                min="0"
                                                max="10"
                                                step="0.5"
                                                value={seriesItem.intensityMeasure}
                                                onChange={(e) => handleSeriesDataChange(index, "intensityMeasure", e.target.value)}
                                                onFocus={() => setActiveField(`intensity-${index}`)}
                                                onBlur={() => setActiveField(null)}
                                                required
                                            />
                                            <label
                                                htmlFor={`intensity-${index}`}
                                                className={seriesItem.intensityMeasure || activeField === `intensity-${index}` ? "active" : ""}
                                            >
                                                RPE / RIR
                                                {seriesItem.intensityMeasure && (() => {
                                                    const type = detectIntensityType(seriesItem.intensityMeasure);
                                                    return type ? ` (${type})` : '';
                                                })()}
                                            </label>
                                            <div className={`input-underline ${activeField === `intensity-${index}` ? "active" : ""}`}></div>

                                            {/* Badge con ícono de ayuda */}
                                            <div
                                                className="intensity-help-badge"
                                                title={getIntensityTooltip(seriesItem.intensityMeasure)}
                                            >
                                                ?
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || !form.name}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                "Agregar ejercicio"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        className="exercise-picker-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPicker(false)}
                    >
                        <motion.div
                            className="exercise-picker"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="picker-header">
                                <h3>Selecciona un ejercicio</h3>
                                <button
                                    type="button"
                                    className="close-picker"
                                    onClick={() => setShowPicker(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="picker-grid">
                                {exercisesList.map((ex) => (
                                    <div
                                        key={ex.id}
                                        className={`picker-card ${selectedExercise?.id === ex.id ? "picked" : ""}`}
                                        onClick={() => pickExercise(ex)}
                                    >
                                        <img src={ex.gifUrl} alt={ex.name} className="card-image" />
                                        <span className="card-name">{ex.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pagination-controls">
                                <button
                                    type="button"
                                    onClick={() => handlePageChange("prev")}
                                    disabled={offset === 0}
                                    className="pagination-button"
                                >
                                    Anterior
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePageChange("next")}
                                    disabled={loading}
                                    className="pagination-button"
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner small"></div>
                                            <span>Cargando...</span>
                                        </>
                                    ) : (
                                        "Siguiente"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExerciseForm;