var self = require("sdk/self")
var events = require("sdk/system/events");
var { Ci,Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");
var Request = require("sdk/request").Request;

var urlToCookie = JSON.parse(self.data.load("urlToCookie.json"))

function setCookieByUrl(url) {
    var cookieValue = urlToCookie[url];
    if (cookieValue === undefined) {
        return false;
    } else {
        Services.cookies.add(
                ".nba.com", // host
                "/", // path
                "gr", // key
                cookieValue, // value
                false, // https only
                false, // http only
                false, // session
                new Date().getTime() / 1000 + 86400 * 365 * 100); // 100 years
        return true;
    }
}

function listener(event) {
    var subject = event.subject;
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
    var url = subject.URI.spec;
    if (setCookieByUrl(url)) {
        subject.redirectTo(Services.io.newURI("http://www.nba.com", null, null));
        removeListener();
    }
}

function removeListener() {
    events.off("http-on-modify-request", listener);
};

events.on("http-on-modify-request", listener);

exports.onUnload = removeListener;

// we don't want the listener to exists for too long,
// so we intentionally request nba.com to see where we are redirected to
Request({
    url: "http://www.nba.com?no-cache",
    onComplete: function(response) {
        setCookieByUrl(response.url);
        removeListener();
    }
}).get();
