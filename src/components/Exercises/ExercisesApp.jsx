import React, { useState } from "react";
import ExerciseForm from "./ExerciseForm";
import ExerciseItem from "./ExerciseItem";


let initData = [
    {exercise: {
        name: null,
        data: [
        {
            date: null,
            weight: 0,
            reps: 0,
            series: 0,
            intensityMeasure: ""
        }
    ]}},
]

const ExerciseApp = () => {
    const [exerciseData, setExerciseData] = useState(initData)

    const handleFormSubmit = (formData) => {
    setExerciseData(prevData => {
        const cleanedData = prevData.filter(item => item.exercise.name);
        const exerciseExists = cleanedData.find(item => item.exercise.name === formData.name);

        if (exerciseExists) {
            return cleanedData.map(item => {
                if (item.exercise.name === formData.name) {
                    return {
                        exercise: {
                            ...item.exercise,
                            data: [
                                ...item.exercise.data,
                                {
                                    date: formData.date,
                                    weight: formData.weight,
                                    reps: formData.reps,
                                    series: formData.series,
                                    intensityMeasure: formData.intensityMeasure,
                                }
                            ]
                        }
                    }
                }
                return item;
            });
        } else {
            return [
                ...cleanedData,
                {
                    exercise: {
                        name: formData.name,
                        data: [{
                            date: formData.date,
                            weight: formData.weight,
                            reps: formData.reps,
                            series: formData.series,
                            intensityMeasure: formData.intensityMeasure,
                        }]
                    }
                }
            ];
        }
    });
};

    return (
        <>
        <section>
        <h2>Aqui deberia renderizar el Formulario</h2>
        <ExerciseForm
        handleSubmit={handleFormSubmit}
        />
        </section>
        <div>-------------------------------------------------------------------------------------------</div>
        <h2>Aqui deberia renderizar la informacion</h2>
        <section>
        <ExerciseItem
        exercisesData={exerciseData}
        />
        </section>
        </>
    )
}

export default ExerciseApp;
