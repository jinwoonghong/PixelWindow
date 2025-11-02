# Windows에서 Stable Diffusion WebUI 설치 가이드

## 🚀 Step-by-Step 설치 가이드 (Windows)

---

## 1단계: 필수 프로그램 설치

### 1-1. Python 3.10.6 설치

> **중요**: 반드시 Python 3.10.6 버전을 설치해야 합니다!

1. 다운로드: https://www.python.org/ftp/python/3.10.6/python-3.10.6-amd64.exe

2. 설치 시 **중요**:
   - ✅ **"Add Python to PATH"** 체크박스 반드시 체크!
   - "Install Now" 클릭

3. 설치 확인:
   ```powershell
   python --version
   ```
   출력: `Python 3.10.6`

### 1-2. Git 설치

1. 다운로드: https://git-scm.com/download/win

2. 설치:
   - 기본 설정으로 계속 "Next" 클릭
   - 설치 완료

3. 설치 확인:
   ```powershell
   git --version
   ```
   출력: `git version 2.x.x`

---

## 2단계: Stable Diffusion WebUI 설치

### 2-1. 설치 폴더 생성

PowerShell 또는 명령 프롬프트를 **관리자 권한**으로 실행:

```powershell
# 작업 폴더 생성 (원하는 위치에 생성)
cd C:\
mkdir StableDiffusion
cd StableDiffusion
```

> 또는 원하는 다른 위치:
> ```powershell
> cd D:\
> mkdir AI
> cd AI
> ```

### 2-2. WebUI 다운로드

```powershell
# WebUI 클론 (5~10분 소요)
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git

# 폴더 이동
cd stable-diffusion-webui
```

현재 위치 확인:
```powershell
pwd
```
출력 예시: `C:\StableDiffusion\stable-diffusion-webui`

### 2-3. API 활성화 설정

`webui-user.bat` 파일을 편집해야 합니다.

**방법 1: 메모장으로 편집**
```powershell
notepad webui-user.bat
```

파일이 열리면 다음 줄을 찾아서:
```bat
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS=
```

이렇게 수정:
```bat
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set COMMANDLINE_ARGS=--api --listen
```

저장 후 닫기 (Ctrl+S → Alt+F4)

**방법 2: PowerShell로 자동 수정**
```powershell
(Get-Content webui-user.bat) -replace 'set COMMANDLINE_ARGS=', 'set COMMANDLINE_ARGS=--api --listen' | Set-Content webui-user.bat
```

---

## 3단계: 첫 실행 (모델 자동 다운로드)

### 3-1. WebUI 실행

```powershell
# 현재 위치가 stable-diffusion-webui 폴더인지 확인
# C:\StableDiffusion\stable-diffusion-webui

.\webui-user.bat
```

> **중요**: 첫 실행 시 자동으로 다음 항목들을 다운로드합니다:
> - Python 가상환경 생성
> - 필요한 라이브러리 설치
> - 기본 AI 모델 다운로드 (약 4GB)
>
> **소요 시간**: 20~40분 (인터넷 속도에 따라 다름)

### 3-2. 설치 진행 중 화면

다음과 같은 메시지들이 나타나면 정상입니다:

```
Python 3.10.6 found
Installing requirements...
Downloading model...
Loading model...
Running on local URL:  http://127.0.0.1:7860
```

### 3-3. 설치 완료 확인

다음 메시지가 나타나면 설치 완료:

```
Running on local URL:  http://127.0.0.1:7860

To create a public link, set `share=True` in `launch()`.
Startup time: XX.Xs
```

---

## 4단계: WebUI 접속

브라우저에서 접속:
```
http://127.0.0.1:7860
```

**Stable Diffusion WebUI** 화면이 나타나면 성공! 🎉

---

## 5단계: API 작동 확인

새 PowerShell 창을 열고:

```powershell
curl http://127.0.0.1:7860/sdapi/v1/sd-models
```

또는:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:7860/sdapi/v1/sd-models
```

JSON 응답이 나오면 API가 정상 작동 중입니다!

---

## 6단계: 이제 배치 생성 스크립트 실행!

PixelWindow 프로젝트 폴더로 이동:

```powershell
cd C:\Users\YourName\PixelWindow\prompts

# Python 패키지 설치
pip install requests pillow

# 배치 생성 실행
python batch_generate.py
```

---

## 🐛 트러블슈팅

### 문제 1: Python을 찾을 수 없음

**증상**:
```
Python was not found; run without arguments to install from the Microsoft Store
```

**해결**:
1. Python 3.10.6을 다시 설치
2. **반드시 "Add Python to PATH" 체크**
3. PowerShell 재시작

### 문제 2: Git을 찾을 수 없음

**증상**:
```
'git' is not recognized as an internal or external command
```

**해결**:
1. Git을 다시 설치
2. PowerShell 재시작

### 문제 3: 모델 다운로드 실패

**증상**:
```
Error downloading model...
```

**해결**:
1. 인터넷 연결 확인
2. VPN 사용 중이면 끄기
3. 방화벽 확인
4. 재시도: `.\webui-user.bat`

### 문제 4: CUDA/GPU 오류

**증상**:
```
CUDA out of memory
```

**해결**:

`webui-user.bat` 수정:
```bat
set COMMANDLINE_ARGS=--api --listen --medvram
```

또는 GPU 없이 CPU로 실행:
```bat
set COMMANDLINE_ARGS=--api --listen --skip-torch-cuda-test
```

### 문제 5: 포트 7860이 이미 사용 중

**증상**:
```
Port 7860 is already in use
```

**해결**:
- 다른 WebUI가 실행 중인지 확인
- 또는 다른 포트 사용:
  ```bat
  set COMMANDLINE_ARGS=--api --listen --port 7861
  ```

---

## 📁 최종 폴더 구조

```
C:\StableDiffusion\
└── stable-diffusion-webui\
    ├── webui-user.bat         ← 이 파일로 실행
    ├── models\
    │   └── Stable-diffusion\
    │       └── *.safetensors   ← AI 모델 파일
    ├── outputs\               ← 생성된 이미지
    └── ...

C:\Users\YourName\PixelWindow\
└── prompts\
    ├── batch_generate.py      ← 배치 생성 스크립트
    └── ...
```

---

## ✅ 설치 완료 체크리스트

- [ ] Python 3.10.6 설치 완료
- [ ] Git 설치 완료
- [ ] Stable Diffusion WebUI 클론 완료
- [ ] `webui-user.bat`에 `--api --listen` 추가
- [ ] WebUI 첫 실행 완료 (모델 다운로드)
- [ ] 브라우저에서 http://127.0.0.1:7860 접속 확인
- [ ] API 작동 확인
- [ ] `pip install requests pillow` 완료

---

## 🎯 다음 단계

설치가 완료되면:

1. WebUI를 **종료하지 말고** 계속 실행 상태 유지
2. 새 PowerShell 창 열기
3. PixelWindow 프로젝트로 이동
4. 배치 생성 스크립트 실행:
   ```powershell
   cd C:\Users\YourName\PixelWindow\prompts
   python batch_generate.py
   ```

---

## 💡 팁

### WebUI를 항상 백그라운드로 실행하기

매번 WebUI를 실행하는 게 번거롭다면:

1. 작업 스케줄러에 등록
2. 또는 시스템 시작 시 자동 실행 설정

### 더 빠른 생성을 위한 설정

`webui-user.bat`:
```bat
set COMMANDLINE_ARGS=--api --listen --xformers
```

xformers는 NVIDIA GPU에서 생성 속도를 크게 향상시킵니다.

---

천천히 따라 하시면 설치할 수 있습니다! 어느 단계에서 막히시면 말씀해주세요. 🚀
