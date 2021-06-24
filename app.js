const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');
const limiter = rateLimit({windowMs: 10*60*1000, max: 100}); //Le client pourra effectuer 100 requêtes toutes les 10 min

mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0.ahins.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');//Toutes les origines ont le droit d'accéder au serveur
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());//Remplace bodyParser.json()

app.use(helmet()); //Sécurise les en-têtes HTTP
app.use(mongoSanitize()); //Désinfecte les données pour éviter les attaques par injection noSQL
app.use(limiter); //La limite des 100 requêtes est appliquée à toutes les routes

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;