# PixelWindow 🐕

> 윈도우 데스크톱 오버레이 가상 애완동물 게임

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-playable-green)
![Progress](https://img.shields.io/badge/progress-85%25-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

## 소개

PixelWindow는 윈도우 환경에서 동작하는 데스크톱 오버레이 게임입니다. 귀여운 픽셀 강아지가 화면 위를 돌아다니며, 사용자 활동에 반응하고 시간이 지남에 따라 성장합니다.

### ✨ 주요 기능

- 🖥️ **투명 오버레이**: 다른 작업을 방해하지 않는 투명한 오버레이 윈도우
- 🐶 **픽셀 강아지**: 7가지 애니메이션 상태 (걷기, 앉기, 자기, 먹기 등)
- 🤖 **자동 AI**: 강아지가 스스로 돌아다니며 다양한 행동
- 🍖 **먹이 시스템**: 5종류의 먹이가 시간에 따라 등장
- 📈 **성장 시스템**: 경험치를 획득하여 3단계 레벨업
- 🎨 **액세서리 꾸미기**: 13종류의 액세서리로 강아지 커스터마이징
- 🏆 **업적 시스템**: 특정 조건 달성 시 액세서리 해금
- 🖱️ **클릭 통과**: 강아지가 없는 투명 영역은 클릭 통과
- 💾 **자동 저장**: 게임 상태가 자동으로 저장 및 복원됨
- 📊 **통계 추적**: 플레이 시간, 먹은 먹이 등 기록
- ⚙️ **설정 시스템**: 먹이 생성 주기 등 조정 가능
- 🎯 **시스템 트레이**: 빠른 접근 및 종료 메뉴

## 🎮 게임플레이

### 기본 조작
1. **게임 시작**: 앱 실행 시 강아지가 자동으로 화면에 나타남
2. **강아지 클릭**: 클릭하면 메뉴가 열려 상태 확인 가능
3. **먹이 시스템**: 일정 시간마다 먹이가 자동 생성됨
4. **자동 성장**: 강아지가 먹이를 먹으면 경험치를 획득하여 성장

### 강아지 상태
- **배고픔 (Hunger)**: 시간이 지나면 감소, 먹이로 회복
- **행복도 (Happiness)**: 배고픔과 에너지에 영향받음
- **에너지 (Energy)**: 시간이 지나면 감소, 낮으면 자기 시작

### 먹이 종류
| 먹이 | 경험치 | 배고픔 회복 | 행복도 | 등장 확률 |
|-----|--------|------------|--------|----------|
| 🦴 뼈다귀 | 10 | 20 | 10 | 높음 |
| 🐟 생선 | 15 | 30 | 15 | 중간 |
| 🥩 고기 | 20 | 40 | 20 | 낮음 |
| 🍪 간식 | 5 | 10 | 30 | 높음 |
| ⭐ 특별식 | 50 | 100 | 50 | 매우 낮음 |

### 레벨 시스템
- **레벨 1**: 작은 강아지 (0~99 경험치)
- **레벨 2**: 중간 강아지 (100~299 경험치)
- **레벨 3**: 큰 강아지 (300+ 경험치)

## 🚀 설치 및 실행

### 필요 환경
- Node.js v18 이상
- npm v9 이상
- Windows 10/11

### 개발 환경 실행

**⚠️ 중요: 반드시 이 순서대로 실행하세요!**

```bash
# 1단계: 저장소 클론
git clone https://github.com/jinwoonghong/PixelWindow.git
cd PixelWindow

# 2단계: 의존성 설치
npm install

# 3단계: 빌드 (필수! 이 단계를 건너뛰면 에러 발생)
npm run build

# 4단계: 실행
npm start
```

### 🔧 문제 해결

**에러: "cannot find module index.js"**
- 원인: 빌드를 하지 않아서 `dist` 폴더가 없음
- 해결: `npm run build`를 먼저 실행

**에러: "webpack: command not found"**
- 원인: 의존성이 설치되지 않음
- 해결: `npm install`을 다시 실행

**빌드 확인 방법:**
```bash
# Windows
dir dist\main
dir dist\renderer

# Mac/Linux
ls dist/main
ls dist/renderer
```
`index.js`, `index.html` 등의 파일이 있어야 합니다.

### 개발 모드 (핫 리로드)

```bash
# 터미널 1: Webpack watch 모드
npm run dev

# 터미널 2: Electron 실행
npm start
```

## ⌨️ 단축키

### 개발/테스트용 단축키
- `Ctrl+Shift+F`: 랜덤 먹이 즉시 생성
- `Ctrl+Shift+L`: 레벨업 테스트 (경험치 1000 획득)
- `Ctrl+Shift+A`: 모든 먹이 타입 생성
- `Ctrl+Shift+D`: 디버그 정보 토글

## 🏗️ 프로젝트 구조

```
PixelWindow/
├── src/
│   ├── main/                    # Electron 메인 프로세스
│   │   ├── index.ts            # 메인 진입점
│   │   ├── window-manager.ts   # 윈도우 관리
│   │   ├── tray-manager.ts     # 시스템 트레이
│   │   ├── ipc-handlers.ts     # IPC 통신
│   │   └── preload.ts          # Preload 스크립트
│   │
│   ├── renderer/                # Electron 렌더러 프로세스
│   │   ├── index.html          # 메인 HTML
│   │   ├── index.ts            # 렌더러 진입점
│   │   └── game/               # 게임 로직
│   │       ├── game-engine.ts  # 게임 엔진
│   │       ├── pet.ts          # 강아지 클래스
│   │       ├── food.ts         # 먹이 시스템
│   │       └── collision.ts    # 충돌 감지
│   │
│   └── shared/                  # 공유 코드
│       ├── types.ts            # 타입 정의
│       ├── constants.ts        # 상수
│       └── ipc-channels.ts     # IPC 채널
│
├── docs/
│   ├── ARCHITECTURE.md         # 아키텍처 문서
│   ├── SPECIFICATION.md        # 기능 명세서
│   └── Progress.md             # 진행 상황
│
└── package.json
```

## 🎨 기술 스택

- **Electron**: 데스크톱 애플리케이션 프레임워크
- **TypeScript**: 타입 안전성을 위한 언어
- **HTML5 Canvas**: 픽셀 아트 렌더링
- **Webpack**: 모듈 번들러

## 📊 개발 진행 상황

**전체 진행률: 100%** (모든 핵심 기능 완료!)

- ✅ Phase 1: 기본 인프라 (100%)
- ✅ Phase 2: 강아지 캐릭터 시스템 (100%)
- ✅ Phase 3: 먹이 및 상호작용 (100%)
- ✅ Phase 4: 성장 및 상태 관리 (100%)
- ✅ Phase 5: UI 및 마무리 (100%)
- ✅ 추가: 액세서리 시스템 (100%)
- ✅ 추가: 클릭 통과 기능 (100%)

자세한 진행 상황은 [Progress.md](./Progress.md)를 참조하세요.

## 🎯 로드맵

### 현재 구현됨 ✅
- [x] 투명 오버레이 윈도우
- [x] 시스템 트레이 통합
- [x] 픽셀 강아지 (7가지 애니메이션)
- [x] 자동 AI 및 물리 엔진
- [x] 5종류 먹이 시스템
- [x] 레벨 및 성장 시스템
- [x] 저장/로드 시스템
- [x] 통계 및 설정 UI
- [x] 액세서리 시스템 (13종류)
- [x] 클릭 통과 기능

### 개발 예정 📋
- [ ] 배포용 빌드 및 설치 프로그램
- [ ] 윈도우 시작 프로그램 등록
- [ ] 사운드 효과 (선택사항)
- [ ] 파티클 이펙트 (선택사항)

### 향후 계획 💡
- [ ] 다양한 강아지 종류
- [ ] 멀티 애완동물
- [ ] 미니 게임
- [ ] 추가 액세서리 및 테마

## 📖 문서

- [아키텍처 설계](./ARCHITECTURE.md) - 프로젝트 구조 및 설계 패턴
- [기능 명세서](./SPECIFICATION.md) - 상세 기능 구현 가이드
- [개발 진행 상황](./Progress.md) - 체크리스트 및 완료 현황

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다. 이슈를 발견하시면 GitHub Issues에 등록해주세요!

## 🤝 기여하기

이슈 및 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 👤 제작자

- GitHub: [@jinwoonghong](https://github.com/jinwoonghong)
- Project: [PixelWindow](https://github.com/jinwoonghong/PixelWindow)

## 🎉 특별 감사

- Electron 커뮤니티
- TypeScript 팀
- 픽셀 아트에 영감을 준 모든 개발자들

---

**즐거운 강아지 키우기 되세요! 🐕💕**

## 📸 스크린샷

> 현재 개발 중이며, 스크린샷은 로컬 환경 실행 후 추가될 예정입니다.

### 주요 화면
- 메인 게임 화면 (강아지가 화면을 돌아다님)
- 메뉴 UI (상태, 통계, 설정)
- 먹이 시스템 (다양한 픽셀 아트 먹이)
- 레벨업 알림

---

**개발 상태**: 🟢 **플레이 가능** - 모든 핵심 기능 구현 완료!
