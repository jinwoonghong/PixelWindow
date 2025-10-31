import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  createMainWindow(): void {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    this.mainWindow = new BrowserWindow({
      width,
      height,
      x: 0,
      y: 0,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      focusable: false,
      hasShadow: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    // HTML 로드
    this.mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

    // 개발 모드에서 DevTools 열기
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    // 윈도우가 닫혔을 때
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    console.log('Main window created');
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  setIgnoreMouseEvents(ignore: boolean, options?: { forward: boolean }): void {
    if (this.mainWindow) {
      this.mainWindow.setIgnoreMouseEvents(ignore, options);
    }
  }

  focusWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  destroy(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
      this.mainWindow = null;
    }
  }
}
