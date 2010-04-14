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
         * Get the current fbUser
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
                users.set(this.fbSession().userId, {hook_ids: [ ]}, function(){
                  currentUser(callback)
                })
              } else {
                callback(value)
              }
            })
          }
        }
      }),
      Request.include({
        /**
         *
         * Example:
         *
         *   this.addHook('foooblajdfkj')
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
        }
      })
    }
  }
})