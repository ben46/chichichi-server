// user schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')

var UserSchema = new Schema({
    name: String
  , uid: String
  , access_token: String
  , weibo: {}
  , articles : [{type : Schema.ObjectId , ref : 'Article'}]
  , follower : [{type : Schema.ObjectId , ref : 'User'}]
  , friends : [{type : Schema.ObjectId , ref : 'User'}]

})

// validations
var validatePresenceOf = function (value) {
  return value && value.length
}

// pre save hooks
UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()
  if (!validatePresenceOf(this.access_token))
    next(new Error('Invalid access_token'))
  else
    next()
})

// methods
UserSchema.method('authenticate', function(plainText) {
  return plainText === this.access_token
})

mongoose.model('User', UserSchema)
