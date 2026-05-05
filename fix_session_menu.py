import re

with open('app/static/js/menu-system.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove "Precios" from suggestions
text = re.sub(r"\s*\{\s*label:\s*'Precios'\s*\},", "", text)

# 2. Update Welcome Message to remove "precios"
text = re.sub(
    r"pagos, pedidos, envíos, precios o encontrar productos", 
    "pagos, pedidos, envíos o encontrar productos", 
    text
)

# 3. Fix restoreConversationState logic
state_restoration = """    restoreConversationState() {
        // Detectar si fue un "refresh" duro o una navegación normal
        const isNavigationAPI = window.performance && window.performance.getEntriesByType;
        let isRefresh = false;
        
        if (isNavigationAPI) {
            const navEntries = window.performance.getEntriesByType("navigation");
            if (navEntries.length > 0 && navEntries[0].type === "reload") {
                isRefresh = true;
            }
        } else if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
            isRefresh = true;
        }
                          
        if (isRefresh) {
            // Limpiar todo si el usuario refrescó manualmente la pantalla
            sessionStorage.removeItem(this.sessionStorageKey);
            localStorage.removeItem(this.localStorageKey);
            window.name = '';
            this.isConversationClosed = false;
            return false;
        }

        try {"""

text = re.sub(r"restoreConversationState\(\)\s*\{.*?try\s*\{", state_restoration, text, flags=re.DOTALL)

with open('app/static/js/menu-system.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Session logic and menu option updated.")
