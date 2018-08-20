import React, { Component } from 'react';
import logo from './fusion1.png';
import './App.css';
import Content from './components/Content.js';
import Sidemenu from './components/Sidemenu.js';
import Data from './data.js';
import axios from 'axios';
import ReactModal from 'react-modal';
import Config from './Config.js';

class App extends Component {
  constructor(props) {
    super(props);
    window.addEventListener('storage', this.storageChange.bind(this), false)
    //To check if we have to disable editable elements
    //Deprecated, because we check with the groups property with the authToken
    //on each partner page if the user should get a read only or write view.
    //Can be used again if we need to fork this variable to the sidemenu
    /*this.stateReadOnly = (localStorage.getItem('isAdmin') === 'false' || 
                          localStorage.getItem('isAdmin') === null) ? true 
                          : false ;*/ 
    //added again to handle refresh of this screen
    if(Config.serviceHost === 'localhost' || Config.serviceHost === undefined)
    {
        window.App.urlConstants.serviceHost = 'http://127.0.0.1:8000/';  
    }
    else
    {
        window.App.urlConstants.serviceHost = 'http://'+ Config.serviceHost+':'+Config.servicePort+'/';
    }
    this.state = {
      filters:[],
      categoryFilters:[],
      defaultState: this.defaultState,
      partners:{},
      categories:{}
    };
  }

  //logging out from all other tabs if logged out from one
  storageChange (event) {
    if(localStorage.getItem('isLoggedIn')===null) {
        this.props.history.push('/home');
    }
  }

  //Need to use ReactModal.setAppElement('body') to set the ReactModal element
  componentWillMount() {
    document.title = 'Red Hat Partner Fusion';
    ReactModal.setAppElement('body');
  }

  //Gets all the data required regarding categories and partners
  //sets it in the state
  //All data to the sidemenu and the partner pages is passed from here
  componentDidMount() {
    var self = this;
    var categoriesUrl = window.App.urlConstants.serviceHost + 
                        window.App.urlConstants.categoriesUrl;
    var partnersUrl = window.App.urlConstants.serviceHost + 
                      window.App.urlConstants.partnersUrl;
    var tokenString = 'Token ' + localStorage.getItem('authToken');
    console.log('Calling services for:',partnersUrl);
    console.log('Calling services for:',categoriesUrl);
    Promise.all([
      //categories and partners
      axios.get(
        categoriesUrl,
        {
          headers: {
            Authorization : tokenString
          }
        }
      ),
      axios.get(
        partnersUrl,
        {
          headers: {
            Authorization : tokenString
          }
        }
      )
    ]).then(function([categories, partners]) {
        self.setState({partners:partners.data,categories:categories.data});
    }).catch((err) => {
        console.log(err);
    });
  }

  //when state changes, render is called automatically 
  //here we can set dynamic values for the data required
  //When the user changes the filters, the newFilters are set from here
  onChildChanged(newFilters, newCategoryFilters) {
    if(newFilters === undefined || newFilters.length === 0)
    {
      this.setState({ filter: this.props.filters, statecategoryFilters: newCategoryFilters });
    }
    else if(newCategoryFilters === undefined || newCategoryFilters.length === 0)
    {
      this.setState({ filters: newFilters, statecategoryFilters: this.props.categoryFilters});
    }
    else
    {
      this.setState({filters: newFilters, statecategoryFilters: newCategoryFilters});
    }
  }

  render() {
    return (
      <div className="App">
          {/*App body that contains Content which contains the sections*/}
          <div className="App-body">
              {/*we will send filters and sorts for both elements
                 Sidemenu requires items to setup the menu and the callback to
                 let the main app know filters or sorts have changed
                 so that main content can be re-rendered.
                 data for content is all the info about partners*/}
              <div className="sidemenu">
                <img src={logo} className="App-logo" alt="Red Hat Partner Fusion" />
                <Sidemenu items={this.items}
                          filters={this.state.filters}
                          categoryFilters={this.state.categoryFilters}
                          callbackParent={this.onChildChanged.bind(this)}
                          categories={this.state.categories}
                 />
              </div>
              <div className="main-content">
                <br/>
                <Content filters={this.state.filters}
                         categoryFilters={this.state.categoryFilters}
                         partners={this.state.partners}
                         categories={this.state.categories}
                />
              </div>
          </div>
      </div>
    );
  }
}

export default App;
