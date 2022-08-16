const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const AdminController = require('./controllers/AdminController');
const SecretController = require('./controllers/SecretController');
const AtivController = require('./controllers/AtivController');
const ConveniosController = require('./controllers/ConveniosController');
const PlaPagtoController = require('./controllers/PlaPagtoController');
const TxaAdminController = require('./controllers/TxaAdminController');
const ComprasController = require('./controllers/ComprasController');
const OrgaosController = require('./controllers/OrgaosController');
const PdfsController = require('./controllers/PdfsController');
const FiliacaoController = require('./controllers/FiliacaoController');
const MailController = require('./controllers/MailController');
const ParametrosController = require('./controllers/ParametrosController');
const CargosController = require('./controllers/CargosController');
const ParcelasController = require('./controllers/ParcelasController');
const DownloadsController = require('./controllers/DownloadsController');
const BairrosController = require('./controllers/BairrosController');
const InicioController = require('./controllers/InicioController');

//routes.get('/', InicioController.index);

routes.get('/users', UsersController.index);
routes.get('/signIn/:email/:password', UsersController.signIn);
routes.post('/newuser', UsersController.create);
routes.get('/searchUser/:idUsr', UsersController.searchUser);
routes.put('/newpassword/:emailUsuario', UsersController.updPassword);
routes.get('/verUsuario/:email', UsersController.searchEmail);
routes.get('/findUser/:cartao', UsersController.findUser);
routes.get('/busServ/:cartao/:password', UsersController.busServ);
routes.get('/loginUsr/:cartao/:password', UsersController.loginUsr);
routes.get('/verifUser/:cartao', UsersController.verifUser);
routes.put('/altservidor/:idSrv', UsersController.updServidor);
routes.get('/classUser/:search', UsersController.classUser);

routes.get('/admin', AdminController.index);
routes.get('/loginAdm/:email/:password', AdminController.signIn);
routes.post('/newadmin', AdminController.create);
routes.get('/searchAdmin/:idAdm', AdminController.searchAdmin);
routes.put('/newSenhaAdmin/:emailAdmin', AdminController.updPassword);

routes.get('/secretarias', SecretController.index);
routes.post('/newsecretaria', SecretController.create);
routes.get('/searchSec/:idSec', SecretController.searchSec);
routes.put('/altsecretaria/:idSec', SecretController.updateSec);
routes.put('/delsecretaria/:idSec', SecretController.deleteSec);

routes.get('/orgaos', OrgaosController.index);
routes.post('/neworgadmin', OrgaosController.create);
routes.put('/altorgao/:idOrg', OrgaosController.updateOrg);
routes.get('/searchOrg/:idOrg', OrgaosController.searchOrg);
routes.put('/delorgadmin/:idOrg', OrgaosController.deleteOrg);

routes.get('/atividades', AtivController.index);
routes.get('/searchAtiv/:idAtv', AtivController.searchAtiv);
routes.post('/newatividade', AtivController.create);
routes.put('/altatividade/:idAtv', AtivController.updateAtiv);
routes.put('/delAtividade/:idAtv', AtivController.deleteAtiv);

routes.get('/convenios', ConveniosController.index);                                                     
routes.get('/searchConv/:idCnv', ConveniosController.searchConv);
routes.post('/newconvenio', ConveniosController.create);
routes.put('/altconvenio/:idCnv', ConveniosController.updateConv);
routes.put('/delconvenio/:idCnv', ConveniosController.deleteConv);
routes.get('/loginCnv/:email/:password', ConveniosController.signIn);

routes.get('/plapagto', PlaPagtoController.index);
routes.post('/newplapagto', PlaPagtoController.create);
routes.get('/altplapagto/:idPgt', PlaPagtoController.searchPlaPagto);

routes.get('/taxAdmin', TxaAdminController.index);
routes.post('/newtaxadmin', TxaAdminController.create);
routes.put('/alttaxadmin/:idTxa', TxaAdminController.searchTxaAdm);

routes.get('/cargos', CargosController.index);
routes.post('/newcargo', CargosController.create);
routes.put('/altcargo/:idCrg', CargosController.updCargo);
routes.get('/searchCargo/:idCrg', BairrosController.searchCargo);

routes.get('/bairros', BairrosController.index);
routes.post('/newbairro', BairrosController.create);
routes.put('/altbairro/:idBai', BairrosController.updBairro);
routes.get('/searchBairro/:idBai', BairrosController.searchBairro);

routes.get('/compras', ComprasController.index);
routes.post('/newcompra', ComprasController.create);
routes.get('/altcompra/:idCmp', ComprasController.searchCompras);
routes.get('/cmpConvenio/:idCnv', ComprasController.cmpConvenio);

routes.get('/findCompras/:datVencto', ComprasController.cmpVencto);
routes.get('/totCompras/:datVencto', ComprasController.totCompras);
routes.get('/pdfVdaEmissao', PdfsController.pdfVdaEmissao);
routes.get('/pdfVdaVenc/:dataInicial/:dataFinal', PdfsController.pdfVdaVenc);
routes.get('/filiacao/:usrId', FiliacaoController.filiacao);
routes.post('/newfiliacao', FiliacaoController.create);
routes.get('/searchFiliacao/:idUsr/:idFil', FiliacaoController.searchFiliacao);
routes.put('/altfiliacao/:idUsr/:idFil', FiliacaoController.updFiliacao);
routes.get('/envEmail/:email', MailController.enviaEmail);
routes.get('/parametros', ParametrosController.index);
routes.put('/altparametros/:idPar', ParametrosController.updParam);
routes.get('/usrAnterior/:cpfAnt', UsersController.usrAnterior);
routes.get('/informacoes/:idUsr', UsersController.searchInf);
routes.get('/newinformacao/', UsersController.createInf);
routes.get('/altinformacao/:idUsr/:idInf', UsersController.updInfor);
routes.get('/pdfSrvContrato/:srvId', UsersController.srvContratos);
routes.get('/parcelas/:tipUser', ParcelasController.parcelas);
routes.get('/downloadTxt', DownloadsController.downTexto);

module.exports = routes;
