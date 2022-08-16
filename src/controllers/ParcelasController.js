const connection = require('../database/connection');

module.exports = {   
    async parcelas (request, response) {
        var usrTipo = request.params.tipUser;

        const parc = await connection('parcelas')
        .where('parTipServ',usrTipo)
        .select('*');
        
        return response.json(parc);
    },       
};