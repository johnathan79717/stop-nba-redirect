var self = require("sdk/self")
var events = require("sdk/system/events");
var { Ci,Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

var redirects = JSON.parse(self.data.load("redirects.json"))

var nba_prefix = "http://www.nba.com/gr/reflectIntl.html?page=www&dur=ses&gr=";

function listener(event) {
    var subject = event.subject;
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
    var url = subject.URI.spec;

    for (var redirect of redirects) {
        if(redirect.url === url) {
            subject.redirectTo(Services.io.newURI(nba_prefix + redirect.cookie, null, null));
            break;
        }
    }
}
events.on("http-on-modify-request", listener);

exports.onUnload = function() {
    events.removeListener("http-on-modify-request", listener);
}
