// Renderer process 진입점

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

console.log('PixelWindow Renderer Started');

// Canvas 설정
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Canvas 크기를 화면 크기에 맞춤
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 디버그 정보 업데이트
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function updateDebugInfo(): void {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;

    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
      fpsElement.textContent = fps.toString();
    }
  }
}

// 테스트용 강아지 위치
let petX = canvas.width / 2;
let petY = canvas.height - 100;
let petVelocityX = 2;

// 메인 게임 루프
function gameLoop(): void {
  // 화면 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 테스트: 간단한 강아지 렌더링 (사각형)
  ctx.fillStyle = '#F4A460';
  ctx.fillRect(petX - 16, petY - 16, 32, 32);

  // 눈
  ctx.fillStyle = '#000';
  ctx.fillRect(petX - 8, petY - 8, 4, 4);
  ctx.fillRect(petX + 4, petY - 8, 4, 4);

  // 코
  ctx.fillStyle = '#FFB6C1';
  ctx.fillRect(petX - 2, petY, 4, 4);

  // 테스트: 좌우 이동
  petX += petVelocityX;
  if (petX <= 50 || petX >= canvas.width - 50) {
    petVelocityX *= -1;
  }

  // 디버그 정보 업데이트
  document.getElementById('petX')!.textContent = Math.floor(petX).toString();
  document.getElementById('petY')!.textContent = Math.floor(petY).toString();
  updateDebugInfo();

  requestAnimationFrame(gameLoop);
}

// 메뉴 관련
const menu = document.getElementById('menu')!;
const closeMenuBtn = document.getElementById('closeMenuBtn')!;
const quitBtn = document.getElementById('quitBtn')!;
const statsBtn = document.getElementById('statsBtn')!;
const settingsBtn = document.getElementById('settingsBtn')!;

// 캔버스 클릭 이벤트
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // 강아지 영역 클릭 체크 (간단한 사각형 충돌)
  const distX = Math.abs(clickX - petX);
  const distY = Math.abs(clickY - petY);

  if (distX < 16 && distY < 16) {
    // 메뉴 토글
    if (menu.classList.contains('visible')) {
      menu.classList.remove('visible');
    } else {
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.classList.add('visible');

      // 테스트 데이터 표시
      document.getElementById('happiness')!.textContent = '100%';
      document.getElementById('hunger')!.textContent = '85%';
      document.getElementById('energy')!.textContent = '70%';
      document.getElementById('level')!.textContent = '1';
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

quitBtn.addEventListener('click', () => {
  if (confirm('정말 종료하시겠습니까?')) {
    window.api.quitApp();
  }
});

statsBtn.addEventListener('click', () => {
  alert('통계 화면 (구현 예정)');
});

settingsBtn.addEventListener('click', () => {
  alert('설정 화면 (구현 예정)');
});

// 게임 시작
console.log('Starting game loop...');
gameLoop();

// 시작 알림
setTimeout(() => {
  window.api.showNotification('PixelWindow', '강아지 키우기 게임이 시작되었습니다! 🐕');
}, 1000);
