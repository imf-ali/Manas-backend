const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true,
      trim: true
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
      required: true,
      minLength: 7,
      trim: true,
  },
  avatar: {
      type: Buffer
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

adminSchema.methods.toJSON = function (){
  const user = this

  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

adminSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id : user._id} , 'My Secret')

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

adminSchema.statics.findByCredentials = async (email,password) => {
  const user = await Admin.findOne({ email })
  if(!user){
      throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password,user.password)
  if(!isMatch){
      throw new Error('Unable to login')
  }

  return user
}

adminSchema.pre('save' , async function (next) {
  const user = this
  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin