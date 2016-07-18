var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

module.exports.reviewsReadOne = function (req, res) {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(
        function (err, location) {
          var response, review;

          if (!location) {
            sendJsonResponse(res, 404, {
              message: 'locationid not found'
            });
            return;
          }

          if (err) {
            sendJsonResponse(res, 400, err);
            return;
          }

          if (location.reviews && location.reviews.length > 0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJsonResponse(res, 404, {
                message: 'reviewid not found'
              });
              return;
            }

            response = {
              location: {
                name: location.name,
                id: req.params.locationid
              },
              review: review
            };
            sendJsonResponse(res, 200, response);
            return;
          }

          sendJsonResponse(res, 404, {
            message: 'No reviews found'
          });
          return;
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      message: 'Not found, locationid and reviewid are both required'
    });
  }
};

module.exports.reviewsUpdateOne = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

module.exports.reviewsDeleteOne = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
}
