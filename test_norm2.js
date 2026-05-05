function normalizeQuery(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/([a-z])\1{2,}/g, '$1') 
        .replace(/([aeious])\1+\b/g, '$1') 
        .trim();
}

console.log(normalizeQuery("HOLAA"));
console.log(normalizeQuery("quieroo"));
console.log(normalizeQuery("comentariosss"));
console.log(normalizeQuery("juego"));
console.log(normalizeQuery("pedidos"));
