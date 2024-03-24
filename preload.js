// Import the necessary Electron modules
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    'ipcRenderer', {
        // From render to main
        openDialog: () => {
            ipcRenderer.send('openDialog');
        },
        dialogResponse: (response) => {
            ipcRenderer.on('dialogResponse', response);
        }
    }
);