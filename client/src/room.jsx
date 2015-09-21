var React = require('react'),
    ReactRouter = require('react-router');


var Room = React.createClass({

  handleClick: function () {
    this.props.goTo(this.props.id);
    console.log(this.props.id);
  },

  render: function () {
    return (
      <div>
        <a onClick={this.handleClick} >{ this.props.name }</a>
      </div>
    )
  }
});

module.exports = Room;
