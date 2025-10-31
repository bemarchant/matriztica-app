// Mapeo de nombres de emociones a emojis
const emotionToEmoji: Record<string, string> = {
  alegría: "😊",
  miedo: "😨",
  rabia: "😠",
  tristeza: "😔",
  calma: "😌",
  ansiedad: "😰",
  esperanza: "✨",
  cansancio: "😴",
  reflexión: "🤔",
  fuerza: "💪",
  amor: "❤️",
  gratitud: "🙏",
};

/**
 * Extrae el emoji de un string de emoción.
 * Si el string ya contiene un emoji, lo devuelve.
 * Si solo contiene el nombre de la emoción, busca el emoji correspondiente.
 * Si no encuentra nada, devuelve un emoji por defecto.
 */
export function getEmojiForEmotion(emotionText: string): string {
  if (!emotionText) return "🙂";

  // Intentar extraer emoji del inicio del string
  const emojiMatch = emotionText.match(/^[\u{1F300}-\u{1F9FF}]/u);
  if (emojiMatch) {
    return emojiMatch[0];
  }

  // Si no hay emoji, buscar por nombre de emoción
  const lowerText = emotionText.toLowerCase().trim();
  
  // Buscar coincidencias exactas primero
  if (emotionToEmoji[lowerText]) {
    return emotionToEmoji[lowerText];
  }

  // Buscar coincidencias parciales (para casos como "mucha alegría", "ansiedad profunda", etc.)
  for (const [emotionName, emoji] of Object.entries(emotionToEmoji)) {
    if (lowerText.includes(emotionName)) {
      return emoji;
    }
  }

  // Si no se encuentra, devolver emoji por defecto
  return "🙂";
}

/**
 * Obtiene el texto sin emoji del campo de emoción.
 */
export function getEmotionNameWithoutEmoji(emotionText: string): string {
  if (!emotionText) return "";
  
  // Remover emoji del inicio si existe
  const withoutEmoji = emotionText.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, "").trim();
  
  // Si el string original no tenía emoji pero sí tenía texto, devolverlo
  return withoutEmoji || emotionText;
}

/**
 * Convierte un emoji a su nombre de emoción correspondiente.
 * Devuelve el formato "emoji nombre" para usarse en el formulario.
 */
export function getEmotionFromEmoji(emoji: string): string {
  const emojiToEmotion: Record<string, string> = {
    "😊": "alegría",
    "😨": "miedo",
    "😠": "rabia",
    "😔": "tristeza",
    "😌": "calma",
    "😰": "ansiedad",
    "✨": "esperanza",
    "😴": "cansancio",
    "🤔": "reflexión",
    "💪": "fuerza",
    "❤️": "amor",
    "🙏": "gratitud",
  };
  const name = emojiToEmotion[emoji];
  return name ? `${emoji} ${name}` : emoji;
}
