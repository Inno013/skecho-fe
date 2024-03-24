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
    .get(filterData.toQueryParams("/products"))
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

  newRow.querySelector(".barcode").innerHTML = row.barcode;
  newRow.querySelector(".name").innerHTML = row.name;
  newRow.querySelector(".price").innerHTML = row.price;
  newRow.querySelector(".profitSharingAmount").innerHTML =
    row.profitSharingAmount;
  newRow.querySelector(".stock").innerHTML = row.stock;
  newRow
    .querySelector(".action button[data-edit-id]")
    .setAttribute("data-edit-id", row.productId);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.productId);

  return newRow;
}

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
      formEdit.querySelector('textarea[name="address"]').innerHTML =
        supplier.address;
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
    })
    .catch((err) => {
      helpers.showErrorMessages(err, placeModalEditMessage);
    });
});

// handle delete button
function handleDelete(e) {
  window.ipcRenderer.openDialog("openDialog");

  const isConfirmed = confirm("Are you sure you want to delete?");
  if (!isConfirmed) return;

  const supplierId = e.getAttribute("data-delete-id");
  http.client
    .delete(`products/${supplierId}`)
    .then((response) => {
      console.log(response.data);
      const alertSuccess = createAlert("success", response.data.message);
      generalListMessages.appendChild(alertSuccess);
      setTable();
    })
    .catch((err) => {
      const generalListMessages = document.getElementById(
        "general-list-messages"
      );
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
