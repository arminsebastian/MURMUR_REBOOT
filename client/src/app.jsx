var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var RouteHandler =  ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var ViewAllMessages = require('./viewAllMessages');
var TopBar = require('./topbar');
var InputBox = require('./inputbox');
var Firebase = require('firebase');
var Home = require('./home');
var Modal = require('react-modal'),
    _ = require('underscore');


var refreshTime = 2000;

var App = React.createClass({
  render: function(){
    return (
      <div>
        <TopBar />
        <RouteHandler/>
      </div>
    );
  },

});

var mainView = React.createClass({
  mixins: [ReactRouter.Navigation],
  messages: [],
  getInitialState: function () {
    return {
      messages: [],
      sort: 'recent',
      id: this.props.params.id,
      uid: '',
      moderator: '',
      roomname: '',
      favorites: [],
      sortBy: window.localStorage['murmur.' + this.props.params.id + 'SORT'] || 'recent',
      baseID: 0,
      hairID: 0
    };
  },

  updateMessages: function (messages) {
    this.setState({ messages: messages });
  },

  updateFavorites: function (messageID) {
    var context = this;
    $.ajax({
      type: 'POST',
      url: '/favorites',
      contentType: 'application/json',
      data: JSON.stringify({
        token: window.localStorage['murmur.' + this.state.id],
        messageID: messageID
      }),
      success: function (data) {
        window.localStorage['murmur.' + context.state.id] = data.token
        context.setState({ favorites: data.favorites });
      }
    })
  },

  componentWillMount: function(){
    var id = this.state.id,
        context = this,
        token = window.localStorage['murmur.' + id];
    console.log('sending ajax');
    $.ajax({
      type: 'POST',
      url: '/checkroom',
      contentType: 'application/json',
      data: JSON.stringify({
        id: id,
        token: token
      }),
      success: function (data) {
        console.log('server response:', data);
        if (data.success) {
          console.log('token: ', token);
          if (!token) {
            window.localStorage['murmur.' + id] = data.token;
            token = data.token;
            console.log('in token: ', token);
            console.log('local: ', window.localStorage['murmur.' + id])
          }
          console.log(token);
          console.log('Connected to Database');
          context.setState({
            messages: data.messages,
            id: id,
            uid: data.uid,
            moderator: data.roomData.email,
            roomname: data.roomData.name,
            favorites: data.favorites,
            baseID: data.baseID,
            hairID: data.hairID
          })
        } else {
          console.log('room does not exist');
          context.transitionTo('index');
        }    
      }
    });
  },
    
  handleSortRecent: function(){
    window.localStorage['murmur.' + this.props.params.id + 'SORT'] = 'recent';
    window.location.reload();
    // this.setState({ sortBy: 'recent' })
  },
  handleSortPopular: function(){
    window.localStorage['murmur.' + this.props.params.id + 'SORT'] = 'popular';
    window.location.reload();
    // this.setState({ sortBy: 'popular' })
  },
  handleFavorites: function(){
    window.localStorage['murmur.' + this.props.params.id + 'SORT'] = 'favorite';
    window.location.reload();
    // this.setState({ sortBy: 'favorite' });
  },
  handleMyPosts: function(){
    window.localStorage['murmur.' + this.props.params.id + 'SORT'] = 'mine';
    window.location.reload();
    // this.setState({ sortBy: 'mine' });
  },
  toggleInputBox: function(){
    this.setState({ input: !this.state.input })
  },
  render: function(){
    return (
      <div>
        <div>
          <div style={this.styles.filter}>
            <div className="btn-group" style={{display: 'inline-block'}}>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={this.handleSortRecent}> New </button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={this.handleSortPopular}> Hot </button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={this.handleFavorites}>Favorites</button>
              <button className="btn btn-default" style={{fontFamily: 'Roboto'}} onClick={this.handleMyPosts}>My Posts</button>
            </div>
            <InputBox id={this.state.id} messages={this.state.messages} update={this.updateMessages}  />
          </div>
          <ViewAllMessages sortBy={this.state.sortBy} baseID={this.state.baseID} hairID={this.state.hairID} messages={this.state.messages} id={this.state.id} favorites={this.state.favorites} updateFavorites={this.updateFavorites} updateMessages={this.updateMessages} />
        </div>
      </div>
    )
  },
  styles: {
    filter: {
      paddingTop: '80px',
      width: '100%',
      textAlign: 'center'
    },
    inputBox: {
      marginTop: '200px'
    }
  }
})

// React.render()

var routes = (
  React.createElement(Route, {name: 'app', path : '/', handler: App},
    React.createElement(DefaultRoute, {name: "index", handler: Home}),
    React.createElement(Route, {name: "room", path: "r/:id", handler: mainView})
  )
);

ReactRouter.run(routes, function (Handler) {
  React.render(<Handler/>, document.querySelector('.container'))
})

// var element = React.createElement(mainView);
// React.render(element, document.querySelector('.container'));
