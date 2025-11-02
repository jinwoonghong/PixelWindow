import { LEVEL_REQUIREMENTS, ACCESSORIES } from '../../shared/constants';
import { PetState, Accessory } from '../../shared/types';

export type PetAnimationState = 'idle' | 'walking' | 'running' | 'eating' | 'sleeping' | 'sitting' | 'jumping';

export class Pet {
  // 위치 및 물리
  x: number;
  y: number;
  velocityX: number = 0;
  velocityY: number = 0;
  direction: 'left' | 'right' = 'right';
  onGround: boolean = false;

  // 크기
  width: number = 64;
  height: number = 64;

  // 상태
  state: PetAnimationState = 'idle';
  hunger: number = 100;
  happiness: number = 100;
  energy: number = 100;

  // 성장
  level: number = 1;
  experience: number = 0;

  // 액세서리
  equippedAccessories: string[] = [];

  // 애니메이션
  currentFrame: number = 0;
  frameTimer: number = 0;
  frameDelay: number = 200; // ms (애니메이션 속도 느리게)
  maxFrames: number = 5; // 스프라이트 시트의 열 개수

  // AI
  aiTimer: number = 0;
  aiDelay: number = 3000; // ms (행동 변경 주기)
  targetX: number = 0;
  targetY: number = 0;

  // 스프라이트 이미지
  private spriteImage: HTMLImageElement | null = null;
  private spriteLoaded: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.loadSprite();
  }

  private loadSprite(): void {
    const levelKey = `level${this.level}`;
    const img = new Image();
    img.onload = () => {
      this.spriteImage = img;
      this.spriteLoaded = true;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Pet sprite ${levelKey} loaded`);
      }
    };
    img.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to load sprite for ${levelKey}, using pixel art fallback`);
      }
      this.spriteLoaded = false;
    };
    img.src = `assets/sprites/dog/dog_${levelKey}.png`;
  }

  update(deltaTime: number, screenWidth: number, screenHeight: number): void {
    this.updatePhysics(screenWidth, screenHeight);
    this.updateAnimation(deltaTime);
    this.updateAI(deltaTime, screenWidth, screenHeight);
    this.updateStats(deltaTime);
  }

  private updatePhysics(screenWidth: number, screenHeight: number): void {
    // 속도 적용
    this.x += this.velocityX;
    this.y += this.velocityY;

    // X축 경계 - 경계에 닿으면 즉시 새 목표 설정
    let hitBoundary = false;
    if (this.x <= 0) {
      this.x = 0;
      this.direction = 'right';
      hitBoundary = true;
    }
    if (this.x >= screenWidth - this.width) {
      this.x = screenWidth - this.width;
      this.direction = 'left';
      hitBoundary = true;
    }

    // Y축 경계
    if (this.y <= 0) {
      this.y = 0;
      hitBoundary = true;
    }
    if (this.y >= screenHeight - this.height) {
      this.y = screenHeight - this.height;
      hitBoundary = true;
    }

    // 경계에 닿으면 즉시 새 행동 선택
    if (hitBoundary) {
      this.aiTimer = this.aiDelay;
    }

    this.onGround = false;
  }

  private updateAnimation(deltaTime: number): void {
    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.maxFrames;
      this.frameTimer = 0;
    }
  }

  private updateAI(deltaTime: number, screenWidth: number, screenHeight: number): void {
    // 에너지나 배고픔이 낮으면 가만히 있음
    if (this.energy < 20) {
      this.state = 'sleeping';
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }

    if (this.hunger < 30) {
      this.state = 'sitting';
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }

    this.aiTimer += deltaTime;

    if (this.aiTimer >= this.aiDelay) {
      this.aiTimer = 0;

      // 랜덤 행동 선택
      const rand = Math.random();

      if (rand < 0.7) {
        // 70%: 좌우로 걷기 (방치형 게임 - 주로 화면 하단)
        this.targetX = Math.random() * (screenWidth - this.width);

        // 대부분 화면 하단에 머무름 (하단 영역)
        if (Math.random() < 0.8) {
          // 80% 확률로 하단 영역
          this.targetY = screenHeight - 150 - Math.random() * 100;
        } else {
          // 20% 확률로 중간 정도까지 올라감
          this.targetY = screenHeight * 0.5 + Math.random() * (screenHeight * 0.3);
        }

        this.state = 'walking';
        // 항상 로그 출력 (임시 디버깅)
        console.log(`[AI] New target: (${Math.floor(this.targetX)}, ${Math.floor(this.targetY)}), Current: (${Math.floor(this.x)}, ${Math.floor(this.y)}), Screen: ${screenWidth}x${screenHeight}`);
      } else if (rand < 0.85) {
        // 15%: 앉기
        this.state = 'sitting';
        this.velocityX = 0;
        this.velocityY = 0;
        console.log(`[AI] Sitting`);
      } else {
        // 15%: 가만히 서있기
        this.state = 'idle';
        this.velocityX = 0;
        this.velocityY = 0;
        console.log(`[AI] Idle`);
      }
    }

    // 목표 위치로 이동 (주로 X축, Y축은 매우 느리게)
    if (this.state === 'walking' || this.state === 'running') {
      const distX = this.targetX - this.x;
      const distY = this.targetY - this.y;
      const totalDist = Math.sqrt(distX * distX + distY * distY);

      if (totalDist > 20) {
        // X축은 정상 속도, Y축은 매우 느리게 (부드러운 이동)
        const baseSpeed = 3; // 속도 더 증가
        this.velocityX = (distX / totalDist) * baseSpeed;
        this.velocityY = (distY / totalDist) * baseSpeed * 0.2; // Y축은 20% 속도
        this.direction = distX > 0 ? 'right' : 'left';

        // 항상 로그 출력 (임시 디버깅)
        if (Math.random() < 0.01) {
          console.log(`[MOVE] velocity=(${this.velocityX.toFixed(2)}, ${this.velocityY.toFixed(2)}), pos=(${Math.floor(this.x)}, ${Math.floor(this.y)}), dist=${Math.floor(totalDist)}`);
        }
      } else {
        // 목표 도착 - 새로운 목표 설정
        console.log(`[MOVE] Reached target, selecting new target`);
        this.aiTimer = this.aiDelay; // 즉시 새 행동 선택
      }
    }
  }

  private updateStats(deltaTime: number): void {
    const secondsPassed = deltaTime / 1000;

    // 시간에 따라 감소
    this.hunger = Math.max(0, this.hunger - secondsPassed * 0.5);
    this.energy = Math.max(0, this.energy - secondsPassed * 0.3);

    // 행복도는 배고픔과 에너지에 영향받음
    if (this.hunger < 30 || this.energy < 20) {
      this.happiness = Math.max(0, this.happiness - secondsPassed * 0.5);
    } else {
      this.happiness = Math.min(100, this.happiness + secondsPassed * 0.1);
    }

    // 시간 기반 경험치 (1초당 0.01 경험치)
    this.gainExperience(secondsPassed * 0.01);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // 좌우 반전
    if (this.direction === 'left') {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x, this.y);
    }

    // 상태에 따른 렌더링
    this.renderPet(ctx);

    ctx.restore();

    // 디버그: 경계 박스 (개발 모드에서만)
    if (process.env.NODE_ENV === 'development') {
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  private renderPet(ctx: CanvasRenderingContext2D): void {
    const size = this.width;
    const frame = Math.floor(this.currentFrame);

    // 스프라이트 이미지가 로드되어 있으면 사용
    if (this.spriteLoaded && this.spriteImage) {
      this.renderFromSpriteSheet(ctx, size, frame);
    } else {
      // 폴백: 픽셀 아트 렌더링
      switch (this.state) {
        case 'idle':
          this.renderIdle(ctx, size, frame);
          break;
        case 'walking':
        case 'running':
          this.renderWalking(ctx, size, frame);
          break;
        case 'sitting':
          this.renderSitting(ctx, size);
          break;
        case 'sleeping':
          this.renderSleeping(ctx, size, frame);
          break;
        case 'eating':
          this.renderEating(ctx, size, frame);
          break;
        case 'jumping':
          this.renderJumping(ctx, size);
          break;
        default:
          this.renderIdle(ctx, size, frame);
      }
    }

    // 액세서리 렌더링
    this.renderAccessories(ctx, size, 1);
  }

  private renderFromSpriteSheet(ctx: CanvasRenderingContext2D, size: number, frame: number): void {
    if (!this.spriteImage) return;

    // 스프라이트 시트 구조: 5열 × 4행
    // 원본 이미지 크기: 1024 × 1024
    const imageWidth = this.spriteImage.width;  // 1024
    const imageHeight = this.spriteImage.height; // 1024
    const cols = 5;
    const rows = 4;

    // 각 셀의 실제 크기
    const cellWidth = imageWidth / cols;   // 204.8
    const cellHeight = imageHeight / rows; // 256

    // 상태에 따른 행 결정 (이미지 구조에 맞춤)
    const stateRowMap: Record<PetAnimationState, number> = {
      'idle': 0,        // 1행: 서있기
      'walking': 1,     // 2행: 걷기
      'running': 1,     // 2행: 걷기 (running도 walking 사용)
      'eating': 2,      // 3행: 먹기
      'sitting': 3,     // 4행: 앉기
      'sleeping': 3,    // 4행: 앉기 (sleeping도 sitting 사용)
      'jumping': 1      // 2행: 걷기
    };

    const row = stateRowMap[this.state] || 0;
    const col = frame % cols;

    // 스프라이트 시트에서 해당 프레임 추출하여 확대해서 그리기
    ctx.drawImage(
      this.spriteImage,
      col * cellWidth, row * cellHeight,      // source x, y
      cellWidth, cellHeight,                  // source width, height
      0, 0,                                   // dest x, y
      size, size                              // dest width, height (확대)
    );
  }

  private renderAccessories(ctx: CanvasRenderingContext2D, size: number, scale: number): void {
    const equippedAccessories = this.getEquippedAccessories();

    for (const accessory of equippedAccessories) {
      const offsetX = accessory.renderOffset.x;
      const offsetY = accessory.renderOffset.y;

      ctx.save();

      switch (accessory.type) {
        case 'hat':
          this.renderHat(ctx, offsetX, offsetY, accessory.id);
          break;
        case 'necklace':
          this.renderNecklace(ctx, offsetX, offsetY, accessory.id);
          break;
        case 'glasses':
          this.renderGlasses(ctx, offsetX, offsetY, accessory.id);
          break;
        case 'ribbon':
          this.renderRibbon(ctx, offsetX, offsetY, accessory.id);
          break;
        case 'scarf':
          this.renderScarf(ctx, offsetX, offsetY, accessory.id);
          break;
        case 'bow':
          this.renderBow(ctx, offsetX, offsetY, accessory.id);
          break;
      }

      ctx.restore();
    }
  }

  private renderHat(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, hatId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (hatId === 'red_hat') {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(6, 0, 20, 2);
      ctx.fillRect(8, -4, 16, 4);
    } else if (hatId === 'blue_hat') {
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(6, 0, 20, 2);
      ctx.fillRect(8, -4, 16, 4);
    } else if (hatId === 'party_hat') {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(15, -6, 2, 2);
      ctx.fillRect(14, -4, 4, 2);
      ctx.fillRect(12, -2, 8, 2);
      ctx.fillRect(10, 0, 12, 2);
    }

    ctx.restore();
  }

  private renderNecklace(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, necklaceId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (necklaceId === 'simple_necklace') {
      ctx.fillStyle = '#888888';
      ctx.fillRect(10, 16, 12, 2);
    } else if (necklaceId === 'gold_necklace') {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(10, 16, 12, 2);
      // 펜던트
      ctx.fillRect(15, 18, 2, 2);
    }

    ctx.restore();
  }

  private renderGlasses(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, glassesId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (glassesId === 'sunglasses') {
      ctx.fillStyle = '#000000';
      // 왼쪽 렌즈
      ctx.fillRect(11, 8, 4, 3);
      // 오른쪽 렌즈
      ctx.fillRect(17, 8, 4, 3);
      // 다리
      ctx.fillRect(15, 8, 2, 1);
    } else if (glassesId === 'round_glasses') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      // 왼쪽 렌즈
      ctx.strokeRect(11, 8, 3, 3);
      // 오른쪽 렌즈
      ctx.strokeRect(18, 8, 3, 3);
      // 다리
      ctx.fillRect(14, 9, 4, 1);
    }

    ctx.restore();
  }

  private renderRibbon(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, ribbonId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (ribbonId === 'pink_ribbon') {
      ctx.fillStyle = '#FFB6C1';
      // 중앙
      ctx.fillRect(20, 0, 4, 4);
      // 왼쪽 날개
      ctx.fillRect(16, 1, 4, 2);
      // 오른쪽 날개
      ctx.fillRect(24, 1, 4, 2);
    } else if (ribbonId === 'red_ribbon') {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(20, 0, 4, 4);
      ctx.fillRect(16, 1, 4, 2);
      ctx.fillRect(24, 1, 4, 2);
    }

    ctx.restore();
  }

  private renderScarf(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scarfId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (scarfId === 'blue_scarf') {
      ctx.fillStyle = '#0000FF';
      // 가로
      ctx.fillRect(8, 17, 16, 3);
      // 세로 (왼쪽)
      ctx.fillRect(10, 20, 3, 4);
      // 세로 (오른쪽)
      ctx.fillRect(19, 20, 3, 4);
    } else if (scarfId === 'yellow_scarf') {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(8, 17, 16, 3);
      ctx.fillRect(10, 20, 3, 4);
      ctx.fillRect(19, 20, 3, 4);
    }

    ctx.restore();
  }

  private renderBow(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, bowId: string): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if (bowId === 'black_bow') {
      ctx.fillStyle = '#000000';
      // 왼쪽
      ctx.fillRect(10, 16, 4, 3);
      // 중앙
      ctx.fillRect(14, 16, 4, 3);
      // 오른쪽
      ctx.fillRect(18, 16, 4, 3);
    } else if (bowId === 'red_bow') {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(10, 16, 4, 3);
      ctx.fillRect(14, 16, 4, 3);
      ctx.fillRect(18, 16, 4, 3);
    }

    ctx.restore();
  }

  private renderIdle(ctx: CanvasRenderingContext2D, size: number, frame: number): void {
    // 몸통
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 8, 24, 16);

    // 머리
    ctx.fillRect(8, 4, 16, 12);

    // 귀
    ctx.fillRect(8, 0, 4, 4);
    ctx.fillRect(20, 0, 4, 4);

    // 다리
    ctx.fillRect(8, 24, 4, 8);
    ctx.fillRect(20, 24, 4, 8);

    // 꼬리 (흔들림)
    const tailOffset = frame % 2 === 0 ? 0 : 2;
    ctx.fillRect(26, 12 + tailOffset, 4, 8);

    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);

    // 코
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(15, 12, 2, 2);
  }

  private renderWalking(ctx: CanvasRenderingContext2D, size: number, frame: number): void {
    // 몸통
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 8, 24, 16);

    // 머리
    ctx.fillRect(8, 4, 16, 12);

    // 귀
    ctx.fillRect(8, 0, 4, 4);
    ctx.fillRect(20, 0, 4, 4);

    // 다리 (걷기 애니메이션)
    const legOffset = frame % 2 === 0 ? 0 : 2;
    ctx.fillRect(8, 24, 4, 8 - legOffset);
    ctx.fillRect(20, 24 + legOffset, 4, 8);

    // 꼬리 (빠르게 흔들림)
    const tailOffset = frame % 2 === 0 ? -2 : 2;
    ctx.fillRect(26, 12 + tailOffset, 4, 8);

    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);

    // 코
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(15, 12, 2, 2);
  }

  private renderSitting(ctx: CanvasRenderingContext2D, size: number): void {
    // 몸통 (더 낮게)
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 12, 24, 16);

    // 머리
    ctx.fillRect(8, 8, 16, 12);

    // 귀
    ctx.fillRect(8, 4, 4, 4);
    ctx.fillRect(20, 4, 4, 4);

    // 앞다리
    ctx.fillRect(8, 28, 4, 4);
    ctx.fillRect(20, 28, 4, 4);

    // 꼬리
    ctx.fillRect(26, 16, 4, 8);

    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 12, 2, 2);
    ctx.fillRect(18, 12, 2, 2);

    // 코
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(15, 16, 2, 2);
  }

  private renderSleeping(ctx: CanvasRenderingContext2D, size: number, frame: number): void {
    // 몸통 (누워있음)
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 16, 24, 12);

    // 머리
    ctx.fillRect(4, 12, 12, 12);

    // 귀
    ctx.fillRect(4, 8, 4, 4);
    ctx.fillRect(12, 8, 4, 4);

    // 다리
    ctx.fillRect(20, 24, 8, 4);

    // 꼬리
    ctx.fillRect(28, 18, 4, 6);

    // 눈 (감김)
    ctx.fillStyle = '#000';
    ctx.fillRect(8, 16, 4, 1);

    // ZZZ (프레임에 따라)
    if (frame < 2) {
      ctx.font = '8px monospace';
      ctx.fillText('Z', 20, 8);
      if (frame === 1) {
        ctx.fillText('Z', 24, 4);
      }
    }
  }

  private renderEating(ctx: CanvasRenderingContext2D, size: number, frame: number): void {
    // 몸통 (앞으로 숙임)
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 12, 24, 16);

    // 머리 (아래로)
    ctx.fillRect(8, 20, 16, 12);

    // 귀
    ctx.fillRect(8, 16, 4, 4);
    ctx.fillRect(20, 16, 4, 4);

    // 다리
    ctx.fillRect(8, 28, 4, 4);
    ctx.fillRect(20, 28, 4, 4);

    // 꼬리 (빠르게 흔들림 - 행복)
    const tailOffset = frame % 2 === 0 ? -4 : 4;
    ctx.fillRect(26, 16 + tailOffset, 4, 8);

    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 24, 2, 2);
    ctx.fillRect(18, 24, 2, 2);

    // 입 (먹는 중)
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(14, 28, 4, 2);
  }

  private renderJumping(ctx: CanvasRenderingContext2D, size: number): void {
    // 몸통 (뻗음)
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 8, 24, 16);

    // 머리
    ctx.fillRect(8, 4, 16, 12);

    // 귀
    ctx.fillRect(8, 0, 4, 4);
    ctx.fillRect(20, 0, 4, 4);

    // 다리 (모두 뻗음)
    ctx.fillRect(6, 24, 4, 6);
    ctx.fillRect(22, 24, 4, 6);

    // 꼬리 (위로)
    ctx.fillRect(26, 4, 4, 8);

    // 눈 (동그랗게)
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(18, 8, 2, 2);

    // 코
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(15, 12, 2, 2);
  }

  eat(foodType: { experience: number; hunger: number; happiness: number }): void {
    this.hunger = Math.min(100, this.hunger + foodType.hunger);
    this.happiness = Math.min(100, this.happiness + foodType.happiness);
    this.gainExperience(foodType.experience);

    this.state = 'eating';
    this.velocityX = 0;

    // 잠시 후 다시 idle 상태로
    setTimeout(() => {
      if (this.state === 'eating') {
        this.state = 'idle';
      }
    }, 1000);
  }

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

    const levelData = LEVEL_REQUIREMENTS.find(l => l.level === this.level);
    if (levelData) {
      this.width = levelData.size;
      this.height = levelData.size;
    }

    // 새로운 레벨의 스프라이트 로드
    this.loadSprite();

    // 알림
    if (typeof window !== 'undefined' && window.api) {
      window.api.showNotification(
        '레벨 업! 🎉',
        `강아지가 레벨 ${this.level}이 되었습니다!`
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Pet leveled up to ${this.level}!`);
    }
  }

  jump(): void {
    // 2D 평면 모드에서는 점프 기능 비활성화
  }

  // 액세서리 관련 메서드
  equipAccessory(accessoryId: string): boolean {
    const accessory = ACCESSORIES.find(a => a.id === accessoryId);
    if (!accessory) return false;

    // 같은 타입의 액세서리는 하나만 장착 가능
    this.equippedAccessories = this.equippedAccessories.filter(id => {
      const existing = ACCESSORIES.find(a => a.id === id);
      return existing?.type !== accessory.type;
    });

    this.equippedAccessories.push(accessoryId);
    return true;
  }

  unequipAccessory(accessoryId: string): void {
    this.equippedAccessories = this.equippedAccessories.filter(id => id !== accessoryId);
  }

  unequipAll(): void {
    this.equippedAccessories = [];
  }

  getEquippedAccessories(): Accessory[] {
    return this.equippedAccessories
      .map(id => ACCESSORIES.find(a => a.id === id))
      .filter(a => a !== undefined) as Accessory[];
  }

  getState(): PetState {
    return {
      x: this.x,
      y: this.y,
      level: this.level,
      experience: this.experience,
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy,
      equippedAccessories: [...this.equippedAccessories]
    };
  }

  setState(state: PetState): void {
    this.x = state.x;
    this.y = state.y;
    this.level = state.level;
    this.experience = state.experience;
    this.hunger = state.hunger;
    this.happiness = state.happiness;
    this.energy = state.energy;
    this.equippedAccessories = state.equippedAccessories || [];

    // 레벨에 따른 크기 조정
    const levelData = LEVEL_REQUIREMENTS.find(l => l.level === this.level);
    if (levelData) {
      this.width = levelData.size;
      this.height = levelData.size;
    }
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
