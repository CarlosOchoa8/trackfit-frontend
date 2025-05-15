import React, { useState } from "react";
import PerformanceCalculator from "./Calculator/PerformanceCalculator";
import ExerciseItem from "./Exercises/ExerciseItem";
import "./ExercisesApp.css";
import ExerciseForm from "./Form/ExerciseForm";

const initData = [];

const ExerciseApp = () => {
    const [exerciseData, setExerciseData] = useState(initData);

    const handleFormSubmit = (formData) => {
        let updatedData;

        setExerciseData(prevData => {
            const cleanedData = prevData.filter(item => item.name);
            const exerciseExists = cleanedData.find(item => item.name === formData.name);

            // TODO La estructura del formData ahora tiene:  no es cierto
            // { name: "...", date: "YYYY-MM-DD", series: [{weight, reps, intensityMeasure}, {...}] }

            if (exerciseExists) {
                updatedData = cleanedData.map(item => {
                    if (item.name === formData.name) {
                        // Para cada serie, creamos una entrada en el array de datos
                        const newEntries = formData.series.map(seriesItem => ({
                            date: formData.date,
                            weight: seriesItem.weight,
                            reps: seriesItem.reps,
                            series: 1, // Cada entrada representa una serie
                            intensityMeasure: seriesItem.intensityMeasure
                        }));

                        return {
                            ...item,
                            data: [
                                ...item.data,
                                ...newEntries
                            ]
                        };
                    }
                    return item;
                });
            } else {
                // Si el ejercicio no existe, creamos una nueva entrada
                const newEntries = formData.series.map(seriesItem => ({
                    date: formData.date,
                    weight: seriesItem.weight,
                    reps: seriesItem.reps,
                    series: 1, // Cada entrada representa una serie
                    intensityMeasure: seriesItem.intensityMeasure
                }));

                updatedData = [
                    ...cleanedData,
                    {
                        name: formData.name,
                        data: newEntries
                    }
                ];
            }

            return updatedData;
        });

    };

    return (
        <>
            <div className="exercise-app-container">
                <ExerciseForm handleSubmit={handleFormSubmit} />
                <ExerciseItem exercisesData={exerciseData} />
                {exerciseData.length > 0 && (
                    <PerformanceCalculator exerciseData={exerciseData} />
                )}
            </div>
        </>
    );
};

export default ExerciseApp;
