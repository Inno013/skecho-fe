const crypto = require("crypto");
const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

const tableBody = document.querySelector("#dataTable tbody");
const generalListMessages = document.getElementById("general-list-messages");

const listNewProducts = [];
const listExistingProducts = [];

const placeModalCreateMessage = document.getElementById("modal-create-message");

// Create New Product List
const formCreate = document.getElementById("formNewProd");
formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const newProduct = {
    id: crypto.randomBytes(32).toString("hex"),
    barcode: document.getElementById("newProdBarcode").value,
    name: document.getElementById("newProdName").value,
    priceBuy: document.getElementById("newProdPriceBuy").value,
    priceSell: document.getElementById("newProdPriceSell").value,
    quantity: document.getElementById("newProdQuantity").value,
    profitSharingAmount: document.getElementById("newProdPriceSharingAmount")
      .value,
  };

  // Clear input fields
  document.getElementById("newProdBarcode").value = "";
  document.getElementById("newProdName").value = "";
  document.getElementById("newProdPriceBuy").value = "";
  document.getElementById("newProdPriceSell").value = "";
  document.getElementById("newProdQuantity").value = "";
  document.getElementById("newProdPriceSharingAmount").value = "";

  listNewProducts.push(newProduct);

  helpers.clearChieldElements(generalListMessages);
  generalListMessages.appendChild(
    createAlert("success", "Successfully added new Product")
  );
  addNewProductToTable(newProduct);
});

function addNewProductToTable(product) {
  const sampleRow = document.getElementById("sample-row");
  const newRow = sampleRow.cloneNode(true);

  newRow.classList.remove("d-none");
  newRow.querySelector(".barcode").textContent = product.barcode;
  newRow.querySelector(".name-product").textContent = product.name;
  newRow.querySelector(".price-sell").textContent = product.priceSell;
  newRow.querySelector(".profit-sharing-amount").textContent =
    product.profitSharingAmount;
  newRow.querySelector(".product-stock").textContent = product.quantity;
  // newRow
  //   .querySelector(".action button[data-edit-id]")
  //   .setAttribute("data-edit-id", product.id);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", product.id);

  tableBody.appendChild(newRow);
  helpers.hideModal("newProductModal");
}

// handle delete button
function handleDelete(e) {
  // const isConfirmed = confirm("Are you sure you want to delete?");
  // if (!isConfirmed) return;

  const productId = e.getAttribute("data-delete-id");
  const indexNewProduct = listNewProducts.indexOf(
    (product) => product.id === productId
  );
  listNewProducts.splice(indexNewProduct, 1);

  const indexExistProduct = listExistingProducts.indexOf(
    (product) => product.id === productId
  );
  listExistingProducts.splice(indexExistProduct, 1);

  helpers.clearChieldElements(generalListMessages);
  generalListMessages.appendChild(
    createAlert("success", "Successfully deleted product")
  );
  setTable();
}

function setTable() {
  helpers.clearChieldElements(tableBody);

  listNewProducts.forEach((product) => {
    console.log(product);
    addNewProductToTable(product);
  });
}

function handleStorePurchase(e) {
  console.log(document.getElementById("selectSupplier"));
  http.client
    .post("/admin/purchases", {
      supplierId: document.getElementById("selectSupplier").value,
      amount: document.getElementById("colFormAmount").value,
      newProducts: listNewProducts,
      existingProducts: listExistingProducts,
    })
    .then((response) => {
      alert(response.data.message);
      window.location.href = "./index.html";
    })
    .catch((err) => {
      helpers.clearChieldElements(generalListMessages);
      helpers.showErrorMessages(err, generalListMessages);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  replaceOptions();
});

function replaceOptions() {
  const selectElement = document.getElementById("selectSupplier");

  // Clear existing options
  selectElement.innerHTML = "";

  http.client
    .get("suppliers/all")
    .then((response) => {
      response.data.data.forEach((supplier) => {
        const newOption = document.createElement("option");
        newOption.value = supplier.supplierId;
        newOption.textContent = supplier.name;
        selectElement.appendChild(newOption);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
// create existing product 