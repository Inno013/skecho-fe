const rootPath = require("electron-root-path").rootPath;
const http = require(rootPath + "/utils/http");

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username);

  http.client
    .post("/auth/login", {
      username,
      password,
    })
    .then((response) => {
      sessionStorage.setItem("user", JSON.stringify(response.data) );

      if (response.data.role == "ROLE_ADMIN") {
        document.location.href =
          rootPath + "/views/admin/supplier/supplier.html";
      } else {
        document.location.href = rootPath + "/views/kasir/KasirPage.html";
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
