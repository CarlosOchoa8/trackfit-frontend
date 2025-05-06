import React, { useState } from "react";
import "./ExerciseItem.css";


const ExerciseItem = ({ exercisesData }) => {
    return (
        <div className="exercise-item-cont">
            <h2>Aquí deberían renderizarse los ejercicios</h2>
            {exercisesData.map((item, index) => (
                <div key={index}>
                    <h3>{item.exercise.name}</h3>
                    <ul>
                        {item.exercise.data.map((entry, i) => (
                            <li key={i}>
                                Fecha: {entry.date}, Peso: {entry.weight}, Reps: {entry.reps}, Series: {entry.series}, Intensidad: {entry.intensityMeasure}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default ExerciseItem;
