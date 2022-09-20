const databaseUtils = require('./databaseUtils')();

module.exports = () => {
  const cursoUtils = {};

  cursoUtils.listar = ({
    incluirDesativados,
    nome,
    sigla,
    modalidade,
    comAlunos,
  }) => {
    if (!nome && !sigla && !modalidade) {
      incluirDesativados = Boolean(
        incluirDesativados?.toLowerCase() === 'true'
      );
      let retorno = databaseUtils.listar('cursos', incluirDesativados);

      comAlunos = Boolean(comAlunos?.toLowerCase() === 'true');
      
      if (retorno && comAlunos) {
        retorno = retorno
          .innerJoin(
            'cursos_alunos',
            ({ cursos, cursos_alunos }) =>
              cursos.codigo === cursos_alunos.codigoCurso
          )
          .innerJoin('alunos', ({ cursos, cursos_alunos, alunos }) => {
            return cursos_alunos.codigoAluno === alunos.codigo;
          })
          .reduce((listaCursos, objJoin) => {
            const { cursos, alunos } = objJoin;

            const existeCurso =
              listaCursos.filter(
                (itemCurso) => itemCurso.codigo === cursos.codigo
              ).length > 0;
            if (!existeCurso) {
              listaCursos.push(cursos);
            }

            listaCursos.map((itemCurso) => {
              if (itemCurso.codigo === cursos.codigo) {
                if (itemCurso.listaAlunos === undefined) {
                  itemCurso.listaAlunos = [];
                }
                const existeAluno =
                  itemCurso.listaAlunos.filter(
                    (itemAluno) => itemAluno.codigo === alunos.codigo
                  ).length > 0;

                if (!existeAluno) {
                  itemCurso.listaAlunos.push(alunos);
                }
              }
              return itemCurso;
            });

            return listaCursos;
          }, []);
      }

      return retorno;
    }

    const callbackFiltro = (curso) => {
      return (
        (!nome || curso.nome.toLowerCase().includes(nome.toLowerCase())) &&
        (!sigla || curso.sigla.toLowerCase().includes(sigla.toLowerCase())) &&
        (!modalidade ||
          curso.modalidade.toLowerCase().includes(modalidade.toLowerCase()))
      );
    };

    return databaseUtils.listarPorFiltro({
      nomeRecurso: 'cursos',
      callback: callbackFiltro,
    });
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

  cursoUtils.retornar = ({ codigo, comAlunos }) => {
    let retorno = databaseUtils.retornar('cursos', codigo);

    comAlunos = Boolean(comAlunos?.toLowerCase() === 'true');

    if (retorno && comAlunos) {
      retorno = retorno
        .innerJoin(
          'cursos_alunos',
          ({ cursos, cursos_alunos }) =>
            cursos.codigo === cursos_alunos.codigoCurso
        )
        .innerJoin('alunos', ({ cursos, cursos_alunos, alunos }) => {
          return cursos_alunos.codigoAluno === alunos.codigo;
        })
        .reduce((listaCursos, objJoin) => {
          const { cursos, alunos } = objJoin;

          const existeCurso =
            listaCursos.filter(
              (itemCurso) => itemCurso.codigo === cursos.codigo
            ).length > 0;
          if (!existeCurso) {
            listaCursos.push(cursos);
          }

          listaCursos.map((itemCurso) => {
            if (itemCurso.codigo === cursos.codigo) {
              if (itemCurso.listaAlunos === undefined) {
                itemCurso.listaAlunos = [];
              }
              const existeAluno =
                itemCurso.listaAlunos.filter(
                  (itemAluno) => itemAluno.codigo === alunos.codigo
                ).length > 0;

              if (!existeAluno) {
                itemCurso.listaAlunos.push(alunos);
              }
            }
            return itemCurso;
          });

          return listaCursos;
        }, []);
    }

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
    const cursoDatabase = cursoUtils.retornar({ codigo });

    if (!cursoDatabase.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Erro ao encontrar curso',
      };
    }

    curso = { ...cursoDatabase.dados[0], ...curso };

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
