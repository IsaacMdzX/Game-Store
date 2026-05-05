const lowerMsg = "cuanto cuestan los productos";
const searchRegex = /\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio|juego|juegos|consola|consolas|accesorio|accesorios|control|controles|producto|productos)\s+(de\s+|del\s+|el\s+|la\s+|los\s+|las\s+)?([\w\s\d-]{3,})$/i;
const match = lowerMsg.match(searchRegex);
console.log(match ? match[3] : null);

const isGeneralCategoryQuestion = /\b(que|qué|cuales|cuáles)\s+(producto|productos|juego|juegos|consola|consolas|venden|vendes)\b/i.test(lowerMsg) && !/\b(de)\b/.test(lowerMsg);
console.log("isgen", isGeneralCategoryQuestion);
