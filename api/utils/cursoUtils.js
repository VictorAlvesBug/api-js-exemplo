const databaseUtils = require('./databaseUtils')();

module.exports = () => {
  const cursoUtils = {};

  cursoUtils.listar = (incluirDesativados) => {
    return databaseUtils
      .listar('cursos', incluirDesativados?.toLowerCase() === 'true');
  };

  cursoUtils.cadastrar = (curso) => {
    curso.codigo = databaseUtils.gerarId();
    curso.dataHoraCadastro = databaseUtils.retornarDataAtual();
    curso.ativo = true;

    const validacao = databaseUtils.validarCadastro('cursos', curso);

    if (!validacao.ehValido) {
      return {
        sucesso: false,
        mensagem: validacao.listaErros.join(';'),
      };
    }

    const retorno = databaseUtils.cadastrar('cursos', curso);

    if (!retorno) {
      return {
        sucesso: false,
        mensagem: 'Ocorreu um erro ao cadastrar curso',
      };
    }

    return {
      sucesso: true,
      mensagem: 'Curso cadastrado com sucesso',
      dados: retorno,
    };
  };

  cursoUtils.retornar = (codigo) => {
    const retorno = databaseUtils.retornar('cursos', codigo);

    if (retorno) {
      return {
        sucesso: true,
        dados: retorno,
      };
    }

    return {
      sucesso: false,
      mensagem: 'Erro ao encontrar curso',
    };
  };

  cursoUtils.editar = (codigo, curso) => {
    const cursoDatabase = cursoUtils.retornar(codigo);

    if (!cursoDatabase.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Erro ao encontrar curso',
      };
    }

    curso = {...cursoDatabase.dados, ...curso};

    console.log(curso)

    const validacao = databaseUtils.validarEdicao('cursos', curso);

    if (!validacao.ehValido) {
      return {
        sucesso: false,
        mensagem: validacao.listaErros.join(';'),
      };
    }

    const retorno = databaseUtils.editar('cursos', codigo, curso);

    if (retorno) {
      return {
        sucesso: true,
        mensagem: 'Curso editado com sucesso',
        dados: retorno,
      };
    }

    return {
      sucesso: false,
      mensagem: 'Erro ao editar curso',
    };
  };

  cursoUtils.deletar = (codigo) => {
    const sucesso = databaseUtils.deletar('cursos', codigo);

    return {
      sucesso: sucesso,
      mensagem: sucesso
        ? 'Curso deletado com sucesso'
        : 'Erro ao deletar curso',
    };
  };

  return cursoUtils;
};
