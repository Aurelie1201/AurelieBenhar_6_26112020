const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauces');

router.post('/', sauceControl.createSauce);

module.exports = router;