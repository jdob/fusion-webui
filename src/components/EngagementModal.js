import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';

export default class ContactModal extends React.Component {
    constructor(props) {
        super(props);
        var now = new Date();
        this.state = {
            data:this.props.data,
            title:this.props.title,
            date:(this.props.data.timestamp === undefined || 
                    this.props.data.timestamp === '') ? now : 
                    new Date(this.props.data.timestamp)
        }
        this.changes = {};
    }
    //Decides if new engagement is to be added or an engagement has to be updated
    onSubmitClick(event) {
        if(Object.keys(this.state.data).length === 0 && 
            this.state.data.constructor === Object) {
                this.addNewEngagement.call(this,event);
        }
        else
        {
            this.updateEngagement.call(this,event);
        }
    }
    
    //Sends request to add engagement
    addNewEngagement(event){
        event.preventDefault();
        var attendees = document.getElementById('attendees').value;
        var notes = document.getElementById('notes').value;
        var location = document.getElementById('location').value;
        var timestamp = this.state.date;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/';
        var request = new Request(requestString);
        var self = this;
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        if (attendees.trim()!=='' || notes.trim()!=='' || location.trim()!=='')
        {
            //post request to post the new engagement with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'attendees': attendees,
                    'notes': notes,
                    'location': location,
                    'timestamp': timestamp
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
    //Updates the engagement
    updateEngagement(event){
        event.preventDefault();
        var self = this;
        var engagementId = parseInt(this.state.data.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/'+engagementId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        if(Object.keys(this.changes).length > 0) {
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
                    self.props.callbackParent(self.changes, engagementId);
                }
                self.props.closeModalCallback();
            });
        }
    }

    //Close modal on cancel
    onCancelClick(){
        this.props.closeModalCallback();
    }

    //Separate function to store date changes because the Calendar widget does
    //not accept classes
    //Called after date is changed
    afterDateUpdate(){
        this.changes["timestamp"] = this.state.date;
    }
    
    //Changes the state when date is changed
    changeDate = date => this.setState({ date }, this.afterDateUpdate.bind(this))

    //Storing rest of the changes
    storeUpdates(event){
        var row = event.target;
        if(row.defaultValue !== row.value)
        {
            this.changes[row.id] = row.value;
        }
    }

    render(){
        return (
            <Row className="add-engagement">
                <Col xs={12} md={12} lg={12}>
                    <div className="form-group">
                        <label><h5>{this.state.title}</h5></label>
                        <form>
                            <div className="form-group">
                                <input type = 'text' placeholder='Attendees' 
                                    readOnly={this.props.state} 
                                    className="form-control" 
                                    id="attendees"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.attendees}>
                                </input>
                            </div>
                            <div className="form-group">
                                <textarea rows='5'  placeholder='Notes' 
                                    readOnly={this.props.state} 
                                    className="form-control" 
                                    id="notes"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.notes}>
                                </textarea>
                            </div>
                            <div className="form-group">
                                <input type = 'text'  placeholder='Location' 
                                    readOnly={this.props.state} 
                                    className="form-control" 
                                    id="location"
                                    onBlur={this.storeUpdates.bind(this)}
                                    defaultValue={this.state.data.location}>
                                </input>
                            </div>
                            <div id="timestamp">
                                <Calendar 
                                    onChange={this.changeDate.bind(this)}
                                    value={this.state.date}/>
                            </div>
                            <div className="form-group" 
                                style={{display : 'inline-block',marginRight:2 + '%',
                                        marginTop:2 + '%'}}>
                                <button disabled={this.props.state} 
                                    onClick={this.onSubmitClick.bind(this)} 
                                    type="button" className="btn btn-primary">Submit
                                </button>
                            </div>
                            <div className="form-group" style={{display : 'inline-block'}}>
                                <button disabled={this.props.state} 
                                    onClick={this.onCancelClick.bind(this)} 
                                    type="button" className="btn btn-default">Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </Col> 
            </Row>
        );
    }
}