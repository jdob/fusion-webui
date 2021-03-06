import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ReactModal from 'react-modal';
import CommentModal from './CommentModal.js';
import SvgIcon from 'react-icons-kit';
import {bin} from 'react-icons-kit/icomoon/bin';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments : this.props.comments,
            showModal: false
        };
        this.cellEditProp = {
            mode: 'click',
            beforeSaveCell: this.onBeforeSaveCell.bind(this), // a hook for before saving cell
            //afterSaveCell: this.onAfterSaveCell.bind(this)  // a hook for after saving cell
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

    //Sends a backend request to comment
    onDeleteClick(cell, row){
        var self = this;
        var commentId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/comments/'+commentId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        //delete request to delete comment with the partner_id
        fetch(request, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': tokenString
            },
            //the data being sent
            body: JSON.stringify({
                'commentId': commentId,
            })
        }).then(function(response){
            //we get the response text only like this
            response.text().then(function() {
                //appending new comment to the ui
                var newComments = self.state.comments.filter(function( obj ) {
                    return obj.id !== parseInt(commentId, 10);
                });
                self.setState(prevState => ({
                    comments: newComments,
                }));
                if(self.props.callbackParent !== undefined)
                {
                    self.props.callbackParent(self.state.comments)
                } 
            });
        });
    }

    //Update the comment    
    onBeforeSaveCell(row, cellName, cellValue) {
        var self = this;
        var commentId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            self.props.partnerId+'/comments/'+commentId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
        if (cellValue.trim() !== "" && row[cellName] !== cellValue)
        {
            //post request to post the new comment with the partner_id
            fetch(request, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': tokenString
                },
                //the data being sent
                body: JSON.stringify({
                    'text': cellValue
                })
            }).then(function(response){
                //we get the response text only like this
                response.text().then(function(responseText) {
                    //appending new comment to the ui
                        for(let i=0; i<self.state.comments.length; i++)
                        {
                            if(self.state.comments[i].id === parseInt(row.id,10))
                            {
                                self.state.comments[i].text = cellValue;
                            }
                        }
                    if(self.props.callbackParent !== undefined)
                    {
                        self.props.callbackParent(self.state.comments);
                    }
                });
            });
        }    
    }

    //for delete button
    deleteButtonFormatter(cell, row){
        return (
            <button disabled={this.props.state} 
                className='delete-button' onClick={() => 
                this.onDeleteClick(cell, row)}
            >
                <SvgIcon size={20} icon={bin}/>
            </button>
        )
    }

    //Call the parent after comments change
    callbackParent(newComment){
        if(newComment !== 'undefined')
        {
            this.setState(prevState => ({
                comments: prevState.comments.concat(newComment),
            }));
            this.props.callbackParent(this.state.comments);
        }
    }

    //Add comment only available if logged in
    addCommentButton() {
        var commentButton;
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') !== 'true') {
            commentButton = <Row className="add-comment">
                                <Col xs={12} md={12} lg={12}>
                                    <form>
                                        <div className="form-group">
                                            <button disabled={this.props.state} onClick={this.handleOpenModal} type="button" className="btn btn-primary">Add Comment</button>
                                        </div>
                                    </form>
                                </Col> 
                            </Row>
        }
        return commentButton;
    }

    render(){
        var className;
        var columnClassName;
        var width = '500px';
        var deleteButtonWidth = '30px';
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') === 'true'){
            className = 'hidden';
            columnClassName = 'hidden';
            width = '530px';
            deleteButtonWidth = '0.5px';
        }
        return (
            <div>
                <Row>
                        <Col xs={12} md={12} lg={12}><div className="detail-header">Comments</div></Col>
                </Row>
                <BootstrapTable data={ this.state.comments }
                    bordered={true} cellEdit={ this.cellEditProp } 
                    containerStyle={{width:"100%"}}>
                    <TableHeaderColumn hidden={true} dataField="id" isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn width={width} editable={!this.props.state}
                        dataField="text">Text</TableHeaderColumn>
                    <TableHeaderColumn width= {deleteButtonWidth} 
                        className={className} columnClassName={columnClassName} 
                        editable={false} dataField="button" 
                        dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
                </BootstrapTable>
                <div>
                    {this.addCommentButton.call(this)}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}
                >
                    <div>
                        <CommentModal state={this.props.state} 
                            callbackParent={this.callbackParent.bind(this)} 
                            partnerId={this.props.partnerId} 
                            closeModalCallback={this.handleCloseModal.bind(this)}/>
                    </div>
                </ReactModal>
            </div>
        );
    }
}