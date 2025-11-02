# PixelWindow 이미지 제작 가이드

## 📋 목차
1. [강아지 스프라이트 시트](#1-강아지-스프라이트-시트)
2. [먹이 아이템](#2-먹이-아이템)
3. [액세서리 아이템](#3-액세서리-아이템)
4. [AI 이미지 생성 프롬프트](#4-ai-이미지-생성-프롬프트)

---

## 1. 강아지 스프라이트 시트

### 📐 파일 스펙
- **파일명**: `dog.png`
- **경로**: `assets/sprites/dog.png`
- **이미지 크기**: 1024 x 1024 픽셀 (권장)
- **배경**: 완전 투명 (PNG alpha channel)
- **구조**: 5열 × 4행 = 총 20프레임
- **각 셀 크기**: 204.8 x 256 픽셀 (1024÷5 x 1024÷4)

### 🎬 애니메이션 구조

```
┌─────┬─────┬─────┬─────┬─────┐
│ I0  │ I1  │ I2  │ I3  │ I4  │  1행: IDLE (서있기)
├─────┼─────┼─────┼─────┼─────┤
│ W0  │ W1  │ W2  │ W3  │ W4  │  2행: WALKING (걷기/뛰기/점프)
├─────┼─────┼─────┼─────┼─────┤
│ E0  │ E1  │ E2  │ E3  │ E4  │  3행: EATING (먹기)
├─────┼─────┼─────┼─────┼─────┤
│ S0  │ S1  │ S2  │ S3  │ S4  │  4행: SITTING (앉기/자기)
└─────┴─────┴─────┴─────┴─────┘
```

### 📝 각 행별 애니메이션 설명

| 행 | 상태 | 설명 | 프레임 예시 |
|---|------|------|------------|
| 1행 | **IDLE** | 가만히 서있거나 살짝 움직이는 대기 자세 | 눈 깜빡임, 꼬리 살랑거림 |
| 2행 | **WALKING** | 걷기/뛰기/점프 동작 | 다리 움직임, 점프 자세 |
| 3행 | **EATING** | 먹이를 먹는 동작 | 고개 숙이고 먹기 |
| 4행 | **SITTING** | 앉아있거나 누워있는 자세 | 앉기, 눕기 |

### 🎨 디자인 가이드라인
- **스타일**: 픽셀 아트 or 2D 만화 스타일
- **방향**: 각 프레임은 **오른쪽을 바라보는 방향**으로 제작 (좌우 반전은 코드에서 자동 처리)
- **여백**: 각 셀 안에서 강아지가 잘리지 않도록 충분한 여백 확보
- **일관성**: 모든 프레임에서 강아지의 크기와 위치가 일정해야 자연스러운 애니메이션

---

## 2. 먹이 아이템

### 📐 파일 스펙
- **경로**: `assets/sprites/food/`
- **이미지 크기**: 1024 x 1024 픽셀 (각각 단일 이미지)
- **배경**: 완전 투명 (PNG alpha channel)
- **형태**: 스프라이트 시트가 **아닌** 단일 이미지

### 🍖 필요한 이미지 목록

| 파일명 | 아이템명 | 설명 | 게임 내 효과 |
|--------|---------|------|-------------|
| `bone.png` | 뼈다귀 | 강아지용 뼈다귀 | 경험치 +10, 포만감 +20 |
| `fish.png` | 생선 | 신선한 생선 | 경험치 +15, 포만감 +30 |
| `meat.png` | 고기 | 고급 고기 | 경험치 +20, 포만감 +40 |
| `snack.png` | 간식 | 강아지 간식 | 경험치 +5, 행복도 +30 |
| `special.png` | 특별식 | 최고급 음식 | 경험치 +50, 모든 스탯 회복 |

### 🎨 디자인 가이드라인
- **스타일**: 강아지 스프라이트와 동일한 스타일
- **크기**: 이미지 내 아이템이 중앙에 배치되고, 여백 포함 1024x1024
- **디테일**: 화면에 32x32px로 축소되므로, 너무 세밀한 디테일보다는 명확한 실루엣 중요

---

## 3. 액세서리 아이템

### 📐 파일 스펙
- **경로**: `assets/sprites/accessories/`
- **이미지 크기**: 512 x 512 픽셀 (권장, 액세서리는 강아지보다 작음)
- **배경**: 완전 투명 (PNG alpha channel)
- **형태**: 단일 이미지 (애니메이션 없음)

### 👒 필요한 이미지 목록

#### 모자 (Hat)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `red_hat.png` | 빨간 모자 | 레벨 1 |
| `blue_hat.png` | 파란 모자 | 레벨 2 |
| `party_hat.png` | 파티 모자 | 특별식 10개 먹기 |

#### 목걸이 (Necklace)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `simple_necklace.png` | 심플 목걸이 | 레벨 1 |
| `gold_necklace.png` | 금 목걸이 | 경험치 500 |

#### 안경 (Glasses)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `sunglasses.png` | 선글라스 | 레벨 3 |
| `round_glasses.png` | 동그란 안경 | 뼈다귀 50개 먹기 |

#### 리본 (Ribbon)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `pink_ribbon.png` | 핑크 리본 | 간식 30개 먹기 |
| `red_ribbon.png` | 빨간 리본 | 레벨 2 |

#### 스카프 (Scarf)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `blue_scarf.png` | 파란 스카프 | 1시간 플레이 |
| `yellow_scarf.png` | 노란 스카프 | 생선 20개 먹기 |

#### 나비 넥타이 (Bow)
| 파일명 | 아이템명 | 해금 조건 |
|--------|---------|-----------|
| `black_bow.png` | 검은 나비 넥타이 | 경험치 200 |
| `red_bow.png` | 빨간 나비 넥타이 | 고기 15개 먹기 |

### 🎨 디자인 가이드라인
- **위치**: 액세서리가 강아지에게 오버레이되므로, 강아지 머리/목 부분에 맞게 배치
- **크기**: 강아지보다 작게, 장식적으로
- **스타일**: 강아지와 동일한 아트 스타일 유지

---

## 4. AI 이미지 생성 프롬프트

### 🐕 강아지 스프라이트 시트 프롬프트

#### Gemini / Midjourney / DALL-E 프롬프트

```
Create a pixel art sprite sheet of a cute cartoon dog for a desktop pet game.

Image specifications:
- Size: 1024x1024 pixels
- Layout: 5 columns × 4 rows = 20 frames total
- Transparent background (PNG with alpha channel)
- Each cell size: approximately 205x256 pixels

Animation frames by row:
Row 1 (IDLE): Dog standing still, subtle idle animation (blinking, tail wagging, breathing)
  - 5 frames showing gentle idle movements

Row 2 (WALKING): Dog walking/running animation
  - 5 frames showing complete walk cycle (legs moving, natural gait)

Row 3 (EATING): Dog eating food from ground
  - 5 frames showing head lowering and eating motion

Row 4 (SITTING): Dog sitting or lying down
  - 5 frames showing sitting/resting poses

Style requirements:
- Cute, friendly cartoon dog (choose a popular breed like Shiba Inu, Corgi, or Pomeranian)
- Facing RIGHT direction in all frames
- Consistent size and position across all frames
- Smooth, appealing pixel art or 2D cartoon style
- Clear silhouette readable at small sizes
- Warm, cheerful color palette
- Sufficient padding within each cell to avoid clipping

The sprite sheet should feel cohesive and professional, suitable for a casual desktop pet simulation game.
```

#### 한국어 버전 (Gemini 추천)

```
귀여운 강아지 데스크톱 펫 게임용 픽셀 아트 스프라이트 시트를 제작해주세요.

이미지 사양:
- 크기: 1024x1024 픽셀
- 레이아웃: 5열 × 4행 = 총 20프레임
- 완전 투명 배경 (PNG 알파 채널)
- 각 셀 크기: 약 205x256 픽셀

행별 애니메이션:
1행 (대기): 가만히 서있는 자세, 미세한 대기 애니메이션 (눈 깜빡임, 꼬리 흔들기, 호흡)
  - 부드러운 대기 동작을 보여주는 5프레임

2행 (걷기): 걷기/뛰기 애니메이션
  - 완전한 걷기 사이클을 보여주는 5프레임 (다리 움직임, 자연스러운 걸음걸이)

3행 (먹기): 바닥의 음식을 먹는 동작
  - 고개를 숙이고 먹는 동작을 보여주는 5프레임

4행 (앉기): 앉거나 눕는 자세
  - 앉기/휴식 자세를 보여주는 5프레임

스타일 요구사항:
- 귀엽고 친근한 만화풍 강아지 (시바견, 코기, 포메라니안 등 인기 견종)
- 모든 프레임에서 오른쪽을 바라보는 방향
- 모든 프레임에서 일관된 크기와 위치
- 부드럽고 매력적인 픽셀 아트 또는 2D 만화 스타일
- 작은 크기에서도 잘 보이는 명확한 실루엣
- 따뜻하고 밝은 색상 팔레트
- 잘리지 않도록 각 셀 내 충분한 여백

데스크톱 펫 시뮬레이션 게임에 어울리는 통일감 있고 전문적인 스프라이트 시트를 만들어주세요.
```

---

### 🍖 먹이 아이템 프롬프트

각 아이템별로 개별 프롬프트:

#### 1. bone.png (뼈다귀)
```
Create a cute pixel art dog bone treat icon.
- Size: 1024x1024 pixels
- Transparent background
- Style: Cute cartoon/pixel art matching the dog sprite
- Color: White/cream colored bone
- Centered in the image with padding
- Simple, clear design readable when scaled to 32x32 pixels
```

#### 2. fish.png (생선)
```
Create a cute pixel art fish icon for a dog treat.
- Size: 1024x1024 pixels
- Transparent background
- Style: Cute cartoon/pixel art
- A whole fresh fish (like salmon or mackerel)
- Centered with padding
- Bright, appetizing colors
- Clear silhouette
```

#### 3. meat.png (고기)
```
Create a cute pixel art premium meat/steak icon.
- Size: 1024x1024 pixels
- Transparent background
- Style: Cute cartoon/pixel art
- A juicy steak or meat piece
- Centered with padding
- Rich red/brown colors
- Appetizing appearance
```

#### 4. snack.png (간식)
```
Create a cute pixel art dog snack/cookie icon.
- Size: 1024x1024 pixels
- Transparent background
- Style: Cute cartoon/pixel art
- Dog treat or cookie
- Centered with padding
- Fun, colorful design
- Bone-shaped or round cookie
```

#### 5. special.png (특별식)
```
Create a premium special food icon for a dog game.
- Size: 1024x1024 pixels
- Transparent background
- Style: Cute cartoon/pixel art
- Luxury dog food bowl or premium feast
- Centered with padding
- Sparkling or glowing effect
- Golden/rainbow colors to show it's special
- Most appetizing and special-looking of all foods
```

---

### 👒 액세서리 프롬프트 (예시)

#### 모자 시리즈
```
Create cute pixel art dog accessories - hats collection:
1. Red cap/hat - simple red baseball cap or beanie
2. Blue cap/hat - cool blue hat
3. Party hat - colorful cone-shaped party hat

For each:
- Size: 512x512 pixels
- Transparent background
- Designed to overlay on top of a dog's head
- Cute cartoon/pixel art style
- Centered with the base of the hat aligned to bottom of image
- Should look good when scaled down to ~32x32 pixels
```

---

## 📁 최종 폴더 구조

```
assets/
└── sprites/
    ├── dog.png                          # 강아지 스프라이트 시트 (1024x1024)
    ├── food/
    │   ├── bone.png                     # 뼈다귀 (1024x1024)
    │   ├── fish.png                     # 생선 (1024x1024)
    │   ├── meat.png                     # 고기 (1024x1024)
    │   ├── snack.png                    # 간식 (1024x1024)
    │   └── special.png                  # 특별식 (1024x1024)
    └── accessories/
        ├── red_hat.png                  # 빨간 모자 (512x512)
        ├── blue_hat.png                 # 파란 모자 (512x512)
        ├── party_hat.png                # 파티 모자 (512x512)
        ├── simple_necklace.png          # 심플 목걸이 (512x512)
        ├── gold_necklace.png            # 금 목걸이 (512x512)
        ├── sunglasses.png               # 선글라스 (512x512)
        ├── round_glasses.png            # 동그란 안경 (512x512)
        ├── pink_ribbon.png              # 핑크 리본 (512x512)
        ├── red_ribbon.png               # 빨간 리본 (512x512)
        ├── blue_scarf.png               # 파란 스카프 (512x512)
        ├── yellow_scarf.png             # 노란 스카프 (512x512)
        ├── black_bow.png                # 검은 나비 넥타이 (512x512)
        └── red_bow.png                  # 빨간 나비 넥타이 (512x512)
```

---

## 💡 AI 이미지 생성 팁

### Gemini 사용 시
1. 각 프롬프트를 하나씩 입력
2. "더 귀엽게", "픽셀 아트 스타일로", "배경 투명하게" 등으로 수정 요청
3. 마음에 드는 결과가 나올 때까지 반복

### Midjourney 사용 시
- `--v 6` 버전 사용 권장
- `--style raw` 추가하면 더 정확한 스프라이트 시트 생성
- `pixel art` 키워드 강조

### DALL-E 사용 시
- "transparent background" 명시 필수
- "sprite sheet", "game asset" 키워드 사용
- 생성 후 배경 제거 도구로 투명도 확인

---

## ✅ 체크리스트

제작 완료 후 확인사항:

- [ ] 모든 이미지가 PNG 형식이고 배경이 투명함
- [ ] 강아지 스프라이트 시트가 정확히 5x4 그리드 구조
- [ ] 각 애니메이션이 자연스럽게 반복됨
- [ ] 먹이 이미지 5종이 모두 준비됨
- [ ] 액세서리 이미지가 강아지 위에 올렸을 때 자연스러움
- [ ] 파일명이 정확히 명세서와 일치함
- [ ] 이미지 크기가 명세서와 일치함
- [ ] 모든 이미지가 동일한 아트 스타일로 통일됨
