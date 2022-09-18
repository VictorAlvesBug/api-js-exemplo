const cursoAlunoUtils = require('../utils/cursoAlunoUtils')();

module.exports = () => {
  const cursoAlunoController = {};

  cursoAlunoController.listar = (req, res) => {
    return res.status(200).json(cursoAlunoUtils.listarAlunos(req.params.codigo));
  };

  cursoAlunoController.cadastrar = (req, res) => {
    const retorno = cursoAlunoUtils.inscreverAluno(req.params.codigo, req.body.codigoAluno);

    if (retorno.sucesso) {
      return res.status(201).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoAlunoController.deletar = (req, res) => {
    const retorno = cursoAlunoUtils.cancelarInscricaoAluno(req.params.codigo, req.params.codigoAluno);

    if (retorno.sucesso) {
      return res.status(204).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  return cursoAlunoController;
};
