const express = require('express');
const router = express.Router();

const sauceControl = require('../controllers/sauces');

routeur.post('/', sauceControl.createSauce);