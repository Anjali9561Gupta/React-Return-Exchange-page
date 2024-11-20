import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReturnExchangeTable from './components/ReturnExchangeTable';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReturnExchangeTable />} />
        <Route path="/add-return-exchange" element={<div>Add Return Exchange Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
