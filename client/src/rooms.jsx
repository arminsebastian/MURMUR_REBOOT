var React = require('react');

var Room = require('./room');

var Rooms = React.createClass({

  render: function() {
    var links = [];

    for (var i = 0; i < this.props.rooms.length; i++) {
      var room = this.props.rooms[i];
      links.push(
        < Room
          name={room.name}
          goTo={this.props.goTo}
          id={room.id} />
        )
    }

    return (
      <div>
        { links }
      </div>
    )
  }
});

module.exports = Rooms;