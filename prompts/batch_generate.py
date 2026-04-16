#!/usr/bin/env python3
"""
PixelWindow 이미지 배치 생성 스크립트
Stable Diffusion WebUI API를 사용하여 모든 게임 이미지를 자동 생성합니다.

사용 전 준비:
1. Stable Diffusion WebUI를 --api 플래그로 실행
   예: ./webui.sh --api
   또는: webui-user.bat에 COMMANDLINE_ARGS=--api 추가

2. 의존성 설치:
   pip install requests pillow

3. 실행:
   python batch_generate.py
"""

import requests
import json
import base64
import os
import time
from typing import List, Dict

# ====== 설정 ======

# WebUI API 엔드포인트 (기본값)
API_URL = "http://127.0.0.1:7860"

# 출력 폴더
OUTPUT_DIR = "generated_images"

# 공통 생성 설정
DEFAULT_SETTINGS = {
    "steps": 30,                    # 생성 스텝 수 (20-50 권장)
    "cfg_scale": 7,                 # 프롬프트 충실도 (7-9 권장)
    "sampler_name": "DPM++ 2M Karras",  # 샘플러
    "seed": -1,                     # -1은 랜덤, 고정하려면 숫자 입력
    "batch_size": 1,                # 한번에 생성할 이미지 수
}

# 공통 네거티브 프롬프트
NEGATIVE_PROMPT = "background, gradient, complex, blurry, low quality, watermark, text, multiple objects, shadow, realistic photo, 3d render, jpeg artifacts"

# ====== 먹이 아이템 ======

FOOD_ITEMS = [
    {
        "filename": "bone.png",
        "output_path": "../assets/sprites/food/bone.png",
        "prompt": "cute pixel art dog bone icon, game asset, white bone, clean design, transparent background, centered, simple silhouette, 1024x1024, high quality, professional game sprite, flat design",
        "width": 1024,
        "height": 1024,
    },
    {
        "filename": "fish.png",
        "output_path": "../assets/sprites/food/fish.png",
        "prompt": "cute pixel art fish icon, game asset, fresh salmon, clean design, transparent background, centered, simple silhouette, 1024x1024, high quality, professional game sprite, flat design, whole fish",
        "width": 1024,
        "height": 1024,
    },
    {
        "filename": "meat.png",
        "output_path": "../assets/sprites/food/meat.png",
        "prompt": "cute pixel art premium meat icon, game asset, juicy steak, clean design, transparent background, centered, simple silhouette, 1024x1024, high quality, professional game sprite, flat design, red meat",
        "width": 1024,
        "height": 1024,
    },
    {
        "filename": "snack.png",
        "output_path": "../assets/sprites/food/snack.png",
        "prompt": "cute pixel art dog treat icon, game asset, dog biscuit, bone-shaped cookie, clean design, transparent background, centered, simple silhouette, 1024x1024, high quality, professional game sprite, flat design",
        "width": 1024,
        "height": 1024,
    },
    {
        "filename": "special.png",
        "output_path": "../assets/sprites/food/special.png",
        "prompt": "cute pixel art premium dog food icon, game asset, golden bowl with sparkles, magical glow, clean design, transparent background, centered, simple silhouette, 1024x1024, high quality, professional game sprite, flat design, luxury food",
        "width": 1024,
        "height": 1024,
    },
]

# ====== 액세서리 ======

ACCESSORIES = [
    # 모자
    {
        "filename": "red_hat.png",
        "output_path": "../assets/sprites/accessories/red_hat.png",
        "prompt": "cute pixel art red cap icon, game accessory, baseball cap, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design, simple hat",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "blue_hat.png",
        "output_path": "../assets/sprites/accessories/blue_hat.png",
        "prompt": "cute pixel art blue cap icon, game accessory, baseball cap, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design, simple hat",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "party_hat.png",
        "output_path": "../assets/sprites/accessories/party_hat.png",
        "prompt": "cute pixel art party hat icon, game accessory, cone-shaped celebration hat, colorful stripes, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    # 목걸이
    {
        "filename": "simple_necklace.png",
        "output_path": "../assets/sprites/accessories/simple_necklace.png",
        "prompt": "cute pixel art simple necklace icon, game accessory, basic collar, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "gold_necklace.png",
        "output_path": "../assets/sprites/accessories/gold_necklace.png",
        "prompt": "cute pixel art gold necklace icon, game accessory, shiny golden collar, sparkles, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    # 안경
    {
        "filename": "sunglasses.png",
        "output_path": "../assets/sprites/accessories/sunglasses.png",
        "prompt": "cute pixel art sunglasses icon, game accessory, cool shades, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design, dark lenses",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "round_glasses.png",
        "output_path": "../assets/sprites/accessories/round_glasses.png",
        "prompt": "cute pixel art round glasses icon, game accessory, circular spectacles, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    # 리본
    {
        "filename": "pink_ribbon.png",
        "output_path": "../assets/sprites/accessories/pink_ribbon.png",
        "prompt": "cute pixel art pink ribbon icon, game accessory, bow ribbon, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design, cute bow",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "red_ribbon.png",
        "output_path": "../assets/sprites/accessories/red_ribbon.png",
        "prompt": "cute pixel art red ribbon icon, game accessory, bow ribbon, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design, cute bow",
        "width": 512,
        "height": 512,
    },
    # 스카프
    {
        "filename": "blue_scarf.png",
        "output_path": "../assets/sprites/accessories/blue_scarf.png",
        "prompt": "cute pixel art blue scarf icon, game accessory, cozy scarf, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "yellow_scarf.png",
        "output_path": "../assets/sprites/accessories/yellow_scarf.png",
        "prompt": "cute pixel art yellow scarf icon, game accessory, bright scarf, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    # 나비 넥타이
    {
        "filename": "black_bow.png",
        "output_path": "../assets/sprites/accessories/black_bow.png",
        "prompt": "cute pixel art black bow tie icon, game accessory, formal bowtie, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
    {
        "filename": "red_bow.png",
        "output_path": "../assets/sprites/accessories/red_bow.png",
        "prompt": "cute pixel art red bow tie icon, game accessory, cute bowtie, clean design, transparent background, centered, 512x512, high quality, professional game sprite, flat design",
        "width": 512,
        "height": 512,
    },
]

# ====== 강아지 스프라이트 시트 ======
# 참고: 스프라이트 시트는 AI로 생성하기 어려우므로 수동 제작 권장
# 아래는 단일 강아지 이미지 생성 예시입니다.

DOG_SPRITE = {
    "filename": "dog_reference.png",
    "output_path": "../generated_images/dog_reference.png",
    "prompt": "cute pixel art dog sprite, shiba inu, side view facing right, standing pose, game asset, clean design, transparent background, centered, simple silhouette, 256x256, high quality, professional game sprite, flat design, kawaii style",
    "width": 256,
    "height": 256,
    "note": "이것은 참고용 단일 이미지입니다. 실제 스프라이트 시트(5x4 그리드)는 수동으로 제작하거나 ControlNet을 사용하세요."
}


# ====== 함수 ======

def check_api_connection():
    """WebUI API 연결 확인"""
    try:
        response = requests.get(f"{API_URL}/sdapi/v1/sd-models")
        if response.status_code == 200:
            models = response.json()
            print("✓ WebUI API 연결 성공!")
            if models:
                print(f"  사용 가능한 모델: {len(models)}개")
                print(f"  현재 모델: {models[0].get('model_name', 'Unknown')}")
            return True
        else:
            print("✗ WebUI API 연결 실패")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ WebUI API에 연결할 수 없습니다.")
        print("  WebUI가 --api 플래그로 실행 중인지 확인하세요.")
        print(f"  예상 URL: {API_URL}")
        return False


def generate_image(item: Dict) -> bool:
    """단일 이미지 생성"""
    print(f"\n{'='*60}")
    print(f"생성 중: {item['filename']}")
    print(f"프롬프트: {item['prompt'][:80]}...")
    print(f"{'='*60}")

    # 페이로드 구성
    payload = {
        "prompt": item["prompt"],
        "negative_prompt": NEGATIVE_PROMPT,
        "width": item["width"],
        "height": item["height"],
        **DEFAULT_SETTINGS
    }

    try:
        # API 호출
        response = requests.post(f"{API_URL}/sdapi/v1/txt2img", json=payload)

        if response.status_code == 200:
            result = response.json()

            # 이미지 디코딩
            image_data = base64.b64decode(result['images'][0])

            # 임시 폴더에 저장
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            temp_path = os.path.join(OUTPUT_DIR, item['filename'])

            with open(temp_path, 'wb') as f:
                f.write(image_data)

            print(f"✓ 생성 완료: {temp_path}")

            # 프로젝트 폴더에도 복사 (경로가 지정된 경우)
            if 'output_path' in item:
                output_path = os.path.join(os.path.dirname(__file__), item['output_path'])
                os.makedirs(os.path.dirname(output_path), exist_ok=True)

                with open(output_path, 'wb') as f:
                    f.write(image_data)

                print(f"✓ 복사 완료: {output_path}")

            return True
        else:
            print(f"✗ 생성 실패: HTTP {response.status_code}")
            print(f"  응답: {response.text[:200]}")
            return False

    except Exception as e:
        print(f"✗ 오류 발생: {str(e)}")
        return False


def batch_generate(items: List[Dict], category: str):
    """배치 생성"""
    print(f"\n{'#'*60}")
    print(f"# {category} 생성 시작 ({len(items)}개)")
    print(f"{'#'*60}")

    success_count = 0
    fail_count = 0

    for i, item in enumerate(items, 1):
        print(f"\n[{i}/{len(items)}]", end=" ")

        if generate_image(item):
            success_count += 1
        else:
            fail_count += 1

        # API 부하 방지를 위한 대기
        if i < len(items):
            print("\n대기 중... (3초)")
            time.sleep(3)

    print(f"\n{'='*60}")
    print(f"{category} 완료:")
    print(f"  성공: {success_count}개")
    print(f"  실패: {fail_count}개")
    print(f"{'='*60}")

    return success_count, fail_count


def main():
    """메인 함수"""
    print("="*60)
    print("PixelWindow 이미지 배치 생성 스크립트")
    print("="*60)

    # API 연결 확인
    if not check_api_connection():
        print("\n종료합니다.")
        return

    print("\n생성할 카테고리를 선택하세요:")
    print("1. 먹이 아이템만 (5개)")
    print("2. 액세서리만 (13개)")
    print("3. 강아지 참고 이미지 (1개)")
    print("4. 먹이 + 액세서리 (18개)")
    print("5. 모두 (19개)")

    choice = input("\n선택 (1-5): ").strip()

    total_success = 0
    total_fail = 0

    if choice == "1":
        s, f = batch_generate(FOOD_ITEMS, "먹이 아이템")
        total_success += s
        total_fail += f

    elif choice == "2":
        s, f = batch_generate(ACCESSORIES, "액세서리")
        total_success += s
        total_fail += f

    elif choice == "3":
        s, f = batch_generate([DOG_SPRITE], "강아지 참고 이미지")
        total_success += s
        total_fail += f

    elif choice == "4":
        s, f = batch_generate(FOOD_ITEMS, "먹이 아이템")
        total_success += s
        total_fail += f
        s, f = batch_generate(ACCESSORIES, "액세서리")
        total_success += s
        total_fail += f

    elif choice == "5":
        s, f = batch_generate(FOOD_ITEMS, "먹이 아이템")
        total_success += s
        total_fail += f
        s, f = batch_generate(ACCESSORIES, "액세서리")
        total_success += s
        total_fail += f
        s, f = batch_generate([DOG_SPRITE], "강아지 참고 이미지")
        total_success += s
        total_fail += f

    else:
        print("잘못된 선택입니다.")
        return

    # 최종 결과
    print("\n" + "="*60)
    print("전체 생성 완료!")
    print(f"  총 성공: {total_success}개")
    print(f"  총 실패: {total_fail}개")
    print(f"  출력 폴더: {OUTPUT_DIR}/")
    print("="*60)

    print("\n다음 단계:")
    print("1. generated_images/ 폴더에서 이미지 확인")
    print("2. 마음에 들지 않는 이미지는 설정 조정 후 재생성")
    print("3. 배경 제거가 필요한 경우:")
    print("   pip install rembg[gpu]")
    print("   rembg p generated_images/ transparent_images/")
    print("4. 최종 이미지를 assets/sprites/ 폴더로 이동")


if __name__ == "__main__":
    main()
