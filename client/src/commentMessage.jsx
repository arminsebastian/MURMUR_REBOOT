var React = require('react');
var moment = require('moment');
var Face = require('./face');

// var url = 'http://0.0.0.0:3000/';

module.exports = React.createClass({
  getInitialState: function() {
    console.log('Comment Message PROPS * * * : ', this.props)
    var author = this.props.author,
        indexOfDash = this.props.author.indexOf('-');
    return {
      commentBox: 'false',
      hairID: author.slice(indexOfDash + 1),
      baseID: author.slice(0, indexOfDash)
    }
  },
  upVote: function(event){

    $.ajax({
      type: 'POST',
      url: 'voteComment' ,
      contentType: 'application/json',
      data: JSON.stringify({
        id: this.props.id,
        messageID: this.props.messageID,
        commentID: this.props.commentID,
        votes: true,
        token: this.props.token,
      }),
      success: function(){
      }
    })
  },
  downVote: function(event){

    $.ajax({
      type: 'POST',
      url: 'voteComment' ,
      contentType: 'application/json',
      data: JSON.stringify({
        id: this.props.id,
        messageID: this.props.messageId,
        commentID: this.props.commentId,
        votes: false,
        token: this.props.token,
      }),
      success: function(){
      }
    })
  },
  render: function() {
    return (
      <div id={this.props.commentID} key={this.props.commentID}>
        <div className="conatiner" style={{float: 'left', clear: 'both', marginBottom: '5px'}}>
          <div style={this.styles.commentContainer}>
            <span style={{float: "left"}}>
              <Face baseID={this.props.baseID} hairID={this.state.hairID} key={this.state.commentID}/>
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
            <span className="count"  style={this.styles.voteCount}> {this.props.votes} </span>
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
