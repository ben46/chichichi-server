var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// signup
exports.create = function (req, res) {

  console.log(req.body);

  if (!req.body.access_token) {
    return res.end(JSON.stringify({ errors: 'no access_token' })) ;
  };

  var user = new User(req.body)
  // add code here
  // --------------
  // get weibo friends 

  user.save(function (err) {
    if (err) {
      return res.end(JSON.stringify({ errors: err.errors, user: user })) ;
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.write(JSON.stringify({ errors: err.errors, user: user })) ;
    })
  })
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      title: user.name
    , user: user
  })
}
