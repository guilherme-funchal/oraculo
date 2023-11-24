const { Router } = require('express');

const TesteController = require('./controller/TesteController');

const router = Router()

router.get('/saldo/:conta', function(req, res){
    TesteController.saldo(req, res)
    });
router.post('/conta', function(req, res){
        TesteController.account(req, res)
        });
router.get('/transacoes', function(req, res){
    TesteController.transacoes(req, res)
    });
router.post('/cunhar', function(req, res){
    TesteController.cunhar(req, res)
});
router.post('/transferir', function(req, res){
    TesteController.transferir(req, res)
});

module.exports = router;
