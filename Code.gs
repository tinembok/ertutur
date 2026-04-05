function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Tutur Karo - Merga Silima')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function processForm(formObject) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Mencari sheet bernama "Sheet1", jika tidak ada gunakan sheet pertama (indeks 0)
    var sheet = ss.getSheetByName("tutur") || ss.getSheets()[0]; 
    
    if (!sheet) {
      throw new Error("Sheet tidak ditemukan. Pastikan Google Sheet Anda tidak kosong.");
    }

    // Mengolah data anak
    var daftarAnak = "";
    if (formObject.anak) {
      if (Array.isArray(formObject.anak)) {
        daftarAnak = formObject.anak.filter(function(el) { return el.trim() !== ""; }).join(", ");
      } else {
        daftarAnak = formObject.anak;
      }
    }

    // Eksekusi Simpan Data
    sheet.appendRow([
      new Date(),              // A: Timestamp
      "No Photo",              // B: Foto
      formObject.nama,         // C: Nama
      formObject.marga,        // D: Marga
      formObject.bapa,         // E: Bapa
      formObject.nande,        // F: Nande
      formObject.senina_turang, // G: Senina_Turang
      formObject.ndehara,      // H: Ndehara
      formObject.bapa_ndehara, // I: Bapa_Ndehara
      formObject.nande_ndehara, // J: Nande_Ndehara
      formObject.senina_turang_ndehara, // K: Senina_Turang_Ndehara
      daftarAnak,              // L: Anak
      formObject.alamat,       // M: Alamat
      "'" + formObject.wa      // N: No_WA
    ]);
    
    return "Mejuah-juah! Data enggo tersimpan.";
  } catch (f) {
    return "Terjadi kesalahan: " + f.toString();
  }
}
