const Sauce = require('../models/Sauce');

/**
 * Création d'une sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createSauce = (req, res, next) =>{
    const sauceObjet = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({error}));
};

/**
 * Renvoi un tableau contenant toutes les sauces
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllSauce = (req, res) =>{
    Sauce.find()
        .then(sauces => {res.status(200).json(sauces); console.log(sauces[0]);})
        .catch(error => res.status(400).json({error}));
}