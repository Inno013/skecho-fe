const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username);
  const alertList = document.getElementById("alert-list");

  http.client
    .post("/auth/login", {
      username,
      password,
    })
    .then((response) => {
      sessionStorage.setItem("user", JSON.stringify(response.data));

      if (response.data.role == "ROLE_ADMIN") {
        document.location.href = rootPath + "/views/admin/products/Produk.html";
      } else {
        document.location.href = rootPath + "/views/kasir/KasirPage.html";
      }
    })
    .catch((err) => {
      err = err.response.data;

      if (err.status >= 400 && err.status <= 422) {
        err.errors.forEach((error) => {
          const alertError = `
      <div class="alert">
        <span
          class="closebtn"
          onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
${error}
      </div>
      `;

          alertList.innerHTML = alertError;
        });
      } else {
        const alertError = `
      <div class="alert">
        <span
          class="closebtn"
          onclick="this.parentElement.style.display='none';"
          >&times;</span
        >
${err.message}
      </div>
      `;
        alertList.innerHTML = alertError;
      }
    });
});
