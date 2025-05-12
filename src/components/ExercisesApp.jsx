import React, { useState } from "react";
import ExerciseForm from "./Form/ExerciseForm";
import ExerciseItem from "./Exercises/ExerciseItem";
import "./ExercisesApp.css";
import PerformanceCalculator from "./Calculator/PerformanceCalculator";

const initData = [];

const ExerciseApp = () => {
    const [exerciseData, setExerciseData] = useState(initData);

    const handleFormSubmit = (formData) => {
        let updatedData;

        setExerciseData(prevData => {
            const cleanedData = prevData.filter(item => item.name);
            const exerciseExists = cleanedData.find(item => item.name === formData.name);

            if (exerciseExists) {
                updatedData = cleanedData.map(item => {
                    if (item.name === formData.name) {
                        return {
                            ...item,
                            data: [
                                ...item.data,
                                {
                                    date: formData.date,
                                    weight: formData.weight,
                                    reps: formData.reps,
                                    series: formData.series,
                                    intensityMeasure: formData.intensityMeasure,
                                }
                            ]
                        };
                    }
                    return item;
                });
            } else {
                updatedData = [
                    ...cleanedData,
                    {
                        name: formData.name,
                        data: [{
                            date: formData.date,
                            weight: formData.weight,
                            reps: formData.reps,
                            series: formData.series,
                            intensityMeasure: formData.intensityMeasure,
                        }]
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
