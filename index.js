const express = require("express");
const pdf = require("html-pdf-node");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/output", express.static(path.join(__dirname, "output")));

app.post("/generatepdf", async (req, res) => {
  //   let reqData = req.body;

  let data = {
    userId: req.body.userId ? req.body.userId : "",
    email: req.body.email ? req.body.email : "",
    mobile: req.body.mobile ? req.body.mobile : "",
    address: req.body.address ? req.body.address : "",
    name: req.body.name ? req.body.name : "",
    dob: req.body.dob ? req.body.dob : "",
    blood: req.body.blood ? req.body.blood : "",
    gender: req.body.gender ? req.body.gender : "",
  };

  const options = {
    format: "A4",
    printBackground: true,
    // headerTemplate: headerHtml,
    margin: {
      top: "0px",
      bottom: "180",
      right: "10px",
      left: "10px",
    },
  };

  //   const templatePath = path.join(
  //     __dirname,
  //     "../certificate_generate-main/certificate_html.ejs"
  //   );
  const templatePath = path.join("certificate_html.ejs");
  const outputFolder = path.resolve("output");
  const pdfFileName = `${Math.floor(Math.random() * 10000000000)}.pdf`;
  const pdfFilePath = `${outputFolder}/${pdfFileName}`;
  let htmlData;
  await ejs.renderFile(templatePath, data, async (err, html) => {
    if (err) {
      console.error("Error rendering EJS template:", err);
      return;
    } // HTML rendering is successful, proceed to PDF generation
    htmlData = await html;
  });
  await pdf
    .generatePdf({ content: htmlData }, options)
    .then(async (pdfBuffer) => {
      // Write the PDF buffer to a file
      fs.writeFileSync(pdfFilePath, pdfBuffer);
      console.log(`PDF generated: ${pdfFilePath}`);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });

  res.send({ status: true, url: `output/${pdfFileName}` });
});

app.listen(3000, () => console.log("Listening at localhost:3000"));
