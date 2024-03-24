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
    .get(filterData.toQueryParams("cashiers"))
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

  newRow.querySelector(".username").innerHTML = row.username;
  newRow.querySelector(".createdAt").innerHTML = row.createdAt;
  newRow
    .querySelector(".action button[data-edit-id]")
    .setAttribute("data-edit-id", row.userId);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.userId);

  return newRow;
}

// End Logic to populate the data

// Create Supplier
const formCreate = document.getElementById("formCreateKasir");
const placeModalCreateMessage = document.getElementById("modal-create-message");

formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const newCashier = {
    username: document.getElementById("craeteUsername").value,
    password: document.getElementById("craetePassword").value,
    confirmPassword: document.getElementById("craeteConfirmPassword").value,
  };

  http.client
    .post("cashiers", newCashier)
    .then((response) => {
      helpers.clearChieldElements(generalListMessages);
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);
      setTable();
      helpers.hideModal("createModal");
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
  const cashierId = e.getAttribute("data-edit-id");
  http.client
    .get(`cashiers/${cashierId}`)
    .then((response) => {
      const cashier = response.data.data;
      document.getElementById("editUsernameText").value = cashier.username;
      document.getElementById("existingCashierId").value = cashier.userId;
    })
    .catch((err) => {
      helpers.showErrorMessages(err, generalListMessages);
    });
}

const placeModalEditMessage = document.getElementById("modal-edit-message");

//handle submit update
formEdit.addEventListener("submit", function (e) {
  e.preventDefault();

  const existCashier = {
    username: document.getElementById("editUsernameText").value,
    password: document.getElementById("editPasswordText").value ,
    confirmPassword: document.getElementById("editConfirmPasswordText").value ,
  };

  const id = document.getElementById("existingCashierId").value;

  http.client
    .put(`cashiers/${id}`, existCashier)
    .then((response) => {
      helpers.clearChieldElements(generalListMessages);
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);
      setTable();
      helpers.hideModal("editModal");
    })
    .catch((err) => {
      helpers.showErrorMessages(err, placeModalEditMessage);
    });
});

// handle delete button
function handleDelete(e) {
  const cashierId = e.getAttribute("data-delete-id");
  http.client
    .delete(`cashiers/${cashierId}`)
    .then((response) => {
      helpers.clearChieldElements(generalListMessages);
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
