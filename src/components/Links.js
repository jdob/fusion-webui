import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../css/Contact.css';
import ReactModal from 'react-modal';
import LinkModal from './LinkModal.js';

export default class Links extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId = undefined;
        this.state = {
            links : this.props.links,
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

    //Sends request to add contact
    onSubmitClick(event){
        event.preventDefault();
        var name = document.getElementById("new-name").value;
        var email = document.getElementById("new-email").value;
        var role = document.getElementById("new-role").value;
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl
                            +this.props.partnerId+'/contacts/';
        var request = new Request(requestString);
        var self = this;
        if (name.trim() !== "" || email.trim() !== "" || role.trim() !== "")
        {
            //post request to post the new contact with the partner_id
            fetch(request, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                //the data being sent
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'role': role
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new contact to the ui
                    var returnedContact = JSON.parse(responseText);
                        var newContact = {'id':parseInt(returnedContact.id,10),
                            'name':returnedContact.name,
                            'email':returnedContact.email,
                            'role':returnedContact.role
                        }
                        self.setState(prevState => ({
                            contacts: prevState.contacts.concat(newContact),
                        }));
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(self.state.contacts);
                    }
                });
            });
        }
    }

    //Sends a backend request to delete /partnes/id/contacts/contact_id
    onDeleteClick(cell, row){
        var self = this;
        var linkId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/links/'+linkId+'/';
        var request = new Request(requestString);
        //delete request to delete contacts with the partner_id
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            //the data being sent
            body: JSON.stringify({
                'linkId': linkId,
            })
        }).then(function(response){
            //we get the response text only like this
            response.text().then(function() {
                //appending new contact to the ui
                var newLinks = self.state.links.filter(function( obj ) {
                    return obj.id !== parseInt(linkId, 10);
                });
                self.setState(prevState => ({
                    links: newLinks,
                }));
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.state.links)
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
    
    onUpdateClick(cell, row) {
        var self = this;
        var linkId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/links/'+linkId+'/';
        var request = new Request(requestString);
        if(Object.keys(this.changes).length > 0) {
            //delete request to delete contact with the partner_id
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
               className="delete-button" onClick={() => 
               this.onDeleteClick(cell, row)}
            >
            x
            </button>
        )
    }


    callbackParent(newLink){
        if(newLink !== 'undefined')
        {
            this.setState(prevState => ({
                links: prevState.links.concat(newLink),
            }));
            this.props.callbackParent(this.state.links);
        }
    }

    //Add link only available if logged in
    addLinkButton() {
        var linkButton;
        if(localStorage.getItem("isLoggedIn") === "true") {
            linkButton = <Row className="add-links-button">
                            <Col xs={12} md={12} lg={12}>
                                <form>
                                    <div className="form-group">
                                        <button disabled={this.props.state} onClick={this.handleOpenModal} type="button" className="btn btn-primary">Add Links</button>
                                    </div>
                                </form>
                            </Col> 
                        </Row>
        }
        return linkButton;
    }

    rowStyleFormat(row, rowIdx) {
        return { backgroundColor: this.previousId == row.id ? '#ffb296' : '' };
    }

    render(){
        var className;
        var columnClassName;
        var width = "200px";
        var deleteButtonWidth = "20px";
        var updateButtonWidth = "50px";
        if(localStorage.getItem("isLoggedIn") !== "true"){
            className = "hidden";
            columnClassName = "hidden";
            width = "270px";
            deleteButtonWidth = "0.25px";
            updateButtonWidth = "0.25px";
        }
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}><div className="detail-header">Links</div></Col>
                </Row>
                <BootstrapTable data={ this.state.links } bordered={true} cellEdit={ this.cellEditProp} containerStyle={{width:'100%'}} trStyle={this.rowStyleFormat.bind(this)}>
                    <TableHeaderColumn hidden={true} dataField='id' isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn width ='125px' editable={!this.props.state} dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn width ='200px' editable={!this.props.state} dataField='url'>URL</TableHeaderColumn>
                    <TableHeaderColumn width ={width} editable={!this.props.state} dataField='description'>Description</TableHeaderColumn>
                    <TableHeaderColumn width ={updateButtonWidth} className= {className} columnClassName= {columnClassName} editable={false} dataField="button" dataFormat={this.updateButtonFormatter.bind(this)}>Update</TableHeaderColumn>
                    <TableHeaderColumn width ={deleteButtonWidth} className= {className} columnClassName= {columnClassName} editable={false} dataField="button" dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
                </BootstrapTable>
                <div>
                    {this.addLinkButton.call(this)}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}
                >
                    <div>
                        <LinkModal state={this.props.state} callbackParent={this.callbackParent.bind(this)} partnerId={this.props.partnerId} closeModalCallback={this.handleCloseModal.bind(this)}/>
                    </div>
                </ReactModal>
            </div>
        );
    }
}