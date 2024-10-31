const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const eventShema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  votes: Number,
  name: String,
  place: String,
  category: String,
  img: String,
  author: String,
  verified: Boolean
});

// Export the Calandar model
module.exports = mongoose.model('Event', eventShema);

