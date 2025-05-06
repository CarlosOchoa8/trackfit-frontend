import React, { useState } from "react";
import "./ExerciseForm.css";
import ExerciseItem from "./ExerciseItem";

let initForm = {
    // exercise represneta el nombre del ejercicio
    name: "",
    date: null,
    weight: 0,
    reps: 0,
    series: 0,
    intensityMeasure: ""
}

const ExerciseForm = ({handleSubmit}) => {
    const [form, setForm] = useState(initForm)


    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
        <h1>Aqui debo Atrapar toda la informacion</h1>
        <div className="workout-form">
            <form onSubmit={() => {handleSubmit(form)}}>
                <input
                type="text"
                placeholder="Exercise"
                name="name"
                onChange={handleForm}
                />
                <input
                type="text"
                placeholder="Date"
                name="date"
                onChange={handleForm}
                />
                <input
                type="text"
                placeholder="Weight"
                name="weight"
                onChange={handleForm}
                />
                <input
                type="text"
                placeholder="reps"
                name="reps"
                onChange={handleForm}
                />
                <input
                type="text"
                placeholder="Series"
                name="series"
                onChange={handleForm}
                />
                <input
                type="text"
                placeholder="RPE/RIR"
                name="intensityMeasure"
                onChange={handleForm}
                />
                <input type="button" onClick={() => {handleSubmit(form)}}/>
                <input type="reset"/>
            </form>
        </div>
        </>
    )
}

export default ExerciseForm;
