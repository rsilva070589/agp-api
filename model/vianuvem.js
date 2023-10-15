const res       = require('express/lib/response.js');
const database  = require('../services/database.js');
const axios     = require('axios');

var apolise = []
let tokenvianuvem = false;
let datatoken = false; 
var hoje = new Date();

async function getDados(){
  let data = JSON.stringify({
    "login": "integracao.agp",
    "pass": "Nbsi135@",
    "encryptedPass": false
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://webservices.vianuvem.com.br/AdminVianuvem/public/token',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  if (tokenvianuvem == false && datatoken == false){
    await axios.request(config)
    .then((response) => { 
      tokenvianuvem = response.data.token   
      datatoken = hoje.getHours()
      console.log('Buscando Token')   
    })
    .catch((error) => {
      console.log(error);
    });
  }

  if ((datatoken+6) < hoje.getHours()){
    await axios.request(config)
    .then((response) => { 
      tokenvianuvem = response.data.token   
      datatoken = hoje.getHours()
      console.log('Revalidando Token')   
    })
    .catch((error) => {
      console.log(error);
    });
  }

 
  if(tokenvianuvem && (datatoken+6) > hoje.getHours()){ 
    console.log('proxima busca token ocorre em:' +((datatoken + 6) - datatoken) +' Horas')
    return getVianuvem(tokenvianuvem) 
  }
 
  
}
 

async function getVianuvem(token){ 

let data = JSON.stringify({
  "documentId": '',
  "establishmentIds": [],
  "processTypeIds": [],
  "documentTypeIds": [],
  "initialDate": "01/10/2023 00:37:28",
  "finalDate": "",
  "searchFor": "SEGURO",
  "like": false
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://webservices.vianuvem.com.br/AdminVianuvem/api/process/search\n',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer '+ tokenvianuvem
  },
  data : data
};
console.log('funcao get via nuvem')

 
await  axios.request(config)
  .then((response) =>{ 
  apolise = []
      response.data.processes.map( x=> {
        const dado = {
            PROCESSO:   x.processId,
            DATA:       x.indexerVO.filter(f => f.indexerLabel=='DATA DA VENDA DO SEGURO')[0].indexerValue,
            PROPOSTA:   x.indexerVO.filter(f => f.indexerLabel=='NÚMERO DA PROPOSTA')[0].indexerValue,
            CLIENTE:    x.indexerVO.filter(f => f.indexerLabel=='NOME DO CLIENTE')[0].indexerValue,
            EMPRESA:    x.processEstablishmentBreadCrumb[0],
            CPF:        x.indexerVO.filter(f => f.indexerLabel=='CPF')[0].indexerValue,
            CHASSI:     x.indexerVO.filter(f => f.indexerLabel=='CHASSI')[0].indexerValue,
            SEGURADORA: x.indexerVO.filter(f => f.indexerLabel=='SEGURADORAS')[0].indexerValue,
            VENDEDOR:   x.indexerVO.filter(f => f.indexerLabel=='VENDEDOR DO SEGURO')[0].indexerValue,
            CILIDRADA:  x.indexerVO.filter(f => f.indexerLabel=='CILIDRADA')[0].indexerValue,
            CPF_SEGURADO:  x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0].indexerValue,
        } 
    apolise.push(dado) 
    gravaSeguro(dado.DATA,dado.PROPOSTA,dado.EMPRESA,dado.CHASSI,dado.VENDEDOR,dado.CPF_SEGURADO||'-'||dado.PROCESSO||'-'||dado.SEGURADORA)
    } ) 
    })
    .catch((error) => {
      console.log(error);
    });    
  
    return apolise
} 

async function find(){   
  return getDados()  
}


const baseQuery = 
`
INSERT INTO nbs.fi_servicos_proposta
(DATA_VENDA,
COD_PROPOSTA,
COD_EMPRESA ,
OBS,
CHASSI_COMPLETO,
VENDEDOR,
SEQUENCIA,
VALOR_SERVICO, 
COD_TIPO,
COD_SERVICO_FI, 
COD_CLIENTE,
SEQUENCIA_AGENTE
)
VALUES (
sysdate,
:COD_PROPOSTA,
14,
:OBS,
:CHASSI,
:VENDEDOR,
:seguencia,
25, 
308,
308, 
17291690000188,
655)
`;  

const baseQuerySeguro = 
`
select cod_proposta from nbs.fi_servicos_proposta
where cod_servico_fi=308
and  cod_proposta=:cod_proposta
`;  
 
async function getPropostaExistente(proposta) { 
  console.log('Buscando Proposta: ' + proposta)
  const result = await database.simpleExecute(baseQuerySeguro,[proposta]);
 
  console.log(result.rows?.length)
  return result.rows?.length || 0
}

async function gravaSeguro(data,proposta,empresa,chassi,vendedor,obs) {
  console.log(proposta,chassi,vendedor,obs) 


if (await getPropostaExistente(proposta) == 0){  
  const sqlsequencia = `SELECT nbs.seq_fi_sequencia.NEXTVAL SEQ_FI FROM DUAL`
  const resultseq   = await database.simpleExecute(sqlsequencia)  
  const sequencia = resultseq.rows[0]['SEQ_FI']
  console.log(sequencia)  
  console.log('Gravando Proposta: ' + proposta)
  const result = await database.simpleExecute(baseQuery,[proposta,obs,chassi,vendedor,sequencia]); 
  return null
} 
  
}




module.exports.find = find;
