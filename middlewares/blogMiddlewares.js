const isAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/");
  }
  next();
};

module.exports = isAuthenticated;
