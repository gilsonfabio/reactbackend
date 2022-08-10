const connection = require('../database/connection');
const sendmail = require('../database/sendmail')({silent: true})

module.exports = { 
    async enviaEmail(request, response) {
        const emailUsuario = request.params.email;
        const user = await connection('servidores')
            .where('usrEmail', emailUsuario)
            .select('usrNome')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuario com este ID'});
        } 

        const nomeUsuario = user.usrNome;
        const link = '';
        const emailEnvio = 'no-reply@innvcard.com.br';

        sendmail({
            from: `${emailEnvio}`,
            to: emailUsuario,
            subject: 'test sendmail',
            html: `<p>Olá, ${nomeUsuario}, </br></p><p>Você solicitou um email de recuperação de senha.</p></br> <p>Favor clicar no link abaixo para redefinir sua senha.</p></br>
            <p><a href="http://10.111.139.131:3000/NewPassword/:${emailUsuario}">Link de Recuperação de Senha</a></p>`,
        }, function(err, reply) {
            //console.log(err && err.stack);
            //console.dir(reply);
            
            return response.json(user);

        });
    }
}