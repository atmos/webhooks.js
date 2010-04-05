// Webhooks App - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)
var ircatPort         = process.env['WEBHOOK_LISTEN_PORT'],
    ircatUsername     = process.env['WEBHOOK_USERNAME']

var kiwi  = require('kiwi')

kiwi.require('express')
     require('express/plugins')
kiwi.require('express-session-redis')
kiwi.require('facebook')
kiwi.require('ircat')

var redis = kiwi.require('redis-client')
// redis.debugMode = true
var redisStore = require('express/plugins/session.redis').RedisStore

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
  enable('show exceptions')
  set('root', __dirname)
})

// setup redis db
exports.db = redis.createClient()
exports.db.stream.addListener("connect", function() {
  exports.db.select(42)
  if(process.env['FLUSH_WEBHOOKS_DB'])
    exports.db.flushdb()

  ircatBot.run()
})
exports.db.stream.addListener("close", function (inError) {
  process.exit(0)
})

// setup the irc bot
var options  = {username: ircatUsername, ip: '130.239.18.172', port: 6667}
var ircatBot = require('ircat/bot').create(options, function() {
  run() // kicks off the express loop
})
