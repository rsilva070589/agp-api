const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from nbs.agp_comissao_calculada x
   WHERE 1=1
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};
  console.log(context)
  if (context.MES) { 
    binds.MES = context.MES;
    console.log(context.MES)
    query += `AND x.MES_VENDA = :MES `;
  }

  

  if (context.MARCA) { 
    binds.MARCA = context.MARCA;
    console.log(context.MARCA)
    query += `and x.MARCA = :MARCA `;
  }

  console.log(query)
  const result = await database.simpleExecute(query,binds);
  const arrayVendaLista = []
  
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
  
  async function ajustandoLista () {
    result.rows.map(x => {
      const vendasLista = {
        "TIPO": x.TIPO,
        "COD_EMPRESA_VENDEDORA": x.COD_EMPRESA_VENDEDORA,
        "MES_VENDA": x.MES_VENDA,
        "VENDEDOR": x.VENDEDOR,
        "QTDE":  x.QTDE, 
        "TOTAL_VENDA": arredonda(x.TOTAL_VENDA, 2),
        "QTDE_META": x.QTDE_META,
        "VALOR_COMISSAO": x.VALOR_COMISSAO,
        "MARCA": x.MARCA
      }
      arrayVendaLista.push(vendasLista)
    })
  }

  ajustandoLista()

  return arrayVendaLista
}



module.exports.find = find;
