const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Sindicaldas!',
    });
});

routes.get('/users', UsersController.index);
routes.get('/signIn/:email/:password', UsersController.signIn);
routes.post('/newuser', UsersController.create);
routes.get('/searchUser/:idUsr', UsersController.searchUser);
routes.put('/newpassword/:emailUsuario', UsersController.updPassword);
routes.get('/verUsuario/:email', UsersController.searchEmail);
routes.get('/findUser/:cartao', UsersController.findUser);
routes.get('/busServ/:cartao/:password', UsersController.busServ);
routes.get('/loginUsr/:cartao/:password', UsersController.loginUsr);
routes.get('/verifUser/:cartao', UsersController.verifUser);
routes.put('/altservidor/:idSrv', UsersController.updServidor);
routes.get('/classUser/:search', UsersController.classUser);

module.exports = routes;
