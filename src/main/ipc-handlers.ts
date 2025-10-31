import { ipcMain, app, Notification } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import { SaveData } from '../shared/types';

export function setupIpcHandlers(): void {
  // 게임 저장
  ipcMain.handle(IPC_CHANNELS.SAVE_GAME, async (event, saveData: SaveData) => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      await fs.writeFile(savePath, JSON.stringify(saveData, null, 2), 'utf-8');
      console.log('Game saved successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to save game:', error);
      return { success: false, error: String(error) };
    }
  });

  // 게임 로드
  ipcMain.handle(IPC_CHANNELS.LOAD_GAME, async () => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      const data = await fs.readFile(savePath, 'utf-8');
      const saveData: SaveData = JSON.parse(data);
      console.log('Game loaded successfully');
      return { success: true, data: saveData };
    } catch (error) {
      console.error('Failed to load game:', error);
      return { success: false, error: String(error) };
    }
  });

  // 저장 파일 삭제
  ipcMain.handle(IPC_CHANNELS.DELETE_SAVE, async () => {
    try {
      const savePath = path.join(app.getPath('userData'), 'save.json');
      await fs.unlink(savePath);
      console.log('Save file deleted');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete save file:', error);
      return { success: false, error: String(error) };
    }
  });

  // 알림 표시
  ipcMain.on(IPC_CHANNELS.SHOW_NOTIFICATION, (event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({
        title,
        body
      }).show();
    }
  });

  // 앱 종료
  ipcMain.on(IPC_CHANNELS.QUIT_APP, () => {
    app.quit();
  });

  console.log('IPC handlers registered');
}
