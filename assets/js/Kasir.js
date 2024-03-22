// Fungsi untuk memperbarui tanggal dan waktu setiap detik
function updateDateTime() {
    var dt = new Date(); // Dapatkan objek Date saat ini
    var datetimeSpan = document.getElementById("datetime"); // Dapatkan elemen span dengan ID "datetime"

    // Format tanggal dan waktu menjadi string yang sesuai
    var datetimeString = dt.toLocaleString(); // Gunakan metode toLocaleString() untuk mendapatkan tanggal dan waktu dalam format lokal

    // Perbarui teks di dalam elemen span dengan nilai tanggal dan waktu yang baru
    datetimeSpan.textContent = datetimeString;
}

// Panggil fungsi updateDateTime() untuk pertama kali agar nilai tanggal dan waktu langsung ditampilkan saat halaman dimuat
updateDateTime();

// Panggil fungsi updateDateTime() setiap detik menggunakan setInterval()
setInterval(updateDateTime, 1000); // Fungsi akan dipanggil setiap 1000 milidetik (1 detik)

document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.querySelector('.pay-btn');
    const paymentContainer = document.querySelector('.payment-container');
    const closeBtn = document.querySelector('.close-btn');

    payBtn.addEventListener('click', function() {
        paymentContainer.style.display = 'block'; // Tampilkan formulir pembayaran
    });

    closeBtn.addEventListener('click', function() {
        paymentContainer.style.display = 'none'; // Sembunyikan formulir pembayaran
    });
       // Mengambil tombol batal
       var cancelButton = document.querySelector('.cancel-btn');

       // Menambahkan event listener untuk menghandle klik tombol batal
       cancelButton.addEventListener('click', function() {
           // Mengambil elemen pop out
           var paymentContainer = document.querySelector('.payment-container');
           // Menghilangkan elemen pop out dari tampilan
           paymentContainer.style.display = 'none';
       });
});
