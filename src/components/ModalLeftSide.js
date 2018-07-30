import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../css/ModalLeftSide.css';

export default class ModalLeftSide extends React.Component {
    //We will get the data for the image src and badges
    render() {
        return(
            <div>
                <Row className="modal-partner-image">
                    <Col xs={12} md={12} lg={12}>
                        <img height="200"
                             width="200"
                             alt=""
                             src={"data:image/jpg;base64," + this.props.data.logo}
                         />
                    </Col>
                </Row>
                <Row className="modal-partner-summary">
                    <Col xs={12} md={12} lg={12}>{this.props.data.summary}</Col> 
                </Row>  
            </div>
        );
    }
}