const mongoose = require('mongoose');

const { Schema } = mongoose;


const CardSchema = new Schema({
  name: String,
  details: [],
  total:{ 
    type:Number,
    default:0
  }
});

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  cards: [CardSchema],
});

module.exports = mongoose.model('UserData', UserSchema);
