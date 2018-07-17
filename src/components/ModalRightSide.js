import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Engagement from './Engagement.js';
import Contact from './Contact.js';
import Comment from './Comment.js';

//Will have code for data persistence
export default class ModalRightSide extends React.Component {
    constructor(props) {
        super(props);
    }

    //Add new comment, does not allow empty string or just spaces, to save
    //server hits and db space in the future 
    onSubmitClick(event){
        event.preventDefault();
        var textVal = document.getElementById("new-comment").value;
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.data.id+'/newComment/';
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
                    'newComment': textVal
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new comment to the ui
                        var newComment = {'id':responseText,'text':textVal}
                        self.props.data.comments.push(newComment);
                        self.setState(prevState => ({
                        comments: prevState.comments.concat(newComment),
                    }));
                });
            });
        }
    }

    //After comments change, the properties need to change, that the view
    //is updated
    commentsChange(newComments) {
        this.props.data.comments = newComments;
    }

    //Same as above
    engagementsChange(newEngagements) {
        this.props.data.engagements = newEngagements;
    }

    contactsChange(newContacts) {
        this.props.data.contacts = newContacts;
    }

    render() {
        return(
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Contact state={this.props.state}
                                 contacts={this.props.data.contacts}
                                 partnerId={this.props.data.id}
                                 callbackParent={this.contactsChange.bind(this)}/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Comment state={this.props.state}
                                 comments={this.props.data.comments}
                                 partnerId={this.props.data.id}
                                 callbackParent={this.commentsChange.bind(this)}/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Engagement state={this.props.state}
                                    engagements={this.props.data.engagements}
                                    partnerId={this.props.data.id}
                                    callbackParent={this.engagementsChange.bind(this)} />
                    </Col>
                </Row>
            </div>
        );
    }
}