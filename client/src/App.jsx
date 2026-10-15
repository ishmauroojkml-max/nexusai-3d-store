import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NexusStore from './NexusStore';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusStore />} />
      </Routes>
    </Router>
  );
}

export default App;