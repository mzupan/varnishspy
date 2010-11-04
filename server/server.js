var sys = require('sys');
var http = require('http');
var io = require('./socket.io');

String.prototype.endsWith = function(str) {
    var lastIndex = this.lastIndexOf(str);
    return (lastIndex != -1) && (lastIndex + str.length == this.length);
}

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}


var ignore = new Array(".css", ".js", ".jpg", ".gif", ".txt", ".png", ".jpeg", ".eot");

function doProcess(s) {
	try {
		if (s.startsWith("http")) {
			for(i=ignore.length - 1; i >= 0; --i) {
				if (s.endsWith(ignore[i])) {
					return false;
				}
			}
			return true;
		}
	}
	catch(err) {}

	return false;
}

function sortByNumericValue(A) {
	B=[];

	for (i in A) B.push({url:i,count:A[i]})
	B.sort(function(x,y){return y.count-x.count})

	return B;
}

server = http.createServer(function(req, res){
    // your normal server code
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.writeBody('<h1>Hello world</h1>');
    res.finish();
});

server.listen(3656);

var socket = io.listen(server);

socket.on('connection', function(client) {
	var tail;

	var counter = 0;
	var urls = {};

	var spawn = require('child_process').spawn;
	tail = spawn('varnishncsa');
	sys.puts("Spawned child pid: "+ tail.pid);

	old_url = "";
	tail.stdout.addListener('data', function(data) {
		url = data.toString().split(" ")[6];
		if (url != old_url) {
			old_url = url;

			if (doProcess(url)) {
				if ( urls[url] == undefined) {
					urls[url] = 1;
				}
				else {
					urls[url]++;
				}

				counter++;
				if (counter > 4) {
					// sort the urls and only send the top 50
					sorted_urls = sortByNumericValue(urls);
					sorted_urls = sorted_urls.slice(0,49);
	
					// send the json array off to the client
					client.send(JSON.stringify(sorted_urls));

					// reset counter to do it all over again
					counter = 0;
				}
			}
		}
	});
	client.on('disconnect', function() {
		if (tail) {
			sys.puts("killing pid: "+ tail.pid);
			tail.kill();
			tail = null;
		}
	})
})
