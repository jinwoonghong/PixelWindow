import { ipcMain, app, Notification } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { SaveData } from '../shared/types';
import { WindowManager } from './window-manager';

export function setupIpcHandlers(windowManager: WindowManager): void {
  ipcMain.handle(IPC_CHANNELS.SAVE_GAME, async (event, saveData: SaveData) => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      await fs.writeFile(savePath, JSON.stringify(saveData, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      console.error('Failed to save game:', error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.LOAD_GAME, async () => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      const data = await fs.readFile(savePath, 'utf-8');
      const saveData: SaveData = JSON.parse(data);
      return { success: true, data: saveData };
    } catch (error) {
      console.error('Failed to load game:', error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_SAVE, async () => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      await fs.unlink(savePath);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete save file:', error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.on(IPC_CHANNELS.SHOW_NOTIFICATION, (event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });

  ipcMain.on(IPC_CHANNELS.QUIT_APP, () => {
    app.quit();
  });

  ipcMain.on(IPC_CHANNELS.SET_CLICKABLE, () => {
    windowManager.setIgnoreMouseEvents(false);
  });

  ipcMain.on(IPC_CHANNELS.SET_CLICK_THROUGH, () => {
    windowManager.setIgnoreMouseEvents(true, { forward: true });
  });
}
