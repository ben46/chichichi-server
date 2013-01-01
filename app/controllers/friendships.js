
var mongoose = require('mongoose')
  , _ = require('underscore')
  , User = mongoose.model('User')

exports.create = function (req, res) {

  var user = req.user ; 
  User.findOne({uid:req.friendsid}, function(err, friend){
    if (err) {
        return res.end(JSON.stringify({error : err}));
    }else{
        user.friends.push(req.friendsid);
        friend.followers.push(user.uid);
        return res.end(JSON.stringify({error : err}));
    }
  });

}

// Delete an article
exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    res.end(JSON.stringify({error : err}));
  })
}

exports.remark_update = function (req, res) {

}

//--------
exports.friends = function(req, res){
  User.findOne({uid:req.user.uid}, function(err, user){
    if (err) {
        return res.end(JSON.stringify({error : err}));
    }else{
      var array = [];
      var friendsIds = user.friends;

      for(int i  = 0; i < friendsIds.length ; i++){
          User.findOne({uid:friendsIds[i]}, function(err, friend){
            array.push(friend);
          });
      }
      return res.end(JSON.stringify({array}));
    }
  });
}

exports.friends_in_common = function (req, res) {
    return  res.end('friends_bilateral_ids');
}

exports.friends_bilateral = function (req, res) {
    return  res.end('friends_bilateral_ids');

}
exports.friends_bilateral_ids = function (req, res) {
  return  res.end('friends_bilateral_ids');
}
exports.friends_ids = function (req, res) {

  User.findOne({uid:req.user.uid}, function(err, user){
    if (err) {
      return res.end(JSON.stringify({error:err}));
    }else{
      return res.end(JSON.stringify({user.friends}));
    }
  });

}
//--------
exports.followers = function (req, res) {
  User.findOne({uid:req.user.uid}, function(err, user){
    if (err) {
        return res.end(JSON.stringify({error : err}));
    }else{
      var array = [];
      var followersIds = user.followers;

      for(int i  = 0; i < followersIds.length ; i++){
          User.findOne({uid:followersIds[i]}, function(err, follower){
            array.push(follower);
          });
      }
      return res.end(JSON.stringify({array}));
    }
  });
}
exports.followers_ids = function (req, res) {
  
  User.findOne({uid:req.user.uid}, function(err, user){
    if (err) {
      return res.end(JSON.stringify({error:err}));
    }else{
      return res.end(JSON.stringify({user.followers}));
    }
  });
}

exports.followers_active = function (req, res) {
    return  res.end('friends_bilateral_ids');

}


