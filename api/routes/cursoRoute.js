module.exports = (app) => {
  const cursoController = require('../controllers/cursoController')();
  const cursoAlunoController = require('../controllers/cursoAlunoController')();

  app
    .route('/api/cursos')
    .get(cursoController.listar)
    .post(cursoController.cadastrar);

  app
    .route('/api/cursos/:codigo')
    .get(cursoController.retornar)
    .patch(cursoController.editar)
    .delete(cursoController.deletar);

  app
    .route('/api/cursos/:codigo/alunos')
    .get(cursoAlunoController.listar)
    .post(cursoAlunoController.cadastrar);

  app
    .route('/api/cursos/:codigo/alunos/:codigoAluno')
    .delete(cursoAlunoController.deletar);
};
