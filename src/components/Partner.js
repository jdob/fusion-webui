import React from 'react';
import ReactModal from 'react-modal';
import ModalLeftSide from './ModalLeftSide.js';
import ModalRightSide from './ModalRightSide.js';
import '../css/Image.css';
import withRouter from 'react-router-dom/withRouter';

//rename it as partner.js
ReactModal.defaultStyles.overlay.backgroundColor = 'gray';

class Partner extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  
  //opens modal
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  //closes modal
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  openPatner() {
    var url = "/partners/"+this.props.data.id;
    this.props.history.push({
      pathname:url,
      state:this.props.state
     });
  }

  contactsChange(newContacts) {
    this.props.data.contacts = newContacts;
  }

  //ReactModal in use
  //You can edit anything inside the <ReactModal> tag for 
  //the required html
  render () {
    return (
      <div key={this.props.data.id} className="inline-divs">
        <img src={"data:image/jpg;base64," + this.props.data.logo}
             onClick={this.openPatner.bind(this)}
             id={this.props.data.id}
             alt="logo"
             className="partner-div" />
          {/*<ReactModal
            isOpen={this.state.showModal}
            contentLabel="Red Hat tracking partners"
            onRequestClose={this.handleCloseModal}
          >
            <span className="modal-left-side">
              <ModalLeftSide state={this.props.state} data={this.props.data}/>
            </span>
            <span className="modal-right-side">
              <ModalRightSide state={this.props.state} data={this.props.data}/>
            </span>
          </ReactModal>*/}
          <div className="partner-names"><h5>{this.props.data.name}</h5></div>
      </div>
    );
  }
}
export default withRouter(Partner);