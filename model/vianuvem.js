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
    console.log('proxima busca token ocorre em:' +((datatoken + 6) - hoje.getHours()) +' Horas')
    
  //  getVianuvem("Veiculo entregue")
    return   getVianuvem("Seguro registrado") 
  }
 
  
}
 

async function getVianuvem(tipobusca){ 

let data = JSON.stringify({
  "documentId": '',
  "establishmentIds": [],
  "processTypeIds": [],
  "documentTypeIds": [],
  "initialDate": "01/10/2023 00:37:28",
  "finalDate": "",
  "searchFor": tipobusca,
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
            DATA:       x.indexerVO.filter(f => f.indexerLabel=='DATA DA VENDA DO SEGURO')[0]?.indexerValue,
            PROPOSTA:   x.indexerVO.filter(f => f.indexerLabel=='NÚMERO DA PROPOSTA')[0]?.indexerValue,
            CLIENTE:    x.indexerVO.filter(f => f.indexerLabel=='NOME DO CLIENTE')[0]?.indexerValue,
            EMPRESA:    x.processEstablishmentBreadCrumb[0],
            CPF:        x.indexerVO.filter(f => f.indexerLabel=='CPF')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue,
            CHASSI:     x.indexerVO.filter(f => f.indexerLabel=='CHASSI')[0]?.indexerValue,
            SEGURADORA: x.indexerVO.filter(f => f.indexerLabel=='SEGURADORAS')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='SEGURADORA')[0]?.indexerValue,
            VENDEDOR:   x.indexerVO.filter(f => f.indexerLabel=='VENDEDOR DO SEGURO')[0]?.indexerValue,
            CILINDRADA:  x.indexerVO.filter(f => f.indexerLabel=='CILIDRADA')[0]?.indexerValue ||x.indexerVO.filter(f => f.indexerLabel=='CILINDRADA')[0]?.indexerValue,
            CPF_SEGURADO:  x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue,
        } 
    
    if (dado.SEGURADORA == undefined && dado.DATA == undefined){
      console.log('Processo: '+dado.PROCESSO+' - '+dado.CLIENTE+' nao tem seguro')
    } else{
      apolise.push(dado) 
      gravaSeguro(tomorrow(dado.DATA),dado.PROPOSTA,dado.CHASSI,dado.VENDEDOR,dado.CPF_SEGURADO||'-'||dado.PROCESSO,dado.SEGURADORA,dado.CILINDRADA,dado.CPF,dado.PROCESSO)
    } 
    
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
COD_PLANO,
COD_ORIGEM,
VALOR_SERVICO, 
COD_TIPO,
COD_SERVICO_FI, 
COD_CLIENTE, 
cod_cliente_destino,
SEQUENCIA_AGENTE
)
VALUES (
:data_venda,
:COD_PROPOSTA,
:cod_empresa,
:OBS,
:CHASSI,
:VENDEDOR,
:seguencia,
:COD_PLANO,
:COD_ORIGEM,
0, 
:COD_TIPO,
308, 
17291690000188,
:cod_cliente_destino,
655)
`;  

const baseQuerySeguro = 
`
select cod_proposta from nbs.fi_servicos_proposta
where cod_servico_fi=308
and  cod_proposta=:cod_proposta
`;  

const baseQueryProcesso = 
`
select cod_origem from nbs.fi_servicos_proposta
where cod_servico_fi=308
and  cod_origem=:cod_origem
`;  
 
const baseQueryEmpresa = 
`select cod_empresa from nbs.empresas_usuarios eu where eu.nome = (select                    nvl(eu.usuario_principal,eu.nome)
                                                                  from nbs.empresas_usuarios eu
                                                                         where eu.nome = (select nvl(eu.usuario_principal,eu.nome)
                                                                  from nbs.empresas_usuarios eu
                                                                         where eu.nome = :vendedor))
`; 

async function getPropostaExistente(proposta) { 
  console.log('Buscando Proposta: ' + proposta)
  const result = await database.simpleExecute(baseQuerySeguro,[proposta]); 
  console.log(result.rows?.length)
  return result.rows?.length || 0
}

async function getProcessoExistente(processo) { 
  console.log('Buscando Processo: ' + processo)
  const result = await database.simpleExecute(baseQueryProcesso,[processo]); 
  console.log(result.rows?.length)
  return result.rows?.length || 0
}

async function getEmpresaVendedor(vendedor) { 
  console.log('Buscando Empresa Vendedor: ' + vendedor)
  const result = await database.simpleExecute(baseQueryEmpresa,[vendedor]); 
  return result.rows[0]?.COD_EMPRESA || 0
}

function getTipoSeguradora (seguradora){
  let tipo = 0
  if(seguradora == 'MAPFRE'){ tipo = 123}
  if(seguradora == 'SUHAI'){ tipo = 124}
  if(seguradora == 'ALLIANZ'){ tipo = 125}  
  if(seguradora == 'PORTO SEGURO'){ tipo = 126}
  if(seguradora == 'TOKIO MARINE'){ tipo = 127}
  return tipo
}

async function gravaSeguro(data,proposta,chassi,vendedor,obs,seguradora,cilindrada,cpf,processo) {
               console.log(data,proposta,chassi,vendedor,obs,seguradora,cilindrada,cpf,processo) 
  if (await getPropostaExistente(proposta) == 0 && await getProcessoExistente(processo) == 0){  
    const sqlsequencia = `SELECT nbs.seq_fi_sequencia.NEXTVAL SEQ_FI FROM DUAL`
    const resultseq   = await database.simpleExecute(sqlsequencia)  
    const sequencia = resultseq.rows[0]['SEQ_FI']

    var empresaVendedor = await getEmpresaVendedor(vendedor)
    console.log('Empresa do Vendedor é : '+empresaVendedor)
    
    console.log(sequencia)  
    console.log('Gravando Proposta/processo: ' + proposta||processo)
    const result = await database.simpleExecute(baseQuery,[data,proposta,empresaVendedor,obs,chassi,vendedor,sequencia,cilindrada,processo,getTipoSeguradora(seguradora),cpf]); 
    return null
  }   
} 

 

const tomorrow = (dt) => {

  function FormataStringData(data) {
    var dia  = data.split("/")[0];
    var mes  = data.split("/")[1];
    var ano  = data.split("/")[2];
  
    return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }
  
 
 
  // Creating the date instance
  let d = new Date(FormataStringData(dt));

  // Adding one date to the present date
  d.setDate(d.getDate() + 1);

  let year = d.getFullYear()
  let  month = String(d.getMonth() + 1)
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
    return d
  }
  
  }


module.exports.find = find;
