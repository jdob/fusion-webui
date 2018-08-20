import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ReactModal from 'react-modal';
import TodoModal from './TodoModal.js';
import SvgIcon from 'react-icons-kit';
import {bin} from 'react-icons-kit/icomoon/bin';
import {pencil} from 'react-icons-kit/icomoon/pencil';

export default class Todos extends React.Component {
    constructor(props) {
        super(props);
        this.changes = {};
        this.previousId = undefined;
        this.nameClass = undefined;
        this.state = {
            tasks : this.props.tasks.filter(function(task){
                return task.completed === 0;
            }),
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

    //Sends a backend request to delete todo
    //Actually archives it by setting completed value to 2
    onDeleteClick(cell, row){
        this.changes['completed'] = 2;
        this.updateCheckbox(cell,row);
    }

    //for future changes
    //store changes on tab
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
    
    //Sets state of checkbox to either 1 (completed) or 2 (archived)
    updateCheckbox(cell, row) {
        var self = this;
        var taskId = parseInt(row.id,10);
        var requestString = window.App.urlConstants.serviceHost + 
                            window.App.urlConstants.partnersUrl+
                            this.props.partnerId+'/tasks/'+taskId+'/';
        var request = new Request(requestString);
        var tokenString = 'Token ' + localStorage.getItem('authToken');
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
            var todos = self.state.tasks.filter(function(task){
                return task.id !== row.id;
            });
            self.setState({tasks:todos});
            if(self.props.callbackParent !== undefined)
            {
                self.props.callbackParent(self.state.tasks);
            }
        });
    }

    //Edit/Add View of todo
    afterUpdate() {
        this.handleOpenModal();
    }       

    //Edit View
    onUpdateClick(cell,row) {
        var data = this.state.tasks.filter(function(item){
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

    //Call Parent after todo changes
    afterNewUpdate() {
        this.props.callbackParent(this.state.tasks);
    }

    //Adds/Edits todo and calls function on parent
    callbackParent(newTask, taskId){
        var tasks = [];
        if(taskId !== undefined)
        {
            this.state.tasks.forEach(element => {
                if(element.id === taskId){
                    for(var prop in newTask)
                    {
                        element[prop] = newTask[prop];
                    }
                }
                tasks.push(element);
            });
            this.setState({tasks:tasks}, this.afterNewUpdate.bind(this));
        }
        else
        {
            this.setState(prevState => ({
                tasks: prevState.tasks.concat(newTask),
            }));
            this.props.callbackParent(this.state.tasks);
        }
    }

    //Add Todo view
    newTask() {
        var self = this;
        self.setState({ dataForModal: {}, title: "Add Task"}, 
                            self.afterUpdate.bind(self));
    }

    //Add contact only available if logged in
    addTaskButton() {
        var taskButton;
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') !== 'true') {
                taskButton = <Row className="add-contact-button">
                                <Col xs={12} md={12} lg={12}>
                                    <form>
                                        <div className="form-group">
                                            <button disabled={this.props.state} 
                                                onClick={this.newTask.bind(this)} 
                                                type="button" className="btn btn-primary">
                                                Add Task
                                            </button>
                                        </div>
                                    </form>
                                </Col> 
                            </Row>
        }
        return taskButton;
    }

    //marks todo as completed
    checkBoxClick(cell,row) {
        this.changes['completed'] = 1;
        this.updateCheckbox(cell,row);
    }

    //checkbox html
    checkBoxFormater(cell, row) {
        return (
            <div className="form-check">
                <input className="form-check-input" type="checkbox" 
                    value="" id={row.id}
                    onClick={() => 
                        this.checkBoxClick(cell, row)} />
            </div>
        )
    }

    render(){
        var className;
        var columnClassName;
        var deleteButtonWidth = '30px';
        var updateButtonWidth = '30px';
        var checkboxWidth = '30px';
        if(localStorage.getItem('isReadOnly') !== null && 
            localStorage.getItem('isReadOnly') === 'true'){
            className = 'hidden';
            columnClassName = 'hidden';
            deleteButtonWidth = '0.25px';
            updateButtonWidth = '0.25px';
            checkboxWidth = '0.25px';
        }
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12}><div className="detail-header">To Do</div></Col>
                </Row>
                <BootstrapTable data={ this.state.tasks } bordered={true} 
                    containerStyle={{width:"100%"}}>
                    <TableHeaderColumn hidden={true} dataField="id" isKey>Id</TableHeaderColumn>
                    <TableHeaderColumn width= {checkboxWidth}
                        dataField="completed"
                        dataFormat={this.checkBoxFormater.bind(this)}>Completed</TableHeaderColumn>
                    <TableHeaderColumn width ="125px" 
                        className={this.nameClass} 
                        columnClassName = {this.nameClass} 
                        editable={!this.props.state} dataField="text">Text</TableHeaderColumn>
                    <TableHeaderColumn width ={updateButtonWidth} 
                        className= {className} columnClassName= {columnClassName} 
                        editable={false} dataField="button" 
                        dataFormat={this.updateButtonFormatter.bind(this)}>Edit</TableHeaderColumn>
                    <TableHeaderColumn width ={deleteButtonWidth} 
                        className= {className} columnClassName= {columnClassName} 
                        editable={false} dataField="button" 
                        dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
                </BootstrapTable>
                <div>
                    {this.addTaskButton.call(this)}
                </div>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Red Hat tracking partners"
                    onRequestClose={this.handleCloseModal}
                >
                    <div>
                        <TodoModal state={this.props.state} 
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