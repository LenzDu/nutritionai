import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavbarComponent from './components/nav-bar';
import NutritionFetcher from'./components/nutrition-fetcher';
import History from './components/history';

const App = () => (
    <Router>
      <NavbarComponent />
      <Container>
        <Routes>
          <Route path="/" element={<NutritionFetcher />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Container>
    </Router>
  );
export default App;