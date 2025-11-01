# 🤖 Gemini 이미지 생성 프롬프트 모음

바로 복사해서 Gemini에 붙여넣을 수 있는 프롬프트들입니다.

---

## 🐕 프롬프트 1: 강아지 스프라이트 시트 (레벨 1)

```
Create a pixel art sprite sheet for a cute dog character.

Image specifications:
- Total size: 128 pixels wide × 224 pixels tall
- Grid: 4 columns × 7 rows
- Each cell: 32×32 pixels
- File format: PNG with transparent background
- Style: 16-bit retro pixel art, cute and colorful
- Direction: Dog facing RIGHT only
- No anti-aliasing (pure pixel art)

Dog design:
- Breed: Shiba Inu or Corgi style (cute small dog)
- Colors: Warm browns, oranges, beiges, with white accents
- Features: Round body, perky ears, small tail, friendly eyes
- Outline: Dark brown or black border for clarity

Sprite sheet layout (each row has 4 animation frames):

Row 1 - IDLE animation:
Frame 1-4: Dog standing still with gentle breathing motion
- Slight body movement up and down
- Tail may wag slightly

Row 2 - WALKING animation:
Frame 1-4: Dog walking slowly
- Legs moving alternately
- Body bobbing naturally
- Tail wagging

Row 3 - RUNNING animation:
Frame 1-4: Dog running fast
- More dynamic leg positions
- Body stretched forward
- Ears flowing back

Row 4 - EATING animation:
Frame 1-4: Dog eating food
- Head lowered toward ground
- Mouth opening and closing
- Happy expression

Row 5 - SLEEPING animation:
Frame 1-4: Dog sleeping
- Curled up or lying down
- Eyes closed
- Gentle breathing (optional Z symbols)

Row 6 - SITTING animation:
Frame 1-4: Dog sitting
- Bottom on ground
- Front legs straight
- Slight idle movement

Row 7 - JUMPING animation:
Frame 1-4: Dog jumping
- Takeoff, airborne, landing sequence
- Legs tucked in mid-air

Important:
- Keep design simple and clear at small size
- Strong outlines for visibility
- Consistent style across all frames
- Background must be fully transparent
- Each 32×32 cell should contain one complete frame
```

---

## 🍖 프롬프트 2: 먹이 아이템 (5종)

```
Create 5 pixel art food items for a virtual pet game. Each item should be a separate image.

General specifications for ALL items:
- Size: 16×16 pixels each
- Format: PNG with transparent background
- Style: Cute pixel art, simple and clear
- Outline: Dark border (black or dark brown)
- No anti-aliasing
- Bright, appetizing colors

Item 1 - Dog Bone (bone.png):
- Classic dog bone shape
- White or cream color
- Two round ends connected by narrow middle

Item 2 - Fish (fish.png):
- Simple fish silhouette
- Blue-gray color with white belly
- Eye and fin visible
- Facing right

Item 3 - Meat (meat.png):
- Steak or meat chunk
- Red/dark red color
- Small white fat marbling
- Juicy appearance

Item 4 - Snack/Cookie (snack.png):
- Round cookie or dog treat
- Brown/tan color
- Simple pattern or dots

Item 5 - Special Food (special.png):
- Premium/rare food item
- Golden/yellow color with sparkles
- Star shape OR regular food with crown on top
- Shiny/glowing effect
- This should look more special than others

Make each item easily recognizable even at small size!
```

---

## 👔 프롬프트 3: 액세서리 - 모자 3종

```
Create 3 types of cute hats for a pixel art dog character. Each hat needs 3 different sizes.

Technical specs:
- Format: PNG with transparent background
- Style: Simple pixel art accessories
- Three sizes for EACH hat:
  * Small: 32×32 pixels
  * Medium: 48×48 pixels
  * Large: 64×64 pixels
- These will overlay on top of dog sprite
- Position: Top of dog's head

Hat 1 - Red Hat (red_hat):
- Simple red cap or beanie
- Bright red color (#FF0000 or similar)
- Small brim or no brim

Hat 2 - Blue Hat (blue_hat):
- Simple blue cap
- Bright blue color (#0066FF or similar)
- Similar style to red hat

Hat 3 - Party Hat (party_hat):
- Cone-shaped party hat
- Colorful stripes (red, blue, yellow)
- Small pom-pom on top
- Festive and fun

Design notes:
- Keep designs simple and clear
- Strong outlines
- Hats should fit naturally on dog's head
- Scale each design proportionally for 3 sizes
```

---

## 👓 프롬프트 4: 액세서리 - 안경과 목걸이

```
Create accessories for a pixel art dog: 2 glasses and 2 necklaces. Each needs 3 sizes.

Specifications:
- PNG with transparent background
- Three sizes EACH: 32×32px, 48×48px, 64×64px
- Simple pixel art style
- Will overlay on dog sprite

GLASSES (position: on dog's eyes/face)

1. Sunglasses (sunglasses):
- Black or dark gray cool sunglasses
- Horizontal rectangular lenses
- Simple frame

2. Round Glasses (round_glasses):
- Circular wire-frame glasses
- Gold or brown frame
- Intellectual/nerdy look
- Thin frame

NECKLACES (position: around dog's neck)

1. Simple Necklace (simple_necklace):
- Thin silver/gray chain
- Small circular pendant
- Minimalist design

2. Gold Necklace (gold_necklace):
- Thick golden chain
- Large pendant (heart or jewel)
- Shiny/sparkly effect
- Luxurious appearance

Keep designs simple but recognizable at small sizes!
```

---

## 🎀 프롬프트 5: 액세서리 - 리본과 장식

```
Create cute decorative accessories for pixel art dog: ribbons, scarves, and bow ties.
Each item needs 3 sizes: 32×32px, 48×48px, 64×64px.

Format: PNG with transparent background

RIBBONS (position: on head/ears)

1. Pink Ribbon (pink_ribbon):
- Bright pink bow ribbon
- Two loops and two tails
- Placed on top of head or by ear

2. Red Ribbon (red_ribbon):
- Bright red bow ribbon
- Same style as pink but red color

SCARVES (position: around neck)

1. Blue Scarf (blue_scarf):
- Blue knitted scarf
- Wrapped around neck
- Ends hanging down

2. Yellow Scarf (yellow_scarf):
- Yellow/golden scarf
- Same style as blue

BOW TIES (position: under neck/chin)

1. Black Bow Tie (black_bow):
- Classic black bow tie
- Formal appearance
- Center knot visible

2. Red Bow Tie (red_bow):
- Red bow tie
- Same formal style
- Festive look

Make each accessory cute and clearly visible on the dog!
```

---

## 📋 빠른 체크리스트

### 최우선 (반드시 필요)
- [ ] 강아지 스프라이트 시트 레벨1 (128×224px) - **프롬프트 1**
- [ ] 먹이 5종 (각 16×16px) - **프롬프트 2**

### 추가 강아지 크기
- [ ] 강아지 레벨2 (192×336px) - 프롬프트 1을 48px 셀로 수정
- [ ] 강아지 레벨3 (256×448px) - 프롬프트 1을 64px 셀로 수정

### 액세서리 (선택사항)
- [ ] 모자 3종 (각 3크기) - **프롬프트 3**
- [ ] 안경 2종 + 목걸이 2종 (각 3크기) - **프롬프트 4**
- [ ] 리본/스카프/넥타이 6종 (각 3크기) - **프롬프트 5**

---

## 💡 사용 팁

1. **한 번에 하나씩**: 프롬프트 하나씩 Gemini에 입력
2. **결과 확인**: 생성된 이미지 확인 후 다음 단계 진행
3. **수정 요청**: 마음에 안 들면 "make it cuter", "use brighter colors" 등으로 수정 요청
4. **샘플 먼저**: 강아지 스프라이트 시트 먼저 만들어서 스타일 확인

---

## 🔄 레벨 2, 3 강아지 생성 방법

프롬프트 1을 복사한 후 다음 부분만 수정:

### 레벨 2 (중간 크기)
```
- Total size: 192 pixels wide × 336 pixels tall
- Each cell: 48×48 pixels
```

### 레벨 3 (큰 크기)
```
- Total size: 256 pixels wide × 448 pixels tall
- Each cell: 64×64 pixels
```

나머지는 동일하게 유지!

---

## 📥 다운로드 후 할 일

1. 파일명 확인 (예: dog_level1.png, bone.png 등)
2. 크기 확인 (정확한 픽셀 크기)
3. 투명 배경 확인
4. 저에게 전달 → 코드에 통합!

---

**추천 순서**: 프롬프트 1 → 프롬프트 2 → (확인) → 프롬프트 3~5
