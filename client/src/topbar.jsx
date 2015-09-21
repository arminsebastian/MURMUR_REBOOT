var React = require('react');
var Modal = require('react-modal');

Modal.setAppElement(document.body);


TopBar = React.createClass({
  getInitialState: function(){
    return {
      modalIsOn : this.props.modalIsOn
    }
  },

  turnModal: function(){
    console.log('ONNNNNN')
    var current = this.state.modalIsOn;
    this.props.modalCallback(!current);
    this.setState( { modalIsOn : !current } );
  },

  // closeModal: function() {
  //   this.props.modalCallback(false);
  //   this.setState( { modalIsOn : false } );
  // },

  render: function() {
    return (
      <div className="navbar navbar-default navbar-fixed-top" style={{'backgroundColor': 'rgb(5,101,188)'}}>
        <div className="container">
          <div className="navbar-header" style={{'float': 'left', 'padding': '15px', 'textAlign': 'center', 'width': '100%' }}>
            <a href="" className="navbar-brand" style={{'fontFamily': 'Sarina', 'color': 'white',  'margin': 'auto' }}>Murmur</a>
            <div>
              <a className='navbar-brand' style={{ 'color': 'white', 'float': 'right' }} onClick={this.turnModal}>sign in as mod</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
});




module.exports = TopBar;
