import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './Login.css';
import axios from 'axios';
import Data from './data.js';
import Config from './Config.js';

export default class Login extends React.Component {
    //properties are self explanatory
    //isAdmin:false so that this user cannot access all urls
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            isAdmin:false,
            token:''
        }
        //Configure the backend address communication
        if(Config.serviceHost === 'localhost' || Config.serviceHost === undefined)
        {
            window.App.urlConstants.serviceHost = 'http://127.0.0.1:8000/';  
        }
        else
        {
            window.App.urlConstants.serviceHost = 'http://'+ Config.serviceHost+':'+Config.servicePort+'/';
        }
    }

    //Redirects url, to be user later
    redirect(path){
        this.props.history.push(path);
    }

    //We will call the backend and make sure the user is valid
    //admin user gets the edit view
    //normal user gets read only view
    handleSubmitClick(event){
        var self = this;
        var groups;
        var authUrl = window.App.urlConstants.serviceHost + 
                      window.App.urlConstants.authUrl;
        //auth token
        axios({
            method: 'post',
            url: authUrl,
            data: {
                username: self.state.username,
                password: self.state.password
            }
        }).then(function(authData) {
            groups = JSON.stringify(authData.data.groups);
            self.setState({token:authData.data.token,isAdmin:true});
            //localStorage.setItem('isAdmin', true);
            localStorage.setItem('userName', authData.data.username);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('groups', groups);
            localStorage.setItem('isReadOnly', true);
            if(localStorage.getItem('groups') !== null && 
                JSON.parse(localStorage.getItem('groups')).indexOf('Editors')!==-1)
            {
                localStorage.setItem('isReadOnly', false);
            }
            localStorage.setItem('firstName', authData.data.first_name);
            localStorage.setItem('authToken', authData.data.token);
            self.redirect('/home');
        }).catch((err) => {
            alert('Authentication failed! Enter a valid Username and Password.')
            console.log(err);
        });
    }

    render() {
        return (
        <div className="login-screen">
            <MuiThemeProvider>
            <div>
            <AppBar
                title="Login"
            />
            <TextField id="username"
                hintText="Enter your Username"
                floatingLabelText="Username"
                onChange = {(event,newValue) => this.setState({username:newValue})}
                />
            <br/>
                <TextField id="password"
                type="password"
                hintText="Enter your Password"
                floatingLabelText="Password"
                onChange = {(event,newValue) => this.setState({password:newValue})}
                />
                <br/>
                <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleSubmitClick(event)}/>
            </div>
            </MuiThemeProvider>
        </div>
        );
    }
}