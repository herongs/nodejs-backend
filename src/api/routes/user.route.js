
const controller = require('../controllers/user.controller');

module.exports = (app) => {
    app.post('/criar-usuario', controller.create);
}