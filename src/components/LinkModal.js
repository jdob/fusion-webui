import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class LinkModal extends React.Component {
    constructor(props){
        super(props);
    }

    //Sends request to add contact
    onSubmitClick(event){
        event.preventDefault();
        var name = document.getElementById("new-name").value;
        var url = document.getElementById("new-url").value;
        var description = document.getElementById("new-description").value;
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/links/';
        var request = new Request(requestString);
        var self = this;
        if (name.trim() !== "" || url.trim() !== "" || description.trim() !== "")
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

    onCancelClick(){
        this.props.closeModalCallback();
    }

    render(){
        return(
            <Row className="add-link">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>Add Link:</h5></label>
                        <form>
                            <div className="form-group">
                                <input type = 'text' placeholder='Name' readOnly={this.props.state} className="form-control" id="new-name"></input>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='url' readOnly={this.props.state} className="form-control" id="new-url"></input>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='Description' readOnly={this.props.state} className="form-control" id="new-description"></input>
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