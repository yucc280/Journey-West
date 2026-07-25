import requests
from bs4 import BeautifulSoup
import json
import time
import os
import traceback

API_URL = "https://xiyouji.fandom.com/zh/api.php"
BASE_WIKI_URL = "https://xiyouji.fandom.com/zh/wiki/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_category_pages(category_name):
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": f"Category:{category_name}",
        "cmlimit": "max",
        "format": "json"
    }
    try:
        res = requests.get(API_URL, params=params, headers=HEADERS, timeout=10)
        data = res.json()
        members = data.get("query", {}).get("categorymembers", [])
        return [m["title"] for m in members]
    except Exception as e:
        print(f"获取分类 {category_name} 失败: {e}")
        return []

def get_character_detail(title):
    params = {
        "action": "parse",
        "page": title,
        "prop": "text|links|categories|images",
        "format": "json"
    }
    try:
        res = requests.get(API_URL, params=params, headers=HEADERS, timeout=10)
        data = res.json()
        if "parse" not in data:
            return None
        
        parse_data = data["parse"]
        html_content = parse_data["text"]["*"]
        links = [l["*"] for l in parse_data.get("links", []) if ":" not in l["*"]]
        categories = [c["*"] for c in parse_data.get("categories", [])]
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 简介
        paragraphs = soup.find_all('p')
        summary_text = ""
        for p in paragraphs:
            text = p.get_text(strip=True)
            if len(text) > 20:
                summary_text += text + "\n"
                if len(summary_text) > 200:
                    break
        summary = summary_text.strip() or f"{title}，《西游记》人物。"

        # Infobox
        infobox_data = {}
        infobox = soup.find('aside', class_='portable-infobox')
        if infobox:
            for item in infobox.find_all('div', class_='pi-item'):
                label = item.find('h3', class_='pi-data-label')
                value = item.find('div', class_='pi-data-value')
                if label and value:
                    infobox_data[label.get_text(strip=True)] = value.get_text(strip=True)

        # 完全默认雷达图，无任何人工预设
        radar_stats = {
            "战斗力": 60,
            "法力": 60,
            "智谋": 60,
            "背景": 50,
            "妖性/凶残": 50,
            "佛性/忠诚": 50
        }

        # 无人工补全，全部默认
        return {
            "name": title,
            "firstChapter": 0,            # 无数据就 0
            "location": "未知",            # 无数据就 未知
            "camp": "未知",                # 无数据就 未知
            "subCamp": "未知",             # 无数据就 未知
            "summary": summary,
            "infobox": infobox_data,
            "categories": categories,
            "related_links": links,
            "radar_stats": radar_stats
        }

    except Exception as e:
        print(f"解析 {title} 失败: {e}")
        return None

def main():
    print("=== 开始爬取西游记角色 ===")
    
    roles = get_category_pages("角色")
    monsters = get_category_pages("妖怪")
    all_titles = list(set(roles + monsters))
    print(f"共 {len(all_titles)} 个角色")

    characters = []
    relationships = []

    for idx, title in enumerate(all_titles[:50]):  # 可改数量
        print(f"[{idx+1}/{len(all_titles[:50])}] {title}")
        char = get_character_detail(title)
        if char:
            characters.append(char)
            for target in char["related_links"]:
                if target in all_titles and target != title:
                    relationships.append({
                        "source": title,
                        "target": target,
                        "type": "关联"
                    })
        time.sleep(0.3)

    output_data = {
        "characters": characters,
        "relationships": relationships
    }

    out_path = os.path.join(os.path.dirname(__file__), 'characters.json')
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"\n导出完成：{out_path}")

if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        input("按回车退出")
