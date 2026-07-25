# 结合原文txt加上标题
import json
import re
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

TXT_PATH = os.path.join(base_dir, "../public/data/西游记-原文版.txt")
EVENT_PATH = os.path.join(base_dir, "../public/data/events.json")
OUTPUT_PATH = os.path.join(base_dir, "../public/data/events_title.json")

# 1. 提取章节标题
with open(
    TXT_PATH,
    "r",
    encoding="utf-8"
) as f:
    text = f.read()

pattern = r"第([一二三四五六七八九十百]+)回\s+([^\n]+)"

matches = re.findall(
    pattern,
    text
)

print("找到章节数量:", len(matches))

# 中文数字转阿拉伯数字

num_map = {
    "一":1,
    "二":2,
    "三":3,
    "四":4,
    "五":5,
    "六":6,
    "七":7,
    "八":8,
    "九":9,
    "十":10,
    "百":100
}


def chinese_to_number(chinese):

    if chinese == "十":
        return 10

    if "百" in chinese:
        return 100

    if len(chinese) == 1:
        return num_map[chinese]

    if chinese.startswith("十"):
        return 10 + num_map[chinese[1]]

    if "十" in chinese:
        parts = chinese.split("十")

        return (
            num_map[parts[0]] * 10
            +
            (num_map[parts[1]]
             if parts[1] else 0)
        )

    return 0


chapter_titles = {}


for chapter_num, title in matches:

    num = chinese_to_number(chapter_num)

    chapter_titles[num] = title.strip()


print(
    "成功解析章节:",
    len(chapter_titles)
)

# 2. 读取events.json

with open(
    EVENT_PATH,
    "r",
    encoding="utf-8"
) as f:
    events = json.load(f)


# 3. 添加章节标题
for event in events:

    start = event["startChapter"]

    title = chapter_titles.get(
        start,
        "未知章节"
    )

    event["chapterTitle"] = title



# 4. 输出新的json
with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        events,
        f,
        ensure_ascii=False,
        indent=2
    )


print(
    "完成:",
    OUTPUT_PATH
)