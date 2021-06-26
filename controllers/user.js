const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const key = CryptoJs.enc.Hex.parse(process.env.CRYPTO_KEY);
const iv = CryptoJs.enc.Hex.parse(process.env.CRYPTO_IV);

/**
 * Vérification d'un mail d'une apparence valide
 * @param {String} mail 
 * @returns {Boolean}
 */
const testMail = (mail) =>{
    let regMail = new RegExp ("^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}");
    console.log("coucou mail");
    return regMail.test(mail);
};

/**
 * Vérification d'un mot de passe contenant au moins 8 caractères
 * et contenant des chiffres, des lettres et seulement ._- comme caractères spéciaux
 * @param {String} password 
 * @returns {Boolean}
 */
const testPassword = (password) =>{
    let regPassword = new RegExp ("^[0-9a-zA-Z._-]{8,}");
    console.log("coucou password");
    return regPassword.test(password);
};

/**
 * Création d'un nouvel utilisateur
 * @param {Object} req 
 * @param {Object} res 
 */
exports.signup = (req, res) =>{
    if (!testMail(req.body.email)){
        res.status(400).json({message: "Adresse email non valide"});
    } else if (!testPassword(req.body.password)){
        res.status(400).json({message: "Le mot de passe choisi n'est pas valide"})
    } else{
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const cryptMail = CryptoJs.AES.encrypt(req.body.email, key, {iv: iv}).toString();
                const user = new User({
                    email: cryptMail,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({message: 'utilisateur créé'}))
                    .catch(error => {res.status(400).json({error});
                    console.log(user);});
            })
            .catch(error => res.status(500).json({error}));
    }
};

/**
 * Connexion d'un utilisateur en lui fournissant un jeton d'authentification
 * @param {Object} req 
 * @param {Object} res 
 */
exports.login = (req, res) =>{
    const cryptMail = CryptoJs.AES.encrypt(req.body.email, key, {iv: iv}).toString();
    console.log(cryptMail);
    User.findOne({email: cryptMail})
        .then(user =>{
            if (!user){
                return res.status(401).json({error: 'Utilisateur inexistant'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid =>{
                    if (!valid){
                        return res.status(401).json({error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonWebToken.sign(
                            {userId: user._id},
                            process.env.TOKEN_KEY,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));
};