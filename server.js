const http = require('http');
const app = require('./app');

/**
 * Renvoi un port valide qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
 * @param {*} val 
 * @returns port
 */
const normalizePort = val =>{
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    };
    if (port >= 0){
        return port;
    };
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Recherche les différentes erreurs et les gère de manière appropriée
 * Elle est ensuite enregistrée dans le serveur
 * @param {*} error 
 */
const errorHandler = error =>{
    if (error.syscall !== 'listen'){
        throw error;
    };
    const address = server.adress();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch (error.code){
        case 'EACCES':
            console.error(bind + 'requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

/**
 * consigne le port ou le canal nommé sur lequel le serveur s'éxécute dans la console.
 */
 server.on('error', errorHandler);
 server.on('listening', () =>{
     const address = server.address();
     const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
     console.log('listening on ' + bind);
 });

server.listen(port);