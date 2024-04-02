const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

async function fetchDataWithPagination(
  url,
  pageNumber,
  startDate = null,
  endDate = null
) {
  try {
    const response = await http.client.get(url, {
      params: {
        page: pageNumber,
        size: 50,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.getElementById("order-tab").addEventListener("click", function (e) {
  fetchDataWithPagination("/recap/order", 0)
    .then((data) => {
      populateTableOrder(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});
document.getElementById("purchase-tab").addEventListener("click", function (e) {
  fetchDataWithPagination("/recap/purchase", 0)
    .then((data) => {
      populateTablePurchase(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});
document.getElementById("invoice-tab").addEventListener("click", function (e) {
  fetchDataWithPagination("/recap/invoice", 0)
    .then((data) => {
      populateTableInvoice(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {});

function populateTableOrder(data) {
  const tbody = document.getElementById("order-table-body");
  let sumTotalPrice = 0;
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    sumTotalPrice += item.totalPrice;
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.userId.username}</td>
        <td>${item.invoiceTourId.tourId.name}</td>
        <td>${item.totalItems}</td>
        <td>${item.totalPrice}</td>
        <td>${item.amount}</td>
        <td>${item.refund}</td>
        <td>${item.createdAt}</td>
      `;
    // <td><button onclick="handleRefund(${item.orderId})"></button></td>
    tbody.appendChild(row);
  });
  document.getElementById("total-order").value = sumTotalPrice;
}

function populateTablePurchase(data) {
  const tbody = document.getElementById("purchase-table-body");
  let sumTotalPrice = 0;
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    sumTotalPrice += item.totalPrice;
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.supplier.name}</td>
        <td>${item.totalItems}</td>
        <td>${item.totalPrice}</td>
        <td>${item.amount}</td>
        <td>${item.createdAt}</td>
      `;
    // <td><button onclick="handleRefund(${item.orderId})"></button></td>
    tbody.appendChild(row);
  });
  document.getElementById("total-purchase").value = sumTotalPrice;
}

function populateTableInvoice(data) {
  const tbody = document.getElementById("invoice-table-body");
  let sumTotalPrice = 0;
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    sumTotalPrice += item.profitSharing;
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.tourId.name}</td>
        <td>${item.tourId.address}</td>
        <td>${item.profitSharing}</td>
        <td>${item.employee}</td>
        <td>${item.status}</td>
        <td>${item.createdAt}</td>
      `;
    // <td><button onclick="handleRefund(${item.orderId})"></button></td>
    tbody.appendChild(row);
  });
  document.getElementById("total-invoice").value = sumTotalPrice;
}

// function handleFilter(url, startDate, endDate) {
//   const startDate = document.getElementById(startDate).value;
//   const endDate = document.getElementById(endDate).value;

//   fetchDataWithPagination(url, 0, startDate, endDate)
//     .then((data) => {
//       if (url == "/recap/order") {
//         populateTableOrder(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
//       } else if (url == "/recap/purchase") {
//         populateTablePurchase(data.content);
//       } else if (url == "/recap/invoice") {
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching data with pagination:", error);
//     });
// }

function redirect(e) {
  document.location.href = rootPath + e;
}

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
