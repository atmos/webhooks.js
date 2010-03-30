A Simple Webhook App
====================

This is my first [express][express] app. :)

You Need
========

* [kiwi][kiwi]
* [hashlib][hashlib]
* install [express][express]

    % kiwi install express
    % kiwi install facebook

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
[hashlib]: http://github.com/brainfucker/hashlib
[express]: http://github.com/visionmedia/express
