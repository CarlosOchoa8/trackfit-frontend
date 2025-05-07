import { useState } from 'react'
// import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MainDev from './components/MainDev'
// import ExerciseForm from './components/Exercises/ExerciseForm'
// import ExerciseItem from './components/Exercises/ExerciseItem'
import ExerciseApp from './components/ExercisesApp'
// import ExerciseApp from './components/Exercises/ExercisesApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <MainDev/>
    <ExerciseApp/>
    <Footer/>
    </>
  )
}

export default App
