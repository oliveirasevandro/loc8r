var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
  var locationid = req.params.locationid;

  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function (err, location) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else if (location) {
            doAddReview(req, res, location);
          } else {
            sendJsonResponse(res, 404, {
              message: 'locationid not found'
            });
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      message: 'Not found, locationid required'
    });
  }
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

function doAddReview(req, res, location) {
  location.reviews.push({
    author: req.body.author,
    rating: req.body.rating,
    reviewText: req.body.reviewText
  });

  location.save(function (err, loc) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      updateAverageRating(location._id);
      sendJsonResponse(res, 201, loc.reviews.pop());
    }
  });

}

function updateAverageRating(locationid) {
  Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(function (err, location) {
      if (!err) {
        doSetAverageRating(location);
      }
    });
}

function doSetAverageRating(location) {
  var ratingAverage, ratingTotal;

  if (location.reviews) {
    //calculates the average
    ratingTotal = location.reviews
      .map(review => review.rating)
      .reduce((a, b) => {
        return a + b;
      }, 0);

    ratingAverage = parseInt(ratingTotal / location.reviews.length, 10);
    location.rating = ratingAverage;
    location.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Average rating updated to ', ratingAverage);
      }
    });
  }
}

function sendJsonResponse(res, status, content) {
  res.status(status);
  res.json(content);
}
