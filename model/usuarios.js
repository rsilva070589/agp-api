const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from VW_USUARIOS  
  WHERE 1=1
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.MES) { 
    binds.MES = context.MES;
    console.log(context.MES)
    query += `\AND MES = :MES`;
  }

 
  //query +='\ order by user.nome_completo'
  console.log(context)
  console.log(query)
  const result = await database.simpleExecute(query, binds);

  return result.rows
}



module.exports.find = find;


const tomorrow = (dt) => {
  
  // Creating the date instance
  let d = new Date(dt);

  // Adding one date to the present date
  d.setDate(d.getDate() + 1);

  let year = d.getFullYear()
  let month = String(d.getMonth() + 1)
  let day = String(d.getDate())
  let mes = null

  // Adding leading 0 if the day or month
  // is one digit value
  month = month.length == 1 ? 
      month.padStart('2', '0') : month;

      if(month == '01'){ mes = 'Jan' }
      if(month == '02'){ mes = 'Feb' }
      if(month == '03'){ mes = 'Mar' }
      if(month == '04'){ mes = 'Apr' }
      if(month == '05'){ mes = 'May' }
      if(month == '06'){ mes = 'Jun' }
      if(month == '07'){ mes = 'Jul' }
      if(month == '08'){ mes = 'Aug' }
      if(month == '09'){ mes = 'Sep' }
      if(month == '10'){ mes = 'Oct' }
      if(month == '11'){ mes = 'Nov' }
      if(month == '12'){ mes = 'Dec' }        


  //day = day.length == 1 ? 
    //  day.padStart('2', '0') : day;

  // Printing the present date
  console.log(`${day}-${mes}-${year}`)
  if (year > '1970'){
    return(`${day}-${mes}-${year}`);
  }else{
    return null
  }
  
  }


const createSqlComissaoAvulsa =
 `INSERT INTO usuarios   (    
     COD_EMPRESA
    ,NOME_EMPRESA
    ,NOME
    ,NOME_COMPLETO
    ,COD_FUNCAO
    ,FUNCAO
    ,DPTO
    ,GESTOR
    ,MARCA
    ,MES
    ,DIRETORIA 
    ,FERIAS
    ,PERIODO_INI
    ,PERIODO_FIM
  ) values ( 
    :COD_EMPRESA,
    :NOME_EMPRESA,
    :NOME,
    :NOME_COMPLETO,
    :COD_FUNCAO,
    :FUNCAO,
    :DPTO,
    :GESTOR,
    :MARCA,
    :MES,
    :DIRETORIA, 
    :FERIAS,
    :PERIODO_INI,
    :PERIODO_FIM
  ) `



async function create(emp) {
  const item = Object.assign({}, emp); 
  console.log(item)
   const TabelaOS = await database.simpleExecute(createSqlComissaoAvulsa, 
                                                       [ 
                                                        item.COD_EMPRESA,                                                           
                                                        item.NOME_EMPRESA,
                                                        item.NOME,
                                                        item.NOME_COMPLETO,
                                                        item.COD_FUNCAO,
                                                        item.FUNCAO,
                                                        item.DPTO,
                                                        item.GESTOR,
                                                        item.MARCA,
                                                        item.MES,
                                                        item.DIRETORIA, 
                                                        item.FERIAS,
                                                        tomorrow(item.PERIODO_INI),
                                                        tomorrow(item.PERIODO_FIM)
                                                       ]
                                                       , { autoCommit: true }); 
 
   return item;
 }
 
 module.exports.create = create;


 const updateSql =
`update usuarios 
set   
 COD_EMPRESA = :COD_EMPRESA
,NOME_EMPRESA= :NOME_EMPRESA 
,NOME_COMPLETO= :NOME_COMPLETO
,COD_FUNCAO  = :COD_FUNCAO
,FUNCAO      = :FUNCAO
,DPTO        = :DPTO
,GESTOR      = :GESTOR
,MARCA       = :MARCA
,MES         = :MES 
,DIRETORIA   = :DIRETORIA
,FERIAS      = :FERIAS
,PERIODO_INI  = :PERIODO_INI
,PERIODO_FIM  = :PERIODO_FIM

where NOME = :NOME
AND   MES  = :MES
`
;

async function update(emp) {
const item = Object.assign({}, emp);
const result = await database.simpleExecute(updateSql,
                                            [ 
                                              item.COD_EMPRESA,                                                           
                                              item.NOME_EMPRESA, 
                                              item.NOME_COMPLETO,
                                              item.COD_FUNCAO,
                                              item.FUNCAO,
                                              item.DPTO,
                                              item.GESTOR,
                                              item.MARCA,
                                              item.MES,
                                              item.DIRETORIA,
                                              item.FERIAS,
                                              tomorrow(item.PERIODO_INI),
                                              tomorrow(item.PERIODO_FIM),
                                              item.NOME,
                                            ],
                                         { autoCommit: true });
 
return item;  
}



module.exports.update = update;


const deleteSql =
`    delete from usuarios
  where NOME = :NOME
  AND   MES  = :MES
`;

async function del(NOME,MES) {
console.log('deletando ID: '+NOME+ ' MES: '+MES)
const result = await database.simpleExecute(deleteSql, [NOME,MES], { autoCommit: true });

return result;
}

module.exports.delete = del;

