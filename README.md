# VarnishSpy

## Overview

This is a simple client/server that will monitor the varnishncsa stdout for all the urls that are coming
into varnish and connected clients will get a listing of the top 50 urls being hit since they loaded the 
page. 

The server uses node.js with socket.io and the client uses socket.io with a small bit of jquery mixed in. 

## Server Installation

Install node.js on the server. You can visit their website at

http://nodejs.org/

Or you can use my quick install

<pre><code>
git clone git://github.com/ry/node.git
cd node
./configure
make
sudo make install
</code></pre>

Then you can install VarnishSpy. This must be running on the same host that varnish is running on and the user
running the server has to be able to run the varnishncsa command

<pre><code>
git clone git://github.com/mzupan/varnishspy.git
cd varnishspy/server
node server.js
</code></pre>

The server is up and running!

## Client Installation

If you place the client on a new host it is

<pre><code>
git clone git://github.com/mzupan/varnishspy.git
cp -rf varnishspy/client/* /path/to/htdocs/root
</code></pre>

Then you want to edit /path/to/htdocs/root/index.html and set the serverhost javascript var to be the ip that the server is running on.

Then hit the url you setup and you should see connections on your server and data coming into the website



