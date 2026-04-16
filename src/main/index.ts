import { app, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { TrayManager } from './tray-manager';
import { setupIpcHandlers } from './ipc-handlers';

let windowManager: WindowManager;
let trayManager: TrayManager;

function createApp(): void {
  windowManager = new WindowManager();
  windowManager.createMainWindow();
  setupIpcHandlers(windowManager);
  trayManager = new TrayManager(windowManager);
  trayManager.createTray();
}

app.whenReady().then(() => {
  createApp();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createApp();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (trayManager) {
    trayManager.destroy();
  }
});
