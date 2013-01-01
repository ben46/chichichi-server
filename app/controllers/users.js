var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
      title: 'Login'
    , message: req.flash('error')
  })
}

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
      title: 'Sign up'
    , user: new User()
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// session
exports.session = function (req, res) {
  res.redirect('/')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  // add code here
  // --------------
  // get weibo friends 
  user.provider = 'local'
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
