import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import Firebase from 'firebase';

import Home from './Components/Home';
import Host from './Components/Host';
import NotFound from './Components/NotFound';

const firebase = new Firebase('https://turkeylist.firebaseio.com/');

import 'bootstrap/dist/css/bootstrap.css';

function requireAuth(nextState, replaceState, callback) {
  if (firebase.getAuth()) {
    setTimeout(callback, 1);
  } else {
    firebase.authWithOAuthPopup("facebook", callback);
  }
}

ReactDOM.render((
  <Router history={createHashHistory({
    queryKey: false
  })}>
    <Route path="/" component={Home} />
    <Route path="/host/:host" component={Host} onEnter={requireAuth}/>
    <Route path="*" component={NotFound} />
  </Router>
), document.getElementById('root'));
