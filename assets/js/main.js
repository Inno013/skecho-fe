function handleLogout() {
  sessionStorage.removeItem("user");
  document.location.href = rootPath + "/views/auth/login.html";
}
