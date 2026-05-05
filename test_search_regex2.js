const lowerMsg = "precios";
const searchRegex = /\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio|juego|juegos|consola|consolas|accesorio|accesorios|control|controles|producto|productos)\s+(de\s+|del\s+|el\s+|la\s+|los\s+|las\s+)?([\w\s\d-]{3,})$/i;
const match = lowerMsg.match(searchRegex);
console.log("precios match[3]:", match ? match[3] : null);

const msg2 = "cuanto cuesta";
const match2 = msg2.match(searchRegex);
console.log("cuanto cuesta match[3]:", match2 ? match2[3] : null);
