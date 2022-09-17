module.exports = (app) => {
  const alunoController = require('../controllers/alunoController')();

  app
    .route('/api/alunos')
    .get(alunoController.listar)
    .post(alunoController.cadastrar);

  app
    .route('/api/alunos/:codigo')
    .get(alunoController.retornar)
    .patch(alunoController.editar)
    .delete(alunoController.deletar);
};
