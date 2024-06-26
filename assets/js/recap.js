const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const { ipcRenderer } = require("electron");

let sharingAmount = [];
let percentage = [];

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

document.getElementById("product-tab").addEventListener("click", function (e) {
  fetchDataWithPagination("/recap/products", 0)
    .then((data) => {
      populateTableProducts(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetchDataWithPagination("/recap/purchase", 0)
    .then((data) => {
      populateTablePurchase(data.content); // Panggil fungsi populateTable untuk memasukkan data ke dalam tabel
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
    if (item.invoiceTourId == null) {
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.userId.username}</td>
          <td> - </td>
          <td>${item.totalItems}</td>
          <td>${item.totalPrice}</td>
          <td>${item.amount}</td>
          <td>${item.refund}</td>
          <td>${item.createdAt}</td>
          <td><button
          type="button"
          class="btn btn-success"
          onclick="handlePrintOrder(${item.orderId})"
          data-bs-toggle="modal"
          data-bs-target="#orderModal">
          <i class="bi bi-eye"></i>
        </button></td>
        `;
    } else if (item.userId == null) {
      row.innerHTML = `
          <td>${index + 1}</td>
          <td> - </td>
          <td>${item.invoiceTourId.tourId.name}</td>
          <td>${item.totalItems}</td>
          <td>${item.totalPrice}</td>
          <td>${item.amount}</td>
          <td>${item.refund}</td>
          <td>${item.createdAt}</td>
          <td><button
          type="button"
          class="btn btn-success"
          onclick="handlePrintOrder(${item.orderId})"
          data-bs-toggle="modal"
          data-bs-target="#orderModal">
          <i class="bi bi-eye"></i>
        </button></td>
        `;
    } else {
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.userId.username}</td>
          <td>${item.invoiceTourId.tourId.name}</td>
          <td>${item.totalItems}</td>
          <td>${item.totalPrice}</td>
          <td>${item.amount}</td>
          <td>${item.refund}</td>
          <td>${item.createdAt}</td>
          <td><button
          type="button"
          class="btn btn-success"
          onclick="handlePrintOrder(${item.orderId})"
          data-bs-toggle="modal"
          data-bs-target="#orderModal">
          <i class="bi bi-eye"></i>
        </button></td>
        `;
    }
    tbody.appendChild(row);
  });
  let formattedNumber = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(sumTotalPrice);
  document.getElementById("total-order").value = formattedNumber;
}

function populateTablePurchase(data) {
  const tbody = document.getElementById("purchase-table-body");
  let sumTotalPrice = 0;
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    sumTotalPrice += item.totalPrice;
    if (item.supplier == null) {
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>-</td>
        <td>${item.totalItems}</td>
        <td>${item.totalPrice}</td>
        <td>${item.amount}</td>
        <td>${item.createdAt}</td>
      `;
    } else {
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.supplier.name}</td>
          <td>${item.totalItems}</td>
          <td>${item.totalPrice}</td>
          <td>${item.amount}</td>
          <td>${item.createdAt}</td>
        `;
    }
    // <td><button onclick="handleRefund(${item.orderId})"></button></td>
    tbody.appendChild(row);
  });
  let formattedNumber = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(sumTotalPrice);
  document.getElementById("total-purchase").value = formattedNumber;
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
        <td><button
        type="button"
        class="btn btn-success"
        onclick="handlePrintInvoice(${item.invoiceTourId})"
        data-bs-toggle="modal"
        data-bs-target="#orderModal">
        <i class="bi bi-eye"></i>
      </button></td>
      `;
    tbody.appendChild(row);
  });
  let formattedNumber = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(sumTotalPrice);
  document.getElementById("total-invoice").value = formattedNumber;
}

function populateTableProducts(data) {
  const tbody = document.getElementById("product-table-body");
  let sumTotalPrice = 0;
  tbody.innerHTML = ""; // Kosongkan isi tabel sebelum memasukkan data baru

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    sumTotalPrice += item.price * item.count;
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.barcode}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.stock}</td>
        <td>${item.count}</td>
      `;
    // <td><button onclick="handleRefund(${item.orderId})"></button></td>
    tbody.appendChild(row);
  });
  let formattedNumber = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(sumTotalPrice);
  document.getElementById("total-price-product").value = formattedNumber;
}

function handleFilterOrder() {
  const startDate = document.getElementById("start-date-order").value;
  const endDate = document.getElementById("end-date-order").value;

  fetchDataWithPagination("/recap/order", 0, startDate, endDate)
    .then((data) => {
      populateTableOrder(data.content);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}
function handleFilterInvoice() {
  const startDate = document.getElementById("start-date-invoice").value;
  const endDate = document.getElementById("end-date-invoice").value;

  fetchDataWithPagination("/recap/invoice", 0, startDate, endDate)
    .then((data) => {
      populateTableInvoice(data.content);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}

function handleFilterProduct() {
  const startDate = document.getElementById("start-date-product").value;
  const endDate = document.getElementById("end-date-product").value;

  fetchDataWithPagination("/recap/products", 0, startDate, endDate)
    .then((data) => {
      populateTableProducts(data.content);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}

function handlePrintInvoice(invoiceTourId) {
  http.client
    .get(`/invoice/tour/order_details/${invoiceTourId}`)
    .then((response) => {
      addSharingAmountInArray(response.data.data);
      addPercentageInArray(response.data.data);
      var maxProfitSharing = Math.max(
        ...percentage.map((item) => item.profitSharing)
      );
      var omsetMax = percentage.find(
        (item) => parseInt(item.profitSharing) === maxProfitSharing
      );
      http.client
        .post(
          "/invoice/tour/print_recap_invoice",
          {
            invoiceTourId: invoiceTourId,
            omset: omsetMax.subtotal,
            profitSharingAmounts: sharingAmount,
            profitSharingPercentages: percentage,
          },
          {
            responseType: "arraybuffer",
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const embed = document.querySelector(".pdf-embed");
          embed.setAttribute("src", url);
          sharingAmount = [];
          percentage = [];
        })
        .catch((error) => {
          console.error("Error fetching data with pagination:", error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

function addSharingAmountInArray(data) {
  for (var key in data.SHARING_AMOUNT) {
    var items = data.SHARING_AMOUNT[key];
    let Totalquantity = 0;
    for (var i = 0; i < items.length; i++) {
      Totalquantity += items[i].quantity;
    }
    sharingAmount.push({
      name: items[0].productId.name,
      profitSharing: items[0].profitSharing,
      quantity: Totalquantity,
      subtotal: items[0].profitSharing * Totalquantity,
    });
  }
}

function addPercentageInArray(data) {
  for (var key in data.PERCENTAGE) {
    var items = data.PERCENTAGE[key];
    let Totalquantity = 0;
    let subTotal = 0;
    for (var i = 0; i < items.length; i++) {
      Totalquantity += items[i].quantity;
      subTotal += items[i].subtotal;
    }
    percentage.push({
      profitSharing: parseFloat(key),
      quantity: Totalquantity,
      subtotal: subTotal,
      disc: (subTotal * parseFloat(key)) / 100,
    });
  }
}

function handlePrintOrder(orderId) {
  http.client
    .post(
      "/orders/print?orderId=" + orderId,
      {},
      {
        responseType: "arraybuffer",
      }
    )
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const embed = document.querySelector(".pdf-embed");
      embed.setAttribute("src", url);
      document
        .getElementById("print-button")
        .addEventListener("click", function () {
          ipcRenderer.send("print", {
            data: response.data,
            name: "kasir",
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}

function handleFilterPurchase() {
  const startDate = document.getElementById("start-date-purchase").value;
  const endDate = document.getElementById("end-date-purchase").value;

  fetchDataWithPagination("/recap/purchase", 0, startDate, endDate)
    .then((data) => {
      populateTablePurchase(data.content);
    })
    .catch((error) => {
      console.error("Error fetching data with pagination:", error);
    });
}

function redirect(e) {
  document.location.href = rootPath + e;
}
