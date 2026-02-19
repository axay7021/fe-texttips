import { type EnhancedVersion, STYLE_ICONS } from '@/components/enhancer/types';

/**
 * Parses the raw AI completion text into structured EnhancedVersion objects.
 * Handles multiple formatting variations:
 * - "Label:\nContent" (normal)
 * - "Label: Content" (same line)
 * - "**Label:**\nContent" (markdown bold)
 * - Case insensitive matching
 */
export function parseEnhancementResult(completion: string): EnhancedVersion[] {
  if (!completion) return [];

  const styleKeys = Object.keys(STYLE_ICONS);

  // Clean up any markdown bold formatting: **Label:** → Label:
  const cleaned = completion.replace(/\*\*/g, '');

  const versions: EnhancedVersion[] = [];

  for (let i = 0; i < styleKeys.length; i++) {
    const currentKey = styleKeys[i];

    // Build regex to find "Label:" (case insensitive) and capture everything until next label or end
    // Supports both "Label:\n content" and "Label: content" (same line)
    const nextLabels = styleKeys
      .filter((k) => k.toLowerCase() !== currentKey.toLowerCase())
      .join('|');

    const labelPattern = nextLabels
      ? new RegExp(
          `${currentKey}:\\s*([\\s\\S]*?)(?=(?:${nextLabels}):|$)`,
          'i',
        )
      : new RegExp(`${currentKey}:\\s*([\\s\\S]*)$`, 'i');

    const match = labelPattern.exec(cleaned);

    if (match) {
      const content = match[1].trim();
      if (content) {
        versions.push({
          title: currentKey,
          text: content,
          icon: STYLE_ICONS[currentKey],
        });
      }
    }
  }

  return versions;
}
