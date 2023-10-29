const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
from COMISSOES_FAIXA x  
where 1=1
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};
  console.log(context)
  if (context.id) { 
    binds.tipo_id = context.id;    
    query += `\nand x.mes = :tipo_id  `;
  }
  query += `order by tipo_comissao DESC `
  console.log(query)
  const result = await database.simpleExecute(query, binds);  
  return result.rows
}
 
module.exports.find = find;

const createSqlRegra =
`insert into comissoes_faixa dJ (
  
  COD_EMPRESA, 
  DPTO,
  COD_FUNCAO, 
  TIPO_COMISSAO,
  QTDE,
  PERC, 
  VALOR,
  PREMIO,
  QTDE_MIN,
  QTDE_MAX,
  MEDIA_ACESSORIOS_MIN,
  MEDIA_ACESSORIOS_MAX,
  USA_FAIXA,
  PERMITE_AVULSO,
  VALOR_MIN,
  VALOR_MAX,
  MES,
  PAGAR_GESTOR,
  PERC_MIN,
  PERC_MAX, 
  GRUPO,
  CLASSE,
  APELIDO,
  CAMPANHA, 
  LEGENDA,
  ID
  
 )
values (  
  
  :COD_EMPRESA,
  :DPTO, 
  :COD_FUNCAO, 
  :TIPO_COMISSAO,
  :QTDE,
  :PERC, 
  :VALOR,
  :PREMIO,
  :QTDE_MIN,
  :QTDE_MAX,
  :MEDIA_ACESSORIOS_MIN,
  :MEDIA_ACESSORIOS_MAX,
  :USA_FAIXA,
  :PERMITE_AVULSO,
  :VALOR_MIN,
  :VALOR_MAX,
  :MES,
  :PAGAR_GESTOR,
  :PERC_MIN,
  :PERC_MAX,
  :GRUPO,
  :CLASSE,
  :APELIDO,
  :CAMPANHA,
  :LEGENDA,
  :ID )
 `


async function create(emp) {
const regra = Object.assign({}, emp); 

var getsequencia = await database.simpleExecute('select max(id) nextID from comissoes_faixa')
let seguencia = getsequencia.rows[0].NEXTID +1
console.log('Cadastro de Nova Regra ID: '+seguencia)
console.log(regra)
const postregra = await database.simpleExecute(createSqlRegra, 
                                                    [  
                                                      regra.COD_EMPRESA,
                                                      regra.DPTO,
                                                      regra.COD_FUNCAO,
                                                      regra.TIPO_COMISSAO,
                                                      regra.QTDE,
                                                      regra.PERC,
                                                      regra.VALOR,
                                                      regra.PREMIO,
                                                      regra.QTDE_MIN,
                                                      regra.QTDE_MAX,
                                                      regra.MEDIA_ACESSORIOS_MIN,
                                                      regra.MEDIA_ACESSORIOS_MAX,
                                                      regra.USA_FAIXA,
                                                      regra.PERMITE_AVULSO,
                                                      regra.VALOR_MIN,
                                                      regra.VALOR_MAX,
                                                      regra.MES,
                                                      regra.PAGAR_GESTOR,
                                                      regra.PERC_MIN,
                                                      regra.PERC_MAX,
                                                      regra.GRUPO,
                                                      regra.CLASSE,
                                                      regra.APELIDO,
                                                      regra.CAMPANHA, 
                                                      regra.LEGENDA,
                                                      seguencia
                                                    ]
                                                    , { autoCommit: true }); 

return regra;
}

module.exports.create = create;

const updateSql =
 `update comissoes_faixa 
  set  
  COD_EMPRESA   = :COD_EMPRESA,
  COD_FUNCAO    = :COD_FUNCAO,
  TIPO_COMISSAO = :TIPO_COMISSAO,
  QTDE          = :QTDE,
  PERC          = :PERC,
  VALOR         = :VALOR,
  PREMIO        = :PREMIO,
  QTDE_MIN      = :QTDE_MIN,
  QTDE_MAX      = :QTDE_MAX,
  MEDIA_ACESSORIOS_MIN = :MEDIA_ACESSORIOS_MIN,
  MEDIA_ACESSORIOS_MAX = :MEDIA_ACESSORIOS_MAX,
  USA_FAIXA     = :USA_FAIXA, 
  PERMITE_AVULSO= :PERMITE_AVULSO, 
  VALOR_MIN     = :VALOR_MIN,
  VALOR_MAX     = :VALOR_MAX,
  MES           = :MES, 
  PAGAR_GESTOR  = :PAGAR_GESTOR,
  PERC_MIN      = :PERC_MIN,
  PERC_MAX      = :PERC_MAX,
  GRUPO         = :GRUPO,
  CLASSE        = :CLASSE,  
  APELIDO       = :APELIDO,
  CAMPANHA      = :CAMPANHA,
  LEGENDA       = :LEGENDA

  where ID = :ID
  `
  ;

async function update(emp) {
  const regra = Object.assign({}, emp); 
  console.log(regra) 
  const result = await database.simpleExecute(updateSql,
                                                [ 
                                                  regra.COD_EMPRESA,
                                                  regra.COD_FUNCAO,
                                                  regra.TIPO_COMISSAO,
                                                  regra.QTDE,
                                                  regra.PERC,
                                                  regra.VALOR,
                                                  regra.PREMIO,
                                                  regra.QTDE_MIN,
                                                  regra.QTDE_MAX,
                                                  regra.MEDIA_ACESSORIOS_MIN,
                                                  regra.MEDIA_ACESSORIOS_MAX,
                                                  regra.USA_FAIXA,
                                                  regra.PERMITE_AVULSO,
                                                  regra.VALOR_MIN,
                                                  regra.VALOR_MAX,
                                                  regra.MES,
                                                  regra.PAGAR_GESTOR,
                                                  regra.PERC_MIN,
                                                  regra.PERC_MAX,
                                                  regra.GRUPO,
                                                  regra.CLASSE,
                                                  regra.APELIDO,
                                                  regra.CAMPANHA, 
                                                  regra.LEGENDA, 
                                                  regra.ID
                                                ], 
                                           { autoCommit: true });
  return regra;  
}



module.exports.update = update;

 
const deleteSql =
 `    delete from comissoes_faixa
    where ID = :ID
 `;

async function del(id) {
 console.log('deletando ID: '+id)
  const result = await database.simpleExecute(deleteSql, [id], { autoCommit: true });

  return result;
}

module.exports.delete = del;
 
