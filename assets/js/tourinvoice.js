const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

// Begin Logic to populate the data
const sampleRow = document.getElementById("sample-row");
const tableBody = document.querySelector("#data-table tbody");
const filterData = new helpers.FilterData();

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

setData(tourId);

function setData(tourId) {
  http.client
    .get(`/invoice/tour/status/tourID?status=NOW&tourId=${tourId}`)
    .then((response) => {
      document.getElementById("tourId").innerHTML =
        response.data.data.tourId.tourId;
      document.getElementById("po").innerHTML = response.data.data.tourId.name;
      document.getElementById("unitBus").innerHTML = response.data.data.unitBus;
      document.getElementById("omset").innerHTML = response.data.data.income;
    })
    .catch((error) => {
      console.error(error);
    });
}

function createNewRow(row) {
  const newRow = sampleRow.cloneNode(true);
  newRow.classList.remove("d-none");

  newRow.querySelector(".productName").innerHTML = row.name;
  newRow.querySelector(".profitSharing").innerHTML = row.address;
  newRow.querySelector(".qty").innerHTML = row.phone;
  newRow.querySelector(".subTotal").innerHTML = row.createdAt;
  newRow
    .querySelector(".action button[data-edit-id]")
    .setAttribute("data-edit-id", row.tourId);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", row.tourId);

  newRow
    .querySelector(".invoiceTour button")
    .setAttribute("data-tour-id", row.tourId);

  return newRow;
}
