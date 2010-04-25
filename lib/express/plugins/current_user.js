// Express - Current User - Copyright Corey Donohoe <atmos@atmos.org> (MIT Licensed)

var kiwi    = require('kiwi'),
    redis   = kiwi.require('redis-client'),
    express = kiwi.require('express')

/**
 * Module dependencies.
 */

var Request = require('express/request').Request

// --- CurrentUser

exports.CurrentUser = Plugin.extend({
  extend: {

    /**
     * Initialize extensions.
     */

    init: function(){
      Request.include({

        /**
         * Get the current fbUser and their hooks
         *
         * Example:
         *
         *   this.currentUser()
         *
         * @return {user}
         * @api public
         */

        currentUser: function (callback) {
          if(this.session && this.fbSession()) {
            users.get(this.fbSession().userId, function(value) {
              if(value == null) {
                return callback({hook_ids: [ ]})
              } else {
                return callback(value)
              }
            })
          }
        },

        /**
         *
         * Example:
         *
         *   this.addHook('foooblajdfkj', function() {
         *     sys.puts("hook successfully saved")
         *   })
         *   // => null
         *
         * @param  {string} hook_id
         * @api public
         */
        addHook: function (hook_id, callback) {
          this.currentUser(function(fbUser) {
            var user_hooks = fbUser.hook_ids

            user_hooks.push(hook_id)
            users.set(fbUser.id, {hook_ids: user_hooks}, function() {
              callback()
            })
          })
        },

        /**
         *
         * Example:
         *
         *   this.removeHook('foooblajdfkj', function() {
         *     sys.puts("hook removed from redis")
         *   })
         *   // => null
         *
         * @param  {string} hook_id
         * @api public
         */
        removeHook: function (hook_id, callback) {
          this.currentUser(function(fbUser) {
            var user_hooks = fbUser.hook_ids

            user_hooks.splice(user_hooks.indexOf(hook_id), 1);
            users.set(fbUser.id, {hook_ids: user_hooks}, function() {
              callback()
            })
          })
        }
      })
    }
  }
})
