const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

// Begin Logic to populate the data
const selectTour = document.getElementById("selectTour");
const selectName = document.getElementById("selectName");
const payButton = document.getElementById("pay");
const amount = document.getElementById("amount-paid");
const sampleRow = document.getElementById("sample-row");
const tableBody = document.querySelector("#order-table tbody");
const dataOrder = [];

function updateDateTime() {
  var dt = new Date();
  var datetimeSpan = document.getElementById("datetime");
  var datetimeString = dt.toLocaleString();
  datetimeSpan.textContent = datetimeString;
}
setInterval(updateDateTime, 1000);

async function fetchDataWithUrl(url, params) {
  try {
    const response = await http.client.get(url, { params });

    return response.data;
  } catch (error) {
    alert(`Data tidak ditemukan`, "alertContainer");
  }
}

// Post ordernya error
async function sendDataWithUrl(url, params) {
  try {
    const response = await http.client.post(url, params);
    console.log(response.data);
    return response.data;
  } catch (error) {
    alert(`Gagal Order Barang`, "alertContainer");
  }
}

const formOrder = document.getElementById("formOrder");
const formPay = document.getElementById("formPay");

function dataToOrderRequest(data) {
  const orders = {
    userId: 1,
    invoiceTourId: document.getElementById("selectTour").value,
    totalItems: parseFloat(data.totalItems),
    totalPrice: parseFloat(data.totalPrice),
    amount: parseFloat(data.amount),
    refund: parseFloat(data.refund),
    orderDetailsRequests: dataOrder,
  };
  return orders;
}

formOrder.addEventListener("submit", function (e) {
  e.preventDefault();
  const barcode = formOrder.querySelector("#barcode");

  fetchDataWithUrl("/products/barcode", { barcode: barcode.value })
    .then((data) => {
      setDataProduct(data.data);
      let rowIndex = indexDataOrder(
        formOrder.querySelector("#productId").value
      );
      let qty = parseFloat(formOrder.querySelector("#qty").value);
      let price = parseFloat(formOrder.querySelector("#price").value);
      console.log(selectTour.value);
      if (rowIndex == null || dataOrder.length == 0) {
        dataOrder.push({
          productId: formOrder.querySelector("#productId").value,
          profitSharing: formOrder.querySelector("#profitSharing").value,
          profitSharedType: formOrder.querySelector("#profitSharedType").value,
          barcode: document.getElementById("barcode").value,
          price: price,
          name: formOrder.querySelector("#name").value,
          quantity: qty,
          subtotal: qty * price,
        });
      } else {
        dataOrder[rowIndex].quantity += qty;
        dataOrder[rowIndex].subtotal = dataOrder[rowIndex].quantity * price;
      }
      addDataInTable();
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

// Belum selesai krim order ke database
formPay.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = {
    amount: document.getElementById("amount-paid").value,
    refund: document.getElementById("change").value,
    totalItems: document.getElementById("total-item").value,
    totalPrice: document.getElementById("grand-total").value,
  };
  sendDataWithUrl("/orders/save", dataToOrderRequest(formData))
    .then((data) => {
      printPdf(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

document
  .getElementById("simpanSementara")
  .addEventListener("click", function () {
    const currentDataString = sessionStorage.getItem("simpanSementara");
    const currentData = currentDataString ? JSON.parse(currentDataString) : [];
    currentData.push({
      name: document.getElementById("inputName").value,
      dataOrder: dataOrder,
    });

    sessionStorage.setItem("simpanSementara", JSON.stringify(currentData));
  });

function printPdf(pdf) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdf;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow.print();
  };
}

function alert(message, id) {
  const alertContainer = document.getElementById(id);
  const alertHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
  ${message}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `;
  alertContainer.innerHTML = alertHTML;
}

payButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (dataOrder.length == 0) {
    alert(
      "<strong>Empty shopping list!!</strong> Please input the items first.",
      "alertContainer"
    );
  } else {
    let totalItems = 0;
    dataOrder.forEach((data) => {
      totalItems += data.quantity;
    });
    document.getElementById("total-item").value = totalItems;
    document.getElementById("grand-total").value = sumTotalPrice();
    const modal = new bootstrap.Modal(document.getElementById("modalPay"));
    modal.show();
  }
});

amount.addEventListener("change", function (e) {
  if (e.target.value < sumTotalPrice()) {
    alert("<strong>Not enough money</strong>", "alertPay");
  } else {
    document.getElementById("change").value = e.target.value - sumTotalPrice();
  }
});

function addDataInTable() {
  const totalPriceSpan = document.getElementById("total-price");
  let totalPrice = 0;

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  dataOrder.forEach((data) => {
    const newRow = createNewRow(data);
    tableBody.appendChild(newRow);

    totalPrice = sumTotalPrice();

    totalPriceSpan.textContent = formatCurrency(totalPrice); // Gunakan fungsi formatCurrency untuk format Rupiah
  });

  if (dataOrder.length == 0) {
    totalPriceSpan.textContent = formatCurrency(0);
  }
}

function sumTotalPrice() {
  let totalPrice = 0;
  dataOrder.forEach((data) => {
    totalPrice += data.subtotal;
  });
  return totalPrice;
}
function formatCurrency(amount) {
  return "Rp " + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function handleQtyChange(event) {
  const qtyInput = event.target;
  const rowIndex = qtyInput.closest("tr").rowIndex - 1;

  dataOrder[rowIndex].quantity = parseFloat(qtyInput.value);
  dataOrder[rowIndex].subtotal = qtyInput.value * dataOrder[rowIndex].price;
  addDataInTable();
}

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector(".barcode").innerHTML = row.barcode;
  newRow.querySelector(".name").innerHTML = row.name;
  newRow.querySelector('.qty input[type="number"]').value = row.quantity;
  newRow.querySelector(".price").innerHTML = row.price;
  newRow.querySelector(".subTotal").innerHTML = row.subtotal;
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.productId);

  return newRow;
}

// handle delete button
function handleDelete(e) {
  const data = e.getAttribute("data-delete-id");

  // Set data-attribute for the delete button in the modal
  document.getElementById("confirmDelete").setAttribute("data-delete-id", data);
}

// Handle confirmed delete
document.getElementById("confirmDelete").addEventListener("click", function () {
  const index = indexDataOrder(this.getAttribute("data-delete-id"));
  if (index != null) {
    dataOrder.splice(index, 1);
    addDataInTable();
  }
});

function indexDataOrder(id) {
  for (let index = 0; index < dataOrder.length; index++) {
    if (id == dataOrder[index].productId) {
      return index;
    }
  }
  return null;
}

function setDataProduct(data) {
  formOrder.querySelector("#profitSharing").value = data.profitSharing;
  formOrder.querySelector("#profitSharedType").value = data.profitSharedType;
  formOrder.querySelector("#productId").value = data.productId;
  formOrder.querySelector("#name").value = data.name;
  formOrder.querySelector("#price").value = data.price;
}

function setDataTour() {
  fetchDataWithUrl("/invoice/tour/status", { status: "NOW" }).then((data) => {
    data.data.forEach((tour) => {
      let optionElement = document.createElement("option");
      optionElement.textContent = tour.tourId.name;
      optionElement.value = tour.invoiceTourId;
      selectTour.appendChild(optionElement);
    });
  });
}
function setDataSimpan() {
  const dataSimpan = JSON.parse(sessionStorage.getItem("simpanSementara"));
  for (let i = 0; i < dataSimpan.length; i++) {
    let optionElement = document.createElement("option");
    optionElement.textContent = dataSimpan[i].name;
    optionElement.value = dataSimpan[i].name;
    selectName.appendChild(optionElement);
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  setDataTour();
  setDataSimpan();
});
