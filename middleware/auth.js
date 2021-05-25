const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodatedToken = jsonWebToken.verify(token, 'RANDOM_TOKEN_SECRET');
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