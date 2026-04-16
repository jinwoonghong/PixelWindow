# Stable Diffusion 배치 생성 가이드

PixelWindow 게임 이미지를 Stable Diffusion으로 자동 생성하는 방법입니다.

---

## 🚀 빠른 시작

### 1단계: Stable Diffusion WebUI 설치 및 실행

```bash
# 설치 (최초 1회)
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Windows
webui-user.bat --api

# Linux/Mac
./webui.sh --api
```

> **중요**: `--api` 플래그가 반드시 필요합니다!

### 2단계: 모델 다운로드 (선택 사항, 권장)

더 나은 픽셀 아트를 위해 특화 모델 다운로드:

- **Pixel Art Diffusion XL**: https://civitai.com/models/120096/pixel-art-diffusion-xl
- 다운로드 후 `stable-diffusion-webui/models/Stable-diffusion/` 폴더에 저장

### 3단계: Python 의존성 설치

```bash
# 배치 생성 스크립트용
pip install requests pillow

# 배경 제거용 (선택 사항)
pip install rembg[gpu]  # NVIDIA GPU가 있는 경우
# 또는
pip install rembg       # CPU만 있는 경우
```

### 4단계: 배치 생성 실행

```bash
cd prompts
python batch_generate.py
```

메뉴에서 원하는 옵션 선택:
1. 먹이 아이템만 (5개)
2. 액세서리만 (13개)
3. 강아지 참고 이미지 (1개)
4. 먹이 + 액세서리 (18개)
5. 모두 (19개)

### 5단계: 배경 제거 (선택 사항)

```bash
python remove_background.py
```

입력 폴더: `generated_images`
출력 폴더: `transparent_images`

---

## 📁 파일 설명

### `batch_generate.py`
- **기능**: WebUI API를 사용하여 모든 이미지 자동 생성
- **설정 가능 항목**:
  - `API_URL`: WebUI 주소 (기본값: http://127.0.0.1:7860)
  - `DEFAULT_SETTINGS`: 생성 설정 (steps, cfg_scale, sampler 등)
  - `NEGATIVE_PROMPT`: 제외할 요소

### `remove_background.py`
- **기능**: 생성된 이미지의 배경을 투명하게 제거
- **의존성**: `rembg`, `pillow`

### `food_items.txt`
- **기능**: WebUI의 "Prompts from file" 기능용 프롬프트 파일
- **사용법**: WebUI → Script → "Prompts from file or textbox" → 파일 선택

### `accessories.txt`
- **기능**: 액세서리 이미지용 프롬프트 파일
- **사용법**: 위와 동일

---

## 🎨 수동 생성 방법 (WebUI 사용)

자동 스크립트를 사용하지 않고 WebUI에서 직접 생성하는 방법:

### 방법 1: 하나씩 생성

1. WebUI 접속: http://127.0.0.1:7860
2. **txt2img** 탭 선택
3. 프롬프트 입력:
   ```
   Prompt:
   cute pixel art dog bone icon, game asset, white bone, transparent background, centered, simple design, 1024x1024, high quality, clean silhouette

   Negative Prompt:
   background, complex, blurry, low quality, watermark, text, multiple objects, shadow
   ```
4. 설정:
   - Width: 1024
   - Height: 1024
   - Batch size: 4 (한번에 4개 생성)
   - CFG Scale: 7
   - Steps: 30
   - Sampler: DPM++ 2M Karras

5. **Generate** 클릭
6. 마음에 드는 이미지 저장

### 방법 2: 프롬프트 파일로 배치 생성

1. WebUI → **txt2img** 탭
2. 하단 **Script** 드롭다운 → **Prompts from file or textbox** 선택
3. **Prompts from file** 옵션 선택
4. `food_items.txt` 또는 `accessories.txt` 파일 선택
5. **Iterate seed every line** 체크
6. **Generate** 클릭 → 모든 프롬프트 자동 생성!

---

## ⚙️ 설정 튜닝

### 더 빠르게 생성하려면:
```python
DEFAULT_SETTINGS = {
    "steps": 20,              # 30 → 20
    "sampler_name": "Euler a",  # 더 빠른 샘플러
}
```

### 더 정확하게 생성하려면:
```python
DEFAULT_SETTINGS = {
    "steps": 40,              # 30 → 40
    "cfg_scale": 9,           # 7 → 9 (프롬프트 더 충실)
}
```

### GPU 메모리 부족 시:
WebUI 실행 시:
```bash
# Windows
webui-user.bat --api --medvram

# Linux/Mac
./webui.sh --api --medvram
```

또는 `batch_generate.py`에서:
```python
DEFAULT_SETTINGS = {
    "batch_size": 1,  # 4 → 1로 줄이기
}
```

---

## 🐛 트러블슈팅

### 문제: "Connection refused" 오류

**원인**: WebUI가 실행되지 않았거나 API가 비활성화됨

**해결**:
```bash
# --api 플래그로 실행
./webui.sh --api
```

### 문제: 배경이 투명하지 않음

**해결책 1**: LayerDiffusion extension 사용
- WebUI → Extensions → Available → "LayerDiffusion" 검색 → Install
- 재시작 후 사용

**해결책 2**: rembg로 후처리
```bash
python remove_background.py
```

### 문제: 생성 속도가 너무 느림

**원인**: GPU가 없거나 설정이 너무 높음

**해결**:
- Steps 줄이기 (30 → 20)
- Batch size 줄이기 (4 → 1)
- 더 빠른 샘플러 사용 (Euler a)

### 문제: 이미지가 프롬프트와 다름

**해결**:
- CFG Scale 높이기 (7 → 9)
- Negative prompt 강화
- 다른 모델 시도 (Pixel Art Diffusion XL)
- Seed 고정해서 여러 번 시도

---

## 📊 예상 소요 시간

| 작업 | RTX 3060 | GTX 1060 | CPU |
|------|----------|----------|-----|
| 먹이 5개 | ~5분 | ~10분 | ~50분 |
| 액세서리 13개 | ~13분 | ~25분 | ~2시간 |
| 모두 19개 | ~20분 | ~40분 | ~3시간 |

*Steps: 30, Batch size: 1 기준*

---

## 💡 팁

### 1. Seed 고정으로 스타일 통일

첫 이미지 생성 후 seed 값을 복사하여 나머지 이미지에 적용:

```python
DEFAULT_SETTINGS = {
    "seed": 123456789,  # -1 → 고정 seed
}
```

### 2. 여러 변형 생성 후 선택

```python
DEFAULT_SETTINGS = {
    "batch_size": 4,  # 한번에 4개 생성
}
```

각 프롬프트당 4개 변형이 생성되므로 마음에 드는 것 선택

### 3. 프롬프트 커스터마이징

`batch_generate.py`에서 프롬프트를 자유롭게 수정:

```python
FOOD_ITEMS = [
    {
        "filename": "bone.png",
        "prompt": "YOUR CUSTOM PROMPT HERE",  # 여기 수정
        ...
    },
]
```

### 4. 단계별 생성

한번에 모두 생성하지 말고:
1. 먹이 5개만 먼저 생성
2. 결과 확인 후 설정 조정
3. 나머지 생성

---

## 🎯 최종 체크리스트

- [ ] Stable Diffusion WebUI 설치 완료
- [ ] WebUI를 `--api` 플래그로 실행
- [ ] Python 의존성 설치 (`requests`, `pillow`)
- [ ] `batch_generate.py` 실행
- [ ] 생성된 이미지 확인 (`generated_images/`)
- [ ] 필요시 배경 제거 (`remove_background.py`)
- [ ] 최종 이미지를 `assets/sprites/` 폴더로 이동

---

## 📚 추가 자료

- 상세 가이드: `../STABLE_DIFFUSION_GUIDE.md`
- 이미지 스펙: `../IMAGE_SPECS.md`
- WebUI 공식 문서: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki
- 모델 다운로드: https://civitai.com

---

Happy generating! 🎨
