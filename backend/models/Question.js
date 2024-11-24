const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: String,
  problems: [{
    id: Number,
    title: String,
    difficulty: String,
    description: String,
    examples: [String]
  }]
});

module.exports = mongoose.model('Question', questionSchema); 