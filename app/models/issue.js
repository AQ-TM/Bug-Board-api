const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  summary: {
    type: String
  },
  identifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identifiedDate: {
    type: Date,
    default: Date.now
  },
  targetResolutionDate: {
    type: Date,
    required: true
  },
  resolutionSummary: {
    type: String
  },
  lastModifiedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  }
})

module.exports = issueSchema