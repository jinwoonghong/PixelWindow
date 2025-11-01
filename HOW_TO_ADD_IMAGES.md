# 🎨 이미지 파일 설치 가이드

## 📍 이미지 파일 위치

생성한 이미지 파일들을 다음 위치에 배치하세요:

```
src/assets/sprites/
├── dog/
│   ├── dog_level1.png  (128×224px)
│   ├── dog_level2.png  (192×336px - 선택)
│   └── dog_level3.png  (256×448px - 선택)
│
└── food/
    ├── bone.png        (16×16px)
    ├── fish.png        (16×16px)
    ├── meat.png        (16×16px)
    ├── snack.png       (16×16px)
    └── special.png     (16×16px)
```

## ✅ 필수 파일 (최소 6개)

게임을 실행하려면 다음 파일들이 **반드시** 필요합니다:

### 강아지 스프라이트
- `src/assets/sprites/dog/dog_level1.png`

### 먹이 이미지
- `src/assets/sprites/food/bone.png`
- `src/assets/sprites/food/fish.png`
- `src/assets/sprites/food/meat.png`
- `src/assets/sprites/food/snack.png`
- `src/assets/sprites/food/special.png`

## 🔄 이미지 없이 실행하면?

이미지가 없어도 게임은 작동합니다!
- 이미지가 없으면 자동으로 **코드 기반 픽셀 아트**로 표시됩니다
- 이미지를 추가하면 즉시 적용됩니다 (재빌드 필요)

## 📝 이미지 추가 후 실행 방법

```bash
# 1. 이미지 파일들을 위 폴더에 배치

# 2. 빌드
npm run build

# 3. 실행
npm start
```

## 🎯 테스트

이미지가 제대로 로드되었는지 확인:
1. 게임 실행
2. 개발자 도구 콘솔 (F12) 확인
3. "Pet sprite level1 loaded" 메시지 확인
4. "Food image bone loaded" 등의 메시지 확인

## ⚠️ 주의사항

- **파일명을 정확히** 맞춰주세요
- **파일 크기**가 정확해야 합니다
- **PNG 형식**이어야 합니다
- **투명 배경**이어야 합니다

## 📦 Git에 추가하기

이미지 파일들을 Git에 커밋하려면:

```bash
git add src/assets/sprites/
git commit -m "Add sprite images"
git push
```

---

**이미지를 로컬 PC에만 두고 싶다면**: `.gitignore`에 추가하세요
```
src/assets/sprites/*.png
```
