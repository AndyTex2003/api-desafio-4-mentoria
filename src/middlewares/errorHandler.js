function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // If error has status and message, use it
  if (err && err.status && err.message) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err && err.stack ? err.stack : err);
  return res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = errorHandler;
