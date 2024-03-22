document.addEventListener("DOMContentLoaded", function() {
    const dashboardBtn = document.getElementById("dashboardBtn");
    const produkBtn = document.getElementById("produkBtn");
    const tourBtn = document.getElementById("tourBtn");
    const supplierBtn = document.getElementById("supplierBtn");
    const cashierBtn = document.getElementById("cashierBtn");
    const recapBtn = document.getElementById("recapBtn");

    const content = document.querySelector(".content");

    dashboardBtn.addEventListener("click", function() {
        content.textContent = "Hello Dashboard";
    });

    produkBtn.addEventListener("click", function() {
        content.textContent = "Hello Produk";
    });

    tourBtn.addEventListener("click", function() {
        content.textContent = "Hello Tour";
    });

    supplierBtn.addEventListener("click", function() {
        content.textContent = "Hello Supplier";
    });

    cashierBtn.addEventListener("click", function() {
        content.textContent = "Hello Cashier";
    });

    recapBtn.addEventListener("click", function() {
        content.textContent = "Hello Recap";
    });
});
