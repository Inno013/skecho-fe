// Ambil elemen pop-out Add Tour
var addTourModal = document.getElementById("addTourModal");
var btnAddTour = document.querySelector(".btn-add");

// Ambil elemen pop-out Invoice Tour
var invoiceTourModal = document.getElementById("invoiceTourModal");
var btnInvoiceTour = document.querySelectorAll(".btn-invoice");

// Ambil elemen tombol untuk menutup pop-out
var closeButtons = document.querySelectorAll(".close");
var btnCancelAddTour = document.getElementById("btnCancelAddTour");
var btnCancelInvoice = document.getElementById("btnCancelInvoice");

// Fungsi untuk menampilkan pop-out Add Tour
function openAddTourModal() {
    addTourModal.style.display = "block";
}

// Fungsi untuk menampilkan pop-out Invoice Tour
function openInvoiceTourModal() {
    invoiceTourModal.style.display = "block";
}

// Fungsi untuk menyembunyikan pop-out
function closeModal() {
    addTourModal.style.display = "none";
    invoiceTourModal.style.display = "none";
}

// Event listener untuk tombol "Add Tour"
btnAddTour.addEventListener("click", openAddTourModal);

// Event listener untuk tombol "Invoice Tour"
btnInvoiceTour.forEach(function(btn) {
    btn.addEventListener("click", openInvoiceTourModal);
});

// Event listener untuk tombol close
closeButtons.forEach(function(btn) {
    btn.addEventListener("click", closeModal);
});

// Event listener untuk tombol "Cancel" pada pop-out Add Tour
btnCancelAddTour.addEventListener("click", closeModal);

// Event listener untuk tombol "Cancel" pada pop-out Invoice Tour
btnCancelInvoice.addEventListener("click", closeModal);

// Event listener untuk menutup pop-out saat klik di luar area pop-out
window.addEventListener("click", function(event) {
    if (event.target == addTourModal || event.target == invoiceTourModal) {
        closeModal();
    }
    
});
