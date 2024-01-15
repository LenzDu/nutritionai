import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavbarComponent from './components/nav-bar';
import ApiPopupModal from './components/api-modal.tsx';
import DailyValueModal from './components/daily-value-modal';
import History from './components/history';
import NutritionFetcher from './components/nutrition-fetcher';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <NavbarComponent />
      <ApiPopupModal />
      <DailyValueModal />

      <Routes>
        <Route path="/" element={<NutritionFetcher />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
};
export default App;