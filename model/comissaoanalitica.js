const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from nbs.AGP_VENDAS x  
   where 1=1 
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.MES) { 
    binds.MES = context.MES;
    console.log(context.MES)
    query += `\nand x.mes_venda = :MES`;
  }

  if (context.EMPRESA) { 
    binds.EMPRESA = context.EMPRESA;
    console.log(context.EMPRESA)
    query += `\nand x.cod_empresa_vendedora = :EMPRESA`;
  }

  if (context.MARCA) { 
    binds.MARCA = context.MARCA;
    console.log(context.MARCA)
    query += `\nand x.MARCA = :MARCA`;
  }

  

  const result = await database.simpleExecute(query, binds);
  const arrayVendaLista = []
  console.log(query)
  console.log('numero de linhas retorno é: '+result.rows.length)
  
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
        "COD_EMPRESA": x.COD_EMPRESA,
        "COD_EMPRESA_VENDEDORA": x.COD_EMPRESA_VENDEDORA,
        "MARCA": x.MARCA,
        "DATA_VENDA": dataAtualFormatada(x.DATA_VENDA),
        "MES_VENDA": x.MES_VENDA,
        "COD_CLIENTE": x.COD_CLIENTE,
        "NOME_CLIENTE": x.NOME_CLIENTE,
        "CHASSI": x.CHASSI,
        "NOVO_USADO": x.NOVO_USADO,
        "DESCRICAO_MODELO": x.DESCRICAO_MODELO,
        "ANO_MODELO": x.ANO_MODELO,
        "COD_PROPOSTA": x.COD_PROPOSTA,
        "VENDEDOR": x.VENDEDOR,
        "TOTAL_VENDA": arredonda(x.TOTAL_VENDA, 2),
        "MARGEM_VENDA": x.MARGEM_VENDA
      }
      arrayVendaLista.push(vendasLista)
    })
  }

  ajustandoLista()

  return arrayVendaLista
}



module.exports.find = find;
