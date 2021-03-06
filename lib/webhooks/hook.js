var opts = { db: null }

exports.setRedis = function(db) {
  opts.db = db
}

exports.get = function(hook_id, callback) {
  return new Hook(hook_id).fetch(callback);
}

exports.set = function(hook_id, value, callback) {
  return new Hook(hook_id).put(value, callback);
}

exports.all = function(callback) {
  opts.db.keys('hook-*', function(err, keys) {
    if(keys == null)
      return
    var values = keys.toString().split(/\s+/)
    for(i = 0; i < values.length; i++)
      opts.db.get(values[i], function(err, value) {
        callback(value)
      })
  })
}

exports.destroy = function(hook_id, callback) {
  return new Hook(hook_id).destroy(callback);
}

function Hook(hook_id) {
  this.id      = hook_id
  this.hook_id = 'hook-' + hook_id
}

Hook.prototype.fetch = function(callback) {
  opts.db.get(this.hook_id, function(err, value) {
    callback(value)
  })
}

Hook.prototype.put = function(value, callback) {
  opts.db.set(this.hook_id, value, function(err) {
    callback()
  })
}

Hook.prototype.destroy = function(callback) {
  opts.db.del(this.hook_id, function(err) {
    callback()
  })
}
