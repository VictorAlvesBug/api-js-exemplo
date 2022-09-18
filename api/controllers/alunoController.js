const alunoUtils = require('../utils/alunoUtils')();

module.exports = () => {
  const alunoController = {};

  alunoController.listar = (req, res) => {
    return res.status(200).json(alunoUtils.listar(req.query));
  };

  alunoController.cadastrar = (req, res) => {
    const retorno = alunoUtils.cadastrar(req.body);

    if (retorno.sucesso) {
      return res.status(201).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  alunoController.retornar = (req, res) => {
      const retorno = alunoUtils.retornar(req.params.codigo);

      if(retorno.sucesso) {
          return res.status(200).json(retorno);
        }

        return res.status(400).json(retorno);
  };

  alunoController.editar = (req, res) => {
    const retorno = alunoUtils.editar(req.params.codigo, req.body);

    if (retorno.sucesso) {
      return res.status(200).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  alunoController.deletar = (req, res) => {
    const retorno = alunoUtils.deletar(req.params.codigo);

    if (retorno.sucesso) {
      return res.status(204).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  return alunoController;
};
