import { Pet } from './pet';
import { Food } from './food';
import { CollisionDetector } from './collision';
import { SaveData, GameStats, GameSettings, Inventory } from '../../shared/types';
import { ACCESSORIES } from '../../shared/constants';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pet: Pet;
  private foods: Food[] = [];
  private collisionDetector: CollisionDetector;

  // 타이밍
  private lastTime: number = 0;
  private accumulatedTime: number = 0;

  // 게임 상태
  private running: boolean = false;
  private totalPlayTime: number = 0;
  private sessionStartTime: number = 0;

  // 통계
  private stats: GameStats = {
    totalPlayTime: 0,
    foodEaten: {},
    totalExperience: 0,
    sessions: 0
  };

  // 인벤토리
  private inventory: Inventory = {
    unlockedAccessories: []
  };

  // 설정
  private settings: GameSettings = {
    volume: 70,
    petSpeed: 1.0,
    foodSpawnRate: 5,
    autoSleep: true,
    startWithWindows: false
  };

  // 먹이 생성 타이머
  private foodSpawnTimer: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    // Canvas 크기 설정
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Pet 생성 (화면 중앙 하단)
    this.pet = new Pet(
      this.canvas.width / 2 - 32,
      this.canvas.height - 150
    );

    this.collisionDetector = new CollisionDetector();

    // 저장된 게임 로드
    this.loadGame();

    // 창 크기 변경 감지
    window.addEventListener('resize', () => this.onResize());
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.sessionStartTime = Date.now();
      this.stats.sessions++;
      this.lastTime = performance.now();
      this.gameLoop(this.lastTime);
      console.log('Game engine started');
    }
  }

  stop(): void {
    this.running = false;
    this.saveGame();
    console.log('Game engine stopped');
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += deltaTime;

    // 업데이트
    this.update(deltaTime);

    // 렌더링
    this.render();

    // 다음 프레임
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number): void {
    // 플레이 시간 누적
    this.totalPlayTime += deltaTime;

    // Pet 업데이트
    this.pet.update(deltaTime, this.canvas.width, this.canvas.height);

    // Food 업데이트
    this.foods.forEach(food => {
      food.update(deltaTime);
    });

    // 만료된 먹이 제거
    this.foods = this.foods.filter(food => !food.expired);

    // 충돌 감지
    this.checkCollisions();

    // 먹이 생성
    this.updateFoodSpawning(deltaTime);

    // 액세서리 해금 체크
    this.checkUnlocks();

    // 자동 저장 (1분마다)
    if (this.accumulatedTime >= 60000) {
      this.saveGame();
      this.accumulatedTime = 0;
    }
  }

  private render(): void {
    // 화면 클리어 (투명)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 먹이 렌더링
    this.foods.forEach(food => {
      food.render(this.ctx);
    });

    // Pet 렌더링
    this.pet.render(this.ctx);
  }

  private checkCollisions(): void {
    this.foods.forEach(food => {
      if (!food.eaten && this.collisionDetector.checkPetFoodCollision(this.pet, food)) {
        // 먹이 섭취
        this.pet.eat(food.type);
        food.eaten = true;

        // 통계 업데이트
        if (!this.stats.foodEaten[food.type.id]) {
          this.stats.foodEaten[food.type.id] = 0;
        }
        this.stats.foodEaten[food.type.id]++;

        console.log(`Pet ate ${food.type.name}! +${food.type.experience} EXP`);

        // 이펙트 (추후 구현)
        this.showEatEffect(food.x, food.y);
      }
    });

    // 먹은 먹이 제거
    this.foods = this.foods.filter(f => !f.eaten);
  }

  private showEatEffect(x: number, y: number): void {
    // TODO: 파티클 이펙트
    console.log(`Eat effect at (${x}, ${y})`);
  }

  private updateFoodSpawning(deltaTime: number): void {
    this.foodSpawnTimer += deltaTime;

    // 설정된 주기마다 먹이 생성 (분 단위를 밀리초로 변환)
    const spawnInterval = this.settings.foodSpawnRate * 60 * 1000;

    if (this.foodSpawnTimer >= spawnInterval) {
      this.spawnRandomFood();
      this.foodSpawnTimer = 0;
    }
  }

  spawnRandomFood(): void {
    const x = 50 + Math.random() * (this.canvas.width - 100);
    const y = 50 + Math.random() * (this.canvas.height - 100);

    const food = Food.createRandom(x, y);
    this.foods.push(food);

    console.log(`Spawned ${food.type.name} at (${x}, ${y})`);
  }

  spawnFood(foodId: string): void {
    const x = 50 + Math.random() * (this.canvas.width - 100);
    const y = 50 + Math.random() * (this.canvas.height - 100);

    const food = Food.createById(foodId, x, y);
    if (food) {
      this.foods.push(food);
      console.log(`Spawned ${food.type.name} at (${x}, ${y})`);
    }
  }

  getPet(): Pet {
    return this.pet;
  }

  getStats(): GameStats {
    // 현재 세션 플레이 시간 추가
    const currentSessionTime = Date.now() - this.sessionStartTime;
    return {
      ...this.stats,
      totalPlayTime: this.stats.totalPlayTime + currentSessionTime
    };
  }

  getSettings(): GameSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<GameSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveGame();
    console.log('Settings updated:', this.settings);
  }

  async saveGame(): Promise<void> {
    try {
      // 현재 세션 시간 추가
      const currentSessionTime = Date.now() - this.sessionStartTime;
      this.stats.totalPlayTime += currentSessionTime;
      this.sessionStartTime = Date.now();

      const saveData: SaveData = {
        version: '0.1.0',
        savedAt: new Date().toISOString(),
        pet: this.pet.getState(),
        stats: this.getStats(),
        settings: this.settings,
        inventory: this.inventory
      };

      await window.api.saveGame(saveData);
      console.log('Game saved successfully');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  async loadGame(): Promise<void> {
    try {
      const result = await window.api.loadGame();

      if (result.success && result.data) {
        const saveData: SaveData = result.data;

        // Pet 상태 복원
        this.pet.setState(saveData.pet);

        // 통계 복원
        this.stats = saveData.stats;

        // 설정 복원
        if (saveData.settings) {
          this.settings = saveData.settings;
        }

        // 인벤토리 복원
        if (saveData.inventory) {
          this.inventory = saveData.inventory;
        }

        console.log('Game loaded successfully');
        console.log(`Play time: ${Math.floor(this.stats.totalPlayTime / 1000 / 60)} minutes`);
      } else {
        console.log('No save file found, starting new game');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  }

  // 액세서리 관련 메서드
  getInventory(): Inventory {
    return { ...this.inventory };
  }

  private checkUnlocks(): void {
    ACCESSORIES.forEach(accessory => {
      // 이미 해금되었으면 스킵
      if (this.inventory.unlockedAccessories.includes(accessory.id)) {
        return;
      }

      let shouldUnlock = false;
      const req = accessory.unlockRequirement;

      switch (req.type) {
        case 'level':
          shouldUnlock = this.pet.level >= req.value;
          break;

        case 'experience':
          shouldUnlock = this.pet.experience >= req.value;
          break;

        case 'food':
          if (req.foodId) {
            const eaten = this.stats.foodEaten[req.foodId] || 0;
            shouldUnlock = eaten >= req.value;
          }
          break;

        case 'time':
          // 초 단위
          const playTimeSeconds = this.stats.totalPlayTime / 1000;
          shouldUnlock = playTimeSeconds >= req.value;
          break;
      }

      if (shouldUnlock) {
        this.unlockAccessory(accessory.id);
      }
    });
  }

  private unlockAccessory(accessoryId: string): void {
    if (!this.inventory.unlockedAccessories.includes(accessoryId)) {
      this.inventory.unlockedAccessories.push(accessoryId);

      const accessory = ACCESSORIES.find(a => a.id === accessoryId);
      if (accessory) {
        console.log(`🎉 새로운 액세서리 해금: ${accessory.name}!`);

        // 알림 표시
        if (typeof window !== 'undefined' && window.api) {
          window.api.showNotification(
            '새로운 액세서리 해금! 🎉',
            `${accessory.name}을(를) 획득했습니다!`
          );
        }
      }
    }
  }

  equipAccessory(accessoryId: string): boolean {
    // 해금되었는지 확인
    if (!this.inventory.unlockedAccessories.includes(accessoryId)) {
      return false;
    }

    return this.pet.equipAccessory(accessoryId);
  }

  unequipAccessory(accessoryId: string): void {
    this.pet.unequipAccessory(accessoryId);
  }

  private onResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log(`Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
  }

  // 테스트용 메서드
  testSpawnAllFoods(): void {
    const foodTypes = ['bone', 'fish', 'meat', 'treat', 'special'];
    foodTypes.forEach((foodId, i) => {
      const x = 100 + i * 100;
      const y = 100;
      this.spawnFood(foodId);
    });
  }

  testLevelUp(): void {
    this.pet.gainExperience(1000);
  }
}
