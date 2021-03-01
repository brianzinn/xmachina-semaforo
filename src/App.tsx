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
            Choose: <Link to={`${process.env.PUBLIC_URL}/`}>Automated</Link> <strong>OR </strong><Link to={`${process.env.PUBLIC_URL}/manual`}>Manual</Link> xmachina (<a href='https://github.com/brianzinn/xmachina'>github.com/brianzinn/xmachina</a>).
        </nav>
        <Switch>
          <Route exact={true} path={`${process.env.PUBLIC_URL}/`} component={Automated}/>
          <Route path={`${process.env.PUBLIC_URL}/manual`} component={Manual} />
        </Switch>
    </div>
    </Router>
  );
}

export default App;
