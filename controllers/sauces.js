const Sauce = require('../models/Sauce');
const fileSystem = require('fs');

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
        .then(sauces => {res.status(200).json(sauces);})
        .catch(error => res.status(400).json({error}));
}

/**
 * Récupère la sauce d'id donné dans la requête
 * @param {*} req 
 * @param {*} res 
 */
exports.getOneSauce = (req, res) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

/**
 * Supprime la sauce d'id donné dans la requête
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteSauce = (req, res) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>{
            const filename = sauce.imageUrl.split('/images/')[1];
            fileSystem.unlink(`images/${filename}`, () =>{
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'sauce supprimée'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
}

/**
 * Modifie la sauce d'id passé dans la requête
 * @param {*} req 
 * @param {*} res 
 */
exports.modifySauce = (req, res) =>{
    let sauceObjet = {};
    if (req.file) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce =>{
                const filename = sauce.imageUrl.split('/images/')[1];
                fileSystem.unlink(`images/${filename}`, ()=>{
                    console.log(req.file.filename);
                });
            })
            .catch(error => res.status(500).json({error}));
        sauceObjet = {
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
    } else{
        sauceObjet = {...req.body};
    }
    Sauce.updateOne({_id: req.params.id}, { ...sauceObjet, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
}