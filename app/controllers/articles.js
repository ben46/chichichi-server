
var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , Imager = require('imager')
  , _ = require('underscore')

// New article
exports.new = function(req, res){
  res.render('articles/new', {
      title: 'New Article'
    , article: new Article({})
  })
}


// Create an article
exports.create = function (req, res) {

  var article = new Article(req.body)
    , imagerConfig = require('../../config/imager')
    , imager = new Imager(imagerConfig, 'S3')

  article.user = req.user;

  var imageData = null; 

  if (req.files && req.files.image) {
    imager.upload(req.files.image, function (err, cdnUri, files) {
      if (err) return res.end(JSON.stringify( {error : err })) ;
      if (files.length) {
        article.image = { cdnUri : cdnUri, files : files }
      }
      article.save(function(err){
        if (err) {
          res.end(JSON.stringify( {
              title: 'New Article'
            , article: article
            , errors: err.errors
          }))
        }
        else {
          res.end(JSON.stringify({articleId : article._id}));
        }
      })
    }, 'article')
  }else{
    res.end(JSON.stringify({error : 'no image '}));
  }
}


// Edit an article
exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}

// View an article
exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article,
    comments: req.comments
  })
}


// Delete an article
exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.end(JSON.stringify({error : err}));
  })
}


// Listing of Articles
exports.index = function(req, res){
  var perPage = 5
    , page = req.param('page') > 0 ? req.param('page') : 0

  Article
    .find({})
    .populate('user', 'name')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, articles) {
      if (err) return res.render('500')
      Article.count().exec(function (err, count) {
        res.end(JSON.stringify( {
            title: 'List of Articles'
          , articles: articles
          , page: page
          , pages: count / perPage
        }))
      })
    })
}

exports.friends_timeline = function(req, res){

  var uid = req.user.uid;
  var postsArray = [];
  User.findOne({uid:uid}, function(err , user){

    var friendsuids = user.friends;
    for(int i = 0 ; i < friendsuids.length ; i++){
      User.findOne({uid: friendsuids[i]}, function(err , friend){
        var articleIds = friend.articles;
        for(int  j = 0 ; j< articleIds.length ; j++){
          Article.findOne({id: articleIds[j]}, function(err, article){
            postsArray.push(article);
          });
        }
      }) 
    }
  })

  return  res.end(JSON.stringify({
    posts : postsArray
    , totalNumber : postsArray.length
  }));

}
exports.friends_timeline_ids = function(req, res){
    return  res.end('friends_bilateral_ids');

}
exports.user_timeline = function(req, res){

  var uid = req.user.uid;
  var postsArray = [];
  User.findOne({ uid:uid }, function(err , user){
    var articleIds = user.articles;
    for(int  j = 0 ; j< articleIds.length ; j++){
      Article.findOne({id: articleIds[j]}, function(err, article){
        postsArray.push(article);
      });
    }
  }) 

  return  res.end(JSON.stringify({
    posts : postsArray
    , totalNumber : postsArray.length
  }));

}
exports.user_timeline_ids = function(req, res){
    return  res.end('friends_bilateral_ids');

}
exports.bilateral_timeline = function(req, res){
    return  res.end('friends_bilateral_ids');

}
exports.likedcount = function(req, res){
    return  res.end('friends_bilateral_ids');

}
exports.mentions = function(req, res){
    return  res.end('friends_bilateral_ids');

}
exports.mentions_ids = function(req, res){
    return  res.end('friends_bilateral_ids');

}

















