function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Tutur Karo - Merga Silima')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function processForm(formObject) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  
  // Mengolah data anak (array ke string)
  var anakList = formObject.anak.filter(n => n).join(", ");
  
  sheet.appendRow([
    new Date(),
    formObject.foto_url, // Simplifikasi: simpan URL foto
    formObject.nama,
    formObject.marga,
    formObject.bapa,
    formObject.nande,
    formObject.senina_turang,
    formObject.ndehara,
    formObject.bapa_ndehara,
    formObject.nande_ndehara,
    formObject.senina_turang_ndehara,
    anakList,
    formObject.alamat,
    formObject.wa
  ]);
  return "Data Berhasil Disimpan!";
}
