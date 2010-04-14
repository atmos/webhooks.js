// Webhooks App - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)
var config = require('./init')

var db     = config.db,
    hooks  = config.hooks,
    users  = config.users,
    ircBot = config.ircatBot,
    apiKey = config.facebookApiKey,
    crypto = config.crypto

get('/', function() {
  this.render('home.html.haml', {
    locals: {
      apiKey  : apiKey,
      title   : 'Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
      message : this.flash('message') || '',
      user    : this.fbSession() || { }
    }
  })
})

get('/hooks', function() {
  var express  = this

  this.currentUser(function (fbUser) {
    var hook_ids = fbUser.hook_ids
    express.render('hooks.html.haml', {
      locals: {
        apiKey   : apiKey,
        title    : 'Your Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
        user     : express.fbSession() || { },
        hook_ids : hook_ids,
        message  : null
      }
    })
  })
})

post('/hooks', function() {
  var express  = this,
      hook_sha = crypto.sha1(new Date)

  hooks.set(hook_sha, 'Pick a Channel', function() {
    try {
      express.addHook(hook_sha, function() {
        express.redirect("/hooks/" + hook_sha)
      })
    } catch(err) {
      sys.p(err)
      express.flash('message', 'You need to login to create webhooks!')
      express.redirect("/")
    }
  })
})

get('/hooks/:id', function() {
  var express = this

  hooks.get(this.param('id'), function(value) {
    express.render('hook.html.haml', {
      locals: {
        title        : 'Webhooks',
        user         : express.fbSession(),
        apiKey       : apiKey,
        message      : express.flash('message') || '',
        sha1         : express.param('id'),
        post_url     : "/hooks/" + express.param('id'),
        user         : express.fbSession() || { },
        channel_name : value
      }
    })
  })
})

put ('/hooks/:id', function() {
  var express = this

  hooks.set(this.param('id'), this.param('channel'), function(err) {
    ircBot.emit('joinChannel', {channel: express.param('channel')})
    express.flash('message', 'Updated the channel name successfully!')
    express.redirect("/hooks/" + express.param('id'))
  })
})

post ('/hooks/:id', function() {
  var express = this

  hooks.get(this.param('id'), function(value) {
    ircBot.emit('messageChannel', {channel: value, message: express.param('message') })
    express.halt(200, JSON.stringify({}))
  })
})
