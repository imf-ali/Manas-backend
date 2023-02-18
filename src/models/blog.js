const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true,
      trim: true
  },
  data: {
    type: String,
    required: true,
    trim: true
  },
  show: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog