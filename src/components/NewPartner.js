import React, { Component } from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import '../css/NewPartner.css'

export default class NewPartner extends React.Component {
    constructor(props) {
        super(props);
    }

    //Dynamically create categories
    addCategories(){
        var rows = [];
        var categories = this.props.categories;
        for(let category=0; category<categories.length; category++)
        {
          rows.push(
            <div key={categories[category].id} className="form-check">
            <input className="form-check-input" type="checkbox" value="" id={categories[category].id} />
            <label className="form-check-label" htmlFor="defaultCheck1">
                {categories[category].name}
            </label>
            </div>
            );
        }
        return rows;
    }

    render(){
        return (
            <Jumbotron>
                <div className="div-center">
                    <Row>
                        <Col xs={12} md={12} lg={12}><h4>Enter Partner Details</h4></Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Name:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <input placeholder = "Name" type = 'text' className="form-control"></input>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Summary:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <textarea placeholder = "Summary" className="form-control" rows="3"></textarea>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Links:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <input placeholder = "Links" type = 'text' className="form-control"></input>
                                </div>
                            </form>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={12} lg={12}><h4>Enter Contact Details</h4></Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Name:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <input placeholder = "Name" type = 'text' className="form-control"></input>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Email:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <input type = 'text' placeholder = "Email" className="form-control"></input>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1} md={1} lg={1}>Role:</Col>
                        <Col xs={3} md={3} lg={3}>
                            <form>
                                <div className="form-group">
                                    <input placeholder = "Role" type = 'text' className="form-control"></input>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12} lg={12}><h4>Choose the categories that this partner belongs to</h4></Col>
                    </Row>
                    <Row>
                        {this.addCategories()}
                    </Row>
                </div>
            </Jumbotron>
        );
    }
}