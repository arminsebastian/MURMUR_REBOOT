 var Q  = require('q'),
    jwt   = require('jwt-simple'),
    Moderator = require('./models/moderatorsModel'),
    Room = require('./models/roomsModel'),
    Message = require('./models/messagesModel'),
    sendMail = require('./email-api'),
    _ = require('underscore');

var findModerator = Q.nbind(Moderator.findOne, Moderator),
    retrieveMessages = Q.nbind(Message.find, Message);

var createRandomID = function (length) {
  var characters = 'abcdefghijklmnopqrstuvwxyz1234567890',
      id = '';
  for (var i = 0; i < length; i++) {
    id += characters[Math.floor(Math.random() * 36)];
  }
  return id;
};

var controllers = {

  signin: function (req, res) {
    var email = req.body.email,
        password = req.body.password;

    findModerator({email: email})
      .then(function (user) {
        if (!user) {
          res.json({ signedIn: false });
          console.log('* * * moderator not found')
        } else {
          if (password === user.password) {
            res.json({ signedIn: true });
          } else {
            console.log('* * * password incorrect');
            res.json({ signedIn: false })
          }
        }
      })
  },

  verify: function(req, res){
    var email  = req.body.email,
        password  = req.body.password;
    console.log('verify is running');

    var url = jwt.encode({
      email: email,
      password: password
    }, 'secret')

    findModerator({ email: email })
      .then(function(user) {
        if (user) {
          res.json({ emailSent: false });
          console.log('* * * email already registered')
        } else {
          console.log('data * * * : ', email, url)
          sendMail.sendgrid(email, url);
          res.json({ emailSent: true });
        }
      })
  },

  signup: function (req, res) {
    var moderator = jwt.decode(req.url.slice(3), 'secret');

    console.log('moderator data recieved: ', moderator);
    var email  = moderator.email,
        password  = moderator.password,
        create,
        newUser;

    findModerator({email: email})
      .then(function(user) {
        if (user) {
          console.log('* * * email already registered')
          } else {
            newUser = {
              email: email,
              password: password
            };
            console.log('creating new moderator * * * : ', newUser);
            Moderator.create(newUser);
        }
      })
  },

  createRoom: function (req, res) {
    var email = req.body.email,
        roomname = req.body.roomname,
        create,
        newRoom,
        id;

    console.log('data received from client * * * : ', req.body)
    var findRoom = Q.nbind(Room.findOne, Room);

    findRoom({
      email: email,
      name: roomname
    })
      .then(function (room) {
        if (!room) {
          id = createRandomID(8);
          newRoom = {
            email: email,
            name: roomname,
            id: id
          };
          console.log('creating new room * * * :', newRoom);
          Room.create(newRoom);
          res.json({ success: true , id: id });
        } else {
          res.json({ success: false });
          console.log('* * * moderator already created room with this name');
        }
      })
  },

  checkRoomExists: function (req, res) {
    console.log('checking room');
    var id = req.body.id,
        token = req.body.token,
        uid,
        favorites;

    if (token) {
      var user = jwt.decode(token, 'secret');
      favorites = user.favorites;
      uid = user.id;
    }

    var findRoom = Q.nbind(Room.findOne, Room);

    findRoom({
      id: id
    })
      .then(function (room) {
        console.log('checkroom');
        if (!room) {
          res.json({ success: false });
        } else {
          if (!token) {
            console.log('no token');
            uid = Math.ceil(Math.random() * 18) + '-' + Math.ceil(Math.random() * 99);
            favorites = [];
            var user = {
              id: uid,
              favorites: []
            };
            token = jwt.encode(user, 'secret');
          }
          retrieveMessages({
            room: id
          })
            .then(function (messages) {
              console.log('in here too')
              res.json({ success: true, roomData: room, token: token, messages: messages, uid: uid, favorites: favorites });
            });
        }
      })
  },

  addMessage: function (req, res) {
    var id = req.body.id,
        message = req.body.message,
        parent = req.body.parent,
        uid = jwt.decode(req.body.token, 'secret').id;
    var messageID = createRandomID(5);
    var newMessage = {
      timestamp: new Date(),
      id: messageID,
      uid: uid,
      parent: parent,
      votes: 0,
      room: id,
      text: message
    };
    var createMessage = Q.nbind(Message.create, Message);
    createMessage(newMessage)
      .then(function (message) {
        if (message) {
          res.json({ success: true, message: newMessage });
        } else {
          res.json({ success: false });
        }
      });
  },

  updateFavorites: function (req, res) {
    var user = jwt.decode(req.body.token, 'secret');
    var favorites = user.favorites,
        uid = user.id,
        messageID = req.body.messageID;

    var index = _.indexOf(favorites, messageID);
    if (index === -1) {
      favorites.push(messageID);
    } else {
      favorites = _.filter(favorites, function (item) {
        if (item !== messageID) {
          return true;
        }
      });
    }
    var updatedUser = {
      favorites: favorites,
      id: uid
    };
    var token = jwt.encode(updatedUser, 'secret');
    res.json({ token: token , favorites: favorites });
  },

  vote: function (req, res) {
    var messageID = req.body.messageID,
        alter = req.body.alter,
        votes;

    console.log('vote data recieved from client * * * : ', req.body)

    // FOR some reason, this is not working:
    Message.update(
      { id: messageID },
      { $inc: { votes: alter } }
    );

    res.send(200);
    // TO check whether it is updating (it isn't):
    // var findOne = Q.nbind(Message.findOne, Message);
    // findOne({ id: messageID })
    //   .then(function (message) {
    //     console.log(message);
    //   });
  }
}




module.exports = controllers;
