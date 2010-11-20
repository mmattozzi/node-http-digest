/*
 * test.webdav.org seems to be a random server on the web that was designed to 
 * test webdav clients. We can use this to test digest auth, although even 
 * when auth succeeds, only a 404 is returned. 
 */

var digest = require("./digest");
var sys = require("sys");

var digestClient = digest.createClient(80, "test.webdav.org", "user1", "user1");
var hdrs = {
	"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"host":"test.webdav.org",
	"accept-encoding":"gzip,deflate"
};

var maxIterations = 3;

function makeReq(i) {
	if (i === maxIterations) {
		return;
	}
	sys.puts("makeReq " + i);

	var req = digestClient.request("GET", "/auth-digest/", hdrs);
	req.addListener("response", function(response){
		sys.puts("iteration: " + i);
		sys.puts('STATUS: ' + response.statusCode);
		sys.puts('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.addListener('data', function (chunk) {
			sys.puts('BODY: ' + chunk);
		});
		makeReq(i + 1);
	});

	req.end();
}

makeReq(0);
