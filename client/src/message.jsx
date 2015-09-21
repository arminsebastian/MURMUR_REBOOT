var React = require('react');
var moment = require('moment');
var CommentBox = require('./commentBox');
var CommentMessage = require('./commentMessage');
var _ = require('underscore');

// var url = 'http://0.0.0.0:3000/';

var Message = React.createClass({

  getInitialState: function () {
    console.log(' * * * rendering * * * ', this.props.renderMe)
    return {
      commentsView: false,
      votes: 0,
      favorite: false
    };
  },

  componentWillMount: function () {
    this.setState({
      votes: this.props.votes
    })
    if (_.contains(this.props.favorites, this.props.messageID)) {
      this.setState({
        favorite: true
      });
    }
  },

  toggleCommentsView: function (){
    this.setState({ commentsView: !this.state.commentsView })
  },

  // Post upvote data to Server
  upVote: function (event){
    this.vote(event, 1);
  },

  // Post downvote data to Server
  downVote: function (event){
    this.vote(event, -1);
  },

  vote: function (id, alter) {
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
    this.setState({ votes: votes + alter });
  },

  toggleFavorite: function (event){
    this.props.updateFavorites(this.props.messageID);
    this.setState({ favorite: !this.state.favorite });
  },

  componentDidMount: function () {
  },

  render: function() {
    var commentRows = [];
    console.log('MESSAGE PROPS * * * : ', this.props)
    for (var i = 0; i < this.props.messages.length; i++){
      var comment = this.props.messages[i];
      if (comment.parent === this.props.messageID) {
        commentRows.push(
          <CommentMessage
            id={this.props.id}
            author={comment.uid}
            messageID={this.props.messageID}
            commentID={comment.id}
            message={comment.text}
            baseID={this.props.baseID}
            hairID={this.props.hairID}
            votes={comment.votes}
            timestamp={comment.timestamp} />
        );
      }
    }
    commentRows = commentRows.reverse();
  // var commentRowsSortedOptions = {
  //   recent: commentRows.slice().sort(function(a,b){
  //     return new Date(b.props.timestamp) - new Date(a.props.timestamp);
  //   }),
  //   popular: commentRows.slice().sort(function(a,b){
  //     return b.props.votes - a.props.votes;
  //   })
  // }

    var commentNumber = commentRows.length;

    var styleFavorites =
      // check if the 'uid' favorited the message
      this.state.favorite ?
        {
          float: 'left',
          marginRight: '10px',
          fontSize: '1.85em',
          color: '#F12938' // red if favorited
        }
        :
        {
          float: 'left',
          marginRight: '10px',
          fontSize: '1.85em',
          color: '#a8aeb8', // if NOT favorited
          borderColor: 'green'
        };

      return (
        <div className="jumbotron" id={ this.props.messageId } style={{ borderRadius: '40px', paddingLeft: '0', paddingRight: '0', paddingTop: '15px', paddingBottom: '7px', backgroundColor: '#ECF0F5'}} >
          <div className="container">
            <div className="col-xs-10" style={{ marginBottom: '20px', paddingLeft:'10px', marginBottom: '0'}}>
              <p style={{fontFamily: 'Alegreya', color: 'chocolate', marginLeft: "10px", marginBottom: '0'}}>
                { this.props.message }
              </p>
            </div>
            <div className="votes col-xs-2" style={ this.styles.votes }>
              <div style={ this.styles.voteContainer }>
                <i className="glyphicon glyphicon-chevron-up" style={{color: "#0000FF"}} onClick={ this.upVote }></i>
                <span className="count" style={{fontFamily: 'Alegreya'}}> { this.state.votes } </span>
                <i className="glyphicon glyphicon-chevron-down" style={{color: "#0000FF"}} onClick={ this.downVote }></i>
              </div>
            </div>

            <div className="col-xs-12" style={{paddingLeft:'10px'}}>
              <div className="col-xs-1" style = { styleFavorites }>
                <span style={ {float: "left"} } onClick={ this.toggleFavorite }>
                  <i className="glyphicon glyphicon-heart"></i>
                </span>
              </div>
              <div className="col-xs-2" style={ this.styles.timestamp }>
                <i className="glyphicon glyphicon-time" style={ this.styles.iconStyle }></i>
                <span style={{fontFamily:"Alegreya", fontStyle: "italic", fontSize: '.8em', position: 'relative', top: '-7px'}}>
                  { moment(this.props.timestamp).fromNow() }
                </span>
              </div>
              <div style={ this.styles.comments }>
                <div className="commentViewToggle" onClick={ this.toggleCommentsView }>
                  <i className="glyphicon glyphicon-comment" style={ this.styles.iconStyle }></i>
                  <span style={{fontStyle: "italic", fontSize: '.8em'}}>
                    <span style={{fontFamily:"Alegreya", fontWeight: 'bold', color: 'blue', fontSize: '1.1em', position: 'relative', top: '-7px'}}> { this.state.commentsView ? 'hide ' : 'show ' } </span>
                    <span style={{fontFamily:"Alegreya", position: 'relative', top: '-7px'}}> { commentNumber + ' comments'} </span>
                  </span>
                </div>
              </div>
            </div>

            <div style={ this.state.commentsView ? this.styles.commentsView : this.styles.hidden } >
              <CommentBox id={this.props.id} messageID={this.props.messageID} updateMessages={this.props.updateMessages} messages={this.props.messages} />
              { commentRows }
            </div>

          </div>
        </div>
      )
    },

    styles: {
      timestamp: {
        float: "left"
      },
      comments: {
        float: "left"
      },
      votes: {
        fontSize: "19px",
        textAlign: 'center'
      },
      commentButton: {
        position: "relative",
        top: "-3px"
      },
      voteContainer: {
        width: "20px",
        float: "right"
      },
      iconStyle: {
        marginLeft: "20px",
        marginRight: "10px",
        fontSize: '1.85em',
        color: '#a8aeb8'
      },
      commentsView: {
        display: "block",
      },
      hidden: {
        display: "none",
      }
    }
});

module.exports = Message;
