var events = require("sdk/system/events");
var { Ci,Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

function listener(event) {
    var subject = event.subject;
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
    var url = subject.URI.spec;
    var local_nba = "http://nba.udn.com/nba/index?gr=www";

    if(url === local_nba) {
        var global_nba = "http://www.nba.com/gr/reflectIntl.html?gr=taiwanuw&page=www&dur=ses";
        subject.redirectTo(Services.io.newURI(global_nba, null, null));
    }
}
events.on("http-on-modify-request", listener);
