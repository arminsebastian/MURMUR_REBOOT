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
        password = req.body.password,
        findRooms = Q.nbind(Room.find, Room);

    findModerator({email: email})
      .then(function (user) {
        if (!user) {
          res.json({ signedIn: false });
          console.log('* * * moderator not found')
        } else {
          console.log(email, password, user)
          if (password === user.password) {
            var token = jwt.encode({ password: password }, 'donkey');
            findRooms({ email: email })
              .then(function (rooms) {
                rooms = _.map(rooms, function (room) {
                  return { name: room.name, id: room.id };
                });
                res.json({ signedIn: true, rooms: rooms, token: token });
              })
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
    console.log('verify is ran','email pass :', email, password);

    var url = jwt.encode({
      email: email,
      password: password
    }, 'donkey')

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
    console.log('path test:', req.url.path,'url to be decoded:', req.url.slice(3));
    var moderator = jwt.decode(req.url.slice(3), 'donkey');

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
            res.send('Good! Your user is know active. Go to: ' + 'www.murmur.com');
            //res.redirect();
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
      var user = jwt.decode(token, 'donkey');
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
            token = jwt.encode(user, 'donkey');
          }
          retrieveMessages({
            room: id
          })
            .then(function (messages) {
              res.json({ success: true, roomData: room, token: token, messages: messages, uid: uid, favorites: favorites });
            });
        }
      })
  },

  addMessage: function (req, res) {
    var id = req.body.id,
        message = req.body.message,
        parent = req.body.parent,
        uid = jwt.decode(req.body.token, 'donkey').id;
    var messageID = createRandomID(5);
    var newMessage = {
      timestamp: new Date(),
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
          res.json({ success: true, message: message });
        } else {
          res.json({ success: false });
        }
      });
  },

  updateFavorites: function (req, res) {
    var user = jwt.decode(req.body.token, 'donkey');
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
    var token = jwt.encode(updatedUser, 'donkey');
    res.json({ token: token , favorites: favorites });
  },

  vote: function (req, res) {
    var messageID = req.body.messageID,
        alter = req.body.alter,
        votes;

    console.log('vote data recieved from client * * * : ', req.body)

    // FOR some reason, this is not working:
    // Message.update(
    //   { id: messageID },
    //   { $inc: { votes: alter } }
    // );
    Message.findByIdAndUpdate(messageID , { $inc: { votes: alter } }, function(err, response) {
      res.send(response);
    });

    // TO check whether it is updating (it isn't):
    // var findOne = Q.nbind(Message.findOne, Message);
    // findOne({ id: messageID })
    //   .then(function (message) {
    //     console.log(message);
    //   });
  }
}




module.exports = controllers;
