import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ExerciseForm.css";

import { httpRequest } from "../../helpers/httpRequest";

const initForm = {
    name: "",
    date: "",
    weight: 0,
    reps: 0,
    series: 0,
    intensityMeasure: "",
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

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
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
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const pickExercise = (ex) => {
        setSelectedExercise(ex);
        setForm({ ...form, name: ex.name });
        setShowPicker(false);
    };

    const handlePageChange = (direction) => {
        const newOffset = direction === "next" ? offset + 10 : offset - 10;
        if (newOffset >= 0) loadExercises(newOffset);
    };

    const formatDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(form);
                }}
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
                                    defaultValue={formatDate()}
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
                                    id="exercise-weight"
                                    name="weight"
                                    value={form.weight || ""}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("weight")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-weight"
                                    className={form.weight || activeField === "weight" ? "active" : ""}
                                >
                                    Peso (kg)
                                </label>
                                <div className={`input-underline ${activeField === "weight" ? "active" : ""}`}></div>
                            </div>

                            <div className="input-field">
                                <input
                                    type="number"
                                    id="exercise-reps"
                                    name="reps"
                                    value={form.reps || ""}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("reps")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-reps"
                                    className={form.reps || activeField === "reps" ? "active" : ""}
                                >
                                    Repeticiones
                                </label>
                                <div className={`input-underline ${activeField === "reps" ? "active" : ""}`}></div>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-field">
                                <input
                                    type="number"
                                    id="exercise-series"
                                    name="series"
                                    value={form.series || ""}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("series")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-series"
                                    className={form.series || activeField === "series" ? "active" : ""}
                                >
                                    Series
                                </label>
                                <div className={`input-underline ${activeField === "series" ? "active" : ""}`}></div>
                            </div>

                            <div className="input-field">
                                <input
                                    type="text"
                                    id="exercise-intensity"
                                    name="intensityMeasure"
                                    value={form.intensityMeasure}
                                    onChange={handleForm}
                                    onFocus={() => setActiveField("intensityMeasure")}
                                    onBlur={() => setActiveField(null)}
                                    required
                                />
                                <label
                                    htmlFor="exercise-intensity"
                                    className={form.intensityMeasure || activeField === "intensityMeasure" ? "active" : ""}
                                >
                                    RPE / RIR
                                </label>
                                <div className={`input-underline ${activeField === "intensityMeasure" ? "active" : ""}`}></div>
                            </div>
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