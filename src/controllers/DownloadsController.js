const connection = require('../database/connection');
const fs = require('fs');
const sendmail = require('../database/sendmail')({silent: true})

module.exports = {   
    async downTexto (request, response) {
        
        const secretarias = await connection('secretarias')
        .select('secDescricao')
        .orderBy('secDescricao');

        var nome_arquivo = 'arquivo.txt'

        for (secretaria of secretarias) {
            console.log(`${secretaria['secDescricao']}`)
            const data = `${secretaria['secDescricao']}`
            fs.appendFileSync(nome_arquivo, data + '\n', (err) => {
                if (err) throw err;
                console.log('O arquivo foi criado!');
            })
        }

        pathToAttachment = `arquivo.txt`;
        attachment = fs.readFileSync(pathToAttachment).toString('utf8')

        const emailUsuario = 'gilsonfabio@gmail.com';
        const nomeUsuario = 'Gilson Fábio';
        const link = '';
        const emailEnvio = 'no-reply@aparecida.go.gov.br';

        sendmail({
            from: `${emailEnvio}`,
            to: emailUsuario,
            subject: 'test sendmail',
            attachments: [
                {
                  content: attachment,
                  filename: "arquivo.txt",
                  type: "text/plain",
                  disposition: "attachment"
                }
            ],
            html: `<h1>Email de Recuperação de Senha</h1></b></b><p>Olá, ${nomeUsuario}, </br></p><p>Você solicitou um email de recuperação de senha.</p></br> <p>Favor clicar no link abaixo para redefinir sua senha.</p></br>
            <p><a href="http://10.111.139.131:3000/NewPassword/:${emailUsuario}">Link de Recuperação de Senha</a></p>`,
        }, function(err, reply) {
            //console.log(err && err.stack);
            //console.dir(reply);
            
            return response.json(secretarias);

        });       

    }          
};
