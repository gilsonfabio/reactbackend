const moment = require('moment');
const connection = require('../database/connection');

module.exports = {   
    async pdfVdaEmissao (request, response) {
        let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const compras = await connection('compras')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .select(['compras.*', 'servidores.usrNome']);

        return response.json(compras);
    }, 

    async pdfVdaVenc (request, response) {
        //let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        let inicio = request.params.dataInicial;
        let final = request.params.dataFinal;
  
        console.log(inicio);
        console.log(final);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const vctcompras = await connection('cmpParcelas')
        .where('parVctParcela','>=', inicio)
        .where('parVctParcela','<=', final)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        return response.json(vctcompras);
    }, 

    async pdfVctOrgao (request, response) {
        //let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        let inicio = request.params.dataInicial;
        let final = request.params.dataFinal;
        let idOrg = request.params.orgId;

        console.log(inicio);
        console.log(final);
        console.log(idOrg);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const vctcompras = await connection('cmpParcelas')
        .where('parVctParcela','>=', inicio)
        .where('parVctParcela','<=', final)
        .where('orgId', idOrg)
        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .join('secretarias', 'secId', 'servidores.usrSecretaria')
        .join('orgadmin', 'orgId', 'secretarias.secOrgAdm')
        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrNome', 'convenios.cnvNomFantasia','secretarias.secOrgAdm', 'orgadmin.orgId']);

        return response.json(vctcompras);
    }, 
              
};
