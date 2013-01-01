
var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.post('/login' 
    , passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}) 
    , function(req, res){
        res.end(JSON.stringify({
          error : null
        }));
  });
  app.get('/logout', users.logout) // 退出登录
  app.get('/users/:userId', users.show) // 获取用户信息 
  app.get('/users/:userId/counts', users.show) // 获取用户的粉丝数、关注数、微博数
  app.get('/users/counts', users.show) // 批量获取用户的粉丝数、关注数、微博数
  
  app.post('/users', users.create) // 根据weibo账号在chichichi注册一个账号
  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })

  // article routes
  var articles = require('../app/controllers/articles')
  app.get('/posts/public_timeline', articles.index) // 获取最新的公共微博
  app.get('/posts/friends_timeline', articles.friends_timeline); //获取当前登录用户及其所关注用户的最新微博
  app.get('/posts/friends_timeline/ids', articles.friends_timeline_ids); //获取当前登录用户及其所关注用户的最新微博
  app.get('/posts/user_timeline', articles.user_timeline); //获取用户发布的微博
  app.get('/posts/user_timeline/ids', articles.user_timeline_ids); //获取用户发布的微博的ID

  app.get('/posts/bilateral_timeline', articles.bilateral_timeline); //获取双向关注用户的最新微博 

  app.get('/posts/count', articles.likedcount); //批量获取指定微博的转发数评论数
  app.get('/posts/mentions', passport.authenticate('local'), articles.mentions); //获取@当前用户的最新微博
  app.get('/posts/mentions/ids', passport.authenticate('local'), articles.mentions_ids); //获取@当前用户的最新微博的ID

  app.post('/posts', passport.authenticate('local'), articles.create)
  app.get('/posts/:id', articles.show)//根据ID获取单条微博信息
  app.del('/posts/:id', passport.authenticate('local'), articles.destroy)

  app.param('id', function(req, res, next, id){
    Article
      .findOne({ _id : id })
      .populate('user', 'name')
      .populate('comments')
      .exec(function (err, article) {
        if (err) return next(err)
        if (!article) return next(new Error('Failed to load article ' + id))
        req.article = article

        var populateComments = function (comment, cb) {
          User
            .findOne({ _id: comment._user })
            .select('name')
            .exec(function (err, user) {
              if (err) return next(err)
              comment.user = user
              cb(null, comment)
            })
        }

        if (article.comments.length) {
          async.map(req.article.comments, populateComments, function (err, results) {
            next(err)
          })
        }
        else
          next()
      })
  })

  // home route
  app.get('/', articles.index)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.get('/comments/show', passport.authenticate('local'), comments.show) // 获取某条微博的评论列表
  app.get('/comments/by_me', passport.authenticate('local'), comments.by_me) // 我发出的评论列表
  app.get('/comments/to_me', passport.authenticate('local'), comments.to_me) // 我收到的评论列表
  app.get('/comments/timeline', passport.authenticate('local'), comments.timeline) // 获取用户发送及收到的评论列表
  app.get('/comments/mentions', passport.authenticate('local'), comments.mentions) // 获取@到我的评论
  app.get('/comments/show_batch', passport.authenticate('local'), comments.show_batch) // 批量获取评论内容

  app.post('/articles/:id/comments', passport.authenticate('local'), comments.create) // 发表评论
  app.post('/articles/:id/comments/reply', passport.authenticate('local'), comments.create) // 回复一条评论

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

  // 关注 routes
  var friendships = require('../app/controllers/friendships')
  app.get('/friendships/friends', friendships.friends) // 获取用户的关注列表
  app.get('/friendships/friends/in_common', friendships.friends_in_common) // 获取共同关注人列表
  app.get('/friendships/friends/bilateral', friendships.friends_bilateral) // 获取双向关注列表
  app.get('/friendships/friends/bilateral/ids', friendships.friends_bilateral_ids) // 获取双向关注UID列表
  app.get('/friendships/friends/ids', friendships.friends_ids) // 获取用户关注对象UID列表
  //粉丝 routes
  app.get('/friendships/followers', friendships.followers) // 获取用户粉丝列表
  app.get('/friendships/followers/ids', friendships.followers_ids) // 获取用户粉丝UID列表
  app.get('/friendships/followers/active', friendships.followers_active) // 获取用户优质粉丝列表

  app.post('/friendships/create', passport.authenticate('local'), friendships.create) // 关注某用户
  app.post('/friendships/destroy', passport.authenticate('local'), friendships.destroy) // 取消关注某用户
  app.post('/friendships/remark/update', passport.authenticate('local'), friendships.remark_update) // 更新关注人备注

  // remind routes
  var remind = require('../app/controllers/remind')
  app.get('/remind/unread_count', remind.show) // 获取某个用户的各种消息未读数 
  app.post('/remind/set_count', remind.destroy) // 对当前登录用户某一种消息未读数进行清零   















}
