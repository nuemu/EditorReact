import React from 'react';
import { BlocksProvider } from './store';
import Base from './Editor/Base';


function App() {
  return (
    <BlocksProvider>
      <Base />
    </BlocksProvider>
  );
};

export default App;