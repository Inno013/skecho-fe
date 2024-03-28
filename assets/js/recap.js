const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

async function fetchDataWithPagination(
  pageNumber,
  startDate = null,
  endDate = null
) {
  try {
    const response = await http.client.get("/recap/order", {
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

document.addEventListener("DOMContentLoaded", function () {
  fetchDataWithPagination(0)
    .then((data) => {
      populateTableOrder(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

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

function handleFilterOrder() {
  const startDate = document.getElementById("start-date-order").value;
  const endDate = document.getElementById("end-date-order").value;

  fetchDataWithPagination(0, startDate, endDate)
    .then((data) => {
      populateTableOrder(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
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
