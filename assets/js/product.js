let page = 0;
let totalPages = 1;

function setTable() {
    // Fetch data from backend API and populate the table dynamically
    // You need to implement this part using AJAX/fetch API
}

function search() {
    // Implement search functionality
    setTable();
}

function previousPage() {
    if (page > 0) {
        page--;
        setTable();
    }
}

function nextPage() {
    if (page < totalPages - 1) {
        page++;
        setTable();
    }
}

function addProduct() {
    // Implementasi logika untuk menambahkan produk
}

function editProduct(productId) {
    // Implementasi logika untuk mengedit produk dengan ID tertentu
}

function deleteProduct(productId) {
    // Implementasi logika untuk menghapus produk dengan ID tertentu
}


// Event delegation to handle edit and delete buttons click
document.getElementById('productTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
        const productId = event.target.dataset.productId;
        editProduct(productId);
    } else if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.dataset.productId;
        deleteProduct(productId);
    }
});

// Initial setup when the page loads
setTable();


// PopUp Edit 

document.addEventListener('DOMContentLoaded', function () {
    // Ambil semua tombol edit
    const editButtons = document.querySelectorAll('.edit-btn');

    // Tambahkan event listener untuk setiap tombol edit
    editButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            // Ambil ID produk dari atribut data
            const productId = button.getAttribute('data-product-id');
            // Ambil nilai-nilai dari baris tabel terkait
            const row = document.getElementById('productRow' + productId);
            const barcode = row.cells[1].textContent;
            const productName = row.cells[2].textContent;
            const priceBuy = row.cells[3].textContent;
            const priceSell = row.cells[4].textContent;
            const profitSharing = row.cells[5].textContent;
            const stock = row.cells[6].textContent;

            // Isi nilai-nilai formulir edit di modal
            document.getElementById('editBarcode').value = barcode;
            document.getElementById('editProductName').value = productName;
            document.getElementById('editPriceBuy').value = priceBuy;
            document.getElementById('editPriceSell').value = priceSell;
            document.getElementById('editProfitSharing').value = profitSharing;
            document.getElementById('editStock').value = stock;

            // Tampilkan modal edit
            $('#editModal').modal('show');
        });
    });
});
