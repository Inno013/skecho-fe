const http = require("./../utils/http");

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
      console.log(response.data);
      window.location.href = "./../views/admin/supplier/index.html";
    })
    .catch((err) => {
      console.error(err);
    });
});
