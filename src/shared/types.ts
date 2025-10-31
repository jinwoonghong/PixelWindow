// 공유 타입 정의

export interface PetState {
  x: number;
  y: number;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
}

export interface SaveData {
  version: string;
  savedAt: string;
  pet: PetState;
  stats: GameStats;
  settings: GameSettings;
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
