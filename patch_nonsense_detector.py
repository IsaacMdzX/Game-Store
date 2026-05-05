import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

old_logic = "if (/asdf|qwer|zxcv|poiuy|lkjh|mnbv/i.test(compact)) return true;"

new_logic = """if (/asdf|qwer|zxcv|poiuy|lkjh|mnbv/i.test(compact)) return true;

        const ts = normalizedQuery.split(/\s+/).filter(Boolean);
        const hasAlphanumericGibberish = ts.some(token => {
            if (/\\b(ps4|ps5|xbox360|xboxone|2d|3d|mp3|mp4|4k|8k)\\b/i.test(token)) return false;
            return /[a-z]{2,}[0-9]+[a-z]{2,}/i.test(token) || /^[a-z]+[0-9]+[a-z]+$/i.test(token) || /^[0-9]+[a-z]+[0-9]+$/i.test(token);
        });
        if (hasAlphanumericGibberish) return true;"""

if old_logic in text:
    text = text.replace(old_logic, new_logic)
    print("Nonsense logic updated!")
else:
    print("WARNING: Could not find logic. Checking old logic...")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
