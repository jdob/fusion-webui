import React from 'react';
import Engagement from './Engagement.js';
import Contact from './Contact.js';
import Comment from './Comment.js';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ModalLeftSide from './ModalLeftSide.js';
import '../css/PartnerPage.css';

export default class PartnerPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            state:this.props.location.state,
            partnerData:{},
            hasLoadedData : false
        };
    }

    componentDidMount(){
        var self = this;
        var     url = "http://127.0.0.1:8000/partners/"+parseInt(this.props.match.params.partnerId)+"/";
        axios.get(url)
        .then(function(partnerData) {
            self.setState({partnerData: partnerData.data, hasLoadedData: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    //update the changes
    commentsChange(newComments) {
        this.setState(this.state.partnerData.comments=newComments)
    }

    //Same as above
    engagementsChange(newEngagements) {
        this.setState(this.state.partnerData.engagements=newEngagements)
    }

    contactsChange(newContacts) {
        this.setState(this.state.partnerData.contacts=newContacts)
    }

    render() {
        if (!this.state.hasLoadedData) {
            return <p>Loading ...</p>;
        }
        else
        {
            return (
                <div>
                    <div className="left-div">   
                        <ModalLeftSide state={this.state.state} data={this.state.partnerData}/>
                    </div>
                    <div className="right-div">
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Contact state={this.state.state}
                                        contacts={this.state.partnerData.contacts}
                                        partnerId={this.state.partnerData.id}
                                        callbackParent={this.contactsChange.bind(this)}/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Comment state={this.state.state}
                                        comments={this.state.partnerData.comments}
                                        partnerId={this.state.partnerData.id}
                                        callbackParent={this.commentsChange.bind(this)}/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Engagement state={this.state.state}
                                            engagements={this.state.partnerData.engagements}
                                            partnerId={this.state.partnerData.id}
                                            callbackParent={this.engagementsChange.bind(this)} />
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }
}