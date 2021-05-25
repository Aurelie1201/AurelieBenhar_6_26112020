const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) =>{
    const sauceObjet = JSON.parse(req.body.sauce);

    const sauce = new Sauce({
        ...sauceObjet,
        
    })
}