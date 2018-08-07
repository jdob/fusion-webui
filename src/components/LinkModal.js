import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class LinkModal extends React.Component {
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
                this.addNewLink.call(this,event);
        }
        else
        {
            this.updateLink.call(this,event);
        }
    }

    //Sends request to add link
    addNewLink(event){
        event.preventDefault();
        var name = document.getElementById("name").value;
        var url = document.getElementById("url").value;
        var description = document.getElementById("description").value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/links/';
        var request = new Request(requestString);
        var self = this;
        var tokenString = "Token " + localStorage.getItem("authToken");
        if (name.trim() !== "" || url.trim() !== "" || description.trim() !== "")
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
                    'url': url,
                    'description': description
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new contact to the ui
                    var returnedLink = JSON.parse(responseText);
                        var newLink = {'id':parseInt(returnedLink.id,10),
                            'name':returnedLink.name,
                            'url':returnedLink.url,
                            'description':returnedLink.description
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(newLink);
                    }
                    self.props.closeModalCallback();
                });
            });
        }
    }

    updateLink(event){
        event.preventDefault();
        var self = this;
        var linkId = parseInt(this.state.data.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/links/'+linkId+'/';
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
                    self.props.callbackParent(self.changes, linkId);
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
            <Row className="add-link">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>Add Link:</h5></label>
                        <form>
                            <div className="form-group">
                                <input type='text'
                                    placeholder='Name'
                                    readOnly={this.props.state}
                                    className="form-control"
                                    id="name"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.name}>
                                </input>
                            </div>
                            <div className="form-group">
                                <input type='text'
                                    placeholder='url'
                                    readOnly={this.props.state}
                                    className="form-control"
                                    id="url"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.url}>
                                </input>
                            </div>
                            <div className="form-group">
                                <input type='text'
                                    placeholder='Description'
                                    readOnly={this.props.state}
                                    className="form-control"
                                    id="description"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.description}>
                                </input>
                            </div>
                            <div className="form-group" style={{display : 'inline-block',marginRight:2 + '%'}}>
                                <button disabled={this.props.state}
                                        onClick={this.onSubmitClick.bind(this)}
                                        type="button"
                                        className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                            <div className="form-group" style={{display : 'inline-block'}}>
                                <button disabled={this.props.state}
                                        onClick={this.onCancelClick.bind(this)}
                                        type="button"
                                        className="btn btn-default">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </Col> 
            </Row>
        );
    }
}