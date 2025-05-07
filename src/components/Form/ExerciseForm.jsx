import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ExerciseForm.css";

let initForm = {
    name: "",
    date: "",
    weight: 0,
    reps: 0,
    series: 0,
    intensityMeasure: ""
};

const ExerciseForm = ({ handleSubmit }) => {
    const [form, setForm] = useState(initForm);

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <motion.div
            className="form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="form-title">Registrar Ejercicio</h1>
            <form className="form-grid" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(form);
            }}>
                <div className="form-image-placeholder">
                    {/* Aquí se podría agregar una imagen más adelante */}
                    <div className="image-box">📸 Imagen</div>
                </div>

                <div className="form-fields">
                    <input
                        type="text"
                        placeholder="Nombre del ejercicio"
                        name="name"
                        onChange={handleForm}
                    />
                    <input
                        type="date"
                        name="date"
                        onChange={handleForm}
                    />
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
        </motion.div>
    );
};

export default ExerciseForm;
