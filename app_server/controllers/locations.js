/* Get Home Page */
module.exports.homelist = function(req, res) {
  res.render('locations-list', { title: 'Home' });
}

/* Get Location Info Page */
module.exports.locationInfo = function(req, res) {
  res.render('index', { title: 'Location Info' });
}

/* Get Add Review Page */
module.exports.addReview = function(req, res) {
  res.render('index', { title: 'Add Review' });
}
