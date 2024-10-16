import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Senicare from './Senicare';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* 시니케어 프론트 작업을 router로 작업할수 있게 해주는 역할 */}
    <BrowserRouter>
      <Senicare />
    </BrowserRouter>
  </React.StrictMode>
);