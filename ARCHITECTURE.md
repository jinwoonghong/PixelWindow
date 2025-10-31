# PixelWindow - 프로젝트 구조 설계

## 프로젝트 개요
윈도우 환경에서 동작하는 오버레이 가상 애완동물 게임
픽셀 강아지가 화면을 돌아다니며 사용자 활동에 반응하고 성장하는 데스크톱 애플리케이션

## 기술 스택

### Core Technologies
- **Electron**: 데스크톱 애플리케이션 프레임워크
- **TypeScript**: 타입 안전성을 위한 언어
- **HTML5 Canvas**: 픽셀 아트 렌더링
- **Node.js**: 백엔드 로직 및 파일 시스템 접근

### Build & Development Tools
- **Webpack**: 번들링
- **ESLint**: 코드 품질
- **Prettier**: 코드 포맷팅

## 폴더 구조

```
PixelWindow/
├── src/
│   ├── main/                    # Electron Main Process
│   │   ├── index.ts            # 메인 프로세스 진입점
│   │   ├── window-manager.ts   # 윈도우 생성 및 관리
│   │   ├── tray-manager.ts     # 시스템 트레이 관리
│   │   └── ipc-handlers.ts     # IPC 통신 핸들러
│   │
│   ├── renderer/                # Electron Renderer Process
│   │   ├── index.html          # 메인 HTML
│   │   ├── index.ts            # 렌더러 진입점
│   │   ├── styles/
│   │   │   └── main.css        # 전역 스타일
│   │   │
│   │   ├── game/               # 게임 로직
│   │   │   ├── game-engine.ts  # 메인 게임 루프
│   │   │   ├── pet.ts          # 강아지 클래스
│   │   │   ├── food.ts         # 먹이 시스템
│   │   │   ├── physics.ts      # 물리 엔진 (이동, 중력)
│   │   │   └── collision.ts    # 충돌 감지
│   │   │
│   │   ├── rendering/          # 렌더링 시스템
│   │   │   ├── canvas-renderer.ts  # Canvas 렌더러
│   │   │   ├── sprite-manager.ts   # 스프라이트 관리
│   │   │   └── animation.ts        # 애니메이션 시스템
│   │   │
│   │   ├── ui/                 # UI 컴포넌트
│   │   │   ├── menu.ts         # 메뉴 UI
│   │   │   ├── stats.ts        # 통계 화면
│   │   │   └── settings.ts     # 설정 화면
│   │   │
│   │   └── utils/              # 유틸리티
│   │       ├── activity-monitor.ts  # 사용자 활동 감지
│   │       ├── save-manager.ts      # 게임 저장/로드
│   │       └── event-bus.ts         # 이벤트 시스템
│   │
│   ├── shared/                  # Main/Renderer 공유 코드
│   │   ├── types.ts            # 공유 타입 정의
│   │   ├── constants.ts        # 상수
│   │   └── ipc-channels.ts     # IPC 채널 정의
│   │
│   └── assets/                  # 리소스 파일
│       ├── sprites/            # 스프라이트 이미지
│       │   ├── dog-idle.png
│       │   ├── dog-walk.png
│       │   ├── dog-eat.png
│       │   └── food-*.png
│       ├── icons/              # 아이콘
│       │   ├── tray-icon.png
│       │   └── app-icon.ico
│       └── sounds/             # 사운드 (선택사항)
│           └── eat.wav
│
├── docs/                        # 문서
│   ├── SPECIFICATION.md        # 기능 명세서
│   └── Progress.md             # 진행상황
│
├── dist/                        # 빌드 출력
├── node_modules/
├── package.json
├── tsconfig.json
├── webpack.config.js
├── .eslintrc.js
├── .gitignore
└── README.md
```

## 핵심 아키텍처 패턴

### 1. Main Process (Node.js)
**역할**: 시스템 레벨 작업 및 창 관리
- 투명 오버레이 윈도우 생성
- 시스템 트레이 통합
- 파일 시스템 접근 (게임 상태 저장)
- IPC를 통한 Renderer와 통신

### 2. Renderer Process (Chromium)
**역할**: UI 렌더링 및 게임 로직
- Canvas 기반 렌더링
- 게임 루프 및 상태 관리
- 사용자 인터랙션 처리
- IPC를 통한 Main과 통신

### 3. IPC 통신 구조
```
Main Process          Renderer Process
    │                       │
    │◄──── save-game ───────│
    │                       │
    │────── load-game ─────►│
    │                       │
    │◄──── show-menu ───────│
    │                       │
    │────── quit-app ───────►│
```

## 주요 기술적 구현사항

### 1. 투명 오버레이 윈도우
```typescript
{
  transparent: true,
  frame: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  resizable: false,
  focusable: false,
  hasShadow: false
}
```

### 2. 선택적 클릭 통과
- 기본적으로 모든 클릭 이벤트 통과
- 강아지 영역 클릭 시에만 반응
- `setIgnoreMouseEvents(true, { forward: true })` 활용

### 3. 게임 루프
```typescript
requestAnimationFrame(gameLoop)
- Update: 강아지 위치, 상태, AI
- Render: Canvas에 스프라이트 그리기
- 60 FPS 목표
```

### 4. 상태 저장
```json
{
  "petName": "멍멍이",
  "growthLevel": 2,
  "experience": 350,
  "playTime": 12543,
  "foodEaten": {
    "bone": 15,
    "fish": 8
  },
  "lastPlayed": "2025-10-31T11:30:00Z"
}
```

## 확장성 고려사항
- 다양한 강아지 종류 (미래 확장)
- 멀티 애완동물 지원
- 온라인 리더보드
- 커스터마이징 (색상, 액세서리)
- 미니 게임 추가

## 성능 최적화
- Canvas 대신 CSS Transform 활용 (더 부드러운 애니메이션)
- Sprite Atlas로 이미지 로딩 최적화
- 사용자 비활성 시 게임 루프 속도 감소
- 메모리 누수 방지 (이벤트 리스너 정리)

## 보안 고려사항
- Context Isolation 활성화
- Node Integration 비활성화 (preload script 사용)
- CSP (Content Security Policy) 설정
- 사용자 데이터 로컬 저장만 허용
