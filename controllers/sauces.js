const Sauce = require('../models/Sauce');
const fileSystem = require('fs');
// const { allowedNodeEnvironmentFlags } = require('process');

/**
 * Création d'une sauce
 * @param {Object} req 
 * @param {Object} res
 */
exports.createSauce = (req, res) =>{
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
 * @param {Array} res 
 */
exports.getAllSauce = (req, res) =>{
    Sauce.find()
        .then(sauces => {res.status(200).json(sauces);})
        .catch(error => res.status(400).json({error}));
};

/**
 * Récupère la sauce d'id donné dans la requête
 * @param {*} req 
 * @param {Object} res 
 */
exports.getOneSauce = (req, res) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {res.status(200).json(sauce);
        console.log(sauce.usersLiked);})
        .catch(error => res.status(404).json({error}));
};

/**
 * Supprime la sauce d'id donné dans la requête
 * @param {*} req 
 * @param {Object} res 
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
 * @param {Object} res 
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
};

/**
 * Ajoute ou supprime un like ou un dislike
 * @param {Object} req 
 * @param {Object} res 
 */
exports.likeSauce = (req, res) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>{
            const like = req.body.like;
            const userId = req.body.userId;
            let sauceUpdate = {};
            switch (like){
                case 1 : {
                    if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)){
                        alerte('Vous avez déjà effectué un choix pour cette sauce');
                        res.status(400).json({message: 'utilisateur ayant déjà fait un choix de préférence pour cette sauce'});
                    } else{
                        console.log('coucou');
                        sauceUpdate = this.choiceLike(sauce, userId);
                        Sauce.updateOne({_id: req.params.id}, { ...sauceUpdate, _id: req.params.id})
                            .then(() => res.status(201).json({message: 'like ajouté'}))
                            .catch(error => res.status(400).json({error}));
                        };
                };
                break;
                case 0 : {
                    console.log('Demande d annulation');
                    sauceUpdate = this.changeChoice(sauce, userId);
                    console.log(sauceUpdate);
                    Sauce.updateOne({_id: req.params.id}, {...sauceUpdate, _id: req.params.id})
                        .then(() => res.status(201).json({message: 'Choix annulé'}))
                        .catch(error => res.status(400).json({error}));
                    };
                break;
                case -1 : {
                    if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)){
                        alerte('Vous avez déjà effectué un choix pour cette sauce');
                        res.status(400).json({message: 'utilisateur ayant déjà fait un choix de préférence pour cette sauce'});
                    } else{
                        console.log('coucou');
                        sauceUpdate = this.choiceDislike(sauce, userId);
                        Sauce.updateOne({_id: req.params.id}, { ...sauceUpdate, _id: req.params.id})
                            .then(() => res.status(201).json({message: 'dislike ajouté'}))
                            .catch(error => res.status(400).json({error}));
                        };
                };
                break;
            };
            console.log('tableau des jaime de la sauce : ' +sauce.usersLiked);
            console.log('les jaime de la sauce : ' + sauce.likes);
            console.log('userId : ' + req.body.userId);
        })
        .catch(error => res.status(500).json({error}));
};
/**
 * Ajoute un like et le userId aux likes et usersLiked de la sauce passée en paramètre
 * @param {object} sauce 
 * @param {string} userId 
 * @returns {object} 
 */
exports.choiceLike = (sauce, userId) =>{
    console.log('fonction');
    sauce.usersLiked.push(userId);
    const newUsersLiked = sauce.usersLiked;
    const newLikes = sauce.likes +1;
    const sauceUpdate = {usersLiked: newUsersLiked, likes: newLikes};
    return sauceUpdate;
};

/**
 * Retire un like ou un dislike et le userId du tableau correspondant à la sauce passée en paramètre
 * @param {object} sauce 
 * @param {string} userId 
 * @returns {object}
 */
exports.changeChoice = (sauce, userId) =>{
    let sauceUpdate = {};
    if(sauce.usersLiked.includes(userId)){
        const index = sauce.usersLiked.indexOf(userId);
        sauce.usersLiked.splice(index, 1);
        const newUsersLiked = sauce.usersLiked;
        const newLikes = sauce.likes - 1;
        sauceUpdate = {usersLiked: newUsersLiked, likes: newLikes};
    };
    if(sauce.usersDisliked.includes(userId)){
        const index = sauce.usersDisliked.indexOf(userId);
        sauce.usersDisliked.splice(index, 1); //Retire l'élément qui est à la position 'index' dans le tableau
        const newUsersDisliked = sauce.usersDisliked;
        const newDislikes = sauce.dislikes - 1;
        sauceUpdate = {usersDisliked: newUsersDisliked, dislikes: newDislikes};
    };
    return sauceUpdate;
};

/**
 * Ajoute un dislike et le userId aux dislikes et usersDisliked de la sauce passée en paramètre
 * @param {object} sauce 
 * @param {string} userId 
 * @returns {object}
 */
exports.choiceDislike = (sauce, userId) =>{
    console.log('fonction');
    sauce.usersDisliked.push(userId);
    const newUsersDisliked = sauce.usersDisliked;
    const newDislikes = sauce.dislikes +1;
    const sauceUpdate = {usersDisliked: newUsersDisliked, dislikes: newDislikes};
    return sauceUpdate;
};