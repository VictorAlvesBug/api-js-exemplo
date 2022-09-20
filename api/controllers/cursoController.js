const cursoUtils = require('../utils/cursoUtils')();
const cursoAlunoUtils = require('../utils/cursoAlunoUtils')();

module.exports = () => {
  const cursoController = {};

  cursoController.listar = (req, res) => {
    return res.status(200).json(cursoUtils.listar({...req.params, ...req.query}));
  };

  cursoController.cadastrar = (req, res) => {
    const retorno = cursoUtils.cadastrar(req.body);

    if (retorno.sucesso) {
      return res.status(201).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoController.retornar = (req, res) => {
      const retorno = cursoUtils.retornar({...req.params, ...req.query});

      if(retorno.sucesso) {
          return res.status(200).json(retorno);
        }

        return res.status(400).json(retorno);
  };

  cursoController.editar = (req, res) => {
    const retorno = cursoUtils.editar(req.params.codigo, req.body);

    if (retorno.sucesso) {
      return res.status(200).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoController.deletar = (req, res) => {
    const retorno = cursoUtils.deletar(req.params.codigo);

    if (retorno.sucesso) {
      return res.status(204).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoController.listarAlunos = (req, res) => {
    return res.status(200).json(cursoAlunoUtils.listarAlunos(req.params.codigo));
  };

  cursoController.inscreverAluno = (req, res) => {
    const retorno = cursoAlunoUtils.inscreverAluno(req.params.codigo, req.body.codigoAluno);

    if (retorno.sucesso) {
      return res.status(201).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoController.cancelarInscricaoAluno = (req, res) => {
    const retorno = cursoAlunoUtils.cancelarInscricaoAluno(req.params.codigo, req.params.codigoAluno);

    if (retorno.sucesso) {
      return res.status(204).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  return cursoController;
};
