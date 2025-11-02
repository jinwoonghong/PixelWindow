# Stable Diffusion 이미지 배치 생성 가이드

PixelWindow 게임용 이미지를 Stable Diffusion으로 배치 생성하는 완벽 가이드입니다.

---

## 📋 목차
1. [시스템 요구사항](#1-시스템-요구사항)
2. [Stable Diffusion 설치](#2-stable-diffusion-설치)
3. [배치 생성 방법](#3-배치-생성-방법)
4. [투명 배경 처리](#4-투명-배경-처리)
5. [트러블슈팅](#5-트러블슈팅)

---

## 1. 시스템 요구사항

### 최소 사양
- **GPU**: NVIDIA GPU (4GB VRAM 이상)
  - GTX 1060 6GB 이상 권장
  - RTX 시리즈 추천 (빠른 생성)
- **RAM**: 8GB 이상 (16GB 권장)
- **저장공간**: 20GB 이상
- **OS**: Windows 10/11, Linux, macOS (M1/M2)

### GPU 확인 방법
```bash
# Windows - 명령 프롬프트에서
nvidia-smi

# 출력 예시:
# NVIDIA GeForce RTX 3060
# Memory Usage: 12GB
```

> **중요**: NVIDIA GPU가 없다면 CPU로도 가능하지만 매우 느립니다 (이미지당 5~10분).
> AMD GPU는 별도 설정 필요합니다.

---

## 2. Stable Diffusion 설치

### 방법 A: Automatic1111 WebUI (추천)

가장 많이 사용되는 방법으로, GUI가 있어 사용하기 쉽습니다.

#### Step 1: Python 설치
```bash
# Python 3.10.6 설치 (공식 웹사이트에서 다운로드)
# https://www.python.org/downloads/release/python-3106/

# 설치 확인
python --version
# Python 3.10.6
```

#### Step 2: Git 설치
```bash
# Git 다운로드 및 설치
# https://git-scm.com/downloads

# 설치 확인
git --version
```

#### Step 3: Stable Diffusion WebUI 설치

**Windows:**
```bash
# 1. 작업 폴더 생성 및 이동
mkdir C:\StableDiffusion
cd C:\StableDiffusion

# 2. WebUI 클론
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# 3. 실행 (처음에는 자동으로 모든 것을 다운로드함)
webui-user.bat
```

**Linux / macOS:**
```bash
# 1. 작업 폴더 생성 및 이동
mkdir ~/StableDiffusion
cd ~/StableDiffusion

# 2. WebUI 클론
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# 3. 실행
./webui.sh
```

#### Step 4: 모델 다운로드

WebUI가 실행되면 자동으로 기본 모델을 다운로드하지만, 픽셀 아트에 특화된 모델을 추가로 설치하는 것을 권장합니다.

**추천 모델:**

1. **Pixel Art Diffusion XL** (픽셀 아트 전문)
   - 다운로드: https://civitai.com/models/120096/pixel-art-diffusion-xl
   - 설치 위치: `stable-diffusion-webui/models/Stable-diffusion/`

2. **ReV Animated** (만화/일러스트 스타일)
   - 다운로드: https://civitai.com/models/7371/rev-animated
   - 설치 위치: `stable-diffusion-webui/models/Stable-diffusion/`

3. **Dreamshaper** (다목적, 고품질)
   - 다운로드: https://civitai.com/models/4384/dreamshaper
   - 설치 위치: `stable-diffusion-webui/models/Stable-diffusion/`

**모델 설치 방법:**
```bash
# 다운로드한 .safetensors 파일을 다음 폴더에 복사
C:\StableDiffusion\stable-diffusion-webui\models\Stable-diffusion\
```

#### Step 5: WebUI 접속

설치가 완료되면 브라우저에서 접속:
```
http://127.0.0.1:7860
```

---

### 방법 B: ComfyUI (고급 사용자용)

워크플로우 기반으로 더 강력하지만 학습 곡선이 있습니다.

```bash
# 설치
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt

# 실행
python main.py

# 접속: http://127.0.0.1:8188
```

---

## 3. 배치 생성 방법

### 방법 1: WebUI txt2img 배치 모드 (간단)

#### Step 1: WebUI 접속
```
http://127.0.0.1:7860
```

#### Step 2: 프롬프트 입력

**txt2img 탭**에서:

```
Prompt:
cute pixel art dog bone icon, game asset, white bone, transparent background, centered, simple design, 1024x1024, high quality, clean silhouette

Negative Prompt:
background, complex, blurry, low quality, watermark, text, multiple objects, shadow
```

#### Step 3: 설정

```
Width: 1024
Height: 1024
Batch count: 1
Batch size: 4    ← 한번에 4개 생성
CFG Scale: 7
Steps: 30
Sampler: DPM++ 2M Karras
Model: Pixel Art Diffusion XL (선택한 모델)
```

#### Step 4: 생성

**Generate** 버튼 클릭 → 한번에 4개 이미지 생성됨

#### Step 5: 다음 아이템으로 프롬프트 변경

```
Prompt:
cute pixel art fish icon, game asset, fresh salmon, transparent background, centered, simple design, 1024x1024, high quality

Negative Prompt: (동일)
```

**Generate** 클릭 → 4개 더 생성

이 과정을 반복하면 됩니다.

---

### 방법 2: 프롬프트 파일로 배치 생성 (자동화)

#### Step 1: 프롬프트 파일 생성

프로젝트 폴더에 `prompts/` 디렉토리를 만들고 `food_items.txt` 파일 생성:

```
# food_items.txt

[dog bone] cute pixel art dog bone icon, game asset, white bone, transparent background, centered, simple design, 1024x1024, high quality
[fish] cute pixel art fish icon, game asset, fresh salmon, transparent background, centered, simple design, 1024x1024, high quality
[meat] cute pixel art premium meat icon, game asset, juicy steak, transparent background, centered, simple design, 1024x1024, high quality
[snack] cute pixel art dog treat icon, game asset, dog biscuit, transparent background, centered, simple design, 1024x1024, high quality
[special] cute pixel art premium dog food icon, game asset, golden bowl with sparkles, transparent background, centered, special glow effect, 1024x1024, high quality
```

#### Step 2: WebUI 스크립트 사용

WebUI에서 **Script** 드롭다운 → **Prompts from file or textbox** 선택

1. **Prompts from file** 선택
2. 위에서 만든 `food_items.txt` 파일 선택
3. **Iterate seed every line** 체크 (각 프롬프트마다 다른 이미지)
4. **Generate** 클릭

→ 파일의 모든 프롬프트가 자동으로 배치 생성됩니다!

---

### 방법 3: Python 스크립트로 완전 자동화 (최고급)

#### batch_generate.py 생성

```python
import requests
import json
import base64
import os

# WebUI API 엔드포인트
url = "http://127.0.0.1:7860/sdapi/v1/txt2img"

# 생성할 이미지 리스트
images_to_generate = [
    {
        "filename": "bone.png",
        "prompt": "cute pixel art dog bone icon, game asset, white bone, transparent background, centered, simple design, 1024x1024, high quality, clean silhouette",
    },
    {
        "filename": "fish.png",
        "prompt": "cute pixel art fish icon, game asset, fresh salmon, transparent background, centered, simple design, 1024x1024, high quality",
    },
    {
        "filename": "meat.png",
        "prompt": "cute pixel art premium meat icon, game asset, juicy steak, transparent background, centered, simple design, 1024x1024, high quality",
    },
    {
        "filename": "snack.png",
        "prompt": "cute pixel art dog treat icon, game asset, dog biscuit, transparent background, centered, simple design, 1024x1024, high quality",
    },
    {
        "filename": "special.png",
        "prompt": "cute pixel art premium dog food icon, game asset, golden bowl with sparkles, transparent background, centered, special glow effect, 1024x1024, high quality",
    },
]

# 공통 설정
payload_template = {
    "prompt": "",
    "negative_prompt": "background, complex, blurry, low quality, watermark, text, multiple objects, shadow, gradient background",
    "steps": 30,
    "cfg_scale": 7,
    "width": 1024,
    "height": 1024,
    "sampler_name": "DPM++ 2M Karras",
    "batch_size": 1,
}

# 출력 폴더
output_dir = "generated_images"
os.makedirs(output_dir, exist_ok=True)

# 배치 생성
for item in images_to_generate:
    print(f"Generating {item['filename']}...")

    payload = payload_template.copy()
    payload["prompt"] = item["prompt"]

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        result = response.json()

        # 첫 번째 이미지 저장
        image_data = base64.b64decode(result['images'][0])

        filepath = os.path.join(output_dir, item['filename'])
        with open(filepath, 'wb') as f:
            f.write(image_data)

        print(f"✓ Saved: {filepath}")
    else:
        print(f"✗ Failed: {item['filename']}")

print("\n🎉 All images generated!")
```

#### 실행

1. WebUI 실행 시 API 활성화:
   ```bash
   # webui-user.bat 또는 webui.sh에 추가
   --api --listen
   ```

2. Python 스크립트 실행:
   ```bash
   python batch_generate.py
   ```

→ 완전 자동으로 모든 이미지 생성!

---

## 4. 투명 배경 처리

Stable Diffusion은 기본적으로 투명 배경을 만들지 못합니다. 두 가지 방법이 있습니다:

### 방법 1: LayerDiffusion Extension (WebUI 확장)

투명 배경을 직접 생성할 수 있는 확장 프로그램입니다.

#### 설치:
```bash
# WebUI에서 Extensions → Available → LayerDiffusion 검색 → Install
# 재시작
```

#### 사용:
1. **txt2img** 탭에서 이미지 생성
2. **LayerDiffusion** 섹션 활성화
3. **Transparent Background** 체크
4. 생성하면 자동으로 투명 배경 PNG

### 방법 2: 후처리로 배경 제거 (추천)

생성된 이미지의 배경을 자동으로 제거합니다.

#### rembg 설치:
```bash
pip install rembg[gpu]  # GPU 버전
# 또는
pip install rembg       # CPU 버전
```

#### 사용:
```bash
# 단일 이미지
rembg i input.png output.png

# 폴더 전체 배치 처리
rembg p generated_images/ transparent_images/
```

#### Python 스크립트로 자동화:

```python
from rembg import remove
from PIL import Image
import os

input_folder = "generated_images"
output_folder = "transparent_images"
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.endswith('.png'):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)

        print(f"Processing {filename}...")

        with open(input_path, 'rb') as i:
            with open(output_path, 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data)
                o.write(output_data)

        print(f"✓ Saved: {output_path}")

print("🎉 All backgrounds removed!")
```

---

## 5. 트러블슈팅

### 문제 1: "CUDA out of memory" 오류

**해결 방법:**
```bash
# webui-user.bat 또는 webui.sh에 추가
--medvram  # VRAM 6GB 이하
# 또는
--lowvram  # VRAM 4GB 이하
```

또는 WebUI 설정:
- Settings → Compute Settings → Enable Tiling
- Batch size를 1로 줄이기

### 문제 2: 생성 속도가 너무 느림

**해결 방법:**
- Steps를 30 → 20으로 줄이기
- Sampler를 "Euler a"로 변경 (더 빠름)
- xFormers 활성화:
  ```bash
  --xformers
  ```

### 문제 3: 이미지가 프롬프트와 다름

**해결 방법:**
- CFG Scale 높이기 (7 → 9)
- Negative prompt 강화
- 더 나은 모델 사용 (Pixel Art Diffusion XL)
- Prompt 더 구체적으로 작성

### 문제 4: 배경이 투명하지 않음

**해결 방법:**
- LayerDiffusion extension 사용
- 또는 rembg로 후처리
- Prompt에 "white background" 추가 후 rembg 처리 (더 깔끔함)

### 문제 5: NVIDIA GPU가 없음

**해결 방법:**
- Google Colab 사용 (무료 GPU 제공)
  - https://colab.research.google.com
  - Stable Diffusion WebUI Colab 노트북 사용
- 또는 온라인 서비스 이용:
  - https://replicate.com
  - https://huggingface.co/spaces

---

## 📚 유용한 링크

- **Automatic1111 WebUI**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **모델 다운로드**: https://civitai.com
- **프롬프트 가이드**: https://prompthero.com/stable-diffusion-prompts
- **한국어 커뮤니티**: https://arca.live/b/aiart

---

## 🎯 빠른 시작 요약

```bash
# 1. 설치
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
webui-user.bat  # Windows
# ./webui.sh    # Linux/Mac

# 2. 모델 다운로드
# Pixel Art Diffusion XL을 models/Stable-diffusion/에 저장

# 3. WebUI 접속
# http://127.0.0.1:7860

# 4. 이미지 생성
# - Prompt 입력
# - Settings 설정 (1024x1024, batch size 4)
# - Generate 클릭

# 5. 배경 제거
pip install rembg[gpu]
rembg p generated_images/ assets/sprites/food/

# 완료! 🎉
```

---

## 💡 Pro Tips

1. **Seed 고정**: 같은 seed 값을 사용하면 스타일이 일관됩니다
   - 첫 이미지의 seed 값을 복사
   - 나머지 이미지에 같은 seed 사용

2. **ControlNet 사용**: 더 정확한 구도 제어
   - ControlNet extension 설치
   - 스케치를 그려서 정확한 형태 지정

3. **Upscaling**: 더 고해상도 이미지
   - Extras 탭 → Upscale
   - R-ESRGAN 4x 사용

4. **Inpainting**: 부분 수정
   - img2img 탭 → Inpaint
   - 수정할 부분만 브러시로 선택

5. **X/Y Plot**: 여러 설정 테스트
   - Script → X/Y/Z Plot
   - 여러 프롬프트나 설정을 한번에 비교

Happy generating! 🎨
