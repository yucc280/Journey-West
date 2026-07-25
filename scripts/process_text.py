import json
import os
import re
import jieba

output_dir = r"C:\javascript\work\journey-west-visualization\src\data"
txt_path = os.path.join(output_dir, "西游记-原文版.txt")

out_sentiment_path = os.path.join(output_dir, "chapterSentiment.json")
out_word_path = os.path.join(output_dir, "chapterWord.json")
out_raw_text_path = os.path.join(output_dir, "chapterRawText.json")

# NLP 词典与规则定义

# (1) 情感分析词典
positive_words = {
    "欢喜", "大喜", "欣然", "庆贺", "安康", "安稳", "喜乐", "团圆",
    "平安", "大悦", "快活", "顺遂", "吉祥", "欢悦", "安乐", "拜谢", "得胜", "慈悲"
}
negative_words = {
    "大怒", "悲啼", "啼哭", "死伤", "受难", "厮杀", "灾祸", "苦楚", "凶险",
    "痛哭", "惨败", "被困", "受伤", "惶恐", "凄惨", "祸患", "妖精", "妖怪", "性命"
}

# (2) 冲突度打斗词
fight_keywords = ["厮杀", "交战", "大战", "苦战", "交锋", "斗法", "鏖战", "兵器", "降伏", "施法"]

# (3) 增强版停用词表
stop_words = {
    "的", "了", "之", "也", "又", "乃", "这", "那", "何", "乎", "哉", "矣", "着", "过", "在", "与", "及",
    "那里", "怎么", "这个", "只是", "只见", "不得", "今日", "不曾", "闻言", "不知", "不是", "自家", "那个",
    "如此", "这般", "原来", "正是", "一个", "出来", "这里", "不敢", "不能", "不肯", "却说", "且说", "话说",
    "当时", "如今", "心中", "眼中", "分明", "渐渐", "忽然", "只管", "若是", "方才", "好个", "就是", "却被",
    "如何", "甚么", "什么", "两个", "几个", "看他", "他又", "声音", "变作", "叫道", "一个", "不知", "师父", "长老"
}

# (4) 角色与专有名词 (加载至 jieba 词库)
custom_words = [
    "孙悟空", "齐天大圣", "美猴王", "孙行者", "猪八戒", "猪悟能", "天蓬元帅", "沙和尚", "沙悟净", 
    "唐三藏", "唐僧", "白龙马", "观音菩萨", "如来佛祖", "太上老君", "玉皇大帝", "牛魔王", 
    "铁扇公主", "红孩儿", "白骨精", "金角大王", "银角大王", "金箍棒", "九齿钉耙", "芭蕉扇"
]
for kw in custom_words:
    jieba.add_word(kw)

# (5) 同义词映射表 
synonym_map = {
    "行者": "孙悟空", "悟空": "孙悟空", "孙行者": "孙悟空", "大圣": "孙悟空", "老孙": "孙悟空", "齐天大圣": "孙悟空", "美猴王": "孙悟空",
    "八戒": "八戒", "猪八戒": "八戒", "悟能": "八戒", "猪悟能": "八戒", "呆子": "八戒",
    "三藏": "唐僧", "唐三藏": "唐僧", "圣僧": "唐僧",
    "悟净": "沙僧", "沙和尚": "沙僧", "沙悟净": "沙僧",
    "菩萨": "观音菩萨"
}

# (6) 健壮的章节中文数字转换
chinese_num_map = {'零':0, '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9, '十':10, '百':100}

def cn_to_num(s):
    if s == "一百":
        return 100
    if s in chinese_num_map:
        return chinese_num_map[s]
    res = 0
    if "百" in s:
        parts = s.split("百")
        res += chinese_num_map.get(parts[0], 1) * 100
        s = parts[1]
    if "十" in s:
        idx = s.index("十")
        left = s[:idx]
        right = s[idx+1:]
        tens = chinese_num_map[left] if left else 1
        ones = chinese_num_map[right] if right else 0
        res += tens * 10 + ones
    elif s:
        res += chinese_num_map.get(s, 0)
    return res

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(txt_path, "r", encoding="utf-8") as f:
    full_text = f.read()

pattern = re.compile(r'第([一二三四五六七八九十百]+)回')
matches = list(pattern.finditer(full_text))

sentiment_result = []
word_result = []
raw_text_result = []

print(f"开始解析文本，共匹配到 {len(matches)} 话/回...\n")

for i, match in enumerate(matches):
    chap_cn = match.group(1)
    chap_num = cn_to_num(chap_cn)
    start_pos = match.end()
    end_pos = matches[i+1].start() if i < len(matches)-1 else len(full_text)
    
    content = full_text[start_pos:end_pos].strip()
    content_clean = re.sub(r'[^\u4e00-\u9fa5]', '', content)

    # A. 情感计算
    pos_count = sum(content_clean.count(w) for w in positive_words)
    neg_count = sum(content_clean.count(w) for w in negative_words)
    smoothed_score = (pos_count + 2) / (pos_count + neg_count + 4)
    sentiment_score = round(smoothed_score, 2)

    # B. 冲突强度计算
    conflict = 10
    for kw in fight_keywords:
        conflict += content_clean.count(kw) * 3
    conflict = min(max(conflict, 10), 100)

    # C. 分词与词频清理
    raw_words = jieba.lcut(content_clean)
    word_count = {}
    for w in raw_words:
        w = w.strip()
        if w in stop_words or len(w) < 2:
            continue
        w = synonym_map.get(w, w)  # 映射为标准名称
        word_count[w] = word_count.get(w, 0) + 1

    valid_words = [{"word": k, "count": v} for k, v in word_count.items()]
    valid_words.sort(key=lambda x: x["count"], reverse=True)

    # D. 提取原文预览 (前 500 字)
    preview = content[:500] + "..." if len(content) > 500 else content

    # 数据汇总
    sentiment_result.append({
        "chapter": chap_num,
        "sentimentScore": sentiment_score,
        "conflict": conflict
    })
    word_result.append({
        "chapter": chap_num,
        "wordList": valid_words
    })
    raw_text_result.append({
        "chapter": chap_num,
        "content": preview
    })

    print(f"✅ 第 {chap_num:03d} 回处理成功 | 情感分: {sentiment_score} | 冲突度: {conflict}")

# ===================== 4. 导出 JSON 数据文件 =====================
with open(out_sentiment_path, "w", encoding="utf-8") as f:
    json.dump(sentiment_result, f, ensure_ascii=False, indent=2)

with open(out_word_path, "w", encoding="utf-8") as f:
    json.dump(word_result, f, ensure_ascii=False, indent=2)

with open(out_raw_text_path, "w", encoding="utf-8") as f:
    json.dump(raw_text_result, f, ensure_ascii=False, indent=2)

print("\n🎉 全部处理完成！数据已重新清洗并覆盖生成。")