const mongoose = require('mongoose')
const issueSchema = require('./issue')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  targetStartDate: {
    type: Date
  },
  targetEndDate: {
    type: Date
  },
  issues: [issueSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Project', projectSchema)
