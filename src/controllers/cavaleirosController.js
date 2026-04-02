const service = require('../services/cavaleirosService');
const ApiError = require('../helpers/apiError');

async function create(req, res, next) {
  try {
    const created = service.validateAndCreate(req.body);
    return res.status(201).json(created);
  } catch (err) {
    if (err instanceof ApiError) return res.status(err.status).json({ message: err.message });
    return next(err);
  }
}

module.exports = { create };
