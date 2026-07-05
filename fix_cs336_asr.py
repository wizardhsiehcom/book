import os

f14 = "docs/cs336-language-modeling/14-data-pipeline-quality.md"
with open(f14, "r") as f: content = f.read()
content = content.replace("講者另提一篇稱 \"Omix\",名稱存疑", "這其實是 ASR 誤轉，指的應為同一篇 RegMix")
with open(f14, "w") as f: f.write(content)

f16 = "docs/cs336-language-modeling/16-post-training-rlvr.md"
with open(f16, "r") as f: content = f.read()
content = content.replace("counterfact QA，後者名稱存疑", "CounterFact")
with open(f16, "w") as f: f.write(content)

f18 = "docs/cs336-language-modeling/18-guest-lecture-dan-fu.md"
with open(f18, "r") as f: content = f.read()
content = content.replace("模型名在逐字稿中轉寫不一（PERS/parse/parade，本章記為 **Parse**，存疑）", "這項研究是 **Parcae**（Parcae: Scaling Laws for Stable Looped Language Models）")
content = content.replace("Parse 是他們對 **loop transformer** 的版本", "Parcae 是他們對 **looped transformer** 的版本")
content = content.replace("Parse 是", "Parcae 是")
with open(f18, "w") as f: f.write(content)

print("Fixed ASR placeholders in CS336.")
