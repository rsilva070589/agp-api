const res      = require('express/lib/response.js');
const database = require('../services/database.js');
 

var regrasComissaoFinal = []

var notaNPS = 100


 function mesAtual(){
        var data = new Date(),
            dia  = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0'+dia : dia,
            mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0'+mes : mes,
            anoF = data.getFullYear();

        if (dia < 7){          
          mesF = '0'+(mesF-1) 
        }            
        return mesF +"/"+anoF;
        } 

async function getUsuarios(context) {
  const baseQuery = 
  `select *
    from VW_USUARIOS x  
    where 1=1 
  `;

  let query = baseQuery;
  const binds = {};

  if (context.MES) { 
    binds.MES = context.MES; 
    query += `\nand x.MES = :MES`;
  }

  if (context.NOME) { 
    binds.NOME = context.NOME; 
    query += `\nand x.NOME = :NOME`;
  }

  const result = await database.simpleExecute(query, binds);
  console.log(query)
  console.log('USUARIOS - numero de linhas retorno é: '+result.rows.length)
  return result.rows
}

async function getRegras(context) {
  const baseQuery = 
  `select *
    from COMISSOES_FAIXA x 
    where 1=1    
  `;

  let query = baseQuery;
  const binds = {};


  if (context.MES) { 
    binds.MES = context.MES; 
    query += `\nand x.MES = :MES`;
  }
  if (context.COD_FUNCAO) { 
    binds.COD_FUNCAO = context.COD_FUNCAO; 
    query += `\nand x.COD_FUNCAO = :COD_FUNCAO`;
  }
  const result = await database.simpleExecute(query, binds); 
  return result.rows
}

async function getMeta(context) {
  const baseQuery = 
  `select *
    from meta_vendas x 
    where 1=1
  `;

  const baseQueryFechada = 
  `select *
    from meta_vendas_fechada x 
    where 1=1
  `;

  
 
console.log('O MES ATUAL : '+mesAtual() +' e o MES CONTEXT : '+context.MES)

  let query = null
  if ( context.MES != mesAtual()){
    query = baseQueryFechada
  } else {
    query = baseQuery;
  }
  const binds = {};

  if (context.MES) { 
    binds.MES = context.MES; 
    query += `\nand x.MES_VENDA = :MES`;
  }


 console.log(query)
  const result = await database.simpleExecute(query, binds); 
  
  console.log('Meta - numero de linhas retorno é: '+result.rows.length)
  return result.rows
}

async function getVendas(context) {  
  const baseQuery = 
  `select *
    from vw_comissao x  
    where 1=1     
  `;

  const baseQueryFechada = 
  `select *
    from comissao_encerrada x  
    where 1=1  
  `;

  
  let query = null;

  if ( context.MES != mesAtual()){
    query = baseQueryFechada
  } else {
    query = baseQuery
  }
  const binds = {};

  if (context.MES) { 
    binds.MES = context.MES; 
    query += `\nand x.mes_venda = :MES`;
  }

  if (context.COD_EMPRESA) { 
    binds.COD_EMPRESA = context.COD_EMPRESA; 
    query += `\nand x.cod_empresa_vendedora = :COD_EMPRESA`;
  }

  if (context.MARCA) { 
    binds.MARCA = context.MARCA; 
    query += `\nand x.MARCA = :MARCA`;
  }

  if (context.SETOR) { 
    binds.SETOR = context.SETOR; 
    query += `\nand x.MARCA = :SETOR`;
  }

  if (context.NOME && !context.COLABORADOR) { 
    binds.NOME = context.NOME; 
    query += `\nand x.VENDEDOR = :NOME`;
  }

  if (context.PERIODO_INI) { 
    binds.PERIODO_INI = context.PERIODO_INI; 
    query += `\nand x.DATA_VENDA >= :PERIODO_INI`;
  }
  if (context.PERIODO_FIM) { 
    binds.PERIODO_FIM = context.PERIODO_FIM; 
    query += `\nand x.DATA_VENDA <= :PERIODO_FIM`;
  }


  const baseQueryGroup = 
  `select COD_EMPRESA_VENDEDORA,
          VENDEDOR,
          MES_VENDA,
          MARCA,
          TIPO,
          round(SUM(TOTAL_VENDA),2) TOTAL_VENDA,
          round(SUM(DESPESAS),2) DESPESAS,
          (COUNT(*)) AS QTDE
    from vw_comissao x
    where 1 = 1 
  `;

  const baseQueryGroupFechada = 
  `select COD_EMPRESA_VENDEDORA,
          VENDEDOR,
          MES_VENDA,
          MARCA,
          TIPO,
          round(SUM(TOTAL_VENDA),2) TOTAL_VENDA,
          round(SUM(DESPESAS),2) DESPESAS,
          (COUNT(*)) AS QTDE
    from comissao_encerrada x
    where 1 = 1 
  `;

  let queryGroup = null;
  if ( context.MES != mesAtual()){
    queryGroup = baseQueryGroupFechada
  }else{
    queryGroup = baseQueryGroup
  }
  const bindsGroup = {};

  

  if (context.MES) { 
    bindsGroup.MES = context.MES; 
    queryGroup += `\nand x.mes_venda = :MES`;
  }

  if (context.COD_EMPRESA) { 
    bindsGroup.COD_EMPRESA = context.COD_EMPRESA; 
    queryGroup += `\nand x.cod_empresa_vendedora = :COD_EMPRESA`;
  }

  if (context.MARCA) { 
    bindsGroup.MARCA = context.MARCA; 
    queryGroup += `\nand x.MARCA = :MARCA`;
  }

  if (context.SETOR) { 
    bindsGroup.SETOR = context.SETOR; 
    queryGroup += `\nand x.MARCA = :SETOR`;
  }

  if (context.NOME && !context.COLABORADOR) { 
    bindsGroup.NOME = context.NOME; 
    queryGroup += `\nand x.VENDEDOR = :NOME`;
  }

  if (context.PERIODO_INI) { 
    bindsGroup.PERIODO_INI = context.PERIODO_INI; 
    queryGroup += `\nand x.DATA_VENDA >= :PERIODO_INI`;
  }
  if (context.PERIODO_FIM) { 
    bindsGroup.PERIODO_FIM = context.PERIODO_FIM; 
    queryGroup += `\nand x.DATA_VENDA <= :PERIODO_FIM`;
  }

  queryGroup += ` \group by COD_EMPRESA_VENDEDORA,VENDEDOR,MES_VENDA,MARCA,TIPO`;
  
  console.log(context) 
  const resultGroup = await database.simpleExecute(queryGroup, bindsGroup);
  const result = await database.simpleExecute(query, binds);
  const arrayVendaLista = []
  const arrayVendaGroup = [] 
  console.log('numero de linhas retorno é: '+result.rows.length)
  console.log(queryGroup)  
  console.log('numero de linhas Agrupadas é: '+resultGroup.rows.length)
  
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
        "TOTAL_VENDA": arredonda(x.TOTAL_VENDA,2), 
        "MARGEM_VENDA": x.MARGEM_VENDA,
        "DESPESAS": x.DESPESAS
      }
      arrayVendaLista.push(vendasLista)
    })
  }
   ajustandoLista()

  async function ajustandoListaGroup () {
    resultGroup.rows.map(x => {
      const vendasLista = {
        "TIPO": x.TIPO,       
        "COD_EMPRESA_VENDEDORA": x.COD_EMPRESA_VENDEDORA,
        "MARCA": x.MARCA, 
        "MES_VENDA": x.MES_VENDA,    
        "VENDEDOR": x.VENDEDOR,
        "TOTAL_VENDA": x.TOTAL_VENDA,
        "QTDE": x.QTDE,
        "DESPESAS": x.DESPESAS,
        "ANALITICO": arrayVendaLista.filter(f => f.TIPO == x.TIPO)
      }
      arrayVendaGroup.push(vendasLista)
    })
  }

  ajustandoListaGroup()

  return arrayVendaGroup
}

async function find(context) {   
  const arrayUsuarios = await getUsuarios(context) 
  context.COD_FUNCAO = arrayUsuarios[0].COD_FUNCAO
  const arrayRegras = await getRegras(context) 
  //console.log(arrayUsuarios[0].GESTOR)

  if (arrayUsuarios[0].GESTOR > 0){
    context.COD_EMPRESA = arrayUsuarios[0].GESTOR
    context.COLABORADOR = context.NOME
  }

  if (arrayUsuarios[0].GESTOR == 'M'){
    context.MARCA = arrayUsuarios[0].MARCA
    context.COLABORADOR = context.NOME
  }

  const arrayVendas = await getVendas(context)
   

 
  const arrayComissao = []
  let usuario  = arrayUsuarios.filter(f=> f.NOME == context.NOME).map(x => x)[0]

  const metaGet   = await getMeta(context)
  const meta =  metaGet.filter(f=> f.VENDEDOR==usuario?.NOME)
  console.log(meta)

  if (!usuario?.NOME){
       usuario  = arrayUsuarios.filter(f=> f.NOME == context.NOME).map(x => x)[0]
      }

      if (usuario?.NOME){
        if(usuario.GESTOR == 'N'){
          comissaoFaixa(arrayVendas,usuario,context.MES, meta,arrayRegras).map(x => x.TIPO_COMISSAO).map(tipoComissao => {
            comissaoColaboradores(arrayVendas,tipoComissao,usuario,context.MES,meta,arrayRegras).map(x => {arrayComissao.push(x)}) 
            })
        }
        else{
          comissaoSupervisor(arrayVendas,context.MES, usuario,meta,arrayRegras).map(x => {arrayComissao.push(x)}) 
        }
          
         
       }else{
        arrayComissao.push({erro: 'usuario nao encontrado'})
      }

 //  return arrayVendas    
  return arrayComissao
} 

function somaVendaAcessorio(arrayVendas,usuario,mes) { 
  return 10000
}
   
var arredonda = function(numero, casasDecimais) {
  casasDecimais = typeof casasDecimais !== 'undefined' ?  casasDecimais : 0;
  return +(Math.floor(numero + ('e+' + casasDecimais)) + ('e-' + casasDecimais));
};

function somaValor(array) { 
  var arr =  array     
  var sum = 0; 
  for(var i =0;i<arr.length;i++){ 
    sum+=arr[i]; 
  }     
  return arredonda(sum,2)
}

function comissaoFaixa(arrayVendas,usuario,mes,meta,arrayRegras) { 
  console.log('inicio Funcao comissaoFINAL') 
  regrasComissaoFinal = []
 
  if (1) { 
    arrayRegras.filter(   f =>   f.USA_FAIXA == 'S' 
                              && f.MES == mes
                              && f.COD_EMPRESA == usuario.COD_EMPRESA
                              && f.COD_FUNCAO ==  usuario.COD_FUNCAO
                              &&  meta[0]?.QTDE   >= f.QTDE_MIN
                              &&  meta[0]?.QTDE   <= f.QTDE_MAX 
                              &&  f.MEDIA_ACESSORIOS_MIN == null
                              &&  f.VALOR_MIN == null
                              &&  f.QTDE_MIN > 0       
                                                   
              ).map(x => {
                  console.log('Bloco-1: '+x.TIPO_COMISSAO +' META: '+meta[0]?.QTDE)
                      regrasComissaoFinal.push(x)
                                    })

                arrayRegras.filter(f =>     f.USA_FAIXA == 'S' 
                                && f.MES == mes
                                && f.COD_EMPRESA == usuario.COD_EMPRESA
                                && f.COD_FUNCAO ==  usuario.COD_FUNCAO
                                &&  somaVendaAcessorio(arrayVendas,usuario,mes) >= f.MEDIA_ACESSORIOS_MIN
                                &&  somaVendaAcessorio(arrayVendas,usuario,mes) <  f.MEDIA_ACESSORIOS_MAX
                                &&  f.MEDIA_ACESSORIOS_MIN > 0
                                &&  f.VALOR_MIN == null
                                          ).map(x => {
                                            console.log('Bloco-2: '+x.TIPO_COMISSAO)
                                            regrasComissaoFinal.push(x)
                                    }) 

 
              arrayRegras.filter(f =>    f.USA_FAIXA == 'S'  
                                      && f.MES == mes
                                      && f.COD_EMPRESA == usuario.COD_EMPRESA
                                      && f.COD_FUNCAO ==  usuario.COD_FUNCAO
                                      &&  meta.filter(fm => fm.TIPO == f.TIPO_COMISSAO).map(x => x.TOTAL_VENDA) >= f.VALOR_MIN
                                      &&  meta.filter(fm => fm.TIPO == f.TIPO_COMISSAO).map(x => x.TOTAL_VENDA) <  f.VALOR_MAX
                                      &&  f.VALOR_MIN > 0
                                      &&  f.MEDIA_ACESSORIOS_MIN == null
              ).map(x => { console.log('Bloco-3: '+x.TIPO_COMISSAO)
              regrasComissaoFinal.push(x)
                    }) 
                          arrayRegras.filter(f => f.USA_FAIXA != 'S' 
                              && f.MES == mes
                              && f.COD_EMPRESA == usuario.COD_EMPRESA
                              && f.COD_FUNCAO ==  usuario.COD_FUNCAO
                                    ).map(x => {
                                      console.log('Bloco-4: '+x.TIPO_COMISSAO)
                                  //    console.log(x)
                                  regrasComissaoFinal.push(x)
                                    })      
      
                                    return regrasComissaoFinal 
                                   }
    
}

function valorComissao(empresa, tipo, vlr_venda,arrayVendas,colaborador) {
  console.log(empresa+' - '+tipo+' - '+vlr_venda+' - '+colaborador)

  var vlrComissao = 0     
    regrasComissaoFinal.filter(f => f.COD_EMPRESA == empresa && f.TIPO_COMISSAO == tipo ).map(x => {     
      
    if (x.PERC > 0) { 
        
        vlrComissao = vlr_venda *  x.PERC 
    } 
    if (x.PERC == 0  && vlr_venda > 0) {   
                      
        vlrComissao = x.VALOR                     
    } 
    if (x.PERC == 0  && vlr_venda == 0) {    
                   
      vlrComissao = arrayVendas?.filter(f => f.TIPO == tipo && f.VENDEDOR == colaborador).map(x=> x.QTDE) * x.VALOR                    
    } 
    if (x.VALOR > 0 && x.PERC == 0 && x.PREMIO != 'S') {
      vlrComissao = x.VALOR * arrayVendas?.filter(f => f.TIPO == tipo && f.VENDEDOR == colaborador)[0].ANALITICO.length
      //
  }  
    })                 
   // console.log(tipo +' - '+ vlr_venda+' - '+vlrComissao)
    return vlrComissao           || 0     
}

function comissaoPerc(empresa, tipo, meta){
  var perc_valor = 0        
  regrasComissaoFinal.filter(f => f.COD_EMPRESA == empresa && f.TIPO_COMISSAO == tipo ).map(x => {            
          if (x.PERC > 0) {
              perc_valor = x.VALOR 
          } 
          if (x.VALOR == 0 && x.QTDE <= meta.QTDE) {
              perc_valor = x.VALOR
          }   
         
          if (x.PREMIO == 'S' && x.QTDE <= meta.QTDE) {                                                      
            x.VALOR
          }             
          if (x.PREMIO == 'NPS' && x.QTDE >= notaNPS) {                                                      
              perc_valor = x.VALOR 
          }             
          if (x.PREMIO == 'DSR') {                                                      
              perc_valor = x.PERC
          }   
      })
   
  return perc_valor    

}

function comissaoColaboradores(arrayVendas,tipoComissao,usuario,mes,meta,arrayRegras) {  
 
  const arrayFiltro = []        

  arrayVendas.filter(f => f.MES_VENDA == mes 
                                  && f.VENDEDOR == usuario.NOME                                      
                                  && f.TIPO == tipoComissao
                                  && f.TIPO != 'EMPLACAMENTO'
                                  ).map( x => { 
                                                          const dados = {
                                                          "TIPO":         x.TIPO,
                                                          "COD_EMPRESA":  x.COD_EMPRESA_VENDEDORA,
                                                          "MES_VENDA":    x.MES_VENDA,
                                                          "NOME_CLIENTE": x.NOME_CLIENTE,
                                                          "CHASSI":       x.CHASSI,
                                                          "DESCRICAO_MODELO": x.DESCRICAO_MODELO,
                                                          "VENDEDOR":     x.VENDEDOR,
                                                          "TOTAL_VENDA":  x.TOTAL_VENDA, 
                                                          "DATA":         x.DATA_VENDA,
                                                          "PROPOSTA":     x.COD_PROPOSTA,
                                                          "CPF":          x.COD_CLIENTE,
                                                          "COMISSAO":     arredonda(valorComissao(x.COD_EMPRESA_VENDEDORA, x.TIPO, x.TOTAL_VENDA, arrayVendas,usuario.NOME),2),
                                                          "PERCENTUAL":   comissaoPerc(x.COD_EMPRESA_VENDEDORA, x.TIPO,meta) * 100,
                                                          "QTDE":         x.QTDE,
                                                          "CLASSE":       arrayRegras.filter(f => f.TIPO_COMISSAO == x.TIPO)[0]?.CLASSE,
                                                          "APELIDO":      arrayRegras.filter(f => f.TIPO_COMISSAO == x.TIPO)[0]?.APELIDO,
                                                          "DESPESAS":     somaValor(x.ANALITICO.map(x => x.DESPESAS)) ,
                                                          "ANALITICO":    x.ANALITICO,
                                                          "BLOCO": "NORMAL",
                                                          "PERC": arrayRegras.filter(f => f.TIPO_COMISSAO == x.TIPO)[0]?.PERC,
                                                          

                                                      } 
                                                      arrayFiltro.push(dados)             
                                                      })        
  //calculando Bonus do Vendedor
    regrasComissaoFinal.filter(f => f.PREMIO == 'S' && f.TIPO_COMISSAO==tipoComissao).map( bonus => {
                            const dados = {
                              "TIPO":         bonus.TIPO_COMISSAO,
                              "COD_EMPRESA":  usuario.COD_EMPRESA,
                              "MES_VENDA":    mes,                                                            
                              "VENDEDOR":     usuario.NOME,
                              "TOTAL_VENDA":  0,                        
                              "COMISSAO":     arredonda(valorComissao(usuario.COD_EMPRESA, bonus.TIPO_COMISSAO, bonus.VALOR)),
                              "PERCENTUAL":   0,
                              "APELIDO":      arrayRegras.filter(f => f.TIPO_COMISSAO == bonus.TIPO_COMISSAO)[0]?.APELIDO,                              
                              "QTDE": 1,
                              "BLOCO": 'PREMIO',
                              "CLASSE":       'PREMIACOES'
                          } 
  arrayFiltro.push(dados)     
  })

  return arrayFiltro
}

function comissaoSupervisor(arrayVendas,mes,usuario,meta,arrayRegras) {  
  const arrayGestor = []    
  const arrayFiltro = [] 
  const arrayVendasLista = []
  const arrayfiltroGestorFaixa = []    
  const arrayAjusteObjeto = []
                                         
                                          if(usuario?.GESTOR > 1){ 
                                          arrayVendas.filter(f => f.COD_EMPRESA_VENDEDORA == usuario.COD_EMPRESA
                                                                  &&    f.MES_VENDA  == mes
                                                                  &&    f.TIPO       != 'DSR' 
                                                                       ).map(x => {
                                                                                    const dados = {
                                                                                                  "COD_EMPRESA":  x.COD_EMPRESA_VENDEDORA,
                                                                                                  "TIPO":         x.TIPO,
                                                                                                  "TOTAL_VENDA":  arredonda(x.TOTAL_VENDA,2),
                                                                                                  "MES_VENDA":    x.MES_VENDA,
                                                                                                  "QTDE":         meta.TOTAL_VENDA ||0,
                                                                                                  "ANALITICO":    x.ANALITICO,
                                                                                                  "COMISSAO":    arredonda(x.TOTAL_VENDA * x.PERC,2) 
                                                                                                  }
                                                                                                  arrayFiltro.push(dados)
                                                                                                  })
                                          } 
                                              if(usuario?.GESTOR == 'M'){
                                                arrayVendas.filter(f => f.MARCA == usuario.MARCA 
                                                  &&    f.MES_VENDA == mes
                                                  ).map(x => {
                                                                                    const dados = {
                                                                                                  "COD_EMPRESA":  x.COD_EMPRESA_VENDEDORA,
                                                                                                  "TIPO":         x.TIPO,
                                                                                                  "TOTAL_VENDA":  arredonda(x.TOTAL_VENDA,2),
                                                                                                  "MES_VENDA":    x.MES_VENDA,
                                                                                                  "QTDE":         qtdeVenda(x.TOTAL_VENDA),
                                                                                                  "ANALITICO":    x.ANALITICO,
                                                                                                  "COMISSAO":    arredonda(x.TOTAL_VENDA * x.PERC,2) 
                                                                                                  }
                                                                                                  arrayFiltro.push(dados)
                                                                                                  }) 
                                              }
                                             
                                          
                                         //GESTOR SEM FAIXA
                                         arrayRegras.filter(f => f.MES==mes && f.COD_EMPRESA == usuario.COD_EMPRESA && f.COD_FUNCAO == usuario.COD_FUNCAO && f.USA_FAIXA != 'S').map(r => {
                                                   
                                              if(r.PREMIO=='S' && r.PERMITE_AVULSO!='S'){
                                                  const valorTotalDpto  = { 
                                                  "TOTAL_VENDA":    0,
                                                  "QTDE":           arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.length,
                                                  "VENDEDOR":       usuario.NOME, 
                                                  "TIPO":           r.TIPO_COMISSAO,
                                                  "COMISSAO":       r.VALOR,
                                                  "USA_FAIXA": 'N',
                                                  "CLASSE": r.CLASSE,
                                                  "APELIDO": r.APELIDO,
                                                  "BLOCO": "1",
                                                  "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                                          } 
                                                      arrayGestor.push(valorTotalDpto)  
                                                  }   
                                                  
                                                  if(r.PREMIO=='S' && r.PERMITE_AVULSO=='S' && r.PERC == 0){                                                  
                                                  const valorTotalDpto  = { 
                                                  "TOTAL_VENDA":    0,
                                                  "QTDE":           arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.length,
                                                  "VENDEDOR":       usuario.NOME,
                                                  "TIPO":           r.TIPO_COMISSAO,
                                                  "COMISSAO":       somaValor(vendas.filter(f => f.MARCA == usuario.MARCA && f.VENDEDOR == usuario.NOME
                                                                      &&    f.MES_VENDA == mes
                                                                      &&      f.TIPO == r.TIPO_COMISSAO
                                                                      ).map( x=> x.TOTAL_VENDA)),
                                                  "USA_FAIXA": 'N' ,
                                                  "CLASSE": r.CLASSE,
                                                  "APELIDO": r.APELIDO,
                                                  "BLOCO": "2",
                                                  "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                                          } 
                                                      arrayGestor.push(valorTotalDpto)  
                                                  }     
                                                  if(r.PREMIO=='S' && r.PERMITE_AVULSO=='S' && r.PERC > 0){
                                                    //  console.log(r)
                                                  const valorTotalDpto  = { 
                                                  "TOTAL_VENDA":    0,
                                                  "QTDE":           arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.length,
                                                  "VENDEDOR":       usuario.NOME,
                                                  "TIPO":           r.TIPO_COMISSAO,
                                                  "COMISSAO":       somaValor(arrayVendas.filter(f => f.MARCA == usuario.MARCA && f.VENDEDOR == usuario.NOME
                                                                      &&    f.MES_VENDA == mes
                                                                      &&      f.TIPO == r.TIPO_COMISSAO
                                                                      ).map( x=> x.TOTAL_VENDA)  ) *r.PERC,
                                                  "USA_FAIXA": 'N' ,
                                                  "CLASSE": r.CLASSE,
                                                  "APELIDO": r.APELIDO,
                                                  "BLOCO": "3",
                                                  "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                                          } 
                                                      arrayGestor.push(valorTotalDpto)  
                                                  }                                        
                                                  if(r.PREMIO=='N'){
                                                  const valorTotalDpto  = { 
                                                    "TOTAL_VENDA":    somaValor(arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.TOTAL_VENDA)),
                                                    "QTDE":           arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.length,
                                                    "VENDEDOR":       usuario.NOME,
                                                    "TIPO":           r.TIPO_COMISSAO,
                                                    "COMISSAO":       somaValor(arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.TOTAL_VENDA * r.PERC )),
                                                    "USA_FAIXA": 'N',
                                                    "CLASSE": r.CLASSE,
                                                    "APELIDO": r.APELIDO,
                                                    "LEGENDA": r.LEGENDA,
                                                    "DESPESAS": somaValor(arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.map(x => x.DESPESAS)|| 0),
                                                    "BLOCO": "4",
                                                    "PERC": r.PERC,
                                                    "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                                          } 
                                                      arrayGestor.push(valorTotalDpto)  
                                                  }
                                                  if(r.PREMIO=='DSR'){
                                                  const valorTotalDpto  = { 
                                                  "TOTAL_VENDA":    0,
                                                  "QTDE":           arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]?.length,
                                                  "VENDEDOR":       usuario.NOME,
                                                  "TIPO":           r.PREMIO,
                                                  "COMISSAO":       somaValor(arrayGestor.filter(f => f.TIPO != 'SALARIO-FIXO').map(x => x.COMISSAO))* r.PERC,
                                                  "USA_FAIXA": 'N',
                                                  "CLASSE": r.CLASSE,
                                                  "APELIDO": r.APELIDO,
                                                  "BLOCO": "5",
                                                  "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                                  }              
                                                      arrayGestor.push(valorTotalDpto)  
                                                  }
                                           
                                         
                                          })  


                                           //GESTOR COM FAIXA
                                           arrayVendas.map(x => x.ANALITICO.map(n1 => {arrayVendasLista.push(n1)}))

 
                                           arrayRegras.filter(f => f.MES==mes && f.COD_EMPRESA == usuario.COD_EMPRESA && f.COD_FUNCAO == usuario.COD_FUNCAO && f.USA_FAIXA == 'S').map(r => {
                                            arrayVendasLista.filter(
                                              f =>   f.MARCA == usuario.MARCA
                                                  && f.MES_VENDA == mes
                                                  && f.TIPO == r.TIPO_COMISSAO
                                          ).map(item => {  
                                          //  console.log(item.TIPO)  
                                                              arrayRegras.filter(f =>  f.MES   == mes
                                                                                  && f.COD_EMPRESA == usuario.COD_EMPRESA
                                                                                  && f.COD_FUNCAO  == usuario.COD_FUNCAO
                                                                                  && f.USA_FAIXA   == 'S' 
                                                                                  && f.PERC_MIN < item?.MARGEM_VENDA
                                                                                  && f.PERC_MAX > item?.MARGEM_VENDA
                                                                                  &&  f.MEDIA_ACESSORIOS_MIN == null
                                                                                  &&  f.TIPO_COMISSAO == item.TIPO
                                                                              ).map(rf => { 
                                                                                  
                                                                                 var dadosVendas  = {
                                                                                  "CHASSI": item.CHASSI,                                                                                         
                                                                                  "CPF": item.COD_CLIENTE,
                                                                                  "DATA": item.DATA_VENDA,
                                                                                  "COD_EMPRESA": item.EMPRESA,
                                                                                  "MES_VENDA": item.MES_VENDA,
                                                                                  "NOME_CLIENTE": item.NOME_CLIENTE,
                                                                                  "PROPOSTA": item.COD_PROPOSTA,
                                                                                  "DESCRICAO_MODELO": item.DESCRICAO_MODELO,
                                                                                  "COD_PROPOSTA": item.COD_PROPOSTA,
                                                                                  "MARGEM_VENDA": item.MARGEM_VENDA,
                                                                                  "TOTAL_VENDA": item.TOTAL_VENDA,
                                                                                  "TIPO": item.TIPO,
                                                                                  "QTDE": item.QTDE,
                                                                                  "PERCENTUAL": rf.PERC,
                                                                                  "COMISSAO": arredonda(item.TOTAL_VENDA * rf.PERC,2) ,
                                                                                  "VENDEDOR":       usuario.NOME                                                                       
                                                                                  } 
                                                                              
                                                                                  if(arrayfiltroGestorFaixa.filter(f => f.COD_PROPOSTA == item.COD_PROPOSTA ).length == 0){
                                                                                   // console.log(dadosVendas)
                                                                                   arrayfiltroGestorFaixa.push(dadosVendas) 
                                                                                  }
                                                                              })
                                                          })                         

                                          if(r.PREMIO='S' && arrayGestor.filter(f => f.TIPO==r.TIPO_COMISSAO).length == 0){
                                          const valorTotalDpto  = { 
                                          "TOTAL_VENDA":    somaValor(arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO && f.MES_VENDA   == mes).map(x => x.TOTAL_VENDA)),
                                          "QTDE":           arrayfiltroGestorFaixa.filter(f => f.TIPO == r.TIPO_COMISSAO && f.MES_VENDA   == mes).length,
                                          "VENDEDOR":       usuario.NOME,
                                          "TIPO":           r.TIPO_COMISSAO,
                                          "COMISSAO":       somaValor(arrayfiltroGestorFaixa.filter(f => f.TIPO == r.TIPO_COMISSAO && f.MES_VENDA   == mes).map(x => x.COMISSAO)),
                                          "USA_FAIXA": 'S',
                                          "APELIDO": r.APELIDO,
                                          "BLOCO": "6",
                                          "ANALITICO": arrayFiltro.filter(f => f.TIPO == r.TIPO_COMISSAO).map(x => x.ANALITICO)[0]
                                                          }              
                                              arrayGestor.push(valorTotalDpto)  
                                          }   
                                          })
 
                                           
  return arrayGestor.filter(f => f.COMISSAO > 0)
}

function qtdeVenda(valor){
  let qtde = 1
  if (valor < 0) {
      qtde = -1
  }
  return qtde
}

function formataDinheiro(item) {
  let venda = item;
  if (!!venda && venda.toString().includes(",")) {
    venda = venda.toString().replace(",", ".");
  }
  return parseFloat(venda)
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

 


module.exports.find = find;
