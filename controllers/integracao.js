
const modelIntegracao = require('../model/integracao');

const formataData = (dt) => {
  
  // Creating the date instance
  let d = new Date(dt);

  // Adding one date to the present date
  d.setDate(d.getDate());

  let year = d.getFullYear()
  let month = String(d.getDate())
  let day =  String(d.getMonth()+1)
  let mes = null
 
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

 
  console.log(`${day}-${mes}-${year}`)
  if (year > '1970'){
    return(`${day}-${mes}-${year}`);
  }else{
    return null
  }
  
  }


async function get(req, res, next) {
  try {
    const context = {};
 
    context.CPF = req.body.CPF
    context.MES = req.body.MES
    context.NOME = req.body.NOME
    context.PERIODO_INI = formataData(req.body.PERIODO_INI)
    context.PERIODO_FIM = formataData(req.body.PERIODO_FIM)
    console.log(req.body)

    const rows = await modelIntegracao.find(context);

    if (req.params.CPF) {
      if (!rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;