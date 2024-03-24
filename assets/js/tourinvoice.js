function updateDateTime() {
    // Buat objek tanggal dan waktu saat ini
    var now = new Date();

    // Format tanggal dan waktu menjadi string yang sesuai
    var dateTimeString = now.toLocaleString();

    // Perbarui nilai input tanggal dengan tanggal dan waktu saat ini
    document.getElementById('inputTanggal').value = dateTimeString;
}

// Panggil fungsi updateDateTime setiap detik
setInterval(updateDateTime, 1000);

// Panggil fungsi untuk menginisialisasi nilai tanggal saat pertama kali halaman dimuat
updateDateTime();