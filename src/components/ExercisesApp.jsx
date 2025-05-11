import React, { useState } from "react";
import ExerciseForm from "./Form/ExerciseForm";
import ExerciseItem from "./Exercises/ExerciseItem";
import "./ExercisesApp.css";
import { httpRequest } from "../helpers/httpRequest";

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

        // Mover la petición FUERA del setState
        // setTimeout(() => {
        //     const body = {
        //         exercises: updatedData.map(item => ({
        //             name: item.name,
        //             data: item.data
        //         }))
        //     };

        //     console.log("DATA QUE VOY A MANDAR ============>", body);

        //     const request = httpRequest();
        //     const rapidApiOptions = {
        //         headers: {
        //             "x-rapidapi-key": import.meta.env.VITE_EXERCISE_API_KEY,
        //             "x-rapidapi-host": import.meta.env.VITE_EXERCISE_API_HOST,
        //             "accept": "application/json",
        //             "Content-Type": "application/json"
        //         },
        //         body
        //     };

        //     request.post(
        //         "http://localhost:80/trackfit_api/calculate",
        //         rapidApiOptions
        //     )
        //         .then(data => {
        //             console.log("MI RESPUESTA ES ESTA", data);
        //         })
        //         .catch(console.error);
        // }, 0);
    };

    return (
        <>
            <div className="exercise-app-container">
                <ExerciseForm handleSubmit={handleFormSubmit} />
                <ExerciseItem exercisesData={exerciseData} />
            </div>
        </>
    );
};

export default ExerciseApp;
