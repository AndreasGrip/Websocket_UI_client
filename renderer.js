const { ipcRenderer } = require('electron');

app.ipc.sendQuit = () => {
  ipcRenderer.send('quit', '');
};
app.ipc.sendSave = () => {
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
};
app.ipc.sendLoad = () => {
  ipcRenderer.send('load');
};
ipcRenderer.on('sendLoadReply', (event, arg) => {
  console.log(arg);
  app.activeInstance.commandlineImpretor.terminalAdd(arg, 'pagecontents_app-event');
});

ipcRenderer.on('app-event', (event, arg) => {
  console.log('sko');
  app.activeInstance.commandlineImpretor.terminalAdd(arg, 'pagecontents_app-event');
});

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg); // prints "pong"
});
