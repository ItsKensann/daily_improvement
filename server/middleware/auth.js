module.exports = {
  // middleware function to check if passport successfully attach a user to this request
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      // passes the req object to the controller
      return next();
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  },
};
