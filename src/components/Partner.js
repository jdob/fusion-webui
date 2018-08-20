import React from 'react';
import ReactModal from 'react-modal';
import '../css/Image.css';
import withRouter from 'react-router-dom/withRouter';

//Modal background
ReactModal.defaultStyles.overlay.backgroundColor = 'gray';

class Partner extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  //Opens up the partner with the necessary id
  openPatner() {
    var url = '/partners/'+this.props.data.id;
    this.props.history.push({
      pathname:url,
      state:this.props.state
     });
  }

  render () {
    return (
      <div key={this.props.data.id} className="inline-divs">
        <img src={"data:image/jpg;base64," + this.props.data.logo}
             onClick={this.openPatner.bind(this)}
             id={this.props.data.id}
             alt="logo"
             className="partner-div" />
          <div className="partner-names">{this.props.data.name}</div>
      </div>
    );
  }
}
export default withRouter(Partner);