var React   = require('react'),
    Message = require('./message'),
    _       = require('underscore');

var ViewAllMessages = React.createClass({
  render: function() {
        messageRows = [];
    console.log(this.props.messages);
    for (var i = 0; i < this.props.messages.length; i++) {
      var message = this.props.messages[i];
      if (message.parent === 'main') {
        var commentRows = [];
        messageRows.push(
          <Message
            id={this.props.id}
            favorites={this.props.favorites}
            author={message.uid}
            user={this.props.user}
            message={message.text}
            comments={message.comments}
            votes={message.votes}
            messageID={message.id}
            messages={this.props.messages}
            hairID={this.props.hairID}
            baseID={this.props.baseID}
            updateMessages={this.props.updateMessages}
            updateFavorites={this.props.updateFavorites}
            timestamp={message.timestamp} />
        )
      }
    }

    messageRowsSortedBy = {
      'recent': messageRows.slice().sort(function (a, b) {
        return new Date(b.props.timestamp) - new Date(a.props.timestamp);
      }),

      'favorite': _.filter(messageRows.slice(), function (item) {
        if (_.contains(item.props.favorites, item.props.messageID)) {
          return true;
        }
      }).sort(function (a, b) {
        return new Date(b.props.timestamp) - new Date(a.props.timestamp);
      }),

      'mine': _.filter(messageRows.slice(), function (item) {
        if (item.props.user === item.props.author) {
          return true;
        }
      }).sort(function (a, b) {
        return new Date(b.props.timestamp) - new Date(a.props.timestamp);
      }),

      'popular': messageRows.slice().sort(function (a, b) {
        return b.props.votes - a.props.votes;
      })
    };

    return (
      <div style={ this.styles.messageRows }>
        { messageRowsSortedBy[this.props.sortBy] }
      </div>
    )
  },

  styles: {
    messageRows: {
      padding: '10px',
    },
  }
});

module.exports = ViewAllMessages;
