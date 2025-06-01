import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MainDev from './components/MainDev'
import ExerciseApp from './components/ExercisesApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Header/> */}
      {/* <MainDev/> */}
      {/* <ExerciseApp/> */}
      {/* <Footer/> */}
      <Header />

      <div className="app-body">
        <ExerciseApp />
      </div>

      <Footer />
      </>
  )
}

export default App
