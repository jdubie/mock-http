var fs      = require('fs'),
    path    = require('path'),
    express = require('express');

/*
 * Create express app
 */
var app = express();

/*
 * Statically serve public directory.
 */
var folder = 'public'; // TODO: add folder to argv
var directory = path.join(process.cwd(), folder);
app.use(express.static(directory));

/*
 * Re-read mockfile from disk each http request to get changes
 * TODO: this could definitely be optimized
 */

app.use(function(req, res, next) {
  updateRouteData();
  next();
});

/*
 * Read in routes file and create routes for each method
 */
var mockFile = 'routes.json'; // TODO: add mockFile argv
var routeData;
var updateRouteData = function() {
  routeData = fs.readFileSync(mockFile);
  routeData = JSON.parse(routeData);
}

updateRouteData();

/*
 * Set routes
 */
Object.keys(routeData).forEach(function(route) {
  Object.keys(routeData[route]).forEach(function(method) {
    app[method](route, function(req, res) {
      // TODO: support non-json
      // TODO: support non-200
      res.json(routeData[route][method])
    });
  });
});

/*
 * Start server
 */
var port = 3023; // TODO: add port to argv
app.listen(port);
console.log('Mock server now listening on http://localhost:' + port); 
