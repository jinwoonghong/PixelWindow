import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { WindowManager } from './window-manager';
import { TrayManager } from './tray-manager';
import { setupIpcHandlers } from './ipc-handlers';

let windowManager: WindowManager;
let trayManager: TrayManager;

function createApp(): void {
  // 윈도우 매니저 초기화
  windowManager = new WindowManager();
  windowManager.createMainWindow();

  // IPC 핸들러 설정 (WindowManager 전달)
  setupIpcHandlers(windowManager);

  // 트레이 매니저 초기화
  trayManager = new TrayManager(windowManager);
  trayManager.createTray();
}

// Electron 준비 완료
app.whenReady().then(() => {
  createApp();

  app.on('activate', () => {
    // macOS에서 독 아이콘 클릭 시 (Windows에서는 동작 안함)
    if (BrowserWindow.getAllWindows().length === 0) {
      createApp();
    }
  });
});

// 모든 윈도우가 닫혔을 때
app.on('window-all-closed', () => {
  // macOS가 아닌 경우 앱 종료
  // macOS에서는 명시적으로 Cmd+Q를 누를 때까지 앱이 활성 상태로 유지됨
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 앱 종료 전
app.on('before-quit', () => {
  // 정리 작업
  if (trayManager) {
    trayManager.destroy();
  }
});

// 개발 모드에서 핫 리로드 지원
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}
