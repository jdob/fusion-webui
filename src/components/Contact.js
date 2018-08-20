import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../css/Contact.css';
import ContactModal from './ContactModal.js';
import ReactModal from 'react-modal';
import SvgIcon from 'react-icons-kit';
import {pencil} from 'react-icons-kit/icomoon/pencil';
import {bin} from 'react-icons-kit/icomoon/bin';

export default class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId = undefined;
        this.nameClass = undefined;
        this.state = {
            contacts : this.props.contacts,
            showModal: false,
            dataForModal:{},
            title:undefined
        };
        //For the magical edit on click functionality
        //we dont use it anymore, but might need it later
        this.cellEditProp = {
            mode: 'click',
            beforeSaveCell: this.onBeforeSaveCell.bind(this) // a hook for before saving cell
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    //Need to set  the App Element of ReactModal
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

    //Sends a backend request to delete /partnes/id/contacts/contact_id
    onDeleteClick(cell, row){
        var self = this;
        var contactId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/contacts/'+contactId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        //delete request to delete contacts with the partner_id
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': tokenString
            },
            //the data being sent
            body: JSON.stringify({
                'contactId': contactId,
            })
        }).then(function(response){
            //we get the response text only like this
            response.text().then(function() {
                //appending new contact to the ui
                var newContacts = self.state.contacts.filter(function( obj ) {
                    return obj.id !== parseInt(contactId, 10);
                });
                self.setState(prevState => ({
                    contacts: newContacts,
                }));
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.state.contacts)
                } 
            });
        });
    }

    //Another futuristic function
    //If you want to save on tab at each cell
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
        if(cellName === 'name')
        {
            this.nameClass = 'active';
        }
    }
    
    //Called after data for modal is decided
    //Edit View/Add View
    afterUpdate() {
        this.handleOpenModal();
    }       

    //Opens the contact model that has to be edited on the modal
    onUpdateClick(cell,row) {
        var data = this.state.contacts.filter(function(item){
            return item.id === row.id;
        });
        var self = this;
        this.setState({ dataForModal: data[0], title: 'Edit Contact'}, 
                            self.afterUpdate.bind(self));
    }

    //for update button
    updateButtonFormatter(cell, row){
        return (
            <button disabled={this.props.state}
               onClick={() => 
               this.onUpdateClick(cell, row)}
            >
                <SvgIcon size={20} icon={pencil}/>
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
                <SvgIcon size={20} icon={bin}/>
            </button>
        )
    }

    //Called after contacts are updated
    afterNewUpdate() {
        this.props.callbackParent(this.state.contacts);
    }

    //Updating contacts
    callbackParent(newContact, contactId){
        var contacts = [];
        //Contact was updated
        if(contactId !== undefined)
        {
            this.state.contacts.forEach(element => {
                if(element.id === contactId){
                    for(var prop in newContact)
                    {
                        element[prop] = newContact[prop];
                    }
                }
                contacts.push(element);
            });
            this.setState({contacts:contacts}, this.afterNewUpdate.bind(this));
        }
        //New Contact has to be added
        else
        {
            this.setState(prevState => ({
                contacts: prevState.contacts.concat(newContact),
            }));
            this.props.callbackParent(this.state.contacts);
        }
    }

    //To handle the modal for add contact
    newContact() {
        var self = this;
        self.setState({ dataForModal: {}, title: 'Add Contact'}, 
                            self.afterUpdate.bind(self));
    }

    //Add contact only available if logged in
    addContactButton() {
        var contactButton;
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem("isReadOnly") !== "true") {
            contactButton = <Row className="add-contact-button">
                                <Col xs={12} md={12} lg={12}>
                                    <form>
                                        <div className="form-group">
                                            <button disabled={this.props.state} 
                                                onClick={this.newContact.bind(this)} 
                                                type="button" className="btn btn-primary">
                                                Add Contact
                                            </button>
                                        </div>
                                    </form>
                                </Col> 
                            </Row>
        }
        return contactButton;
    }

    render(){
        var className;
        var columnClassName;
        var width = '200px';
        var deleteButtonWidth = '30px';
        var updateButtonWidth = '30px';
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') === 'true'){
            className = 'hidden';
            columnClassName = 'hidden';
            width = '280px';
            deleteButtonWidth = '0.25px';
            updateButtonWidth = '0.25px';
        }
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}><div className="detail-header">Contacts</div></Col>
                </Row>
                <BootstrapTable data={ this.state.contacts } bordered={true} 
                    containerStyle={{width:"100%"}}>
                    <TableHeaderColumn hidden={true} dataField="id" isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn width ="125px" className={this.nameClass} 
                        columnClassName = {this.nameClass} 
                        editable={!this.props.state} dataField="name">Name</TableHeaderColumn>
                    <TableHeaderColumn width ={width} editable={!this.props.state} 
                        dataField="email">Email</TableHeaderColumn>
                    <TableHeaderColumn width ="125px" editable={!this.props.state} 
                        dataField="role">Role</TableHeaderColumn>
                    <TableHeaderColumn width ={updateButtonWidth} 
                        className= {className} columnClassName= {columnClassName} 
                        editable={false} dataField="button" 
                        dataFormat={this.updateButtonFormatter.bind(this)}>Edit</TableHeaderColumn>
                    <TableHeaderColumn width ={deleteButtonWidth} 
                        className= {className} columnClassName= {columnClassName} 
                        editable={false} dataField="button" 
                        dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
                    {/*<TableHeaderColumn width ={updateButtonWidth} className= {className} columnClassName= {columnClassName} editable={false} dataField="button" dataFormat={this.copyButtonFormatter.bind(this)}>Copy</TableHeaderColumn>*/}
                </BootstrapTable>
                <div>
                    {this.addContactButton.call(this)}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}
                >
                    <div>
                        <ContactModal state={this.props.state} 
                            callbackParent={this.callbackParent.bind(this)} 
                            partnerId={this.props.partnerId} 
                            closeModalCallback={this.handleCloseModal.bind(this)}
                            data={this.state.dataForModal}
                            title={this.state.title}/>
                    </div>
                </ReactModal>
            </div>
        );
    }
}