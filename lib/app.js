// Webhooks App - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)
var crypto   = require('hashlib'),
    webhooks = require('./init')

var db     = webhooks.db
    bot    = webhooks.ircatBot
    apiKey = webhooks.facebookApiKey

get('/', function() {
  this.render('home.haml.html', {
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

  db.set(hook_sha, 'Pick a Channel', function(err) {
    express.redirect("/hooks/" + hook_sha)
  })
})

get('/hooks/:id', function() {
  var express = this

  db.get(this.param('id'), function(err, value) {
    express.render('hook.haml.html', {
      locals: {
        title        : 'Webhooks',
        user         : express.fbSession(),
        apiKey       : apiKey,
        message      : express.flash('message') || '',
        post_url     : "/hooks/" + express.param('id'),
        channel_name : value
      }
    })
  })
})

put ('/hooks/:id', function() {
  var express = this

  db.set(this.param('id'), this.param('channel'), function(err) {
    bot.emit('joinChannel', {channel: express.param('channel')})
    express.flash('message', 'Updated the channel name successfully!')
    express.redirect("/hooks/" + express.param('id'))
  })
})

post ('/hooks/:id', function() {
  var express = this

  db.get(this.param('id'), function(err, value) {
    bot.emit('messageChannel', {channel: value, message: express.param('message') })
    express.halt(200, JSON.stringify({}))
  })
})
