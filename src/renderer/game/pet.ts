import { LEVEL_REQUIREMENTS } from '../../shared/constants';
import { PetState } from '../../shared/types';

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
  width: number = 32;
  height: number = 32;

  // 상태
  state: PetAnimationState = 'idle';
  hunger: number = 100;
  happiness: number = 100;
  energy: number = 100;

  // 성장
  level: number = 1;
  experience: number = 0;

  // 애니메이션
  currentFrame: number = 0;
  frameTimer: number = 0;
  frameDelay: number = 100; // ms

  // AI
  aiTimer: number = 0;
  aiDelay: number = 2000; // ms
  targetX: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
  }

  update(deltaTime: number, screenWidth: number, screenHeight: number): void {
    this.updatePhysics(screenWidth, screenHeight);
    this.updateAnimation(deltaTime);
    this.updateAI(deltaTime, screenWidth, screenHeight);
    this.updateStats(deltaTime);
  }

  private updatePhysics(screenWidth: number, screenHeight: number): void {
    // 중력 적용
    if (!this.onGround) {
      this.velocityY += 0.5;
    }

    // 속도 적용
    this.x += this.velocityX;
    this.y += this.velocityY;

    // 지면 충돌
    const groundY = screenHeight - this.height - 10;
    if (this.y >= groundY) {
      this.y = groundY;
      this.velocityY = 0;
      this.onGround = true;

      // 착지 시 상태 변경
      if (this.state === 'jumping') {
        this.state = 'idle';
      }
    } else {
      this.onGround = false;
    }

    // 벽 충돌
    if (this.x <= 0) {
      this.x = 0;
      this.velocityX = 0;
      this.direction = 'right';
    }
    if (this.x >= screenWidth - this.width) {
      this.x = screenWidth - this.width;
      this.velocityX = 0;
      this.direction = 'left';
    }

    // 마찰
    this.velocityX *= 0.8;

    // 거의 정지했으면 완전히 멈춤
    if (Math.abs(this.velocityX) < 0.1) {
      this.velocityX = 0;
      if (this.state === 'walking' || this.state === 'running') {
        this.state = 'idle';
      }
    }
  }

  private updateAnimation(deltaTime: number): void {
    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % 4;
      this.frameTimer = 0;
    }
  }

  private updateAI(deltaTime: number, screenWidth: number, screenHeight: number): void {
    // 에너지나 배고픔이 낮으면 가만히 있음
    if (this.energy < 20) {
      this.state = 'sleeping';
      return;
    }

    if (this.hunger < 30) {
      this.state = 'sitting';
      return;
    }

    this.aiTimer += deltaTime;

    if (this.aiTimer >= this.aiDelay) {
      this.aiTimer = 0;

      // 랜덤 행동 선택
      const rand = Math.random();

      if (rand < 0.3) {
        // 30%: 랜덤 위치로 이동
        this.targetX = Math.random() * (screenWidth - this.width);
        this.state = 'walking';
      } else if (rand < 0.5) {
        // 20%: 점프
        if (this.onGround) {
          this.jump();
        }
      } else if (rand < 0.7) {
        // 20%: 앉기
        this.state = 'sitting';
        this.velocityX = 0;
      } else {
        // 30%: 가만히 서있기
        this.state = 'idle';
        this.velocityX = 0;
      }
    }

    // 목표 위치로 이동
    if (this.state === 'walking' || this.state === 'running') {
      const distToTarget = this.targetX - this.x;

      if (Math.abs(distToTarget) > 5) {
        const speed = this.state === 'running' ? 3 : 1.5;
        this.velocityX = Math.sign(distToTarget) * speed;
        this.direction = distToTarget > 0 ? 'right' : 'left';
      } else {
        this.velocityX = 0;
        this.state = 'idle';
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

    // 크기는 레벨에 따라 조정
    const levelData = LEVEL_REQUIREMENTS.find(l => l.level === this.level);
    const scale = levelData ? levelData.size / 32 : 1;

    ctx.save();
    ctx.scale(scale, scale);

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

    // 알림
    if (typeof window !== 'undefined' && window.api) {
      window.api.showNotification(
        '레벨 업! 🎉',
        `강아지가 레벨 ${this.level}이 되었습니다!`
      );
    }

    console.log(`Pet leveled up to ${this.level}!`);
  }

  jump(): void {
    if (this.onGround) {
      this.velocityY = -12;
      this.onGround = false;
      this.state = 'jumping';
    }
  }

  getState(): PetState {
    return {
      x: this.x,
      y: this.y,
      level: this.level,
      experience: this.experience,
      hunger: this.hunger,
      happiness: this.happiness,
      energy: this.energy
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
