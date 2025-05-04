import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MainDev from './components/MainDev'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <MainDev/>
    <Footer/>
    </>
  )
}

export default App
