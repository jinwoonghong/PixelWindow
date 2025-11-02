import { FOOD_TYPES } from '../../shared/constants';
import { FoodType } from '../../shared/types';

export class Food {
  x: number;
  y: number;
  type: FoodType;
  eaten: boolean = false;
  expired: boolean = false;
  spawnTime: number;
  lifetime: number = 60000; // 60초

  width: number = 32;
  height: number = 32;

  // 애니메이션
  bobOffset: number = 0;
  bobSpeed: number = 0.05;

  // 이미지 캐시 (static으로 모든 인스턴스가 공유)
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static imagesLoaded: Set<string> = new Set();

  constructor(type: FoodType, x: number, y: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.spawnTime = Date.now();
    Food.loadImage(type.id);
  }

  private static loadImage(foodId: string): void {
    if (Food.imagesLoaded.has(foodId)) return;

    const img = new Image();
    img.onload = () => {
      Food.imageCache.set(foodId, img);
      Food.imagesLoaded.add(foodId);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Food image ${foodId} loaded`);
      }
    };
    img.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to load food image ${foodId}, using pixel art fallback`);
      }
    };
    img.src = `assets/sprites/food/${foodId}.png`;
  }

  update(deltaTime: number): void {
    // 생명 시간 체크
    const now = Date.now();
    if (now - this.spawnTime > this.lifetime) {
      this.expired = true;
      return;
    }

    // 떠있는 애니메이션 제거 (고정)
    this.bobOffset = 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // bobOffset 제거 - 고정 위치
    const renderY = this.y;

    ctx.save();
    ctx.translate(this.x, renderY);

    // 이미지가 로드되어 있으면 사용 (전체 이미지를 화면 크기로 축소)
    const img = Food.imageCache.get(this.type.id);
    if (img) {
      // 이미지 전체(1024x1024)를 화면 크기(32x32)로 축소
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.width, this.height);
    } else {
      // 폴백: 픽셀 아트 렌더링
      switch (this.type.id) {
        case 'bone':
          this.renderBone(ctx);
          break;
        case 'fish':
          this.renderFish(ctx);
          break;
        case 'meat':
          this.renderMeat(ctx);
          break;
        case 'snack':
          this.renderSnack(ctx);
          break;
        case 'special':
          this.renderSpecial(ctx);
          break;
        default:
          this.renderBone(ctx);
      }
    }

    ctx.restore();

    // 남은 시간 표시 (마지막 10초)
    const timeLeft = this.lifetime - (Date.now() - this.spawnTime);
    if (timeLeft < 10000) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(`${Math.ceil(timeLeft / 1000)}s`, this.x, this.y - 5);
    }
  }

  private renderBone(ctx: CanvasRenderingContext2D): void {
    // 뼈다귀 (흰색)
    ctx.fillStyle = '#FFFEF0';

    // 양쪽 끝
    ctx.fillRect(0, 4, 4, 8);
    ctx.fillRect(12, 4, 4, 8);

    // 중간
    ctx.fillRect(4, 6, 8, 4);

    // 외곽선
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 4, 4, 8);
    ctx.strokeRect(12, 4, 4, 8);
    ctx.strokeRect(4, 6, 8, 4);
  }

  private renderFish(ctx: CanvasRenderingContext2D): void {
    // 생선 (파란색)
    ctx.fillStyle = '#87CEEB';

    // 몸통
    ctx.fillRect(4, 6, 8, 4);

    // 머리
    ctx.fillRect(2, 7, 2, 2);

    // 꼬리
    ctx.fillRect(12, 4, 2, 2);
    ctx.fillRect(12, 8, 2, 2);
    ctx.fillRect(14, 6, 2, 4);

    // 눈
    ctx.fillStyle = '#000';
    ctx.fillRect(3, 7, 1, 1);

    // 비늘
    ctx.strokeStyle = '#5F9EA0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 6);
    ctx.lineTo(6, 10);
    ctx.moveTo(8, 6);
    ctx.lineTo(8, 10);
    ctx.stroke();
  }

  private renderMeat(ctx: CanvasRenderingContext2D): void {
    // 고기 (붉은색)
    ctx.fillStyle = '#CD5C5C';

    // 메인
    ctx.fillRect(2, 4, 12, 8);

    // 뼈
    ctx.fillStyle = '#FFFEF0';
    ctx.fillRect(1, 6, 2, 4);

    // 그림자/질감
    ctx.fillStyle = '#8B4545';
    ctx.fillRect(4, 6, 2, 2);
    ctx.fillRect(8, 8, 2, 2);
    ctx.fillRect(11, 7, 2, 2);
  }

  private renderSnack(ctx: CanvasRenderingContext2D): void {
    // 간식 (갈색 과자)
    ctx.fillStyle = '#D2691E';

    // 원형 (정사각형 근사)
    ctx.fillRect(3, 2, 10, 12);
    ctx.fillRect(2, 4, 12, 8);

    // 초콜릿 칩
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(5, 5, 2, 2);
    ctx.fillRect(9, 7, 2, 2);
    ctx.fillRect(6, 10, 2, 2);

    // 하이라이트
    ctx.fillStyle = '#F4A460';
    ctx.fillRect(4, 3, 2, 2);
  }

  private renderSpecial(ctx: CanvasRenderingContext2D): void {
    // 특별식 (황금색, 반짝이는 효과)
    const time = Date.now() * 0.005;
    const brightness = Math.sin(time) * 0.2 + 0.8;

    ctx.fillStyle = `rgb(${255 * brightness}, ${215 * brightness}, 0)`;

    // 별 모양
    ctx.fillRect(6, 2, 4, 2);  // 위
    ctx.fillRect(6, 12, 4, 2); // 아래
    ctx.fillRect(2, 6, 2, 4);  // 왼쪽
    ctx.fillRect(12, 6, 2, 4); // 오른쪽
    ctx.fillRect(4, 4, 8, 8);  // 중앙

    // 반짝임
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    ctx.fillRect(7, 7, 2, 2);

    // 별 외곽
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, 8, 8);
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y + this.bobOffset,
      width: this.width,
      height: this.height
    };
  }

  static createRandom(x: number, y: number): Food {
    // 가중치 기반 랜덤 선택
    const totalWeight = FOOD_TYPES.reduce((sum, type) => sum + type.spawnWeight, 0);
    let random = Math.random() * totalWeight;

    for (const foodType of FOOD_TYPES) {
      random -= foodType.spawnWeight;
      if (random <= 0) {
        return new Food(foodType, x, y);
      }
    }

    // 폴백
    return new Food(FOOD_TYPES[0], x, y);
  }

  static createById(id: string, x: number, y: number): Food | null {
    const foodType = FOOD_TYPES.find(type => type.id === id);
    if (foodType) {
      return new Food(foodType, x, y);
    }
    return null;
  }
}
