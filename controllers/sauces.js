const Sauce = require('../models/Sauce');

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