var mongoose  = require('mongoose');

var MessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  timestamp: {
    type: Object,
    required: true
  },
  votes: {
    type: Number
  },
  uid: {
    type: String,
    required: true
  },
  parent: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('messages', MessageSchema);