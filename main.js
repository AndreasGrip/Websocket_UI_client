const { dialog, ipcMain, app, BrowserWindow } = require('electron');
const fs = require('fs').promises;
const path = require('path')
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile("index.html");
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

ipcMain.on('quit', (event, arg) => {
  quitApp();
});

ipcMain.on('save', (event, arg) => {
  console.log('arg: ' + arg);
  fs.writeFile('.history', arg, 'utf8').then((data) => {
    console.log('.history file saved.');
    event.reply('app-event', '.history file saved.');
  });
});

ipcMain.on('load', (event, arg) => {
  fs.readFile('.history', 'utf8')
    .then((data) => {
      event.reply('sendLoadReply', data);
      console.log(data);
    })
    .catch((err) => {
      event.reply('app-event', 'failed to load file Error:' + err.message);
    });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    quitApp();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function quitApp() {
  // ipcMain.send('runCommand','save');
  mainWindow.webContents.send('runCommand', 'save');
  // Wait 0.5s to allow saving to finish.
  // TODO Fix so this actually await saving to finish.
  setTimeout(() => {
    app.quit();
  }, 500);
}
