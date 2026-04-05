function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Tutur Karo - Merga Silima')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processForm(formObject) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    
    // Logika sederhana untuk menggabung data anak
    var daftarAnak = "";
    if (formObject.anak) {
      daftarAnak = Array.isArray(formObject.anak) ? formObject.anak.filter(String).join(", ") : formObject.anak;
    }

    sheet.appendRow([
      new Date(),
      "No Photo", // Untuk versi awal foto dinonaktifkan agar ringan, cukup link jika perlu
      formObject.nama,
      formObject.marga,
      formObject.bapa,
      formObject.nande,
      formObject.senina_turang,
      formObject.ndehara,
      formObject.bapa_ndehara,
      formObject.nande_ndehara,
      formObject.senina_turang_ndehara,
      daftarAnak,
      formObject.alamat,
      "'" + formObject.wa // Tanda petik agar nomor HP tidak berubah jadi format saintifik
    ]);
    
    return "Mejuah-juah! Data Berhasil Disimpan.";
  } catch (f) {
    return "Terjadi kesalahan: " + f.toString();
  }
}
