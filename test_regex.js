const message = "disponibilidad ESTUCHE PROTECTOR POWER A GRIS OSCURO".toLowerCase();
const searchRegex = /\b(tienes|busco|quiero|precio|cuanto|hay|disponible|disponibilidad|stock|que precio)\s+(de\s+)?(el|la|los|las)?\s*(juego|consola|control|accesorio)?\s*(.*?)$/i;
const match = message.match(searchRegex);
console.log(match);
