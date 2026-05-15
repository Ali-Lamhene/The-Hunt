/**
 * Design System Typography - "The Hunt: Jungle Expedition"
 * Mixing Serif for journals and Display for equipment markings.
 */

export const Typography = {
  family: {
    title: 'Arvo_700Bold',        // Display / Crate / Ruins
    body: 'CrimsonText_400Regular', // Journal / Handwritten
    bodyBold: 'CrimsonText_700Bold',
    mono: 'monospace',            // Compass / Timers
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    huge: 48,
  },
  weight: {
    regular: '400' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  }
};
