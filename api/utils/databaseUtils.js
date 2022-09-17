const fs = require('fs');
const database = require('../data/database.json');
  
  const databaseFreezed = database;

Object.freeze(databaseFreezed);

module.exports = () => {
  const databaseUtils = {};

  databaseUtils.retornarDataAtual = () => {
    // Recupera horário UTC
    let agora = new Date();
    // Aplica fuso-horário de Brasília
    const fusoHorarioBrasilia = -3;
    agora.setHours(agora.getHours() + fusoHorarioBrasilia);
    // Ajusta formato para ficar 'yyyy-mm-dd HH:mm:ss'
    return agora.toJSON().replace('T', ' ').replace('Z', '');
  };

  databaseUtils.gerarId = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  };

  const retornarAtributoAtivacao = (nomeRecurso) => {
    const listaValicacoes = Object.entries(database[nomeRecurso].validation);

    const parEncontrado = listaValicacoes.find(
      ([_, validacao]) => validacao.isActivationField === true
    );

    if (!parEncontrado) {
      return;
    }

    const [atributoAtivacao, _] = parEncontrado;

    return atributoAtivacao;
  };

  const retornarAtributoIdentificador = (nomeRecurso) => {
    const listaValicacoes = Object.entries(database[nomeRecurso].validation);

    const parEncontrado = listaValicacoes.find(
      ([_, validacao]) => validacao.isIdentityField === true
    );

    if (!parEncontrado) {
      return;
    }

    const [atributoIdentificador, _] = parEncontrado;

    return atributoIdentificador;
  };

  const salvar = () => {
    const qtdeEspacosIndentar = 4;
    const databaseSalvar = databaseFreezed;

    Object.entries(database).forEach(([nomeRecurso, recurso]) => {
      databaseSalvar[nomeRecurso].data = recurso.data;
    });

    const strDatabase = JSON.stringify(databaseSalvar, null, qtdeEspacosIndentar);

    fs.writeFile('./api/data/database.json', strDatabase, (err) => {
      if (err) {
        console.log(err);
      }
    });
  };

  databaseUtils.listarRecurso = (nomeRecurso, incluirDesativados = false) => {
    const atributoAtivacao = retornarAtributoAtivacao(nomeRecurso);
    if(incluirDesativados){
      return database[nomeRecurso].data;
    }
    
    return database[nomeRecurso].data.filter(recurso => recurso[atributoAtivacao] === true);
  };

  databaseUtils.retornarRecurso = (nomeRecurso, identificador) => {
    const atributoIdentificador = retornarAtributoIdentificador(nomeRecurso);
    return databaseUtils.listarRecurso(nomeRecurso).find(
      (recurso) => recurso[atributoIdentificador] === identificador
    );
  };

  databaseUtils.cadastrar = (nomeRecurso, recurso) => {
    database[nomeRecurso].data.push(recurso);
    salvar();
    return recurso;
  };

  databaseUtils.editar = (nomeRecurso, identificador, recurso) => {
    const atributoIdentificador = retornarAtributoIdentificador(nomeRecurso);

    database[nomeRecurso].data = database[nomeRecurso].data.map((item) => {
      if (item[atributoIdentificador] === identificador) {
        return { ...item, ...recurso };
      }
      return item;
    });

    salvar();

    return databaseUtils.retornarRecurso(nomeRecurso, identificador);
  };

  databaseUtils.deletar = (nomeRecurso, identificador) => {
    const atributoIdentificador = retornarAtributoIdentificador(nomeRecurso);
    const atributoAtivacao = retornarAtributoAtivacao(nomeRecurso);

    let qtdeItensAlterados = 0;
    database[nomeRecurso].data = databaseUtils.listarRecurso(nomeRecurso)
    .map((item) => {
      if (
        item[atributoIdentificador] === identificador
      ) {
        qtdeItensAlterados++;
        item[atributoAtivacao] = false;
      }
      return item;
    });

    salvar();

    return qtdeItensAlterados > 0;
  };

  const validar = (nomeRecurso, recurso, modoValidacao) => {
    const listaValicacoes = Object.entries(database[nomeRecurso].validation);
    let ehValido = true;
    let listaErros = [];

    listaValicacoes.forEach(([nomeAtributo, validacao]) => {
      const atributo = recurso[nomeAtributo];

      // Validar se o atributo aceita valor nulo
      if (validacao.nullable === false && !atributo) {
        ehValido = false;
        listaErros.push(`O atributo '${nomeAtributo}' é obrigatório`);
      }

      // Validar tipo de dado
      if (atributo && validacao.type !== undefined) {
        const tipoEnviado = typeof atributo;
        const tipoRequerido = validacao.type;
        if (tipoEnviado !== tipoRequerido) {
          ehValido = false;
          listaErros.push(
            `O atributo ${nomeAtributo}='${atributo}'(${tipoEnviado}) deve ser do tipo '${tipoRequerido}'`
          );
        }
      }

      // Validar Regex
      if (validacao.regex) {
        const regex = RegExp(validacao.regex, 'g');

        if (atributo && !atributo.match(regex)) {
          ehValido = false;
          listaErros.push(
            `O atributo ${nomeAtributo}='${atributo}' é inválido`
          );

          if (validacao.regexDescription) {
            listaErros.push(validacao.regexDescription);
          }
        }
      }

      // Validar se o atributo aceita duplicatas
      if (validacao.allowDuplicates === false) {
        const atributoIdentificador =
          retornarAtributoIdentificador(nomeRecurso);
        let qtdeItensRecursoComAtributoIdentico;

        if(modoValidacao === 'edição')
        {
          qtdeItensRecursoComAtributoIdentico = databaseUtils
          .listarRecurso(nomeRecurso)
          .filter((item) => item[nomeAtributo] === atributo &&
          item[atributoIdentificador] !== recurso[atributoIdentificador]).length;
        }
        else{
          qtdeItensRecursoComAtributoIdentico = databaseUtils
          .listarRecurso(nomeRecurso)
          .filter((item) => item[nomeAtributo] === atributo).length;
        }

        if (atributo && qtdeItensRecursoComAtributoIdentico > 0) {
          ehValido = false;
          listaErros.push(`${nomeAtributo} '${atributo}' já cadastrado`);
        }

      }

      // Validar se o atributo segue o enum pré-definido
      if (
        Array.isArray(validacao.enum) &&
        atributo &&
        !validacao.enum.includes(atributo)
      ) {
        ehValido = false;
        const valoresValidos = validacao.enum
          .map((valor) => `'${valor}'`)
          .join(',');
        listaErros.push(
          `O atributo '${nomeAtributo}' aceita apenas os seguintes valores: ${valoresValidos}`
        );
      }
    });

    return { ehValido, listaErros };
  };

  databaseUtils.validarCadastro = (nomeRecurso, recurso) => {
    return validar(nomeRecurso, recurso, 'cadastro');
  };

  databaseUtils.validarEdicao = (nomeRecurso, recurso) => {
    return validar(nomeRecurso, recurso, 'edição');
  };

  return databaseUtils;
};
