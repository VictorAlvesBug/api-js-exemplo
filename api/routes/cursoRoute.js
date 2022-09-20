module.exports = (app) => {
  const cursoController = require('../controllers/cursoController')();

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
    .get(cursoController.listarAlunos)
    .post(cursoController.inscreverAluno);

  app
    .route('/api/cursos/:codigo/alunos/:codigoAluno')
    .delete(cursoController.cancelarInscricaoAluno);
};
