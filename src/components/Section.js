import React from 'react';
import '../css/Section.css';
import { Row } from 'react-bootstrap';
import Partner from './Partner.js';
import withRouter from 'react-router-dom/withRouter';

class Section extends React.Component {
    //creating section for each major category like DB clients, network clients etc
    populateSection() {
        let rows = [];
        let numberOfItems = parseInt(this.props.data.length,10); 
        for(let i=0; i<numberOfItems; i++) {
            //creates the image + popup for that image
            rows.push(<Partner data={this.props.data[i]} key={this.props.data[i].id}/>)
        }
        return rows;
    }

    render() {
        return (
          <div key ={this.props.id} className="partner-section">
              <Row className="partner-header">
                {this.props.type}
              </Row>
              <div className="partners">
                {this.populateSection()}
              </div>   
          </div>
        );
    }
}
export default withRouter(Section);