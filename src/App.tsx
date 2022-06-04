import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { RecoilRoot } from 'recoil'
import Base from './Editor/Base';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={<Base />}
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;