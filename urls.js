exports.getUrl = getUrl;

var Promise = require('bluebird');
var Horseman = require("node-horseman");
var phantom = require("phantom");
var _ph, _page, _outObj;

// Playing with the settings is fun, but here's some sensible defaults
var horseman = new Horseman({
    loadImages: false,
    diskCache: true, // This speeds things up a lot, manual caching would probably be superior
});

// Reads and "parses" an URL
function getUrl(url){
    return new Promise(function(resolve, reject){
        horseman
            .open(url)
            .html()
            .then(function(html){
                phantom.create().then(function(ph){
                    _ph = ph;
                    return _ph.createPage();
                }).then(function(page){
                    _page = page;
                    return _page.open(url, function (status) {
                    });
                }).then(function(status){
                    console.log(status);
                    return _page.property('content')
                }).then(function(content){
                    _page.evaluate(function() {
                        if(document.URL.indexOf('magento') !== -1) {
                            return magentoCertificateExtractor();
                        } else {
                            resolve({
                                certficates: null
                            });
                        }
                        function magentoCertificateExtractor() {
                            function convertDate(date) {
                                var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                                var parts = date.split('/');
                                return monthNames[parts[0]-1] + ' ' + parts[1] + ', ' + parts[2];
                            }
                            function parseMagentoDOM(cert, index) {
                                var userObj = {};
                                userObj.certName = (cert.getElementsByClassName('col-xs-12')[0].textContent).trim();
                                userObj.id = (cert.getElementsByClassName('col-xs-12')[1].textContent).trim();
                                userObj.issuedDate = convertDate((cert.getElementsByClassName('col-xs-12')[2].textContent).trim());
                                userObj.image = document.getElementsByClassName('cert-img')[0].getElementsByTagName('img')[index]
                                    .getAttribute('src');
                                userObj.url = document.URL;
                                userObj.title = document.title;
                                return userObj;
                            }
                            var userArray = [];
                            var oddCerts = document.getElementsByClassName('cert-table')[0].getElementsByClassName('odd hidden-xs');
                            var evenCerts = document.getElementsByClassName('cert-table')[0].getElementsByClassName('even hidden-xs');
                            var maxLength = oddCerts.length > evenCerts.length ? oddCerts.length : evenCerts.length;
                            for (var i = 0; i < maxLength; i++) {
                                if (i < oddCerts.length) {
                                    var userObjOdd = parseMagentoDOM(oddCerts[i], i);
                                    userArray.push(userObjOdd);
                                }
                                if (evenCerts != undefined && i < evenCerts.length) {
                                    var userObjEven = parseMagentoDOM(evenCerts[i], i+1);
                                    userArray.push(userObjEven);
                                }
                            }
                            return userArray;
                        }
                    }).then(function (certificates) {
                        resolve({
                            certficates: certificates
                        });
                        _page.close();
                        _ph.exit();
                    });
                }).catch(function(e){
                    reject(e);
                });
            })
            .catch(function(err){
                reject(err);
            });
    });
}

/** HORSEMAN NOTES

 I only have a single horseman object here, they can be
 expensive (slow) to create, so I'm just keeping it in
 memory. This would be terrible in production as it
 couldn't handle two requests in parallel! Hah!

 You'll also notice I'm not running horseman.close(),
 doing so would render the horseman useless for
 subsequent requests.

 A nice solution would be to have a pool of horseman
 that can be accessed like so:

 getHorseman()
 .then(function(horseman){
            // ... code here
        })

 Where getHorseman() might: pull an inactive horseman
 from a pool, wait for an active horseman to finish,
 or even add a new horseman to the pool. GC would
 be fun too. You could have methods like
 sendThisHorseToTheKnackerYard() - funny, and arguably
 semantic, but you'd be entering the realm of naming
 inception. Try explaining that to your team in a
 few years.
 */