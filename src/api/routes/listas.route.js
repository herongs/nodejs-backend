const controller = require('../controllers/listas.controller');

module.exports = (app) => {
    // app.get('/listas', controller.all);
    // app.get('/listas', controller.one);
    app.post('/listas', controller.create);
    // app.put('/listas', controller.update);
}