import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { SaveData } from '../shared/types';

const api = {
  saveGame: (data: SaveData) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_GAME, data),
  loadGame: () => ipcRenderer.invoke(IPC_CHANNELS.LOAD_GAME),
  deleteSave: () => ipcRenderer.invoke(IPC_CHANNELS.DELETE_SAVE),
  setClickable: () => ipcRenderer.send(IPC_CHANNELS.SET_CLICKABLE),
  setClickThrough: () => ipcRenderer.send(IPC_CHANNELS.SET_CLICK_THROUGH),
  showNotification: (title: string, body: string) =>
    ipcRenderer.send(IPC_CHANNELS.SHOW_NOTIFICATION, { title, body }),
  quitApp: () => ipcRenderer.send(IPC_CHANNELS.QUIT_APP),
};

contextBridge.exposeInMainWorld('api', api);

export type API = typeof api;
