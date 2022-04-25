import React from 'react';
import ReactDOM from 'react-dom/client';

import Base from './Editor/Base';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Base />
  </React.StrictMode>
);