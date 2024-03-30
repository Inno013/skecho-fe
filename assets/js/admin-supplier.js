const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

// Begin Logic to populate the data
const sampleRow = document.getElementById("sample-row");
const tableBody = document.querySelector("#data-table tbody");
const filterData = new helpers.FilterData();

function setTable() {
  // Clear existing table rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  http.client
    .get(filterData.toQueryParams("/suppliers"))
    .then((response) => {
      filterData.setTotalPage(response.data.totalPages);
      response.data.content.forEach((row) => {
        const newRow = createNewRow(row);
        tableBody.appendChild(newRow);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// Panggil setTable untuk mengisi data dan menampilkannya di tabel
setTable();

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector(".name").innerHTML = row.name;
  newRow.querySelector(".address").innerHTML = row.address;
  newRow.querySelector(".phone").innerHTML = row.phone;
  newRow.querySelector(".createdAt").innerHTML = row.createdAt;
  newRow
    .querySelector(".action button[data-edit-id]")
    .setAttribute("data-edit-id", row.supplierId); // Ubah menjadi 'supplierId'
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.supplierId); // Ubah menjadi 'supplierId'

  return newRow;
}

// End Logic to populate the data

// Create Supplier
const formCreate = document.getElementById("formCreateSupplier");
const placeModalCreateMessage = document.getElementById("modal-create-message");

formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = formCreate.querySelector('input[name="name"]');
  const phoneInput = formCreate.querySelector('input[name="phone"]');
  const addressInput = formCreate.querySelector('textarea[name="address"]');

  const name = nameInput.value;
  const phone = phoneInput.value;
  const address = addressInput.value;

  if (!name || !phone || !address) {
    const alertWarning = createAlert("warning", "Isi Kolom Kosong / No Tlp harus 10-13 Karakter");
    placeModalCreateMessage.appendChild(alertWarning);

    // Hilangkan pesan peringatan setelah 1 detik
    setTimeout(() => {
      placeModalCreateMessage.innerHTML = "";
    }, 1000);

    return; // Stop further execution
  }

  http.client
    .post("suppliers", { name, phone, address })
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      placeModalCreateMessage.appendChild(alertSuccess);
      setTable();

      // Setelah sukses menambahkan tur, kosongkan input
      nameInput.value = "";
      phoneInput.value = "";
      addressInput.value = "";

      // Hilangkan pesan setelah 1 detik
      setTimeout(() => {
        placeModalCreateMessage.innerHTML = "";
      }, 1000);
    })
    .catch((err) => {
      const alertWarning = createAlert("warning", err.response.data.message);
      placeModalCreateMessage.appendChild(alertWarning);

      // Hilangkan pesan peringatan setelah 1 detik
      setTimeout(() => {
        placeModalCreateMessage.innerHTML = "";
      }, 1000);
    });
});
// End Create Supplier

const generalListMessages = document.getElementById("general-list-messages");

const formEdit = document.getElementById("formEditSupplier");

// handle edit button to change value form
function handleEditView(e) {
  const supplierId = e.getAttribute("data-edit-id");
  http.client
    .get(`suppliers/${supplierId}`)
    .then((response) => {
      const supplier = response.data.data;

      formEdit.querySelector('input[name="name"]').value = supplier.name;
      formEdit.querySelector('input[name="id"]').value = supplier.supplierId;
      formEdit.querySelector('input[name="phone"]').value = supplier.phone;
      formEdit.querySelector('textarea[name="address"]').value = supplier.address; // Ubah menjadi 'value'
    })
    .catch((err) => {
      helpers.showErrorMessages(err, generalListMessages);
    });
}

const placeModalEditMessage = document.getElementById("modal-edit-message");

//handle submit update
formEdit.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = formEdit.querySelector('input[name="id"]').value;
  const name = formEdit.querySelector('input[name="name"]').value;
  const phone = formEdit.querySelector('input[name="phone"]').value;
  const address = formEdit.querySelector('textarea[name="address"]').value;

  http.client
    .put(`suppliers/${id}`, { name, phone, address })
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      placeModalEditMessage.appendChild(alertSuccess);
      setTable();

      // Hilangkan pesan setelah 1 detik
      setTimeout(() => {
        placeModalEditMessage.innerHTML = "";
      }, 1000);
    })
    .catch((err) => {
      const alertWarning = createAlert("warning", err.response.data.message);
      placeModalEditMessage.appendChild(alertWarning);

      // Hilangkan pesan peringatan setelah 1 detik
      setTimeout(() => {
        placeModalEditMessage.innerHTML = "";
      }, 1000);
    });
});


// Handle confirmed delete
document.getElementById('data-table').addEventListener('click', function (event) {
  if (event.target.matches('.btn-danger')) {
    const supplierId = event.target.getAttribute('data-delete-id'); // Mengambil supplierId dari tombol delete yang ditekan

    // Menampilkan modal konfirmasi penghapusan
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();

    // Set data-delete-id pada tombol Delete di modal konfirmasi
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    confirmDeleteBtn.setAttribute('data-delete-id', supplierId);
  }
});

// Handle confirmed delete
document.getElementById('confirmDelete').addEventListener('click', function () {
  const supplierId = this.getAttribute('data-delete-id');

  http.client
    .delete(`suppliers/${supplierId}`)
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);
      setTable();

      // Hilangkan pesan setelah 1 detik
      setTimeout(() => {
        generalListMessages.innerHTML = "";
      }, 1000);
    })
    .catch((err) => {
      const alertWarning = createAlert("warning", err.response.data.message);
      generalListMessages.appendChild(alertWarning);

      // Hilangkan pesan peringatan setelah 1 detik
      setTimeout(() => {
        generalListMessages.innerHTML = "";
      }, 1000);
    });
});


// Handling fitering (search, next, previous page)
function handleSearch(e) {
  filterData.setSearch(e.value);
  setTable();
}

function handleNextPage(e) {
  const isPageChanged = filterData.incrementPage();
  if (isPageChanged) {
    setTable();
  }
}

function handlePrevPage(e) {
  const isPageChanged = filterData.decremnetPage();
  if (isPageChanged) {
    setTable();
  }
}

function redirect(e){
  document.location.href =
  rootPath + e
}

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });