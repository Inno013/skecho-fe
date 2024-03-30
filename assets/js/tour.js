const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

// Begin Logic to populate the data
const sampleRow = document.getElementById("sample-row");
const tableBody = document.querySelector("#data-table tbody");
const filterData = new helpers.FilterData();

function setTable() {
  // Pengaturan tabel seperti sebelumnya
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  http.client
    .get(filterData.toQueryParams("/tours"))
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
  buttonChange();
}

// call set table to populate the data and put it into the table
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
    .setAttribute("data-edit-id", row.tourId);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.tourId);

  newRow
    .querySelector(".invoiceTour button")
    .setAttribute("data-tour-id", row.tourId);

  return newRow;
}

// End Logic to populate the data

// Create tour
const formCreate = document.getElementById("formCreatetour");
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
    const alertWarning = createAlert(
      "warning",
      "Isi Kolom Kosong / No Tlp harus 10-13 Karakter"
    );
    placeModalCreateMessage.appendChild(alertWarning);

    // Hilangkan pesan peringatan setelah 1 detik
    setTimeout(() => {
      placeModalCreateMessage.innerHTML = "";
    }, 1000);

    return; // Stop further execution
  }

  http.client
    .post("tours", { name, phone, address })
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

// End Create tour

const generalListMessages = document.getElementById("general-list-messages");

const formEdit = document.getElementById("formEdittour");

// handle edit button to change value form
function handleEditView(e) {
  const tourId = e.getAttribute("data-edit-id");
  http.client
    .get(`tours/${tourId}`)
    .then((response) => {
      const tour = response.data.data;

      formEdit.querySelector('input[name="name"]').value = tour.name;
      formEdit.querySelector('input[name="id"]').value = tour.tourId;
      formEdit.querySelector('input[name="phone"]').value = tour.phone;
      formEdit.querySelector('textarea[name="address"]').innerHTML =
        tour.address;
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
    .put(`tours/${id}`, { name, phone, address })
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

// handle delete button
function handleDelete(e) {
  const tourId = e.getAttribute("data-delete-id");
  // Set data-attribute for the delete button in the modal
  document
    .getElementById("confirmDelete")
    .setAttribute("data-delete-id", tourId);

  // Show the delete confirmation modal
  var myModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  myModal.show();
}

// Handle confirmed delete
document.getElementById("confirmDelete").addEventListener("click", function () {
  const tourId = this.getAttribute("data-delete-id");
  http.client
    .delete(`tours/${tourId}`)
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

function sendDataInvoice(params) {
  http.client
    .post("/invoice/tour/save", params)
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);

      // Hilangkan pesan setelah 1 detik
      setTimeout(() => {
        generalListMessages.innerHTML = "";
      }, 1000);
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleRegisterInvoice(row) {
  const formInvoice = document.getElementById("formInvoice");
  const placeModalInvoiceMessage = document.getElementById(
    "modal-invoice-message"
  );
  const tourId = row.getAttribute("data-tour-id");
  http.client
    .get(`/invoice/tour/status/tourID?status=NOW&tourId=${tourId}`)
    .then((response) => {
      if (response.data.data == null) {
        const invoiceModal = new bootstrap.Modal(
          document.getElementById("invoiceModal"),
          {
            keyboard: false,
          }
        );
        invoiceModal.show();

        formInvoice.querySelector('input[name="tourId"]').value = tourId;
        formInvoice.addEventListener("submit", function (e) {
          e.preventDefault();

          const unitBus = formInvoice.querySelector("#unitBus").value;
          const jumlahIndividu =
            formInvoice.querySelector("#jumlahIndividu").value;

          if (!tourId || !unitBus || !jumlahIndividu) {
            const alertWarning = createAlert(
              "warning",
              "Please fill in all fields."
            );
            placeModalInvoiceMessage.appendChild(alertWarning);

            setTimeout(() => {
              placeModalInvoiceMessage.innerHTML = "";
            }, 1000);
            console.log(tourId + "-" + unitBus + "-" + jumlahIndividu);
          }
          sendDataInvoice({
            tourId: tourId,
            unitBus: unitBus,
            employee: jumlahIndividu,
          });
          const buttonInvoice = document.getElementsByClassName("ivoiceStatus");
          for (let i = 0; i < buttonInvoice.length; i++) {
            if (buttonInvoice[i].getAttribute("data-tour-id") == tourId) {
              buttonInvoice[i].innerHTML =
                '<i class="bi bi-file-earmark-text"></i> Open Invoice';
            }
          }
        });
      } else {
        document.location.href =
          rootPath +
          `/views/admin/tour/tourinvoice.html?tourId=${response.data.data.tourId.tourId}`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

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

function buttonChange() {
  http.client.get(`/invoice/tour/status?status=NOW`).then((response) => {
    response.data.data.forEach((data) => {
      const buttonInvoice = document.getElementsByClassName("ivoiceStatus");
      for (let i = 0; i < buttonInvoice.length; i++) {
        if (
          buttonInvoice[i].getAttribute("data-tour-id") == data.tourId.tourId
        ) {
          buttonInvoice[i].innerHTML =
            '<i class="bi bi-file-earmark-text"></i> Open Invoice';
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
  buttonChange();
});

function redirect(e) {
  document.location.href = rootPath + e;
}

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
