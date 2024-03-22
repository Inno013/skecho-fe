const { app, BrowserWindow, ipcMain, dialog } = require("electron");

console.log("Hello from Electron 👋");
const createWindow = () => {
  const win = new BrowserWindow({
    frame: true, // untuk menampilkan frame (seperti title, tombol clse, etc) default true
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true, //  nodeIntegration agar file index.html bisa berintegrasi dnegna nodeJS dan IPC
      contextIsolation: false,
      // preload: path.join(__dirname, "preload.js"), // script yg akan di exec sebelum aplikasi utama di exec
    },
  });
  // win.webContents.openDevTools(); // helper only for development
  win.loadFile("views/Rekap.html");

  win.on("close", function (e) {
    const choice = dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["OK", "Cancel"],
      title: "Confirmation",
      message: "Are you sure?",
    });
    if (choice === 1) {
      e.preventDefault(1);
    }
  });
};

// when app ready, then ..
app.whenReady().then(() => {
  createWindow();

  // If we also want our Mac OS can run this app, we should create window after active
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    // selain Mac OS perlu memanggil method quit untuk benar2 close
    // darwin == Mac OS
    if (process.platform != "darwin") {
      app.quit();
    }
  });
});
