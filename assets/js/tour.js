// Tambahkan event listener untuk tombol batal
document.getElementById('btnCancel').addEventListener('click', function() {
    closeModal();
});

// Fungsi untuk menutup modal
function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
