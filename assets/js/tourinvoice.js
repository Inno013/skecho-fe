function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US');
    const timeString = now.toLocaleTimeString('en-US');
    document.getElementById('inputTanggal').value = `${dateString} ${timeString}`;
}

// Panggil fungsi updateDateTime setiap detik
setInterval(updateDateTime, 1000);

// Panggil updateDateTime saat halaman dimuat untuk menampilkan waktu saat ini
updateDateTime();