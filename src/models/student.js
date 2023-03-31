const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentSchema = new mongoose.Schema({
  firstname: {
      type: String,
      required: true,
      trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  registration: {
    type: String,
    required: false,
  },
  email:{
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
          if(!validator.isEmail(value)){
              throw new Error('Invalid Email')
          }
      }
  },
  password:{
      type: String,
      required: false,
      minLength: 7,
      trim: true,
  },
  dob: {
    type: String,
    required: false,
    default: undefined,
  },
  class: {
    type: String,
    required: false,
    default: undefined,
  },
  gender: {
    type: String,
    required: false,
    default: undefined,
  },
  fathername: {
    type: String,
    required: false,
    default: undefined,
  },
  mothername: {
    type: String,
    required: false,
    default: undefined,
  },
  address: {
    type: String,
    required: false,
    default: undefined,
  },
  city: {
    type: String,
    required: false,
    default: undefined,
  },
  state: {
    type: String,
    required: false,
    default: undefined,
  },
  pincode: {
    type: String,
    required: false,
    default: undefined,
  },
  phone: {
    type: String,
    required: false,
    default: undefined,
  },
  guardianPhone: {
    type: String,
    required: false,
    default: undefined,
  },
  whatsappPhone: {
    type: String,
    required: false,
    default: undefined,
  },
  category: {
    type: String,
    required: false,
    default: undefined,
  },
  paymentStatus: {
    type: Number,
    required: true,
    default: 1,
  },
  avatar: {
      type: String,
      required: false,
      default: undefined,
  },
  signature: {
    type: String,
    required: false,
    default: undefined,
  },
  parentsign: {
    type: String,
    required: false,
    default: undefined,
  },
  meta: {
    type: Object,
    required: false,
    default: undefined,
  },
  tokens: [{
      token:{
          type: String,
          required: true
      }
  }],
}, {
  timestamps: true
})

studentSchema.methods.toJSON = function (){
  const user = this

  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens

  return userObject
}

studentSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id : user._id} , 'My Secret')

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

studentSchema.methods.getRegistration = async function() {
  const user = this
  const year = new Date().getFullYear().toString();
  const userList = await Student.find({ registration : new RegExp(year.substring(1)) });
  user.registration = `MTS${year.substring(1)}${(userList.length+1).toString().padStart(4, '0')}`
  await user.save()
  return user.registration
}

studentSchema.statics.updateSchema = async function(id, data) {
  const user = await Student.findByIdAndUpdate(id, {
    ...data,
  }, {new: true});
  return user
}

studentSchema.statics.findByCredentials = async (email,password) => {
  const user = await Student.findOne({ email })
  if(!user){
      throw new Error('Unable to login')
  }

  if (password) {
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
  }

  return user
}

studentSchema.pre('save' , async function (next) {
  const user = this
  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student