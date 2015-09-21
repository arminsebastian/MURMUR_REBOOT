var React = require('react');
// var url = 'http://0.0.0.0:3000/comment';

var commentBox = React.createClass({
  getInitialState: function() {
    return {
      comment: ''
    };
  },
  // Update message value whenever user changes the message in the comment box
  handleChange: function(event){
    if(event.target.value.length <= 150) { // Message cannot be longer than 150 characters
      console.log(this.props.token)
      this.setState({
        'comment': event.target.value,
      });
    }
  },
  // Post a message when "Submit" button is clicked
  handleClick: function(event){
    event.preventDefault();
    var context = this;
    $.ajax({
      type: 'POST',
      url: '/',
      contentType: 'application/json',
      data: JSON.stringify({
        id: this.props.id,
        message: this.state.comment,
        parent: this.props.messageID,
        token: window.localStorage['murmur.' + this.props.id],
      }),
      success: function(data){
        console.log('server response * * * : ', data);
        context.props.messages.push(data.messages);
        context.props.updateMessages(context.props.messages);
      }
    });
    this.setState({comment: ''}); // Clear comment box
  },

   enterPressed: function(event) {
    if(event.keyCode === 13) {
      this.handleClick(event);
    }
  },

  // two-way binding commentBox's value and this.state.comment
  render: function() {
    return (
        <div className="input-group" style = {{padding: '15px'}}>
          <input value={this.state.comment} onChange={this.handleChange} onKeyDown={this.enterPressed} type="text" className="form-control" placeholder="Enter your comment here."/>
          <span className="input-group-btn">
            <button onClick={this.handleClick} className="btn btn-success" type="button"> Submit </button>
          </span>
        </div>
    )
  }
});

module.exports = commentBox;
