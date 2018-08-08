import React from 'react';
import { Row, Col } from 'react-bootstrap';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import '../css/Engagement.css';
import ReactModal from 'react-modal';
import EngagementModal from './EngagementModal.js';
import SvgIcon from 'react-icons-kit';
import {pencil} from 'react-icons-kit/icomoon/pencil';
import {bin} from 'react-icons-kit/icomoon/bin';

export default class Engagement extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId = undefined;
        this.state = {
            engagements : this.props.engagements,
            showModal: false,
            dataForModal:{},
            title:undefined
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
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/';
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
        var engagementId = parseInt(event.target.parentElement.parentElement.
                                        parentElement.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/'+
                            engagementId+'/';
        var request = new Request(requestString);
        var tokenString = "Token " + localStorage.getItem("authToken");
        //delete request to delete engagement with the partner_id
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': tokenString
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
        var self = this;
        var row = event.target;
        var engagementId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/'+
                            engagementId+'/';
        var request = new Request(requestString);
        var tokenString = "Token " + localStorage.getItem("authToken");
        if(Object.keys(this.changes).length > 0) {
            //delete request to delete engagement with the partner_id
            fetch(request, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
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

    addDeleteButton(engagement_id) {
        var deleteButton;
        if(localStorage.getItem('isReadOnly') !== null &&
           localStorage.getItem("isReadOnly") !== "true") {
           deleteButton = <Col xs={1} md={1} lg={1} className="delete-engagement">
                                <button id={engagement_id}
                                        disabled= {this.props.state}
                                        onClick={this.onDeleteClick.bind(this)}
                                        className="delete-button">
                                    <SvgIcon size={20} icon={bin}/>
                                </button>
                            </Col>
        }
        else {
            deleteButton = <Col xs={1} md={1} lg={1} className="delete-engagement"></Col>
        }
        return deleteButton;
    }

    afterUpdate() {
        this.handleOpenModal();
    }       

    onUpdateClick(engagementId) {
        var data = this.state.engagements.filter(function(item){
            return item.id === engagementId;
        });
        var self = this;
        this.setState({ dataForModal: data[0], title: 'Edit Engagement'}, 
                            self.afterUpdate.bind(self));
    }

    addUpdateButton(engagement_id) {
        var updateButton;
        if(localStorage.getItem('isReadOnly') !== null &&
           localStorage.getItem("isReadOnly") !== "true") {
            updateButton = <Col xs={1} md={1} lg={1} className="update-engagement">
                                <button id={engagement_id}
                                        disabled= {this.props.state}
                                        onClick={this.onUpdateClick.bind(this,engagement_id)}
                                        className="update-button">
                                    <SvgIcon size={20} icon={pencil}/>
                                </button>
                            </Col>
        }
        else {
            updateButton = <Col xs={1} md={1} lg={1} className="update-engagement"></Col>
        }
        return updateButton;
    }

    /*addUpdateButtonRow(engagement_id) {
        var updateButtonRow;
        if(localStorage.getItem('isReadOnly') !== null &&
            localStorage.getItem("isReadOnly") !== "true") {
            updateButtonRow = <Row>
                                <Col xs={12} md={12} lg={12} className="update-engagement">
                                    <div className="form-group">
                                        <button id={engagement_id}
                                                disabled={this.props.state}
                                                onClick={this.onUpdateClick.bind(this)}
                                                type="button"
                                                className="btn btn-primary">
                                            Update
                                        </button>
                                    </div>
                                </Col>
                             </Row>
        }
        return updateButtonRow;
    }*/

    populateEngagements() {
        let rows = [];
        let engagements = this.state.engagements;
        let numberOfItems = parseInt(engagements.length,10);
        var self = this;
        if(numberOfItems === 0)
        {
            rows.push(
                <Row key="no-engagement">
                    <Col xs={12} md={12} lg={12}>No Engagements with this partner</Col>
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
                            <Col xs={1} md={1} lg={1}><b>Date:</b></Col>
                            <Col xs={9} md={9} lg={9}><b>{engagementDate.toDateString()}</b></Col>
                            {this.addUpdateButton.call(this, engagements[i].id)}
                            {this.addDeleteButton.call(this, engagements[i].id)}
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Location:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <div className="form-group">
                                    {engagements[i].location}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Attendees:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <div className="form-group">
                                    {engagements[i].attendees}
                                    {/*<input engagementid={engagements[i].id}
                                            onChange={this.storeUpdates.bind(this)}
                                            type='text'
                                            readOnly={self.props.state}
                                            className="form-control"
                                            defaultValue={engagements[i].attendees}
                                            attr="attendees">
                                    </input>*/}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1} md={1} lg={1}>Notes:</Col>
                            <Col xs={10} md={10} lg={10}>
                                <div className="form-group">
                                    {engagements[i].notes}
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

    addEngagementButton() {
        var engagementButton;
        if(localStorage.getItem('isReadOnly') !== null &&
            localStorage.getItem("isReadOnly") !== "true") {
            engagementButton = <Row className="add-engagement-button">
                                    <Col xs={12} md={12} lg={12}>
                                        <form>
                                            <div className="form-group">
                                                <button disabled={this.props.state}
                                                        onClick={this.newEngagement.bind(this)}
                                                        type="button"
                                                        className="btn btn-primary">
                                                    Add Engagement
                                                </button>
                                            </div>
                                        </form>
                                    </Col>
                                </Row>
        }
        return engagementButton;
    }

    afterNewUpdate() {
        this.props.callbackParent(this.state.engagements);
    }

    callbackParent(newEngagement, engagementId){
        var engagements = [];
        if(engagementId !== undefined)
        {
            this.state.engagements.forEach(element => {
                if(element.id === engagementId){
                    for(var prop in newEngagement)
                    {
                        element[prop] = newEngagement[prop];
                    }
                }
                engagements.push(element);
            });
            this.setState({engagements:engagements}, this.afterNewUpdate.bind(this));
        }
        else
        {
            this.setState(prevState => ({
                engagements: prevState.engagements.concat(newEngagement),
            }));
            this.props.callbackParent(this.state.engagements);
        }
    }

    newEngagement() {
        var self = this;
        self.setState({ dataForModal: {}, title: "Add Engagement"}, 
                            self.afterUpdate.bind(self));
    }


    render(){
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}><div className="detail-header">Engagements</div></Col>
                </Row>
                <div className="partner-engagements">
                    {this.populateEngagements.call(this)}
                </div>
                <div>
                    {this.addEngagementButton.call(this)}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}>
                    <div>
                        <EngagementModal state={this.props.state}
                            callbackParent={this.callbackParent.bind(this)}
                            partnerId={this.props.partnerId}
                            closeModalCallback={this.handleCloseModal.bind(this)}
                            data={this.state.dataForModal}
                            title={this.state.title}
                        />
                    </div>
                </ReactModal>
            </div>
        );
    }
}