import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../css/Contact.css';
import ReactModal from 'react-modal';
import LinkModal from './LinkModal.js';
import {pencil} from 'react-icons-kit/icomoon/pencil';
import {bin} from 'react-icons-kit/icomoon/bin';
import SvgIcon from 'react-icons-kit';

export default class Links extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId = undefined;
        this.state = {
            links : this.props.links,
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

    //Set ReactModal AppElement
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

    //Sends a backend request to delete /partners/id/links/link_id
    onDeleteClick(cell, row){
        var self = this;
        var linkId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/links/'+linkId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'AUthorization': tokenString
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
                //Set state to reload view
                self.setState(prevState => ({
                    links: newLinks,
                }));
                //Callback parent for any changes
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.state.links)
                } 
            });
        });
    }

    //For updates on tab
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

    //For opening modal after deciding what kind of modal to open
    //Edit View/Add View
    afterUpdate() {
        this.handleOpenModal();
    }       

    //Decide model for the modal
    onUpdateClick(cell,row) {
        var data = this.state.links.filter(function(item){
            return item.id === row.id;
        });
        var self = this;
        this.setState({ dataForModal: data[0], title: 'Edit Link'}, 
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

    //Callback parent after change of links
    afterNewUpdate() {
        this.props.callbackParent(this.state.links);
    }

    //Calls back parent after changes
    callbackParent(newLink, linkId){
        var links = [];
        //Link was updated
        if(linkId !== undefined)
        {
            this.state.links.forEach(element => {
                if(element.id === linkId){
                    for(var prop in newLink)
                    {
                        element[prop] = newLink[prop];
                    }
                }
                links.push(element);
            });
            this.setState({links:links}, this.afterNewUpdate.bind(this));
        }
        //link was added
        else
        {
            this.setState(prevState => ({
                links: prevState.links.concat(newLink),
            }));
            this.props.callbackParent(this.state.links);
        }
    }

    //Add View
    newLink() {
        var self = this;
        self.setState({ dataForModal: {}, title: 'Add Link'}, 
                            self.afterUpdate.bind(self));
    }

    //Add link only available if logged in
    addLinkButton() {
        var linkButton;
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem("isReadOnly") !== "true") {
            linkButton = <Row className="add-links-button">
                            <Col xs={12} md={12} lg={12}>
                                <form>
                                    <div className="form-group">
                                        <button disabled={this.props.state}
                                                onClick={this.newLink.bind(this)}
                                                type="button"
                                                className="btn btn-primary">
                                            Add Links
                                        </button>
                                    </div>
                                </form>
                            </Col> 
                        </Row>
        }
        return linkButton;
    }

    render(){
        var className;
        var columnClassName;
        var width = '170px';
        var deleteButtonWidth = '30px';
        var updateButtonWidth = '30px';
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') === 'true'){
            className = 'hidden';
            columnClassName = 'hidden';
            width = '270px';
            deleteButtonWidth = '0.25px';
            updateButtonWidth = '0.25px';
        }
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}><div className="detail-header">Links</div></Col>
                </Row>
                <BootstrapTable data={ this.state.links }
                                bordered={true}
                                containerStyle={{width:"100%"}}>
                    <TableHeaderColumn hidden={true}
                                       dataField="id"
                                       isKey>
                        Id
                    </TableHeaderColumn>
                    <TableHeaderColumn width="125px"
                                       editable={!this.props.state}
                                       dataField="name">
                        Name
                    </TableHeaderColumn>
                    <TableHeaderColumn width="200px"
                                       editable={!this.props.state}
                                       dataField="url">
                        URL
                    </TableHeaderColumn>
                    <TableHeaderColumn width={width}
                                       editable={!this.props.state}
                                       dataField="description">
                        Description
                    </TableHeaderColumn>
                    <TableHeaderColumn width={updateButtonWidth}
                                       className={className}
                                       columnClassName={columnClassName}
                                       editable={false}
                                       dataField="button"
                                       dataFormat={this.updateButtonFormatter.bind(this)}>
                        Edit
                    </TableHeaderColumn>
                    <TableHeaderColumn width={deleteButtonWidth}
                                       className={className}
                                       columnClassName={columnClassName}
                                       editable={false}
                                       dataField="button"
                                       dataFormat={this.deleteButtonFormatter.bind(this)}>
                        Delete
                    </TableHeaderColumn>
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
                        <LinkModal state={this.props.state}
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