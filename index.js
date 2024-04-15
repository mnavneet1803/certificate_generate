const express = require('express')
const app = express()
const pdf =require('html-pdf-node')
const path =require('path')
const fs=require('fs')
const ejs = require('ejs')

app.use("/output", express.static(path.join(__dirname, "output")));


app.get("/generatepdf",async (req,res)=>{


    let data = {
        userId:"12297",
        email:"temp@gmail.com" ,
        mobile:"99999999999",
        address:"14 temp near example",
        name:"Navneet Malhotra",
        dob:"30-08-1998",
        blood:"B+",
        gender:"male"
    }

                       
    
    const options = {
        format: 'A4',
        displayHeaderFooter: true,
        printBackground: true,
        // headerTemplate: headerHtml,
        footerTemplate: '<hr/><style>span{width:100% !important;font-size:12px !important;font-family: "roboto", sans-serif !important; text-align: right; margin-right:10px}</style><hr/><span> Page <label class="pageNumber"></label> of <label class="totalPages"> </label> </span>',
        margin: {
            top: "0px",
            bottom: "180",
            right: "10px",
            left: "10px",
        }
    };
    
     const templatePath = path.join(__dirname, '../generate_pdf/certificate_html.ejs'); 
     const outputFolder = path.resolve(__dirname, '../generate_pdf/output'); 
     const pdfFileName = `${Math.floor(Math.random() * 10000000000)}.pdf`;
      const pdfFilePath = `${outputFolder}/${pdfFileName}`; 
      let htmlData
       await ejs.renderFile(templatePath, data, async (err, html) => {
          if (err) { console.error('Error rendering EJS template:', err); return;
          } // HTML rendering is successful, proceed to PDF generation
           htmlData = await html })
           await pdf.generatePdf({ content: htmlData }, options) .then(async pdfBuffer => {
              // Write the PDF buffer to a file 
              fs.writeFileSync(pdfFilePath, pdfBuffer);
               console.log(`PDF generated: ${pdfFilePath}`); 
             }) .catch(error => { console.error('Error generating PDF:', error); });
                
             
             
             res.send({ status: true, url: `output/${pdfFileName}` }) 



})















    app.listen(3000, () => console.log("Listening at localhost:3000"))
