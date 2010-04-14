// Webhooks App - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)
var config = require('./init')

var db     = config.db,
    hooks  = config.hooks,
    ircBot = config.ircatBot,
    apiKey = config.facebookApiKey,
    crypto = config.crypto

get('/', function() {
  this.render('home.html.haml', {
    locals: {
      apiKey       : apiKey,
      title        : 'Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
      message      : this.flash('message') || '',
      user         : this.fbSession() || { }
    }
  })
})

get('/hooks', function() {
  this.render('hooks.haml.html', {
    locals: {
      apiKey       : apiKey,
      title        : 'Your Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
      user         : this.fbSession() || { }
    }
  })
})

post('/hooks', function() {
  var express  = this,
      hook_sha = crypto.sha1(new Date)

  hooks.set(hook_sha, 'Pick a Channel', function() {
    express.redirect("/hooks/" + hook_sha)
  })
})

get('/hooks/:id', function() {
  var express = this

  hooks.get(this.param('id'), function(value) {
    express.render('hook.haml.html', {
      locals: {
        title        : 'Webhooks',
        user         : express.fbSession(),
        apiKey       : apiKey,
        message      : express.flash('message') || '',
        sha1         : express.param('id'),
        post_url     : "/hooks/" + express.param('id'),
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
