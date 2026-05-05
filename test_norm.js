function normalizeQuery(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Reduce 3 or more repeated chars to just 2 chars (e.g. jjj -> jj, aaa -> aa)
        // Actually for chat, people say "holaaaa". Let's reduce 3+ to 1.
        .replace(/([a-z])\1{2,}/g, '$1')
        // What about "holaa"? The regex above doesn't catch it.
        // Let's reduce 2+ repeated vowels at the end of a word:
        .replace(/([aeiou])\1+\b/g, '$1')
        // And "jajaja" -> "jajaja".
        .trim();
}

console.log(normalizeQuery("HOLA"));
console.log(normalizeQuery("HOLAaa"));
console.log(normalizeQuery("holaaaa"));
console.log(normalizeQuery("buenassss"));
console.log(normalizeQuery("queeee talll"));
