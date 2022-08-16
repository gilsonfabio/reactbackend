const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        response.json({
            message: 'Bem-vindo ao Servidor Sindicaldas!',
        });
    },      
};