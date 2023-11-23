const res       = require('express/lib/response.js');
const database  = require('../services/database.js');
const axios     = require('axios');

var apolise = []
let tokenvianuvem = false;
let datatoken = false; 
 
const arrayIntegrados = []

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
      datatoken = new Date().getHours()
      console.log('Buscando Token')   
    })
    .catch((error) => {
      console.log(error);
    });
  }

  if (datatoken != new Date().getHours()){
    await axios.request(config)
    .then((response) => { 
      tokenvianuvem = response.data.token   
      datatoken = new Date().getHours()
      console.log('Revalidando Token')   
    })
    .catch((error) => {
      console.log(error);
    });
  } 

 
  if(tokenvianuvem && (datatoken == new Date().getHours())) { 
    arrayIntegrados.pop()
    console.log({dataToken: datatoken, horarioAtual: new Date().getHours()})
    await getVianuvem("Seguro registrado",null)
    await getListaBusca()
    await getListaNPS()
    await getVianuvem("",50039722) //Operacões montadora
    return  arrayIntegrados
  }
  
}
 

async function getVianuvem(tipobusca,processTypeIds){ 
  var time = new Date();
  var dataBusca = new Date();
  dataBusca.setDate(time.getDate() - 7); // Adiciona 3 dias
 

let data = JSON.stringify({
  "documentId": '',
  "establishmentIds": [],
  "processTypeIds": [processTypeIds],
  "documentTypeIds": [],
  "initialDate": FormataData(dataBusca) + " 00:37:28",
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
 
await  axios.request(config)
  .then((response) =>{ 
  apolise = [] 
      response.data.processes.map( x=> {
       
        const dado = {}
        if (processTypeIds != '50039722'){
           dado.PROCESSO=   x.processId,
           dado.TIPO=       x.indexerVO.filter(f => f.indexerLabel=='Tipo NPS')[0]?.indexerValue ,
           dado.DATA=       x.indexerVO.filter(f => f.indexerLabel=='DATA DA VENDA DO SEGURO')[0]?.indexerValue || '01/'+x.indexerVO.filter(f => f.indexerLabel=='Ano/Mês (Ex: 2023/09)')[0]?.indexerValue.split('/')[1]+'/'+ x.indexerVO.filter(f => f.indexerLabel=='Ano/Mês (Ex: 2023/09)')[0]?.indexerValue.split('/')[0] || x.indexerVO.filter(f => f.indexerLabel=='DATA ADESÃO')[0]?.indexerValue,
           dado.PROPOSTA=   x.indexerVO.filter(f => f.indexerLabel=='NÚMERO DA PROPOSTA')[0]?.indexerValue,
           dado.CLIENTE=    x.indexerVO.filter(f => f.indexerLabel=='NOME DO CLIENTE')[0]?.indexerValue ,
           dado.EMPRESA=    x.processEstablishmentBreadCrumb[0],
           dado.CPF=        x.indexerVO.filter(f => f.indexerLabel=='CPF')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue,
           dado.CHASSI=     x.indexerVO.filter(f => f.indexerLabel=='CHASSI')[0]?.indexerValue,
           dado.SEGURADORA= x.indexerVO.filter(f => f.indexerLabel=='SEGURADORAS')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='SEGURADORA')[0]?.indexerValue,
           dado.VENDEDOR=   x.indexerVO.filter(f => f.indexerLabel=='VENDEDOR DO SEGURO')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='Consultor de Venda')[0]?.indexerValue?.split('-')[0] ||x.indexerVO.filter(f => f.indexerLabel=='VENDEDOR DO PLANO')[0]?.indexerValue?.split('-')[0],
           dado.CILINDRADA= x.indexerVO.filter(f => f.indexerLabel=='CILIDRADA')[0]?.indexerValue ||x.indexerVO.filter(f => f.indexerLabel=='CILINDRADA')[0]?.indexerValue,
           dado.CPF_SEGURADO=x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue ,
           dado.VALOR=      x.indexerVO.filter(f => f.indexerLabel=='Valor da Nota')[0]?.indexerValue.replace(',','.') ||0 
        }
        if(processTypeIds == '50039722' && x.breadCrumbs[0]?.text != 'NPS POR VENDEDOR'){
          dado.PROCESSO=   x.processId,
           dado.TIPO=       x.breadCrumbs[0]?.text,
           dado.DATA=       x.indexerVO.filter(f => f.indexerLabel=='DATA ADESÃO')[0]?.indexerValue || x.createDate,
           dado.PROPOSTA=   null,
           dado.CLIENTE=    x.indexerVO.filter(f => f.indexerLabel=='NOME DO CLIENTE')[0]?.indexerValue ,
           dado.EMPRESA=    x.processEstablishmentBreadCrumb[0],
           dado.CPF=        x.indexerVO.filter(f => f.indexerLabel=='CPF')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue,
           dado.CHASSI=     x.indexerVO.filter(f => f.indexerLabel=='CHASSI')[0]?.indexerValue,
           dado.SEGURADORA= x.indexerVO.filter(f => f.indexerLabel=='SEGURADORAS')[0]?.indexerValue || x.indexerVO.filter(f => f.indexerLabel=='SEGURADORA')[0]?.indexerValue,
           dado.VENDEDOR=   x.indexerVO.filter(f => f.indexerLabel=='VENDEDOR DO PLANO')[0]?.indexerValue?.split('-')[0],
           dado.CILINDRADA= x.indexerVO.filter(f => f.indexerLabel=='CILIDRADA')[0]?.indexerValue ||x.indexerVO.filter(f => f.indexerLabel=='CILINDRADA')[0]?.indexerValue,
           dado.CPF_SEGURADO=x.indexerVO.filter(f => f.indexerLabel=='CPF-CNPJ DO SEGURADO')[0]?.indexerValue ,
           dado.VALOR=       x.indexerVO.filter(f => f.indexerLabel=='VALOR')[0]?.indexerValue.replace('.','').replace(',','.') ||  x.indexerVO.filter(f => f.indexerLabel=='Valor Bônus')[0]?.indexerValue.replace('.','').replace(',','.') ||0 
        
      }
 
        
    if ( x.indexerVO.filter(f => f.indexerLabel=='DATA DA VENDA DO SEGURO')[0]?.indexerValue == undefined
     &&  x.indexerVO.filter(f => f.indexerLabel=='Ano/Mês (Ex: 2023/09)')[0]?.indexerValue == undefined
     && x.indexerVO.filter(f => f.indexerLabel=='DATA ADESÃO')[0]?.indexerValue == undefined
     && x.breadCrumbs[0]?.text != 'VOUCHER JLR'
     && x.breadCrumbs[0]?.text != 'LAND CARE JLR'
     ){
      // console.log('Processo: '+dado.PROCESSO+' - '+dado.TIPO+' nao tem Registro valido')
 
     
    } else{
      arrayIntegrados.push(dado)
      apolise.push(dado) 
        gravaSeguro(tomorrow(dado.DATA),
                  dado.PROPOSTA,
                  dado.CHASSI,
                  dado.VENDEDOR,
                  dado.CLIENTE+' - '+dado.CPF+' Processo: '+dado.PROCESSO,
                  dado.SEGURADORA,
                  dado.CILINDRADA,
                  dado.CPF,
                  dado.PROCESSO,
                  dado.TIPO,
                  dado.VALOR                  
                  )      
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

async function getListaBusca(){
  const baseQuery = 
  ` select cod_proposta from agpdev.buscaVianuvem
  `;   
  const result = await database.simpleExecute(baseQuery); 
  console.log('qtde de propostas para Busca' +result.rows?.length)
  result.rows.map(async x => {
     await  getVianuvem(x.COD_PROPOSTA,null)
  })
  
  return result.rows
}

async function getListaNPS(){
  const baseQueryCheckpoint = 
`
select 
(u.nome||'-'||u.nome_completo) usuario
  from agpdev.usuarios u
 where (u.cod_empresa, u.cod_funcao) in
       (select cod_empresa, cod_funcao
          from agpdev.comissoes_faixa
         where PREMIO = 'NPS'
         group by (cod_empresa, cod_funcao))
   and mes >= '10/2023'
   and nvl(u.diretoria,'N') <> 'S'
   and (nome, mes) not in
       (select fi.vendedor, to_char(fi.data_venda, 'mm/yyyy')
          from nbs.fi_servicos_proposta fi
         where fi.cod_servico_fi = 402)
` 
  const result = await database.simpleExecute(baseQueryCheckpoint); 
  console.log('qtde de NPS para busca' +result.rows?.length)
  result.rows.map(async x => {
     await  getVianuvem(x.USUARIO,null)
  })
  
  return result.rows
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
COD_PLANO,
COD_ORIGEM,
 
COD_TIPO,
COD_SERVICO_FI,  
cod_cliente_destino,

COD_CLIENTE,
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
:valor_servico,
:COD_PLANO,
:COD_ORIGEM,

:COD_TIPO,
:cod_servico_fi, 
:cod_cliente_destino,
17291690000188,
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
where   cod_origem=:cod_origem
`;  
 
const baseQueryEmpresa = 
`select cod_empresa from nbs.empresas_usuarios eu where eu.nome = (select                    nvl(eu.usuario_principal,eu.nome)
                                                                  from nbs.empresas_usuarios eu
                                                                         where eu.nome = (select nvl(eu.usuario_principal,eu.nome)
                                                                  from nbs.empresas_usuarios eu
                                                                         where eu.nome = :vendedor))
`; 

async function getPropostaExistente(proposta,processo) { 
  console.log('Buscando Proposta: ' + proposta +' / '+processo)
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
  return result.rows[0]?.COD_EMPRESA  
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

function getCodServicoFi (tipo){ 
  let tipoFinal = 0
  if(tipo == 'NPS VENDAS' ){ tipoFinal  = 402} 
  if(tipo == 'NPS POR VENDEDOR' ){ tipoFinal  = 308} 
  if(tipo == 'LAND CARE JLR' ){ tipoFinal  = 404} 
  if(tipo == 'VOUCHER JLR' ){ tipoFinal  = 406}
  console.log('classificacao tipo_servico_fi: '+tipoFinal)
  return tipoFinal || 405
}



async function gravaSeguro(data,proposta,chassi,vendedor,obs,seguradora,cilindrada,cpf,processo,tipo,valor,cliente) {
               console.log(data,proposta,chassi,vendedor,obs,seguradora,cilindrada,cpf,processo,tipo,valor,cliente)

               if (proposta?.length < 8){
               console.log(data,proposta,chassi,vendedor,obs,seguradora,cilindrada,cpf,processo,tipo) 
                proposta = null                
               }
  

  if (await getPropostaExistente(proposta,processo) == 0 && await getProcessoExistente(processo) == 0){ 
    
    const sqlsequencia = `SELECT nbs.seq_fi_sequencia.NEXTVAL SEQ_FI FROM DUAL`
    const resultseq   = await database.simpleExecute(sqlsequencia)  
    const sequencia = resultseq.rows[0]['SEQ_FI']

    var empresaVendedor = await getEmpresaVendedor(vendedor)
    console.log('Empresa do Vendedor é : '+empresaVendedor)
    
    console.log(sequencia)  
    console.log('Gravando Proposta/processo: ' + proposta||processo)
    const result = await database.simpleExecute(baseQuery,[data
                                                            ,proposta
                                                            ,empresaVendedor 
                                                            ,obs
                                                            ,chassi
                                                            ,vendedor
                                                            ,sequencia
                                                            ,valor
                                                            ,cilindrada                                                            
                                                            ,processo                                                            
                                                            ,getTipoSeguradora(seguradora) || getCodServicoFi(tipo)
                                                            ,getCodServicoFi(tipo)
                                                            ,cpf
                                                          ]); 
    return null
  }   
} 
 
 
  function FormataData(dataFormat){
    var data = dataFormat,
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
  }

 
 

const tomorrow = (dt) => {


  function FormataStringData(data) {

    var data1 = data.substring(0,10)
    var dia  = data1.split("/")[0];
    var mes  = data1.split("/")[1];
    var ano  = data1.split("/")[2];
   
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
