const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const key = CryptoJs.enc.Hex.parse(process.env.CRYPTO_KEY);
const iv = CryptoJs.enc.Hex.parse(process.env.CRYPTO_IV);

exports.signup = (req, res) =>{
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
};

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