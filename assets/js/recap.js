const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

async function fetchDataWithPagination(pageNumber) {
  try {
    const response = await http.get("/recap/order", {
      params: {
        page: pageNumber,
        size: 50,
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
      populateTable(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

function populateTable(data) {
  const tbody = document.getElementById("order-table-body");
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.userId.username}</td>
        <td>${item.invoiceTourId.tourId.name}</td>
        <td>${item.totalItems}</td>
        <td>${item.totalPrice}</td>
        <td>${item.amount}</td>
        <td>${item.refund}</td>
        <td><button onclick="handleRefund(${item.orderId})"></button></td>
      `;
    tbody.appendChild(row);
  });
}
