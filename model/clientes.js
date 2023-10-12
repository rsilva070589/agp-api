const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
 `select
  cli.cod_cliente,
  cli.nome,
  cli.endereco_eletronico,
  cli.rua_res, 
  cli.fachada_res,
  cli.complemento_res,
  cli.bairro_res,
  cli.cod_cid_res,
  cli.uf_res,
  cli.prefixo_cel,
  cli.telefone_cel,
  cli.prefixo_res,
  cli.telefone_res,
  cli.Prefixo_Com,
  cli.telefone_com,
  cli.prefixo_msg_txt_inst,
  cli.numero_msg_txt_inst
  from clientes cli 
  where 1=1
  `;

const sortableColumns = ['id', 'nome'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\nand cod_cliente = :employee_id';
  }

  if (context.NOME) {
    binds.NOME = context.NOME;
 
    query += '\nand upper(NOME) like :NOME';
  }
 
 
  if (context.sort === undefined) {
    query += '\norder by NOME asc';
  } else {
    let [column, order] = context.sort.split(':');
 
    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }
 
    if (order === undefined) {
      order = 'asc';
    }
 
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Invalid "sort" order');
    }
 
    query += `\norder by "${column}" ${order}`;
  }

  if (context.skip) {
    binds.row_offset = context.skip;

    query += '\noffset :row_offset rows';
  }

  const limit = (context.limit > 0) ? context.limit : 30;

  binds.row_limit = limit;

  query += '\nfetch next :row_limit rows only';

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;

const createSqlClienteDiverso =
 `insert into cliente_diverso cd (
  cd.cod_cliente,
  cd.nome,
  cd.cod_cidades,
  cd.uf,
  cd.cpf,
  cd.cod_tipo_cliente,cd.cod_tipo,cd.cod_empresa,cd.servidor_publico,cd.politicamente_exposto )
 values (:cod_cliente, 
         :nome,
         :cod_cid_res,
         :uf_res,
         :cpf,
          1,'C', 1,0,0)
  `

const createSqlClientes =
 `insert into clientes cli (
    cli.cod_cliente,
    cli.nome,
    cli.endereco_eletronico,  
    cli.email_nfe,
    cli.rua_res, 
    cli.fachada_res,
    cli.complemento_res,
    cli.bairro_res,
    cli.cod_cid_res,
    cli.cep_res,
    cli.uf_res,
    cli.rua_cobranca, 
    cli.fachada_cobranca,
    cli.complemento_cobranca,
    cli.bairro_cobranca,
    cli.cod_cid_cobranca,
    cli.cep_cobranca,
    cli.uf_cobranca,
    cli.prefixo_cel,
    cli.telefone_cel,
    cli.cod_profissao,
    cli.usuario_cadastrou,
    cli.cod_nacionalidade,
    cli.cod_classe,
    cli.cod_tipo
  ) values (
    :cod_cliente,
    :nome,
    :endereco_eletronico, 
    :email_nfe,
    :rua_res, 
    :fachada_res,
    :complemento_res,
    :bairro_res,
    :cod_cid_res,
    :cep_res,
    :uf_res,
    :rua_res, 
    :fachada_res,
    :complemento_res,
    :bairro_res,
    :cod_cid_res,
    :cep_res,
    :uf_res,
    :prefixo_cel,
    :telefone_cel,
    :cod_profissao,
    'NBS',
    36,
    :cod_classe,
    'C'
  ) `

  const createSqlDadosFisicos =
 `insert into dados_fisicos df (
  df.cod_cliente,
  df.cod_sexo,
  df.cod_estado_civil,
  df.aniversario,
  df.pai,
  df.mae,
  df.cpf,
  df.rg_numero,
  df.rg_emissor,
  df.rg_data_emissao,
  df.escolaridade
  )
 values (:cod_cliente,
         :cod_sexo,
         :cod_estado_civil,
         :aniversario,
         :pai,
         :mae,
         :cpf,
         :rg_numero,
         :rg_emissor,
         :rg_data_emissao,
         :escolaridade)
  `

  const createSqlDadosJuridicos =
  `insert into dados_juridicos dJ (
   dJ.cod_cliente 
   )
  values (:cod_cliente )
   `
  

async function create(emp) {
  const CLIENTE = Object.assign({}, emp);

  
  const cliente_diverso = await database.simpleExecute(createSqlClienteDiverso, 
                                                      [ CLIENTE.COD_CLIENTE,
                                                        CLIENTE.NOME,
                                                        CLIENTE.COD_CID_RES,
                                                        CLIENTE.UF_RES,
                                                        CLIENTE.CPF
                                                      ]
                                                      , { autoCommit: true });


  var VAR_CLASSE = 'F'
  console.log((CLIENTE.COD_CLIENTE.length))
  if (CLIENTE.COD_CLIENTE.length > 11) {
      VAR_CLASSE = 'J'
    }

    const result  = await database.simpleExecute(createSqlClientes,
      [ CLIENTE.COD_CLIENTE,
        CLIENTE.NOME,
        CLIENTE.ENDERECO_ELETRONICO,
        CLIENTE.ENDERECO_ELETRONICO,
        CLIENTE.RUA_RES,
        CLIENTE.FACHADA_RES,
        CLIENTE.COMPLEMENTO_RES,
        CLIENTE.BAIRRO_RES,
        CLIENTE.COD_CID_RES,
        CLIENTE.CEP_RES,
        CLIENTE.UF_RES,
        CLIENTE.RUA_RES,
        CLIENTE.FACHADA_RES,
        CLIENTE.COMPLEMENTO_RES,
        CLIENTE.BAIRRO_RES,
        CLIENTE.COD_CID_RES,
        CLIENTE.CEP_RES,
        CLIENTE.UF_RES,
        CLIENTE.PREFIXO_CEL,
        CLIENTE.TELEFONE_CEL,
        CLIENTE.COD_PROFISSAO,
        VAR_CLASSE
      ]
    , { autoCommit: true });
    
  
                                                      
    if (CLIENTE.COD_CLIENTE.length > 11) {
      const dadosJuridicos = await database.simpleExecute(createSqlDadosJuridicos, 
        [ CLIENTE.COD_CLIENTE                                        
        ]
        , { autoCommit: true }); 
    } else {

      const dadosFisicos = await database.simpleExecute(createSqlDadosFisicos, 
        [ CLIENTE.COD_CLIENTE,
          CLIENTE.COD_SEXO,
          CLIENTE.COD_ESTADO_CIVIL,
          CLIENTE.ANIVERSARIO,
          CLIENTE.PAI,
          CLIENTE.MAE,
          CLIENTE.COD_CLIENTE,
          CLIENTE.RG_NUMERO,
          CLIENTE.RG_EMISSOR,
          CLIENTE.RG_DATA_EMISSAO,
          CLIENTE.ESCOLARIDADE                                         
        ]
        , { autoCommit: true });

    }
  return CLIENTE;
}

module.exports.create = create;

const updateSql =
 `update clientes cli
  set 
  cli.endereco_eletronico     = :ENDERECO_ELETRONICO, 
  cli.rua_res                 = :RUA_RES, 
  cli.fachada_res             = :FACHADA_RES,
  cli.complemento_res         = :COMPLEMENTO_RES,
  cli.bairro_res              = :BAIRRO_RES,
  cli.cod_cid_res             = :COD_CID_RES,
  cli.cep_res                 = :CEP_RES,
  cli.uf_res                  = :UF_RES, 
  cli.prefixo_cel             = :PREFIXO_CEL,
  cli.telefone_cel            = :TELEFONE_CEL

  where cli.cod_cliente = :ID
  `
  ;

async function update(emp) {
  const UpdateCliente = Object.assign({}, emp); 
  const result = await database.simpleExecute(updateSql, UpdateCliente, { autoCommit: true });
  return UpdateCliente;  
}

module.exports.update = update;

/*
const deleteSql =
 `begin

    delete from job_history
    where employee_id = :employee_id;

    delete from employees
    where employee_id = :employee_id;

    :rowcount := sql%rowcount;

  end;`;

async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  };
  const result = await database.simpleExecute(deleteSql, binds, { autoCommit: true });

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;
**/