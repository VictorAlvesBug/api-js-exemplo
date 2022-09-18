
module.exports = () => {
  const alunoController = {};

  alunoController.health = (req, res) => {
    return res.status(200).json({ sucesso: true, mensagem: 'Api está no ar'});
  };

  return alunoController;
};
