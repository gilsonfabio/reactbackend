const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const admins = await connection('administrator').select('*');
    
        return response.json(admins);
    },    

    async signIn(request, response) {
        let email = request.params.email;
        let senha = request.params.password;

        var encodedVal = crypto.createHash('md5').update(senha).digest('hex');
        const admin = await connection('administrator')
            .where('admEmail', email)
            .where('admSenha', encodedVal)
            .select('admId', 'admNome', 'admNivAcesso')
            .first();
          
        if (!admin) {
            return response.status(400).json({ error: 'Não encontrou usuario com este ID'});
        } 

        return response.json(admin);
    },

    async login(request, response) {
        const { email, password } = request.body;

        var senha = crypto.createHash('md5').update(password).digest('hex');
        const admin = await connection('administrator')
            .where('admEmail', email)
            .where('admSenha', senha)
            .select('admId', 'admNome', 'admNivAcesso')
            .first();
          
        if (!admin) {
            return response.status(400).json({ error: 'Não encontrou usuario com este ID'});
        } 

        return response.json(admin);
    },

    async create(request, response) {
        const { admNome, admSenha, admEmail, admNivAcesso } = request.body;
    
        var senha = crypto.createHash('md5').update(usrSenha).digest('hex');
        const [admId] = await connection('administrator').insert({
            admNome, 
            admSenha: senha, 
            admEmail,
            admNivAcesso
        });
           
        return response.json({admId});
    },
     
    async searchAdmin (request, response) {
        let id = request.params.idAdm;
        const admin = await connection('administrator')
        .where('admId', id)        
        .select(['*']);
        
        return response.json(admin);
    },

    async updPassword(request, response) {
        let email = request.params.emailUsuario;         
        const { password } = request.body;
        
        let datUpdate = new Date();

        var senha = crypto.createHash('md5').update(password).digest('hex');

        await connection('administrator').where('admEmail', email)   
        .update({
            admSenha: senha,           
        });
           
        return response.status(204).send();
    },
};
