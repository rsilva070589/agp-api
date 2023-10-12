//const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
`select
  *
  from os
  where 1=1`;

const sortableColumns = ['id'];

 async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\nand cod_empresa= :employee_id';
  }
  const limit = (context.limit > 0) ? context.limit : 30;
  binds.row_limit = limit;
  query += '\nfetch next :row_limit rows only';
  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;

const createSqlOsDadosVeiculos =
 `INSERT INTO OS_DADOS_VEICULOS ODV (
    ODV.COD_EMPRESA,
    ODV.NUMERO_OS,
    ODV.COD_PRODUTO,
    ODV.COD_MODELO,
    ODV.ANO,
    ODV.CHASSI,
    ODV.PLACA,
    ODV.COR_EXTERNA,
    ODV.COMBUSTIVEL
  ) values (
    :COD_EMPRESA,
    :NUMERO_OS,
    :COD_PRODUTO,
    :COD_MODELO,
    :ANO,
    :CHASSI,
    :PLACA,
    :COR_EXTERNA,
    :COMBUSTIVEL
  ) `

  const createSqlOsOriginal =
 `INSERT INTO OS_ORIGINAL ORI (
  
  DESCRICAO,
  COD_EMPRESA,
  NUMERO_OS,
  DT_INCLUSAO,
  ITEM
  )
 values ( :RECLAMACAO,
          :COD_EMPRESA,
          :NUMERO_OS,
          trunc(SYSDATE),
          1)
  `
  
const createSqlOS =
`INSERT INTO OS (

 COD_EMPRESA,
 TIPO,  
 NUMERO_OS, 
 COD_CLIENTE,
 QUEM_ABRIU, 
 NOME,
 CONSULTOR_ENTREGA,
 CONSULTOR_RECEPCAO,  
 COD_PRODUTO,
 COD_MODELO,  
   
 STATUS_OS,
 DATA_EMISSAO,
 HORA_EMISSAO,
 ORCAMENTO,EXTENDIDA,CORTESIA,LIBERADO)   

 VALUES (:COD_EMPRESA,
  'V1',
  :NUMERO_OS,  
  :COD_CLIENTE, 
  'NBS',    
  'NBS',
  'NBS',
  'NBS',
  :COD_PRODUTO,
  :COD_MODELO,
   0, trunc(SYSDATE), to_char (sysdate,'HH:MM'),'N','N','N','N'
   )
 
 `

 const SqlNumeracaoOS = `select numero_os from controle_os where cod_empresa=9` 

 const SqlUpdateNumeroOS = `update controle_os set numero_os = numero_os+1`

  
 async function create(emp) {
 const NEWOS = Object.assign({}, emp); 

 const result   = await database.simpleExecute(SqlNumeracaoOS)
 console.log(result.rows[0])
 const Osnumero = result.rows[0]['NUMERO_OS']

  const TabelaOS = await database.simpleExecute(createSqlOS, 
                                                      [ 
                                                        NEWOS.COD_EMPRESA ,
                                                        Osnumero,
                                                        NEWOS.COD_CLIENTE,
                                                        NEWOS.COD_PRODUTO,
                                                        NEWOS.COD_MODELO
                                                      ]
                                                      , { autoCommit: true });
  
  const updateosnumero  = await database.simpleExecute(SqlUpdateNumeroOS)    


  const TabelaOsDadosVeiculos  = await database.simpleExecute(createSqlOsDadosVeiculos,
                                              [ NEWOS.COD_EMPRESA,
                                                Osnumero,
                                                NEWOS.COD_PRODUTO,
                                                NEWOS.COD_MODELO,                                                
                                                NEWOS.ANO,
                                                NEWOS.CHASSI,
                                                NEWOS.PLACA,
                                                NEWOS.COR_EXTERNA,
                                                NEWOS.COMBUSTIVEL
                                              ]
                                            , { autoCommit: true });

 const TabelaOsOriginal = await database.simpleExecute(createSqlOsOriginal,
                                                    [ 
                                                      NEWOS.RECLAMACAO, 
                                                      NEWOS.COD_EMPRESA,
                                                      Osnumero
                                                    ]
                                                  );
                                           

  return NEWOS;
}

module.exports.create = create;

