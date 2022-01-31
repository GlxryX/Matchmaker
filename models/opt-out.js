const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  UserID: { type: String },
});

module.exports = mongoose.model('opt-out', Schema);