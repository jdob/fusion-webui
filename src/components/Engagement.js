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

    //Sends a backend request to delete /partnes/id/engagement
    onDeleteClick(event){
        var self = this;
        var engagementId = parseInt(event.target.parentElement.parentElement.parentElement.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/engagements/'+
                            engagementId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
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

    //If we want changes to be stored on tab
    onBeforeSaveCell(row, cellName, cellValue){
        var rowId = parseInt(row.id,10);
        if(this.previousId === undefined)
        {
            this.previousId = rowId;
        }
        if(this.previousId !== rowId)
        {
            alert('Update previous row or you will loose data');
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
           localStorage.getItem('isReadOnly') !== 'true') {
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

    //Open Modal after Modal view is decided
    //Edit/Add View
    afterUpdate() {
        this.handleOpenModal();
    }       

    //Open Edit View in modal
    onUpdateClick(engagementId) {
        var data = this.state.engagements.filter(function(item){
            return item.id === engagementId;
        });
        var self = this;
        this.setState({ dataForModal: data[0], title: 'Edit Engagement'}, 
                            self.afterUpdate.bind(self));
    }

    //Update button html
    addUpdateButton(engagement_id) {
        var updateButton;
        if(localStorage.getItem('isReadOnly') !== null &&
           localStorage.getItem('isReadOnly') !== 'true') {
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

    //Show engagements in the format that we require
    populateEngagements() {
        let rows = [];
        let engagements = this.state.engagements;
        let numberOfItems = parseInt(engagements.length,10);
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

    //Add Engagement button html
    addEngagementButton() {
        var engagementButton;
        if(localStorage.getItem('isReadOnly') !== null &&
            localStorage.getItem('isReadOnly') !== 'true') {
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

    //Call parent after change in engagements
    afterNewUpdate() {
        this.props.callbackParent(this.state.engagements);
    }

    //Decides if new engagement was added or an engagment was updated
    //Calls the function in parent
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

    //Open View Engagement in modal
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