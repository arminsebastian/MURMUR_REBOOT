var React = require('react');
var moment = require('moment');
var Face = require('./face');

// var url = 'http://0.0.0.0:3000/';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      commentBox: 'false',
      votes: this.props.votes
    }
  },
 // Post upvote data to Server
  upVote: function () {
    console.log('up')
    this.vote(1);
  },

  // Post downvote data to Server
  downVote: function () {
    this.vote(-1);
  },

  vote: function (alter) {
    $.ajax({
      type: 'POST',
      url: '/vote' ,
      contentType: 'application/json',
      data: JSON.stringify({
        messageID: this.props.messageID,
        alter: alter
      })
    });
    var votes = this.state.votes;
    console.log(votes)
    this.setState({ votes: votes + alter });
  },

  render: function() {
    return (
      <div id={this.props.messageID} key={this.props.messageID}>
        <div className="conatiner" style={{float: 'left', clear: 'both', marginBottom: '5px'}}>
          <div style={this.styles.commentContainer}>
            <span style={{float: "left"}}>
              <Face author={this.props.author} key={this.props.messageID}/>
            </span>
            <span style={{float: "left"}}>
              <p style={{fontFamily: 'Alegreya', color: 'black', fontSize: '1em'}}>
                {this.props.message}
              </p>
              <span style={{fontFamily: 'Alegreya', fontStyle: 'italic', fontSize: '.8em', float: "left"}}>
                ({moment(this.props.timestamp).fromNow()})
              </span>
            </span>
          </div>
        </div>
        <div style={this.styles.voteContainer}>
          <i className="glyphicon glyphicon-chevron-up" style={{color: "#0000FF"}} onClick={this.upVote}></i>
            <span className="count"  style={this.styles.voteCount}> {this.state.votes} </span>
          <i className="glyphicon glyphicon-chevron-down" style={{color: "#0000FF"}} onClick={this.downVote}></i>
        </div>
      </div>
    )
  },
  styles: {
    timestamp: {
      float: "left",
      marginLeft: '10px',
      position: 'relative',
      top: '1.5px'
    },
    votes: {
      float: "right",
      fontSize: "19px",
      textAlign: 'center'
    },
    voteContainer: {
      width: "20px",
      float: "right",
      position: 'relative',
      left: '-20px'
    },
    voteCount: {
      margin: 'auto',
      fontSize: '1em',
      fontFamily: 'Alegreya'
    },
    writeButton: {
      float: "left",
      position: "relative",
      top: "4px"
    },
    arrows: {
      float: "right"
    },
    iconStyle: {
      marginLeft: "10px",
      marginRight: "10px",
    }
  }
});
