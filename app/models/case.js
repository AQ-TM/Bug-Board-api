const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
  summary: {
    type: String
  },
  identifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String
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

module.exports = mongoose.model('Case', caseSchema)
