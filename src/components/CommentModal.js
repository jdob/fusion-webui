import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class CommenttModal extends React.Component {
    //Add new comment, does not allow empty string or just spaces, to save
    //server hits and db space in the future 
    onSubmitClick(event){
        event.preventDefault();
        var textVal = document.getElementById('new-comment').value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/comments/';
        var request = new Request(requestString);
        var self = this;
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        if (textVal.trim() !== '')
        {
            //post request to post the new comment with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'text': textVal
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    var returnedComment = JSON.parse(responseText);
                    //appending new comment to the ui
                    var newComment = {'id':parseInt(returnedComment.id,10),'text':returnedComment.text};
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(newComment);
                    }
                    self.props.closeModalCallback();
                });
            });
        }
    }

    //Close modal on cancel click
    onCancelClick(){
        this.props.closeModalCallback();
    }

    render(){
        return(
            <Row className="add-info">
                <Col xs={12} md={12} lg={12}>
                    <form>
                        <div className="form-group">
                            <label><h5>Add Comment:</h5></label>
                            <textarea rows='5' placeholder="Comment" 
                            readOnly={this.props.state} className="form-control" 
                            id="new-comment"></textarea>
                        </div>
                        <div className="form-group" style={{display : 'inline-block',marginRight:2 + '%'}}>
                            <button disabled={this.props.state} 
                            onClick={this.onSubmitClick.bind(this)} 
                            type="button" className="btn btn-primary">Submit</button>
                        </div>
                        <div className="form-group" style={{display : 'inline-block'}}>
                            <button disabled={this.props.state} 
                            onClick={this.onCancelClick.bind(this)} 
                            type="button" className="btn btn-default">Cancel</button>
                        </div>
                    </form>
                </Col> 
            </Row>
        );
    }
}