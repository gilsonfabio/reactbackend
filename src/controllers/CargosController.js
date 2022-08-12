const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const cargos = await connection('cargos').select('*');
    
        return response.json(cargos);
    },    

    async create(request, response) {
        const { crgDescricao } = request.body;
 
        const [crgId] = await connection('cargos').insert({
            crgDescricao
        });
           
        return response.json({crgId});
    },

    async searchCargo (request, response) {
        let id = request.params.idTxa;

        const cargo = await connection('cargos')
        .where('crgId', id)
        .select('*');

        return response.json(cargo);
    },    
};