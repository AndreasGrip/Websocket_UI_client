const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('main', {
  quit: () => {
    ipcRenderer.send('quit', '');
  },
  sendSave: () => {
    const app = document.app;
    let instances = [];
    for (let i = 0; i < app.instances.length; i++) {
      const element = app.instances[i];
      let instance = {};
      instance.id = element.id;
      instance.history = element.commandlineImpretor.history;
      instance.preHistory = element.commandlineImpretor.preHistory;
      instances.push(instance);
    }
    let objectToSave = JSON.stringify(instances);
    console.log(objectToSave);
    ipcRenderer.send('save', objectToSave);
  },
  sendLoad: () => {
    ipcRenderer.send('load');
  },
  sendLoadReply: () => {
    (callback) =>
      ipcRenderer.on(
        'update-counter',
        ipcRenderer.on('sendLoadReply', (event, arg) => {
          console.log(arg);
          app.activeInstance.commandlineImpretor.terminalAdd(arg, 'pagecontents_app-event');
          let loaded = JSON.parse(arg);
          for (let i = 0; i < app.instances.length; i++) {
            const element = app.instances[i];
            const match = loaded.filter((a) => a.id === element.id);
            loaded = loaded.filter((a) => a.id !== element.id);
            if (match) {
              element.commandlineImpretor.history = match[0].history ? match[0].history : [];
              element.commandlineImpretor.preHistory = match[0].preHistory ? match[0].preHistory : [];
            } else {
              element.commandlineImpretor.history = [];
              element.commandlineImpretor.preHistory = [];
            }
          }
        })
      );
  },
  runCommand: () => {
    ipcRenderer.on('runCommand', (event, arg) => {
      console.log(arg);
      app.activeInstance.commandlineImpretor.runCommand(arg);
    });
  },
  appEvent: () => {
    ipcRenderer.on('app-event', (event, arg) => {
      console.log('sko');
      app.activeInstance.commandlineImpretor.terminalAdd(arg, 'pagecontents_app-event');
    });
  },
  asynchronousReply: () => {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg); // prints "pong"
    });
  }
});
