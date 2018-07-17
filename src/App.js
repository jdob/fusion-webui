import React, { Component } from 'react';
import logo from './fusion1.png';
import './App.css';
import Content from './components/Content.js';
import Sidemenu from './components/Sidemenu.js';
import Data from './data.js';
import axios from 'axios';
import ReactModal from 'react-modal';

class App extends Component {
  constructor(props) {
    super(props);
    //To check if we have to disable editable elements
    this.stateReadOnly = (this.props.location.pathname === window.App.urlConstants.editURL) ? false : true; 
    this.state = {
      filters:[],
      categoryFilters:[],
      defaultState: this.defaultState,
      partners:{},
      categories:{}
    };
  }

  createRequest(url)
  {
    var self = this;
    var request = new Request(url);
    fetch(request).then(function(response) {
    // Convert to JSON
        return response.json();
    }).then(function(j) {
        // Yay, `j` is a JavaScript object
        self.setState({partnerCategories: JSON.stringify(j)}); 
    }).catch(function(error) {  
        console.log('Request failed', error)  
    });
  }

  formatData(partnerCategories, categories, partners) {
    partners.forEach(partner => {
      partner.categories = [];
      var categoryArray = [];
      var partnerCategoryArray = [];
      partnerCategoryArray = partner.partner_categories;
      partnerCategoryArray.forEach(pcId => {
        categoryArray = partnerCategories.filter(function(pc){
          return pc.id === pcId;
        })
      });
      categoryArray = categoryArray.map(category => category.category);
      /*categoryItems.map(function(item){
        return categories[item.id].name;
      });*/
      partner.categories = categoryArray;
    });
    this.setState({partners:partners,categories:categories});
  }

  componentWillMount() {
    document.title = 'Red Hat Partner Fusion';
    ReactModal.setAppElement('body');
  }

  //Getting all the data required
  componentDidMount() {
    var self = this;
    Promise.all([
      //categories and partners
      axios.get("http://127.0.0.1:8000/categories/"),
      axios.get("http://127.0.0.1:8000/partners/")
    ]).then(function([categories, partners]) {
        self.setState({partners:partners.data,categories:categories.data});
    }).catch((err) => {
        console.log(err);
    });
  }

  //when state changes, render is called automatically 
  //here we can set dynamic values for the data required
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
                <Sidemenu state={this.stateReadOnly}
                          items={this.items}
                          filters={this.state.filters}
                          categoryFilters={this.state.categoryFilters}
                          callbackParent={this.onChildChanged.bind(this)}
                          categories={this.state.categories}
                 />
              </div>
              <div className="main-content">
                <br/>
                <Content state={this.stateReadOnly}
                         filters={this.state.filters}
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
