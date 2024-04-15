const express = require('express')
const app = express()
const pdf =require('html-pdf-node')
const path =require('path')
const fs=require('fs')
const ejs = require('ejs')

app.use("/output", express.static(path.join(__dirname, "output")));


app.post("/generatepdf",async (req,res)=>{

    let reqData =  req.body

    let data = {
        userId:reqData.userId?reqData.userId:"",
        email:reqData.email?reqData.email:"" ,
        mobile:reqData.mobile?reqData.mobile:"",
        address:reqData.address?reqData.address:"",
        name:reqData.name?reqData.name:"",
        dob:reqData.dob?reqData.dob:"",
        blood:reqData.blood?reqData.blood:"",
        gender:reqData.gender?reqData.gender:""
    }

                       
    
    const options = {
        format: 'A4',
        printBackground: true,
        // headerTemplate: headerHtml,
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
