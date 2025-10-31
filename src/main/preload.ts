import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { SaveData } from '../shared/types';

// Renderer process에 노출할 API
const api = {
  // 게임 저장/로드
  saveGame: (data: SaveData) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_GAME, data),
  loadGame: () => ipcRenderer.invoke(IPC_CHANNELS.LOAD_GAME),
  deleteSave: () => ipcRenderer.invoke(IPC_CHANNELS.DELETE_SAVE),

  // 윈도우 제어
  setClickable: (bounds: { x: number; y: number; width: number; height: number }) =>
    ipcRenderer.send(IPC_CHANNELS.SET_CLICKABLE, bounds),
  setClickThrough: () =>
    ipcRenderer.send(IPC_CHANNELS.SET_CLICK_THROUGH),

  // 알림
  showNotification: (title: string, body: string) =>
    ipcRenderer.send(IPC_CHANNELS.SHOW_NOTIFICATION, { title, body }),

  // 앱 제어
  quitApp: () =>
    ipcRenderer.send(IPC_CHANNELS.QUIT_APP),
};

// window.api로 접근 가능하도록 노출
contextBridge.exposeInMainWorld('api', api);

// TypeScript를 위한 타입 선언
export type API = typeof api;
