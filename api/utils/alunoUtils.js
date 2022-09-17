const databaseUtils = require('./databaseUtils')();

module.exports = () => {
  const alunoUtils = {};

  alunoUtils.listar = (incluirDesativados) => {
    return databaseUtils
      .listarRecurso('alunos', incluirDesativados?.toLowerCase() === 'true');
  };

  alunoUtils.cadastrar = (aluno) => {
    aluno.codigo = databaseUtils.gerarId();
    aluno.dataHoraCadastro = databaseUtils.retornarDataAtual();
    aluno.ativo = true;

    const validacao = databaseUtils.validarCadastro('alunos', aluno);

    if (!validacao.ehValido) {
      return {
        sucesso: false,
        mensagem: validacao.listaErros.join(';'),
      };
    }

    const retorno = databaseUtils.cadastrar('alunos', aluno);

    if (!retorno) {
      return {
        sucesso: false,
        mensagem: 'Ocorreu um erro ao cadastrar aluno',
      };
    }

    return {
      sucesso: true,
      mensagem: 'Aluno cadastrado com sucesso',
      dados: retorno,
    };
  };

  alunoUtils.retornar = (codigo) => {
    const retorno = databaseUtils.retornarRecurso('alunos', codigo);

    if (retorno) {
      return {
        sucesso: true,
        dados: retorno,
      };
    }

    return {
      sucesso: false,
      mensagem: 'Erro ao encontrar aluno',
    };
  };

  alunoUtils.editar = (codigo, aluno) => {
    const alunoDatabase = alunoUtils.retornar(codigo);

    if (!alunoDatabase.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Erro ao encontrar aluno',
      };
    }

    aluno.codigo = alunoDatabase.dados.codigo;
    aluno.dataHoraCadastro = alunoDatabase.dados.dataHoraCadastro;
    aluno.ativo = alunoDatabase.dados.ativo;

    const validacao = databaseUtils.validarEdicao('alunos', aluno);

    if (!validacao.ehValido) {
      return {
        sucesso: false,
        mensagem: validacao.listaErros.join(';'),
      };
    }

    const retorno = databaseUtils.editar('alunos', codigo, aluno);

    if (retorno) {
      return {
        sucesso: true,
        mensagem: 'Aluno editado com sucesso',
        dados: retorno,
      };
    }

    return {
      sucesso: false,
      mensagem: 'Erro ao editar aluno',
    };
  };

  alunoUtils.deletar = (codigo) => {
    const sucesso = databaseUtils.deletar('alunos', codigo);

    return {
      sucesso: sucesso,
      mensagem: sucesso
        ? 'Aluno deletado com sucesso'
        : 'Erro ao deletar aluno',
    };
  };

  return alunoUtils;
};
