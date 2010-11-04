$(document).ready(function () {
    socket = new io.Socket('192.168.100.35', {port: 3656});
	socket.connect();
	socket.on('message', function(content) {
		if (content != "") {
			try {
                urls = $.parseJSON(content);
                $('tbody#urllist').html("");
                for (k in urls) {
                    $('tbody#urllist').append("<tr><td>"+ urls[k]['count'] +"</td><td>"+ urls[k]['url'] +"</td></tr>");
                }
        	}
	        catch(err) {
	
	        }
        }
	});
});