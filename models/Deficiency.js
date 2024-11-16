// models/Deficiency.js
const mongoose = require('mongoose');
const deficiencySchema = new mongoose.Schema({
  title: String,
  description: String,
  severity: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Deficiency', deficiencySchema);