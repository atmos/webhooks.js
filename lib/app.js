var fs     = require('fs'),
    crypto = require('hashlib'),
    kiwi   = require('kiwi')

var redis = kiwi.require('redis-client')

kiwi.require('express')
kiwi.require('express-session-redis')
require('express/plugins')
redisStore = require('express/plugins/session.redis').RedisStore
kiwi.require('facebook')
kiwi.require('ircat')

//redis.debugMode = true

var ircatPort         = process.env['WEBHOOK_LISTEN_PORT']
var ircatUsername     = process.env['WEBHOOK_USERNAME']
var facebookApiKey    = process.env['FB_API_KEY']
var facebookApiSecret = process.env['FB_SECRET_KEY']

configure(function() {
  use(Flash)
  use(Logger)
  use(Cookie)
  use(MethodOverride)
  use(Static, { path: "public" })
  use(Session, { dataStore: redisStore, lifetime: (15).minutes, reapInterval: (1).minute })
  use(require('facebook').Facebook, {
    apiKey    : facebookApiKey,
    apiSecret : facebookApiSecret
  })
  enable('show exceptions')
  set('root', __dirname)
})

get('/', function() {
  this.render('home.haml.html', {
    locals: {
      apiKey       : facebookApiKey,
      title        : 'Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
      message      : this.flash('message') || '',
      user         : this.fbSession() || { }
    }
  })
})

get('/hooks', function() {
  this.render('hooks.haml.html', {
    locals: {
      apiKey       : facebookApiKey,
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
        user         : express.fbSession(),
        title        : 'Webhooks',
        apiKey       : facebookApiKey,
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
    ircatBot.emit('joinChannel', {channel: express.param('channel')})
    express.flash('message', 'Updated the channel name successfully!')
    express.redirect("/hooks/" + express.param('id'))
  })
})

post ('/hooks/:id', function() {
  var express = this

  db.get(this.param('id'), function(err, value) {
    ircatBot.emit('messageChannel', {channel: value, message: express.param('message') })
    express.halt(200, JSON.stringify({}))
  })
})

// setup redis db
db = redis.createClient()
db.stream.addListener("connect", function() {
  db.select(42)
  //db.flushdb
  ircatBot.run()
})
db.stream.addListener("close", function (inError) {
})

// setup the irc bot
var options  = {username: ircatUsername, ip: '130.239.18.172', port: 6667}
var ircatBot = require('ircat/bot').create(options, function() {
  run() // kicks off the express loop
})
