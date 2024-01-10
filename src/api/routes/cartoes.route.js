const controller = require('../controllers/cartoes.controller');

module.exports = (app) => {
    // app.get('/listas', controller.all);
    // app.get('/listas', controller.one);
    app.post('/cartao', controller.create);
    // app.put('/listas', controller.update);
}