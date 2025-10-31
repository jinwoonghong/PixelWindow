// 게임 상수

export const GAME_CONFIG = {
  FPS: 60,
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  PET_SIZE: 32,
  FOOD_SIZE: 16,
};

export const PHYSICS = {
  GRAVITY: 0.5,
  FRICTION: 0.8,
  JUMP_FORCE: -10,
};

export const LEVEL_REQUIREMENTS = [
  { level: 1, expRequired: 0, size: 16 },
  { level: 2, expRequired: 100, size: 24 },
  { level: 3, expRequired: 300, size: 32 },
];

export const FOOD_TYPES = [
  {
    id: 'bone',
    name: '뼈다귀',
    sprite: 'bone.png',
    experience: 10,
    hunger: 20,
    happiness: 10,
    spawnWeight: 10
  },
  {
    id: 'fish',
    name: '생선',
    sprite: 'fish.png',
    experience: 15,
    hunger: 30,
    happiness: 15,
    spawnWeight: 8
  },
  {
    id: 'meat',
    name: '고기',
    sprite: 'meat.png',
    experience: 20,
    hunger: 40,
    happiness: 20,
    spawnWeight: 5
  },
  {
    id: 'treat',
    name: '간식',
    sprite: 'treat.png',
    experience: 5,
    hunger: 10,
    happiness: 30,
    spawnWeight: 15
  },
  {
    id: 'special',
    name: '특별식',
    sprite: 'special.png',
    experience: 50,
    hunger: 100,
    happiness: 50,
    spawnWeight: 1
  }
];
