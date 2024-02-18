const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  tag:{
      type: String,
      required: true,
      trim: true
  },
  data: {
    type: String,
    required: false,
  },
  meta: {
    type: Object,
    required: false,
  }
}, {
  timestamps: true
})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset