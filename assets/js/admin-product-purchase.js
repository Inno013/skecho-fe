const crypto = require("crypto");
const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");
const createAlert = require(rootPath + "/utils/alert");
const helpers = require(rootPath + "/utils/helpers");

const tableBody = document.querySelector("#dataTable tbody");
const generalListMessages = document.getElementById("general-list-messages");

const listNewProducts = [];
const listExistingProducts = [];
const listOfProducts = [];

const purchaseTotalPrice = document.getElementById("purchase-total-price");
const purchaseTotalProduct = document.getElementById("purchase-total-product");
const purchaseRefund = document.getElementById("purchase-refund");

const placeModalCreateMessage = document.getElementById("modal-create-message");
const placeModalExistingMessage = document.getElementById("modal-existing-message");

// Create New Product List
const formCreate = document.getElementById("formNewProd");
formCreate.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
  }
});
formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const newProduct = {
    id: crypto.randomBytes(32).toString("hex"),
    barcode: document.getElementById("newProdBarcode").value,
    name: document.getElementById("newProdName").value,
    priceBuy: document.getElementById("newProdPriceBuy").value,
    priceSell: document.getElementById("newProdPriceSell").value,
    quantity: document.getElementById("newProdQuantity").value,
    profitSharing: document.getElementById("newProdPriceSharingAmount").value,
    profitSharedType: document.getElementById("newProdSharingType").value,
  };

  if (
    newProduct.barcode == "" ||
    newProduct.name == "" ||
    newProduct.priceBuy == "" ||
    newProduct.priceSell == "" ||
    newProduct.quantity == "" ||
    newProduct.profitSharedType == ""
  ) {
    placeModalCreateMessage.appendChild(
      createAlert("danger", "You must fill all the required fields")
    );

    setInterval(() => {
      placeModalCreateMessage.innerHTML = "";
    }, 2000);

    return;
  }

  // Clear input fields
  document.getElementById("newProdBarcode").value = "";
  document.getElementById("newProdName").value = "";
  document.getElementById("newProdPriceBuy").value = "";
  document.getElementById("newProdPriceSell").value = "";
  document.getElementById("newProdQuantity").value = "";
  document.getElementById("newProdSharingType").value = "";
  document.getElementById("newProdPriceSharingAmount").value = "";
  document
    .getElementById("newProdPriceSharingAmount")
    .removeAttribute("disabled");
  listNewProducts.push(newProduct);

  helpers.clearChieldElements(generalListMessages);
  generalListMessages.appendChild(
    createAlert("success", "Successfully added new Product")
  );
  addNewProductToTable(newProduct);
  setTimeout(function () {
    helpers.clearChieldElements(generalListMessages);
  }, 3000);

  purchaseTotalProduct.textContent =
    parseInt(purchaseTotalProduct.textContent) + 1;
  let calculate =
    helpers.convertIDRtoInt(purchaseTotalPrice.textContent) +
    newProduct.priceBuy * newProduct.quantity;
  purchaseTotalPrice.textContent = helpers.convertToIDR(calculate);
});

function addNewProductToTable(product) {
  const sampleRow = document.getElementById("sample-row");
  const newRow = sampleRow.cloneNode(true);

  newRow.classList.remove("d-none");
  newRow.querySelector(".barcode").textContent = product.barcode;
  newRow.querySelector(".name-product").textContent = product.name;
  newRow.querySelector(".price-buy").textContent = product.priceBuy;
  newRow.querySelector(".profit-sharing-amount").textContent =
    product.profitSharing;
  newRow.querySelector(".profit-sharing-type").textContent =
    product.profitSharedType;
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

function addExistingProductToTable(product) {
  const sampleRow = document.getElementById("sample-row");
  const newRow = sampleRow.cloneNode(true);

  const detailProduct = listOfProducts.find(
    (p) => p.productId == product.productId
  );

  newRow.classList.remove("d-none");
  newRow.querySelector(".barcode").textContent = detailProduct?.barcode;
  newRow.querySelector(".name-product").textContent = detailProduct?.name;
  newRow.querySelector(".price-sell").textContent = product.priceSell;
  newRow.querySelector(".profit-sharing-amount").textContent =
    product.profitSharing;
  newRow.querySelector(".profit-sharing-type").textContent =
    product.profitSharedType;
  newRow.querySelector(".product-stock").textContent = product.quantity;
  // newRow
  //   .querySelector(".action button[data-edit-id]")
  //   .setAttribute("data-edit-id", product.id);
  newRow
    .querySelector(".action button[data-delete-id]")
    .setAttribute("data-delete-id", product.id);

  tableBody.appendChild(newRow);
  helpers.hideModal("existingProductModal");
}

// handle delete button
function handleDelete(e) {
  // const isConfirmed = confirm("Are you sure you want to delete?");
  // if (!isConfirmed) return;

  const productId = e.getAttribute("data-delete-id");
  document
    .getElementById("confirmDelete")
    .setAttribute("data-delete-id", productId);
}

document.getElementById("confirmDelete").addEventListener("click", function () {
  const productId = this.getAttribute("data-delete-id");
  console.log(productId);
  const indexNewProduct = listNewProducts.findIndex(
    (prod) => prod.id == productId
  );
  console.log("indexNewProduct: ", indexNewProduct);

  let product = listNewProducts[indexNewProduct];
  console.log("NewProduct: ", product);
  if (product) {
    purchaseTotalProduct.textContent =
      parseInt(purchaseTotalProduct.textContent) - 1;
    let calculate = helpers.convertIDRtoInt(purchaseTotalPrice.textContent);
    purchaseTotalPrice.textContent =
      helpers.convertToIDR(calculate) - product.priceBuy * product.quantity;
    listNewProducts.splice(indexNewProduct, 1);
  }

  const indexExistProduct = listExistingProducts.findIndex(
    (prod) => prod.id == productId
  );

  console.log("indexExistingProduct: ", indexExistProduct);

  product = listExistingProducts[indexExistProduct];
  console.log("ExistingProduct: ", product);
  if (product) {
    purchaseTotalProduct.textContent =
      parseInt(purchaseTotalProduct.textContent) - 1;
    let cal =
      helpers.convertIDRtoInt(purchaseTotalPrice.textContent) -
      product.priceBuy * product.quantity;

    purchaseTotalPrice.textContent = helpers.convertToIDR(cal);
    listExistingProducts.splice(indexExistProduct, 1);
  }

  helpers.clearChieldElements(generalListMessages);
  generalListMessages.appendChild(
    createAlert("success", "Successfully deleted product")
  );
  setTable();
  setTimeout(function () {
    helpers.clearChieldElements(generalListMessages);
  }, 3000);
});

function setTable() {
  helpers.clearChieldElements(tableBody);

  listNewProducts.forEach((product) => {
    addNewProductToTable(product);
  });
  listExistingProducts.forEach((product) => {
    addExistingProductToTable(product);
  });
}

function handleStorePurchase(e) {
  let amount = document.getElementById("colFormAmount").value;

  if (amount < helpers.convertIDRtoInt(purchaseTotalPrice.textContent)) {
    generalListMessages.appendChild(
      createAlert(
        "danger",
        "Amount should be higher or equals than total price"
      )
    );
    return;
  }

  http.client
    .post("/admin/purchases", {
      supplierId: document.getElementById("selectSupplier").value,
      amount: amount,
      newProducts: listNewProducts,
      existingProducts: listExistingProducts,
    })
    .then((response) => {
      window.location.href = "./Produk.html";
    })
    .catch((err) => {
      helpers.clearChieldElements(generalListMessages);
      helpers.showErrorMessages(err, generalListMessages);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  replaceSupplierOptions();
  replaceProductOptions();
});

function replaceSupplierOptions() {
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

function replaceProductOptions() {
  const selectElement = document.getElementById("existingSelectProduct");

  // Clear existing options
  selectElement.innerHTML = "";

  http.client
    .get("products/all")
    .then((response) => {
      response.data.data.forEach((product) => {
        const newOption = document.createElement("option");
        newOption.value = product.productId;
        newOption.textContent = product.name;
        selectElement.appendChild(newOption);
        listOfProducts.push(product);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function selectedProduct(e) {
  const product = listOfProducts.find(
    (product) => product.productId == e.value
  );
  document.getElementById("existingProdBarcode").value = product?.barcode ?? "";
}

// create existing product
const formEdit = document.getElementById("formexistingProd");
formCreate.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
  }
});
formEdit.addEventListener("submit", function (e) {
  e.preventDefault();

  const existingProduct = {
    id: crypto.randomBytes(32).toString("hex"),
    productId: document.getElementById("existingSelectProduct").value,
    priceBuy: document.getElementById("existingProdPriceBuy").value,
    priceSell: document.getElementById("existingProdPriceSell").value,
    quantity: document.getElementById("existingProdQuantity").value,
    profitSharing: document.getElementById("existingProdPriceSharingAmount")
      .value,
    profitSharedType: document.getElementById("existingProdSharingType").value,
  };

  if (
    existingProduct.productId == "" ||
    existingProduct.priceBuy == "" ||
    existingProduct.priceSell == "" ||
    existingProduct.quantity == "" ||
    existingProduct.profitSharedType == ""
  ) {
    placeModalExistingMessage.appendChild(
      createAlert("danger", "You must fill all the required fields")
    );

    setInterval(() => {
      placeModalExistingMessage.innerHTML = "";
    }, 2000);

    return;
  }

  // Clear input fields
  document.getElementById("existingProdPriceBuy").value = "";
  document.getElementById("existingProdPriceSell").value = "";
  document.getElementById("existingProdQuantity").value = "";
  document.getElementById("existingProdSharingType").value = "";
  document.getElementById("existingProdPriceSharingAmount").value = "";
  document
    .getElementById("existingProdPriceSharingAmount")
    .removeAttribute("disabled");

  listExistingProducts.push(existingProduct);

  helpers.clearChieldElements(generalListMessages);
  generalListMessages.appendChild(
    createAlert("success", "Successfully added existing Product")
  );
  addExistingProductToTable(existingProduct);
  setTimeout(function () {
    helpers.clearChieldElements(generalListMessages);
  }, 3000);

  purchaseTotalProduct.textContent =
    parseInt(purchaseTotalProduct.textContent) + 1;
  let cal =
    helpers.convertIDRtoInt(purchaseTotalPrice.textContent) +
    existingProduct.priceBuy * existingProduct.quantity;

  purchaseTotalPrice.textContent = helpers.convertToIDR(cal);
});

function calculateAmount(e) {
  let cal =
    parseInt(e.value) - helpers.convertIDRtoInt(purchaseTotalPrice.textContent);
  purchaseRefund.textContent = helpers.convertToIDR(cal);
}

function changedProfitSharingType(e) {
  const newProfitSharingValue = document.getElementById(
    "newProdPriceSharingAmount"
  );
  const existingProfitSharingValue = document.getElementById(
    "existingProdPriceSharingAmount"
  );

  if (e.value == "NONE") {
    newProfitSharingValue.setAttribute("disabled", true);
    newProfitSharingValue.value = 0;

    existingProfitSharingValue.setAttribute("disabled", true);
    existingProfitSharingValue.value = 0;
  } else {
    newProfitSharingValue.removeAttribute("disabled");

    existingProfitSharingValue.removeAttribute("disabled");
  }
}
