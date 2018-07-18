import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class ContactModal extends React.Component {
    constructor(props){
        super(props);
    }

    //Sends request to add contact
    onSubmitClick(event){
        event.preventDefault();
        var name = document.getElementById("new-name").value;
        var email = document.getElementById("new-email").value;
        var role = document.getElementById("new-role").value;
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/contacts/';
        var request = new Request(requestString);
        var self = this;
        if (name.trim() !== "" || email.trim() !== "" || role.trim() !== "")
        {
            //post request to post the new contact with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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

    onCancelClick(){
        this.props.closeModalCallback();
    }

    render(){
        return(
            <Row className="add-contact">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>Add Contact:</h5></label>
                        <form>
                            <div className="form-group">
                                <input type = 'text' placeholder='Name' readOnly={this.props.state} className="form-control" id="new-name"></input>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='Email' readOnly={this.props.state} className="form-control" id="new-email"></input>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='Role' readOnly={this.props.state} className="form-control" id="new-role"></input>
                            </div>
                            <div className="form-group" style={{display : 'inline-block',marginRight:2 + '%'}}>
                                <button disabled={this.props.state} onClick={this.onSubmitClick.bind(this)} type="button" className="btn btn-primary">Submit</button>
                            </div>
                            <div className="form-group" style={{display : 'inline-block'}}>
                                <button disabled={this.props.state} onClick={this.onCancelClick.bind(this)} type="button" className="btn btn-default">Cancel</button>
                            </div>
                        </form>
                    </div>
                </Col> 
            </Row>
        );
    }
}