var fs     = require('fs'),
    crypto = require('hashlib'),
    kiwi   = require('kiwi')

kiwi.require('express')
     require('express/plugins')
kiwi.require('facebook')

var facebookApiKey    = process.env['FB_API_KEY']
var facebookApiSecret = process.env['FB_SECRET_KEY']

configure(function() {
  use(Flash)
  use(Logger)
  use(Cookie)
  use(MethodOverride)
  use(Static, { path: "public" })
  use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })
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

post('/hooks', function() {
  var hook_sha = crypto.sha1(new Date);
  this.session.hook_url = "/hooks/" + hook_sha;
  this.redirect(this.session.hook_url);
})

get('/hooks/:id', function() {
  this.render('hooks.haml.html', {
    locals: {
      user         : this.fbSession() || { },
      title        : 'Webhooks for, ' + this.param('id'),
      apiKey       : facebookApiKey,
      message      : this.flash('message') || '',
      post_url     : "/hooks/" + this.param('id'),
      channel_name : this.session.channel_name
    }
  })
})

put ('/hooks/:id', function() {
  this.session.channel_name = this.param('channel')
  this.flash('message', 'Updated the channel name successfully!')
  this.redirect("/hooks/" + this.param('id'))
})

run()
