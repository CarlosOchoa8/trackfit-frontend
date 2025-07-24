import React, { useState } from "react";
import PerformanceCalculator from "./Calculator/PerformanceCalculator";
import ExerciseItem from "./Exercises/ExerciseItem";
import "./ExercisesApp.css";
import ExerciseForm from "./Form/ExerciseForm";
import PerformanceResults from "./Results/PerformanceResults";
import HttpErrorResponse from "./HttpErrorResponse/httpErrorResponse";
import renderService from "../helpers/back_service";


const initData = [];
renderService();


const ExerciseApp = () => {
    const [exerciseData, setExerciseData] = useState(initData);
    const [calcResponse, setCalcResponse] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null); // Guardar toda la respuesta de error

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

    const handlePerformanceResults = (response) => {
        // Reset de estados previos
        setHasError(false);
        setErrorResponse(null);

        if (response?.data) {
            setCalcResponse(response);
        } else if (response?.err) {
            setHasError(true);
            setErrorResponse(response); // Guardar toda la respuesta de error
            setCalcResponse(null); // Limpiar respuesta previa exitosa
        }
    };

    // Función opcional para manejar el retry
    const handleRetry = () => {
        console.log("Reintentando operación...");
        setHasError(false);
        setErrorResponse(null);
        // Aquí puedes volver a llamar a la función que falló
        // Por ejemplo, volver a ejecutar el cálculo de performance
    };

    const renderPerformanceSection = () => {
        if (hasError && errorResponse) {
            return (
                <HttpErrorResponse
                    errorData={errorResponse} // Pasar todo el objeto de error
                    onRetry={handleRetry} // Opcional: función para reintentar
                />
            );
        }

        if (calcResponse) {
            return <PerformanceResults data={calcResponse} />;
        }

        return null;
    };

    return (
        <>
            <div className="exercise-app-container">
                <ExerciseForm handleSubmit={handleFormSubmit} />
                <ExerciseItem exercisesData={exerciseData} />
                {exerciseData.length > 0 && (
                    <PerformanceCalculator exerciseData={exerciseData} handlePerformanceResults={handlePerformanceResults}/>
                )}
                {renderPerformanceSection()}
            </div>
        </>
    );
};

export default ExerciseApp;