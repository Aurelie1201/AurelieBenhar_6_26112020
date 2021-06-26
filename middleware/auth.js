const jsonWebToken = require('jsonwebtoken');

/**
 * Vérification du jeton de l'utilisateur
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1]; //récupération du token dans le header
        const decodatedToken = jsonWebToken.verify(token, process.env.TOKEN_KEY);
        const userId = decodatedToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        } else{
            next();
        }
    } catch (error){
        res.status(401).json({error: error});
    }
};