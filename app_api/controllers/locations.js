var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (function () {
  var earthRadius = 6371; //km, miles is 3959

  function getDistanceFromRads(rads) {
    return parseFloat(rads * earthRadius);
  }

  function getRadsFromDistance(distance) {
    return parseFloat(distance / earthRadius);
  }

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

module.exports.locationsListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var distance = parseInt(req.query.distance, 10) || 20;

  console.log('lat: ' + lat + ' lng: ' + lng + ' distance: ' + distance);

  var point = {
    type: 'Point',
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(distance),
    num: 10
  };

  Loc.geoNear(point, geoOptions, function (err, results) {
    if (err) {
      console.log('error:', err);
    }
    sendJsonResponse(res, 200, buildLocations(results));
  });
};

module.exports.locationsCreate = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function (err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {message: 'locationid not found!'});
          return;
        }
        if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
      });
  } else {
    sendJsonResponse(res, 404, {message: 'No locationid in request'});
  }

};

module.exports.locationsUpdateOne = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

module.exports.locationsDeleteOne = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

function sendJsonResponse(res, status, content) {
  res.status(status).json(content);
}

function buildLocations(results) {
  var locations = [];

  results.forEach(function (doc) {
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
}
