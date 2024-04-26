const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const electronPrint = require("electron-print");
const PDFWindow = require("electron-pdf-window");
const { print } = require("pdf-to-printer");
const fs = require("fs");
const path = require("path");

console.log("Hello from Electron 👋");
const createWindow = () => {
  const win = new BrowserWindow({
    frame: true, // untuk menampilkan frame (seperti title, tombol clse, etc) default true
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true, //  nodeIntegration agar file index.html bisa berintegrasi dnegna nodeJS dan IPC
      contextIsolation: false,
      printToPDF: true,
      enableRemoteModule: true,
      // preload: path.join(__dirname, "preload.js"), // script yg akan di exec sebelum aplikasi utama di exec
    },
  });
  //win.webContents.openDevTools(); // helper only for development
  win.loadFile("views/auth/login.html");
  // win.on("close", function (e) {
  //   const choice = dialog.showMessageBoxSync(this, {
  //     type: "question",
  //     buttons: ["OK", "Cancel"],
  //     title: "Confirmation",
  //     message: "Are you sure?",
  //   });
  //   if (choice === 1) {
  //     e.preventDefault(1);
  //   }
  // });
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

  ipcMain.on("print", (event, arg) => {
    fs.writeFile(path.join("print.pdf"), Buffer.from(arg.data), () => {
      let options;
      if (arg.name == "kasir") {
        options = {
          printer: "Blueprint_M80 1.0.0",
          scale: "noscale",
          monochrome: true,
          silent: true,
        };
      } else {
        options = {
          printer: "EPSON LX-300+II ESC/P",
          scale: "fit",
          monochrome: true,
          paperSize: "statement",
          silent: true,
        };
      }
      print("print.pdf", options);
    });
  });

  ipcMain.on("openDialog", () => {
    dialog
      .showMessageBox(window, {
        type: "question",
        title: "Confirmation",
        message: "Are you sure?",
        buttons: ["Yes", "No"],
      }) // Dialog returns a promise so let's handle it correctly
      .then((result) => {
        // Bail if the user pressed "No" or escaped (ESC) from the dialog box
        if (result.response !== 0) {
          return;
        }

        // Testing.
        if (result.response === 0) {
          console.log('The "Yes" button was pressed (main process)');
        }

        // Reply to the render process
        window.webContents.send("dialogResponse", result.response);
      });
  });

  app.on("window-all-closed", () => {
    // selain Mac OS perlu memanggil method quit untuk benar2 close
    // darwin == Mac OS
    if (process.platform != "darwin") {
      app.quit();
    }
  });
});
