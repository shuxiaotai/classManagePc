import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Login from './routes/Login';
import Main from './routes/Main';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/main" exact component={Main} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
