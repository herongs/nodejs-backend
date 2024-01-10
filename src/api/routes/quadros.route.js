const controller = require('../controllers/quadros.controller');

module.exports = (app) => {
    app.get('/quadros', controller.all);
    app.get('/quadros/:uid', controller.one); // Modificado para receber a UI como parâmetro
    app.post('/quadros', controller.create);
    // app.put('/quadros', controller.update);
}