const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceControl.createSauce);
router.get('/', auth, multer, sauceControl.getAllSauce);

module.exports = router;