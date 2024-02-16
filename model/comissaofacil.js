 
const database = require('../services/database.js');

const baseQuery = 
`select
x.ID,
x.COD_EMPRESA,
x.TIPO,
x.VENDEDOR,
x.DATA,
x.COD_CLIENTE,
x.CHASSI,
x.REGISTRO,
x.DESC_ITEM,
x.ANO_MODELO,
x.VALOR,
x.FAMILIA,
x.MODELO,
x.DIA,
x.STATUS,
x.GRUPO_COTA,
x.COD_CLIENTE,
cli.nome as CLIENTE
from agpdev.comissao_avulsa x , nbs.CLIENTES CLI
    where X.COD_CLIENTE = cli.cod_cliente (+) 
`;
  function dataAtualFormatada(dataFormat){
    var data = dataFormat,
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }

  var arredonda = function(numero, casasDecimais) {
    casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 2;
    return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
  };
  



async function find(context) {
  let query = baseQuery;
  const binds = {};
  const arrayVendaLista = []

  if (context.MES) { 
    binds.MES = context.MES;
    console.log(context.MES)
    query += `\nand TO_CHAR(x.DATA,'MM/YYYY') = :MES`;
  }

  const result = await database.simpleExecute(query, binds); 
  
 console.log(result.rows.length)

  async function ajustandoLista () {
    if (result.rows.length > 0) {
      result.rows.map(x => {
        const vendasLista = {
          "ID": x.ID,
          "TIPO": x.TIPO,
          "COD_EMPRESA": x.COD_EMPRESA,
          "VENDEDOR": x.VENDEDOR,
          "DATA": dataAtualFormatada(x.DATA), 
          "COD_CLIENTE": x.COD_CLIENTE, 
          "CHASSI": x.CHASSI,
          "REGISTRO": x.REGISTRO,
          "DESC_ITEM": x.DESC_ITEM,
          "ANO_MODELO": x.ANO_MODELO,
          "VALOR": arredonda(x.VALOR, 2),
          "FAMILIA": x.FAMILIA,
          "MODELO": x.MODELO,
          "DIA": x.DIA,
          "STATUS": x.STATUS,
          "GRUPO_COTA": x.GRUPO_COTA,
          "CLIENTE": x.CLIENTE
        }
        arrayVendaLista.push(vendasLista)
      })
    }else{
      arrayVendaLista.push('busca nao retornou dados')
    }
   
  }
  ajustandoLista ()
  return  arrayVendaLista 
} 

module.exports.find = find;

const createSqlComissaoAvulsa =
 `INSERT INTO agpdev.comissao_avulsa  (
    ID
    ,COD_EMPRESA
    ,TIPO
    ,VENDEDOR
    ,DATA
    ,COD_CLIENTE
    ,CHASSI
    ,REGISTRO
    ,DESC_ITEM
    ,ANO_MODELO
    ,VALOR
    ,FAMILIA
    ,MODELO
    ,DIA
    ,STATUS
    ,GRUPO_COTA
  ) values (
    :ID,
    :COD_EMPRESA,
    :TIPO,
    :VENDEDOR,
    :DATA,
    :COD_CLIENTE,
    :CHASSI,
    :REGISTRO,
    :DESC_ITEM,
    :ANO_MODELO,
    :VALOR,
    :FAMILIA,
    :MODELO,
    :DIA,
    :STATUS,
    :GRUPO_COTA
  ) `


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
    return(`${day}-${mes}-${year}`);
    }


  async function create(emp) {
    const item = Object.assign({}, emp); 

    console.log(item)
    
    const result   = await database.simpleExecute('SELECT  agpdev.SEQ_COMISSAO_AVULSA.NEXTVAL as ID_COMISSAO FROM DUAL')
    //console.log(result.rows[0])
    const idComissao = result.rows[0]['ID_COMISSAO']
   
     const TabelaOS = await database.simpleExecute(createSqlComissaoAvulsa, 
                                                         [ 
                                                          idComissao,
                                                          item.COD_EMPRESA,                                                           
                                                          item.TIPO,
                                                          item.VENDEDOR,
                                                          tomorrow(item.DATA),
                                                          item.COD_CLIENTE,
                                                          item.CHASSI,
                                                          item.REGISTRO,
                                                          item.DESC_ITEM,
                                                          item.ANO_MODELO,
                                                          item.VALOR,
                                                          item.FAMILIA,
                                                          item.MODELO,
                                                          item.DIA,
                                                          item.STATUS,
                                                          item.GRUPO_COTA
                                                         ]
                                                         , { autoCommit: true }); 
   
     return item;
   }
   
   module.exports.create = create;


   const updateSql =
 `update agpdev.comissao_avulsa 
  set   
   COD_EMPRESA = :COD_EMPRESA 
  ,COD_CLIENTE = :COD_CLIENTE
  ,CHASSI      = :CHASSI
  ,REGISTRO    = :REGISTRO
  ,DESC_ITEM   = :DESC_ITEM
  ,ANO_MODELO  = :ANO_MODELO
  ,VALOR       = :VALOR
  ,FAMILIA     = :FAMILIA
  ,MODELO      = :MODELO
  ,DIA         = :DIA
  ,STATUS      = :STATUS
  ,GRUPO_COTA  = :GRUPO_COTA

  where ID = :ID
  `
  ;

async function update(emp,res) {
  const obj = Object.assign({}, emp); 
  console.log(obj)  
  const result = await database.simpleExecute(updateSql,
                                                [  
                                                  obj.COD_EMPRESA,                                              
                                                  obj.COD_CLIENTE,
                                                  obj.CHASSI,
                                                  obj.REGISTRO,
                                                  obj.DESC_ITEM,
                                                  obj.ANO_MODELO,
                                                  obj.VALOR,
                                                  obj.FAMILIA,
                                                  obj.MODELO,
                                                  obj.DIA,
                                                  obj.STATUS,
                                                  obj.GRUPO_COTA,
                                                  obj.ID
                                                ], 
                                           { autoCommit: true });
  return obj;  
}



module.exports.update = update;

 
const deleteSql =
 `    delete from agpdev.comissao_avulsa
    where ID = :ID
 `;

async function del(req) {
 console.log('deletando ID: '+req.body.ID) 
  const result = await database.simpleExecute(deleteSql, [req.body.ID || 0], { autoCommit: true });

  return result;
}

module.exports.delete = del;
 

