var opts = { db: null }

exports.setRedis = function(db) {
  opts.db = db
}

exports.get = function(user_id, callback) {
  new User(user_id).fetch(callback);
}

exports.set = function(user_id, value, callback) {
  new User(user_id).put(value, callback);
}

function User(user_id) {
  this.id       = user_id
  this.user_id  = 'user-' + user_id
  this.hook_ids = [ ]
}

User.prototype.fetch = function(callback) {
  var self = this

  opts.db.get(this.user_id, function(err, value) {
    if(value !== null) {
      values = JSON.parse(value.toString())
      self.hook_ids = values.hook_ids
    }
    callback(self)
  })
}

User.prototype.put = function(value, callback) {
  opts.db.set(this.user_id, JSON.stringify(value), function(err) {
    callback()
  })
}
