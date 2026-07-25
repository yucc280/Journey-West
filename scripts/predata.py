# csv文件转json文件
import pandas as pd
import json
import os

# 拿到当前脚本文件所在文件夹
base_dir = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(base_dir, "../public/data/trials.csv")
json_path = os.path.join(base_dir, "../public/data/events.json")

df = pd.read_csv(csv_path)

df = df.dropna(how="all")
df = df.drop_duplicates(subset=["编号"])

df["开始回目"] = pd.to_numeric(df["开始回目"], errors="coerce")
df["结束回目"] = pd.to_numeric(df["结束回目"], errors="coerce")

df = df[
    df["开始回目"].between(1, 100)
    & df["结束回目"].between(1, 100)
    & (df["开始回目"] <= df["结束回目"])
]

def split_characters(value):
    if pd.isna(value):
        return []

    value = str(value)
    value = value.replace("、", "|").replace(",", "|").replace("，", "|")

    return [
        name.strip()
        for name in value.split("|")
        if name.strip()
    ]

df["主要人物"] = df["主要人物"].apply(split_characters)


df["持续回目数"] = df["结束回目"] - df["开始回目"] + 1

df["人物数量"] = df["主要人物"].apply(len)

def get_stage(chapter):
    if chapter <= 12:
        return "取经缘起"
    elif chapter <= 22:
        return "师徒集结"
    return "漫长历险"

df["阶段"] = df["开始回目"].apply(get_stage)


records = []

for _, row in df.iterrows():
    records.append({
        "id": int(row["编号"]),
        "name": row["名称"],
        "startChapter": int(row["开始回目"]),
        "endChapter": int(row["结束回目"]),
        "duration": int(row["持续回目数"]),
        "location": row["地点"],
        "type": row["劫难类型"],
        "summary": row["简介"],
        "characters": row["主要人物"],
        "characterCount": int(row["人物数量"]),
        "stage": row["阶段"],
        "longitude": float(row["经度"]) if pd.notna(row["经度"]) else None,
        "latitude": float(row["纬度"]) if pd.notna(row["纬度"]) else None
    })

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)
