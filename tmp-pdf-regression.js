const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

(async () => {
  const dir = path.join(process.cwd(), '.tmp-pdf-test');
  fs.mkdirSync(dir, { recursive: true });
  const files = [
    path.join(dir, 'a.pdf'),
    path.join(dir, 'b.pdf'),
    path.join(dir, 'c.pdf'),
    path.join(dir, 'd.pdf'),
    path.join(dir, 'protected.pdf'),
  ];

  async function createPdf(filePath) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([300, 200]).drawText('ok');
    const bytes = await pdfDoc.save();
    fs.writeFileSync(filePath, Buffer.from(bytes));
  }

  async function validatePdfFile(filePath) {
    const bytes = fs.readFileSync(filePath);
    const pdfText = Buffer.from(bytes).toString('latin1');
    if (/\/encrypt|password/i.test(pdfText)) {
      throw new Error('encrypted');
    }
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  }

  for (const file of files.slice(0, 4)) {
    await createPdf(file);
  }

  fs.writeFileSync(files[4], Buffer.from('This PDF is password protected'));

  const results = [];
  for (const file of files) {
    try {
      results.push({ file: path.basename(file), pageCount: await validatePdfFile(file) });
    } catch (error) {
      results.push({ file: path.basename(file), error: error.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));
})();
