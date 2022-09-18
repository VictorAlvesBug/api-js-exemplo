module.exports = (app) => {
  const cursoController = require('../controllers/cursoController')();
  const alunoController = require('../controllers/alunoController')();

  app
    .route('/api/cursos')
    .get(cursoController.listar)
    .post(cursoController.cadastrar);

  app
    .route('/api/cursos/:codigo')
    .get(cursoController.retornar)
    .patch(cursoController.editar)
    .delete(cursoController.deletar);

  /*app
    .route('/api/cursos/:codigoCurso/alunos')
    .get(cursoController.retornar)
    .patch(cursoController.editar)
    .delete(cursoController.deletar);*/
};
