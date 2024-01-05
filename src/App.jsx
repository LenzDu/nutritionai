import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavbarComponent from './components/nav-bar';
import ApiPopupModal from './components/api-modal';
import History from './pages/history';
import NutritionFetcher from './pages/nutrition-fetcher';

const App = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [showApiModal, setShowApiModal] = useState(!localStorage.getItem('apiKey'));

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <NavbarComponent setShowApiModal={setShowApiModal} />
      <ApiPopupModal
        apiKey={apiKey}
        setApiKey={setApiKey}
        showApiModal={showApiModal}
        setShowApiModal={setShowApiModal}
      />

      <Routes>
        <Route path="/" element={<NutritionFetcher apiKey={apiKey} />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
};
export default App;