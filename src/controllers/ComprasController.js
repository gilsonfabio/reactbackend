const moment = require('moment');
const connection = require('../database/connection');
require('dotenv/config');

const nodemailer = require("nodemailer");

module.exports = {   
    async index (request, response) {
        let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        let status = 'A';
        //const votHora = moment().format('hh:mm:ss');

        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('parStaParcela', status)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('parVctParcela')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpQtdParcela', 'servidores.usrNome']);

        return response.json(compras);
    },   
    
    async cmpConvenio (request, response) {
        let id = request.params.idCnv;
        let status = 'A';
        const compras = await connection('compras')
        .where('cmpConvenio', id)
        .where('cmpStatus', status)
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('cmpId', 'desc')
        .limit(20)
        .select(['compras.*', 'servidores.usrNome']);

        return response.json(compras);
    },    

    async cmpServidor (request, response) {
        let id = request.params.idSrv;
        let status = 'A';

        const compras = await connection('compras')
        .where('cmpServidor', id)
        .where('cmpStatus', status)
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .limit(20)
        .orderBy('cmpId', 'desc')
        .select(['compras.*', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        return response.json(compras);
    },  
    
    async dadCompra (request, response) {
        let id = request.params.idCmp;
        let status = 'A';

        const compras = await connection('compras')
        .where('cmpId', id)
        .where('cmpStatus', 'A')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .orderBy('cmpId', 'desc')
        .select(['compras.*', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        console.log(compras)
        
        return response.json(compras);
    },  

    async create(request, response) {
        const { cmpEmissao, cmpHorEmissao, cmpConvenio, cmpQtdParcela, cmpVlrCompra, cmpServidor, cmpCodSeguranca, cmpStatus } = request.body;
         
        let servidor = request.body.cmpServidor;
          
        const [cmpId] = await connection('compras').insert({
            cmpEmissao, 
            cmpHorEmissao, 
            cmpConvenio, 
            cmpQtdParcela, 
            cmpVlrCompra, 
            cmpServidor, 
            cmpCodSeguranca, 
            cmpStatus        
        });

        var datProcess = new Date();
        var year = datProcess.getFullYear();
        var month = datProcess.getMonth();
        var day = 15;

        const horProcess = moment().format('hh:mm:ss');        
        const idCompra = cmpId;    
        
        let vlrResto = cmpVlrCompra % cmpQtdParcela;
        let vlrParcela = ((cmpVlrCompra - vlrResto) / cmpQtdParcela);
        
        //console.log(cmpVlrCompra);
        //console.log(vlrResto);
        //console.log(vlrParcela);

        let staParcela = 'A';
        
        for (var i = 1; i <= cmpQtdParcela; i++) {
            var parcela = i;

            month = month + 1;
            if (month === 13) {
                month = 1;
                year = year + 1; 
            }

            var vctParcela = new Date(year,month,day);

            let vlrProcess = 0;
            if (i === 1 ) {
               vlrProcess = vlrParcela + vlrResto; 
            }else {
               vlrProcess = vlrParcela; 
            }
            
            const [parId] = await connection('cmpParcelas').insert({
                parIdCompra: idCompra,
                parNroParcela: parcela,
                parVctParcela: vctParcela,
                parVlrCompra: vlrProcess,
                parVlrParcela: vlrProcess,
                parStaParcela: staParcela,                
            });

            const cnv = await connection('convenios')
            .where('cnvId',cmpConvenio)
            .join('txaadmin', 'txaId', 'convenios.cnvAtividade')
            .select(['cnvId','txaadmin.txaPerc']);
            
            let perSist = 25;
            let auxParcela = vlrProcess;
            let auxTaxa = ((auxParcela * cnv.txaPerc) / 100);
            let auxLiquido = auxParcela - auxTaxa; 
            let auxSistema = ((auxTaxa * perSist) / 100);

            const updConv = await connection('totVdaCnv')
            .where('tcnvId',cmpConvenio)
            .where('tcnvMes',month)
            .where('tcnvAno',year)
            .increment({tcnvVlrTotal: auxParcela})
            .increment({tcnvVlrTaxa: auxTaxa})
            .increment({tcnvVlrLiquido: auxLiquido})
            .increment({tcnvVlrSistema: auxSistema});

            if (!updConv) {
                const [totaliza] = await connection('totVdaCnv').insert({
                    tcnvId: idCnv,
                    tcnvAno: year,
                    tcnvMes: month,
                    tcnvVlrTotal: auxParcela,
                    tcnvVlrTaxa: auxTaxa,
                    tcnvVlrLiquido: auxLiquido,
                    tcnvVlrSistema: auxSistema,                
                });
            }

            const usr = await connection('servidores')
            .where('usrId',servidor)
            .select('usrCartao');

            let nroCartao = usr[0].usrCartao;
            console.log('Cartão:',nroCartao);

            const updServ = await connection('usrSaldo')
                .where('usrServ',nroCartao)
                .where('usrMes',month)
                .where('usrAno',year)
                .increment({usrVlrUsado: vlrParcela})
                .decrement({usrVlrDisponivel: vlrParcela});
        }

        const conv = await connection('convenios')
        .where('cnvId', cmpConvenio)
        .select('cnvEmail', 'cnvNomFantasia')
        .first();

        if (!conv) {
            return response.status(400).json({ error: 'Não encontrou usuario com este email'});
        } 

        let codUsuario = conv.cnvId;
        let emailCco = conv.cnvEmail; 
        let nomFantasia = conv.cnvNomFantasia;
        
        const user = await connection('servidores')
        .where('usrId', cmpServidor)
        .select('usrEmail', 'usrId', 'usrNome')
        .first();

        if (!conv) {
            return response.status(400).json({ error: 'Não encontrou usuario com este email'});
        } 

        let codDest = user.usrId;
        let emailDest = user.usrEmail;
        let nomeUsuario = user.usrNome;

        const admEmail = process.env.EMAIL_USER;
        console.log('Email usuario:', admEmail)

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailSent = await transporter.sendMail({
            text: "Texto do E-mail teste",
            subject: "Assunto do e-mail",
            from: `${nomFantasia} - ${nomeUsuario} ` ,
            to: [`${emailDest}, ${emailCco}`],
            html: `<p>Olá, ${nomeUsuario}, </br></p><p>Você realizou uma compra no seu cartão Sindicaldas.</p></br> <p>Convênio: ${nomFantasia} Valor: ${cmpVlrCompra}</p></br> 
                    <p>Obrigado!</p>`
                            
        });
        console.log(mailSent);
        return response.status(200).send();  
        
        //return response.json({cmpId});
    },

    async searchCompras (request, response) {
        let id = request.params.idCmp;
        let status = 'A';

        const compra = await connection('compras')
        .where('cmpId', id)
        .where('cmpStatus', status)
        .select('*');

        return response.json(compra);
    },   
    
    async datatest (request, response) {
        const dtAtual = moment();

        //console.log(dtAtual.date()); // Imprimindo o dia
        //console.log(dtAtual.month()); // Imprimindo o mês
        //console.log(dtAtual.year()); // Imprimindo o ano
        //console.log(dtAtual.hour()); // Imprimindo a hora
        //console.log(dtAtual.minute()); // Imprimindo os minutos
        //console.log(dtAtual.second()); // Imprimindo os segundos

        var year = dtAtual.year();
        var month = dtAtual.month();
        var day = 15;
        
        //dtAtual.add(1, "M");
        //console.log('inicial:', dtAtual);

        for(var i=1; i <= 10; i++) {
            dtAtual.add(1, "M");
            //console.log(i, dtAtual.format('DD/MM/YYYY'));
        }
    },  

    async cmpVencto (request, response) {
        let datSearch = request.params.datVencto;
        let status = 'A';

        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('parStaParcela', status)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('parVctParcela')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpQtdParcela', 'servidores.usrNome']);

        return response.json(compras);

    },

    async cmpOrgVenc (request, response) {
        let datSearch = request.params.datVencto;
        let idOrg = request.params.orgao;
        let status = 'A';
        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('parStaParcela', status)
        .where('orgId', idOrg)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('secretarias', 'secId', 'servidores.usrSecretaria')
        .join('orgadmin', 'orgId', 'secretarias.secOrgAdm')
        .orderBy('parVctParcela')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpQtdParcela', 'servidores.usrNome', 'secretarias.secDescricao', 'orgadmin.orgId', 'orgadmin.orgDescricao']);

        return response.json(compras);

    },

    async totCompras (request, response) {
        let datSearch = request.params.datVencto;
        let status = 'A';
        const total = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('parStaParcela', status)
        .sum({totCmp : 'parVlrParcela'});

        return response.json(total);

    },   

    async totCmpOrgao (request, response) {
        let datSearch = request.params.datVencto;
        let idOrg = request.params.orgao;
        let status = 'A';
        
        const total = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('parStaParcela', status)
        .where('orgId', idOrg)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('secretarias', 'secId', 'servidores.usrSecretaria')
        .join('orgadmin', 'orgId', 'secretarias.secOrgAdm')
        .sum({totCmp : 'parVlrParcela'});

        return response.json(total);

    },   

    async cncCompra(request, response) {
         
        let id = request.params.idCmp;
        const { cmpIdCanc } = request.body;
         
        let administrador = request.body.cmpIdCanc;
        let datCanc = new Date; 
        let status = 'C';      
        const cncCompra = await connection('compras')
            .where('cmpId',id)
            .update(
                cmpResCancel = administrador,
                cmpDatCancel = datCanc,
                cmpStatus = status
            );
                
        const cncParcelas = await connection('cmpParcelas')
            .where('parIdCompra',id)
            .update(
                parStaParcela = status,
            )

        return response.json({cncCompra});
    },
    
};