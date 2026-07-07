const BACKTICK_IMAGE_RE = /`([^`]+\.(?:png|jpe?g|gif|webp))`/i;

export type SpeechImageResult = {
  cleanText: string;
  imageUrl: string | null;
};

/**
 * Detects backtick-wrapped image file paths in agent speech text and strips
 * them out. Image display is not supported in this fork (gateway media API
 * has been removed), so imageUrl is always null.
 */
export function extractSpeechImage(
  text: string | null | undefined,
  _agentId: string,
): SpeechImageResult {
  const raw = text?.trim() ?? "";
  if (!raw) return { cleanText: raw, imageUrl: null };

  // Strip all backtick-wrapped segments and tidy up leftover punctuation.
  const cleanText = raw
    .replace(/`[^`]+`/g, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/:\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();

  return { cleanText: cleanText || raw, imageUrl: null };
}
