function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "couponfeed.co"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
