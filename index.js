var events = require("sdk/system/events");
var { Ci,Cu } = require("chrome");
Cu.import("resource://gre/modules/Services.jsm");

var local_nba = [
    ["http://nba.udn.com/nba/index?gr=www", "taiwanuw"],
    ["http://australia.sportingnews.com/nba?gr=www", "australiauw"],
    ["http://www.givemesport.com/nba?gr=www", "ukuw"],
    ["http://ph.nba.com/?gr=www", "philippinesuw"],
    ["http://www.nba.co.jp/?gr=www", "japanuw"],
    ["http://www.gazzetta.it/Nba/?gr=www", "italyuw"],
    ["http://www.lequipe.fr/Basket/Nba/?gr=www", "franceuw"],
    ["http://www.spox.com/de/sport/ussport/nba/index.html?gr=www", "germanyuw"],
];

function listener(event) {
    var subject = event.subject;
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
    var url = subject.URI.spec;

    for (var i = 0; i < local_nba.length; i++) {
        if(local_nba[i][0] === url) {
            var global_nba = "http://www.nba.com/gr/reflectIntl.html?page=www&dur=ses&gr=" + local_nba[i][1];
            subject.redirectTo(Services.io.newURI(global_nba, null, null));
        }
    }
}
events.on("http-on-modify-request", listener);
