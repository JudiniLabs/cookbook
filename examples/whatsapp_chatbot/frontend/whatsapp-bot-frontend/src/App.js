// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainInterface from './MainInterface';
import Modal from './modal';
import './App.css';

const App = () => {{
  const [showModal, setShowModal] = useState(false);

  const handleShowModalChange = (newShowModal) => {{
    setShowModal(newShowModal);
  }};

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainInterface onShowModalChange={handleShowModalChange} />} />
        </Routes>
        <Modal show={showModal} imageUrl={showModal} />
      </div>
    </Router>
  );
}};

export default App;