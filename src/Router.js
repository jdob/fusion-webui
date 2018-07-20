import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App.js';
import createBrowserHistory from 'history/createBrowserHistory';
import Login from './Login.js';
import Register from './Register.js';
import PartnerPage from './components/PartnerPage';

export default class CreateRoutes extends React.Component {
  //to protect against any user being able to edit partner details
  URLChange(){
    if(localStorage.getItem('isAdmin') === 'false' && window.location.pathname==='/edit')
    {
      window.location.pathname = '/login';
    }
  }
  
  render(){
    const newHistory = createBrowserHistory();
    return(
      <Router history={newHistory}>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/home" component={App}/>
          <Route exact path="/partners/:partnerId" render={(props) => <PartnerPage {...props} />} />
          <Route exact path="/edit" onChange={this.URLChange()} component={App}/>
        </Switch>
      </Router>
    );
  }
}