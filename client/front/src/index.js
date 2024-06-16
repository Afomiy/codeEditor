import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditorPage from './components/EditorPage';
//import 'monaco-editor/esm/vs/editor/editor.all.css';

createRoot(document.getElementById('root')).render(
  <Router>
 <Routes>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/editorPage" element={<EditorPage/>} />
  </Routes>
  </Router>,

);