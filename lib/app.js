var crypto = require('hashlib')
var kiwi = require('kiwi')
kiwi.require('express')
require('express/plugins')

configure(function(){
  set('root', __dirname)
  use(Flash)
  use(Logger)
  use(Cookie)
  use(MethodOverride)
  use(Static, { path: "public" })
  use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })
  enable('show exceptions')
})

get('/', function(){
  this.render('home.haml.html', {
    locals: {
      title        : 'Webhooks!!!!!!!!!!!!!!!!!!!!!!!!!',
      message      : this.flash('message') || '',
    }
  })
})

post('/hooks', function(){
  var hook_sha = crypto.sha1(new Date);
  this.session.hook_url = "/hooks/" + hook_sha;
  this.redirect(this.session.hook_url);
})

get('/hooks/:id', function(){
  this.render('hooks.haml.html', {
    locals: {
      title        : 'Webhooks for, ' + this.param('id'),
      message      : this.flash('message') || '',
      post_url     : "/hooks/" + this.param('id'),
      channel_name : this.session.channel_name
    }
  })
})

put ('/hooks/:id', function(){
  this.session.channel_name = this.param('channel')
  this.flash('message', 'Updated the channel name successfully!')
  this.redirect("/hooks/" + this.param('id'))
})

run()
