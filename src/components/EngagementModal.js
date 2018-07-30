import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class ContactModal extends React.Component {
    //Sends request to add comment
    onSubmitClick(event){
        event.preventDefault();
        var attendees = document.getElementById("new-attendees").value;
        var notes = document.getElementById("new-notes").value;
        var location = document.getElementById("new-location").value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/';
        var request = new Request(requestString);
        var self = this;
        if (attendees.trim() !== "" || notes.trim() !== "" || location.trim() !== "")
        {
            //post request to post the new engagement with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                //the data being sent
                body: JSON.stringify({
                    'attendees': attendees,
                    'notes': notes,
                    'location': location
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new comment to the ui
                    var returnedEngagement = JSON.parse(responseText);
                        var newEngagement = {'id':parseInt(returnedEngagement.id,10),
                            'attendees':returnedEngagement.attendees,
                            'notes':returnedEngagement.notes,
                            'location':returnedEngagement.location,
                            'timestamp':returnedEngagement.timestamp
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(newEngagement);
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
        return (
            <Row className="add-engagement">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>Add Engagement:</h5></label>
                        <form>
                            <div className="form-group">
                                <input type = 'text' placeholder='Attendees' readOnly={this.props.state} className="form-control" id="new-attendees"></input>
                            </div>
                            <div className="form-group">
                                <textarea rows='5'  placeholder='Notes' readOnly={this.props.state} className="form-control" id="new-notes"></textarea>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='Location' readOnly={this.props.state} className="form-control" id="new-location"></input>
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