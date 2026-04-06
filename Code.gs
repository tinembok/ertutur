// Ganti dengan Folder ID yang Anda salin tadi
const FOLDER_ID = "1gZ5GF0nOxFKX-WpiiJDLB7DVAPdwEyLT";

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Tutur Karo - Merga Silima')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function uploadFoto(base64Data, fileName) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const contentType = base64Data.substring(5, base64Data.indexOf(';'));
    const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(bytes, contentType, fileName);
    
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl(); // Mengembalikan link foto untuk disimpan di Sheet
  } catch (e) {
    return "Gagal Upload: " + e.toString();
  }
}

// Update fungsi processForm agar menerima URL foto
function processForm(formObject) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("tutur") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var waBaru = "'" + formObject.wa;
    
    // CEK APAKAH NOMOR WA SUDAH ADA (Mulai dari kolom N / index 13)
    var barisAda = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][13] == waBaru) {
        barisAda = i + 1; // Simpan nomor barisnya
        break;
      }
    }

    var rowContent = [
      new Date(),
      formObject.foto_url || "No Photo",
      formObject.nama,
      formObject.marga,
      formObject.bapa,
      formObject.nande,
      formObject.senina_turang,
      formObject.ndehara,
      formObject.bapa_ndehara,
      formObject.nande_ndehara,
      formObject.senina_turang_ndehara,
      Array.isArray(formObject.anak) ? formObject.anak.filter(String).join(", ") : formObject.anak,
      formObject.alamat,
      waBaru
    ];

    if (barisAda > -1) {
      // JIKA DATA SUDAH ADA, TIMPA BARIS TERSEBUT (Update)
      sheet.getRange(barisAda, 1, 1, rowContent.length).setValues([rowContent]);
      return "Mejuah-juah! Data lama Anda telah diperbarui.";
    } else {
      // JIKA BELUM ADA, TAMBAH BARIS BARU
      sheet.appendRow(rowContent);
      return "Mejuah-juah! Data berhasil disimpan.";
    }
    
  } catch (f) {
    return "Terjadi kesalahan: " + f.toString();
  }
}

/**
 * Fungsi untuk mencari data tutur berdasarkan Nama atau Marga
 * Dipanggil dari Index.html via google.script.run
 */
function cariTutur(keyword) {
  try {
    // Tambahkan pengecekan ini agar tidak error jika keyword kosong
    if (!keyword) {
      console.log("Pencarian dibatalkan: Keyword tidak dikirim.");
      return []; 
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("tutur") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    console.log("Jumlah baris ditemukan: " + data.length);
    console.log("Keyword pencarian: " + keyword);

    var hasil = [];
    var kunci = keyword.toLowerCase();
    
    for (var i = 1; i < data.length; i++) {
      // Pastikan data kolom Nama (index 2) dan Marga (index 3) ada
      var nama = (data[i][2] || "").toString().toLowerCase(); 
      var marga = (data[i][3] || "").toString().toLowerCase(); 
      
      if (nama.includes(kunci) || marga.includes(kunci)) {
        hasil.push({
          foto: data[i][1],
          nama: data[i][2],
          marga: data[i][3],
          bapa: data[i][4],
          nande: data[i][5],
          anak: data[i][11],
          wa: (data[i][13] || "").toString()
        });
      }
    }
    return hasil;
  } catch (e) {
    console.error("Error: " + e.toString());
    return [];
  }
}
