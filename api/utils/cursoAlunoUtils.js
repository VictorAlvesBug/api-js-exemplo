const databaseUtils = require('./databaseUtils')();

module.exports = () => {
  const cursoAlunoUtils = {};

  cursoAlunoUtils.listarAlunos = (codigoCurso) => {
    return databaseUtils
      .retornar('cursos', codigoCurso)
      .innerJoin(
        'cursos_alunos',
        ({ cursos, cursos_alunos }) =>
          cursos.codigo === cursos_alunos.codigoCurso
      )
      .innerJoin(
        'alunos',
        ({ cursos, cursos_alunos, alunos }) =>
          cursos_alunos.codigoAluno === alunos.codigo
      )
      .map((objJoin) => objJoin.alunos);
  };

  cursoAlunoUtils.inscreverAluno = (codigoCurso, codigoAluno) => {
    const cursoAluno = {
      codigo: databaseUtils.gerarId(),
      dataHoraCadastro: databaseUtils.retornarDataAtual(),
      ativo: true,
      codigoCurso: codigoCurso,
      codigoAluno: codigoAluno,
    };

    const listaAlunosCurso = cursoAlunoUtils.listarAlunos(codigoCurso);

    const alunoJaInscrito = Boolean(
      listaAlunosCurso.find((aluno) => aluno.codigo === codigoAluno)
    );

    if (alunoJaInscrito) {
      return {
        sucesso: false,
        mensagem: 'Este aluno já está inscrito neste curso',
      };
    }

    const validacao = databaseUtils.validarCadastro(
      'cursos_alunos',
      cursoAluno
    );

    if (!validacao.ehValido) {
      return {
        sucesso: false,
        mensagem: validacao.listaErros.join(';'),
      };
    }

    const retorno = databaseUtils.cadastrar('cursos_alunos', cursoAluno);

    if (!retorno) {
      return {
        sucesso: false,
        mensagem: 'Ocorreu um erro ao inscrever aluno no curso',
      };
    }

    return {
      sucesso: true,
      mensagem: 'Aluno inscrito com sucesso',
      dados: retorno,
    };
  };

  cursoAlunoUtils.cancelarInscricaoAluno = (codigoCurso, codigoAluno) => {
    const sucesso = databaseUtils.deletar(
      'cursos_alunos',
      (curso_aluno) =>
        curso_aluno.codigoCurso === codigoCurso &&
        curso_aluno.codigoAluno === codigoAluno
    );

    return {
      sucesso: sucesso,
      mensagem: sucesso
        ? 'Inscrição do aluno cancelada com sucesso'
        : 'Erro ao cancelar inscrição',
    };
  };

  return cursoAlunoUtils;
};
