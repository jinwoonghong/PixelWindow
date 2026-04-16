// 게임 상수

export const GAME_CONFIG = {
  FPS: 60,
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  PET_SIZE: 64,
  FOOD_SIZE: 32,
};

export const PHYSICS = {
  GRAVITY: 0.5,
  FRICTION: 0.8,
  JUMP_FORCE: -10,
};

export const LEVEL_REQUIREMENTS = [
  { level: 1, expRequired: 0, size: 64 },
  { level: 2, expRequired: 100, size: 80 },
  { level: 3, expRequired: 300, size: 96 },
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
    id: 'snack',
    name: '간식',
    sprite: 'snack.png',
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

export const ACCESSORIES = [
  // 모자 종류
  {
    id: 'red_hat',
    name: '빨간 모자',
    description: '귀여운 빨간 모자',
    type: 'hat' as const,
    unlockRequirement: {
      type: 'level' as const,
      value: 1
    },
    renderOffset: { x: 0, y: -4 }
  },
  {
    id: 'blue_hat',
    name: '파란 모자',
    description: '시원한 파란 모자',
    type: 'hat' as const,
    unlockRequirement: {
      type: 'level' as const,
      value: 2
    },
    renderOffset: { x: 0, y: -4 }
  },
  {
    id: 'party_hat',
    name: '파티 모자',
    description: '축하할 때 쓰는 모자',
    type: 'hat' as const,
    unlockRequirement: {
      type: 'food' as const,
      value: 10,
      foodId: 'special'
    },
    renderOffset: { x: 0, y: -6 }
  },

  // 목걸이 종류
  {
    id: 'simple_necklace',
    name: '심플 목걸이',
    description: '기본 목걸이',
    type: 'necklace' as const,
    unlockRequirement: {
      type: 'level' as const,
      value: 1
    },
    renderOffset: { x: 0, y: 2 }
  },
  {
    id: 'gold_necklace',
    name: '금 목걸이',
    description: '반짝이는 금 목걸이',
    type: 'necklace' as const,
    unlockRequirement: {
      type: 'experience' as const,
      value: 500
    },
    renderOffset: { x: 0, y: 2 }
  },

  // 안경 종류
  {
    id: 'sunglasses',
    name: '선글라스',
    description: '멋진 선글라스',
    type: 'glasses' as const,
    unlockRequirement: {
      type: 'level' as const,
      value: 3
    },
    renderOffset: { x: 0, y: -2 }
  },
  {
    id: 'round_glasses',
    name: '동그란 안경',
    description: '지적인 안경',
    type: 'glasses' as const,
    unlockRequirement: {
      type: 'food' as const,
      value: 50,
      foodId: 'bone'
    },
    renderOffset: { x: 0, y: -2 }
  },

  // 리본 종류
  {
    id: 'pink_ribbon',
    name: '핑크 리본',
    description: '사랑스러운 핑크 리본',
    type: 'ribbon' as const,
    unlockRequirement: {
      type: 'food' as const,
      value: 30,
      foodId: 'snack'
    },
    renderOffset: { x: 2, y: -4 }
  },
  {
    id: 'red_ribbon',
    name: '빨간 리본',
    description: '화려한 빨간 리본',
    type: 'ribbon' as const,
    unlockRequirement: {
      type: 'level' as const,
      value: 2
    },
    renderOffset: { x: 2, y: -4 }
  },

  // 스카프
  {
    id: 'blue_scarf',
    name: '파란 스카프',
    description: '따뜻한 파란 스카프',
    type: 'scarf' as const,
    unlockRequirement: {
      type: 'time' as const,
      value: 3600 // 1시간 플레이 (초 단위)
    },
    renderOffset: { x: 0, y: 3 }
  },
  {
    id: 'yellow_scarf',
    name: '노란 스카프',
    description: '밝은 노란 스카프',
    type: 'scarf' as const,
    unlockRequirement: {
      type: 'food' as const,
      value: 20,
      foodId: 'fish'
    },
    renderOffset: { x: 0, y: 3 }
  },

  // 나비 넥타이
  {
    id: 'black_bow',
    name: '검은 나비 넥타이',
    description: '정장에 어울리는 나비 넥타이',
    type: 'bow' as const,
    unlockRequirement: {
      type: 'experience' as const,
      value: 200
    },
    renderOffset: { x: 0, y: 2 }
  },
  {
    id: 'red_bow',
    name: '빨간 나비 넥타이',
    description: '귀여운 빨간 나비 넥타이',
    type: 'bow' as const,
    unlockRequirement: {
      type: 'food' as const,
      value: 15,
      foodId: 'meat'
    },
    renderOffset: { x: 0, y: 2 }
  }
];
