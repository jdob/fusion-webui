import React from 'react';
import Engagement from './Engagement.js';
import Contact from './Contact.js';
import Comment from './Comment.js';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ModalLeftSide from './ModalLeftSide.js';
import '../css/PartnerPage.css';
import Links from './Links.js';
import Todos from './Todos.js';
import withRouter from 'react-router-dom/withRouter';
import Config from '../Config.js';

class PartnerPage extends React.Component {
    constructor(props){
        super(props);
        //We need it again to handle refresh
        if(Config.serviceHost === 'localhost' || Config.serviceHost === undefined)
        {
            window.App.urlConstants.serviceHost = 'http://127.0.0.1:8000/';  
        }
        else
        {
            window.App.urlConstants.serviceHost = 'http://'+ Config.serviceHost+':'+Config.servicePort+'/';
        }
        this.state = {
            state:true,
            partnerData:{},
            hasLoadedData : false
        };
    }

    //Get the data for the partner, handles refresh and bookmark
    componentDidMount(){
        var self = this;
        var url = window.App.urlConstants.serviceHost + 
                    window.App.urlConstants.partnersUrl+
                    parseInt(this.props.match.params.partnerId,10)+'/';
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        axios.get(
            url,
            {
                headers: {
                  Authorization : tokenString
                }
            }
        )
        .then(function(partnerData) {
            self.setState({partnerData: partnerData.data, hasLoadedData: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    //Check for read only view
    componentWillMount() {
        if(JSON.parse(localStorage.getItem('groups')).indexOf('Editors') !==-1 ){
            this.setState({state : false});
        }
    }

    //update the changes
    //these are callbacks for future handling
    commentsChange(newComments) {
        //this.setState(this.state.partnerData.comments=newComments)
        console.log('Callback to handle anything after comments change');
    }

    //Same as above
    engagementsChange(newEngagements) {
        //this.setState(this.state.partnerData.engagements=newEngagements)
        console.log('Callback to handle anything after engagements change');
    }

    contactsChange(newContacts) {
        //this.setState(this.state.partnerData.contacts=newContacts)
        console.log('Callback to handle anything after contacts change');
    }

    linksChange(newLinks) {
        //this.setState(this.state.partnerData.links=newLinks)
        console.log('Callback to handle anything after links change');
    }

    tasksChange(newsTasks) {
        console.log('Callback to handle anything after tasks change');
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
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Links state={this.state.state}
                                         links={this.state.partnerData.links}
                                         partnerId={this.state.partnerData.id}
                                         callbackParent={this.linksChange.bind(this)}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Comment state={this.state.state}
                                         comments={this.state.partnerData.comments}
                                         partnerId={this.state.partnerData.id}
                                         callbackParent={this.commentsChange.bind(this)}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Engagement state={this.state.state}
                                            engagements={this.state.partnerData.engagements}
                                            partnerId={this.state.partnerData.id}
                                            callbackParent={this.engagementsChange.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <Todos state={this.state.state}
                                       tasks={this.state.partnerData.tasks}
                                       partnerId={this.state.partnerData.id}
                                       callbackParent={this.tasksChange.bind(this)}/>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }
}
export default withRouter(PartnerPage);