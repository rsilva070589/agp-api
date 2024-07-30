const { autoCommit } = require('oracledb');
const database  = require('../services/database.js');
const puppeteer = require ('puppeteer');
 

async function getListaVendas(){
    const baseQuery =   ` select * from  agpdev.consorcio_vendas
                           where cota is not null`;     
    const result = await database.simpleExecute(baseQuery);     
    return result.rows  
  }

  async function find(){
    return await getListaVendas() 
  }
 
  module.exports.find = find;


  async function updateCota(context){
    console.log(context)
    const baseQuery =   ` update  agpdev.consorcio_vendas set valor_cota =:valor_cota,
                                                              parcela_paga =:parcela_paga,
                                                              data_vencimento =:data_vencimento,
                                                              valor_parcela =: valor_parcela,
                                                              contrato =: contrato
                           where  grupo=:grupo
                           and    cota=:cota
                           and    rd=:rd
                           `;     
    const result = await database.simpleExecute(baseQuery,[
      context.VALOR_COTA,
      context.PARCELA_PAGA,
      tomorrow(context.DATA_VENCIMENTO),
      context.VALOR_PARCELA,
      context.CONTRATO,
      context.GRUPO,
      context.COTA,
      context.RD
                                      ]);     
    return result.rows  
  }

  async function find(){
    return await getListaVendas() 
  }
 
  const tomorrow = (dt) => {


    function FormataStringData(data ) {
      console.log('Data: '+data)
       if (data != undefined) { 
        var data1 = data 
        var dia  = data1.split("/")[0];
        var mes  = data1.split("/")[1];
        var ano  = data1.split("/")[2];
       
        return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
       } else{
        return '2001-01-01'
       }
    
   
   
  
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

  module.exports.updateCota = updateCota;
