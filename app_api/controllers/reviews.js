// var mongoose = require('mongoose');
//var Loc = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
};

module.exports.reviewsReadOne = function (req, res) {
  sendJsonResponse(res, 200, {status: 'success'});
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
