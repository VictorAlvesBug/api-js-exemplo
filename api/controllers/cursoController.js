const cursoUtils = require('../utils/cursoUtils')();

module.exports = () => {
  const cursoController = {};

  cursoController.listar = (req, res) => {
    return res.status(200).json(cursoUtils.listar(req.query));
  };

  cursoController.cadastrar = (req, res) => {
    const retorno = cursoUtils.cadastrar(req.body);

    if (retorno.sucesso) {
      return res.status(201).json(retorno);
    }

    return res.status(400).json(retorno);
  };

  cursoController.retornar = (req, res) => {
      const retorno = cursoUtils.retornar(req.params.codigo);

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

  return cursoController;
};
