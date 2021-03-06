var HTTP_PORT = 3102;
var HTTPS_PORT = 443;
var express  = require('express');
var morgan       = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var busboyBodyParser = require('busboy-body-parser');
var https = require('https')
var fs=require('fs')
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var session      = require('express-session');
var flash    = require('connect-flash');
 
var configDB = require('./app/config/database.js');
 
/////////////////////////////////////////////
 
var app = express();
 
// Route all Traffic to Secure Server
// Order is important (this should be the first route)
 
//#######HTTPS
 
/*app.all('*', function(req, res, next)
  if (req.secure) {
    return next();
  };
  //res.redirect('https://localhost:'+HTTPS_PORT+req.url);
   res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url)
});
*/
// H
Grid.mongo = mongoose.mongo;
require('./app/config/passport.js')(passport); // pass passport for configuration
 
// configuration ===============================================================
mongoose.connect(configDB[0].url); // connect to our database
var gfs = new Grid(mongoose.connection.db);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
 
 
// basic conf
// routes ======================================================================
require('./app/route/staticRoutes.js')(app); // load satic routes
require('./app/route/documentRoutes.js')(app,gfs,passport); // load routes to services
require('./app/route/fileRoutes.js',app,gfs)
/*
var secureServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/games.reveries-project.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/games.reveries-project.fr/cert.pem')
  }, app)
  .listen(HTTPS_PORT, function () {
    console.log('Secure Server listening on port ' + HTTPS_PORT);
});
*/
app.listen(3000)
    console.log('Secure Server listening on port ');
