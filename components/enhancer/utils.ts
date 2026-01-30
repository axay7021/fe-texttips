import { type EnhancedVersion, STYLE_ICONS } from './types';

/**
 * Parses the raw AI completion text into structured EnhancedVersion objects.
 * The text format is expected to be "Label:\nContent" blocks.
 */
export function parseEnhancementResult(completion: string): EnhancedVersion[] {
  if (!completion) return [];

  const styleKeys = Object.keys(STYLE_ICONS);

  // Regex matches: (Label):\n(Content) until next label or end
  // Pattern: (Professional|Friendly|...):\s*\n([content])
  // Using lookahead for next label or end of string
  const pattern = `(?:^|\\n)(${styleKeys.join('|')}):\\s*\\n([\\s\\S]*?)(?=(?:\\n(?:${styleKeys.join('|')}):)|$)`;
  const regex = new RegExp(pattern, 'gi');

  const versions: EnhancedVersion[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(completion)) !== null) {
    const titleRaw = match[1];
    const contentRaw = match[2].trim();

    // Find canonical key
    const key = styleKeys.find(
      (k) => k.toLowerCase() === titleRaw.toLowerCase(),
    );

    if (key && contentRaw) {
      versions.push({
        title: key,
        text: contentRaw,
        icon: STYLE_ICONS[key],
      });
    }
  }

  return versions;
}
