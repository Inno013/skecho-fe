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
    .get(filterData.toQueryParams("/Kasir"))
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

// call set table to populate the data and put it into the table
setTable();

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector(".Username").innerHTML = row.Username;
  newRow.querySelector(".Password").innerHTML = row.Password;
  newRow.querySelector(".phone").innerHTML = row.phone;
  newRow.querySelector(".createdAt").innerHTML = row.createdAt;
  newRow
    .querySelector(".action button[data-edit-id]")
    .setAttribute("data-edit-id", row.KasirId);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.KasirId);

  return newRow;
}

// End Logic to populate the data

// Create Supplier
const formCreate = document.getElementById("formCreateKasir");
const placeModalCreateMessage = document.getElementById("modal-create-message");

formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = formCreate.querySelector('input[name="name"]').value;
  const phone = formCreate.querySelector('input[name="phone"]').value;
  const address = formCreate.querySelector('textarea[name="address"]').value;

  http.client
    .post("Kasir", { Username, Password })
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      placeModalCreateMessage.appendChild(alertSuccess);
      setTable();
    })
    .catch((err) => {
      helpers.showErrorMessages(err, placeModalCreateMessage);
    });
});
// End Create Supplier

const generalListMessages = document.getElementById("general-list-messages");

const formEdit = document.getElementById("formEditKasir");

// handle edit button to change value form
function handleEditView(e) {
  const KasirId = e.getAttribute("data-edit-id");
  http.client
    .get(`Kasir/${KasirId}`)
    .then((response) => {
      const Kasir = response.data.data;

      formEdit.querySelector('input[name="Username"]').value = Kasir.Username;
      formEdit.querySelector('input[name="Password"]').value = Kasir.KasirId;
      
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
    .put(`Kasir/${id}`, { Username, Password })
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      placeModalEditMessage.appendChild(alertSuccess);
      setTable();
    })
    .catch((err) => {
      helpers.showErrorMessages(err, placeModalEditMessage);
    });
});

// handle delete button
function handleDelete(e) {
  const isConfirmed = confirm("Are you sure you want to delete?");
  if (!isConfirmed) return;

  const KasirId = e.getAttribute("data-delete-id");
  http.client
    .delete(`Kasir/${KasirId}`)
    .then((response) => {
      console.log(response.data);
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);
      setTable();
    })
    .catch((err) => {
      helpers.showErrorMessages(err, generalListMessages);
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
