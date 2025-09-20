import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';

import About from './pages/About/About';
import Home from './pages/Home/Home';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            {/* Puedes agregar más rutas aquí */}
            {/* <Route path="services" element={<Services />} /> */}
            {/* <Route path="contact" element={<Contact />} /> */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;