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

    //Decides if a new task is added or a task is updated
    onSubmitClick(event) {
        if(Object.keys(this.state.data).length === 0 && 
            this.state.data.constructor === Object) {
                this.addNewTask.call(this,event);
        }
        else
        {
            this.updateTask.call(this,event);
        }
    }
    //Sends request to add task
    addNewTask(event){
        event.preventDefault();
        var text = document.getElementById('text').value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/tasks/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        var self = this;
        if (text.trim() !== '')
        {
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'text': text
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new contact to the ui
                    var returnedTask = JSON.parse(responseText);
                        var newTask = {'id':parseInt(returnedTask.id,10),
                            'text':returnedTask.text,
                            'completed':returnedTask.completed
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(newTask);
                    }
                    self.props.closeModalCallback();
                });
            });
        }
    }

    //Update task
    updateTask(event){
        event.preventDefault();
        var self = this;
        var taskId = parseInt(this.state.data.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/tasks/'+taskId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        if(Object.keys(this.changes).length > 0) {
            //delete request to delete task with the partner_id
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
                    self.props.callbackParent(self.changes, taskId);
                }
                self.props.closeModalCallback();
            });
        }
    }

    //close modal on cancel
    onCancelClick(){
        this.props.closeModalCallback();
    }

    //store the changes for the task
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
                                placeholder='Text' 
                                readOnly={this.props.state} 
                                className="form-control" 
                                id="text"
                                onBlur={this.storeUpdates.bind(this)}
                                defaultValue={this.state.data.text}>
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