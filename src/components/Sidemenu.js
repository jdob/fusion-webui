import React from 'react';
import ReactModal from 'react-modal';
import NewPartner from './NewPartner.js'
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { ic_format_list_numbered } from 'react-icons-kit/md/ic_format_list_numbered';
import { ic_apps } from 'react-icons-kit/md/ic_apps';
import { paragraphLeft } from 'react-icons-kit/icomoon/paragraphLeft';
import { ic_business } from 'react-icons-kit/md/ic_business';
import { ic_location_on } from 'react-icons-kit/md/ic_location_on';
import '../App.css';
import withRouter from 'react-router-dom/withRouter';

//using the code provided by react-sidenav
class Sidemenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filters: this.props.filters,
            categoryFilters: this.props.categoryFilters,
            showModal: false
        };
        this.addFilters = this.addFilters.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    addFilters(event){
      //to avoid default behavior being repeated
      event.preventDefault();
      //makeshift for now
      this.props.filters.splice(0,this.props.filters.length);
      let value = event.target.innerText;
      this.state.filters.push(value);
      //lets the main content know that it should rerender itself
      this.props.callbackParent(this.props.filters, this.state.categoryFilter);
    }

    //Will set the state of category filters
    //not implemented fully for now
    categoryCheckBoxClick(event){
      var checkboxList = document.getElementsByClassName('category-checkbox');
      var checkboxId;
      this.props.categoryFilters.splice(0,this.props.categoryFilters.length);
      for(let i=0; i<checkboxList.length; i++)
      {
        checkboxId = parseInt(checkboxList[i].id,10);
        if(checkboxList[i].checked === true)
        {
          /*if(this.props.categoryFilters.indexOf(checkboxId) === -1)
          {
            this.props.categoryFilters.push(checkboxId);
          }*/
          this.props.categoryFilters.push(checkboxId);
        }
      }
      this.props.callbackParent(this.props.filters, this.props.categoryFilters);
    }

    //Dynamically create categories
    addCategories(){
      var navs = [];
      var categories = this.props.categories;
      for(let category=0; category<categories.length; category++)
      {
        navs.push(<Nav id={categories[category].name} key={categories[category].name}>
                    <NavText>
                      <div> 
                        <input className="category-checkbox" onClick= {this.categoryCheckBoxClick.bind(this)} type="checkbox" id={categories[category].id} />
                        {/*<label className="category-label">{categories[category].name}</label> */}
                        {categories[category].name}
                      </div>
                    </NavText>
                  </Nav>);
      }
      return navs;
    }

    logout() {
      // clear all items
      localStorage.setItem('isAdmin',false);
      localStorage.setItem('isLoggedIn',false);
      localStorage.removeItem('authToken');
      this.props.history.push('/login');
    }

    checkLogin() {
      this.props.history.push('/login');
    }

    render() {
      return (
        <div style={{background: '#eee', color: '#333', width: 220}}> 
          <SideNav highlightColor='#333' highlightBgColor='#ddd' defaultSelected=''>       
              <Nav id='category'>
                <NavIcon><SvgIcon size={20} icon={ic_apps}/></NavIcon>
                <NavText> Category </NavText>
                {this.addCategories()}
              </Nav>
              <Nav id='sort'>
                <NavIcon><SvgIcon size={20} icon={ic_format_list_numbered}/></NavIcon>    
                <NavText> Sort </NavText>
                <Nav id='alphabetically'>
                  <NavIcon><SvgIcon size={20} icon={ic_format_list_numbered}/></NavIcon>    
                  <NavText><div onClick={this.addFilters}> Alphabetically (a-z) </div></NavText>
                </Nav>
              </Nav>
          </SideNav>
          <form>
            <div className="form-group">
              <button
                onClick={this.checkLogin.bind(this)}
                type="button"
                className="btn btn-secondary button-adjust"
                >
                Login
              </button>
            </div>
            <div className="form-group">
              <button
                onClick={this.logout.bind(this)}
                type="button"
                className="btn btn-secondary button-adjust"
                >
                Logout
              </button>
            </div>
          </form>
        </div>
      )
    }
}
export default withRouter(Sidemenu)