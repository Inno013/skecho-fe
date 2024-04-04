function handleLogout() {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("simpanSementara");
  document.location.href = rootPath + "/views/auth/login.html";
}
