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
        console.log(nomeUsuario);
        const emailEnvio = 'gilsonfabio@innvento.com.br';

        const apiKey = "";

        const sgMail = require('@sendgrid/mail')

        //sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        sgMail.setApiKey(apiKey)
        const msg = {
            to: emailUsuario,
            from: `${emailEnvio}`,
            subject: 'Email para Recuperação de senha',
            text: `Email de recuperação de senha servidor ${nomeUsuario}`,
            html: `<p>Olá, ${nomeUsuario}, </br></p><p>Você solicitou um email de recuperação de senha.</p></br> <p>Favor clicar no link abaixo para redefinir sua senha.</p></br>
                    <p><a href="https://sindicaldas.com.br/AltPassword/${emailUsuario}">Link de Recuperação de Senha</a></p>`,
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent')
          })
        .catch((error) => {
            console.error(error)
        })     
        
        return response.json(user);
    }
}

