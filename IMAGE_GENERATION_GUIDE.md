# 🎨 PixelWindow 이미지 제작 가이드

## 📋 프로젝트 개요
윈도우 데스크톱 오버레이 가상 애완동물 게임 "PixelWindow"의 스프라이트 이미지 제작

---

## 🎯 전체 요구사항

### 스타일
- **픽셀 아트 스타일** (8-bit / 16-bit 레트로 게임 느낌)
- **귀여운 강아지** 캐릭터
- **밝고 따뜻한 색상**
- **명확한 윤곽선** (검은색 또는 어두운 테두리)
- **간단하고 귀여운 디자인**

### 기술 스펙
- **포맷**: PNG (투명 배경)
- **색상 모드**: RGBA
- **픽셀 퍼펙트**: 안티앨리어싱 없음
- **투명도**: 배경은 완전 투명

---

## 🐕 Part 1: 강아지 스프라이트 시트 (우선순위: 최상)

### 개요
- 레벨별로 크기가 다른 강아지 캐릭터
- 7가지 애니메이션 × 4프레임 = 28프레임
- 오른쪽 방향만 (왼쪽은 코드에서 반전 처리)

### 필요한 파일

#### 1. dog_level1.png
- **전체 크기**: 128×224 픽셀 (4열 × 7행)
- **셀 크기**: 32×32 픽셀
- **레이아웃**: 스프라이트 시트 (아래 구조 참고)

#### 2. dog_level2.png
- **전체 크기**: 192×336 픽셀
- **셀 크기**: 48×48 픽셀

#### 3. dog_level3.png
- **전체 크기**: 256×448 픽셀
- **셀 크기**: 64×64 픽셀

### 스프라이트 시트 구조

```
┌─────────┬─────────┬─────────┬─────────┐
│ idle_1  │ idle_2  │ idle_3  │ idle_4  │  1행: 대기
├─────────┼─────────┼─────────┼─────────┤
│ walk_1  │ walk_2  │ walk_3  │ walk_4  │  2행: 걷기
├─────────┼─────────┼─────────┼─────────┤
│ run_1   │ run_2   │ run_3   │ run_4   │  3행: 달리기
├─────────┼─────────┼─────────┼─────────┤
│ eat_1   │ eat_2   │ eat_3   │ eat_4   │  4행: 먹기
├─────────┼─────────┼─────────┼─────────┤
│ sleep_1 │ sleep_2 │ sleep_3 │ sleep_4 │  5행: 자기
├─────────┼─────────┼─────────┼─────────┤
│ sit_1   │ sit_2   │ sit_3   │ sit_4   │  6행: 앉기
├─────────┼─────────┼─────────┼─────────┤
│ jump_1  │ jump_2  │ jump_3  │ jump_4  │  7행: 점프 (현재 미사용)
└─────────┴─────────┴─────────┴─────────┘
```

### 애니메이션 상세 설명

| 행 | 애니메이션 | 설명 | 프레임 가이드 |
|----|----------|------|--------------|
| 1 | idle (대기) | 가만히 서있는 모습 | 약간의 호흡 애니메이션 (몸이 살짝 움직임) |
| 2 | walking (걷기) | 천천히 걷는 모습 | 다리가 번갈아가며 움직임 |
| 3 | running (달리기) | 빠르게 달리는 모습 | 걷기보다 역동적인 자세 |
| 4 | eating (먹기) | 먹이를 먹는 모습 | 고개를 숙이고 입을 움직임 |
| 5 | sleeping (자기) | 자는 모습 | 눈 감고 누워있거나 웅크리고 있음, Z 표시 선택적 |
| 6 | sitting (앉기) | 앉아있는 모습 | 엉덩이를 땅에 대고 앉은 자세 |
| 7 | jumping (점프) | 점프하는 모습 | 땅에서 점프 → 공중 → 착지 (선택적) |

### 강아지 디자인 가이드
- **견종**: 시바견, 코기, 포메라니안 등 귀여운 소형견 스타일
- **색상**: 갈색/베이지/흰색 계열 (따뜻한 느낌)
- **표정**: 귀엽고 친근한 표정
- **귀**: 쫑긋하거나 축 늘어진 귀
- **꼬리**: 짧고 귀여운 꼬리 (흔들기 애니메이션 가능)

---

## 🍖 Part 2: 먹이 스프라이트 (우선순위: 높음)

모든 먹이는 **16×16 픽셀** 크기

### 필요한 파일 (5개)

#### 1. bone.png (뼈다귀 🦴)
- 흰색/베이지색 개 뼈다귀
- 클래식한 뼈다귀 모양

#### 2. fish.png (생선 🐟)
- 파란색/회색 물고기
- 단순한 물고기 실루엣

#### 3. meat.png (고기 🥩)
- 빨간색/갈색 고기 덩어리
- 스테이크 또는 고기 조각

#### 4. snack.png (간식 🍪)
- 갈색 간식/쿠키
- 둥근 비스킷 모양

#### 5. special.png (특별식 ⭐)
- 황금색/반짝이는 특별한 먹이
- 별 모양 또는 왕관 장식 추가
- 희귀한 느낌

---

## 👔 Part 3: 액세서리 스프라이트 (우선순위: 중간)

각 액세서리는 **3가지 크기** 필요 (레벨별)
- 32×32px (레벨 1용)
- 48×48px (레벨 2용)
- 64×64px (레벨 3용)

**중요**: 강아지 위에 오버레이되므로 **투명 배경** 필수

### 모자 (Hats) - 3종

#### red_hat (빨간 모자)
- 빨간색 간단한 모자
- 강아지 머리 위에 놓일 위치

#### blue_hat (파란 모자)
- 파란색 간단한 모자

#### party_hat (파티 모자)
- 뾰족한 파티 모자
- 화려한 패턴

### 목걸이 (Necklaces) - 2종

#### simple_necklace (심플 목걸이)
- 은색/회색 간단한 목걸이
- 강아지 목 부분

#### gold_necklace (금 목걸이)
- 황금색 화려한 목걸이
- 빛나는 효과

### 안경 (Glasses) - 2종

#### sunglasses (선글라스)
- 검은색 선글라스
- 강아지 눈 위치

#### round_glasses (동그란 안경)
- 둥근 안경테
- 지적인 느낌

### 리본 (Ribbons) - 2종

#### pink_ribbon (분홍 리본)
- 분홍색 리본
- 강아지 머리 위 또는 귀 옆

#### red_ribbon (빨간 리본)
- 빨간색 리본

### 스카프 (Scarves) - 2종

#### blue_scarf (파란 스카프)
- 파란색 스카프
- 강아지 목 둘레

#### yellow_scarf (노란 스카프)
- 노란색 스카프

### 나비 넥타이 (Bows) - 2종

#### black_bow (검은 나비 넥타이)
- 검은색 나비 넥타이
- 강아지 목 아래

#### red_bow (빨간 나비 넥타이)
- 빨간색 나비 넥타이

---

## 📦 파일 네이밍 규칙

### 강아지 스프라이트
```
dog_level1.png
dog_level2.png
dog_level3.png
```

### 먹이
```
bone.png
fish.png
meat.png
snack.png
special.png
```

### 액세서리
```
red_hat_32.png
red_hat_48.png
red_hat_64.png
blue_hat_32.png
...
(각 액세서리마다 3개 크기)
```

---

## 🎨 Gemini 프롬프트 예시

### 강아지 스프라이트 시트 생성

```
Create a pixel art sprite sheet for a cute dog character in retro game style.

Specifications:
- Image size: 128x224 pixels
- Cell size: 32x32 pixels
- Layout: 4 columns × 7 rows
- Style: 16-bit pixel art, cute and friendly
- Background: Transparent (PNG)
- Dog facing: Right direction only
- Colors: Warm browns, beiges, whites
- Outline: Dark border for clarity

Animations (each row has 4 frames):
Row 1: Idle animation (gentle breathing)
Row 2: Walking animation (legs moving)
Row 3: Running animation (dynamic pose)
Row 4: Eating animation (head down, mouth moving)
Row 5: Sleeping animation (eyes closed, curled up)
Row 6: Sitting animation (sitting position)
Row 7: Jumping animation (in air)

Dog design:
- Breed style: Shiba Inu or Corgi-like
- Expression: Cute and friendly
- Features: Perky ears, small tail, round body
- No anti-aliasing, pure pixel art
```

### 먹이 아이템 생성

```
Create pixel art food items for a virtual pet game.

Specifications for each item:
- Size: 16x16 pixels
- Style: Simple, cute pixel art
- Background: Transparent (PNG)
- Outline: Dark border
- No anti-aliasing

Items to create:

1. Bone (bone.png)
   - White/beige dog bone
   - Classic bone shape

2. Fish (fish.png)
   - Blue/gray fish
   - Simple fish silhouette

3. Meat (meat.png)
   - Red/brown meat piece
   - Steak or meat chunk

4. Snack (snack.png)
   - Brown cookie/biscuit
   - Round shape

5. Special food (special.png)
   - Golden/shiny special food
   - Star shape or with crown decoration
   - Rare and precious look
```

### 액세서리 생성

```
Create pixel art accessories for a dog character, transparent background.

Specifications:
- Sizes needed: 32x32px, 48x48px, 64x64px (three versions of each)
- Style: Simple pixel art accessories
- Background: Fully transparent
- These will overlay on the dog sprite

Accessories to create:

1. Red Hat
   - Simple red cap/hat
   - Positioned for dog's head

2. Blue Hat
   - Simple blue cap/hat

3. Party Hat
   - Cone-shaped party hat
   - Colorful pattern

[Continue with other accessories...]

Create clean, simple designs that will look good when overlaid on a dog sprite.
```

---

## ✅ 제작 체크리스트

### 필수 파일 (최우선)
- [ ] dog_level1.png (128×224px)
- [ ] bone.png (16×16px)
- [ ] fish.png (16×16px)
- [ ] meat.png (16×16px)
- [ ] snack.png (16×16px)
- [ ] special.png (16×16px)

### 추가 강아지 크기 (우선)
- [ ] dog_level2.png (192×336px)
- [ ] dog_level3.png (256×448px)

### 액세서리 - 모자 (선택)
- [ ] red_hat (32, 48, 64px)
- [ ] blue_hat (32, 48, 64px)
- [ ] party_hat (32, 48, 64px)

### 액세서리 - 목걸이 (선택)
- [ ] simple_necklace (32, 48, 64px)
- [ ] gold_necklace (32, 48, 64px)

### 액세서리 - 안경 (선택)
- [ ] sunglasses (32, 48, 64px)
- [ ] round_glasses (32, 48, 64px)

### 액세서리 - 리본 (선택)
- [ ] pink_ribbon (32, 48, 64px)
- [ ] red_ribbon (32, 48, 64px)

### 액세서리 - 스카프 (선택)
- [ ] blue_scarf (32, 48, 64px)
- [ ] yellow_scarf (32, 48, 64px)

### 액세서리 - 나비 넥타이 (선택)
- [ ] black_bow (32, 48, 64px)
- [ ] red_bow (32, 48, 64px)

---

## 📊 총 파일 수

| 카테고리 | 파일 수 |
|---------|--------|
| 강아지 스프라이트 | 3개 |
| 먹이 | 5개 |
| 액세서리 (13종 × 3크기) | 39개 |
| **총계** | **47개** |

---

## 🎯 단계별 진행 권장

### Phase 1: 핵심 (필수)
1. dog_level1.png - 가장 중요!
2. 먹이 5종 (bone, fish, meat, snack, special)

### Phase 2: 확장
3. dog_level2.png
4. dog_level3.png

### Phase 3: 꾸미기 (선택)
5. 액세서리 3-5종 선택해서 제작
6. 나머지 액세서리

---

## 💡 팁

1. **일관성**: 모든 이미지에서 색상 팔레트와 픽셀 스타일 일관되게 유지
2. **대비**: 배경 투명이므로 윤곽선 명확히
3. **단순함**: 작은 크기이므로 너무 복잡하지 않게
4. **테스트**: 완성 후 실제 게임에서 보이는 크기로 축소해서 확인

---

## 📁 최종 폴더 구조

```
sprites/
├── dog/
│   ├── dog_level1.png
│   ├── dog_level2.png
│   └── dog_level3.png
├── food/
│   ├── bone.png
│   ├── fish.png
│   ├── meat.png
│   ├── snack.png
│   └── special.png
└── accessories/
    ├── hats/
    │   ├── red_hat_32.png
    │   ├── red_hat_48.png
    │   └── red_hat_64.png
    ├── necklaces/
    ├── glasses/
    ├── ribbons/
    ├── scarves/
    └── bows/
```

---

## 🔄 완성 후 적용 방법

이미지 완성 후:
1. 파일명이 정확한지 확인
2. 크기가 정확한지 확인
3. 배경이 투명한지 확인
4. 저에게 전달하면 코드에 통합해드리겠습니다!

---

**제작 시작하기 전에 dog_level1.png 샘플 1개만 먼저 만들어서 스타일 확인하는 것을 추천드립니다!**
