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

    async pdfCmpEmissao (request, response) {
        let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const compras = await connection('compras')
        .join('servidores', 'usrId', 'compras.cmpServidor')
        .join('convenios', 'cnvId', 'compras.cmpConvenio')
        .select(['compras.*', 'servidores.usrNome', 'convenios.cnvId', 'convenios.cnvNomFantasia']);

        return response.json(compras);
    }, 

    async pdfVdaVenc (request, response) {
        //let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        let inicio = request.params.dataInicial;
        let final = request.params.dataFinal;
  
        //console.log(inicio);
        //console.log(final);

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

    async pdfVctCmpSrv (request, response) {
        let inicio = request.params.datInicial;
        let final = request.params.datFinal;
        let servidor = request.params.codServidor;

        console.log(inicio);
        console.log(final);
        console.log(servidor);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const vctcompras = await connection('cmpParcelas')
            .where('parVctParcela','>=', inicio)
            .where('parVctParcela','<=', final)
            .where('servidores.usrId', servidor)
            .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
            .join('servidores', 'usrId', 'compras.cmpServidor')
            .join('convenios', 'cnvId', 'compras.cmpConvenio')
            .select(['cmpParcelas.*', 'compras.cmpId', 'compras.cmpQtdParcela', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpVlrCompra', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        return response.json(vctcompras);
    }, 

    async pdfVctCmpCnv (request, response) {
        let inicio = request.params.datInicial;
        let final = request.params.datFinal;
        let convenio = request.params.codConvenio;

        let ano = inicio.substring(6,4);
        let mes = inicio.substring(3,2);
        let dia = inicio.substring(0,2);
        let relInicio = new Date(ano,mes,dia);

        let anofinal = final.substring(6,4);
        let mesfinal = final.substring(3,2);
        let diafinal = final.substring(0,2);
        let relFinal = new Date(anofinal,mesfinal,diafinal);

        //console.log(inicio);
        //console.log(final);
        //.log(convenio);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const vctcompras = await connection('cmpParcelas')
            .where('parVctParcela','>=', relInicio)
            .where('parVctParcela','<=', relFinal)
            .where('convenios.cnvId', convenio)
            .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
            .join('servidores', 'usrId', 'compras.cmpServidor')
            .join('convenios', 'cnvId', 'compras.cmpConvenio')
            .select(['cmpParcelas.*', 'compras.cmpId', 'compras.cmpQtdParcela', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'compras.cmpVlrCompra', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        return response.json(vctcompras);
    }, 

    async pdfEmiCmpCnv (request, response) {
        let inicio = request.params.datInicial;
        let final = request.params.datFinal;
        let convenio = request.params.codConvenio;

        //console.log(inicio);
        //console.log(final);
        //console.log(convenio);

        let ano = inicio.substring(6,4);
        let mes = inicio.substring(3,2);
        let dia = inicio.substring(0,2);
        let relInicio = new Date(ano,mes,dia);

        let anofinal = final.substring(6,4);
        let mesfinal = final.substring(3,2);
        let diafinal = final.substring(0,2);
        let relFinal = new Date(anofinal,mesfinal,diafinal);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        const emicompras = await connection('compras')
            .where('cmpEmissao','>=', relInicio)
            .where('cmpEmissao','<=', relFinal)
            .where('cmpConvenio', convenio)
            .join('servidores', 'usrId', 'compras.cmpServidor')
            .join('convenios', 'cnvId', 'compras.cmpConvenio')
            .select(['compras.*', 'servidores.usrNome', 'convenios.cnvNomFantasia']);

        return response.json(emicompras);
    }, 

    async pdfVctOrgao (request, response) {
        //let datSearch = moment('2022-01-15').format('YYYY-MM-DD');
        //const votHora = moment().format('hh:mm:ss');
        
        let inicio = request.params.dataInicial;
        let final = request.params.dataFinal;
        let idOrg = request.params.orgId;

        //console.log(inicio);
        //console.log(final);
        //console.log(idOrg);

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
             
        //console.log(vctcompras);
           
        return response.json(vctcompras);
    }, 

    async cmpPeriodo (request, response) {
        let inicio = request.params.datInicio;
        let final = request.params.datFinal;
        let cnpjCnv = request.params.convenio;
        let cpfSrv = request.params.servidor;

        //console.log('inicio:', inicio);
        //console.log('final:', final);
        //console.log('convenio:', cnpjCnv);
        //console.log('servidor:', cpfSrv);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('compras')
                .where('cmpEmissao','>=', inicio)
                .where('cmpEmissao','<=', final)
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
            return response.json(result1);
        }else {
            if (cnpjCnv === '0' && cpfSrv !== '0') {
                const result2 = await connection('compras')
                    .where('cmpEmissao','>=', inicio)
                    .where('cmpEmissao','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                return response.json(result2);    
            }else{
                if (cnpjCnv !== '0' && cpfSrv === '0') {
                    const result3 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)                    
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result3);
                }else {
                    const result4 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                  
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result4);     
                }
            }
        }     
    }, 

    async somCompras (request, response) {
        let inicio = request.params.datInicio;
        let final = request.params.datFinal;
        let cnpjCnv = request.params.convenio;
        let cpfSrv = request.params.servidor;
        
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('compras')
                .where('cmpEmissao','>=', inicio)
                .where('cmpEmissao','<=', final)
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .sum({totCmp : 'cmpVlrCompra'});
            return response.json(result1);
        }else {
            if (cnpjCnv === '0' && cpfSrv !== '0') {
                const result2 = await connection('compras')
                    .where('cmpEmissao','>=', inicio)
                    .where('cmpEmissao','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .sum({totCmp : 'cmpVlrCompra'});
                return response.json(result2);    
            }else{
                if (cnpjCnv !== '0' && cpfSrv === '0') {
                    const result3 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)                    
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .sum({totCmp : 'cmpVlrCompra'});
                    return response.json(result3);
                }else {
                    const result4 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                  
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .sum({totCmp : 'cmpVlrCompra'});
                    return response.json(result4);    
                }
            }
        }     
    },
    
    async pdfCmpEmis (request, response) {
        let inicio = request.params.dataInicio;
        let final = request.params.dataFinal;
        let cnpjCnv = request.params.cnpjCnv;
        let cpfSrv = request.params.cpfSrv;

        //console.log('inicio:', inicio);
        //console.log('final:', final);
        //console.log('convenio:', cnpjCnv);
        //console.log('servidor:', cpfSrv);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('compras')
                .where('cmpEmissao','>=', inicio)
                .where('cmpEmissao','<=', final)
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
            //console.log(result1)
            return response.json(result1)
        }else {
            if (cnpjCnv === '0' && cpfSrv != '0') {
                const result2 = await connection('compras')
                    .where('cmpEmissao','>=', inicio)
                    .where('cmpEmissao','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                return response.json(result2)    
            }else{
                if (cnpjCnv != '0' && cpfSrv === '0') {
                    const result3 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)                    
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result3)
                }else {
                    const result4 = await connection('compras')
                        .where('cmpEmissao','>=', inicio)
                        .where('cmpEmissao','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                  
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['compras.*', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result4) 
                }
            }
        }     
    },               

    async pdfVctCompras (request, response) {
        let inicio = request.params.dataInicio;
        let final = request.params.dataFinal;
        let cnpjCnv = request.params.cnpjCnv;
        let cpfSrv = request.params.cpfSrv;

        //console.log('inicio:', inicio);
        //console.log('final:', final);
        //console.log('convenio:', cnpjCnv);
        //console.log('servidor:', cpfSrv);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('cmpParcelas')
                .where('parVctParcela','>=', inicio)
                .where('parVctParcela','<=', final)
                .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
            //console.log(result1)
            return response.json(result1)
        }else {
            if (cnpjCnv === '0' && cpfSrv != '0') {
                const result2 = await connection('cmpParcelas')
                    .where('parVctParcela','>=', inicio)
                    .where('parVctParcela','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                return response.json(result2)    
            }else{
                if (cnpjCnv != '0' && cpfSrv === '0') {
                    const result3 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)         
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')           
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result3)
                }else {
                    const result4 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                 
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra') 
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result4) 
                }
            }
        }     
    }, 
                    
    async vctPeriodo (request, response) {
        let inicio = request.params.datInicio;
        let final = request.params.datFinal;
        let cnpjCnv = request.params.convenio;
        let cpfSrv = request.params.servidor;

        //console.log('inicio:', inicio);
        //console.log('final:', final);
        //console.log('convenio:', cnpjCnv);
        //console.log('servidor:', cpfSrv);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('cmpParcelas')
                .where('parVctParcela','>=', inicio)
                .where('parVctParcela','<=', final)
                .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
            //console.log(result1)
            return response.json(result1)
        }else {
            if (cnpjCnv === '0' && cpfSrv != '0') {
                const result2 = await connection('cmpParcelas')
                    .where('parVctParcela','>=', inicio)
                    .where('parVctParcela','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                return response.json(result2)    
            }else{
                if (cnpjCnv != '0' && cpfSrv === '0') {
                    const result3 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)         
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')           
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result3)
                }else {
                    const result4 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                 
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra') 
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .select(['cmpParcelas.*', 'compras.cmpEmissao', 'compras.cmpServidor', 'compras.cmpConvenio', 'servidores.usrCpf', 'servidores.usrNome', 'convenios.cnvCpfCnpj', 'convenios.cnvNomFantasia']);
                    return response.json(result4) 
                }
            }
        }     
    }, 
    
    async somVctComp (request, response) {
        let inicio = request.params.datInicio;
        let final = request.params.datFinal;
        let cnpjCnv = request.params.convenio;
        let cpfSrv = request.params.servidor;

        //console.log('inicio:', inicio);
        //console.log('final:', final);
        //console.log('convenio:', cnpjCnv);
        //console.log('servidor:', cpfSrv);

        const datNow = moment().format('DD-MM-YYYY');
        const horNow = moment().format('hh:mm:ss');  
                
        if (cnpjCnv === '0' && cpfSrv === '0') {
            const result1 = await connection('cmpParcelas')
                .where('parVctParcela','>=', inicio)
                .where('parVctParcela','<=', final)
                .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                .join('servidores', 'usrId', 'compras.cmpServidor')
                .join('convenios', 'cnvId', 'compras.cmpConvenio')
                .sum({totCmp : 'parVlrParcela'});
            //console.log(result1)
            return response.json(result1)
        }else {
            if (cnpjCnv === '0' && cpfSrv != '0') {
                const result2 = await connection('cmpParcelas')
                    .where('parVctParcela','>=', inicio)
                    .where('parVctParcela','<=', final)
                    .where('servidores.usrCpf', cpfSrv)
                    .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')
                    .join('servidores', 'usrId', 'compras.cmpServidor')
                    .join('convenios', 'cnvId', 'compras.cmpConvenio')
                    .sum({totCmp : 'parVlrParcela'});
                return response.json(result2)    
            }else{
                if (cnpjCnv != '0' && cpfSrv === '0') {
                    const result3 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)         
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra')           
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .sum({totCmp : 'parVlrParcela'});
                    return response.json(result3)
                }else {
                    const result4 = await connection('cmpParcelas')
                        .where('parVctParcela','>=', inicio)
                        .where('parVctParcela','<=', final)
                        .where('convenios.cnvCpfCnpj', cnpjCnv)  
                        .where('servidores.usrCpf', cpfSrv)                 
                        .join('compras', 'cmpId', 'cmpParcelas.parIdCompra') 
                        .join('servidores', 'usrId', 'compras.cmpServidor')
                        .join('convenios', 'cnvId', 'compras.cmpConvenio')
                        .sum({totCmp : 'parVlrParcela'});
                    return response.json(result4) 
                }
            }
        }     
    }, 
};
