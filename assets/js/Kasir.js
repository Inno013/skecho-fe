const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

// Begin Logic to populate the data
const selectElement = document.getElementById("selectTour");
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
    alert(`Data Barang tidak ditemukan`, "alertContainer");
  }
}

// Post ordernya error
// async function sendDataWithUrl(url, params) {
//   try {
//     const response = await http.client.post(url, { params });
//     return response.data;
//   } catch (error) {
//     alert(`Gagal Order Barang`, "alertContainer");
//   }
// }

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
  let rowIndex = indexDataOrder(formOrder.querySelector("#productId").value);
  let qty = parseFloat(formOrder.querySelector("#qty").value);
  let price = formOrder.querySelector("#price").value;
  if (rowIndex == null || dataOrder.length == 0) {
    dataOrder.push({
      productId: formOrder.querySelector("#productId").value,
      profitSharingAmount: formOrder.querySelector("#profitSharingAmount")
        .value,
      barcode: document.getElementById("barcode").value,
      name: formOrder.querySelector("#name").value,
      price: price,
      qty: qty,
      subTotal: qty * price,
    });
  } else {
    dataOrder[rowIndex].qty += qty;
    dataOrder[rowIndex].subTotal = qty * price;
  }
  addDataInTable();
});

// Belum selesai krim order ke database
// formPay.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const formData = {
//     amount: document.getElementById("amount-paid").value,
//     refund: document.getElementById("change").value,
//     totalItems: document.getElementById("total-item").value,
//     totalPrice: document.getElementById("grand-total").value,
//   };
//   // sendDataWithUrl("/orders/save", dataToOrderRequest(formData))
//   //   .then((data) => {
//   //     // printPdf(data);
//   //     console.log(data);
//   //   })
//   //   .catch((error) => {
//   //     console.error("Error fetching data with pagination:", error);
//   //   });
// });

// function printPdf(pdf) {
//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = pdf;
//   document.body.appendChild(iframe);

//   iframe.onload = function () {
//     iframe.contentWindow.print();
//   };
// }

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
      totalItems += data.qty;
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
    totalPrice += data.qty * data.price;
  });
  return totalPrice;
}
function formatCurrency(amount) {
  return "Rp " + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function handleQtyChange(event) {
  const qtyInput = event.target;
  const rowIndex = qtyInput.closest("tr").rowIndex - 1;

  dataOrder[rowIndex].qty = parseFloat(qtyInput.value);
  dataOrder[rowIndex].subTotal = qtyInput.value * dataOrder[rowIndex].price;
  addDataInTable();
}

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector(".barcode").innerHTML = row.barcode;
  newRow.querySelector(".name").innerHTML = row.name;
  newRow.querySelector('.qty input[type="number"]').value = row.qty;
  newRow.querySelector(".price").innerHTML = row.price;
  newRow.querySelector(".subTotal").innerHTML = row.qty * row.price;
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

function handleBarcode(e) {
  fetchDataWithUrl("/products/barcode", { barcode: e.value })
    .then((data) => {
      setDataProduct(data.data);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}

function setDataProduct(data) {
  formOrder.querySelector("#profitSharingAmount");
  formOrder.querySelector("#productId").value = data.productId;
  formOrder.querySelector("#name").value = data.name;
  formOrder.querySelector("#price").value = data.price;
}

function setDataTour() {
  fetchDataWithUrl("/invoice/tour/status", { status: "NOW" }).then((data) => {
    data.data.forEach((tour) => {
      let optionElement = document.createElement("option");
      optionElement.textContent = tour.tourId.name;
      optionElement.value = tour.tourId.tourId;
      selectElement.appendChild(optionElement);
    });
  });
}

document.addEventListener("DOMContentLoaded", function (e) {
  setDataTour();
});
