import React from 'react';
import logo from '../logo.svg';
import { Row, Col } from 'react-bootstrap';
import '../css/ModalLeftSide.css';

export default class ModalLeftSide extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    //We will get the data for the image src and badges
    render() {
        return(
            <div>
                <Row className="modal-partner-image">
                    <Col xs={12} md={12} lg={12}><img className="image-adjust" src={"data:image/jpg;base64," + this.props.data.logo} /></Col>
                </Row>
                <Row className="modal-partner-summary">
                    <Col xs={12} md={12} lg={12}>{this.props.data.summary}</Col> 
                </Row>  
            </div>
        );
    }
}