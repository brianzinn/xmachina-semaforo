import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Automated from './Automated';
import Manual from './Manual';

const App = () => {

  return (
    <Router>
      <div style={{width: '100vw', height: '100vh', textAlign: 'center'}}>
        <nav>
            Choose: <Link to="/">Automated</Link> <strong>OR </strong><Link to="/manual">Manual</Link> xmachina (<a href='https://github.com/brianzinn/xmachina'>github.com/brianzinn/xmachina</a>).
        </nav>
        <Switch>
          <Route path="/manual">
            <Manual />
          </Route>
          <Route path="/">
            <Automated />
          </Route>
        </Switch>
      
    </div>
    </Router>
  );
}

export default App;
