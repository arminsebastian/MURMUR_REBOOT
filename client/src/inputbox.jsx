var React = require('react');
// var url = 'http://0.0.0.0:3000/';

var InputBox = React.createClass({
  getInitialState: function() {
    return {
      message: ''
      // roomname: this.props.params.roomname
    };
  },
  // Update message value whenever user changes the message in the input box
  handleChange: function(event){
    if(event.target.value.length <= 150) { // Message cannot be longer than 150 characters
      this.setState({
        'message': event.target.value
      });
    }
  },

  enterPressed: function(event) {
    if (event.keyCode === 13) {
      this.handleClick(event);
    }
  },

  // Post a message when "Submit" button is clicked
  handleClick: function(event){
    console.log('uid:', this.props.uid)
    var context = this;
    event.preventDefault();
    $.ajax({ // Post message
      type: 'POST',
      url: '/',
      contentType: 'application/json',
      data: JSON.stringify({
        message: this.state.message,
        token: window.localStorage['murmur.' + this.props.id],
        id: this.props.id,
        parent: 'main' 
      }),
      success: function(data){
        console.log('server response: ', data);
        if (data.success) {
          context.props.messages.push(data.message);
          context.props.update(context.props.messages);
        }
      }
    });
    this.setState({message: ''}); // Clear input box
    console.log(this.state);
  },
  // two-way binding inputbox's value and this.state.message
  render: function() {
    return (
      <div className="input-group" style = {{padding: '15px'}}>
        <input value={this.state.message} onChange={this.handleChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="What's on your mind?" />
        <span className="input-group-btn">
          <button onClick={this.handleClick} className="btn btn-success" type="button"> Submit </button>
        </span>
      </div>
    )
  }
});

module.exports = InputBox;
