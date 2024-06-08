import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Consultations from './pages/Consultations';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '56px' }}> {/* Adjust padding to account for fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
