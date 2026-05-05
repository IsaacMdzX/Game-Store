import re

with open("app/static/js/menu-system.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Add "horarios" intent
old_agradecimiento = """            {
                id: 'agradecimiento',
                pattern: /\\b(gracias|muchas gracias|ok gracias|perfecto)\\b/,
                response: '¡Con gusto! Si quieres, sigo contigo para resolver lo que te falte.'
            }"""

new_agradecimiento_and_horario = """            {
                id: 'agradecimiento',
                pattern: /\\b(gracias|muchas gracias|ok gracias|perfecto)\\b/,
                response: '¡Con gusto! Si quieres, sigo contigo para resolver lo que te falte.'
            },
            {
                id: 'horarios',
                pattern: /\\b(horario|horarios|hora|horas|atencion|atención|cuando abren|cuando cierran)\\b/i,
                response: 'Nuestro horario de atención al cliente es de **Lunes a Viernes de 11:00 AM a 5:00 PM** 🕒.\\n\\n¡Estaremos encantados de ayudarte en ese horario!'
            }"""

if old_agradecimiento in text:
    text = text.replace(old_agradecimiento, new_agradecimiento_and_horario)
    print("Horarios intent added successfully!")
else:
    print("WARNING: Could not find agradecimiento intent to insert horarios.")

# 2. Add safe words to nonsense filter so words like "hora" are not rejected
old_unsafe = r"if (compact.length <= 4 && !/\b(si|no|ok|hey|hi|hola|holi|oye|che|va|ya)\b/i.test(normalizedQuery)) {"
new_unsafe = r"if (compact.length <= 4 && !/\b(si|no|ok|hey|hi|hola|holi|oye|che|va|ya|hora)\b/i.test(normalizedQuery)) {"

if old_unsafe in text:
    text = text.replace(old_unsafe, new_unsafe)
    print("Safe words for time added.")
else:
    print("WARNING: Could not find unsafe filter.")

with open("app/static/js/menu-system.js", "w", encoding="utf-8") as f:
    f.write(text)
