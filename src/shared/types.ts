// 공유 타입 정의

export interface PetState {
  x: number;
  y: number;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
  equippedAccessories: string[]; // 장착한 액세서리 ID 배열
}

export interface SaveData {
  version: string;
  savedAt: string;
  pet: PetState;
  stats: GameStats;
  settings: GameSettings;
  inventory: Inventory;
}

export interface GameStats {
  totalPlayTime: number;
  foodEaten: Record<string, number>;
  totalExperience: number;
  sessions: number;
}

export interface GameSettings {
  volume: number;
  petSpeed: number;
  foodSpawnRate: number;
  autoSleep: boolean;
  startWithWindows: boolean;
}

export interface FoodType {
  id: string;
  name: string;
  sprite: string;
  experience: number;
  hunger: number;
  happiness: number;
  spawnWeight: number;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  type: 'hat' | 'necklace' | 'glasses' | 'ribbon' | 'scarf' | 'bow';
  unlockRequirement: UnlockRequirement;
  renderOffset: { x: number; y: number }; // 렌더링 위치 오프셋
}

export interface UnlockRequirement {
  type: 'level' | 'food' | 'time' | 'experience';
  value: number;
  foodId?: string; // type이 'food'일 때 필요
}

export interface Inventory {
  unlockedAccessories: string[]; // 해금된 액세서리 ID 목록
}
