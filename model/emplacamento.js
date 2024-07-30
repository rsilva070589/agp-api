const res = require('express/lib/response.js');
const database = require('../services/database.js');
const { query } = require('express');
const { Context } = require('express-validator/src/context.js');

const baseQuery = 
`select *
   from nbs.agp_emplacamento
  where 1=1
`;

async function find(context) {
//console.log(context)

  let query = baseQuery;
  const binds = {}; 
  if (context?.MES) { 
    binds.MES_VENDA = context.MES; 
    query += `\and MES_VENDA = :MES_VENDA`;
  }
   
  const result = await database.simpleExecute(query, binds);
 
  return result.rows
} 

module.exports.find = find;



const baseQueryValidacao = 
`select a.*,
        
        CASE
        WHEN round(A.IPVA,2) <> :IPVA THEN 'ERRADO'   
        WHEN round(A.IPVA,2) =  :IPVA THEN 'CORRETO'   
        end
        as VALIDACAO
  from nbs.agp_emplacamento a
  where 1=1
`;

async function validacao(context) {
   // console.log(context)
    
      let query = baseQueryValidacao;
      const binds = {}; 
      if (context?.CHASSI) { 
        binds.CHASSI = context.CHASSI; 
        query += `\ and CHASSI = :CHASSI`;
      }

      if (context?.IPVA) { 
        binds.IPVA = context.IPVA;  
      }
        
      const result = await database.simpleExecute(query, binds);

    
      
      gravaseguro(context)
      
     
      return result.rows
    } 

module.exports.validacao = validacao;    

let verificaSeguro = 0
    
async function verificaseguro(context){
    //seguro = data,nome,placa,classi,tx_detran,cecaf,ipva,cartorio,honorarios
    console.log('buscando placa/chassi antes de gravar')
   // console.log(context)
    
    let queryverificaseguro = `select PLACA 
                                from  agpdev.emplacamento_planilia 
                                where PLACA = :placa
                                and  CHASSI = :chassi    
                                `
    const result = await database.simpleExecute(queryverificaseguro, [context.PLACA,context.CHASSI]);     
    verificaSeguro = result.rows?.length || 0                  
}  

async function gravaseguro(context){

    let querygravaseguro = `INSERT INTO agpdev.emplacamento_planilia 
                        (DATA,NOME,PLACA,CHASSI,TX_DETRAN,CECAF,IPVA,CARTORIO,HONORARIOS)
                        values (:DATA,:NOME,:PLACA,:CHASSI,:TX_DETRAN,:CECAF,:IPVA,:CARTORIO,:HONORARIOS)
                        `

await verificaseguro(context)
                        
if (verificaSeguro == 0){
    console.log('Garavado seguro do chassi/placa: ' + context.CHASSI+' / '+context.PLACA)
    await database.simpleExecute(querygravaseguro, [context.DATA,
        context.NOME,
        context.PLACA,
        context.CHASSI,
        context.TX_DETRAN,
        context.CECAF,
        context.IPVA,
        context.CARTORIO,
        context.HONORARIOS]); 
}                        
    

                                                    
}   


module.exports.gravaseguro = gravaseguro;
 