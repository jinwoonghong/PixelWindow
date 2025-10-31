// IPC 채널 정의

export const IPC_CHANNELS = {
  // 윈도우 관리
  SET_CLICKABLE: 'set-clickable-region',
  SET_CLICK_THROUGH: 'set-click-through',

  // 게임 상태
  SAVE_GAME: 'save-game',
  LOAD_GAME: 'load-game',
  DELETE_SAVE: 'delete-save',

  // UI
  SHOW_MENU: 'show-menu',
  SHOW_STATS: 'show-stats',
  SHOW_SETTINGS: 'show-settings',

  // 알림
  SHOW_NOTIFICATION: 'show-notification',

  // 앱 제어
  QUIT_APP: 'quit-app',
  FOCUS_PET: 'focus-pet',
} as const;
