const moment = require('moment');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');

        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('parVctParcela')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpQtdParcela', 'servidores.usrNome']);

        return response.json(compras);
    },   
    
    async cmpConvenio (request, response) {
        let id = request.params.idCnv;

        const compras = await connection('compras')
        .where('cmpConvenio', id)
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('cmpId', 'desc')
        .select(['compras.*', 'servidores.usrNome']);

        return response.json(compras);
    },    

    async cmpServidor (request, response) {
        let id = request.params.idSrv;

        const compras = await connection('compras')
        .where('cmpServidor', id)
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .orderBy('cmpId', 'desc')
        .select(['compras.*', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

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
                parVlrParcela: vlrProcess,
                parStaParcela: staParcela,                
            });
            
            const usr = await connection('servidores')
            .where('usrId',servidor)
            .select('usrCartao');

            let nroCartao = usr[0].usrCartao;
            console.log('Cart??o:',nroCartao);

            const updServ = await connection('usrSaldo')
                .where('usrServ',nroCartao)
                .where('usrMes',month)
                .where('usrAno',year)
                .increment({usrVlrUsado: vlrParcela})
                .decrement({usrVlrDisponivel: vlrParcela});
        }
        
        return response.json({cmpId});
    },

    async searchCompras (request, response) {
        let id = request.params.idCmp;

        const compra = await connection('compras')
        .where('cmpId', id)
        .select('*');

        return response.json(compra);
    },   
    
    async datatest (request, response) {
        const dtAtual = moment();

        //console.log(dtAtual.date()); // Imprimindo o dia
        //console.log(dtAtual.month()); // Imprimindo o m??s
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
        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .orderBy('parVctParcela')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpQtdParcela', 'servidores.usrNome']);

        return response.json(compras);

    },

    async cmpOrgVenc (request, response) {
        let datSearch = request.params.datVencto;
        let idOrg = request.params.orgao;
        const compras = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
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
        const total = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .sum({totCmp : 'parVlrParcela'});

        return response.json(total);

    },   

    async totCmpOrgao (request, response) {
        let datSearch = request.params.datVencto;
        let idOrg = request.params.orgao;
        const total = await connection('cmpParcelas')
        .where('parVctParcela', datSearch)
        .where('orgId', idOrg)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('secretarias', 'secId', 'servidores.usrSecretaria')
        .join('orgadmin', 'orgId', 'secretarias.secOrgAdm')
        .sum({totCmp : 'parVlrParcela'});

        return response.json(total);

    },   
};