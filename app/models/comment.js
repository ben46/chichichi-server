// comment schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CommentSchema = new Schema({
    body: {type : String, default : ''}
  , _user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
  , replyToUsers: [{type : Schema.ObjectId, ref : 'User'}]
  , voice: {
    cdnUri: String
    , files: []
    , length: Number
  }
})

mongoose.model('Comment', CommentSchema)
