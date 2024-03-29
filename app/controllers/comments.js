var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')

exports.create = function (req, res) {
  var comment = new Comment(req.body)
    , article = req.article

  comment._user = req.user

  comment.save(function (err) {
    if (err) throw new Error('Error while saving comment')
    article.comments.push(comment._id)
    article.save(function (err) {
      if (err) throw new Error('Error while saving article')
      // res.redirect('/articles/'+article.id+'#comments')
      res.end(JSON.stringify({
        article_id : article.id
        , comment_id : comment._id
      }));

    })
  })
}

exports.show = function (req, res) {
  console.log('comment show');
    return  res.end('friends_bilateral_ids');

}

exports.by_me = function (req, res) {
  console.log('comment by_me');
    return  res.end('friends_bilateral_ids');

}

exports.to_me = function (req, res) {
  console.log('comment to_me');
    return  res.end('friends_bilateral_ids');

}

exports.timeline = function (req, res) {
  console.log('comment timeline');
    return  res.end('friends_bilateral_ids');

}

exports.mentions = function (req, res) {
  console.log('comment mentions');
    return  res.end('friends_bilateral_ids');

}
exports.show_batch = function (req, res) {
  console.log('comment show_batch');
    return  res.end('friends_bilateral_ids');

}


