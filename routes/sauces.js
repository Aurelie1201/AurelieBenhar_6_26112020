const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceControl.createSauce);
router.get('/', auth, sauceControl.getAllSauce);
router.get('/:id', auth, sauceControl.getOneSauce);
router.delete('/:id', auth, sauceControl.deleteSauce);
router.put('/:id', auth, multer, sauceControl.modifySauce);
router.post('/:id/like', sauceControl.likeSauce);

module.exports = router;