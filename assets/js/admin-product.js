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

  let profitSharingType;
  let profitSharingValue;
  if (row.profitSharedType == "SHARING_AMOUNT") {
    profitSharingType = `<div class="badge bg-primary ">${row.profitSharedType}</div>`;
    profitSharingValue = helpers.convertToIDR(row.profitSharing);
  } else if (row.profitSharedType == "PERCENTAGE") {
    profitSharingType = `<div class="badge bg-success ">${row.profitSharedType}</div>`;
    profitSharingValue = `${row.profitSharing}%`;
  } else {
    profitSharingType = `<div class="badge bg-danger ">${row.profitSharedType}</div>`;
    profitSharingValue = 0;
  }

  newRow.querySelector(".barcode").innerHTML = row.barcode;
  newRow.querySelector(".name").innerHTML = row.name;
  newRow.querySelector(".price").innerHTML = helpers.convertToIDR(row.price);
  newRow.querySelector(".profitSharingAmount").innerHTML = profitSharingValue;
  newRow.querySelector(".profitSharingType").innerHTML = profitSharingType;
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

const formEdit = document.getElementById("formEditProduct");

// handle edit button to change value form
function handleEditView(e) {
  const productId = e.getAttribute("data-edit-id");
  http.client
    .get(`products/${productId}`)
    .then((response) => {
      const product = response.data.data;

      formEdit.querySelector('input[name="id"]').value = productId;
      formEdit.querySelector('input[name="barcode"]').value = product.barcode;
      formEdit.querySelector('input[name="name"]').value = product.name;
      formEdit.querySelector('input[name="price"]').value = product.price;
      formEdit.querySelector("#editprofitSharingType").innerHTML = `
              <option value="SHARING_AMOUNT" ${ product.profitSharedType == 'SHARING_AMOUNT' ? 'selected': ''} >SHARING_AMOUNT</option>
              <option value="PERCENTAGE" ${ product.profitSharedType == 'PERCENTAGE' ? 'selected': ''} >PERCENTAGE</option>
              <option value="NONE" ${ product.profitSharedType == 'NONE' ? 'selected': ''} >NONE</option>
        `;
      formEdit.querySelector('input[name="profitSharingValue"]').value =
        product.profitSharing;
      formEdit.querySelector('input[name="stock"]').value = product.stock;
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
  const barcode = formEdit.querySelector('input[name="barcode"]').value;
  const name = formEdit.querySelector('input[name="name"]').value;
  const price = formEdit.querySelector('input[name="price"]').value;
  const profitSharedType = formEdit.querySelector(
    "#editprofitSharingType"
  ).value;
  const profitSharing = formEdit.querySelector(
    'input[name="profitSharingValue"]'
  ).value;
  const stock = formEdit.querySelector('input[name="stock"]').value;

  http.client
    .put(`products/${id}`, {
      barcode,
      name,
      price,
      profitSharing,
      profitSharedType,
      stock,
    })
    .then((response) => {
      const alertSuccess = createAlert("success", response.data.message);
      placeModalEditMessage.appendChild(alertSuccess);
      setTable();

      // Hilangkan pesan setelah 1 detik
      setTimeout(() => {
        placeModalEditMessage.innerHTML = "";
      }, 1500);
    })
    .catch((err) => {
      helpers.showErrorMessages(err, placeModalEditMessage);

      // Hilangkan pesan peringatan setelah 1 detik
      setTimeout(() => {
        placeModalEditMessage.innerHTML = "";
      }, 3000);
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
function redirect(e) {
  document.location.href = rootPath + e;
}
function redirect(e) {
  document.location.href = rootPath + e;
}

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
