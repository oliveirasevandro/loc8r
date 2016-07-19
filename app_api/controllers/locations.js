var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

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
    maxDistance: distance,
    num: 10
  };

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      message: 'lng and lat query parameters are required'
    });
    return;
  }

  Loc.geoNear(point, geoOptions, function (err, results) {
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      sendJsonResponse(res, 200, buildLocations(results));
    }
  });
};

module.exports.locationsCreate = function (req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, function (err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
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
      distance: doc.dis,
      name: doc.obj.name,
      address: doc.obj.address,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj._id
    });
  });
  return locations;
}
