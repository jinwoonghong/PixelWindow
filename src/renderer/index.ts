// Renderer process 진입점
import { GameEngine } from './game/game-engine';
import { CollisionDetector } from './game/collision';

// API 타입 정의
declare global {
  interface Window {
    api: {
      saveGame: (data: any) => Promise<any>;
      loadGame: () => Promise<any>;
      deleteSave: () => Promise<any>;
      setClickable: (bounds: { x: number; y: number; width: number; height: number }) => void;
      setClickThrough: () => void;
      showNotification: (title: string, body: string) => void;
      quitApp: () => void;
    };
  }
}

console.log('🐕 PixelWindow Starting...');

// Canvas 가져오기
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element not found');
}

// 게임 엔진 초기화
const gameEngine = new GameEngine(canvas);
const collisionDetector = new CollisionDetector();

// 디버그 정보 업데이트
let frameCount = 0;
let lastFpsUpdate = performance.now();
let fps = 0;

function updateDebugInfo(): void {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastFpsUpdate >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = currentTime;

    // FPS 업데이트
    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
      fpsElement.textContent = fps.toString();
    }

    // Pet 상태 업데이트
    const pet = gameEngine.getPet();
    const petXElement = document.getElementById('petX');
    const petYElement = document.getElementById('petY');
    const petStateElement = document.getElementById('petState');

    if (petXElement) petXElement.textContent = Math.floor(pet.x).toString();
    if (petYElement) petYElement.textContent = Math.floor(pet.y).toString();
    if (petStateElement) petStateElement.textContent = pet.state;
  }
}

// 디버그 업데이트 루프
setInterval(updateDebugInfo, 16);

// 메뉴 관련
const menu = document.getElementById('menu')!;
const closeMenuBtn = document.getElementById('closeMenuBtn')!;
const quitBtn = document.getElementById('quitBtn')!;
const statsBtn = document.getElementById('statsBtn')!;
const settingsBtn = document.getElementById('settingsBtn')!;

// 메뉴 업데이트 함수
function updateMenu(): void {
  const pet = gameEngine.getPet();

  document.getElementById('happiness')!.textContent = `${Math.floor(pet.happiness)}%`;
  document.getElementById('hunger')!.textContent = `${Math.floor(pet.hunger)}%`;
  document.getElementById('energy')!.textContent = `${Math.floor(pet.energy)}%`;
  document.getElementById('level')!.textContent = `${pet.level}`;
}

// 캔버스 클릭 이벤트
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const pet = gameEngine.getPet();
  const petBounds = pet.getBounds();

  // 강아지 클릭 체크
  if (collisionDetector.checkPointInRect(clickX, clickY, petBounds)) {
    // 메뉴 토글
    if (menu.classList.contains('visible')) {
      menu.classList.remove('visible');
    } else {
      // 메뉴 위치 조정 (화면 밖으로 나가지 않도록)
      let menuX = e.clientX;
      let menuY = e.clientY;

      const menuWidth = 200;
      const menuHeight = 250;

      if (menuX + menuWidth > window.innerWidth) {
        menuX = window.innerWidth - menuWidth - 10;
      }
      if (menuY + menuHeight > window.innerHeight) {
        menuY = window.innerHeight - menuHeight - 10;
      }

      menu.style.left = `${menuX}px`;
      menu.style.top = `${menuY}px`;
      menu.classList.add('visible');

      // 메뉴 정보 업데이트
      updateMenu();
    }
  } else {
    // 메뉴 밖 클릭 시 닫기
    menu.classList.remove('visible');
  }
});

// 메뉴 버튼 이벤트
closeMenuBtn.addEventListener('click', () => {
  menu.classList.remove('visible');
});

quitBtn.addEventListener('click', async () => {
  if (confirm('게임을 종료하시겠습니까? 현재 진행상황이 저장됩니다.')) {
    await gameEngine.saveGame();
    gameEngine.stop();
    window.api.quitApp();
  }
});

statsBtn.addEventListener('click', () => {
  const stats = gameEngine.getStats();
  const playTimeMinutes = Math.floor(stats.totalPlayTime / 1000 / 60);
  const playTimeHours = Math.floor(playTimeMinutes / 60);
  const remainingMinutes = playTimeMinutes % 60;

  const foodEatenStr = Object.entries(stats.foodEaten)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  alert(`📊 통계

🐕 강아지 정보
  레벨: ${gameEngine.getPet().level}
  경험치: ${Math.floor(gameEngine.getPet().experience)}

📈 플레이 통계
  총 플레이 시간: ${playTimeHours}시간 ${remainingMinutes}분
  실행 횟수: ${stats.sessions}회
  총 경험치: ${Math.floor(stats.totalExperience)}

🍖 먹은 먹이
${foodEatenStr || '  (아직 먹이를 먹지 않았습니다)'}
  `);
});

settingsBtn.addEventListener('click', () => {
  const settings = gameEngine.getSettings();

  const newSpawnRate = prompt(
    `먹이 생성 주기 (분 단위, 현재: ${settings.foodSpawnRate}분)`,
    settings.foodSpawnRate.toString()
  );

  if (newSpawnRate) {
    const rate = parseFloat(newSpawnRate);
    if (!isNaN(rate) && rate > 0) {
      gameEngine.updateSettings({ foodSpawnRate: rate });
      alert('설정이 저장되었습니다!');
    }
  }
});

// 키보드 단축키 (개발/테스트용)
window.addEventListener('keydown', (e) => {
  // Ctrl+Shift+D: 디버그 정보 토글
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
      debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Ctrl+Shift+F: 랜덤 먹이 생성
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    gameEngine.spawnRandomFood();
    console.log('Spawned random food (hotkey)');
  }

  // Ctrl+Shift+L: 레벨업 테스트
  if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    gameEngine.testLevelUp();
    console.log('Level up test (hotkey)');
  }

  // Ctrl+Shift+A: 모든 먹이 생성
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    gameEngine.testSpawnAllFoods();
    console.log('Spawned all food types (hotkey)');
  }
});

// 앱 종료 시 자동 저장
window.addEventListener('beforeunload', async (e) => {
  await gameEngine.saveGame();
});

// 게임 시작
console.log('🎮 Starting game engine...');
gameEngine.start();

// 시작 알림
setTimeout(() => {
  window.api.showNotification(
    'PixelWindow 🐕',
    '강아지 키우기 게임이 시작되었습니다!\n\n단축키:\nCtrl+Shift+F: 먹이 생성\nCtrl+Shift+D: 디버그 정보 토글'
  );
}, 1000);

// 첫 번째 먹이 생성 (10초 후)
setTimeout(() => {
  gameEngine.spawnRandomFood();
  console.log('Initial food spawned');
}, 10000);

console.log('✅ PixelWindow Ready!');
console.log('Controls:');
console.log('  - Click on pet to open menu');
console.log('  - Ctrl+Shift+F: Spawn food');
console.log('  - Ctrl+Shift+L: Level up test');
console.log('  - Ctrl+Shift+D: Toggle debug info');
