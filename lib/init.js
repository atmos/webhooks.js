// Webhooks App - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)
var ircatPort         = process.env['WEBHOOK_LISTEN_PORT'],
    ircatUsername     = process.env['WEBHOOK_USERNAME']

var kiwi  = require('kiwi'),
    hooks = require('./webhooks/hook')
    users = require('./webhooks/user')

kiwi.require('express')
     require('express/plugins')
kiwi.require('express-session-redis')
kiwi.require('facebook')
kiwi.require('ircat')

var redis = kiwi.require('redis-client')
// redis.debugMode = true
var redisStore = require('express/plugins/session.redis').RedisStore

// exports for access hook objects
exports.hooks = hooks
exports.users = users

// exports for hashing
exports.crypto = kiwi.require('hashlib')

// exports for tokens needed in markup
exports.facebookApiKey    = process.env['FB_API_KEY'],
exports.facebookApiSecret = process.env['FB_SECRET_KEY']

// setup express
configure(function() {
  use(Flash)
  use(Logger)
  use(Cookie)
  use(MethodOverride)
  use(Static, { path: "public" })
  use(Session, { dataStore: redisStore, lifetime: (15).minutes, reapInterval: (1).minute })
  use(require('facebook').Facebook, {
    apiKey    : exports.facebookApiKey,
    apiSecret : exports.facebookApiSecret
  })
  use(require('./express/plugins/current_user').CurrentUser)
  enable('show exceptions')
  set('root', __dirname)
})

// setup redis db
exports.db = redis.createClient()
exports.db.stream.addListener("connect", function() {
  exports.db.select(42)
  if(process.env['FLUSH_WEBHOOKS_DB'])
    exports.db.flushdb()

  hooks.setRedis(exports.db)
  users.setRedis(exports.db)
  exports.ircatBot.run()
})
exports.db.stream.addListener("close", function (inError) {
  require("sys").puts("connection to redis closed")
})

// setup the irc bot
var options  = {username: ircatUsername, ip: '130.239.18.172', port: 6667}
exports.ircatBot = require('ircat/bot').create(options, function() {
  hooks.all(function(value) {
    exports.ircatBot.emit('joinChannel', {channel: value})
  })
  run() // kicks off the express loop
})
