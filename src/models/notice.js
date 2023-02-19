const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  heading:{
      type: String,
      required: true,
      trim: true
  },
  data: {
    type: String,
    required: false,
    trim: true
  },
  show: {
    type: Boolean,
    required: true,
    default: false
  },
  mainNotice : {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

const Notice = mongoose.model('Notice', noticeSchema)

module.exports = Notice