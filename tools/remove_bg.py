# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "rembg[cpu]",
#   "Pillow",
#   "numpy",
# ]
# ///
"""
去背工具 — 使用 rembg (U²-Net) 移除圖片背景，輸出透明 PNG。
預設會套用 alpha 邊緣銳化，避免縮小顯示時看起來模糊。

用法:
  uv run tools/remove_bg.py                               # 預設路徑
  uv run tools/remove_bg.py input.png output.png          # 指定輸出
  uv run tools/remove_bg.py input.png out.png --width 480 # 縮至 480px 寬
  uv run tools/remove_bg.py input.png out.png --no-sharpen
"""

import sys
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

DEFAULT_INPUT = Path("docs/assets/characters/raster/samurai.png")


def clean_artifacts(img: Image.Image, min_alpha: int = 12) -> Image.Image:
    """
    去除去背後殘留的雜點像素：
    1. Median filter (3×3) 消除孤立雜點
    2. 把 alpha < min_alpha 的像素完全透明化
    """
    r, g, b, a = img.split()
    a = a.filter(ImageFilter.MedianFilter(size=3))
    a_arr = np.array(a, dtype=np.uint8)
    a_arr[a_arr < min_alpha] = 0
    return Image.merge("RGBA", (r, g, b, Image.fromarray(a_arr)))


def sharpen_alpha(img: Image.Image, steepness: float = 6.0, midpoint: int = 128) -> Image.Image:
    """
    對 alpha 通道套用 sigmoid 曲線，讓半透明邊緣變清晰。
    steepness: 越高邊緣越硬（建議 4–10）
    midpoint:  alpha 分水嶺（0–255），預設 128
    """
    r, g, b, a = img.split()
    arr = np.array(a, dtype=np.float32)
    # sigmoid: f(x) = 255 / (1 + exp(-k*(x - m)/255))
    k = steepness
    m = midpoint / 255.0
    arr_norm = arr / 255.0
    sharpened = 255.0 / (1.0 + np.exp(-k * (arr_norm - m)))
    return Image.merge("RGBA", (r, g, b, Image.fromarray(sharpened.astype(np.uint8))))


def remove_bg(
    input_path: Path,
    output_path: Path,
    do_sharpen: bool = True,
    target_width: int | None = None,
) -> None:
    print(f"  輸入: {input_path}  ({input_path.stat().st_size // 1024} KB)")

    session = new_session("u2net")
    with input_path.open("rb") as f:
        raw = remove(f.read(), session=session)

    img = Image.open(BytesIO(raw)).convert("RGBA")

    if target_width and img.width > target_width:
        ratio = target_width / img.width
        new_size = (target_width, int(img.height * ratio))
        print(f"  縮圖: {img.size[0]}×{img.size[1]} → {new_size[0]}×{new_size[1]}")
        img = img.resize(new_size, Image.LANCZOS)

    print("  清除雜點 (median filter + alpha threshold)...")
    img = clean_artifacts(img)

    if do_sharpen:
        print("  銳化 alpha 邊緣 (sigmoid, steepness=6)...")
        img = sharpen_alpha(img)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, format="PNG", optimize=True)

    size_kb = output_path.stat().st_size // 1024
    print(f"  輸出: {output_path}  ({size_kb} KB, {img.size[0]}×{img.size[1]}, {img.mode})")


def main() -> None:
    positional = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags      = sys.argv[1:]

    do_sharpen   = "--no-sharpen" not in flags
    target_width: int | None = None
    for i, f in enumerate(flags):
        if f == "--width" and i + 1 < len(flags):
            target_width = int(flags[i + 1])

    if len(positional) == 0:
        input_path  = DEFAULT_INPUT
        output_path = DEFAULT_INPUT
    elif len(positional) == 1:
        input_path  = Path(positional[0])
        output_path = Path(positional[0])
    else:
        input_path  = Path(positional[0])
        output_path = Path(positional[1])

    if not input_path.exists():
        print(f"[錯誤] 找不到檔案: {input_path}", file=sys.stderr)
        sys.exit(1)

    print(f"去背中{'（含縮圖 ' + str(target_width) + 'px）' if target_width else ''}{'（含 alpha 銳化）' if do_sharpen else ''}...")
    remove_bg(input_path, output_path, do_sharpen=do_sharpen, target_width=target_width)
    print("完成。")


if __name__ == "__main__":
    main()
