import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class ContactModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.data,
            title:this.props.title
        }
        this.changes = {};
    }

    onSubmitClick(event) {
        if(Object.keys(this.state.data).length === 0 && 
            this.state.data.constructor === Object) {
                this.addNewContact.call(this,event);
        }
        else
        {
            this.updateContact.call(this,event);
        }
    }
    //Sends request to add contact
    addNewContact(event){
        event.preventDefault();
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var role = document.getElementById("role").value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/contacts/';
        var request = new Request(requestString);
        var tokenString = "Token " + localStorage.getItem("authToken");
        var self = this;
        if (name.trim() !== "" || email.trim() !== "" || role.trim() !== "")
        {
            //post request to post the new contact with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'role': role
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new contact to the ui
                    var returnedContact = JSON.parse(responseText);
                        var newContact = {'id':parseInt(returnedContact.id,10),
                            'name':returnedContact.name,
                            'email':returnedContact.email,
                            'role':returnedContact.role
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(newContact);
                    }
                    self.props.closeModalCallback();
                });
            });
        }
    }

    updateContact(event){
        event.preventDefault();
        var self = this;
        var contactId = parseInt(this.state.data.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/contacts/'+contactId+'/';
        var request = new Request(requestString);
        var tokenString = "Token " + localStorage.getItem("authToken");
        if(Object.keys(this.changes).length > 0) {
            //delete request to delete contact with the partner_id
            fetch(request, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'changes': self.changes,
                })
                //need to check the reason how its working
            }).then(function(response){
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.changes, contactId);
                }
                self.props.closeModalCallback();
            });
        }
    }

    onCancelClick(){
        this.props.closeModalCallback();
    }

    storeUpdates(event){
        var row = event.target;
        if(row.defaultValue !== row.value)
        {
            this.changes[row.id] = row.value;
        }
    }

    render(){
        return(
            <Row className="add-contact">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>{this.state.title}</h5></label>
                        <div className="form-group">
                            <input type = 'text' 
                                placeholder='Name' 
                                readOnly={this.props.state} 
                                className="form-control" 
                                id="name"
                                onBlur={this.storeUpdates.bind(this)}
                                defaultValue={this.state.data.name}>
                            </input>
                        </div>
                        <div className="form-group">
                            <input type = 'text'  
                                placeholder='Email' 
                                readOnly={this.props.state} 
                                className="form-control" 
                                id="email"
                                onBlur={this.storeUpdates.bind(this)}
                                defaultValue={this.state.data.email}>
                            </input>
                        </div>
                        <div className="form-group">
                            <input type = 'text'  
                                placeholder='Role' 
                                readOnly={this.props.state} 
                                className="form-control" 
                                id="role"
                                onBlur={this.storeUpdates.bind(this)}
                                defaultValue={this.state.data.role}>
                            </input>
                        </div>
                        <div className="form-group" 
                            style={{display : 'inline-block',marginRight:2 + '%'}}>
                            <button disabled={this.props.state} 
                                onClick={this.onSubmitClick.bind(this)} 
                                type="button" 
                                className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <div className="form-group" 
                            style={{display : 'inline-block'}}>
                            <button disabled={this.props.state} 
                                onClick={this.onCancelClick.bind(this)} 
                                type="button" 
                                className="btn btn-default">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Col> 
            </Row>
        );
    }
}