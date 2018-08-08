import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../css/ModalLeftSide.css';
import SvgIcon from 'react-icons-kit';
import { home } from 'react-icons-kit/icomoon/home';

export default class ModalLeftSide extends React.Component {
    redirectToHome() {
        window.location.pathname = '/home'; 
    }
    //We will get the data for the image src and badges
    render() {
        return(
            <div className="partner-summary-side">
                <div className="home-link" onClick={this.redirectToHome.bind(this)}>
                    <SvgIcon size={30} icon={home}/>
                </div> 
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