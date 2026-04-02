const express = require('express');
const router = express.Router();
const controller = require('../controllers/cavaleirosController');

router.post('/', controller.create);

module.exports = router;
