var express = require('express');
var urls = require("./urls.js");
var app = express();

// Serve static files
app.use(express.static('public'))

// Returns information about the URL
app.get('/get-url', function(req, res){
    urls.getUrl(req.query.url)
        .then(function(response){
            res.send(response);
        })
        .catch(function(error){
            res.status(400);
            res.send(error);
        });
});

// Go!
app.listen(3000, function () {
    console.log('Accredible :: Fullstack Assessment - Starter Repo');
    console.log('listening on port 3000!');
})
