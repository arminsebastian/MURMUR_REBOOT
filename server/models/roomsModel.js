var mongoose  = require('mongoose');

var RoomSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  passcode: {
    type: String
  }
});

module.exports = mongoose.model('rooms', RoomSchema);