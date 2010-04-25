A Simple Webhook App
====================

This is my first [express][express] app. It uses [facebook][facebook] auth.

Install Kiwi Dependencies
=========================
    % brew install kiwi
    % kiwi install express
    % kiwi install facebook
    % kiwi install redis-client

Running
========

    % export FB_API_KEY="your api key from facebook"
    % export FB_SECRET_KEY="your secret key from facebook"
    % bin/server
    % open http://localhost:3000

Testing
=======

    % bin/spec

[kiwi]: http://github.com/visionmedia/kiwi
[express]: http://github.com/visionmedia/express
[facebook]: http://github.com/atmos/facebook.js
