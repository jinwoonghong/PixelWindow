import { app, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import { WindowManager } from './window-manager';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  createTray(): void {
    // 트레이 아이콘 경로 (임시로 빈 아이콘 사용)
    const iconPath = this.createDefaultIcon();

    this.tray = new Tray(iconPath);
    this.tray.setToolTip('PixelWindow - 강아지 키우기');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '강아지 보기',
        click: () => this.windowManager.focusWindow()
      },
      {
        label: '통계',
        click: () => console.log('통계 보기 (구현 예정)')
      },
      {
        label: '설정',
        click: () => console.log('설정 열기 (구현 예정)')
      },
      { type: 'separator' },
      {
        label: '종료',
        click: () => app.quit()
      }
    ]);

    this.tray.setContextMenu(contextMenu);

    console.log('System tray created');
  }

  private createDefaultIcon(): nativeImage {
    // 임시 16x16 픽셀 아이콘 생성 (빨간 사각형)
    const size = 16;
    const canvas = Buffer.alloc(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        // RGBA
        canvas[idx] = 255;     // R
        canvas[idx + 1] = 100; // G
        canvas[idx + 2] = 100; // B
        canvas[idx + 3] = 255; // A
      }
    }

    return nativeImage.createFromBuffer(canvas, {
      width: size,
      height: size
    });
  }

  updateIcon(type: 'normal' | 'hungry' | 'levelup'): void {
    // TODO: 상태에 따른 아이콘 업데이트
    console.log(`Tray icon updated: ${type}`);
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
