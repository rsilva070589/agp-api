const database  = require('../services/database.js');
const puppeteer = require ('puppeteer');

const listaCotas = [];

async function getListaVendas(){
    const baseQuery =   ` select * from  agpdev.consorcio_vendas
                           where cota is not null `;     
    const result = await database.simpleExecute(baseQuery); 
    console.log('qtde de Consorcio para Busca: ' +result.rows?.length)  
    result.rows.map(async x => {
      listaCotas.push(x)
       await getNewCon(x.GRUPO,x.COTA,x.RD)          
     //  console.log(x)
    })    
    return listaCotas
  }

  async function find(){
    return await getListaVendas() 
  }


async function getNewCon(){
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
  
    await page.setViewport({
      width: 1000,
      height: 768
    }); 
  
    await page.goto('https://newkey.cny.com.br/Intranet/frmCorCCCnsLogin.aspx');
  
    await page.type('#edtUsuario', 'CCY15961');
    await page.type('#edtSenha', 'Crosser150@');      
      await page.click('#btnLogin'); 
    
    //await page.waitForNavigation(); // <------------------------- Wait for Navigation
    await page.goto('https://newkey.cny.com.br/Intranet/CONAT/frmConAtSrcConsorciado.aspx');
    await page.reload()
  
    console.log('redirecionando')

    async function getDados(cliente){
        console.log(cliente)
        await page.type('#ctl00_Conteudo_edtGrupo', cliente.grupo);
        await page.type('#ctl00_Conteudo_edtCota', cliente.cota);
        await page.type('#ctl00_Conteudo_edtVersao', cliente.rd);
        
        await page.click('#ctl00_Conteudo_btnLocalizar');
      
       setTimeout(async () => {   
        const resultado = await page.evaluate(()=> {   
            return {
            cliente: document.getElementById('ctl00_Conteudo_lblCD_Cota')?.innerHTML,
            parcelas: document.getElementById('ctl00_Conteudo_lblQT_Pcls_Paga')?.innerHTML
                    }   
           })
        console.log(resultado)
        }, "8000");

       setTimeout(async () => {       
        await page.click('#ctl00_Conteudo_hpVoltar');
        await page.goto('https://newkey.cny.com.br/Intranet/CONAT/frmConAtSrcConsorciado.aspx');
        
     }, "10000");
      
    }
    
  //  getDados()

    let qtdeVezes = 0
    function ContarSegundos(){
        if(listaCotas[qtdeVezes])
            {
                console.log("Buscando a Cota: " +listaCotas[qtdeVezes].cota)
                getDados(listaCotas[qtdeVezes]) 
                qtdeVezes = qtdeVezes +1;
            }
            else{
                console.log('Fechando');
                page.close();
               
              setTimeout(async () => {       
                    process.abort()
                 }, "3000");
            }
             
    }
    setInterval(ContarSegundos, 20000);  
}

 

  module.exports.find = find;