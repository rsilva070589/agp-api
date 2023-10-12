//const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
`SELECT
        COD_EMPRESA,
        COD_OS_AGENDA,
        STATUS_AGENDA,
        QUEM_ABRIU,
        DATA_ABRIDA,
        DATA_AGENDADA,
        DATA_PREVISAO_FIM,
        PRISMA,
        COD_CLIENTE,
        CLIENTE_NOME,
        CLIENTE_DDD_CEL,
        CLIENTE_FONE_CEL,
        CLIENTE_DDD_RES,
        CLIENTE_FONE_RES,
        EMAIL,
        COD_PRODUTO,
        COD_MODELO,
        CHASSI,
        PLACA,
        COR_EXTERNA,
        ANO,
        TIPO_TOYOTA,
        CLIENTE_AGUARDA,
        TIPO_ATENDIMENTO, 
        OBSERVACOES
FROM  OS_AGENDA OG 
where 1=1
and og.data_abrida > sysdate - 365
`;

const sortableColumns = ['id'];

 async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id;
 
    query += '\and COD_OS_AGENDA= :employee_id';
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;


const createSqlOSAgenda =
`INSERT INTO OS_AGENDA (
  COD_EMPRESA,
  COD_OS_AGENDA,
  STATUS_AGENDA,
  QUEM_ABRIU,
  CONSULTOR,
  PRISMA, 
  TIPO_ATENDIMENTO,
  COD_CLIENTE,  
  COD_PRODUTO,
  COD_MODELO,
  ANO_MODELO,
  ANO,
  PLACA,
  CHASSI,
  COR_EXTERNA,
  KM,  
  DATA_ULTIMA_ATUALIZACAO,
  DATA_ABRIDA, 
  DATA_AGENDADA,
  DATA_PREVISAO_FIM,
  DATA_PROMETIDA,
  TIPO_TOYOTA,
  CLIENTE_AGUARDA,
  EH_RETORNO,
  LAVAR_VEICULO,
  VEICULO_PLATAFORMA,
  TAXI,
  BLINDADO,
  TESTE_RODAGEM,
  LEVAR_PECAS_SUBSTITUIDAS,
  VEICULO_MODIFICADO,
  MOBILIDADE,
  MOBILE_OK,
  MOBILE_STATUS,
  REC_INTERATIVA,
  ORCAMENTO,
  CRM_EMAIL,
  CRM_SMS,
  CRM_MALA,
  CARTAO_DOTZ,
  TELE_CONTATO,
  TELE_HORARIO_CONTATO,
  QUICK_STOP,
  EH_FIAT_PROFISSIONAL,
  EH_PASSANTE,
  CLIENTE_DT,
  COLLABORATION,
  SERVICO_EXPRESSO,
  RECEBIDO,
  ATEND_INICIADO,
  CLIENTE_NOME,
  EMAIL,
  OBSERVACOES,
  CLIENTE_DDD_CEL,
  CLIENTE_FONE_CEL

  )
   VALUES
  (
  :COD_EMPRESA,
  :COD_OS_AGENDA,
  'A',
  'MAPSIS',
  :CONSULTOR,
  :PRISMA,   
  'R',
  :COD_CLIENTE,
  :COD_PRODUTO,
  :COD_MODELO,
  :ANO_MODELO,
  :ANO,
  :PLACA,
  :CHASSI,
  :COR_EXTERNA,
  :KM,  
  sysdate,sysdate, 
  to_date(:DATA_AGENDADA,'DD/MM/YYYY HH24:MI:SS'),
  to_date(:DATA_PREVISAO_FIM,'DD/MM/YYYY HH24:MI:SS'),
  to_date(:DATA_PROMETIDA,'DD/MM/YYYY HH24:MI:SS'), 
  'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',
  :CLIENTE_NOME,
  :EMAIL,
  :OBSERVACOES,
  :DDD_CEL,
  :TELEFONE_CEL
  )    
 `

 const createSqlOsAgendaReclamacao =
 `INSERT INTO OS_AGENDA_RECLAMACAO (  
  DESCRICAO,
  COD_EMPRESA,
  COD_OS_AGENDA,
  ITEM  
  )
 values ( :DESCRICAO,
          :COD_EMPRESA,
          :COD_OS_AGENDA,          
          1)
  `

  const createSqlOsAgendaServico =
  `INSERT INTO OS_AGENDA_SERVICOS ( 
   COD_EMPRESA,
   COD_OS_AGENDA,
   COD_SERVICO,
   PRISMA,
   DATA_COMECA,
   DATA_FIM,
   TEMPO_PADRAO,
   TEMPO_PADRAO_SERVICO,
    STATUS,
    PRECO_VENDA,
    ITEM
   )
  values ( :COD_EMPRESA,
           :COD_OS_AGENDA,  
           :COD_SERVICO,
           :PRISMA, 
           to_date(:DATA_COMECA,'DD/MM/YYYY HH24:MI:SS'),
           to_date(:DATA_FIM,'DD/MM/YYYY HH24:MI:SS'), 
           :TEMPO_PADRAO,
           :TEMPO_PADRAO_SERVICO,
           'C',0,1)
   `
 
   
  
 async function create(emp) {
 const NEWOSAGENDA = Object.assign({}, emp); 

 let CheckPLACA = null
 let ValidaUsuario = false
 let ValidaBox = false
 let NumeroAgenda = null
 let COD_CLIENTE = null
 
async function gravarAgenda () {
   
async function getSequenciaAgenda() {
  const SqlNumeracaoOSAgenda = `SELECT SEQ_COD_OS_AGENDA.NEXTVAL COD_OS_AGENDA FROM DUAL`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)  
  const NumeroAgenda = result.rows[0]['COD_OS_AGENDA']
  console.log(NumeroAgenda)
  return NumeroAgenda
 }

 NumeroAgenda = await getSequenciaAgenda()
 
async function  getCliente() { 
  const sqlDadosCliente = `select email_nfe,nome,cod_cliente from clientes cli where cli.cod_cliente=:COD_CLIENTE`
  
  const dadosCliente = await database.simpleExecute(sqlDadosCliente, [NEWOSAGENDA.COD_CLIENTE])
   
  if (dadosCliente.rows[0] != undefined) {  
    COD_CLIENTE = NEWOSAGENDA.COD_CLIENTE
  }else{
    COD_CLIENTE = 1
  }
  return COD_CLIENTE
}

COD_CLIENTE= await getCliente()

console.log(COD_CLIENTE)

const TabelaOSAgenda = await database.simpleExecute(createSqlOSAgenda, 
                                                      [ 
                                                        NEWOSAGENDA.COD_EMPRESA,
                                                        NumeroAgenda,
                                                        NEWOSAGENDA.CONSULTOR,
                                                        NEWOSAGENDA.PRISMA,            
                                                        COD_CLIENTE,
                                                        NEWOSAGENDA.COD_PRODUTO,
                                                        NEWOSAGENDA.COD_MODELO,
                                                        NEWOSAGENDA.ANO_MODELO,
                                                        NEWOSAGENDA.ANO,
                                                        CheckPLACA,
                                                        NEWOSAGENDA.CHASSI,
                                                        NEWOSAGENDA.COR_EXTERNA,
                                                        NEWOSAGENDA.KM,
                                                        NEWOSAGENDA.DATA_AGENDADA,
                                                        NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                        NEWOSAGENDA.DATA_PROMETIDA,
                                                        NEWOSAGENDA.CLIENTE_NOME,
                                                        NEWOSAGENDA.EMAIL,
                                                        NEWOSAGENDA.OBSERVACAO,
                                                        NEWOSAGENDA.DDD_CEL,
                                                        NEWOSAGENDA.TELEFONE_CEL
                                                      ]
                                                      , { autoCommit: true });
   
  const TabelaOSAgendaReclamacao = await database.simpleExecute
                                            (createSqlOsAgendaReclamacao, 
                                              [ 
                                                NEWOSAGENDA.RECLAMACAO,
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda                                                
                                              ]
                                              , { autoCommit: true });  
                                              
  const TabelaOSAgendaServico = await database.simpleExecute
                                            (createSqlOsAgendaServico, 
                                              [  
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda,     
                                                NEWOSAGENDA.COD_SERVICO, 
                                                NEWOSAGENDA.PRISMA,
                                                NEWOSAGENDA.DATA_AGENDADA,
                                                NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                NEWOSAGENDA.TEMPO_PADRAO,
                                                NEWOSAGENDA.TEMPO_PADRAO
                                              ]
                                              , { autoCommit: true }); 
                                               

}

async function getBox() {
  const SqlNumeracaoOSAgenda = `select count(*) qtde  from prisma_box eu where eu.prisma=:PRISMA`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda, [NEWOSAGENDA.PRISMA])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Box: '+valor)
  if (valor == 0) {
    
   return false
   
  } else {    
   return 'OK'
  }   
 }
 
async function getUsuario() {
  const SqlNumeracaoOSAgenda = `select count(*) qtde  from empresas_usuarios eu where eu.nome=:NOME`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda, [NEWOSAGENDA.CONSULTOR])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Usuario: '+valor)
  if (valor == 0) {    
   return false   
  } else {    
   return 'OK'
  }   
 }
 
 async function getPlaca() {
	 
  const SqlPlaca = `select odv.placa from os_dados_veiculos odv,os
					where odv.cod_empresa=os.cod_empresa
					and   odv.numero_os=os.numero_os
					and  chassi=:CHASSI
					order by data_emissao desc` 
					
  const result   = await database.simpleExecute(SqlPlaca, [NEWOSAGENDA.CHASSI])   

  if (result.rows[0] && NEWOSAGENDA.PLACA == 'NAO0000'){
   
      var placaAtual = result.rows[0]['PLACA']
         console.log(placaAtual)
        return placaAtual
     
    }else{
      console.log('nao achou placa')  
      if (NEWOSAGENDA.PLACA == 'NAO0000'){
        return ''
      }else{
        return NEWOSAGENDA.PLACA 
      }
      
    }
    
       
 }

 ValidaUsuario = await getUsuario()
 ValidaBox     = await getBox()
 CheckPLACA    = await getPlaca()

 console.log(CheckPLACA)
   

  if (ValidaUsuario  && ValidaBox  ){
    await gravarAgenda()
    return (''+NumeroAgenda);
  }else{
    return ('Erro de validação: ' + '  BOX: '+ValidaBox + '  / CONSULTOR: '+ValidaUsuario)
  }   
  }

module.exports.create = create;


const deleteSql =
   `delete from os_agenda og
    where og.cod_os_agenda = :ID
    and	  (og.cod_empresa, og.cod_os_agenda) in
        (select cod_empresa,cod_os_agenda from os_agenda
         where quem_abriu='MAPSIS'
         and data_abrida > sysdate -30
         and cod_os_agenda = :ID)
    `;

 const deleteAgendaReclamacaopSql =
  `delete from OS_AGENDA_RECLAMACAO ogr
  where ogr.cod_os_agenda = :ID
  AND	(ogr.cod_empresa,ogr.cod_os_agenda) in
  (select COD_EMPRESA,COD_OS_AGENDA from os_agenda 
  where quem_abriu='MAPSIS'
  AND   DATA_ABRIDA > SYSDATE -30
  AND   COD_OS_AGENDA= :ID)  `;

  const deleteChipSql =
  `delete from OS_AGENDA_SERVICOS ogs
  where ogs.cod_os_agenda = :ID
  and (ogs.cod_empresa,ogs.cod_os_agenda) in
   (select COD_EMPRESA,COD_OS_AGENDA from os_agenda
  where quem_abriu='MAPSIS'
  AND   DATA_ABRIDA > SYSDATE -30
  AND   COD_OS_AGENDA= :ID) 	
  `;

  async function del(ID) {
 
    
    const chip    = await database.simpleExecute(deleteChipSql, [ID], { autoCommit: true });    
    const Ogr     = await database.simpleExecute(deleteAgendaReclamacaopSql, [ID], { autoCommit: true });
    const result  = await database.simpleExecute(deleteSql, [ID], { autoCommit: true });
    

    console.log(ID) 
    return ID ;
  }
   

module.exports.delete = del;
