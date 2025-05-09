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

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="form-title">Registrar Ejercicio</h1>
            <form
                className="form-grid"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(form);
                }}
            >
                <div
                    className="form-image-placeholder"
                    onClick={() => {
                        setShowPicker(true);
                        if (exercisesList.length === 0) loadExercises();
                    }}
                >
                    {selectedExercise ? (
                        <img
                            src={selectedExercise.gifUrl}
                            alt={selectedExercise.name}
                            style={{ borderRadius: "8px", maxWidth: "100%", height: "auto" }}
                        />
                    ) : (
                        <div className="image-box">Haz clic para elegir un ejercicio</div>
                    )}
                </div>

                <div className="form-fields">
                    <input
                        type="text"
                        placeholder="Nombre del ejercicio"
                        name="name"
                        value={form.name}
                        onChange={handleForm}
                    />
                    <input type="date" name="date" onChange={handleForm} />
                    <input
                        type="number"
                        placeholder="Peso (kg)"
                        name="weight"
                        onChange={handleForm}
                    />
                    <input
                        type="number"
                        placeholder="Repeticiones"
                        name="reps"
                        onChange={handleForm}
                    />
                    <input
                        type="number"
                        placeholder="Series"
                        name="series"
                        onChange={handleForm}
                    />
                    <input
                        type="text"
                        placeholder="RPE / RIR"
                        name="intensityMeasure"
                        onChange={handleForm}
                    />
                    <button type="submit">Agregar</button>
                </div>
            </form>

            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        className="exercise-picker"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>Selecciona un ejercicio</h3>
                        <div className="picker-grid">
                            {exercisesList.map((ex) => (
                                <div
                                    key={ex.id}
                                    className={`picker-card ${selectedExercise?.id === ex.id ? "picked" : ""}`}
                                    onClick={() => pickExercise(ex)}
                                >
                                    <img src={ex.gifUrl} alt={ex.name} />
                                    <span>{ex.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pagination-controls">
                            <button
                                type="button"
                                onClick={() => handlePageChange("prev")}
                                disabled={offset === 0}
                            >
                                Anterior
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePageChange("next")}
                                disabled={loading}
                            >
                                {loading ? "Cargando..." : "Siguiente"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExerciseForm;
