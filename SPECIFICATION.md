# PixelWindow - 기능별 개발명세서

## 목차
1. [Phase 1: 기본 인프라](#phase-1-기본-인프라)
2. [Phase 2: 강아지 캐릭터 시스템](#phase-2-강아지-캐릭터-시스템)
3. [Phase 3: 먹이 및 상호작용](#phase-3-먹이-및-상호작용)
4. [Phase 4: 성장 및 상태 관리](#phase-4-성장-및-상태-관리)
5. [Phase 5: UI 및 마무리](#phase-5-ui-및-마무리)

---

## Phase 1: 기본 인프라

### 1.1 Electron 프로젝트 초기화
**목표**: Electron + TypeScript 기반 프로젝트 설정

**구현 내용**:
- `package.json` 설정
  - electron, typescript, webpack 의존성
  - 빌드 스크립트: `dev`, `build`, `start`
- `tsconfig.json` 설정
  - target: ES2020
  - module: commonjs
  - strict mode 활성화
- Webpack 설정
  - main process와 renderer process 분리 빌드
  - TypeScript loader
  - Dev server 설정

**완료 조건**:
- [x] `npm start`로 기본 Electron 앱 실행
- [x] TypeScript 컴파일 정상 동작
- [x] Hot reload 작동

---

### 1.2 투명 오버레이 윈도우 생성
**목표**: 전체 화면을 커버하는 투명한 윈도우

**파일**: `src/main/window-manager.ts`

**구현 내용**:
```typescript
const windowConfig = {
  width: screen.getPrimaryDisplay().workAreaSize.width,
  height: screen.getPrimaryDisplay().workAreaSize.height,
  transparent: true,        // 투명 배경
  frame: false,             // 프레임 제거
  alwaysOnTop: true,        // 항상 최상위
  skipTaskbar: true,        // 작업표시줄에서 숨김
  resizable: false,         // 크기 조절 불가
  movable: false,           // 이동 불가
  minimizable: false,       // 최소화 불가
  maximizable: false,       // 최대화 불가
  focusable: false,         // 포커스 받지 않음
  hasShadow: false,         // 그림자 제거
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
};
```

**멀티 모니터 지원**:
- 모든 디스플레이 감지
- 각 모니터별 윈도우 생성 옵션 (설정에서 선택)

**완료 조건**:
- [x] 투명한 윈도우가 전체 화면에 표시됨
- [x] 다른 창들 위에 항상 표시됨
- [x] 윈도우가 포커스를 가져가지 않음

---

### 1.3 선택적 클릭 통과
**목표**: 강아지 영역만 클릭 가능, 나머지는 통과

**파일**: `src/main/window-manager.ts`

**구현 내용**:
```typescript
// 기본적으로 모든 클릭 통과
mainWindow.setIgnoreMouseEvents(true, { forward: true });

// Renderer에서 강아지 영역 클릭 시
ipcMain.on('set-clickable-region', (event, { x, y, width, height }) => {
  // 해당 영역에 대해서만 클릭 가능하게 설정
  mainWindow.setIgnoreMouseEvents(false);
});

// 강아지 밖 클릭 시 다시 통과 모드
ipcMain.on('set-click-through', () => {
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
});
```

**Renderer에서 마우스 추적**:
```typescript
canvas.addEventListener('mousemove', (e) => {
  const isOverPet = checkMouseOverPet(e.clientX, e.clientY);

  if (isOverPet) {
    ipcRenderer.send('set-clickable-region', petBounds);
  } else {
    ipcRenderer.send('set-click-through');
  }
});
```

**완료 조건**:
- [x] 강아지 클릭 시 반응
- [x] 나머지 영역은 클릭이 아래 창으로 전달됨
- [x] 커서 모양이 강아지 위에서만 변경됨

---

### 1.4 시스템 트레이 구현
**목표**: 트레이 아이콘 및 메뉴

**파일**: `src/main/tray-manager.ts`

**구현 내용**:
```typescript
const tray = new Tray(trayIconPath);

const contextMenu = Menu.buildFromTemplate([
  {
    label: '강아지 보기',
    click: () => focusOnPet()
  },
  {
    label: '통계',
    click: () => showStats()
  },
  {
    label: '설정',
    click: () => openSettings()
  },
  { type: 'separator' },
  {
    label: '종료',
    click: () => app.quit()
  }
]);

tray.setContextMenu(contextMenu);
tray.setToolTip('PixelWindow - 강아지 키우기');
```

**트레이 아이콘 상태**:
- 일반 상태: 기본 아이콘
- 배고픔: 빨간색 점 표시
- 레벨업: 깜박이는 효과

**완료 조건**:
- [x] 트레이 아이콘 표시됨
- [x] 우클릭 시 메뉴 표시
- [x] 각 메뉴 항목 동작 확인
- [x] 트레이에서 종료 가능

---

## Phase 2: 강아지 캐릭터 시스템

### 2.1 픽셀 아트 스프라이트 제작
**목표**: 16x16 픽셀 강아지 스프라이트

**파일**: `src/assets/sprites/`

**필요한 스프라이트**:
1. **dog-idle.png** (4 프레임): 제자리에서 숨쉬기
2. **dog-walk.png** (4 프레임): 걷기 애니메이션
3. **dog-run.png** (4 프레임): 뛰기 애니메이션
4. **dog-sit.png** (2 프레임): 앉기
5. **dog-eat.png** (3 프레임): 먹기
6. **dog-sleep.png** (2 프레임): 자기
7. **dog-jump.png** (2 프레임): 점프

**성장 단계별 스프라이트**:
- Level 1 (0-100 exp): 작은 강아지
- Level 2 (101-300 exp): 중간 강아지
- Level 3 (301+ exp): 큰 강아지

**색상 팔레트**:
```
배경: 투명
외곽선: #2D2D2D (어두운 회색)
주색상: #F4A460 (갈색)
보조색: #FFFFFF (흰색)
강조색: #FFB6C1 (분홍 - 혀, 코)
```

**임시 대안**: 초기에는 간단한 도트로 대체 가능
```
  ■■
 ■OO■
■■■■■  <- 초간단 강아지
 ■  ■
```

**완료 조건**:
- [x] 모든 애니메이션 스프라이트 제작
- [x] PNG 포맷, 투명 배경
- [x] 3단계 성장 버전 완성

---

### 2.2 Pet 클래스 구현
**목표**: 강아지의 상태 및 행동 관리

**파일**: `src/renderer/game/pet.ts`

**클래스 구조**:
```typescript
class Pet {
  // 위치 및 물리
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  direction: 'left' | 'right';

  // 상태
  state: 'idle' | 'walking' | 'running' | 'eating' | 'sleeping' | 'sitting';
  hunger: number;        // 0-100
  happiness: number;     // 0-100
  energy: number;        // 0-100

  // 성장
  level: number;         // 1-3
  experience: number;

  // 애니메이션
  currentFrame: number;
  frameTimer: number;

  update(deltaTime: number): void {
    this.updatePhysics(deltaTime);
    this.updateAnimation(deltaTime);
    this.updateAI(deltaTime);
    this.updateStats(deltaTime);
  }

  private updateAI(deltaTime: number): void {
    // AI 로직: 랜덤 이동, 먹이 찾기 등
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 현재 상태에 맞는 스프라이트 렌더링
  }

  eat(food: Food): void {
    // 먹이 섭취
  }

  levelUp(): void {
    // 레벨업
  }
}
```

**완료 조건**:
- [x] Pet 클래스 구현
- [x] 모든 상태 변수 관리
- [x] update/render 메서드 동작

---

### 2.3 애니메이션 시스템
**목표**: 부드러운 스프라이트 애니메이션

**파일**: `src/renderer/rendering/animation.ts`

**구현 내용**:
```typescript
class Animation {
  frames: HTMLImageElement[];
  currentFrame: number = 0;
  frameDelay: number; // ms
  timer: number = 0;
  loop: boolean = true;

  update(deltaTime: number): void {
    this.timer += deltaTime;

    if (this.timer >= this.frameDelay) {
      this.currentFrame++;
      this.timer = 0;

      if (this.currentFrame >= this.frames.length) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = this.frames.length - 1;
        }
      }
    }
  }

  getCurrentFrame(): HTMLImageElement {
    return this.frames[this.currentFrame];
  }
}

class AnimationManager {
  animations: Map<string, Animation> = new Map();

  loadAnimation(name: string, spritePath: string, frameCount: number): void;
  playAnimation(name: string): void;
  stopAnimation(name: string): void;
}
```

**완료 조건**:
- [x] 애니메이션 시스템 구현
- [x] 상태 전환 시 애니메이션 전환 부드럽게
- [x] 60 FPS 목표로 최적화

---

### 2.4 이동 및 물리 시스템
**목표**: 화면 내에서 자연스러운 이동

**파일**: `src/renderer/game/physics.ts`

**구현 내용**:
```typescript
class PhysicsEngine {
  gravity: number = 0.5;
  friction: number = 0.8;

  update(pet: Pet, screenWidth: number, screenHeight: number): void {
    // 중력 적용
    pet.velocityY += this.gravity;

    // 속도 적용
    pet.x += pet.velocityX;
    pet.y += pet.velocityY;

    // 지면 충돌
    if (pet.y >= screenHeight - pet.height) {
      pet.y = screenHeight - pet.height;
      pet.velocityY = 0;
      pet.onGround = true;
    }

    // 벽 충돌
    if (pet.x <= 0) {
      pet.x = 0;
      pet.velocityX = 0;
      pet.direction = 'right';
    }
    if (pet.x >= screenWidth - pet.width) {
      pet.x = screenWidth - pet.width;
      pet.velocityX = 0;
      pet.direction = 'left';
    }

    // 마찰
    pet.velocityX *= this.friction;
  }

  jump(pet: Pet): void {
    if (pet.onGround) {
      pet.velocityY = -10;
      pet.onGround = false;
    }
  }
}
```

**AI 이동 패턴**:
1. **랜덤 워크**: 일정 시간마다 방향 전환
2. **목표 지향**: 먹이가 있으면 그쪽으로 이동
3. **경계 회피**: 화면 끝에서 자동으로 방향 전환
4. **휴식**: 가끔 멈춰서 앉거나 자기

**완료 조건**:
- [x] 중력 및 지면 충돌 동작
- [x] 좌우 이동 자연스러움
- [x] 화면 밖으로 나가지 않음
- [x] 점프 동작

---

## Phase 3: 먹이 및 상호작용

### 3.1 사용자 활동 감지
**목표**: 사용자의 PC 활동을 모니터링하여 먹이 생성 트리거

**파일**: `src/renderer/utils/activity-monitor.ts`

**감지 항목**:
1. **키보드 입력**: 일정 횟수 입력 시 (예: 100타)
2. **마우스 클릭**: 연속 클릭 (예: 50회)
3. **시간 기반**: 5분마다 자동
4. **랜덤 이벤트**: 불규칙하게

**구현 내용**:
```typescript
class ActivityMonitor {
  keyPressCount: number = 0;
  mouseClickCount: number = 0;
  lastFoodSpawn: number = Date.now();

  init(): void {
    window.addEventListener('keydown', () => this.onKeyPress());
    window.addEventListener('mousedown', () => this.onMouseClick());
  }

  onKeyPress(): void {
    this.keyPressCount++;

    if (this.keyPressCount >= 100) {
      this.spawnFood('bone');
      this.keyPressCount = 0;
    }
  }

  onMouseClick(): void {
    this.mouseClickCount++;

    if (this.mouseClickCount >= 50) {
      this.spawnFood('fish');
      this.mouseClickCount = 0;
    }
  }

  update(): void {
    const now = Date.now();
    const timeSinceLastFood = now - this.lastFoodSpawn;

    // 5분마다 자동 생성
    if (timeSinceLastFood >= 5 * 60 * 1000) {
      this.spawnRandomFood();
      this.lastFoodSpawn = now;
    }
  }

  private spawnFood(type: string): void {
    // 이벤트 발생
    EventBus.emit('spawn-food', { type });
  }
}
```

**주의사항**:
- 오버레이 윈도우가 포커스를 가져가지 않으므로, 실제로는 글로벌 이벤트를 감지할 수 없음
- **대안**: Main process에서 글로벌 단축키 등록 또는 시간 기반으로만 동작

**완료 조건**:
- [x] 시간 기반 먹이 생성 동작
- [x] 랜덤 먹이 생성
- [x] 먹이 생성 알림

---

### 3.2 먹이 시스템
**목표**: 다양한 종류의 먹이 구현

**파일**: `src/renderer/game/food.ts`

**먹이 종류**:
```typescript
interface FoodType {
  id: string;
  name: string;
  sprite: string;
  experience: number;    // 제공하는 경험치
  hunger: number;        // 배고픔 회복량
  happiness: number;     // 행복도 증가량
  spawnWeight: number;   // 등장 확률 가중치
}

const FOOD_TYPES: FoodType[] = [
  { id: 'bone', name: '뼈다귀', sprite: 'bone.png', experience: 10, hunger: 20, happiness: 10, spawnWeight: 10 },
  { id: 'fish', name: '생선', sprite: 'fish.png', experience: 15, hunger: 30, happiness: 15, spawnWeight: 8 },
  { id: 'meat', name: '고기', sprite: 'meat.png', experience: 20, hunger: 40, happiness: 20, spawnWeight: 5 },
  { id: 'treat', name: '간식', sprite: 'treat.png', experience: 5, hunger: 10, happiness: 30, spawnWeight: 15 },
  { id: 'special', name: '특별식', sprite: 'special.png', experience: 50, hunger: 100, happiness: 50, spawnWeight: 1 }
];
```

**Food 클래스**:
```typescript
class Food {
  x: number;
  y: number;
  type: FoodType;
  eaten: boolean = false;
  spawnTime: number;
  lifetime: number = 60000; // 1분 후 사라짐

  update(deltaTime: number): void {
    const now = Date.now();
    if (now - this.spawnTime > this.lifetime) {
      this.destroy();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 스프라이트 렌더링
  }

  checkCollision(pet: Pet): boolean {
    // 강아지와 충돌 감지
  }
}
```

**완료 조건**:
- [x] 5종류 먹이 구현
- [x] 랜덤 위치에 생성
- [x] 일정 시간 후 사라짐
- [x] 강아지가 먹으면 효과 적용

---

### 3.3 충돌 감지 및 먹이 섭취
**목표**: 강아지가 먹이에 닿으면 자동으로 섭취

**파일**: `src/renderer/game/collision.ts`

**구현 내용**:
```typescript
class CollisionDetector {
  checkPetFoodCollision(pet: Pet, food: Food): boolean {
    const dx = Math.abs(pet.x + pet.width / 2 - (food.x + food.width / 2));
    const dy = Math.abs(pet.y + pet.height / 2 - (food.y + food.height / 2));

    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (pet.width + food.width) / 2;

    return distance < minDistance;
  }
}

// GameEngine에서 사용
update(): void {
  foods.forEach(food => {
    if (collisionDetector.checkPetFoodCollision(pet, food)) {
      pet.eat(food);
      food.eaten = true;

      // 이펙트
      showEatEffect(food.x, food.y);
      playEatSound();
    }
  });

  // 먹은 먹이 제거
  foods = foods.filter(f => !f.eaten);
}
```

**먹이 섭취 애니메이션**:
1. 강아지가 먹이 쪽으로 향함
2. 먹기 애니메이션 재생
3. 먹이가 사라짐
4. 파티클 이펙트 (별, 하트 등)
5. 경험치 획득 표시 (+10 EXP)

**완료 조건**:
- [x] 충돌 감지 정상 동작
- [x] 먹이 섭취 시 애니메이션 재생
- [x] 경험치 및 스탯 업데이트
- [x] 시각적 피드백 (이펙트, 사운드)

---

## Phase 4: 성장 및 상태 관리

### 4.1 경험치 및 레벨 시스템
**목표**: 시간과 먹이로 강아지 성장

**파일**: `src/renderer/game/pet.ts`

**레벨 설계**:
```typescript
const LEVEL_REQUIREMENTS = [
  { level: 1, expRequired: 0, sprite: 'dog-small' },
  { level: 2, expRequired: 100, sprite: 'dog-medium' },
  { level: 3, expRequired: 300, sprite: 'dog-large' }
];

class Pet {
  gainExperience(amount: number): void {
    this.experience += amount;

    // 레벨업 체크
    const nextLevel = LEVEL_REQUIREMENTS.find(l => l.level === this.level + 1);
    if (nextLevel && this.experience >= nextLevel.expRequired) {
      this.levelUp();
    }
  }

  levelUp(): void {
    this.level++;
    this.sprite = getSpriteForLevel(this.level);

    // 레벨업 이펙트
    EventBus.emit('level-up', { level: this.level });

    // 트레이 알림
    ipcRenderer.send('show-notification', {
      title: '레벨 업!',
      body: `강아지가 레벨 ${this.level}이 되었습니다!`
    });
  }
}
```

**시간 기반 경험치**:
- 1분마다 1 EXP 자동 획득
- 플레이 시간이 누적될수록 자연스럽게 성장

**완료 조건**:
- [x] 경험치 획득 동작
- [x] 레벨업 시 외형 변경
- [x] 레벨업 알림 및 이펙트

---

### 4.2 상태 변수 관리
**목표**: 배고픔, 행복도, 에너지 관리

**파일**: `src/renderer/game/pet.ts`

**상태 시스템**:
```typescript
class Pet {
  hunger: number = 100;      // 100 = 배부름, 0 = 매우 배고픔
  happiness: number = 100;   // 100 = 매우 행복, 0 = 슬픔
  energy: number = 100;      // 100 = 활기참, 0 = 피곤함

  updateStats(deltaTime: number): void {
    const secondsPassed = deltaTime / 1000;

    // 시간에 따라 감소
    this.hunger -= secondsPassed * 0.01;  // 100초마다 1 감소
    this.energy -= secondsPassed * 0.005; // 200초마다 1 감소

    // 범위 제한
    this.hunger = Math.max(0, Math.min(100, this.hunger));
    this.happiness = Math.max(0, Math.min(100, this.happiness));
    this.energy = Math.max(0, Math.min(100, this.energy));

    // 상태에 따른 행동 변화
    this.updateBehaviorBasedOnStats();
  }

  updateBehaviorBasedOnStats(): void {
    if (this.energy < 20) {
      this.state = 'sleeping';
    } else if (this.hunger < 30) {
      this.state = 'sitting'; // 배고파서 기운 없음
      this.happiness -= 0.1;
    } else if (this.happiness > 80) {
      this.state = 'running'; // 행복해서 뛰어다님
    }
  }

  eat(food: Food): void {
    this.hunger = Math.min(100, this.hunger + food.type.hunger);
    this.happiness = Math.min(100, this.happiness + food.type.happiness);
    this.gainExperience(food.type.experience);

    this.state = 'eating';
  }
}
```

**완료 조건**:
- [x] 시간에 따라 상태 감소
- [x] 먹이로 상태 회복
- [x] 상태에 따른 행동 변화

---

### 4.3 게임 상태 저장/로드
**목표**: 게임을 종료해도 진행상황 유지

**파일**: `src/renderer/utils/save-manager.ts`

**저장 데이터 구조**:
```typescript
interface SaveData {
  version: string;
  savedAt: string;

  pet: {
    name: string;
    level: number;
    experience: number;
    hunger: number;
    happiness: number;
    energy: number;
    position: { x: number; y: number };
  };

  stats: {
    totalPlayTime: number;      // 초 단위
    foodEaten: {
      [foodId: string]: number;
    };
    totalExperience: number;
    sessions: number;           // 실행 횟수
  };

  settings: {
    volume: number;
    speed: number;
    autoSleep: boolean;
  };
}
```

**구현 내용**:
```typescript
class SaveManager {
  private savePath: string;

  async save(gameState: GameState): Promise<void> {
    const saveData: SaveData = this.serializeGameState(gameState);

    // Main process를 통해 파일 저장
    await ipcRenderer.invoke('save-game', saveData);
  }

  async load(): Promise<SaveData | null> {
    try {
      const data = await ipcRenderer.invoke('load-game');
      return data;
    } catch (error) {
      console.error('Failed to load save:', error);
      return null;
    }
  }

  async deleteSave(): Promise<void> {
    await ipcRenderer.invoke('delete-save');
  }
}

// Main process (src/main/ipc-handlers.ts)
ipcMain.handle('save-game', async (event, saveData) => {
  const savePath = path.join(app.getPath('userData'), 'save.json');
  await fs.promises.writeFile(savePath, JSON.stringify(saveData, null, 2));
});

ipcMain.handle('load-game', async () => {
  const savePath = path.join(app.getPath('userData'), 'save.json');
  const data = await fs.promises.readFile(savePath, 'utf-8');
  return JSON.parse(data);
});
```

**자동 저장**:
- 1분마다 자동 저장
- 앱 종료 시 자동 저장
- 레벨업 시 자동 저장

**완료 조건**:
- [x] 저장/로드 기능 동작
- [x] 앱 재실행 시 이전 상태 복원
- [x] 저장 파일 손상 시 예외 처리

---

## Phase 5: UI 및 마무리

### 5.1 인터랙션 메뉴
**목표**: 강아지 클릭 시 메뉴 표시

**파일**: `src/renderer/ui/menu.ts`

**메뉴 디자인**:
```
┌─────────────────┐
│   🐕 강아지 🐕   │
├─────────────────┤
│ ❤️ 90%  🍖 75%  │
│ ⚡ 60%  ⭐ Lv.2 │
├─────────────────┤
│  📊 통계 보기   │
│  ⚙️ 설정        │
│  ❌ 종료        │
└─────────────────┘
```

**구현 내용**:
```typescript
class Menu {
  visible: boolean = false;
  position: { x: number; y: number };

  show(x: number, y: number): void {
    this.visible = true;
    this.position = { x, y };
    this.render();
  }

  hide(): void {
    this.visible = false;
  }

  render(): void {
    const menuElement = document.getElementById('pet-menu');
    menuElement.style.left = `${this.position.x}px`;
    menuElement.style.top = `${this.position.y}px`;
    menuElement.classList.add('visible');

    // 상태 업데이트
    this.updateStats();
  }

  private updateStats(): void {
    document.getElementById('hunger-value').textContent = `${Math.floor(pet.hunger)}%`;
    document.getElementById('happiness-value').textContent = `${Math.floor(pet.happiness)}%`;
    document.getElementById('energy-value').textContent = `${Math.floor(pet.energy)}%`;
    document.getElementById('level-value').textContent = `Lv.${pet.level}`;
  }
}

// 강아지 클릭 이벤트
canvas.addEventListener('click', (e) => {
  if (isClickOnPet(e.clientX, e.clientY)) {
    menu.show(e.clientX, e.clientY);
  } else {
    menu.hide();
  }
});
```

**완료 조건**:
- [x] 강아지 클릭 시 메뉴 표시
- [x] 메뉴에서 통계/설정/종료 동작
- [x] 메뉴 바깥 클릭 시 닫힘

---

### 5.2 통계 화면
**목표**: 플레이 통계 표시

**파일**: `src/renderer/ui/stats.ts`

**표시 항목**:
```
═══════════════════════
       📊 통계
═══════════════════════

🐕 강아지 정보
  이름: 멍멍이
  레벨: 3
  경험치: 350 / 300

📈 플레이 통계
  총 플레이 시간: 5시간 23분
  실행 횟수: 12회
  총 경험치: 350

🍖 먹이 기록
  뼈다귀: 15개
  생선: 8개
  고기: 5개
  간식: 20개
  특별식: 1개

═══════════════════════
```

**완료 조건**:
- [x] 통계 화면 표시
- [x] 데이터 정확하게 표시
- [x] 닫기 버튼 동작

---

### 5.3 설정 화면
**목표**: 게임 설정 변경

**파일**: `src/renderer/ui/settings.ts`

**설정 항목**:
```typescript
interface Settings {
  volume: number;           // 0-100
  petSpeed: number;         // 0.5-2.0
  foodSpawnRate: number;    // 1-10분
  autoSleep: boolean;       // 밤에 자동으로 자기
  startWithWindows: boolean;// 윈도우 시작 시 자동 실행
}
```

**UI**:
```
═══════════════════════
       ⚙️ 설정
═══════════════════════

🔊 사운드 볼륨
  [==============|  ] 70%

🏃 이동 속도
  [========|        ] 1.0x

🍖 먹이 생성 주기
  [=====|           ] 5분

☑️ 밤에 자동으로 자기
☑️ 윈도우 시작 시 자동 실행

[저장]  [취소]
═══════════════════════
```

**완료 조건**:
- [x] 설정 변경 동작
- [x] 설정 저장 및 로드
- [x] 자동 실행 등록

---

### 5.4 윈도우 시작 프로그램 등록
**목표**: 부팅 시 자동 실행

**파일**: `src/main/index.ts`

**구현 내용**:
```typescript
app.setLoginItemSettings({
  openAtLogin: settings.startWithWindows,
  path: app.getPath('exe')
});
```

**완료 조건**:
- [x] 설정에서 자동 실행 토글
- [x] 부팅 시 자동 실행 확인

---

### 5.5 빌드 및 배포
**목표**: Windows 실행 파일 생성

**파일**: `package.json`

**Electron Builder 설정**:
```json
{
  "build": {
    "appId": "com.pixelwindow.app",
    "productName": "PixelWindow",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "src/assets/icons/app-icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

**빌드 명령**:
```bash
npm run build        # 프로덕션 빌드
npm run dist         # 설치 파일 생성
```

**완료 조건**:
- [x] exe 파일 생성
- [x] 설치 프로그램 동작
- [x] 배포 가능한 상태

---

## 추가 기능 (선택사항)

### A. 사운드 효과
- 먹이 먹을 때: 냠냠 소리
- 레벨업: 팡파레
- 클릭: 멍멍 소리

### B. 파티클 이펙트
- 레벨업: 별 반짝임
- 먹이 섭취: 하트 파티클
- 행복할 때: 음표 표시

### C. 다중 애완동물
- 여러 마리 동시 키우기
- 강아지끼리 상호작용

### D. 스킨 시스템
- 다양한 색상
- 액세서리 (모자, 목걸이)

### E. 미니 게임
- 공놀이
- 숨바꼭질

---

## 테스트 계획

### 단위 테스트
- [ ] Pet 클래스 메서드
- [ ] Physics 계산
- [ ] Collision 감지
- [ ] SaveManager

### 통합 테스트
- [ ] 게임 루프 전체 흐름
- [ ] IPC 통신
- [ ] 파일 저장/로드

### 수동 테스트
- [ ] 장시간 실행 (메모리 누수 확인)
- [ ] 다양한 해상도에서 테스트
- [ ] 멀티 모니터 환경

---

## 성능 목표
- FPS: 60
- 메모리 사용량: < 100MB
- CPU 사용률: < 5% (idle 시)
- 시작 시간: < 3초
