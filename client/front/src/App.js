import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EditorPage from './components/EditorPage';
import 'monaco-editor/esm/vs/editor/editor.all.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/editorPage" component={EditorPage} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
