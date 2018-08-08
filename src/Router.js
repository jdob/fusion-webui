import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import App from './App.js';
import createBrowserHistory from 'history/createBrowserHistory';
import Login from './Login.js';
import PartnerPage from './components/PartnerPage';

export default class CreateRoutes extends React.Component {
  //to protect against any user being able to edit partner details
  URLChange(){ 
    if(localStorage.getItem('authToken') === null && 
        window.location.pathname!=='/login')
    {
      window.location.pathname = '/login';
    }
  }
  
  render(){
    const newHistory = createBrowserHistory();
    newHistory.listen((location, action) => {
      if(localStorage.getItem('authToken') === null && 
          window.location.pathname!=='/login')
      {
        window.location.pathname = '/login';
      }
    })
    return(
      <Router history={newHistory}>
        <Switch>
          <Route exact path="/" component={Login}  onEnter={this.URLChange()}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/home" component={App}/>
          <Route exact path="/partners/:partnerId" component = {PartnerPage} />
        </Switch>
      </Router>
    );
  }
}