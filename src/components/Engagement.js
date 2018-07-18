import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../css/Engagement.css';
import ReactModal from 'react-modal';
import EngagementModal from './EngagementModal.js';

export default class Engagement extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId;
        this.state = {
            engagements : this.props.engagements,
            showModal: false
        };
        this.cellEditProp = {
            mode: 'click',
            beforeSaveCell: this.onBeforeSaveCell.bind(this) // a hook for before saving cell
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentWillMount(){
        ReactModal.setAppElement('body');
    }

    //opens modal
    handleOpenModal () {
        this.setState({ showModal: true });
    }
    
    //closes modal
    handleCloseModal () {
        this.setState({ showModal: false });
    }

    //Sends request to add comment
    onSubmitClick(event){
        event.preventDefault();
        var attendees = document.getElementById("new-attendees").value;
        var notes = document.getElementById("new-notes").value;
        var location = document.getElementById("new-location").value;
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/engagements/';
        var request = new Request(requestString);
        var self = this;
        if (attendees.trim() !== "" || notes.trim() !== "" || location.trim() !== "")
        {
            //post request to post the new engagement with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                //the data being sent
                body: JSON.stringify({
                    'attendees': attendees,
                    'notes': notes,
                    'location': location
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new comment to the ui
                    var returnedEngagement = JSON.parse(responseText);
                        var newEngagement = {'id':parseInt(returnedEngagement.id,10),
                            'attendees':returnedEngagement.attendees,
                            'notes':returnedEngagement.notes,
                            'location':returnedEngagement.location,
                            'timestamp':returnedEngagement.timestamp
                        }
                        self.setState(prevState => ({
                            engagements: prevState.engagements.concat(newEngagement),
                        }));
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(self.state.engagements);
                    }
                    //self.render();
                });
            });
        }
    }

    //Sends a backend request to delete /partnes/id/engagement
    onDeleteClick(event){
        var self = this;
        var engagementId = parseInt(event.target.id,10);
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/engagements/'+engagementId+'/';
        var request = new Request(requestString);
        //delete request to delete engagement with the partner_id
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            //the data being sent
            body: JSON.stringify({
                'engagementId': engagementId,
            })
        }).then(function(response){
            //we get the response text only like this
            response.text().then(function() {
                /*var elementId = ''+engagementId;
                var elem = document.getElementById(elementId);
                elem.parentNode.removeChild(elem);*/
                //appending new comment to the ui
                var newEngagements = self.state.engagements.filter(function( obj ) {
                    return obj.id !== parseInt(engagementId, 10);
                });
                self.setState(prevState => ({
                    engagements: newEngagements,
                }));
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.state.engagements)
                }
            });
        });
    }


    onBeforeSaveCell(row, cellName, cellValue){
        var rowId = parseInt(row.id,10);
        if(this.previousId === undefined)
        {
            this.previousId = rowId;
        }
        if(this.previousId !== rowId)
        {
            alert("Update previous row or you will loose data");
            return false;
        } 
        else
        {
            if(row[cellName] !== cellValue)
            {
                this.changes[cellName] = cellValue;
            }
        }
    }

    storeUpdates(event){
        event.preventDefault();
        var row = event.target;
        var rowId = parseInt(row.attributes.engagementid.nodeValue,10);
        if(this.previousId === undefined)
        {
            this.previousId = rowId;
        }
        if(this.previousId !== rowId)
        {
            alert("Update previous row or you will loose data");
        } 
        else
        {
            if(row.defaultValue !== row.value)
            {
                this.changes[row.attributes.attr.nodeValue] = row.value;
            }
        }
    }
    
    onUpdateClick(event) {
        /*if(!("attendees" in this.changes))
        {
            this.changes["attendees"] = row.attendees;
        }
        if(!("notes" in this.changes))
        {
            this.changes["notes"] = row.notes;
        }
        if(!("location" in this.changes))
        {
            this.changes["location"] = row.location;
        }*/
        var self = this;
        var row = event.target;
        var engagementId = parseInt(row.id,10);
        var requestString = 'http://127.0.0.1:8000/partners/'+this.props.partnerId+'/engagements/'+engagementId+'/';
        var request = new Request(requestString);
        if(Object.keys(this.changes).length > 0) {
            //delete request to delete engagement with the partner_id
            fetch(request, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                //the data being sent
                body: JSON.stringify({
                    'changes': self.changes,
                })
                //need to check the reason how its working
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new engagement to the ui
                    var returnedEngagement = JSON.parse(responseText);
                    for(let i=0; i<self.state.engagements.length; i++)
                        {
                            if(self.state.engagements[i].id === parseInt(returnedEngagement.id,10))
                            {
                                Object.assign(self.state.engagements[i],returnedEngagement);
                            }
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(self.state.engagements);
                    }
                });
            });
        }
        for (var member in this.changes) delete this.changes[member];
        this.previousId = undefined;
    }

    //for update button
    updateButtonFormatter(cell, row){
        return (
            <button disabled={this.props.state}
               onClick={() => 
               this.onUpdateClick(cell, row)}
            >
            update
            </button>
        )
    }

    //for delete button
    deleteButtonFormatter(cell, row){
        return (
            <button disabled={this.props.state} 
               onClick={() => 
               this.onDeleteClick(cell, row)}
            >
            x
            </button>
        )
    }

    populateEngagments() {
        let rows = [];
        let engagements = this.state.engagements;
        let numberOfItems = parseInt(engagements.length,10);
        var self = this;
        if(numberOfItems === 0)
        {
            rows.push(
                <Row key="no-engagement">
                    <Col xs={12} md={12} lg={12}>No Engaments with this partner</Col>
                </Row>
            )
        }
        else
        {   
            for(let i=0; i<numberOfItems; i++) {
                let key = "engagement-"+engagements[i].id;
                var engagementDate = new Date(engagements[i].timestamp); 
                rows.push(
                    <div id={engagements[i].id} key={key} className="engagements">
                        <Row>
                            <Col xs={10} md={10} lg={10}><b>{engagementDate.toDateString()}</b></Col>
                            <Col xs={1} md={1} lg={1} className="delete-engagement"><button id={engagements[i].id} disabled= {self.props.state} onClick={self.onDeleteClick.bind(this)} className="delete-button">x</button></Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Location:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <form>
                                    <div className="form-group">
                                        <input engagementid = {engagements[i].id} type = 'text' onChange = {this.storeUpdates.bind(this)} readOnly={self.props.state} className="form-control" defaultValue={engagements[i].location} attr="location"></input>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Attendees:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <form>
                                    <div className="form-group">
                                        <input engagementid = {engagements[i].id} onChange = {this.storeUpdates.bind(this)} type = 'text' readOnly={self.props.state} className="form-control" defaultValue={engagements[i].attendees} attr="attendees"></input>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Notes:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <form>
                                    <div className="form-group">
                                        <textarea engagementid = {engagements[i].id} onChange = {this.storeUpdates.bind(this)} className="form-control" readOnly={self.props.state} attr="notes" rows="3" defaultValue={engagements[i].notes}></textarea>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12} className="update-engagement">
                                <div className="form-group">
                                    <button id = {engagements[i].id} disabled={this.props.state} onClick={this.onUpdateClick.bind(this)} type="button" className="btn btn-primary">Update</button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                );
            }
        }
        return rows;
    }

    callbackParent(newEngagement){
        if(newEngagement !== 'undefined')
        {
            this.setState(prevState => ({
                engagements: prevState.engagements.concat(newEngagement),
            }));
            this.props.callbackParent(this.state.engagements);
        }
    }

    render(){
        return (
            <div>
                <Row>
                        <Col xs={12} md={12} lg={12}><h4>Engagements</h4></Col>
                </Row>
                {/*<BootstrapTable data={ this.state.engagements } bordered={true} cellEdit={ this.cellEditProp }>
                    <TableHeaderColumn hidden={true} dataField='id' isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn editable={!this.props.state} onMouseOut={this.onMouseOut} dataField='attendees'>Attendees</TableHeaderColumn>
                    <TableHeaderColumn editable={!this.props.state} dataField='notes'>Notes</TableHeaderColumn>
                    <TableHeaderColumn editable={!this.props.state} dataField='location'>Location</TableHeaderColumn>
                    <TableHeaderColumn editable={false} dataField="button" dataFormat={this.updateButtonFormatter.bind(this)}>Update</TableHeaderColumn>
                    <TableHeaderColumn editable={false} dataField="button" dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
        </BootstrapTable>*/}
                <div className="partner-engagements">
                    {this.populateEngagments.call(this)}
                </div>
                <Row className="add-engagement-button">
                    <Col xs={12} md={12} lg={12}>
                        <form>
                            <div className="form-group">
                                <button disabled={this.props.state} onClick={this.handleOpenModal} type="button" className="btn btn-primary">Add Engagement</button>
                            </div>
                        </form>
                    </Col> 
                </Row>
                {/*<Row className="add-engagement">
                    <Col xs={12} md={12} lg={12}>
                        <div className="form-group">
                            <label><h5>Add Engagement:</h5></label>
                            <form>
                                <div className="form-group">
                                    <input type = 'text' placeholder='Attendees' readOnly={this.props.state} className="form-control" id="new-attendees"></input>
                                </div>
                                <div className="form-group">
                                    <input type = 'text'  placeholder='Notes' readOnly={this.props.state} className="form-control" id="new-notes"></input>
                                </div>
                                <div className="form-group">
                                    <input type = 'text'  placeholder='Location' readOnly={this.props.state} className="form-control" id="new-location"></input>
                                </div>
                                <div className="form-group">
                                    <button disabled={this.props.state} onClick={this.onSubmitClick.bind(this)} type="button" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </Col> 
    </Row>*/}
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}
                >
                    <div>
                        <EngagementModal state={this.props.state} callbackParent={this.callbackParent.bind(this)} partnerId={this.props.partnerId} closeModalCallback={this.handleCloseModal.bind(this)}/>
                    </div>
                </ReactModal>
            </div>
        );
    }
}