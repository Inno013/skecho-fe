const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

// Begin Logic to populate the data
const sampleRow = document.getElementById("sample-row");
const tableBody = document.querySelector("#data-table tbody");
const tableDisk = document.querySelector("#tabel-disc thead");
const rowDisk = document.getElementById("row-disk");
const filterData = new helpers.FilterData();
const sharingAmount = [];
const percentage = [];
let totalProfitSharing = 0;
let employeeSharing = 0;
let printInvoice;

function updateDateTime() {
  // Buat objek tanggal dan waktu saat ini
  var now = new Date();

  // Format tanggal dan waktu menjadi string yang sesuai
  var dateTimeString = now.toLocaleString();

  // Perbarui nilai input tanggal dengan tanggal dan waktu saat ini
  document.getElementById("inputTanggal").innerHTML = dateTimeString;
}

setInterval(updateDateTime, 1000);
var urlParams = new URLSearchParams(window.location.search);
var tourId = urlParams.get("tourId");

function setData(tourId) {
  http.client
    .get(`/invoice/tour/status/tourID?status=NOW&tourId=${tourId}`)
    .then((response) => {
      employeeSharing = response.data.data.employee;
      document.getElementById("tourId").innerHTML =
        response.data.data.tourId.tourId;
      document.getElementById("po").innerHTML = response.data.data.tourId.name;
      document.getElementById("unitBus").innerHTML = response.data.data.unitBus;
      document.getElementById(
        "employee"
      ).innerHTML = `Employee (${employeeSharing})`;
      document.getElementById("invoiceTourId").innerHTML =
        response.data.data.invoiceTourId;
      http.client
        .get(`/invoice/tour/order_details/${response.data.data.invoiceTourId}`)
        .then((response) => {
          addSharingAmountInArray(response.data.data);
          addPercentageInArray(response.data.data);
          addDataInTable();
        })
        .catch((error) => {
          console.error(error);
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

function addDataInTable() {
  var maxProfitSharing = Math.max(
    ...percentage.map((item) => item.profitSharing)
  );
  var objWithMaxProfitSharing = percentage.find(
    (item) => parseInt(item.profitSharing) === maxProfitSharing
  );
  document.getElementById("omset").innerHTML = objWithMaxProfitSharing.subtotal;

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  while (tableDisk.firstChild) {
    tableDisk.removeChild(tableDisk.firstChild);
  }
  for (let i = 0; i < percentage.length; i++) {
    totalProfitSharing += percentage[i].disc;
    const newRow = createDisk(percentage[i]);
    tableDisk.appendChild(newRow);
  }
  for (let i = 0; i < sharingAmount.length; i++) {
    totalProfitSharing += sharingAmount[i].subtotal;
    const newRow = createNewRow(sharingAmount[i]);
    tableBody.appendChild(newRow);
  }

  let employeeAmount = totalProfitSharing / employeeSharing;

  document.getElementById(
    "totalProfitSharing"
  ).innerHTML = `Total Profit Sharing: Rp ${totalProfitSharing}`;
  document.getElementById(
    "employeeSharing"
  ).innerHTML = `Rp ${employeeAmount.toFixed(2)}`;

  employee = document.getElementById("employee").textContent.match(/\d+/);

  printInvoice = {
    invoiceTourId: parseInt(
      document.getElementById("invoiceTourId").textContent
    ),
    tourId: parseInt(document.getElementById("tourId").textContent),
    tourName: document.getElementById("po").textContent,
    unitBus: parseInt(document.getElementById("unitBus").textContent),
    employee: parseInt(employee[0]),
    omset: parseFloat(document.getElementById("omset").textContent),
    employeeAmount: parseFloat(employeeAmount.toFixed(2)),
    totalProfitSharing: totalProfitSharing,
    profitSharingAmounts: sharingAmount,
    profitSharingPercentages: percentage,
  };
}

document.getElementById("print").addEventListener("click", function () {
  console.log(printInvoice);
  http.client
    .post("/invoice/tour/print_invoice", printInvoice)
    .then((response) => {
      printPdf(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
});

function printPdf(pdf) {
  const iframe = document.createElement("iframe");
  // iframe.style.display = "none";
  iframe.src = pdf;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow.print();
  };
}

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector("#productName").innerHTML = row.name;
  newRow.querySelector("#profitSharing").innerHTML = row.profitSharing;
  newRow.querySelector("#qty").innerHTML = row.quantity;
  newRow.querySelector("#subTotal").innerHTML = row.subtotal;

  return newRow;
}

function createDisk(row) {
  const newRow = rowDisk.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector("#disk").innerHTML = "Disk(" + row.profitSharing + "%)";
  newRow.querySelector("#subTotal").innerHTML = row.disc;

  return newRow;
}

function redirect(e) {
  document.location.href = rootPath + e;
}

document.addEventListener("DOMContentLoaded", function (e) {
  setData(tourId);
});
