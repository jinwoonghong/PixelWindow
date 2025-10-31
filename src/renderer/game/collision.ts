import { Pet } from './pet';
import { Food } from './food';

export class CollisionDetector {
  checkPetFoodCollision(pet: Pet, food: Food): boolean {
    const petBounds = pet.getBounds();
    const foodBounds = food.getBounds();

    return this.checkAABB(petBounds, foodBounds);
  }

  private checkAABB(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  checkCircleCollision(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r1 + r2;
  }

  checkPointInRect(
    px: number,
    py: number,
    rect: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }
}
