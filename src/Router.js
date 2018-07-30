import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import App from './App.js';
import createBrowserHistory from 'history/createBrowserHistory';
import Login from './Login.js';
import Register from './Register.js';
import PartnerPage from './components/PartnerPage';

export default class CreateRoutes extends React.Component {
  //to protect against any user being able to edit partner details
  URLChange(){
    if(window.location.pathname==='/')
    {
      window.location.pathname = '/home';
    }
    if((localStorage.getItem('isAdmin') === 'false' || 
      localStorage.getItem('isAdmin') === null) && 
      window.location.pathname==='/edit')
    {
      window.location.pathname = '/login';
    }
    else if(localStorage.getItem('isAdmin') === null)
    {
      localStorage.setItem('isAdmin',false);
      window.location.pathname = '/home';
    }
    /*var isAdmin = localStorage.getItem('isAdmin');
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if(isLoggedIn === null)
    {
      if(window.location.pathname==='/login')
      {
        localStorage.setItem('isLoggedIn',false);
        localStorage.setItem('isAdmin',false);
        window.location.pathname = '/login';
      }
      else if(window.location.pathname==='/edit')
      {
        window.location.pathname = '/login';
      }  
    }
    else if(isLoggedIn === 'false')
    {
      if(window.location.pathname==='/edit')
      {
        window.location.pathname = '/login';
      }
      else if(window.location.pathname.match('/partners'))
      {
        window.location.pathname = '/home';
      }
    }
    else if(isAdmin === 'false')
    {
      
      if(window.location.pathname==='/edit')
      {
        window.location.pathname = '/login';
      }
      else if(window.location.pathname==='/partners')
      {
        window.location.pathname = '/home';
      }
    }*/
  }
  
  render(){
    const newHistory = createBrowserHistory();
    newHistory.listen((location, action) => {
      if(window.location.pathname==='/')
      {
        window.location.pathname = '/home';
      }
      if((localStorage.getItem('isAdmin') === 'false' || 
        localStorage.getItem('isAdmin') === null) && window.location.pathname==='/edit')
      {
        window.location.pathname = '/login';
      }
      else if(localStorage.getItem('isAdmin') === null)
      {
        localStorage.setItem('isAdmin',false);
        window.location.pathname = '/home';
      }
    })
    return(
      <Router history={newHistory}>
        <Switch>
          <Route exact path="/" component={App}  onEnter={this.URLChange()}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/home" component={App}/>
          <Route exact path="/partners/:partnerId" component = {PartnerPage} />
          <Route exact path="/edit" component={App}/>
        </Switch>
      </Router>
    );
  }
}