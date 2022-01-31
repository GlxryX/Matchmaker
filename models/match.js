const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  AuthorID: { type: String },
  MatchID: { type: String },
});

module.exports = mongoose.model('matcher', Schema);