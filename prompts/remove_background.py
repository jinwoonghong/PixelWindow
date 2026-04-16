#!/usr/bin/env python3
"""
배경 제거 스크립트
생성된 이미지의 배경을 자동으로 투명하게 만듭니다.

설치:
  pip install rembg[gpu]    # GPU 버전 (NVIDIA)
  # 또는
  pip install rembg         # CPU 버전

사용법:
  python remove_background.py

폴더 구조:
  generated_images/    ← 원본 이미지
  transparent_images/  ← 배경 제거된 이미지 (자동 생성)
"""

import os
import sys
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("❌ rembg 또는 PIL이 설치되지 않았습니다.")
    print("\n설치 방법:")
    print("  pip install rembg[gpu] pillow    # GPU 버전")
    print("  또는")
    print("  pip install rembg pillow          # CPU 버전")
    sys.exit(1)


def remove_background_from_folder(input_folder, output_folder):
    """폴더 내 모든 이미지의 배경 제거"""

    # 입력 폴더 확인
    if not os.path.exists(input_folder):
        print(f"❌ 입력 폴더가 없습니다: {input_folder}")
        return

    # 출력 폴더 생성
    os.makedirs(output_folder, exist_ok=True)

    # 처리할 이미지 파일 찾기
    image_extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    image_files = [
        f for f in os.listdir(input_folder)
        if Path(f).suffix.lower() in image_extensions
    ]

    if not image_files:
        print(f"❌ {input_folder}에 이미지 파일이 없습니다.")
        return

    print(f"📂 입력 폴더: {input_folder}")
    print(f"📂 출력 폴더: {output_folder}")
    print(f"🖼️  처리할 이미지: {len(image_files)}개\n")

    success_count = 0
    fail_count = 0

    for i, filename in enumerate(image_files, 1):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, Path(filename).stem + '.png')

        print(f"[{i}/{len(image_files)}] {filename}... ", end="", flush=True)

        try:
            # 이미지 읽기
            with open(input_path, 'rb') as f:
                input_data = f.read()

            # 배경 제거
            output_data = remove(input_data)

            # PNG로 저장
            with open(output_path, 'wb') as f:
                f.write(output_data)

            print("✅ 완료")
            success_count += 1

        except Exception as e:
            print(f"❌ 실패: {str(e)}")
            fail_count += 1

    print("\n" + "="*60)
    print("배경 제거 완료!")
    print(f"  성공: {success_count}개")
    print(f"  실패: {fail_count}개")
    print(f"  출력 폴더: {output_folder}/")
    print("="*60)


def main():
    """메인 함수"""
    print("="*60)
    print("배경 제거 스크립트")
    print("="*60)
    print()

    # 기본 경로
    default_input = "generated_images"
    default_output = "transparent_images"

    # 사용자 입력
    input_folder = input(f"입력 폴더 [{default_input}]: ").strip() or default_input
    output_folder = input(f"출력 폴더 [{default_output}]: ").strip() or default_output

    print()
    remove_background_from_folder(input_folder, output_folder)

    print("\n다음 단계:")
    print(f"1. {output_folder}/ 폴더에서 이미지 확인")
    print("2. 마음에 드는 이미지를 assets/sprites/ 폴더로 복사")


if __name__ == "__main__":
    main()
