const postgres = require('../config/postgres.js') 

const res = require('express/lib/response.js');
const oracle = require('../services/database.js');

async function gravaNoOracle (cod_empresa,cod_evento,vendedor)
   
{
  const baseQuery =
  `INSERT INTO agpdev.syonet_vendedor_atrasos (cod_empresa,COD_EVENTO,VENDEDOR)
  VALUES (:cod_empresa,:cod_evento,:vendedor)
  `
   ;  
   const result = await oracle.simpleExecute(baseQuery,[cod_empresa,cod_evento,vendedor]);
   console.log('Gravando Eventos atrasados no Oracle')
   return null

}

async function gravaConsorcio (dado) {

  console.log(dado)

  
  let EMPRESA,VENDEDOR ,DATA_VENDA,NOME,PLANO,GRUPO,COTA,RD,VALOR_COTA,OBS,PROCESSO,COD_CLIENTE = null

  let valor = 0
 if (dado.VALOR_COTA){
  valor = dado.VALOR_COTA.replace('.','').replace(',','.')
 }

  EMPRESA = dado.EMPRESA  ,
  VENDEDOR = dado.VENDEDOR,
  DATA_VENDA = tomorrow(dado.DATA_VENDA),
  NOME = dado.NOME,
  COD_CLIENTE =dado.COD_CLIENTE,
  PLANO = dado.PLANO,
  GRUPO = dado.GRUPO,
  COTA = dado.COTA,
  RD = dado.RD,
  VALOR_COTA = valor,
  OBS = dado.OBS
  PROCESSO = dado.PROCESSO


  queryConsorcio = `insert into agpdev.consorcio_vendas (COD_EMPRESA,VENDEDOR,DATA_VENDA,NOME,COD_CLIENTE,PLANO,GRUPO,COTA,RD,VALOR_COTA,COD_ORIGEM,OBS)
  VALUES (:COD_EMPRESA,:VENDEDOR,:DATA_VENDA,:NOME,:COD_CLIENTE,:PLANO,:GRUPO,:COTA,:RD,:VALOR_COTA,:COD_ORIGEM,:OBS)`

  if (await getProcessoExistente(PROCESSO) == 0){ 

    
    var empresaVendedor = await getEmpresaVendedor(VENDEDOR,EMPRESA);
    console.log('Empresa string : '+EMPRESA + empresaVendedor ) 
        console.log('Gravando Consorcio/processo: ' + PROCESSO)
    

     await database.simpleExecute(queryConsorcio,[
      EMPRESA,VENDEDOR ,DATA_VENDA,NOME,COD_CLIENTE,PLANO,GRUPO,COTA,RD,VALOR_COTA,PROCESSO,OBS
                                          ]); 
    return null
  }   

}


 

const find = async (request, response) => {

const buscaRegistros =  await oracle.simpleExecute('select count(*) as qtde from agpdev.syonet_vendedor_atrasos where trunc(data) = trunc(sysdate)');
var dataAtual = new Date(); 
var horas = dataAtual.getHours();


if(!buscaRegistros.rows[0].QTDE > 0 && horas > 18){
      postgres.pool.query(`SELECT 
      CASE usu.ID_EMPRESA
      WHEN 11  THEN 11   
      WHEN 12  THEN 13
      WHEN 13  THEN 14
      WHEN 14  THEN 41
      WHEN 10  THEN 20
      WHEN  1  THEN 2
      WHEN 15  THEN 30     
    else 000
    END as id_empresa,   
    c.id_evento,
      usu.id_usuarioerp AS vendedor 
    FROM syo_evento c, syo_usuario usu
    WHERE
     --   TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP('15/06/2024', 'DD/MM/YYYY')
     DATE_TRUNC('day', TO_TIMESTAMP(c.dt_horainicio / 1000)) = CURRENT_DATE
    
    and c.id_usuario_atual = usu.id_usuario
    AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
    AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
    AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
    AND c.ID_EVENTO  not in 
    (select a.id_evento from  syo_acao a
    where a.tp_acao not in ('ENCAMINHAMENTO')
    and     a.id_evento=c.id_evento
    and     a.cd_usuarioinc <> 'BOT.ALICE.SYONET'
    )
    ` ,[],  (error, results) => {
        if (error) {
          response.status(400).send(`Ocorreu um erro ao buscar Registros`)
          throw error
        }
        if (!error){
            results.rows.map(x=> {
              gravaNoOracle(x.id_empresa,x.id_evento,x.vendedor)
            })

          
        }
      })?.then(x => x)
}else{
console.log('Hoje ja foi gravado eventos atradados')
}

 
}
 
module.exports.find = find;