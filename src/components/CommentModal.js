import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class CommenttModal extends React.Component {
    constructor(props){
        super(props);
    }

    //Add new comment, does not allow empty string or just spaces, to save
    //server hits and db space in the future 
    onSubmitClick(event){
        event.preventDefault();
        var textVal = document.getElementById("new-comment").value;
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/comments/';
        var request = new Request(requestString);
        var self = this;
        if (textVal.trim() !== "")
        {
            //post request to post the new comment with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
                });
            });
        }
    }

    render(){
        return(
            <Row className="add-info">
                <Col xs={12} md={12} lg={12}>
                    <form>
                        <div className="form-group">
                            <label><h5>Add Comment:</h5></label>
                            <input type="text" placeholder="Comment" readOnly={this.props.state} className="form-control" id="new-comment"></input>
                        </div>
                        <div className="form-group">
                            <button disabled={this.props.state} onClick={this.onSubmitClick.bind(this)} type="button" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </Col> 
            </Row>
        );
    }
}