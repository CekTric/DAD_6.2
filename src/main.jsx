import 'regenerator-runtime/runtime';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import MiProyecto from './Proyecto.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <MiProyecto />
    </StrictMode>
  </BrowserRouter>
);
